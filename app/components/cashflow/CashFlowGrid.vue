<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-4 sm:p-5 mb-6 border border-gray-100 dark:border-gray-700">
    <!-- Section title compacto -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow">
          <ion-icon
            name="calendar"
            class="text-white text-base"
          />
        </div>
        <div>
          <h2 class="text-base font-bold text-gray-800 dark:text-white">
            Detalhamento Semanal
          </h2>
        </div>
      </div>

      <!-- Legenda compacta -->
      <div class="flex items-center gap-3 text-xs">
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-orange-400" />
          <span class="text-gray-500 dark:text-gray-400">Com impacto</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-green-400" />
          <span class="text-gray-500 dark:text-gray-400">Sem impacto</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span class="text-gray-500 dark:text-gray-400">PIX</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span class="text-gray-500 dark:text-gray-400">Deb</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span class="text-gray-500 dark:text-gray-400">Cred</span>
        </div>
      </div>
    </div>

    <!-- Weeks Grid - 4 colunas compactas -->
    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      <div
        v-for="week in store.result.weeks"
        :key="week.weekNumber"
        :class="[
          'rounded-lg p-2 border transition-all hover:shadow-sm',
          hasRealImpact(week)
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700',
        ]"
      >
        <!-- Week header -->
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-1.5">
            <h3
              :class="[
                'text-sm font-bold',
                hasRealImpact(week)
                  ? 'text-orange-800 dark:text-orange-300'
                  : 'text-green-800 dark:text-green-300',
              ]"
            >
              {{ getWeekLabel(week.weekNumber) }}
            </h3>
            <span
              v-if="hasRealImpact(week)"
              class="w-1.5 h-1.5 rounded-full bg-orange-400"
              title="Impacto do delay"
            />
          </div>
          <span class="text-[10px] text-gray-500 dark:text-gray-400">
            {{ formatDateRange(week.days) }}
          </span>
        </div>

        <!-- Days grid compacto -->
        <div class="grid grid-cols-7 gap-px mb-1.5">
          <div
            v-for="day in week.days"
            :key="day.date.toISOString()"
            :class="[
              'text-center py-1 rounded transition-all',
              day.isWeekend
                ? 'bg-gray-100 dark:bg-gray-700/50'
                : day.isReduced
                  ? 'bg-orange-100 dark:bg-orange-900/40'
                  : 'bg-green-100 dark:bg-green-900/40',
            ]"
            :title="getDayTooltip(day)"
          >
            <div
              :class="[
                'text-[9px] font-medium',
                day.isWeekend
                  ? 'text-gray-400 dark:text-gray-500'
                  : day.isReduced
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-green-600 dark:text-green-400',
              ]"
            >
              {{ day.dayOfWeekShort.charAt(0) }}
            </div>
            <div
              :class="[
                'text-[10px] font-bold',
                day.isWeekend
                  ? 'text-gray-500 dark:text-gray-400'
                  : day.isReduced
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-green-700 dark:text-green-300',
              ]"
            >
              {{ formatCompact(day.amount) }}
            </div>
          </div>
        </div>

        <!-- Breakdown por modalidade - compacto inline -->
        <div class="flex items-center justify-between text-[9px] mb-1.5 px-1">
          <div class="flex items-center gap-0.5">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span class="text-emerald-600 dark:text-emerald-400 font-semibold">{{ formatCompact(getWeekPix(week)) }}</span>
          </div>
          <div class="flex items-center gap-0.5">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span class="text-blue-600 dark:text-blue-400 font-semibold">{{ formatCompact(getWeekDebit(week)) }}</span>
          </div>
          <div class="flex items-center gap-0.5">
            <div class="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span class="text-purple-600 dark:text-purple-400 font-semibold">{{ formatCompact(getWeekCredit(week)) }}</span>
          </div>
        </div>

        <!-- Week totals compacto -->
        <div class="grid grid-cols-3 gap-1 pt-1.5 border-t border-gray-200 dark:border-gray-600">
          <div class="text-center">
            <div class="text-[8px] text-gray-400 uppercase">
              Receb.
            </div>
            <div class="text-xs font-bold text-green-600 dark:text-green-400">
              +{{ formatCompact(week.totalEntries) }}
            </div>
          </div>
          <div
            class="text-center cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/50 rounded -mx-0.5 px-0.5"
            title="Clique para editar"
            @click="startEditExpense(week.weekNumber - 1, week.expenses)"
          >
            <div class="text-[8px] text-gray-400 uppercase">
              Desp.
            </div>
            <div class="text-xs font-bold text-red-600 dark:text-red-400">
              -{{ formatCompact(week.expenses) }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-[8px] text-gray-400 uppercase">
              Saldo
            </div>
            <div
              :class="[
                'text-xs font-bold',
                week.balance >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300',
              ]"
            >
              {{ week.balance >= 0 ? '+' : '' }}{{ formatCompact(week.balance) }}
            </div>
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
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl w-80">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Editar Despesa - Semana {{ editingWeek + 1 }}
        </h3>
        <div class="relative mb-4">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">R$</span>
          <input
            v-model="editingValue"
            type="text"
            class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white font-semibold text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="saveExpense(editingWeek)"
            @keyup.escape="cancelEdit"
          >
        </div>
        <div class="flex gap-3">
          <button
            class="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            @click="cancelEdit"
          >
            Cancelar
          </button>
          <button
            class="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
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
import { ref, nextTick, computed } from 'vue'
import { useCashFlowStore } from '~/store/cashflow'
import type { DayReceipt, WeekCashFlow } from '~/types/cashflow'

const store = useCashFlowStore()

const editingWeek = ref<number | null>(null)
const editingValue = ref('')

// Calcula o valor esperado sem delay para comparar
const expectedWeeklyEntries = computed(() => {
  const dailyDebit = (store.totalVolume * (store.debitPercent / 100)) / 22
  const dailyCredit = (store.totalVolume * (store.creditPercent / 100)) / 22
  const dailyPix = (store.totalVolume * (store.pixPercent / 100)) / 30
  return (dailyDebit + dailyCredit + dailyPix) * 5 + dailyPix * 2
})

// Verifica se a semana tem impacto real (recebimentos abaixo do esperado)
function hasRealImpact(week: WeekCashFlow): boolean {
  const threshold = expectedWeeklyEntries.value * 0.95
  return week.totalEntries < threshold
}

const monthNames = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

function getWeekLabel(weekNumber: number): string {
  // Calcula a data de inicio da semana baseada na data de ativacao
  const activationDate = new Date(store.activationDate)
  const weekStartDate = new Date(activationDate)
  weekStartDate.setDate(activationDate.getDate() + (weekNumber - 1) * 7)

  // Calcula qual semana do mes (1-5)
  const dayOfMonth = weekStartDate.getDate()
  const weekOfMonth = Math.ceil(dayOfMonth / 7)

  // Pega o mes
  const month = monthNames[weekStartDate.getMonth()]

  return `S${weekOfMonth} ${month}`
}

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

function formatDateRange(days: DayReceipt[]): string {
  if (days.length === 0) return ''
  const first = days[0]
  const last = days[days.length - 1]
  if (!first || !last) return ''
  return `${formatDate(first.date)} - ${formatDate(last.date)}`
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toLocaleString('pt-BR', {
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

function getWeekPix(week: WeekCashFlow): number {
  return week.days.reduce((sum, day) => sum + (day.pixAmount || 0), 0)
}

function getWeekDebit(week: WeekCashFlow): number {
  return week.days.reduce((sum, day) => sum + (day.debitAmount || 0), 0)
}

function getWeekCredit(week: WeekCashFlow): number {
  return week.days.reduce((sum, day) => sum + (day.creditAmount || 0), 0)
}

function getDayTooltip(day: DayReceipt): string {
  const parts = [
    `${day.dayOfWeek} - ${formatDate(day.date)}`,
    `Total: R$ ${day.amount.toLocaleString('pt-BR')}`,
  ]
  if (day.pixAmount > 0) {
    parts.push(`PIX: R$ ${day.pixAmount.toLocaleString('pt-BR')}`)
  }
  if (day.debitAmount > 0) {
    parts.push(`Debito: R$ ${day.debitAmount.toLocaleString('pt-BR')}`)
  }
  if (day.creditAmount > 0) {
    parts.push(`Credito: R$ ${day.creditAmount.toLocaleString('pt-BR')}`)
  }
  return parts.join('\n')
}
</script>
