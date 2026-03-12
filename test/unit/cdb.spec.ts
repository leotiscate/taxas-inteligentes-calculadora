import { describe, it, expect } from 'vitest'
import { getCDBResult } from '../../app/src/cdb'

describe('cdb.ts', () => {
  describe('getCDBResult', () => {
    it('should calculate CDB result for 7 days with IOF', () => {
      const result = getCDBResult(1000000, 13.65, 100, 7)

      expect(result.interestAmount).toBeGreaterThan(0)
      expect(result.iofAmount).toBeGreaterThan(0) // IOF applies for day 7
      expect(result.taxPercentage).toBe(22.5) // IR for <= 180 days
      expect(result.taxAmount).toBeGreaterThan(0)
      expect(result.netAmount).toBeLessThan(result.interestAmount)
    })

    it('should have no IOF after 30 days', () => {
      const result = getCDBResult(1000000, 13.65, 100, 31)

      expect(result.iofAmount).toBe(0)
    })

    it('should have lower IR rate after 180 days', () => {
      const result = getCDBResult(1000000, 13.65, 100, 181)

      expect(result.taxPercentage).toBe(20)
    })

    it('should calculate net amount correctly', () => {
      const result = getCDBResult(1000000, 13.65, 100, 7)

      const expectedNet = result.interestAmount - result.iofAmount - result.taxAmount
      expect(result.netAmount).toBeCloseTo(expectedNet, 2)
    })

    it('should scale with investment amount', () => {
      const result1 = getCDBResult(1000000, 13.65, 100, 7)
      const result2 = getCDBResult(2000000, 13.65, 100, 7)

      expect(result2.netAmount).toBeCloseTo(result1.netAmount * 2, 0)
    })
  })
})
