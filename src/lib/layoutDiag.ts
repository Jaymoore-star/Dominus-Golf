/**
 * Temporary on-device layout probe, mounted only for `?diag=1`.
 *
 * Why this exists: the site measures clean in Blink and WebKit at every width
 * from 320 to 1440px, yet Jeet's iPhone (440 CSS px, no zoom, fonts loaded,
 * root font-size 16px — all confirmed by public/diag.html) still lays out wider
 * than the screen. Estimating from screenshots proved unreliable, so this reports
 * the real page's own numbers from the device that actually reproduces it.
 *
 * Plain DOM on purpose: no React, no Tailwind, so the panel cannot be affected by
 * whatever is breaking the layout it is measuring.
 *
 * Delete this file and its call in main.tsx once the cause is found.
 */

type Row = { tag: string; cls: string; w: number; right: number; text: string; clippedBy: string };

function scan() {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const rows: Row[] = [];

  for (const el of Array.from(document.querySelectorAll('*'))) {
    const b = el.getBoundingClientRect();
    if (b.width < 8 || b.height === 0) continue;
    if (b.right <= vw + 1) continue;
    if (el.closest('#dg-diag')) continue;

    // note WHICH ancestor clips it, rather than silently skipping — a thing that
    // looks contained on the test rig may not be contained here
    let clippedBy = '';
    for (let n = el.parentElement; n && n !== de; n = n.parentElement) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') {
        clippedBy = `${n.tagName.toLowerCase()}.${(n.className || '').toString().split(/\s+/).slice(0, 2).join('.')} (${ox})`;
        break;
      }
    }

    rows.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || '').toString().slice(0, 120),
      w: Math.round(b.width),
      right: Math.round(b.right),
      text: (el.textContent || '').trim().slice(0, 40),
      clippedBy,
    });
  }

  rows.sort((a, b) => b.right - a.right);
  return { vw, sw: de.scrollWidth, bodySw: document.body.scrollWidth, rows };
}

function wordmarkInfo() {
  const el = Array.from(document.querySelectorAll('a')).find(
    (a) => (a.textContent || '').trim() === 'DOMINUS GOLF',
  );
  if (!el) return 'wordmark not found';
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return `${cs.fontSize} / ls ${cs.letterSpacing} / w ${Math.round(r.width)}px / family ${cs.fontFamily.split(',')[0]}`;
}

export function mountLayoutDiag() {
  const panel = document.createElement('div');
  panel.id = 'dg-diag';
  panel.setAttribute(
    'style',
    'position:fixed;left:0;right:0;bottom:0;max-height:62vh;overflow:auto;z-index:2147483647;' +
      'background:#111;color:#eee;font:11px/1.45 ui-monospace,Menlo,monospace;padding:10px 10px 16px;' +
      'border-top:2px solid #C4963B;-webkit-overflow-scrolling:touch',
  );

  const render = () => {
    const s = scan();
    const vv = window.visualViewport;
    const over = s.sw - s.vw;

    let html = '';
    html += `<div style="font-size:13px;color:#C4963B;font-weight:700;margin-bottom:6px">LAYOUT DIAG &nbsp;<span style="float:right;color:#888;font-weight:400">tap to hide</span></div>`;
    html += `<div>clientWidth <b>${s.vw}</b> &nbsp; scrollWidth <b>${s.sw}</b> &nbsp; body <b>${s.bodySw}</b></div>`;
    html += `<div>overflow <b style="color:${over > 1 ? '#ff6b6b' : '#7ddc7d'}">${over}px</b> &nbsp; vv.scale <b>${vv ? vv.scale.toFixed(3) : 'n/a'}</b> &nbsp; dpr <b>${window.devicePixelRatio}</b></div>`;
    html += `<div>html overflow-x <b>${getComputedStyle(document.documentElement).overflowX}</b> &nbsp; root font <b>${getComputedStyle(document.documentElement).fontSize}</b></div>`;
    html += `<div style="margin-top:4px">wordmark: <b>${wordmarkInfo()}</b></div>`;
    html += `<div style="margin-top:8px;color:#C4963B">elements past the right edge: <b>${s.rows.length}</b></div>`;

    if (!s.rows.length) {
      html += `<div style="color:#7ddc7d">none — nothing sticks out at this width</div>`;
    } else {
      for (const r of s.rows.slice(0, 12)) {
        html += `<div style="margin-top:6px;padding-top:5px;border-top:1px solid #333">`;
        html += `<div><b style="color:#ffd479">&lt;${r.tag}&gt;</b> w=${r.w} right=<b style="color:#ff6b6b">${r.right}</b> (+${r.right - s.vw})</div>`;
        html += `<div style="color:#9ad">${r.cls || '(no class)'}</div>`;
        if (r.text) html += `<div style="color:#888">"${r.text}"</div>`;
        html += `<div style="color:${r.clippedBy ? '#7ddc7d' : '#ff6b6b'}">${r.clippedBy ? 'clipped by ' + r.clippedBy : 'NOT CLIPPED'}</div>`;
        html += `</div>`;
      }
    }
    panel.innerHTML = html;
  };

  panel.addEventListener('click', () => {
    panel.style.display = 'none';
  });

  document.body.appendChild(panel);
  // let fonts settle and the route render before the first read
  setTimeout(render, 900);
  setTimeout(render, 2500);
  window.addEventListener('resize', render);
  window.addEventListener('orientationchange', () => setTimeout(render, 400));
  if (window.visualViewport) window.visualViewport.addEventListener('resize', render);
}
