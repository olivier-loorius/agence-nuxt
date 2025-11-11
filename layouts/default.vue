<template>
  <div>
    <NavBar />
    <FloatingCTA />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/navigation/Navbar.vue'
import FloatingCTA from '~/components/ui/FloatingCTA.vue'
</script>
