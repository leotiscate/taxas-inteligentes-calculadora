<template>
  <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 border border-gray-100 dark:border-gray-700 overflow-hidden">
    <!-- Section header (clickable) -->
    <button
      class="w-full p-6 sm:p-8 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
          <ion-icon
            name="school"
            class="text-white text-xl"
          />
        </div>
        <div class="text-left">
          <h2 class="text-lg font-bold text-gray-800 dark:text-white">
            Entenda os Calculos
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Guia completo sobre impostos e investimentos
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
          {{ isOpen ? 'Clique para ocultar' : 'Clique para expandir' }}
        </span>
        <ion-icon
          :name="isOpen ? 'chevron-up' : 'chevron-down'"
          class="text-gray-400 text-xl transition-transform"
        />
      </div>
    </button>

    <!-- Collapsible content -->
    <div
      v-show="isOpen"
      class="px-6 sm:px-8 pb-6 sm:pb-8"
    >

    <!-- What is IOF and IR -->
    <div class="mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
      <h3 class="font-bold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center gap-2">
        <ion-icon name="help-circle" />
        O que sao IOF e IR?
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
          <p class="font-semibold text-orange-600 dark:text-orange-400 mb-2">IOF - Imposto sobre Operacoes Financeiras</p>
          <p class="text-gray-600 dark:text-gray-400">
            E um imposto federal que incide sobre operacoes de credito, cambio e seguros.
            Em investimentos de renda fixa, ele "pune" resgates muito rapidos - quanto mais cedo voce resgatar, maior o imposto.
            <strong class="text-gray-800 dark:text-gray-200"> Apos 30 dias, o IOF zera completamente.</strong>
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
          <p class="font-semibold text-red-600 dark:text-red-400 mb-2">IR - Imposto de Renda</p>
          <p class="text-gray-600 dark:text-gray-400">
            E o imposto sobre os ganhos (rendimentos) do investimento.
            Ele segue uma tabela regressiva: quanto mais tempo voce deixar o dinheiro investido, menor sera a aliquota.
            <strong class="text-gray-800 dark:text-gray-200"> Varia de 22,5% (curto prazo) ate 15% (longo prazo).</strong>
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- IOF Section -->
      <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <ion-icon
              name="time"
              class="text-white"
            />
          </div>
          <h3 class="font-bold text-orange-800 dark:text-orange-300">
            Tabela de IOF
          </h3>
        </div>

        <p class="text-sm text-orange-700 dark:text-orange-400 mb-4">
          O IOF diminui 3% a cada dia. Veja alguns marcos importantes:
        </p>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Dia 1</span>
              <span class="font-semibold text-red-600">96%</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Dia 7</span>
              <span class="font-semibold text-orange-600">76%</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Dia 15</span>
              <span class="font-semibold text-yellow-600">50%</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Dia 30</span>
              <span class="font-semibold text-green-600">0%</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-start gap-2 text-xs text-orange-800 dark:text-orange-300">
            <ion-icon name="checkmark-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Compromissada:</strong> Nao tem IOF (isenta)</span>
          </div>
          <div class="flex items-start gap-2 text-xs text-orange-800 dark:text-orange-300">
            <ion-icon name="checkmark-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Taxa Inteligente:</strong> Nao tem IOF (e desconto, nao rendimento)</span>
          </div>
          <div class="flex items-start gap-2 text-xs text-orange-800 dark:text-orange-300">
            <ion-icon name="alert-circle" class="text-orange-500 mt-0.5 flex-shrink-0" />
            <span><strong>CDB e App. Automatica:</strong> Tem IOF nos primeiros 30 dias</span>
          </div>
        </div>
      </div>

      <!-- IR Section -->
      <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
            <ion-icon
              name="calculator"
              class="text-white"
            />
          </div>
          <h3 class="font-bold text-red-800 dark:text-red-300">
            Tabela de IR
          </h3>
        </div>

        <p class="text-sm text-red-700 dark:text-red-400 mb-4">
          O IR e calculado sobre o rendimento liquido (apos descontar IOF):
        </p>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Ate 180 dias (6 meses)</span>
              <span class="font-semibold text-red-600">22,5%</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">181 a 360 dias (1 ano)</span>
              <span class="font-semibold text-orange-600">20%</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">361 a 720 dias (2 anos)</span>
              <span class="font-semibold text-yellow-600">17,5%</span>
            </div>
            <div class="flex justify-between py-1.5">
              <span class="text-gray-600 dark:text-gray-400">Acima de 720 dias</span>
              <span class="font-semibold text-green-600">15%</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-start gap-2 text-xs text-red-800 dark:text-red-300">
            <ion-icon name="information-circle" class="text-blue-500 mt-0.5 flex-shrink-0" />
            <span>O IR e retido na fonte no momento do resgate</span>
          </div>
          <div class="flex items-start gap-2 text-xs text-red-800 dark:text-red-300">
            <ion-icon name="checkmark-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Taxa Inteligente:</strong> Nao tem IR (e desconto direto)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Practical Example -->
    <div class="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <ion-icon
            name="bulb"
            class="text-white"
          />
        </div>
        <h3 class="font-bold text-blue-800 dark:text-blue-300">
          Exemplo Pratico
        </h3>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Imagine um cliente com <strong>R$ 1.000.000</strong> de faturamento, investindo por <strong>7 dias</strong> a <strong>100% do CDI (13,65% a.a.)</strong>:
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <p class="font-semibold text-blue-800 dark:text-blue-300 mb-2">CDB</p>
            <div class="space-y-1 text-blue-700 dark:text-blue-400">
              <p>1. Rendimento bruto: ~R$ 2.456</p>
              <p>2. IOF (76% no dia 7): <span class="text-orange-600">-R$ 1.867</span></p>
              <p>3. Base para IR: R$ 589</p>
              <p>4. IR (22,5%): <span class="text-red-600">-R$ 132</span></p>
              <p class="font-bold pt-1 border-t border-blue-200 dark:border-blue-700">Liquido: R$ 456</p>
            </div>
          </div>

          <div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <p class="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Taxa Inteligente (0,15%)</p>
            <div class="space-y-1 text-emerald-700 dark:text-emerald-400">
              <p>1. Faturamento: R$ 1.000.000</p>
              <p>2. Desconto: 0,15%</p>
              <p>3. IOF: <span class="text-green-600">R$ 0 (isento)</span></p>
              <p>4. IR: <span class="text-green-600">R$ 0 (isento)</span></p>
              <p class="font-bold pt-1 border-t border-emerald-200 dark:border-emerald-700">Desconto: R$ 1.500</p>
            </div>
          </div>
        </div>

        <div class="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <p class="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
            <ion-icon name="trending-up" class="text-lg mt-0.5 flex-shrink-0" />
            <span>
              <strong>Conclusao:</strong> Neste exemplo, a Taxa Inteligente gera <strong>R$ 1.500</strong> de economia,
              enquanto o CDB gera apenas <strong>R$ 456</strong> liquidos - uma diferenca de mais de 3x!
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Why short-term is bad -->
    <div class="mb-8 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
          <ion-icon
            name="warning"
            class="text-white"
          />
        </div>
        <h3 class="font-bold text-amber-800 dark:text-amber-300">
          Por que investimentos de curto prazo rendem pouco?
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3">
            <ion-icon name="time" class="text-orange-500 text-xl" />
          </div>
          <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">IOF Alto</h4>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Nos primeiros dias, o IOF consome quase todo o rendimento. No dia 1, voce perde 96% do que ganhou!
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
            <ion-icon name="calculator" class="text-red-500 text-xl" />
          </div>
          <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">IR Maximo</h4>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Ate 180 dias, a aliquota e a maxima: 22,5%. So apos 2 anos voce chega nos 15%.
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
            <ion-icon name="trending-down" class="text-blue-500 text-xl" />
          </div>
          <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">Juros Compostos</h4>
          <p class="text-xs text-gray-600 dark:text-gray-400">
            Com poucos dias, os juros compostos mal comecam a fazer efeito. O rendimento bruto ja e baixo.
          </p>
        </div>
      </div>
    </div>

    <!-- Products comparison -->
    <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center">
          <ion-icon
            name="git-compare"
            class="text-white"
          />
        </div>
        <h3 class="font-bold text-gray-800 dark:text-gray-300">
          Resumo dos Produtos
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-2 px-3 font-semibold text-gray-600 dark:text-gray-400">Produto</th>
              <th class="text-center py-2 px-3 font-semibold text-gray-600 dark:text-gray-400">IOF</th>
              <th class="text-center py-2 px-3 font-semibold text-gray-600 dark:text-gray-400">IR</th>
              <th class="text-left py-2 px-3 font-semibold text-gray-600 dark:text-gray-400">Melhor para</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td class="py-2 px-3 font-medium text-blue-600 dark:text-blue-400">CDB</td>
              <td class="py-2 px-3 text-center"><span class="text-orange-500">Sim</span></td>
              <td class="py-2 px-3 text-center"><span class="text-red-500">Sim</span></td>
              <td class="py-2 px-3 text-gray-600 dark:text-gray-400">Prazos maiores (30+ dias)</td>
            </tr>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td class="py-2 px-3 font-medium text-purple-600 dark:text-purple-400">Compromissada</td>
              <td class="py-2 px-3 text-center"><span class="text-green-500">Nao</span></td>
              <td class="py-2 px-3 text-center"><span class="text-red-500">Sim</span></td>
              <td class="py-2 px-3 text-gray-600 dark:text-gray-400">Prazos curtos (sem IOF)</td>
            </tr>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td class="py-2 px-3 font-medium text-amber-600 dark:text-amber-400">App. Automatica</td>
              <td class="py-2 px-3 text-center"><span class="text-orange-500">Sim</span></td>
              <td class="py-2 px-3 text-center"><span class="text-red-500">Sim</span></td>
              <td class="py-2 px-3 text-gray-600 dark:text-gray-400">Evitar! Rende apenas 20% CDI</td>
            </tr>
            <tr>
              <td class="py-2 px-3 font-medium text-emerald-600 dark:text-emerald-400">Taxa Inteligente</td>
              <td class="py-2 px-3 text-center"><span class="text-green-500">Nao</span></td>
              <td class="py-2 px-3 text-center"><span class="text-green-500">Nao</span></td>
              <td class="py-2 px-3 text-gray-600 dark:text-gray-400">Qualquer prazo - desconto direto</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'

const isOpen = ref(false)
</script>
