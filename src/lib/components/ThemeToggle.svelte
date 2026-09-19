<script lang="ts">
  import { Moon, Sun } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { isDarkTheme } from '$lib/theme';

  function applyTheme(next: boolean) {
    isDarkTheme.set(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // The toggle still works when browser storage is unavailable.
    }
  }

  onMount(() => {
    isDarkTheme.set(document.documentElement.classList.contains('dark'));
  });
</script>

<button
  type="button"
  class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-muted"
  aria-label={$isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
  onclick={() => applyTheme(!$isDarkTheme)}
>
  {#if $isDarkTheme}
    <Sun size={18} strokeWidth={2.2} />
  {:else}
    <Moon size={18} strokeWidth={2.2} />
  {/if}
</button>
