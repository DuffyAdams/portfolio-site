import { writable } from 'svelte/store';

// Keep the desktop and mobile theme controls in sync.
export const isDarkTheme = writable(false);

let restoreFrame = 0;

export function applyTheme(next: boolean) {
  const root = document.documentElement;
  // Theme changes otherwise start hundreds of color/shadow transitions,
  // including inherited text colors. Keep hover motion outside the switch.
  cancelAnimationFrame(restoreFrame);
  root.classList.add('theme-changing');
  root.classList.toggle('dark', next);
  isDarkTheme.set(next);
  try {
    localStorage.setItem('theme', next ? 'dark' : 'light');
  } catch {
    // The toggle still works when browser storage is unavailable.
  }
  // Let the new palette paint before restoring transitions. A shared frame
  // handle also covers rapid clicks across the desktop and mobile controls.
  restoreFrame = requestAnimationFrame(() => {
    restoreFrame = requestAnimationFrame(() => {
      root.classList.remove('theme-changing');
      restoreFrame = 0;
    });
  });
}
