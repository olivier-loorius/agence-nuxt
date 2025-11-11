<template>
  <section
    class="h-screen snap-start flex flex-col items-center justify-center bg-gradient-to-b from-[#d9e1e6] to-[#f0f4f7]"
  >
    <div
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
      class="text-center"
    >
      <h2 class="text-5xl font-bold mb-4">Travaillons ensemble</h2>
      <p class="max-w-xl mx-auto opacity-80 mb-8">
        Une idée, un besoin ? Parlons-en autour d'un café ☕
      </p>
      <Button
        class="px-6 py-3 bg-[#1a1f24] text-white rounded-full font-medium hover:bg-[#2a3138] transition-all duration-300"
      >
        Nous contacter
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
</script>