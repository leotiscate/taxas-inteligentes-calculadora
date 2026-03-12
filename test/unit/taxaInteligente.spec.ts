import { describe, it, expect } from 'vitest'
import { getTaxaInteligenteResult } from '../../app/src/taxaInteligente'

describe('taxaInteligente.ts', () => {
  describe('getTaxaInteligenteResult', () => {
    it('should calculate discount correctly for example case', () => {
      // Example from plan: R$1.000.000 × 0.15% × (7/30) = R$350
      const result = getTaxaInteligenteResult(1000000, 0.15, 7)

      expect(result.discountAmount).toBeCloseTo(350, 0)
    })

    it('should calculate daily discount correctly', () => {
      const result = getTaxaInteligenteResult(1000000, 0.15, 30)

      // Daily discount = 1.000.000 × 0.15% / 30 = R$50
      expect(result.dailyDiscount).toBeCloseTo(50, 0)
    })

    it('should scale with billing amount', () => {
      const result1 = getTaxaInteligenteResult(1000000, 0.15, 7)
      const result2 = getTaxaInteligenteResult(2000000, 0.15, 7)

      expect(result2.discountAmount).toBeCloseTo(result1.discountAmount * 2, 0)
    })

    it('should scale with discount percentage', () => {
      const result1 = getTaxaInteligenteResult(1000000, 0.15, 7)
      const result2 = getTaxaInteligenteResult(1000000, 0.30, 7)

      expect(result2.discountAmount).toBeCloseTo(result1.discountAmount * 2, 0)
    })

    it('should scale linearly with days', () => {
      const result7 = getTaxaInteligenteResult(1000000, 0.15, 7)
      const result30 = getTaxaInteligenteResult(1000000, 0.15, 30)

      expect(result30.discountAmount).toBeCloseTo(result7.discountAmount * (30 / 7), 0)
    })

    it('should return full month discount for 30 days', () => {
      const result = getTaxaInteligenteResult(1000000, 0.15, 30)

      // Full month = 1.000.000 × 0.15% = R$1.500
      expect(result.discountAmount).toBeCloseTo(1500, 0)
    })
  })
})
