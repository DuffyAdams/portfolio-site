<script lang="ts">
  import { reveal } from '$lib/reveal';
  import { FileDown, Github, Linkedin, Mail, Terminal } from 'lucide-svelte';
</script>

<footer class="section-shell pb-10 pt-12">
  <div class="rounded-apple border border-border bg-card p-6 shadow-soft sm:p-8" use:reveal={{ kind: 'rise' }}>
    <div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
      <div>
        <p class="text-2xl font-black">Duffy Adams</p>
        <p class="mt-2 text-sm text-muted-foreground">Built with SvelteKit.</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <!-- Replace contact/social href values with final links. -->
        <a class="button-secondary !px-4 !py-2.5" href="mailto:duffyadams55@gmail.com"><Mail size={16} /> Email</a>
        <a class="button-secondary !px-4 !py-2.5" href="https://github.com/DuffyAdams" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
        <a class="button-secondary !px-4 !py-2.5" href="https://www.linkedin.com/in/duffyadams/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
        <a class="button-secondary !px-4 !py-2.5" href="/assets/Resume_5_22_26.pdf" download="Duffy-Adams-Resume.pdf"><FileDown size={16} /> Resume</a>
        <a class="button-secondary !px-4 !py-2.5" href="/terminal/index.html"><Terminal size={16} /> Terminal Mode</a>
      </div>
    </div>
  </div>
</footer>
