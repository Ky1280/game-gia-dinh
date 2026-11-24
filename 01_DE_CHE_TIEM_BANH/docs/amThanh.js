// Âm thanh nhẹ do máy tự tạo (Web Audio) — không dùng tệp nhạc
let ctx = null, tat = false;
export function datTat(v) { tat = !!v; }
export const dangTat = () => tat;
function ac() {
  if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function not(f, t0, dai, loai = 'sine', to = 0.12) {
  const a = ac(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = loai; o.frequency.value = f;
  const t = a.currentTime + t0;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(to, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dai);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dai + 0.02);
}
const AM = {
  bam: () => not(660, 0, 0.06, 'triangle', 0.06),
  tien: () => { not(988, 0, 0.09, 'square', 0.04); not(1319, 0.07, 0.16, 'square', 0.04); },
  loi: () => { not(220, 0, 0.14, 'sawtooth', 0.05); not(180, 0.1, 0.16, 'sawtooth', 0.05); },
  ngay: () => { [523, 659, 784].forEach((f, i) => not(f, i * 0.09, 0.2, 'triangle', 0.08)); },
  thang: () => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => not(f, i * 0.12, 0.28, 'triangle', 0.09)); },
};
export function phat(ten) { if (tat) return; try { AM[ten]?.(); } catch { /* bỏ qua */ } }
