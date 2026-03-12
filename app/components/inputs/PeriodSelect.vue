<template>
  <div>
    <label
      for="period-select"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Prazo
    </label>
    <select
      id="period-select"
      v-model="period"
      class="block w-full px-3 py-2 border-b-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-stone-green dark:focus:border-stone-green focus:outline-none transition-colors cursor-pointer"
    >
      <option
        v-for="option in PERIOD_OPTIONS"
        :key="option"
        :value="option"
      >
        {{ option }} dias
      </option>
    </select>
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
