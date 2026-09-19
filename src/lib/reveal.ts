type RevealOptions = {
  kind?: 'rise' | 'heading' | 'card' | 'tile' | 'image';
  delay?: number;
  direction?: number;
};

type ScrollReveal = {
  node: HTMLElement;
  animation: Animation;
  top: number;
  progress: number;
  stagger: number;
  finish: () => void;
};

const duration = 1100;
const pending = new Set<ScrollReveal>();
let frame = 0;
let previousTime = 0;
let stopListening: (() => void) | undefined;

// Layout coordinates stay stable while the element itself translates and rotates.
function layoutTop(node: HTMLElement) {
  let top = 0;
  for (let element: HTMLElement | null = node; element; element = element.offsetParent as HTMLElement | null) {
    top += element.offsetTop;
  }
  return top;
}

function requestTick() {
  if (!frame) frame = requestAnimationFrame(tick);
}

function tick(time: number) {
  frame = 0;
  const smoothing = 1 - Math.exp(-Math.min(time - previousTime || 16, 64) / 75);
  previousTime = time;
  const viewport = window.innerHeight;
  const scroll = window.scrollY;
  const atBottom = scroll + viewport >= document.documentElement.scrollHeight - 2;
  const travel = Math.min(viewport * 0.44, 380);
  let settling = false;

  for (const entry of pending) {
    const target = atBottom ? 1 : Math.max(0, Math.min(1,
      (scroll + viewport * 0.96 - entry.top - entry.stagger) / travel
    ));
    entry.progress += (target - entry.progress) * smoothing;
    if (Math.abs(target - entry.progress) < 0.001) entry.progress = target;
    entry.animation.currentTime = entry.progress * duration;
    if (entry.progress === 1) entry.finish();
    else if (entry.progress !== target) settling = true;
  }

  if (settling && pending.size) requestTick();
}

function track(entry: ScrollReveal) {
  pending.add(entry);
  if (!stopListening) {
    const measure = () => {
      for (const item of pending) item.top = layoutTop(item.node);
      requestTick();
    };
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', measure);
    const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    resizeObserver?.observe(document.body);
    stopListening = () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', measure);
      resizeObserver?.disconnect();
    };
  }
  requestTick();
}

function untrack(entry: ScrollReveal) {
  pending.delete(entry);
  if (!pending.size) {
    stopListening?.();
    stopListening = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }
}

export function reveal(node: HTMLElement, options: RevealOptions | number = {}) {
  const { kind = 'rise', delay = 0, direction = 1 } = typeof options === 'number' ? { delay: options } : options;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches || typeof node.animate !== 'function') return {};

  const compact = window.innerWidth < 768;
  const distance = compact ? 0.6 : 1;
  const start: Keyframe = kind === 'heading'
    ? { translate: '0 36px', clipPath: 'inset(0 0 100% 0)' }
    : kind === 'card'
      ? { translate: `${direction * 18 * distance}px ${88 * distance}px`, rotate: `${direction * 2.4 * distance}deg`, scale: '0.94', opacity: 0.65 }
      : kind === 'tile'
        ? { translate: `0 ${56 * distance}px`, rotate: `${direction * 1.5 * distance}deg`, scale: '0.92', opacity: 0.7 }
        : kind === 'image'
          ? { translate: `${-20 * distance}px 0`, clipPath: 'inset(0 22% 0 0 round 2rem)', scale: '1.035' }
          : { translate: `0 ${44 * distance}px`, opacity: 0.5 };
  const end: Keyframe = Object.fromEntries(Object.keys(start).map((key) => [key,
    key === 'clipPath' ? 'inset(0 0 0 0 round 0rem)' : key === 'translate' ? '0 0' : key === 'rotate' ? '0deg' : 1
  ]));
  const top = layoutTop(node);
  const animation = node.animate([start, end], {
    duration,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'both'
  });
  animation.pause();
  animation.currentTime = 0;
  node.dataset.reveal = kind;

  let finished = false;
  const entry: ScrollReveal = { node, animation, top, progress: 0, stagger: Math.min(delay * 0.18, 48), finish };

  function finish() {
    if (finished) return;
    finished = true;
    untrack(entry);
    animation.cancel();
    node.classList.add('in-view');
    node.removeEventListener('focusin', finish);
    media.removeEventListener('change', onMotionChange);
  }

  function onMotionChange() {
    if (media.matches) finish();
  }

  // Keyboard navigation never waits for a scroll animation to reveal its target.
  node.addEventListener('focusin', finish);
  media.addEventListener('change', onMotionChange);
  animation.onfinish = finish;

  if (top < window.scrollY + window.innerHeight * 0.82) {
    if (top + node.offsetHeight < window.scrollY) finish();
    else {
      animation.effect?.updateTiming({ delay: Math.min(delay, 240) });
      animation.play();
    }
  } else {
    track(entry);
  }

  return { destroy: finish };
}
