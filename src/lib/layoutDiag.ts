/**
 * Temporary on-device layout probe, mounted only for `?diag=1`.
 *
 * Second round. The first version was drowned out by the off-canvas cart drawer:
 * it sorted by right edge, the drawer subtree sat at right=880, and the twelve
 * slots filled with drawer nodes before any real culprit appeared. This version
 * separates them.
 *
 * It also answers the question that matters most now: Jeet reports the page
 * SCROLLS sideways when signed in ("swipe right and it cuts the left part"),
 * which `html { overflow-x: clip }` should make impossible. So this reports which
 * element is actually scrollable, not just which ones stick out.
 *
 * Delete this file and its call in main.tsx once the cause is found.
 */

function describe(el: Element) {
  return `<${el.tagName.toLowerCase()}> ${(el.className || '').toString().slice(0, 95)}`;
}

function inDrawer(el: Element) {
  for (let n: Element | null = el; n; n = n.parentElement) {
    if ((n.className || '').toString().includes('translate-x-full')) return true;
  }
  return false;
}

export function mountLayoutDiag() {
  const panel = document.createElement('div');
  panel.id = 'dg-diag';
  panel.setAttribute(
    'style',
    'position:fixed;left:0;right:0;bottom:0;max-height:66vh;overflow:auto;z-index:2147483647;' +
      'background:#111;color:#eee;font:11px/1.45 ui-monospace,Menlo,monospace;padding:10px 10px 16px;' +
      'border-top:2px solid #C4963B;-webkit-overflow-scrolling:touch',
  );

  const render = () => {
    const de = document.documentElement;
    const vw = de.clientWidth;

    // Which element is actually able to scroll sideways?
    const scrollers: string[] = [];
    for (const el of Array.from(document.querySelectorAll('*'))) {
      if (el.id === 'dg-diag' || el.closest('#dg-diag')) continue;
      if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
        const ox = getComputedStyle(el).overflowX;
        if (ox === 'visible' || ox === 'auto' || ox === 'scroll') {
          scrollers.push(`${describe(el)} sw=${el.scrollWidth} cw=${el.clientWidth} ox=${ox}`);
        }
      }
    }

    const real: { d: string; over: number; txt: string; clip: string }[] = [];
    const drawer: { d: string; over: number }[] = [];

    for (const el of Array.from(document.querySelectorAll('*'))) {
      if (el.closest('#dg-diag')) continue;
      const b = el.getBoundingClientRect();
      if (b.width < 8 || b.height === 0) continue;
      if (b.right <= vw + 1) continue;
      if (inDrawer(el)) {
        drawer.push({ d: describe(el), over: Math.round(b.right - vw) });
        continue;
      }
      let clip = '';
      for (let n = el.parentElement; n && n !== de; n = n.parentElement) {
        const ox = getComputedStyle(n).overflowX;
        if (ox === 'hidden' || ox === 'clip') { clip = `${n.tagName.toLowerCase()}.${(n.className || '').toString().split(/\s+/).slice(0, 2).join('.')}`; break; }
      }
      real.push({ d: describe(el), over: Math.round(b.right - vw), txt: (el.textContent || '').trim().slice(0, 38), clip });
    }
    real.sort((a, b) => b.over - a.over);

    const signedIn = !!Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));

    let h = '';
    h += `<div style="font-size:13px;color:#C4963B;font-weight:700;margin-bottom:6px">LAYOUT DIAG 2<span style="float:right;color:#888;font-weight:400">tap to hide</span></div>`;
    h += `<div>clientWidth <b>${vw}</b> html.sw <b>${de.scrollWidth}</b> body.sw <b>${document.body.scrollWidth}</b></div>`;
    h += `<div>overflow <b style="color:${de.scrollWidth - vw > 1 ? '#ff6b6b' : '#7ddc7d'}">${de.scrollWidth - vw}px</b> &nbsp; scrollX now <b>${Math.round(window.scrollX)}</b> &nbsp; signedIn <b>${signedIn}</b></div>`;
    h += `<div>html overflow-x <b>${getComputedStyle(de).overflowX}</b> &nbsp; body overflow-x <b>${getComputedStyle(document.body).overflowX}</b></div>`;
    h += `<div style="margin-top:6px;color:#C4963B">HORIZONTALLY SCROLLABLE ELEMENTS: <b>${scrollers.length}</b></div>`;
    if (!scrollers.length) h += `<div style="color:#7ddc7d">none</div>`;
    else for (const s of scrollers.slice(0, 6)) h += `<div style="color:#ff6b6b;margin-top:3px">${s}</div>`;

    h += `<div style="margin-top:8px;color:#C4963B">PAST RIGHT EDGE, excluding cart drawer: <b>${real.length}</b> <span style="color:#666">(drawer nodes: ${drawer.length})</span></div>`;
    if (!real.length) h += `<div style="color:#7ddc7d">none</div>`;
    else for (const r of real.slice(0, 10)) {
      h += `<div style="margin-top:6px;padding-top:5px;border-top:1px solid #333">`;
      h += `<div><b style="color:#ffd479">+${r.over}px</b> ${r.d}</div>`;
      if (r.txt) h += `<div style="color:#888">"${r.txt}"</div>`;
      h += `<div style="color:${r.clip ? '#7ddc7d' : '#ff6b6b'}">${r.clip ? 'clipped by ' + r.clip : 'NOT CLIPPED - this can scroll the page'}</div>`;
      h += `</div>`;
    }
    panel.innerHTML = h;
  };

  panel.addEventListener('click', () => { panel.style.display = 'none'; });
  document.body.appendChild(panel);
  setTimeout(render, 900);
  setTimeout(render, 2600);
  window.addEventListener('resize', render);
  window.addEventListener('scroll', () => setTimeout(render, 150), { passive: true });
}
