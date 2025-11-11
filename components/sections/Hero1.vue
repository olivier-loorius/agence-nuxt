<template>
  <section
    class="h-screen snap-start flex flex-col items-center justify-center bg-gradient-to-b from-[#f0f4f7] to-[#e9eef2]"
  >
    <div
      v-motion
      :initial="{ opacity: 0, y: 40 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
      class="text-center"
    >
      <h1 class="text-6xl font-extrabold mb-4 tracking-tight">
        Créons ensemble le client de demain.
      </h1>
      <p class="text-lg opacity-80 max-w-xl mx-auto">
        Une agence créative spécialisée dans le développement web moderne et accessible.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts"></script>