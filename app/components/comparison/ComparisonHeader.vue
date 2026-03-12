<template>
  <header class="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white py-8 px-6 mb-8 rounded-2xl shadow-2xl">
    <!-- Background pattern -->
    <div class="absolute inset-0 pattern-dots opacity-30" />

    <!-- Decorative circles -->
    <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
    <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

    <div class="relative max-w-6xl mx-auto">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
        <!-- Logo and title -->
        <div class="flex items-center gap-5">
          <!-- Stone Logo -->
          <div class="relative">
            <div class="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
              <svg
                class="w-10 h-10"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M20 4L4 12v16l16 8 16-8V12L20 4z"
                  fill="#00A868"
                />
                <path
                  d="M20 4L4 12l16 8 16-8L20 4z"
                  fill="#00C77B"
                />
                <path
                  d="M20 20l-16-8v16l16 8V20z"
                  fill="#008552"
                />
                <text
                  x="20"
                  y="26"
                  text-anchor="middle"
                  fill="white"
                  font-size="14"
                  font-weight="bold"
                >S</text>
              </svg>
            </div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <ion-icon
                name="star"
                class="text-yellow-800 text-xs"
              />
            </div>
          </div>

          <div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">
              Comparador de Investimentos
            </h1>
            <p class="text-emerald-100 text-sm sm:text-base mt-1 flex items-center gap-2">
              <ion-icon
                name="shield-checkmark"
                class="text-emerald-200"
              />
              Ferramenta exclusiva para vendedores Stone
            </p>
          </div>
        </div>

        <!-- Stats badges -->
        <div class="flex gap-3">
          <div class="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/20">
            <p class="text-2xl font-bold">4</p>
            <p class="text-xs text-emerald-100">Produtos</p>
          </div>
          <div class="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center border border-white/20">
            <p class="text-2xl font-bold">
              <ion-icon name="trending-up" />
            </p>
            <p class="text-xs text-emerald-100">Tempo Real</p>
          </div>
        </div>
      </div>

      <!-- Subtitle bar -->
      <div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div class="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
          <ion-icon
            name="calculator"
            class="text-emerald-200"
          />
          <span>Calculos precisos com 252 dias uteis</span>
        </div>
        <div class="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
          <ion-icon
            name="flash"
            class="text-yellow-300"
          />
          <span>Comparacao instantanea</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang='ts'>
</script>
