<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 mb-8 border border-gray-100 dark:border-gray-700">
    <!-- Section title -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow">
          <ion-icon
            name="calendar"
            class="text-white text-lg"
          />
        </div>
        <div>
          <h2 class="text-base font-bold text-gray-800 dark:text-white">
            Detalhamento Semanal
          </h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Clique nas despesas para editar
          </p>
        </div>
      </div>

      <!-- Legenda compacta -->
      <div class="flex items-center gap-3 text-xs">
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-orange-400" />
          <span class="text-gray-500 dark:text-gray-400">Transicao</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-green-400" />
          <span class="text-gray-500 dark:text-gray-400">Normal</span>
        </div>
      </div>
    </div>

    <!-- Weeks Grid - Compact -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
      <div
        v-for="week in store.result.weeks"
        :key="week.weekNumber"
        :class="[
          'rounded-lg p-2 border transition-all',
          week.isTransitionWeek
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        ]"
      >
        <!-- Week header -->
        <div class="flex items-center justify-between mb-2">
          <h3
            :class="[
              'text-xs font-bold',
              week.isTransitionWeek
                ? 'text-orange-800 dark:text-orange-300'
                : 'text-green-800 dark:text-green-300'
            ]"
          >
            S{{ week.weekNumber }}
          </h3>
          <span
            v-if="week.isTransitionWeek"
            class="w-2 h-2 rounded-full bg-orange-400"
            title="Transicao"
          />
        </div>

        <!-- Week totals - Compact -->
        <div class="space-y-0.5 text-xs">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Ent</span>
            <span class="font-medium text-green-600 dark:text-green-400">
              {{ formatCompact(week.totalEntries) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500 dark:text-gray-400">Desp</span>
            <span
              class="font-medium text-red-600 dark:text-red-400 cursor-pointer hover:underline"
              title="Clique para editar"
              @click="startEditExpense(week.weekNumber - 1, week.expenses)"
            >
              {{ formatCompact(week.expenses) }}
            </span>
          </div>
          <div class="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-600">
            <span class="font-bold text-gray-600 dark:text-gray-300">Saldo</span>
            <span
              :class="[
                'font-bold',
                week.balance >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              ]"
            >
              {{ week.balance >= 0 ? '+' : '' }}{{ formatCompact(week.balance) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <div
      v-if="editingWeek !== null"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="cancelEdit"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl w-72">
        <h3 class="font-bold text-gray-800 dark:text-white mb-3">
          Editar Despesa - Semana {{ editingWeek + 1 }}
        </h3>
        <div class="relative mb-4">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
          <input
            v-model="editingValue"
            type="text"
            class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="saveExpense(editingWeek)"
            @keyup.escape="cancelEdit"
          >
        </div>
        <div class="flex gap-2">
          <button
            class="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            @click="cancelEdit"
          >
            Cancelar
          </button>
          <button
            class="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            @click="saveExpense(editingWeek)"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, nextTick } from 'vue'
import { useCashFlowStore } from '~/store/cashflow'

const store = useCashFlowStore()

const editingWeek = ref<number | null>(null)
const editingValue = ref('')

function startEditExpense(weekIndex: number, currentValue: number) {
  editingWeek.value = weekIndex
  editingValue.value = currentValue.toString()
  nextTick(() => {
    const input = document.querySelector(`input[type="text"]`) as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

function saveExpense(weekIndex: number) {
  const value = Number(editingValue.value.replace(/\D/g, '')) || 0
  store.setCustomWeekExpense(weekIndex, value)
  editingWeek.value = null
}

function cancelEdit() {
  editingWeek.value = null
}

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
