import { describe, it, expect } from 'vitest'
import { getCompromissadaResult } from '../../app/src/compromissada'

describe('compromissada.ts', () => {
  describe('getCompromissadaResult', () => {
    it('should calculate Compromissada result without IOF', () => {
      const result = getCompromissadaResult(1000000, 13.65, 100, 7)

      expect(result.interestAmount).toBeGreaterThan(0)
      expect(result.taxPercentage).toBe(22.5)
      expect(result.taxAmount).toBeGreaterThan(0)
      // Compromissada should have NO IOF in the result structure
      expect('iofAmount' in result).toBe(false)
    })

    it('should have higher net than CDB for short periods due to no IOF', () => {
      const compromissada = getCompromissadaResult(1000000, 13.65, 100, 7)

      // Net should be interest - tax (no IOF deducted)
      const expectedNet = compromissada.interestAmount - compromissada.taxAmount
      expect(compromissada.netAmount).toBeCloseTo(expectedNet, 2)
    })

    it('should calculate net amount correctly', () => {
      const result = getCompromissadaResult(1000000, 13.65, 100, 30)

      const expectedNet = result.interestAmount - result.taxAmount
      expect(result.netAmount).toBeCloseTo(expectedNet, 2)
    })

    it('should have IR applied directly on interest (no IOF deduction)', () => {
      const result = getCompromissadaResult(1000000, 13.65, 100, 7)

      // IR = interestAmount * taxPercentage / 100
      const expectedTax = result.interestAmount * (result.taxPercentage / 100)
      expect(result.taxAmount).toBeCloseTo(expectedTax, 2)
    })
  })
})
