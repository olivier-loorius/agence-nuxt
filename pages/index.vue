<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Rocket } from 'lucide-vue-next'
</script>

<template>
  <div class="p-10">
    <h1 class="text-3xl font-bold text-green-500">
      TITRE DE TEST TAILWIND
    </h1>
    <p>Si ce titre est gros et vert, Tailwind est installé.</p>

    <h2 class="mt-4 text-2xl font-bold">Test de Shadcn :</h2>

    <Button class="mt-2">
      <Rocket class="mr-2 h-4 w-4" />
      Bouton Shadcn (enfin !)
    </Button>
  </div>
</template>