<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 mb-8 border border-gray-100 dark:border-gray-700">
    <!-- Section title -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
        <ion-icon
          name="options"
          class="text-white text-xl"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Parametros da Simulacao
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Ajuste os valores para comparar os produtos
        </p>
      </div>
    </div>

    <!-- Input grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
      <BillingInput />
      <PeriodSelect />
      <CdiRateInput />
      <CdbPercentInput />
      <CompromissadaPercentInput v-if="store.showCompromissada" />
      <DiscountInput />
    </div>

    <!-- Toggle Compromissada -->
    <div class="mt-4 flex items-center gap-3">
      <button
        type="button"
        :class="[
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
          store.showCompromissada ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
        ]"
        role="switch"
        :aria-checked="store.showCompromissada"
        @click="store.toggleCompromissada()"
      >
        <span
          :class="[
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            store.showCompromissada ? 'translate-x-5' : 'translate-x-0'
          ]"
        />
      </button>
      <span class="text-sm text-gray-600 dark:text-gray-300">
        Mostrar Compromissada
      </span>
    </div>

    <!-- Quick info -->
    <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
      <div class="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center gap-1">
          <ion-icon
            name="information-circle"
            class="text-blue-500"
          />
          <span>IR: 22,5% ate 180 dias | 20% ate 360 dias | 17,5% ate 720 dias | 15% acima</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useComparisonStore } from '~/store/comparison'
import BillingInput from '~/components/inputs/BillingInput.vue'
import PeriodSelect from '~/components/inputs/PeriodSelect.vue'
import CdiRateInput from '~/components/inputs/CdiRateInput.vue'
import CdbPercentInput from '~/components/inputs/CdbPercentInput.vue'
import CompromissadaPercentInput from '~/components/inputs/CompromissadaPercentInput.vue'
import DiscountInput from '~/components/inputs/DiscountInput.vue'

const store = useComparisonStore()
</script>
