<script lang="ts">
  import About from '$lib/components/About.svelte';
  import ExperienceTimeline from '$lib/components/ExperienceTimeline.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Projects from '$lib/components/Projects.svelte';
  import SkillsBento from '$lib/components/SkillsBento.svelte';
</script>

<svelte:head>
  <meta property="og:title" content="Duffy Adams | Developer & QA Engineer" />
  <meta
    property="og:description"
    content="Stuff I built because something bugged me: a workout app, a live San Diego traffic map, a photo food journal, and a bunch of smaller tools."
  />
</svelte:head>

<Navbar />
<main>
  <Hero />
  <Projects />
  <SkillsBento />
  <ExperienceTimeline />
  <About />
</main>
<Footer />
