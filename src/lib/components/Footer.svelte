<script lang="ts">
  import { reveal } from '$lib/reveal';
  import { links } from '$lib/content';
  import { FileDown, Github, Linkedin, Mail } from 'lucide-svelte';

  const year = new Date().getFullYear();
</script>

<footer id="contact" class="section-shell pb-8 pt-4">
  <div class="rounded-apple border border-border bg-card p-5 shadow-soft sm:p-7" use:reveal={{ kind: 'rise' }}>
    <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
        <h2 class="mt-2 text-3xl font-black tracking-normal sm:text-4xl">Want to talk?</h2>
        <p class="mt-2 max-w-xl text-base leading-7 text-muted-foreground">
          Hiring, got a project idea, or found a bug in one of my apps? Email me at
          <a class="whitespace-nowrap font-bold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary" href={links.email}>{links.emailAddress}</a>.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <a class="button-primary !px-4 !py-2.5" href={links.email}><Mail size={16} /> Email me</a>
        <a class="button-secondary !px-4 !py-2.5" href={links.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
        <a class="button-secondary !px-4 !py-2.5" href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
        <a class="button-secondary !px-4 !py-2.5" href={links.resume} download={links.resumeFileName}><FileDown size={16} /> Resume</a>
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-1 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
      <p>© {year} Duffy Adams</p>
      <p>Built with SvelteKit. Rather use a command line? <a class="font-semibold text-foreground hover:underline" href={links.terminal}>Try terminal mode.</a></p>
    </div>
  </div>
</footer>
