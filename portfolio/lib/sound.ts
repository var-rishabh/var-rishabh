/** Opt-in harp tones. Off by default; the AudioContext is only created by the user's toggle click. */
let ctx: AudioContext | null = null;
let on = false;

export function setSound(enabled: boolean) {
  on = enabled;
  if (!enabled) return;
  ctx ??= new AudioContext();
  void ctx.resume();
}

const PENTATONIC = [0, 2, 4, 7, 9];

/** Plays note `step` of a three-octave pentatonic scale (0 = lowest). */
export function pluck(step: number) {
  if (!on || !ctx) return;
  const semitones = 12 * Math.floor(step / 5) + PENTATONIC[step % 5];
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = 146.83 * 2 ** (semitones / 12);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.12, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 1.65);
}
