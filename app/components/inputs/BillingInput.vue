<template>
  <div>
    <label
      for="billing-input"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Faturamento
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-500 dark:text-gray-400 text-sm">R$</span>
      </div>
      <input
        id="billing-input"
        v-model.number="billing"
        type="number"
        min="1"
        step="1000"
        class="block w-full pl-10 pr-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 dark:bg-transparent text-gray-900 dark:text-white focus:border-stone-green dark:focus:border-stone-green focus:outline-none transition-colors"
        :class="{ 'border-red-500 dark:border-red-400': !isValid }"
        :aria-describedby="!isValid ? 'billing-error' : undefined"
      >
    </div>
    <p
      v-if="!isValid"
      id="billing-error"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
      aria-live="polite"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useComparisonStore } from '~/store/comparison'

const store = useComparisonStore()

const billing = computed({
  get: () => store.billing,
  set: (value) => {
    if (value && value > 0) {
      store.setBilling(value)
    }
  },
})

const isValid = computed(() => store.billing > 0)

const errorMessage = computed(() => {
  if (!store.billing || store.billing <= 0) {
    return 'Deve ser um valor positivo'
  }
  return ''
})
</script>
