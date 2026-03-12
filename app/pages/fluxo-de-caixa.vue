<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
    <!-- Background decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
    </div>

    <!-- Main content -->
    <div class="relative py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <ion-icon name="calendar" />
            Simulador de Fluxo de Caixa
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Fluxo de Caixa - Taxas Inteligentes
          </h1>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Simule o impacto da ativacao das Taxas Inteligentes no fluxo de caixa do cliente
          </p>
        </div>

        <!-- Navigation -->
        <div class="flex justify-center mb-8">
          <nav class="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-lg">
            <NuxtLink
              to="/"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Comparador
            </NuxtLink>
            <NuxtLink
              to="/fluxo-de-caixa"
              class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white"
            >
              Fluxo de Caixa
            </NuxtLink>
          </nav>
        </div>

        <!-- Inputs Section -->
        <CashFlowInputs />

        <!-- Weekly Grid -->
        <CashFlowGrid />

        <!-- Summary -->
        <CashFlowSummary />

        <!-- Footer -->
        <footer class="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p class="flex items-center justify-center gap-2">
            <ion-icon
              name="shield-checkmark"
              class="text-blue-500"
            />
            Calculadora desenvolvida para uso interno Stone
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import CashFlowInputs from '~/components/cashflow/CashFlowInputs.vue'
import CashFlowGrid from '~/components/cashflow/CashFlowGrid.vue'
import CashFlowSummary from '~/components/cashflow/CashFlowSummary.vue'

useSeoMeta({
  title: 'Fluxo de Caixa - Taxas Inteligentes',
  description: 'Simule o impacto das Taxas Inteligentes no fluxo de caixa do cliente',
})
</script>
