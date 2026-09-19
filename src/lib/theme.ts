import { writable } from 'svelte/store';

// Keep the desktop and mobile theme controls in sync.
export const isDarkTheme = writable(false);
