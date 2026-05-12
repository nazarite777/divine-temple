(function () {
  const STORAGE_KEY = 'edenGlobalAudioState';
  const HANDOFF_KEY = 'edenSplashAudioHandoff';
  const DEFAULT_SRC = 'https://firebasestorage.googleapis.com/v0/b/sacred-community.firebasestorage.app/o/audio%2FThe%20Walk%20Back%20to%20Eden%20(Remastered).mp3?alt=media&token=9c87b443-fce3-43df-ada9-b0cb879419df';
  const DEFAULT_TITLE = 'The Walk Back to Eden';

  let pendingGestureResume = false;

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch (_) {
      return null;
    }
  }

  function getState() {
    const state = safeParse(localStorage.getItem(STORAGE_KEY));
    if (!state || typeof state !== 'object') {
      return {
        src: DEFAULT_SRC,
        title: DEFAULT_TITLE,
        currentTime: 0,
        isPlaying: false,
        ts: Date.now()
      };
    }

    return {
      src: state.src || DEFAULT_SRC,
      title: state.title || DEFAULT_TITLE,
      currentTime: Number.isFinite(Number(state.currentTime)) ? Number(state.currentTime) : 0,
      isPlaying: !!state.isPlaying,
      ts: Number.isFinite(Number(state.ts)) ? Number(state.ts) : Date.now()
    };
  }

  function setState(partial) {
    const next = Object.assign({}, getState(), partial, { ts: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function consumeHandoff() {
    const handoff = safeParse(sessionStorage.getItem(HANDOFF_KEY));
    if (!handoff || !handoff.src) return;

    setState({
      src: handoff.src,
      title: DEFAULT_TITLE,
      currentTime: Number.isFinite(Number(handoff.time)) ? Number(handoff.time) : 0,
      isPlaying: !!handoff.shouldResume
    });

    sessionStorage.removeItem(HANDOFF_KEY);
  }

  function injectUI() {
    if (document.getElementById('eden-global-audio-ui')) return null;

    const style = document.createElement('style');
    style.id = 'eden-global-audio-style';
    style.textContent = '\n      #eden-global-audio-ui {\n        position: fixed;\n        right: 16px;\n        bottom: 16px;\n        z-index: 2147483000;\n        display: flex;\n        align-items: center;\n        gap: 10px;\n        padding: 10px 12px;\n        border: 1px solid rgba(201,168,76,0.45);\n        background: rgba(6,12,8,0.94);\n        color: #f5edd7;\n        backdrop-filter: blur(8px);\n        box-shadow: 0 8px 24px rgba(0,0,0,0.35);\n        font-family: Georgia, serif;\n      }\n      #eden-global-audio-ui .ega-dot {\n        width: 8px;\n        height: 8px;\n        border-radius: 999px;\n        background: #c9a84c;\n        opacity: 0.9;\n      }\n      #eden-global-audio-ui .ega-title {\n        font-size: 12px;\n        letter-spacing: 0.03em;\n        white-space: nowrap;\n        max-width: 180px;\n        overflow: hidden;\n        text-overflow: ellipsis;\n      }\n      #eden-global-audio-ui .ega-btn {\n        border: 1px solid rgba(201,168,76,0.45);\n        background: rgba(201,168,76,0.1);\n        color: #f5edd7;\n        font-size: 11px;\n        letter-spacing: 0.08em;\n        text-transform: uppercase;\n        padding: 6px 10px;\n        cursor: pointer;\n      }\n      #eden-global-audio-ui .ega-btn:hover {\n        background: rgba(201,168,76,0.22);\n      }\n      @media (max-width: 720px) {\n        #eden-global-audio-ui {\n          left: 10px;\n          right: 10px;\n          bottom: 10px;\n          justify-content: space-between;\n        }\n        #eden-global-audio-ui .ega-title {\n          max-width: 56vw;\n        }\n      }\n    ';
    document.head.appendChild(style);

    const ui = document.createElement('div');
    ui.id = 'eden-global-audio-ui';
    ui.innerHTML = '<span class="ega-dot"></span><span class="ega-title"></span><button type="button" class="ega-btn">Play</button>';
    document.body.appendChild(ui);
    return ui;
  }

  function bootstrap() {
    consumeHandoff();

    const state = getState();
    const ui = injectUI();
    if (!ui) return;

    const titleEl = ui.querySelector('.ega-title');
    const btnEl = ui.querySelector('.ega-btn');

    const audio = document.createElement('audio');
    audio.preload = 'auto';
    audio.src = state.src;

    if (state.currentTime > 0) {
      audio.currentTime = state.currentTime;
    }

    function render(nextState) {
      const s = nextState || getState();
      titleEl.textContent = s.title || DEFAULT_TITLE;
      btnEl.textContent = s.isPlaying ? 'Stop' : 'Play';
    }

    function playWithState(next) {
      const stateToPlay = next || getState();
      if (audio.src !== stateToPlay.src) {
        audio.src = stateToPlay.src;
      }
      if (Math.abs(audio.currentTime - stateToPlay.currentTime) > 1.5) {
        audio.currentTime = Math.max(0, stateToPlay.currentTime || 0);
      }

      const attempt = audio.play();
      if (attempt && typeof attempt.then === 'function') {
        return attempt.then(function () {
          pendingGestureResume = false;
          const latest = setState({
            src: stateToPlay.src,
            title: stateToPlay.title,
            isPlaying: true,
            currentTime: audio.currentTime
          });
          render(latest);
          return true;
        }).catch(function () {
          pendingGestureResume = true;
          const latest = setState({ isPlaying: true });
          render(latest);
          return false;
        });
      }

      const latest = setState({ isPlaying: true, currentTime: audio.currentTime });
      render(latest);
      return Promise.resolve(true);
    }

    function stopPlayback() {
      audio.pause();
      const latest = setState({ isPlaying: false, currentTime: audio.currentTime });
      render(latest);
    }

    btnEl.addEventListener('click', function () {
      const s = getState();
      if (s.isPlaying) {
        stopPlayback();
      } else {
        playWithState(s);
      }
    });

    audio.addEventListener('timeupdate', function () {
      if (!audio.paused && !audio.ended) {
        setState({ currentTime: audio.currentTime, isPlaying: true });
      }
    });

    audio.addEventListener('ended', function () {
      const latest = setState({ isPlaying: false, currentTime: 0 });
      render(latest);
    });

    function retryFromGesture() {
      if (!pendingGestureResume) return;
      playWithState(getState());
    }

    document.addEventListener('pointerdown', retryFromGesture, { passive: true });
    document.addEventListener('keydown', retryFromGesture);

    window.edenTempleAudio = {
      play: function (opts) {
        const next = setState({
          src: (opts && opts.src) || getState().src || DEFAULT_SRC,
          title: (opts && opts.title) || DEFAULT_TITLE,
          currentTime: Number.isFinite(Number(opts && opts.currentTime)) ? Number(opts.currentTime) : getState().currentTime,
          isPlaying: true
        });
        return playWithState(next);
      },
      stop: function () {
        stopPlayback();
      },
      getState: getState
    };

    render(state);
    if (state.isPlaying) {
      playWithState(state);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
