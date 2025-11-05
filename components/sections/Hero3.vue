<template>
     <section
      class="h-screen snap-start flex flex-col items-center justify-center bg-gradient-to-b from-[#e1e8ed] to-[#d9e1e6]"
    >
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
        class="text-center"
      >
        <h2 class="text-5xl font-bold mb-3">Nos projets</h2>
        <p class="max-w-xl mx-auto opacity-80">
          Une sélection de réalisations soignées, pensées pour la performance et la durabilité.
        </p>
      </div>
    </section>
</template>