import { useCallback, useRef, useState } from 'react';

type SoundType = 'launch' | 'correct' | 'wrong' | 'celebration' | 'click' | 'reveal';

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playLaunchSound = () => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.8);
  
  setTimeout(() => {
    playTone(600, 0.3, 'sine', 0.2);
    setTimeout(() => playTone(800, 0.3, 'sine', 0.2), 100);
    setTimeout(() => playTone(1000, 0.5, 'sine', 0.3), 200);
  }, 300);
};

const playCorrectSound = () => {
  playTone(523, 0.1, 'sine', 0.3);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.3), 100);
  setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);
};

const playWrongSound = () => {
  playTone(200, 0.15, 'square', 0.2);
  setTimeout(() => playTone(150, 0.3, 'square', 0.2), 150);
};

const playCelebrationSound = () => {
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.15, 'sine', 0.25), i * 80);
  });
  setTimeout(() => {
    playTone(784, 0.1, 'sine', 0.3);
    setTimeout(() => playTone(988, 0.1, 'sine', 0.3), 100);
    setTimeout(() => playTone(1175, 0.3, 'sine', 0.4), 200);
  }, 700);
};

const playClickSound = () => {
  playTone(800, 0.05, 'sine', 0.2);
};

const playRevealSound = () => {
  playTone(400, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(500, 0.1, 'sine', 0.25), 80);
  setTimeout(() => playTone(600, 0.15, 'sine', 0.3), 160);
};

const soundMap: Record<SoundType, () => void> = {
  launch: playLaunchSound,
  correct: playCorrectSound,
  wrong: playWrongSound,
  celebration: playCelebrationSound,
  click: playClickSound,
  reveal: playRevealSound,
};

export function useSound() {
  const [enabled, setEnabled] = useState(true);
  
  const play = useCallback((sound: SoundType) => {
    if (!enabled || !audioContext) return;
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    soundMap[sound]?.();
  }, [enabled]);
  
  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);
  
  return { play, enabled, toggle, setEnabled };
}

export type { SoundType };
