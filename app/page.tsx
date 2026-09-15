'use client';

import React, { useState, useEffect, useCallback } from 'react';

const TEAM_MEMBERS = [
  'Prithvin',
  'Sreerag Belraj',
  'Aldrin',
  'Sreerag S',
];

// Cross-browser Fullscreen helper utilities
const getFullscreenElement = (): Element | null => {
  if (typeof document === 'undefined') return null;
  const doc = document as unknown as {
    fullscreenElement?: Element;
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
  };
  return (
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null
  );
};

const enterNativeFullscreen = async (element: HTMLElement = document.documentElement): Promise<void> => {
  const el = element as unknown as {
    requestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  };

  if (typeof el.requestFullscreen === 'function') {
    return el.requestFullscreen();
  } else if (typeof el.webkitRequestFullscreen === 'function') {
    return el.webkitRequestFullscreen();
  } else if (typeof el.mozRequestFullScreen === 'function') {
    return el.mozRequestFullScreen();
  } else if (typeof el.msRequestFullscreen === 'function') {
    return el.msRequestFullscreen();
  }
  throw new Error('Fullscreen API not supported');
};

const exitNativeFullscreen = async (): Promise<void> => {
  const doc = document as unknown as {
    exitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  };

  if (typeof doc.exitFullscreen === 'function') {
    return doc.exitFullscreen();
  } else if (typeof doc.webkitExitFullscreen === 'function') {
    return doc.webkitExitFullscreen();
  } else if (typeof doc.mozCancelFullScreen === 'function') {
    return doc.mozCancelFullScreen();
  } else if (typeof doc.msExitFullscreen === 'function') {
    return doc.msExitFullscreen();
  }
};

export default function HackathonRevealPage() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSimulatedFullscreen, setIsSimulatedFullscreen] = useState(false);
  const [fullscreenNotice, setFullscreenNotice] = useState<string | null>(null);

  // Sync fullscreen state with native browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const activeEl = getFullscreenElement();
      setIsFullscreen(Boolean(activeEl) || isSimulatedFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isSimulatedFullscreen]);

  // Soft cinematic sub-bass/chime sweep on reveal - lengthened to match 1.8s visual choreography
  const playCinematicAudio = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.9);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.75);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch {
      // Audio is non-blocking and completely optional
    }
  }, []);

  // Soft warm tone when button appears - extended to 0.6s
  const playButtonAppearAudio = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio is non-blocking and completely optional
    }
  }, []);

  const handleReveal = useCallback(() => {
    playCinematicAudio();
    setIsRevealed(true);
  }, [playCinematicAudio]);

  const handleReset = useCallback(() => {
    setIsRevealed(false);
    setIsButtonVisible(false);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const activeEl = getFullscreenElement();

    if (activeEl || isSimulatedFullscreen) {
      // Exit fullscreen
      try {
        if (activeEl) {
          await exitNativeFullscreen();
        }
      } catch {
        // Fallback
      }
      setIsSimulatedFullscreen(false);
      setIsFullscreen(false);
    } else {
      // Request fullscreen
      try {
        await enterNativeFullscreen(document.documentElement);
        setIsFullscreen(true);
      } catch {
        // If native fullscreen is blocked by browser/iframe permissions, activate simulated viewport fullscreen
        setIsSimulatedFullscreen(true);
        setIsFullscreen(true);
        setFullscreenNotice('Native fullscreen restricted — using Full Viewport mode. (Press F11 for hardware fullscreen)');
        setTimeout(() => setFullscreenNotice(null), 3500);
      }
    }
  }, [isSimulatedFullscreen]);

  // Keyboard shortcut handlers for film crew convenience
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'r' || e.key === 'R' || e.key === 'Backspace') {
        handleReset();
      } else if (e.key === 'Escape') {
        if (isSimulatedFullscreen) {
          setIsSimulatedFullscreen(false);
          setIsFullscreen(false);
        } else {
          handleReset();
        }
      } else if (e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (!isRevealed) {
          if (!isButtonVisible) {
            // First space press: show the "Reveal Results" button
            playButtonAppearAudio();
            setIsButtonVisible(true);
          } else {
            // Second space press: reveal the winners
            handleReveal();
          }
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, isButtonVisible, isSimulatedFullscreen, handleReset, handleReveal, playButtonAppearAudio, toggleFullscreen]);

  return (
    <main className={`main-viewport ${isSimulatedFullscreen ? 'simulated-fullscreen' : ''}`}>
      {/* Dynamic Ambient Background */}
      <div className="ambient-background">
        <div className="ambient-grid" />
        <div className={`glow-orb ${isRevealed ? 'winner-state' : ''}`} />
      </div>

      {/* Film Vignette Border */}
      <div className="filmic-vignette" />

      {/* Toast Notice if native fullscreen is blocked */}
      {fullscreenNotice && (
        <div className="fullscreen-toast" role="status">
          {fullscreenNotice}
        </div>
      )}

      {/* SCREEN 1: Initial Static Landing Poster */}
      {!isRevealed ? (
        <section
          key="screen-landing"
          className="screen-container screen-fade"
          aria-label="Hackathon Introduction"
        >
          {/* Eyebrow */}
          <div className="eyebrow-badge">
            <span className="status-dot" />
            <span>RCSS — DEPARTMENT OF COMPUTER SCIENCE PRESENTS</span>
          </div>

          {/* Main Title */}
          <h1 className="hackathon-title">HACK-A-THON</h1>

          {/* Subtitle */}
          <p className="hackathon-subtitle">Day 1 — Ideation Phase Results</p>

          {/* Reveal Button Slot - Button appears on first Space press */}
          <div className="button-slot">
            {isButtonVisible && (
              <button
                id="reveal-results-button"
                type="button"
                onClick={handleReveal}
                className="reveal-btn button-entrance"
                autoFocus
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Reveal Results</span>
              </button>
            )}
          </div>
        </section>
      ) : (
        /* SCREEN 2: Winner Reveal Screen */
        <section
          key="screen-winner"
          className="screen-container screen-fade"
          aria-label="Winner Results Announcement"
        >
          {/* Category / Phase Badge */}
          <div className="winner-badge">
            <span className="star-icon">★</span>
            <span>WINNER — IDEATION PHASE</span>
            <span className="star-icon">★</span>
          </div>

          {/* Team Name - Primary Focal Point */}
          <h1 className="team-title">TEAM 5</h1>

          {/* 4 Team Members Grid */}
          <div className="team-members-container">
            {TEAM_MEMBERS.map((name, index) => (
              <div key={name} className="member-card">
                <span className="member-number">MEMBER 0{index + 1}</span>
                <span className="member-name">{name}</span>
              </div>
            ))}
          </div>

          {/* Congratulatory line */}
          <div className="congrats-line">
            <span>✨</span>
            <span>Congratulations!</span>
            <span>✨</span>
          </div>
        </section>
      )}

      {/* Filmmaking Retake Controls & Shortcuts */}
      <div className="director-bar" title="Production Retake Controls">
        {(isRevealed || isButtonVisible) && (
          <button
            id="reset-button"
            type="button"
            onClick={handleReset}
            className="director-btn"
            title="Reset to initial poster for retake (Shortcut: R)"
          >
            ↺ Reset Screen [R]
          </button>
        )}
        <button
          id="fullscreen-toggle-btn"
          type="button"
          onClick={toggleFullscreen}
          className="director-btn"
          title="Toggle Fullscreen (Shortcut: F11 or F)"
        >
          {isFullscreen ? 'Exit Fullscreen' : '⛶ Fullscreen [F]'}
        </button>
      </div>
    </main>
  );
}
