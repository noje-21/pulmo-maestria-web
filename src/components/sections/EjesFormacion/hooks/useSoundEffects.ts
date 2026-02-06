import { useCallback, useRef } from "react";

// Subtle, professional sound effects using Web Audio API
export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Subtle click/pop sound for expand
  const playExpandSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Soft, warm tone
      oscillator.frequency.setValueAtTime(520, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.08);
      oscillator.type = "sine";

      // Very subtle volume
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.12);
    } catch {
      // Silently fail if audio is not available
    }
  }, [getAudioContext]);

  // Subtle descending tone for collapse
  const playCollapseSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Descending soft tone
      oscillator.frequency.setValueAtTime(580, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.1);
      oscillator.type = "sine";

      // Very subtle volume
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch {
      // Silently fail if audio is not available
    }
  }, [getAudioContext]);

  // Soft whoosh for view mode toggle
  const playToggleSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // White noise burst for whoosh effect
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      filter.Q.value = 1;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.08);
    } catch {
      // Silently fail if audio is not available
    }
  }, [getAudioContext]);

  return {
    playExpandSound,
    playCollapseSound,
    playToggleSound,
  };
};
