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

    <!-- Taxa Inteligente destacada primeiro -->
    <div
      v-if="taxaInteligenteResult"
      class="mb-6"
    >
      <ProductCard
        :product="taxaInteligenteResult"
        :featured="true"
        class="animate-fade-in-up"
      />
    </div>

    <!-- Demais cards em grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <ProductCard
        v-for="(product, index) in otherResults"
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

const taxaInteligenteResult = computed(() =>
  store.results.find(r => r.type === 'taxaInteligente'),
)

const otherResults = computed(() =>
  store.results.filter(r => r.type !== 'taxaInteligente'),
)
</script>
