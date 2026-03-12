<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <ComparisonHeader />
      <ComparisonInputs />
      <ComparisonGrid />
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
