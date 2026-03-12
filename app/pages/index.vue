<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
    <!-- Background decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
    </div>

    <!-- Main content -->
    <div class="relative py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <ComparisonHeader />
        <ComparisonInputs />
        <ComparisonGrid />

        <!-- Footer -->
        <footer class="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p class="flex items-center justify-center gap-2">
            <ion-icon name="shield-checkmark" class="text-emerald-500" />
            Calculadora desenvolvida para uso interno Stone
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import ComparisonHeader from '~/components/comparison/ComparisonHeader.vue'
import ComparisonInputs from '~/components/comparison/ComparisonInputs.vue'
import ComparisonGrid from '~/components/comparison/ComparisonGrid.vue'

useSeoMeta({
  title: 'Comparador de Investimentos',
  description: 'Compare CDB, Compromissada, Aplicacao Automatica e Taxa Inteligente Stone para encontrar a melhor opcao para seu cliente',
})
</script>
