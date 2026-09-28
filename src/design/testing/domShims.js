// TEST-ONLY. The jsdom shims Radix and the app screens need in a vitest
// jsdom run (ResizeObserver, DOMRect, matchMedia, pointer capture).
export function installDomShims() {
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  }
  if (!globalThis.DOMRect) {
    globalThis.DOMRect = class {
      constructor(x = 0, y = 0, w = 0, h = 0) { Object.assign(this, { x, y, width: w, height: h, top: y, left: x, right: x + w, bottom: y + h }); }
      static fromRect(r = {}) { return new globalThis.DOMRect(r.x, r.y, r.width, r.height); }
    };
  }
  if (!window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
  }
  const proto = window.HTMLElement.prototype;
  proto.scrollIntoView = proto.scrollIntoView || (() => {});
  proto.hasPointerCapture = proto.hasPointerCapture || (() => false);
  proto.releasePointerCapture = proto.releasePointerCapture || (() => {});
}
