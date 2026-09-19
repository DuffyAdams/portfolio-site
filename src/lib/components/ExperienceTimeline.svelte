<script lang="ts">
  import { Building2, CheckCircle2 } from 'lucide-svelte';
  import { reveal } from '$lib/reveal';

  const bullets = [
    'Troubleshoot devices, workflows, and communication systems in secure operational environments',
    'Create and handle reports that help technical and non-technical stakeholders make decisions',
    'Coordinate support across users, vendors, and internal teams with clear follow-through',
    'Improve repeatable processes by documenting fixes, patterns, and operational edge cases'
  ];
</script>

<section id="experience" class="section-shell py-20 sm:py-28">
  <div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
    <div class="reveal" use:reveal={{ kind: 'heading' }}>
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Experience</p>
      <h2 class="mt-3 text-4xl font-black tracking-normal sm:text-6xl">Technical work with operational stakes.</h2>
    </div>

    <article class="reveal surface rounded-apple p-7 sm:p-9" use:reveal={{ kind: 'card', direction: 1 }}>
      <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex gap-4">
          <div class="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-muted">
            <Building2 size={24} />
          </div>
          <div>
            <h3 class="text-2xl font-black">Site Administrator / IT</h3>
            <p class="mt-1 font-semibold text-muted-foreground">ICSolutions</p>
          </div>
        </div>
        <span class="rounded-full bg-muted px-4 py-2 text-sm font-bold text-muted-foreground">Current</span>
      </div>

      <p class="mt-7 text-base leading-8 text-muted-foreground">
        Hands-on technical role supporting secure communication systems, troubleshooting devices, handling reports, coordinating support, and working with operational stakeholders.
      </p>

      <div class="mt-7 grid gap-4">
        {#each bullets as bullet}
          <div class="flex gap-3 rounded-3xl bg-muted/60 p-4">
            <CheckCircle2 class="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-300" size={19} />
            <p class="text-sm leading-6 text-muted-foreground">{bullet}</p>
          </div>
        {/each}
      </div>
    </article>
  </div>
</section>
