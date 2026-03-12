<template>
  <header class="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white py-4 px-6 mb-6 rounded-xl shadow-lg">
    <div class="relative max-w-6xl mx-auto">
      <div class="flex items-center justify-between">
        <!-- Logo and title -->
        <div class="flex items-center gap-4">
          <!-- Stone Logo -->
          <div class="w-10 h-10 bg-white rounded-xl shadow flex items-center justify-center">
            <svg
              class="w-6 h-6"
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

          <div>
            <h1 class="text-xl font-bold tracking-tight">
              Comparador de Investimentos
            </h1>
            <p class="text-emerald-100 text-xs">
              Ferramenta exclusiva para vendedores Stone
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang='ts'>
</script>
