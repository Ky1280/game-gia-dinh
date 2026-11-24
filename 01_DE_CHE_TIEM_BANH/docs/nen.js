// Hình nền và dải hình theo mùa — vẽ hoàn toàn bằng mã SVG (không dùng ảnh ngoài)
const enc = (s) => "url('data:image/svg+xml," + encodeURIComponent(s) + "')";
const W = 390, H = 844;
function rnd(seed) { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }

// ---------- A: quầy bánh ấm áp ----------
const cakeA = (x, y, s, c1, c2) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="-34" width="52" height="34" rx="5" fill="${c1}"/><path d="M-26 -34 h52 v8 q-6 8 -10 0 q-6 8 -10 0 q-6 8 -11 0 q-6 8 -10 0 q-6 8 -11 0z" fill="${c2}"/><rect x="-26" y="-18" width="52" height="5" fill="#fff8"/><circle cx="0" cy="-40" r="5" fill="#e0405a"/><rect x="-32" y="0" width="64" height="5" rx="2" fill="#c9a27e"/></g>`;
const loafA = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="-12" rx="30" ry="14" fill="#c98a4b"/><path d="M-16 -20 l8 10 M-2 -24 l8 10 M12 -22 l7 9" stroke="#f3d7a8" stroke-width="3" stroke-linecap="round"/></g>`;
const croisA = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-30 -4 q30 -40 60 0 q-12 -8 -16 4 q-14 -16 -28 0 q-4 -12 -16 -4z" fill="#d9954a"/></g>`;
function sceneA() {
  let g = `<rect width="${W}" height="${H}" fill="#f6e3cc"/>`;
  for (let i = 0; i < 14; i++) g += `<rect x="${i * 30}" y="0" width="15" height="${H}" fill="#f1dabd"/>`;
  [190, 360, 530].forEach((y, k) => {
    g += `<rect x="0" y="${y}" width="${W}" height="12" fill="#a8693d"/><rect x="0" y="${y + 12}" width="${W}" height="6" fill="#7d4a28"/>`;
    for (let i = 0; i < 5; i++) { const x = 40 + i * 78; g += (i + k) % 3 === 0 ? cakeA(x, y, 1, '#fbe1c6', '#f6a6b8') : (i + k) % 3 === 1 ? loafA(x, y) : croisA(x, y); }
  });
  g += `<rect x="0" y="640" width="${W}" height="${H - 640}" fill="#8a5233"/><rect x="0" y="640" width="${W}" height="120" fill="#cfe9ef" opacity=".55"/><rect x="0" y="640" width="${W}" height="6" fill="#fff" opacity=".8"/>`;
  for (let i = 0; i < 4; i++) g += cakeA(60 + i * 92, 740, 0.9, ['#fff4e6', '#ffd9e0', '#f8e0b0', '#e9d6ff'][i], ['#e86a86', '#c46a3a', '#f6a6b8', '#9b6bd8'][i]);
  let mai = `M0 0 h${W} v70`; for (let i = 0; i < 10; i++) mai += ' q-20 24 -39 0'; mai += 'z';
  g += `<path d="${mai}" fill="#e0607a"/>`;
  for (let i = 0; i < 10; i++) g += `<rect x="${i * 39}" y="0" width="19.5" height="70" fill="#fff" opacity=".85"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin slice">${g}</svg>`;
}

// ---------- B: hoạ tiết kẹo ngọt (lát lặp) ----------
function tileB() {
  const spr = ['#ff6fa0', '#5fcfb0', '#ffd36e', '#8fb8ff', '#c59bff']; let sp = ''; const r = rnd(7);
  for (let i = 0; i < 10; i++) { const a = r() * 6.28, d = 11 + r() * 5; sp += `<rect x="${-2 + Math.cos(a) * d}" y="${-1 + Math.sin(a) * d}" width="5" height="2" rx="1" fill="${spr[i % 5]}" transform="rotate(${r() * 180} ${Math.cos(a) * d} ${Math.sin(a) * d})"/>`; }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140"><rect width="140" height="140" fill="#ffeaf2"/>
  <g transform="translate(36 36)"><circle r="22" fill="#e9b07a"/><circle r="19" fill="#ff9fc0"/><circle r="7" fill="#ffeaf2"/>${sp}</g>
  <g transform="translate(104 40)"><ellipse cy="-6" rx="17" ry="8" fill="#9fe3cf"/><rect x="-16" y="-4" width="32" height="6" rx="3" fill="#fff8e6"/><ellipse cy="5" rx="17" ry="8" fill="#9fe3cf"/></g>
  <g transform="translate(40 108)"><path d="M-14 0 l4 18 h20 l4 -18z" fill="#ffd36e"/><path d="M-14 0 l4 18 M-6 0 l2 18 M2 0 l-1 18 M10 0 l-3 18" stroke="#e8b34a" stroke-width="1.5"/><circle cx="-7" cy="-4" r="8" fill="#fff"/><circle cx="6" cy="-4" r="8" fill="#fff"/><circle cy="-12" r="8" fill="#fff"/><circle cy="-21" r="4" fill="#ff5b93"/></g>
  <g transform="translate(104 104)"><circle r="16" fill="#c59bff"/><circle r="5" fill="#ffeaf2"/><circle cx="-8" cy="-6" r="2" fill="#fff"/><circle cx="7" cy="-8" r="2" fill="#fff"/><circle cx="9" cy="5" r="2" fill="#fff"/></g>
  <circle cx="72" cy="72" r="3" fill="#ffd36e"/><circle cx="12" cy="74" r="2.5" fill="#5fcfb0"/><circle cx="128" cy="72" r="2.5" fill="#ff6fa0"/></svg>`;
}

// ---------- C: lò bánh cổ điển ----------
function sceneC() {
  let g = `<defs><radialGradient id="fire" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#ffcf6b"/><stop offset=".45" stop-color="#e8763a"/><stop offset="1" stop-color="#3b160a"/></radialGradient>
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2216"/><stop offset="1" stop-color="#170c07"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#wall)"/>`;
  for (let y = 0; y < 520; y += 26) for (let x = (y / 26) % 2 ? -30 : 0; x < W; x += 60) g += `<rect x="${x + 2}" y="${y + 2}" width="56" height="22" rx="3" fill="#5a3322" opacity=".55"/>`;
  g += `<path d="M60 520 v-170 a135 135 0 0 1 270 0 v170z" fill="#2a160d"/><path d="M95 520 v-150 a100 100 0 0 1 200 0 v150z" fill="url(#fire)"/>`;
  for (let a = 0; a < 180; a += 15) { const rad = (a * Math.PI) / 180, cx = 195 + Math.cos(rad) * 118, cy = 350 - Math.sin(rad) * 118; g += `<rect x="${cx - 14}" y="${cy - 9}" width="28" height="18" rx="3" fill="#7a4026" transform="rotate(${-a + 90} ${cx} ${cy})"/>`; }
  g += `<rect x="0" y="520" width="${W}" height="${H - 520}" fill="#6b4226"/><rect x="0" y="520" width="${W}" height="10" fill="#8a5a36"/>`;
  [[90, 600], [200, 590], [310, 605], [150, 700], [270, 690]].forEach(([x, y]) => { g += `<g transform="translate(${x} ${y})"><ellipse rx="44" ry="18" fill="#c27c3e"/><ellipse rx="40" ry="14" cy="-3" fill="#d9954a"/><path d="M-24 -8 l10 9 M-4 -12 l10 9 M16 -10 l9 8" stroke="#f6d9a3" stroke-width="3" stroke-linecap="round"/></g>`; });
  g += `<g transform="translate(250 790) rotate(-12)"><rect x="-70" y="-7" width="140" height="14" rx="7" fill="#d7b48a"/><rect x="-92" y="-4" width="26" height="8" rx="4" fill="#a9825a"/><rect x="66" y="-4" width="26" height="8" rx="4" fill="#a9825a"/></g>`;
  const r = rnd(3);
  for (let i = 0; i < 90; i++) g += `<circle cx="${r() * W}" cy="${520 + r() * (H - 520)}" r="${0.6 + r() * 1.6}" fill="#fff" opacity="${0.15 + r() * 0.35}"/>`;
  for (let i = 0; i < 26; i++) g += `<circle cx="${110 + r() * 170}" cy="${230 + r() * 150}" r="${0.8 + r() * 1.8}" fill="#ffcf6b" opacity="${0.3 + r() * 0.5}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMin slice">${g}</svg>`;
}

// ---------- Dải hình 5 mùa (màu theo giao diện) ----------
// P = [nền, sáng, nhấn, đậm]
const PAL = { A: ['#fbe7cf', '#f2b35a', '#c94a3b', '#b87333'], B: ['#ffe0ec', '#ffd36e', '#ff6fa0', '#c88a4a'], C: ['#2a160d', '#f3d59b', '#d8452f', '#b8812b'] };
const svgStrip = (g) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 64" preserveAspectRatio="xMidYMid slice">${g}</svg>`;

function stripKhaiTruong(P) {          // ruy băng, bóng bay, cờ đuôi nheo
  let g = `<rect width="390" height="64" fill="${P[0]}"/>`;
  let flag = ''; for (let i = 0; i < 13; i++) flag += `<path d="M${i * 30} 6 l15 16 l15 -16z" fill="${[P[2], P[1], '#5fcfb0'][i % 3]}"/>`;
  g += `<path d="M0 6 Q195 16 390 6" stroke="${P[3]}" stroke-width="1.5" fill="none"/>${flag}`;
  [[270, 34, P[2]], [300, 26, P[1]], [330, 36, '#5fcfb0'], [356, 28, P[2]]].forEach(([x, y, c]) => { g += `<path d="M${x} ${y + 13} q-4 10 2 20" stroke="${P[3]}" fill="none"/><ellipse cx="${x}" cy="${y}" rx="11" ry="13" fill="${c}"/><circle cx="${x - 4}" cy="${y - 5}" r="3" fill="#fff" opacity=".45"/>`; });
  g += `<rect x="40" y="40" width="170" height="10" fill="${P[2]}"/><path d="M125 45 l-22 -12 v24z M125 45 l22 -12 v24z" fill="${P[2]}"/><circle cx="125" cy="45" r="6" fill="${P[1]}"/>`;
  return svgStrip(g);
}
function stripMuaMua(P) {               // mây, ô, giọt mưa
  let g = `<rect width="390" height="64" fill="${P[0]}"/>`;
  const may = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#9fb3c8"><circle r="12"/><circle cx="14" cy="-5" r="15"/><circle cx="30" r="11"/><rect x="0" y="0" width="30" height="11"/></g>`;
  g += may(30, 18, 1) + may(180, 14, 0.8) + may(300, 20, 1.1);
  const r = rnd(11); for (let i = 0; i < 40; i++) { const x = r() * 390, y = 26 + r() * 34; g += `<path d="M${x} ${y} l-3 7" stroke="#6f9cc4" stroke-width="2" stroke-linecap="round" opacity=".7"/>`; }
  [[110, 36, P[2]], [250, 40, P[1]]].forEach(([x, y, c]) => { g += `<path d="M${x - 22} ${y} q22 -26 44 0 q-7 -5 -11 0 q-5 -5 -11 0 q-5 -5 -11 0 q-5 -5 -11 0z" fill="${c}"/><path d="M${x} ${y} v16 q0 5 -5 5" stroke="${P[3]}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`; });
  return svgStrip(g);
}
function stripTrungThu(P) {             // trăng, đèn lồng, bánh nướng
  let g = `<rect width="390" height="64" fill="${P[0]}"/><circle cx="330" cy="30" r="24" fill="${P[1]}"/><circle cx="322" cy="24" r="4" fill="#fff" opacity=".35"/>`;
  [[40, 0], [90, 6], [250, 2]].forEach(([x, o]) => { g += `<line x1="${x}" y1="0" x2="${x}" y2="${12 + o}" stroke="${P[3]}" stroke-width="2"/><ellipse cx="${x}" cy="${28 + o}" rx="14" ry="17" fill="${P[2]}"/><path d="M${x - 14} ${28 + o} h28 M${x} ${11 + o} v34" stroke="#ffd36e" stroke-width="1.3" opacity=".7"/><rect x="${x - 5}" y="${44 + o}" width="10" height="4" fill="${P[3]}"/>`; });
  [[150, 44], [195, 48]].forEach(([x, y]) => { let s = ''; for (let a = 0; a < 360; a += 30) { const rr = (a * Math.PI) / 180; s += `<circle cx="${x + Math.cos(rr) * 16}" cy="${y + Math.sin(rr) * 16}" r="5" fill="${P[3]}"/>`; } g += s + `<circle cx="${x}" cy="${y}" r="17" fill="${P[3]}"/><circle cx="${x}" cy="${y}" r="12" fill="#e2a95b"/><path d="M${x - 6} ${y} h12 M${x} ${y - 6} v12" stroke="${P[3]}" stroke-width="2"/>`; });
  return svgStrip(g);
}
function stripGiangSinh(P) {            // cây thông, tuyết, bánh khúc cây
  let g = `<rect width="390" height="64" fill="${P[0]}"/>`;
  [[40, 1], [90, 0.8], [330, 1.1], [370, 0.75]].forEach(([x, s]) => { g += `<g transform="translate(${x} 60) scale(${s})"><rect x="-4" y="-8" width="8" height="8" fill="#7a4a28"/><path d="M-22 -8 L0 -30 L22 -8z M-18 -22 L0 -42 L18 -22z M-13 -35 L0 -52 L13 -35z" fill="#3f8a4f"/><circle cy="-52" r="3.5" fill="${P[1]}"/><circle cx="-8" cy="-14" r="2.5" fill="${P[2]}"/><circle cx="7" cy="-26" r="2.5" fill="${P[1]}"/></g>`; });
  g += `<g transform="translate(200 46)"><rect x="-50" y="-12" width="100" height="24" rx="12" fill="#7a4a28"/><ellipse cx="50" cy="0" rx="8" ry="12" fill="#c8945a"/><path d="M48 -6 a6 6 0 1 1 0 12" stroke="#7a4a28" fill="none" stroke-width="2"/><path d="M-40 -12 q10 6 20 0 q10 6 20 0 q10 6 20 0 q10 6 20 0" stroke="#fff" stroke-width="3" fill="none"/><circle cx="-20" cy="-16" r="4" fill="${P[2]}"/><circle cx="-13" cy="-17" r="4" fill="${P[2]}"/><path d="M-16 -20 l4 -6 l3 5" fill="#3f8a4f"/></g>`;
  const r = rnd(5); for (let i = 0; i < 34; i++) g += `<circle cx="${r() * 390}" cy="${r() * 64}" r="${1 + r() * 1.6}" fill="#fff" opacity=".85"/>`;
  return svgStrip(g);
}
function stripTet(P) {                  // hoa mai, bao lì xì, câu đối
  let g = `<rect width="390" height="64" fill="${P[0]}"/>`;
  g += `<path d="M0 50 q60 -30 120 -18 q40 8 70 -14 M60 38 q10 -20 30 -26 M150 30 q10 10 30 6" stroke="#6b3a1f" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const hoa = (x, y) => { let s = ''; for (let a = 0; a < 360; a += 72) { const rr = (a * Math.PI) / 180; s += `<circle cx="${x + Math.cos(rr) * 4.5}" cy="${y + Math.sin(rr) * 4.5}" r="4" fill="#ffd23f"/>`; } return s + `<circle cx="${x}" cy="${y}" r="2" fill="#e8763a"/>`; };
  [[30, 42], [70, 30], [95, 14], [130, 30], [180, 32], [190, 16], [55, 52]].forEach(([x, y]) => { g += hoa(x, y); });
  [[250, 14], [300, 22], [350, 12]].forEach(([x, y]) => { g += `<rect x="${x - 12}" y="${y}" width="24" height="34" rx="3" fill="${P[2]}"/><path d="M${x - 12} ${y + 8} l12 8 l12 -8" stroke="${P[1]}" stroke-width="1.6" fill="none"/><circle cx="${x}" cy="${y + 22}" r="5" fill="${P[1]}"/>`; });
  return svgStrip(g);
}
const STRIP_FN = [stripKhaiTruong, stripMuaMua, stripTrungThu, stripGiangSinh, stripTet];

const cache = {};
export function nenGiaoDien(theme) { return (cache['bg' + theme] ||= enc(theme === 'B' ? tileB() : theme === 'C' ? sceneC() : sceneA())); }
export function daiMua(theme, mua) { return (cache[`s${theme}${mua}`] ||= enc(STRIP_FN[mua - 1](PAL[theme]))); }
