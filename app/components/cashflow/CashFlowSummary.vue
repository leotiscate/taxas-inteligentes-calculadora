<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
    <!-- Section title -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
        <ion-icon
          name="stats-chart"
          class="text-white text-xl"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Resumo do Periodo
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Totais acumulados das 12 semanas
        </p>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <!-- Total Entradas -->
      <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
        <div class="w-10 h-10 mx-auto rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-2">
          <ion-icon
            name="arrow-down"
            class="text-green-600 dark:text-green-400 text-xl"
          />
        </div>
        <p class="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">
          Total Entradas
        </p>
        <p class="text-lg font-bold text-green-800 dark:text-green-200">
          {{ formatCurrency(store.result.summary.totalEntries) }}
        </p>
      </div>

      <!-- Total Despesas -->
      <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
        <div class="w-10 h-10 mx-auto rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-2">
          <ion-icon
            name="arrow-up"
            class="text-red-600 dark:text-red-400 text-xl"
          />
        </div>
        <p class="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
          Total Despesas
        </p>
        <p class="text-lg font-bold text-red-800 dark:text-red-200">
          {{ formatCurrency(store.result.summary.totalExpenses) }}
        </p>
      </div>

      <!-- Saldo Final -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
        <div class="w-10 h-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-2">
          <ion-icon
            name="wallet"
            class="text-blue-600 dark:text-blue-400 text-xl"
          />
        </div>
        <p class="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
          Saldo Final
        </p>
        <p
          :class="[
            'text-lg font-bold',
            store.result.summary.totalBalance >= 0
              ? 'text-blue-800 dark:text-blue-200'
              : 'text-red-800 dark:text-red-200'
          ]"
        >
          {{ formatCurrency(store.result.summary.totalBalance) }}
        </p>
      </div>

      <!-- Semanas Transição -->
      <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
        <div class="w-10 h-10 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mb-2">
          <ion-icon
            name="time"
            class="text-orange-600 dark:text-orange-400 text-xl"
          />
        </div>
        <p class="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
          Semanas Transicao
        </p>
        <p class="text-lg font-bold text-orange-800 dark:text-orange-200">
          {{ store.result.summary.transitionWeeks }} de 12
        </p>
      </div>
    </div>

    <!-- Info box -->
    <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
      <div class="flex items-start gap-3">
        <ion-icon
          name="information-circle"
          class="text-blue-500 text-xl mt-0.5 flex-shrink-0"
        />
        <div class="text-sm text-blue-800 dark:text-blue-300">
          <p class="font-semibold mb-1">Como interpretar:</p>
          <ul class="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
            <li>As <strong>semanas em laranja</strong> sao o periodo de transicao, onde o cliente recebe menos devido ao delay.</li>
            <li>Apos a transicao, as <strong>semanas em verde</strong> mostram o fluxo normalizado.</li>
            <li>Ajuste a <strong>data de ativacao</strong> para casar com periodos de menor despesa do cliente.</li>
            <li>O cliente pode precisar de <strong>capital de giro</strong> para cobrir as primeiras semanas.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useCashFlowStore } from '~/store/cashflow'

const store = useCashFlowStore()

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
</script>
