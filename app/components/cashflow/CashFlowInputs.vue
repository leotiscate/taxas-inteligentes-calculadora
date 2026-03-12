<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 mb-8 border border-gray-100 dark:border-gray-700">
    <!-- Section title -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
        <ion-icon
          name="settings"
          class="text-white text-xl"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Parametros do Cliente
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Configure os dados de faturamento e despesas
        </p>
      </div>
    </div>

    <!-- Input grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Volume Total -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Faturamento Mensal
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
          <input
            type="text"
            :value="formatNumber(store.totalVolume)"
            class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            @input="handleVolumeInput"
          >
        </div>
      </div>

      <!-- Prazo Delay -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Prazo do Delay
        </label>
        <select
          :value="store.delayDays"
          class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
          @change="handleDelayChange"
        >
          <option :value="7">7 dias</option>
          <option :value="15">15 dias</option>
          <option :value="30">30 dias</option>
        </select>
      </div>

      <!-- Data Ativação -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Data de Ativacao
        </label>
        <input
          type="date"
          :value="formatDateForInput(store.activationDate)"
          class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          @input="handleDateChange"
        >
      </div>

      <!-- Contas a Pagar -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Despesas Semanais
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
          <input
            type="text"
            :value="formatNumber(store.weeklyExpenses)"
            class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            @input="handleExpensesInput"
          >
        </div>
      </div>
    </div>

    <!-- Distribuição por modalidade -->
    <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
      <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Distribuicao por Modalidade
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Débito -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-300">Debito</span>
            <span class="text-xs text-blue-600 dark:text-blue-400">{{ store.debitPercent }}%</span>
          </div>
          <input
            type="range"
            :value="store.debitPercent"
            min="0"
            max="100"
            class="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            @input="(e) => store.setDebitPercent(Number((e.target as HTMLInputElement).value))"
          >
          <p class="mt-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
            {{ formatCurrency(store.debitValue) }}
          </p>
        </div>

        <!-- Crédito -->
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-purple-700 dark:text-purple-300">Credito</span>
            <span class="text-xs text-purple-600 dark:text-purple-400">{{ store.creditPercent }}%</span>
          </div>
          <input
            type="range"
            :value="store.creditPercent"
            min="0"
            max="100"
            class="w-full h-2 bg-purple-200 dark:bg-purple-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            @input="(e) => store.setCreditPercent(Number((e.target as HTMLInputElement).value))"
          >
          <p class="mt-2 text-sm font-semibold text-purple-800 dark:text-purple-200">
            {{ formatCurrency(store.creditValue) }}
          </p>
        </div>

        <!-- PIX -->
        <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">PIX</span>
            <span class="text-xs text-emerald-600 dark:text-emerald-400">{{ store.pixPercent }}%</span>
          </div>
          <input
            type="range"
            :value="store.pixPercent"
            min="0"
            max="100"
            class="w-full h-2 bg-emerald-200 dark:bg-emerald-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            @input="(e) => store.setPixPercent(Number((e.target as HTMLInputElement).value))"
          >
          <p class="mt-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            {{ formatCurrency(store.pixValue) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useCashFlowStore } from '~/store/cashflow'

const store = useCashFlowStore()

function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR')
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

function parseNumber(value: string): number {
  return Number(value.replace(/\D/g, '')) || 0
}

function handleVolumeInput(e: Event) {
  const value = parseNumber((e.target as HTMLInputElement).value)
  store.setTotalVolume(value)
}

function handleExpensesInput(e: Event) {
  const value = parseNumber((e.target as HTMLInputElement).value)
  store.setWeeklyExpenses(value)
}

function handleDelayChange(e: Event) {
  const value = Number((e.target as HTMLSelectElement).value) as 7 | 15 | 30
  store.setDelayDays(value)
}

function handleDateChange(e: Event) {
  const value = (e.target as HTMLInputElement).value
  if (value) {
    store.setActivationDate(new Date(value))
  }
}
</script>
