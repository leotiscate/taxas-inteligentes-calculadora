<template>
  <div class="group">
    <label
      for="billing-input"
      class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
    >
      Faturamento
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-emerald-500 dark:text-emerald-400 font-medium">R$</span>
      </div>
      <input
        id="billing-input"
        v-model.number="billing"
        type="number"
        min="1"
        step="10000"
        class="block w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200"
        :class="{ 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20': !isValid }"
        placeholder="1.000.000"
      >
    </div>
    <p
      v-if="!isValid"
      class="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1"
    >
      <ion-icon name="alert-circle" />
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
    return 'Valor obrigatorio'
  }
  return ''
})
</script>
