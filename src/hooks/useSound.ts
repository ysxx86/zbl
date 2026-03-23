import { useCallback, useRef, useState } from 'react';

type SoundType = 'launch' | 'correct' | 'wrong' | 'celebration' | 'click' | 'reveal';

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

// 高级音效生成器
const createReverb = () => {
  if (!audioContext) return null;
  const convolver = audioContext.createConvolver();
  const rate = audioContext.sampleRate;
  const length = rate * 1.5;
  const impulse = audioContext.createBuffer(2, length, rate);
  
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-3 * i / length);
      channelData[i] = (Math.random() * 2 - 1) * decay * 0.5;
    }
  }
  convolver.buffer = impulse;
  return convolver;
};

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3, attack: number = 0.01, release: number = 0.1) => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  // 添加滤波器让声音更柔和
  filter.type = 'lowpass';
  filter.frequency.value = 2000;
  filter.Q.value = 1;
  
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + release);
  
  oscillator.start(now);
  oscillator.stop(now + duration + release);
};

const playLaunchSound = () => {
  if (!audioContext) return;
  
  // 飞船发射：低频轰鸣 + 上升音调 + 粒子嘶嘶声
  const now = audioContext.currentTime;
  
  // 主引擎轰鸣
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  const filter1 = audioContext.createBiquadFilter();
  
  filter1.type = 'lowpass';
  filter1.frequency.value = 800;
  
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(60, now);
  osc1.frequency.exponentialRampToValueAtTime(400, now + 0.8);
  
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.25, now + 0.1);
  gain1.gain.setValueAtTime(0.25, now + 0.5);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  
  osc1.connect(filter1);
  filter1.connect(gain1);
  gain1.connect(audioContext.destination);
  
  osc1.start(now);
  osc1.stop(now + 1.2);
  
  // 高频嘶嘶声（粒子喷射感）
  const noise = audioContext.createOscillator();
  const noiseGain = audioContext.createGain();
  const noiseFilter = audioContext.createBiquadFilter();
  
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 3000;
  noiseFilter.Q.value = 2;
  
  noise.type = 'square';
  noise.frequency.value = 80;
  
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
  noiseGain.gain.setValueAtTime(0.08, now + 0.6);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
  
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioContext.destination);
  
  noise.start(now);
  noise.stop(now + 0.9);
  
  // 穿越音效（上升调）
  setTimeout(() => {
    playTone(500, 0.15, 'sine', 0.15, 0.02, 0.1);
    setTimeout(() => playTone(700, 0.15, 'sine', 0.18, 0.02, 0.1), 60);
    setTimeout(() => playTone(900, 0.2, 'sine', 0.22, 0.02, 0.15), 120);
    setTimeout(() => playTone(1200, 0.3, 'sine', 0.2, 0.02, 0.2), 180);
  }, 400);
};

const playCorrectSound = () => {
  // 正确音效：清脆的上升和弦
  playTone(523, 0.12, 'sine', 0.18, 0.01, 0.08);
  setTimeout(() => playTone(659, 0.12, 'sine', 0.22, 0.01, 0.08), 80);
  setTimeout(() => playTone(784, 0.25, 'sine', 0.25, 0.01, 0.15), 160);
  setTimeout(() => playTone(1047, 0.35, 'sine', 0.18, 0.02, 0.2), 280);
};

const playWrongSound = () => {
  // 错误音效：低沉的下降音
  playTone(220, 0.15, 'triangle', 0.2, 0.01, 0.12);
  setTimeout(() => playTone(165, 0.25, 'triangle', 0.25, 0.01, 0.18), 120);
};

const playCelebrationSound = () => {
  // 庆祝音效：欢快的琶音
  const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
  notes.forEach((note, i) => {
    setTimeout(() => playTone(note, 0.18, 'sine', 0.2, 0.01, 0.12), i * 70);
  });
  // 高潮部分
  setTimeout(() => {
    playTone(784, 0.12, 'sine', 0.22, 0.01, 0.08);
    setTimeout(() => playTone(988, 0.12, 'sine', 0.26, 0.01, 0.08), 80);
    setTimeout(() => playTone(1175, 0.4, 'sine', 0.3, 0.02, 0.25), 160);
    setTimeout(() => playTone(1397, 0.5, 'sine', 0.22, 0.02, 0.3), 320);
  }, 600);
};

const playClickSound = () => {
  // 点击音效：清脆的短促音
  playTone(1000, 0.04, 'sine', 0.12, 0.005, 0.03);
};

const playRevealSound = () => {
  // 揭示音效：神秘的上扬音
  playTone(350, 0.1, 'sine', 0.15, 0.015, 0.08);
  setTimeout(() => playTone(480, 0.1, 'sine', 0.2, 0.015, 0.08), 70);
  setTimeout(() => playTone(620, 0.15, 'sine', 0.25, 0.015, 0.1), 140);
  setTimeout(() => playTone(780, 0.2, 'sine', 0.22, 0.02, 0.12), 210);
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
