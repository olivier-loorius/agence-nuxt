<template>
  <section
    class="h-screen snap-start flex flex-col items-center justify-center bg-gradient-to-b from-[#e9eef2] to-[#e1e8ed]"
  >
    <div
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
      class="text-center"
    >
      <h2 class="text-5xl font-bold mb-3">Sites web performants et inclusifs</h2>
      <p class="max-w-xl mx-auto opacity-80">
        Nous concevons des expériences rapides, accessibles et esthétiques pour tous les utilisateurs.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts"></script>