<template>
  <div>
    <!-- Section title -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
        <ion-icon
          name="grid"
          class="text-white text-xl"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Comparacao de Produtos
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Analise lado a lado
        </p>
      </div>
    </div>

    <!-- Cards grid - 4 colunas lado a lado -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <ProductCard
        v-for="(product, index) in sortedResults"
        :key="product.type"
        :product="product"
        class="animate-fade-in-up opacity-0"
        :class="`stagger-${index + 1}`"
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useComparisonStore } from '~/store/comparison'
import ProductCard from '~/components/cards/ProductCard.vue'

const store = useComparisonStore()

const sortedResults = computed(() => store.results)
</script>
