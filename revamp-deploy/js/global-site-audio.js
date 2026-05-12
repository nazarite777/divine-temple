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
    style.textContent = '\n      #eden-global-audio-ui {\n        position: fixed;\n        right: 16px;\n        bottom: 16px;\n        z-index: 2147483000;\n      }\n      #eden-global-audio-ui .ega-btn {\n        width: 52px;\n        height: 52px;\n        border-radius: 999px;\n        border: 1px solid rgba(201,168,76,0.6);\n        background: rgba(6,12,8,0.94);\n        color: #f5edd7;\n        font-size: 20px;\n        line-height: 1;\n        display: grid;\n        place-items: center;\n        cursor: pointer;\n        box-shadow: 0 10px 28px rgba(0,0,0,0.45);\n        backdrop-filter: blur(8px);\n        padding: 0;\n      }\n      #eden-global-audio-ui .ega-btn:hover {\n        background: rgba(201,168,76,0.16);\n      }\n      @media (max-width: 720px) {\n        #eden-global-audio-ui {\n          right: 12px;\n          bottom: 12px;\n        }\n        #eden-global-audio-ui .ega-btn {\n          width: 48px;\n          height: 48px;\n          font-size: 18px;\n        }\n      }\n    ';
    document.head.appendChild(style);

    const ui = document.createElement('div');
    ui.id = 'eden-global-audio-ui';
    ui.innerHTML = '<button type="button" class="ega-btn" aria-label="Play audio" title="Play audio">▶</button>';
    document.body.appendChild(ui);
    return ui;
  }

  function bootstrap() {
    consumeHandoff();

    const state = getState();
    const ui = injectUI();
    if (!ui) return;

    const btnEl = ui.querySelector('.ega-btn');

    const audio = document.createElement('audio');
    audio.preload = 'auto';
    audio.src = state.src;

    if (state.currentTime > 0) {
      audio.currentTime = state.currentTime;
    }

    function render(nextState) {
      const s = nextState || getState();
      btnEl.textContent = s.isPlaying ? '■' : '▶';
      btnEl.setAttribute('aria-label', s.isPlaying ? 'Stop audio' : 'Play audio');
      btnEl.setAttribute('title', s.isPlaying ? 'Stop audio' : 'Play audio');
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
