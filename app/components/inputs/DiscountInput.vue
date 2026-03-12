<template>
  <div>
    <label
      for="discount-input"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Desc. Taxa Int.
    </label>
    <div class="relative">
      <input
        id="discount-input"
        v-model.number="discount"
        type="number"
        min="0"
        step="0.01"
        class="block w-full px-3 pr-8 py-2 border-b-2 border-gray-300 dark:border-gray-600 dark:bg-transparent text-gray-900 dark:text-white focus:border-stone-green dark:focus:border-stone-green focus:outline-none transition-colors"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 dark:text-gray-400 text-sm">%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useComparisonStore } from '~/store/comparison'

const store = useComparisonStore()

const discount = computed({
  get: () => store.taxaInteligenteDiscount,
  set: (value) => {
    if (value !== null && value >= 0) {
      store.setTaxaInteligenteDiscount(value)
    }
  },
})
</script>
