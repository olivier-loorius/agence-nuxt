<template>
  <main
    id="main-content"
    class="relative h-screen snap-start flex items-start md:items-center justify-center overflow-hidden pt-32 md:pt-24 md:pr-16"
  >
    <NuxtImg
      src="/sigmund-hero.webp"
      width="1920"
      height="1080"
      format="webp"
      loading="eager"
      quality="85"
      class="absolute inset-0 w-full h-full object-cover"
      style="object-position: center 30%"
      :alt="t('hero1.bgAlt')"
    />
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
    />

    <article
      class="relative z-10 text-white space-y-6 w-full max-w-7xl px-6 md:px-16"
    >
      <header>
      <h1
        v-motion
        :initial="{ opacity: 0, filter: 'blur(10px)', y: 20 }"
        :visible="{
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          transition: { duration: 1000, delay: 600 },
        }"
        class="text-4xl md:text-6xl font-bold text-left"
      >
        {{ t('hero1.title.before') }} <span class="text-stroke-primary">{{ t('hero1.title.web') }}</span> {{ t('hero1.title.after') }}
      </h1>
      <h2
        v-motion
        :initial="{ opacity: 0, filter: 'blur(10px)', y: 20 }"
        :visible="{
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          transition: { duration: 1000, delay: 1000 },
        }"
        class="text-base md:text-xl font-manrope font-semibold leading-relaxed text-left"
      >
        <span class="text-primary">Artisan</span>, commerçant, association,
        <span class="text-primary">TPE</span>, PME,
        <span class="text-primary">indépendant</span>, profession libérale,
        entrepreneur local... Quel que soit votre métier, votre site web
        commence ici.
      </h2>
      </header>
      <p
        v-motion
        :initial="{ opacity: 0, filter: 'blur(10px)', y: 20 }"
        :visible="{
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          transition: { duration: 1000, delay: 1500 },
        }"
        class="text-base md:text-lg font-inter leading-relaxed opacity-90 text-left"
      >
        Gagnez en <span class="text-primary">visibilité</span> sur internet,
        attirez de nouveaux <span class="text-primary">clients</span>,
        développez votre activité en ligne. Un site
        <span class="text-primary">professionnel</span> adapté à vos besoins et
        votre budget.
      </p>
      <p
        v-motion
        :initial="{ opacity: 0, filter: 'blur(10px)', y: 20 }"
        :visible="{
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          transition: { duration: 1000, delay: 2500 },
        }"
        class="text-xs md:text-base font-inter font-medium"
      >
        {{ t("hero1.ctaIntro") }}
      </p>
      <div
        v-motion
        :initial="{ opacity: 0, filter: 'blur(10px)', y: 20 }"
        :visible="{
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          transition: { duration: 1000, delay: 3500 },
        }"
        class="flex flex-col-reverse sm:flex-row gap-4 justify-center md:justify-start pt-6"
      >
        <button
          @click="handleOpenModal"
          class="min-w-[240px] px-8 py-3 bg-black text-white font-manrope font-bold text-base rounded-lg hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 transition-all shadow-lg flex items-center gap-2 justify-center w-full sm:w-auto"
        >
          <Mail class="w-5 h-5" />
          {{ t("hero1.cta1") }}
        </button>
        <a
          href="tel:+33611223344"
          :aria-label="t('hero1.cta2AriaLabel')"
          class="min-w-[240px] px-6 py-3 bg-transparent border-2 border-primary text-white font-manrope font-bold text-base rounded-lg hover:bg-primary hover:text-black focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-all flex items-center gap-3 justify-center w-full sm:w-auto"
        >
          <Phone class="w-5 h-5" />
          {{ t("hero1.cta2") }}
        </a>
      </div>
    </article>
    <div
      class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#e9eef2] pointer-events-none z-0"
    />
  </main>
</template>

<script setup lang="ts">
import { useContactModal } from "~/composables/useContactModal";
import { useI18n } from "vue-i18n";
import { Phone, Mail } from "lucide-vue-next";

const { t } = useI18n();
const { openModal: openContactModal } = useContactModal();
const handleOpenModal = () => openContactModal();
</script>

<style scoped>
.text-stroke-primary {
  -webkit-text-stroke: 2px #eab308;
  -webkit-text-fill-color: transparent;
  paint-order: stroke fill;
}
</style>
