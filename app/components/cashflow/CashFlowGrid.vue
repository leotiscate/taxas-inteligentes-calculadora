<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 mb-8 border border-gray-100 dark:border-gray-700">
    <!-- Section title -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
          <ion-icon
            name="calendar"
            class="text-white text-xl"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-800 dark:text-white">
            Projecao Semanal
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            12 semanas a partir da ativacao
          </p>
        </div>
      </div>

      <!-- Legenda -->
      <div class="hidden sm:flex items-center gap-4 text-xs">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-orange-200 dark:bg-orange-900/50" />
          <span class="text-gray-500 dark:text-gray-400">Transicao</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-green-200 dark:bg-green-900/50" />
          <span class="text-gray-500 dark:text-gray-400">Normal</span>
        </div>
      </div>
    </div>

    <!-- Weeks Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="week in store.result.weeks"
        :key="week.weekNumber"
        :class="[
          'rounded-xl p-4 border-2 transition-all',
          week.isTransitionWeek
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        ]"
      >
        <!-- Week header -->
        <div class="flex items-center justify-between mb-3">
          <h3
            :class="[
              'font-bold',
              week.isTransitionWeek
                ? 'text-orange-800 dark:text-orange-300'
                : 'text-green-800 dark:text-green-300'
            ]"
          >
            {{ week.label }}
          </h3>
          <span
            v-if="week.isTransitionWeek"
            class="text-xs bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full"
          >
            Transicao
          </span>
        </div>

        <!-- Days grid -->
        <div class="grid grid-cols-7 gap-1 mb-3">
          <div
            v-for="day in week.days"
            :key="day.date.toISOString()"
            :class="[
              'text-center p-1.5 rounded text-xs',
              day.isWeekend
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                : day.isReduced
                  ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'
                  : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
            ]"
          >
            <div class="font-medium">{{ day.dayOfWeekShort }}</div>
            <div class="text-[10px] opacity-70">{{ formatDate(day.date) }}</div>
            <div class="font-semibold mt-0.5">{{ formatCompact(day.amount) }}</div>
          </div>
        </div>

        <!-- Week totals -->
        <div class="space-y-1 text-sm border-t border-gray-200 dark:border-gray-600 pt-3">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Entradas</span>
            <span class="font-semibold text-green-600 dark:text-green-400">
              {{ formatCurrency(week.totalEntries) }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Despesas</span>
            <span class="font-semibold text-red-600 dark:text-red-400">
              -{{ formatCurrency(week.expenses) }}
            </span>
          </div>
          <div class="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-600">
            <span class="font-bold text-gray-700 dark:text-gray-300">Saldo</span>
            <span
              :class="[
                'font-bold',
                week.balance >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              ]"
            >
              {{ formatCurrency(week.balance) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useCashFlowStore } from '~/store/cashflow'

const store = useCashFlowStore()

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function formatCompact(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toFixed(0)
}
</script>
