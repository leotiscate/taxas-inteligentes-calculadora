<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-white/5 p-6 sm:p-8 mb-8 border border-gray-100 dark:border-gray-700">
    <!-- Header com resumo -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <ion-icon
            name="analytics"
            class="text-white text-xl"
          />
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-800 dark:text-white">
            Analise de Fluxo de Caixa
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Visualizacao do impacto ao longo do tempo
          </p>
        </div>
      </div>

      <!-- Summary badges -->
      <div class="flex flex-wrap gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
          <div class="w-2 h-2 rounded-full bg-green-500" />
          Entradas: {{ formatCurrency(store.result.summary.totalEntries) }}
        </span>
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
          <div class="w-2 h-2 rounded-full bg-red-500" />
          Despesas: {{ formatCurrency(store.result.summary.totalExpenses) }}
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          :class="store.result.summary.totalBalance >= 0
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'"
        >
          <div
            class="w-2 h-2 rounded-full"
            :class="store.result.summary.totalBalance >= 0 ? 'bg-blue-500' : 'bg-red-500'"
          />
          Saldo: {{ formatCurrency(store.result.summary.totalBalance) }}
        </span>
      </div>
    </div>

    <!-- SVG Chart -->
    <div
      ref="chartContainer"
      class="relative"
    >
      <svg
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        class="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        @mouseleave="hoveredWeek = null"
      >
        <!-- Defs para gradientes -->
        <defs>
          <!-- Gradiente para area de entradas normal -->
          <linearGradient
            id="entriesGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#10B981"
              stop-opacity="0.7"
            />
            <stop
              offset="100%"
              stop-color="#10B981"
              stop-opacity="0.1"
            />
          </linearGradient>

          <!-- Gradiente para area de entradas com impacto -->
          <linearGradient
            id="impactGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#F59E0B"
              stop-opacity="0.7"
            />
            <stop
              offset="100%"
              stop-color="#F59E0B"
              stop-opacity="0.1"
            />
          </linearGradient>

          <!-- Gradiente para area de deficit -->
          <linearGradient
            id="deficitGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#EF4444"
              stop-opacity="0.3"
            />
            <stop
              offset="100%"
              stop-color="#EF4444"
              stop-opacity="0.05"
            />
          </linearGradient>

          <!-- Gradiente para saldo acumulado positivo -->
          <linearGradient
            id="balanceGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#6366F1"
              stop-opacity="0.3"
            />
            <stop
              offset="100%"
              stop-color="#6366F1"
              stop-opacity="0.05"
            />
          </linearGradient>
        </defs>

        <!-- Grid de fundo -->
        <g class="grid-lines">
          <!-- Linhas horizontais -->
          <line
            v-for="(line, i) in horizontalGridLines"
            :key="`h-${i}`"
            :x1="chartPadding.left"
            :y1="line.y"
            :x2="svgWidth - chartPadding.right"
            :y2="line.y"
            class="stroke-gray-200 dark:stroke-gray-700"
            stroke-width="1"
            stroke-dasharray="4,4"
          />

          <!-- Linha zero (se existir deficit) -->
          <line
            v-if="hasDeficit"
            :x1="chartPadding.left"
            :y1="zeroLineY"
            :x2="svgWidth - chartPadding.right"
            :y2="zeroLineY"
            class="stroke-gray-400 dark:stroke-gray-500"
            stroke-width="2"
          />
        </g>

        <!-- Area de deficit (saldo negativo) -->
        <path
          v-if="deficitAreaPath"
          :d="deficitAreaPath"
          fill="url(#deficitGradient)"
          class="transition-all duration-500"
        />

        <!-- Area de entradas -->
        <g class="entries-areas">
          <path
            v-for="(segment, i) in entryAreaSegments"
            :key="`entry-${i}`"
            :d="segment.path"
            :fill="segment.hasImpact ? 'url(#impactGradient)' : 'url(#entriesGradient)'"
            class="transition-all duration-500"
          />
        </g>

        <!-- Linha de despesas (tracejada) -->
        <line
          :x1="chartPadding.left"
          :y1="expensesLineY"
          :x2="svgWidth - chartPadding.right"
          :y2="expensesLineY"
          class="stroke-red-500"
          stroke-width="2"
          stroke-dasharray="8,4"
        />

        <!-- Linha de saldo acumulado -->
        <path
          :d="balanceLinePath"
          fill="none"
          class="stroke-indigo-500"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Marcadores de saldo acumulado -->
        <g class="balance-markers">
          <circle
            v-for="(point, i) in balancePoints"
            :key="`bal-${i}`"
            :cx="point.x"
            :cy="point.y"
            r="5"
            :class="point.value >= 0
              ? 'fill-indigo-500 stroke-white dark:stroke-gray-800'
              : 'fill-red-500 stroke-white dark:stroke-gray-800'"
            stroke-width="2"
          />
        </g>

        <!-- Areas interativas (hover zones) -->
        <g class="hover-zones">
          <rect
            v-for="(zone, i) in hoverZones"
            :key="`zone-${i}`"
            :x="zone.x"
            :y="chartPadding.top"
            :width="zone.width"
            :height="chartHeight"
            fill="transparent"
            class="cursor-pointer"
            @mouseenter="hoveredWeek = zone.week"
            @mousemove="updateTooltipPosition($event)"
          />
        </g>

        <!-- Indicador de semana hover -->
        <rect
          v-if="hoveredWeek"
          :x="getWeekX(hoveredWeek.weekNumber) - weekWidth / 2"
          :y="chartPadding.top"
          :width="weekWidth"
          :height="chartHeight"
          class="fill-gray-500/10 dark:fill-white/5"
        />

        <!-- Eixo Y - Labels -->
        <g class="y-axis-labels">
          <text
            v-for="(line, i) in horizontalGridLines"
            :key="`y-label-${i}`"
            :x="chartPadding.left - 8"
            :y="line.y + 4"
            text-anchor="end"
            class="text-xs fill-gray-500 dark:fill-gray-400"
          >
            {{ formatCompact(line.value) }}
          </text>
        </g>

        <!-- Eixo X - Labels das semanas -->
        <g class="x-axis-labels">
          <text
            v-for="week in store.result.weeks"
            :key="`x-label-${week.weekNumber}`"
            :x="getWeekX(week.weekNumber)"
            :y="svgHeight - chartPadding.bottom + 20"
            text-anchor="middle"
            class="text-xs fill-gray-500 dark:fill-gray-400"
          >
            S{{ week.weekNumber }}
          </text>

          <!-- Indicador de impacto abaixo da label -->
          <circle
            v-for="week in impactedWeeks"
            :key="`impact-${week.weekNumber}`"
            :cx="getWeekX(week.weekNumber)"
            :cy="svgHeight - chartPadding.bottom + 32"
            r="3"
            class="fill-orange-400"
          />
        </g>

        <!-- Marcador de transicao (primeira semana normalizada) -->
        <g
          v-if="firstNormalWeek && impactedWeeks.length > 0"
          class="transition-marker"
        >
          <line
            :x1="getWeekX(firstNormalWeek) - weekWidth / 2"
            :y1="chartPadding.top"
            :x2="getWeekX(firstNormalWeek) - weekWidth / 2"
            :y2="svgHeight - chartPadding.bottom"
            class="stroke-green-500"
            stroke-width="2"
            stroke-dasharray="4,4"
          />
          <rect
            :x="getWeekX(firstNormalWeek) - weekWidth / 2 - 45"
            :y="chartPadding.top - 10"
            width="90"
            height="20"
            rx="4"
            class="fill-green-500"
          />
          <text
            :x="getWeekX(firstNormalWeek) - weekWidth / 2"
            :y="chartPadding.top + 4"
            text-anchor="middle"
            class="text-[10px] fill-white font-semibold"
          >
            Normalizado
          </text>
        </g>
      </svg>

      <!-- Tooltip -->
      <Transition name="fade">
        <div
          v-if="hoveredWeek"
          ref="tooltip"
          class="absolute pointer-events-none z-10 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[220px]"
          :style="tooltipStyle"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="font-bold text-gray-800 dark:text-white">Semana {{ hoveredWeek.weekNumber }}</span>
            <span
              v-if="hasRealImpact(hoveredWeek)"
              class="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
            >
              Impacto
            </span>
          </div>

          <div class="space-y-2 text-sm">
            <!-- Entradas -->
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div class="w-2 h-2 rounded-full bg-green-500" />
                Entradas
              </span>
              <span class="font-semibold text-green-600 dark:text-green-400">
                +{{ formatCurrency(hoveredWeek.totalEntries) }}
              </span>
            </div>

            <!-- Despesas -->
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div class="w-2 h-2 rounded-full bg-red-500" />
                Despesas
              </span>
              <span class="font-semibold text-red-600 dark:text-red-400">
                -{{ formatCurrency(hoveredWeek.expenses) }}
              </span>
            </div>

            <!-- Saldo -->
            <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="hoveredWeek.balance >= 0 ? 'bg-indigo-500' : 'bg-red-500'"
                />
                Saldo
              </span>
              <span
                class="font-bold"
                :class="hoveredWeek.balance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'"
              >
                {{ hoveredWeek.balance >= 0 ? '+' : '' }}{{ formatCurrency(hoveredWeek.balance) }}
              </span>
            </div>

            <!-- Saldo acumulado -->
            <div class="flex items-center justify-between">
              <span class="text-gray-500 dark:text-gray-500 text-xs">Saldo Acumulado</span>
              <span
                class="font-semibold text-xs"
                :class="getAccumulatedBalance(hoveredWeek.weekNumber) >= 0
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-red-600 dark:text-red-400'"
              >
                {{ getAccumulatedBalance(hoveredWeek.weekNumber) >= 0 ? '+' : '' }}{{ formatCurrency(getAccumulatedBalance(hoveredWeek.weekNumber)) }}
              </span>
            </div>

            <!-- Breakdown por modalidade -->
            <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div class="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Breakdown
              </div>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    PIX
                  </div>
                  <div class="font-semibold text-gray-700 dark:text-gray-300">
                    {{ formatCompact(getWeekPix(hoveredWeek)) }}
                  </div>
                </div>
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
                    <div class="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Debito
                  </div>
                  <div class="font-semibold text-gray-700 dark:text-gray-300">
                    {{ formatCompact(getWeekDebit(hoveredWeek)) }}
                  </div>
                </div>
                <div class="text-center">
                  <div class="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400">
                    <div class="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Credito
                  </div>
                  <div class="font-semibold text-gray-700 dark:text-gray-300">
                    {{ formatCompact(getWeekCredit(hoveredWeek)) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2">
        <div class="w-4 h-3 rounded-sm bg-gradient-to-b from-green-500/70 to-green-500/10" />
        <span class="text-xs text-gray-600 dark:text-gray-400">Entradas</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-3 rounded-sm bg-gradient-to-b from-orange-400/70 to-orange-400/10" />
        <span class="text-xs text-gray-600 dark:text-gray-400">Impacto do delay</span>
      </div>
      <div class="flex items-center gap-2">
        <div
          class="w-4 h-0.5 bg-red-500"
          style="border-style: dashed;"
        />
        <span class="text-xs text-gray-600 dark:text-gray-400">Despesas</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-0.5 bg-indigo-500 rounded-full" />
        <span class="text-xs text-gray-600 dark:text-gray-400">Saldo Acumulado</span>
      </div>
      <div
        v-if="hasDeficit"
        class="flex items-center gap-2"
      >
        <div class="w-4 h-3 rounded-sm bg-gradient-to-b from-red-500/30 to-red-500/5" />
        <span class="text-xs text-gray-600 dark:text-gray-400">Deficit</span>
      </div>
    </div>

    <!-- Capital de giro necessario (se houver deficit) -->
    <div
      v-if="hasDeficit"
      class="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
          <ion-icon
            name="wallet"
            class="text-white text-xl"
          />
        </div>
        <div>
          <div class="text-sm font-semibold text-red-800 dark:text-red-300">
            Capital de Giro Necessario
          </div>
          <div class="text-2xl font-bold text-red-600 dark:text-red-400">
            {{ formatCurrency(maxDeficit) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Insight box -->
    <div
      class="mt-6 p-4 rounded-xl"
      :class="insightClass"
    >
      <div class="flex items-start gap-3">
        <ion-icon
          :name="insightIcon"
          class="text-xl mt-0.5 flex-shrink-0"
        />
        <div class="text-sm">
          <p class="font-semibold mb-1">
            {{ insightTitle }}
          </p>
          <p class="opacity-80">
            {{ insightText }}
          </p>
        </div>
      </div>
    </div>

    <!-- Explicacao detalhada das semanas impactadas -->
    <div
      v-if="impactedWeeks.length > 0"
      class="mt-6"
    >
      <button
        class="w-full flex items-center justify-between text-base font-bold text-gray-800 dark:text-white mb-4 p-2 -m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click="showImpactAnalysis = !showImpactAnalysis"
      >
        <span class="flex items-center gap-2">
          <ion-icon
            name="alert-circle"
            class="text-orange-500"
          />
          Analise das Semanas com Impacto ({{ impactedWeeks.length }})
        </span>
        <ion-icon
          :name="showImpactAnalysis ? 'chevron-up' : 'chevron-down'"
          class="text-gray-400"
        />
      </button>

      <div
        v-show="showImpactAnalysis"
        class="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <div
          v-for="week in impactedWeeks"
          :key="week.weekNumber"
          class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-orange-800 dark:text-orange-300">
              Semana {{ week.weekNumber }}
            </span>
            <span class="text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full">
              -{{ getWeekReduction(week) }}%
            </span>
          </div>

          <div class="text-sm text-orange-700 dark:text-orange-300 mb-3">
            <p class="mb-1">
              <strong>Recebido:</strong> {{ formatCurrency(week.totalEntries) }}
              <span class="text-orange-500">(esperado: {{ formatCurrency(expectedWeeklyEntries) }})</span>
            </p>
          </div>

          <!-- Motivos do impacto -->
          <div class="text-xs space-y-1">
            <p class="font-semibold text-orange-800 dark:text-orange-300 mb-1">
              Por que esta semana esta impactada?
            </p>
            <ul class="space-y-1 text-orange-700 dark:text-orange-400">
              <li
                v-for="reason in getWeekReasons(week)"
                :key="reason"
                class="flex items-start gap-2"
              >
                <ion-icon
                  name="chevron-forward"
                  class="mt-0.5 flex-shrink-0"
                />
                <span>{{ reason }}</span>
              </li>
            </ul>
          </div>

          <!-- Breakdown por modalidade -->
          <div class="mt-3 pt-3 border-t border-orange-200 dark:border-orange-700 grid grid-cols-3 gap-2 text-xs">
            <div class="text-center">
              <div class="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                PIX
              </div>
              <div class="font-semibold">
                {{ formatCompact(getWeekPix(week)) }}
              </div>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
                <div class="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Debito
              </div>
              <div class="font-semibold">
                {{ formatCompact(getWeekDebit(week)) }}
              </div>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400">
                <div class="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Credito
              </div>
              <div class="font-semibold">
                {{ formatCompact(getWeekCredit(week)) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Explicacao geral do impacto -->
    <div class="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
      <div class="flex items-start gap-3">
        <ion-icon
          name="bulb"
          class="text-xl text-amber-500 mt-0.5 flex-shrink-0"
        />
        <div class="text-sm text-gray-700 dark:text-gray-300">
          <p class="font-semibold mb-2">
            Como funciona o impacto do delay?
          </p>
          <ul class="space-y-1 opacity-90">
            <li
              v-if="store.delayDebit"
              class="flex items-center gap-2"
            >
              <div class="w-2 h-2 rounded-full bg-blue-500" />
              <span><strong>Debito:</strong> Antes D+1, agora D+1+{{ store.delayDays }} = D+{{ 1 + store.delayDays }} (impacto nas primeiras {{ Math.ceil((1 + store.delayDays) / 7) }} semanas)</span>
            </li>
            <li
              v-if="store.delayCredit"
              class="flex items-center gap-2"
            >
              <div class="w-2 h-2 rounded-full bg-purple-500" />
              <span><strong>Credito:</strong> Antes D+30, agora D+30+{{ store.delayDays }} = D+{{ 30 + store.delayDays }} (impacto nas primeiras {{ Math.ceil((30 + store.delayDays) / 7) }} semanas)</span>
            </li>
            <li
              v-if="store.delayPix"
              class="flex items-center gap-2"
            >
              <div class="w-2 h-2 rounded-full bg-emerald-500" />
              <span><strong>PIX:</strong> Antes D+0, agora D+0+{{ store.delayDays }} = D+{{ store.delayDays }} (impacto nas primeiras {{ Math.ceil(store.delayDays / 7) }} semanas)</span>
            </li>
            <li
              v-if="!store.delayDebit && !store.delayCredit && !store.delayPix"
              class="text-gray-500"
            >
              Nenhuma modalidade com delay ativado.
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Semanas sem impacto -->
    <div
      v-if="normalWeeksAfterImpact.length > 0"
      class="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
    >
      <div class="flex items-start gap-3">
        <ion-icon
          name="checkmark-circle"
          class="text-xl text-green-500 mt-0.5 flex-shrink-0"
        />
        <div class="text-sm text-green-800 dark:text-green-300">
          <p class="font-semibold mb-1">
            Semanas normalizadas
          </p>
          <p class="opacity-80">
            A partir da semana {{ firstNormalWeek }}, o fluxo de caixa se normaliza.
            As semanas {{ normalWeeksAfterImpact.map(w => w.weekNumber).join(', ') }} estao com recebimentos dentro do esperado
            pois todos os recebimentos ja estao no novo prazo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useCashFlowStore } from '~/store/cashflow'
import type { WeekCashFlow } from '~/types/cashflow'

const store = useCashFlowStore()

const showImpactAnalysis = ref(false)
const hoveredWeek = ref<WeekCashFlow | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)
const chartContainer = ref<HTMLElement | null>(null)

// SVG dimensions
const svgWidth = 800
const svgHeight = 400
const chartPadding = { top: 40, right: 30, bottom: 50, left: 60 }
const chartWidth = svgWidth - chartPadding.left - chartPadding.right
const chartHeight = svgHeight - chartPadding.top - chartPadding.bottom

// Width per week
const weekWidth = computed(() => chartWidth / store.result.weeks.length)

// Tooltip positioning
const tooltipStyle = computed(() => ({
  left: `${tooltipX.value}px`,
  top: `${tooltipY.value}px`,
  transform: 'translate(-50%, -100%) translateY(-10px)',
}))

function updateTooltipPosition(event: MouseEvent) {
  if (!chartContainer.value) return
  const rect = chartContainer.value.getBoundingClientRect()
  tooltipX.value = event.clientX - rect.left
  tooltipY.value = event.clientY - rect.top
}

// Calcula o valor esperado sem delay para comparar
const expectedWeeklyEntries = computed(() => {
  const dailyDebit = (store.totalVolume * (store.debitPercent / 100)) / 22
  const dailyCredit = (store.totalVolume * (store.creditPercent / 100)) / 22
  const dailyPix = (store.totalVolume * (store.pixPercent / 100)) / 30
  return (dailyDebit + dailyCredit + dailyPix) * 5 + dailyPix * 2
})

// Verifica se a semana tem impacto real
function hasRealImpact(week: WeekCashFlow): boolean {
  const threshold = expectedWeeklyEntries.value * 0.95
  return week.totalEntries < threshold
}

// Max e min values para escala
const maxValue = computed(() => {
  const allEntries = store.result.weeks.map(w => w.totalEntries)
  const allExpenses = store.result.weeks.map(w => w.expenses)
  const allBalances = accumulatedBalances.value
  return Math.max(...allEntries, ...allExpenses, ...allBalances) * 1.15
})

const minValue = computed(() => {
  const allBalances = accumulatedBalances.value
  const min = Math.min(...allBalances, 0)
  return min < 0 ? min * 1.15 : 0
})

// Range total do grafico
const valueRange = computed(() => maxValue.value - minValue.value)

// Saldos acumulados
const accumulatedBalances = computed(() => {
  let acc = 0
  return store.result.weeks.map((w) => {
    acc += w.balance
    return acc
  })
})

function getAccumulatedBalance(weekNumber: number): number {
  return accumulatedBalances.value[weekNumber - 1] || 0
}

// Verifica se ha deficit
const hasDeficit = computed(() => accumulatedBalances.value.some(b => b < 0))

// Maximo deficit (capital de giro necessario)
const maxDeficit = computed(() => {
  const minBalance = Math.min(...accumulatedBalances.value)
  return minBalance < 0 ? Math.abs(minBalance) : 0
})

// Converte valor para posicao Y no SVG
function valueToY(value: number): number {
  const normalizedValue = (value - minValue.value) / valueRange.value
  return chartPadding.top + chartHeight * (1 - normalizedValue)
}

// Posicao X de cada semana
function getWeekX(weekNumber: number): number {
  return chartPadding.left + (weekNumber - 0.5) * weekWidth.value
}

// Linha zero
const zeroLineY = computed(() => valueToY(0))

// Linha de despesas
const expensesLineY = computed(() => {
  // Usa a primeira semana como referencia (todas tem mesma despesa base)
  const expense = store.result.weeks[0]?.expenses || 0
  return valueToY(expense)
})

// Grid horizontal
const horizontalGridLines = computed(() => {
  const lines = []
  const steps = 5
  for (let i = 0; i <= steps; i++) {
    const value = minValue.value + (valueRange.value * i) / steps
    lines.push({
      y: valueToY(value),
      value,
    })
  }
  return lines
})

// Areas de entrada (segmentadas por impacto)
const entryAreaSegments = computed(() => {
  const segments: Array<{ path: string, hasImpact: boolean }> = []
  const weeks = store.result.weeks

  let currentSegment: { weeks: typeof weeks, hasImpact: boolean } | null = null

  weeks.forEach((week, index) => {
    const hasImpact = hasRealImpact(week)

    if (!currentSegment || currentSegment.hasImpact !== hasImpact) {
      if (currentSegment) {
        segments.push({
          path: createAreaPath(currentSegment.weeks, currentSegment.weeks[0].weekNumber),
          hasImpact: currentSegment.hasImpact,
        })
      }
      currentSegment = { weeks: [week], hasImpact }
    }
    else {
      currentSegment.weeks.push(week)
    }

    // Push ultimo segmento
    if (index === weeks.length - 1 && currentSegment) {
      segments.push({
        path: createAreaPath(currentSegment.weeks, currentSegment.weeks[0].weekNumber),
        hasImpact: currentSegment.hasImpact,
      })
    }
  })

  return segments
})

function createAreaPath(weeks: WeekCashFlow[], startWeekNumber: number): string {
  if (weeks.length === 0) return ''

  const points: string[] = []
  const baseY = valueToY(0)

  // Move to first point at base
  const firstX = getWeekX(startWeekNumber)
  points.push(`M ${firstX} ${baseY}`)

  // Line up to first value
  points.push(`L ${firstX} ${valueToY(weeks[0].totalEntries)}`)

  // Lines to each subsequent point
  weeks.forEach((week, index) => {
    const x = getWeekX(startWeekNumber + index)
    const y = valueToY(week.totalEntries)
    points.push(`L ${x} ${y}`)
  })

  // Line back down to base at last point
  const lastX = getWeekX(startWeekNumber + weeks.length - 1)
  points.push(`L ${lastX} ${baseY}`)

  // Close path
  points.push('Z')

  return points.join(' ')
}

// Linha de saldo acumulado
const balanceLinePath = computed(() => {
  const weeks = store.result.weeks
  if (weeks.length === 0) return ''

  const points: string[] = []

  weeks.forEach((week, index) => {
    const x = getWeekX(week.weekNumber)
    const y = valueToY(accumulatedBalances.value[index])
    if (index === 0) {
      points.push(`M ${x} ${y}`)
    }
    else {
      points.push(`L ${x} ${y}`)
    }
  })

  return points.join(' ')
})

// Pontos da linha de saldo
const balancePoints = computed(() => {
  return store.result.weeks.map((week, index) => ({
    x: getWeekX(week.weekNumber),
    y: valueToY(accumulatedBalances.value[index]),
    value: accumulatedBalances.value[index],
  }))
})

// Area de deficit
const deficitAreaPath = computed(() => {
  if (!hasDeficit.value) return ''

  const weeks = store.result.weeks
  const points: string[] = []
  const zeroY = zeroLineY.value

  // Encontra regioes com deficit
  let inDeficit = false

  for (let i = 0; i < weeks.length; i++) {
    const balance = accumulatedBalances.value[i]
    const x = getWeekX(weeks[i].weekNumber)

    if (balance < 0 && !inDeficit) {
      // Inicio de deficit
      inDeficit = true
      points.push(`M ${x} ${zeroY}`)
    }

    if (inDeficit) {
      const y = valueToY(balance)
      points.push(`L ${x} ${y}`)

      if (balance >= 0 || i === weeks.length - 1) {
        // Fim de deficit
        points.push(`L ${x} ${zeroY}`)
        points.push('Z')
        inDeficit = false
      }
    }
  }

  return points.join(' ')
})

// Zonas de hover
const hoverZones = computed(() => {
  return store.result.weeks.map((week) => {
    const x = getWeekX(week.weekNumber) - weekWidth.value / 2
    return {
      x,
      width: weekWidth.value,
      week,
    }
  })
})

// Semanas com impacto e normais
const negativeWeeks = computed(() => {
  return store.result.weeks.filter(w => w.balance < 0)
})

const impactedWeeks = computed(() => {
  return store.result.weeks.filter(w => hasRealImpact(w))
})

const normalWeeksAfterImpact = computed(() => {
  const lastImpactedWeek = Math.max(...impactedWeeks.value.map(w => w.weekNumber), 0)
  return store.result.weeks.filter(w => !hasRealImpact(w) && w.weekNumber > lastImpactedWeek)
})

const firstNormalWeek = computed(() => {
  const lastImpactedWeek = Math.max(...impactedWeeks.value.map(w => w.weekNumber), 0)
  return lastImpactedWeek + 1
})

// Helpers de formatacao
function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toFixed(0)
}

function getWeekPix(week: WeekCashFlow): number {
  return week.days.reduce((sum, day) => sum + (day.pixAmount || 0), 0)
}

function getWeekDebit(week: WeekCashFlow): number {
  return week.days.reduce((sum, day) => sum + (day.debitAmount || 0), 0)
}

function getWeekCredit(week: WeekCashFlow): number {
  return week.days.reduce((sum, day) => sum + (day.creditAmount || 0), 0)
}

function getWeekReduction(week: WeekCashFlow): string {
  const expected = expectedWeeklyEntries.value
  const actual = week.totalEntries
  const reduction = ((expected - actual) / expected) * 100
  return reduction.toFixed(1)
}

function getWeekReasons(week: WeekCashFlow): string[] {
  const reasons: string[] = []
  const weekNum = week.weekNumber

  const debitImpactWeeks = Math.ceil((1 + store.delayDays) / 7) + 1
  const creditImpactWeeks = Math.ceil((30 + store.delayDays) / 7) + 1
  const pixImpactWeeks = Math.ceil(store.delayDays / 7) + 1

  if (store.delayDebit && weekNum <= debitImpactWeeks) {
    const debitExpected = (store.totalVolume * (store.debitPercent / 100)) / 22 * 5
    const debitActual = getWeekDebit(week)
    if (debitActual < debitExpected * 0.9) {
      reasons.push(`Debito atrasado: vendas pos-ativacao ainda nao chegaram (prazo D+${1 + store.delayDays}). Recebendo apenas debitos de vendas antigas.`)
    }
  }

  if (store.delayCredit && weekNum <= creditImpactWeeks) {
    const creditExpected = (store.totalVolume * (store.creditPercent / 100)) / 22 * 5
    const creditActual = getWeekCredit(week)
    if (creditActual < creditExpected * 0.9) {
      if (weekNum <= 5) {
        reasons.push(`Credito em transicao: recebendo creditos de vendas de ${30 - (weekNum * 7)} a ${37 - (weekNum * 7)} dias atras (prazo antigo D+30).`)
      }
      else {
        reasons.push(`Credito com delay: periodo de ${store.delayDays} dias sem recebimento de credito novo (entre D+30 antigo e D+${30 + store.delayDays} novo).`)
      }
    }
  }

  if (store.delayPix && weekNum <= pixImpactWeeks) {
    reasons.push(`PIX atrasado: vendas pos-ativacao demoram ${store.delayDays} dias para cair (antes era D+0).`)
  }

  if (reasons.length === 0) {
    reasons.push(`Reducao geral nos recebimentos durante o periodo de transicao.`)
  }

  return reasons
}

// Insights
const insightClass = computed(() => {
  if (negativeWeeks.value.length === 0) {
    return 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
  }
  if (negativeWeeks.value.length <= 2) {
    return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
  }
  return 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
})

const insightIcon = computed(() => {
  if (negativeWeeks.value.length === 0) return 'checkmark-circle'
  if (negativeWeeks.value.length <= 2) return 'warning'
  return 'alert-circle'
})

const insightTitle = computed(() => {
  if (negativeWeeks.value.length === 0) {
    return 'Fluxo de caixa positivo!'
  }
  return `${negativeWeeks.value.length} semana(s) com saldo negativo`
})

const insightText = computed(() => {
  if (negativeWeeks.value.length === 0) {
    if (impactedWeeks.value.length === 0) {
      return 'Nenhum impacto real do delay. O cliente mantem o caixa positivo em todas as semanas.'
    }
    return `O cliente consegue manter o caixa positivo mesmo com ${impactedWeeks.value.length} semana(s) de impacto do delay.`
  }
  const totalDeficit = negativeWeeks.value.reduce((sum, w) => sum + Math.abs(w.balance), 0)
  return `O cliente precisara de aproximadamente ${formatCurrency(totalDeficit)} de capital de giro para cobrir o deficit nas semanas ${negativeWeeks.value.map(w => w.weekNumber).join(', ')}.`
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
