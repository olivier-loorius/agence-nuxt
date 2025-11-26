<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Hammer, MessageCircle, Eye } from 'lucide-vue-next'

interface Props {
  benefit: 1 | 2 | 3
}

const props = defineProps<Props>()

const { t } = useI18n()

const iconMap = {
  1: Hammer,
  2: MessageCircle,
  3: Eye,
} as const

const icon = computed(() => iconMap[props.benefit])
</script>

<template>
  <li class="flex items-start gap-md">
    <div class="flex-shrink-0 mt-1">
      <component :is="icon" class="w-7 h-7 text-primary stroke-[2.5]" aria-hidden="true" />
    </div>
    <div>
      <h3 class="font-space-grotesk font-semibold text-neutral-900">
        {{ t(`hero4.benefit${benefit}.title`) }}
      </h3>
      <p class="font-inter text-xs text-neutral-700">
        {{ t(`hero4.benefit${benefit}.description`) }}
      </p>
    </div>
  </li>
</template>
