<template>
  <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
    <!-- Section title -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
        <ion-icon
          name="school"
          class="text-white text-xl"
        />
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Entenda os Calculos
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Como funcionam IOF e IR nos investimentos
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            IOF - Imposto sobre Operacoes Financeiras
          </h3>
        </div>

        <p class="text-sm text-orange-700 dark:text-orange-400 mb-4">
          O IOF incide sobre o rendimento e diminui a cada dia, zerando apos 30 dias.
        </p>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
            Tabela Regressiva de IOF
          </p>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Dia 1</span>
              <span class="font-semibold text-orange-600">96%</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Dia 7</span>
              <span class="font-semibold text-orange-600">76%</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Dia 15</span>
              <span class="font-semibold text-orange-600">50%</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Dia 30</span>
              <span class="font-semibold text-green-600">0%</span>
            </div>
          </div>
        </div>

        <div class="mt-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <p class="text-xs text-orange-800 dark:text-orange-300">
            <strong>Importante:</strong> Compromissada e Taxa Inteligente nao tem IOF.
          </p>
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
            IR - Imposto de Renda
          </h3>
        </div>

        <p class="text-sm text-red-700 dark:text-red-400 mb-4">
          O IR incide sobre o rendimento (apos descontar IOF) e diminui conforme o prazo.
        </p>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
            Tabela Regressiva de IR
          </p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">Ate 180 dias</span>
              <span class="font-semibold text-red-600">22,5%</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">181 a 360 dias</span>
              <span class="font-semibold text-red-600">20%</span>
            </div>
            <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-400">361 a 720 dias</span>
              <span class="font-semibold text-red-600">17,5%</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-gray-600 dark:text-gray-400">Acima de 720 dias</span>
              <span class="font-semibold text-green-600">15%</span>
            </div>
          </div>
        </div>

        <div class="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <p class="text-xs text-red-800 dark:text-red-300">
            <strong>Importante:</strong> Taxa Inteligente nao tem IR pois e um desconto, nao rendimento.
          </p>
        </div>
      </div>
    </div>

    <!-- Formula Section -->
    <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <ion-icon
            name="code-slash"
            class="text-white"
          />
        </div>
        <h3 class="font-bold text-blue-800 dark:text-blue-300">
          Formula do Calculo
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">CDB / COMPROMISSADA</p>
          <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p><span class="text-green-600 font-medium">Bruto</span> = Capital x (1 + CDI)^dias - Capital</p>
            <p><span class="text-orange-600 font-medium">IOF</span> = Bruto x %IOF <span class="text-gray-400">(so CDB)</span></p>
            <p><span class="text-red-600 font-medium">IR</span> = (Bruto - IOF) x %IR</p>
            <p><span class="text-blue-600 font-medium">Liquido</span> = Bruto - IOF - IR</p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">TAXA INTELIGENTE</p>
          <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p><span class="text-emerald-600 font-medium">Desconto</span> = Faturamento x %Desconto</p>
            <p class="text-gray-500 dark:text-gray-400 text-xs mt-2">
              Sem IOF e sem IR - desconto direto na taxa da maquininha
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
</script>
