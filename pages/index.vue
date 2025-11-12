<template>
  <div class="relative">
    <!-- Sections -->
    <main
      class="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth"
    >
      <section id="about" class="snap-start h-screen"><Hero1 /></section>
      <section id="skills" class="snap-start h-screen min-h-screen"><Hero2 /></section>
      <section id="work" class="snap-start h-screen min-h-screen"><Hero3 /></section>
      <section id="contact" class="snap-start h-screen min-h-screen"><Hero4 /></section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Hero1 from "~/components/sections/Hero1.vue";
import Hero2 from "~/components/sections/Hero2.vue";
import Hero3 from "~/components/sections/Hero3.vue";
import Hero4 from "~/components/sections/Hero4.vue";
</script>

<style scoped>
main::-webkit-scrollbar {
  display: none;
}
</style>
