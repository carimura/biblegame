// Cut-paper drawing helpers. Everything returns SVG markup.

// Seeded random, so a scene looks the same every time.
export const rnd = a => () => {
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Wrap shapes so they read as one piece of cut paper.
export const cut = (inner, small) => `<g filter="url(#paper${small ? 'S' : ''})">${inner}</g>`;

// A rolling ridge through the given points, filled down to `bottom`. With `sharp` it runs straight from point to
// point instead: crags and mountains.
export function ridge(pts, bottom = 900, sharp) {
  let d = `M${pts[0][0]},${bottom}L${pts[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], m = (x0 + x1) / 2;
    d += sharp ? `L${x1},${y1}` : `C${m},${y0} ${m},${y1} ${x1},${y1}`;
  }
  return d + `L${pts.at(-1)[0]},${bottom}Z`;
}

export function hills(w, y, amp, step, r, bottom, sharp) {
  const pts = [];
  for (let x = -60; x < w + 60 + step; x += step * (0.7 + r() * 0.6)) pts.push([x | 0, (y + (r() - 0.5) * amp) | 0]);
  return ridge(pts, bottom, sharp);
}

const STONE = ['#ddcfb6', '#cbb89b', '#bfa98a', '#e8dcc6', '#d3c0a0'];
export function wall(x, y, w, h, r) {
  let s = '';
  for (let yy = y, row = 0; yy < y + h - 14; row++) {
    const rh = Math.min(24 + r() * 12, y + h - yy);
    for (let xx = x - (row % 2) * 22 - r() * 10; xx < x + w; ) {
      const rw = 38 + r() * 42, a = Math.max(x, xx), b = Math.min(x + w, xx + rw);
      if (b - a > 12)
        s += `<rect x="${a | 0}" y="${(yy + r() * 3) | 0}" width="${(b - a) | 0}" height="${rh | 0}" rx="${(7 + r() * 5) | 0}" fill="${STONE[(r() * 5) | 0]}"/>`;
      xx += rw + 5;
    }
    yy += rh + 5;
  }
  return `<rect x="${x - 3}" y="${y + 5}" width="${w + 6}" height="${h - 5}" rx="9" fill="#8f7c68"/>` + cut(s, 1);
}

// A wooden gate, 122 wide and 116 high, hinged on its left.
export const WICKET = `${cut('<rect x="2" width="10" height="116" rx="3" fill="#8a6445"/><rect x="110" width="10" height="116" rx="3" fill="#8a6445"/><path d="M6,104L116,14" stroke="#94704c" stroke-width="8"/><rect y="12" width="122" height="10" rx="3" fill="#a67c55"/><rect y="52" width="122" height="10" rx="3" fill="#a67c55"/><rect y="92" width="122" height="10" rx="3" fill="#a67c55"/>', 1)}<rect width="122" height="116" fill="transparent"/>`;

export function olive(r, s = 1) {
  const blobs = (n, fill, dy) =>
    cut(
      Array.from({ length: n }, () => {
        const a = r() * 6.28, d = r() ** 0.6;
        return `<ellipse cx="${(Math.cos(a) * d * 150) | 0}" cy="${(-250 + dy + Math.sin(a) * d * 70) | 0}" rx="${(50 + r() * 30) | 0}" ry="${(32 + r() * 18) | 0}" fill="${fill}"/>`;
      }).join('')
    );
  return `<g transform="scale(${s})"><g class="sway">${cut(
    '<path d="M-30,0C-22,-40 -34,-70 -18,-110C-26,-140 -52,-152 -64,-180L-48,-188C-36,-164 -14,-152 -6,-130C0,-152 22,-168 48,-182L58,-168C32,-152 16,-136 14,-108C24,-70 18,-36 32,0Z" fill="#6e5645"/>'
  )}${blobs(9, '#5f7558', 12)}${blobs(9, '#7d9070', 0)}${blobs(7, '#9aab88', -16)}</g></g>`;
}

export function grasses(w, r) {
  let s = '', flowers = '';
  for (let x = -20; x < w; x += 16 + r() * 30) {
    const h = 34 + r() * 62, lean = (r() - 0.5) * 44, c = ['#3f6a45', '#4c7a4c', '#35603f'][(r() * 3) | 0];
    s += `<path d="M${x - 8},905Q${x + lean * 0.2 - 4},${900 - h * 0.6} ${x + lean},${900 - h}Q${x + lean * 0.6 + 7},${900 - h * 0.5} ${x + 9},905Z" fill="${c}"/>`;
    if (r() < 0.1) {
      const fx = x + 20, fy = 828 - r() * 46;
      flowers += `<g class="poppy"><path d="M${fx},905Q${fx - 6},${fy + 40} ${fx},${fy}" fill="none" stroke="#35603f" stroke-width="4"/><circle cx="${fx}" cy="${fy}" r="${12 + r() * 4}" fill="#cf4a3c"/><circle cx="${fx}" cy="${fy}" r="4" fill="#3b2a2a"/><circle cx="${fx}" cy="${fy}" r="30" fill="transparent"/></g>`;
    }
  }
  return cut(s, 1) + cut(flowers, 1);
}

// Little tufts of grass scattered between y0 and y1, skipping the box `skip` = [x0, x1, yMax].
export function tufts(n, w, y0, y1, r, skip) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = (r() * w) | 0, y = (y0 + r() * (y1 - y0)) | 0, c = r() < 0.5 ? '#79a052' : '#a6c472';
    if (x > skip[0] && x < skip[1] && y < skip[2]) continue;
    s += `<path d="M${x - 9},${y}q-3,-12 -7,-17q8,3 10,12q0,-14 4,-22q5,9 4,22q3,-9 11,-13q-4,6 -6,18z" fill="${c}"/>`;
  }
  return cut(s, 1);
}

// A sheep, origin at its feet. `s` scales it (a lamb is smaller). It faces right; the `face` groups turn it round.
export function sheep(name, s = 1) {
  const wool = '#f4ebdb', dark = '#4a3c36', ty = -86 * s - 66;
  const piece = shapes => cut(`<g class="face">${shapes}</g>`, 1);
  return `<g class="bob"><g transform="scale(${s})">${piece(
    `<g class="legs" fill="${dark}"><rect x="-30" y="-24" width="9" height="25" rx="3"/><rect x="-16" y="-24" width="9" height="25" rx="3"/><rect x="10" y="-24" width="9" height="25" rx="3"/><rect x="24" y="-24" width="9" height="25" rx="3"/></g>
    <g fill="${wool}"><circle cx="-48" cy="-46" r="9"/><circle cx="-30" cy="-46" r="24"/><circle cx="-8" cy="-60" r="26"/><circle cx="18" cy="-57" r="25"/><circle cx="32" cy="-42" r="22"/><circle cx="8" cy="-36" r="27"/><circle cx="-18" cy="-34" r="25"/></g>
    <g fill="none" stroke="#d9ccb5" stroke-width="3" stroke-linecap="round"><path d="M-26,-52a8,8 0 1 1 9,8"/><path d="M4,-62a8,8 0 1 1 9,8"/><path d="M10,-36a7,7 0 1 1 8,7"/></g>`
  )}${piece(
    `<g class="head"><ellipse cx="50" cy="-52" rx="17" ry="13" fill="${dark}" transform="rotate(18 50 -52)"/><ellipse cx="38" cy="-60" rx="10" ry="5" fill="#3d312c" transform="rotate(-28 38 -60)"/><circle cx="40" cy="-70" r="11" fill="${wool}"/>
    <circle class="eye" cx="55" cy="-56" r="2.4" fill="#fbf3df"/><path class="shut" d="M51,-55q4,3 8,0" fill="none" stroke="#fbf3df" stroke-width="2" stroke-linecap="round"/></g>`
  )}<rect x="-76" y="-96" width="152" height="100" fill="transparent"/></g></g>
  <g class="tag"><rect x="-66" y="${ty}" width="132" height="44" rx="9" fill="#fbf3df"/><text y="${ty + 31}" text-anchor="middle">${name}</text></g>`;
}

// Young David with his staff and a small lyre, origin at his feet. Kept simple on purpose.
// Two drawings: `front` for when he stands and looks out at us, `side` (facing right) for when he walks.
export function david() {
  const skin = '#c58d66', hair = '#33241d', staff = 'fill="none" stroke="#7b5a3d" stroke-width="8" stroke-linecap="round"';
  const lyre = '<path d="M-12,8Q0,4 12,8L14,24Q0,29 -14,24Z" fill="#a8744b"/><path d="M-11,9Q-17,-10 -12,-26M11,9Q17,-10 12,-26" stroke="#8a5a37" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M-15,-27L15,-25" stroke="#74492c" stroke-width="5" stroke-linecap="round"/><path d="M-6,-25L-4,12M0,-25V12M6,-25L4,12" stroke="#f7e8c2" stroke-width="1.3"/>';
  const leg = `<rect x="-6" y="-48" width="11" height="44" fill="${skin}"/><rect x="-7" y="-8" width="21" height="9" rx="4" fill="#5d4330"/>`;
  const piece = shapes => cut(`<g class="face">${shapes}</g>`, 1); // turns round with the way he walks

  return `<g class="bob"><g class="front">
  ${cut(`<path d="M-46,0V-212q0,-30 24,-30q20,0 20,18" ${staff}/>`, 1)}
  ${cut(`<rect x="-15" y="-48" width="11" height="44" fill="${skin}"/><rect x="5" y="-48" width="11" height="44" fill="${skin}"/><rect x="-19" y="-8" width="20" height="9" rx="4" fill="#5d4330"/><rect x="2" y="-8" width="20" height="9" rx="4" fill="#5d4330"/>`, 1)}
  ${cut('<path d="M-30,-160Q0,-174 30,-160L44,-44Q0,-34 -44,-44Z" fill="#efe3c8"/><path d="M-13,-166L-19,-41h8L-6,-168ZM13,-166L19,-41h-8L6,-168Z" fill="#b65a3c"/>', 1)}
  ${cut('<path d="M-36,-106Q0,-97 36,-106L38,-91Q0,-82 -38,-91Z" fill="#46638f"/>', 1)}
  ${cut(`<path d="M-27,-152Q-45,-126 -46,-100M27,-152Q48,-130 38,-106" fill="none" stroke="${skin}" stroke-width="12" stroke-linecap="round"/><g transform="translate(42,-108)">${lyre}</g>`, 1)}
  ${cut(`<circle cx="0" cy="-190" r="25" fill="${skin}"/><g fill="${hair}"><path d="M-26,-190a26,26 0 0 1 52,0q-8,-12 -18,-12q-8,5 -16,1q-8,7 -18,11z"/><circle cx="-21" cy="-205" r="9"/><circle cx="-8" cy="-214" r="10"/><circle cx="7" cy="-215" r="10"/><circle cx="20" cy="-207" r="9"/><circle cx="-27" cy="-194" r="7"/><circle cx="27" cy="-195" r="7"/></g>
    <circle cx="-9" cy="-186" r="2.5" fill="#2b1f1a"/><circle cx="9" cy="-186" r="2.5" fill="#2b1f1a"/><path d="M-7,-176q7,6 14,0" fill="none" stroke="#7a4a35" stroke-width="2.2" stroke-linecap="round"/>`, 1)}
  </g><g class="side">
  ${piece(`<g class="leg b">${leg}</g>`)}
  ${piece(`<g transform="translate(-22,-112) rotate(-12)">${lyre}</g>`)}
  ${piece(`<g class="leg">${leg}</g>`)}
  ${piece('<path d="M-16,-160Q0,-172 16,-160L25,-44Q0,-36 -25,-44Z" fill="#efe3c8"/><path d="M4,-167L9,-40h8L11,-165Z" fill="#b65a3c"/>')}
  ${piece('<path d="M-20,-106Q0,-99 20,-106L21,-91Q0,-84 -21,-91Z" fill="#46638f"/>')}
  ${piece(`<g class="stick"><path d="M37,0V-212q0,-30 24,-30q20,0 20,18" ${staff}/></g>`)}
  ${piece(`<g class="stick"><path d="M2,-150Q22,-140 35,-120" fill="none" stroke="${skin}" stroke-width="12" stroke-linecap="round"/></g>`)}
  ${piece(`<circle cx="2" cy="-190" r="25" fill="${skin}"/><ellipse cx="27" cy="-187" rx="5" ry="4" fill="${skin}"/><g fill="${hair}"><path d="M-24,-186a26,26 0 0 1 44,-22q-10,-2 -16,6q-10,2 -12,12q-8,2 -16,4z"/><circle cx="-19" cy="-203" r="9"/><circle cx="-7" cy="-213" r="10"/><circle cx="8" cy="-215" r="10"/><circle cx="20" cy="-207" r="8"/><circle cx="-25" cy="-190" r="8"/><circle cx="-22" cy="-177" r="7"/></g>
    <circle cx="14" cy="-190" r="2.5" fill="#2b1f1a"/><path d="M12,-177q6,4 11,0" fill="none" stroke="#7a4a35" stroke-width="2.2" stroke-linecap="round"/>`)}
  </g></g>`;
}
