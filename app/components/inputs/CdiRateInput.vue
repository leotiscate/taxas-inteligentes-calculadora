<template>
  <div class="group">
    <label
      for="cdi-rate-input"
      class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
    >
      Taxa CDI
    </label>
    <div class="relative">
      <input
        id="cdi-rate-input"
        v-model.number="cdiRate"
        type="number"
        min="0.01"
        step="0.01"
        class="block w-full px-4 pr-16 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200"
        placeholder="13,65"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-xs text-gray-400 dark:text-gray-500 font-medium">% a.a.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useComparisonStore } from '~/store/comparison'

const store = useComparisonStore()

const cdiRate = computed({
  get: () => store.cdiRate,
  set: (value) => {
    if (value && value > 0) {
      store.setCdiRate(value)
    }
  },
})
</script>
