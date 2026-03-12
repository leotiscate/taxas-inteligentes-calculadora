<template>
  <div class="group">
    <label
      for="period-select"
      class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
    >
      Prazo
    </label>
    <div class="relative">
      <select
        id="period-select"
        v-model="period"
        class="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 cursor-pointer appearance-none"
      >
        <option
          v-for="option in PERIOD_OPTIONS"
          :key="option"
          :value="option"
        >
          {{ option }} dias
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ion-icon
          name="chevron-down"
          class="text-gray-400"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useComparisonStore } from '~/store/comparison'
import { PERIOD_OPTIONS, type PeriodOption } from '~/types/comparison'

const store = useComparisonStore()

const period = computed({
  get: () => store.period,
  set: (value: PeriodOption) => {
    store.setPeriod(value)
  },
})
</script>
