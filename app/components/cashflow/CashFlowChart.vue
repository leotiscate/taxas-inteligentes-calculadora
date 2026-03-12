<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 mb-8 border border-gray-100 dark:border-gray-700">
    <!-- Section title -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
        <ion-icon
          name="bar-chart"
          class="text-white text-xl"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Grafico Comparativo
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Entradas vs Despesas por semana
        </p>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-6 mb-6">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-green-500" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Entradas</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-red-500" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Despesas</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-orange-300" />
        <span class="text-sm text-gray-600 dark:text-gray-400">Transicao</span>
      </div>
    </div>

    <!-- Chart -->
    <div class="relative">
      <!-- Y-axis labels -->
      <div class="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 text-right pr-2">
        <span>{{ formatCompact(maxValue) }}</span>
        <span>{{ formatCompact(maxValue * 0.75) }}</span>
        <span>{{ formatCompact(maxValue * 0.5) }}</span>
        <span>{{ formatCompact(maxValue * 0.25) }}</span>
        <span>0</span>
      </div>

      <!-- Chart area -->
      <div class="ml-16 overflow-x-auto">
        <div class="flex items-end gap-2 min-w-max" style="height: 300px;">
          <div
            v-for="week in store.result.weeks"
            :key="week.weekNumber"
            class="flex flex-col items-center"
          >
            <!-- Bars -->
            <div class="flex items-end gap-1 h-64">
              <!-- Entries bar -->
              <div
                class="w-6 sm:w-8 rounded-t transition-all duration-300"
                :class="week.isTransitionWeek ? 'bg-orange-400' : 'bg-green-500'"
                :style="{ height: `${(week.totalEntries / maxValue) * 100}%` }"
                :title="`Entradas: ${formatCurrency(week.totalEntries)}`"
              />
              <!-- Expenses bar -->
              <div
                class="w-6 sm:w-8 bg-red-500 rounded-t transition-all duration-300"
                :style="{ height: `${(week.expenses / maxValue) * 100}%` }"
                :title="`Despesas: ${formatCurrency(week.expenses)}`"
              />
            </div>

            <!-- Week label -->
            <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              <div class="font-medium">S{{ week.weekNumber }}</div>
            </div>

            <!-- Balance indicator -->
            <div
              :class="[
                'mt-1 text-xs font-semibold',
                week.balance >= 0 ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ week.balance >= 0 ? '+' : '' }}{{ formatCompact(week.balance) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Baseline -->
      <div class="ml-16 h-px bg-gray-300 dark:bg-gray-600" />
    </div>

    <!-- Insight box -->
    <div class="mt-6 p-4 rounded-xl" :class="insightClass">
      <div class="flex items-start gap-3">
        <ion-icon
          :name="insightIcon"
          class="text-xl mt-0.5 flex-shrink-0"
        />
        <div class="text-sm">
          <p class="font-semibold mb-1">{{ insightTitle }}</p>
          <p class="opacity-80">{{ insightText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useCashFlowStore } from '~/store/cashflow'

const store = useCashFlowStore()

const maxValue = computed(() => {
  const allValues = store.result.weeks.flatMap(w => [w.totalEntries, w.expenses])
  return Math.max(...allValues) * 1.1 // 10% margin
})

const negativeWeeks = computed(() => {
  return store.result.weeks.filter(w => w.balance < 0)
})

const insightClass = computed(() => {
  if (negativeWeeks.value.length === 0) {
    return 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
  }
  if (negativeWeeks.value.length <= 2) {
    return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
  }
  return 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
})

const insightIcon = computed(() => {
  if (negativeWeeks.value.length === 0) return 'checkmark-circle'
  if (negativeWeeks.value.length <= 2) return 'warning'
  return 'alert-circle'
})

const insightTitle = computed(() => {
  if (negativeWeeks.value.length === 0) {
    return 'Fluxo de caixa positivo!'
  }
  return `${negativeWeeks.value.length} semana(s) com saldo negativo`
})

const insightText = computed(() => {
  if (negativeWeeks.value.length === 0) {
    return 'O cliente consegue manter o caixa positivo durante todo o periodo de transicao.'
  }
  const totalDeficit = negativeWeeks.value.reduce((sum, w) => sum + Math.abs(w.balance), 0)
  return `O cliente precisara de aproximadamente ${formatCurrency(totalDeficit)} de capital de giro para cobrir o deficit nas semanas ${negativeWeeks.value.map(w => w.weekNumber).join(', ')}.`
})

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toFixed(0)
}
</script>
