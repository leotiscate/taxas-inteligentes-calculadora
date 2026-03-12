import { describe, it, expect } from 'vitest'
import { compareProducts, getBestProduct, getProductDifferences } from '../../app/src/comparison'

describe('comparison.ts', () => {
  const defaultInput = {
    billing: 1000000,
    days: 7,
    cdiRate: 13.65,
    cdbPercent: 100,
    compromissadaPercent: 100,
    taxaInteligenteDiscount: 0.15,
  }

  describe('compareProducts', () => {
    it('should return results for all 4 products', () => {
      const results = compareProducts(defaultInput)

      expect(results).toHaveLength(4)

      const types = results.map(r => r.type)
      expect(types).toContain('cdb')
      expect(types).toContain('compromissada')
      expect(types).toContain('aplicacaoAutomatica')
      expect(types).toContain('taxaInteligente')
    })

    it('should sort results by netAmount descending', () => {
      const results = compareProducts(defaultInput)

      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].netAmount).toBeGreaterThanOrEqual(results[i + 1].netAmount)
      }
    })

    it('should mark first result as best option', () => {
      const results = compareProducts(defaultInput)

      expect(results[0].isBestOption).toBe(true)
      expect(results.slice(1).every(r => !r.isBestOption)).toBe(true)
    })

    it('should have aplicacaoAutomatica as worst option (lowest return)', () => {
      const results = compareProducts(defaultInput)

      const lastResult = results[results.length - 1]
      expect(lastResult.type).toBe('aplicacaoAutomatica')
    })
  })

  describe('getBestProduct', () => {
    it('should return the best product', () => {
      const results = compareProducts(defaultInput)
      const best = getBestProduct(results)

      expect(best).not.toBeNull()
      expect(best?.isBestOption).toBe(true)
    })

    it('should return null for empty results', () => {
      const best = getBestProduct([])
      expect(best).toBeNull()
    })
  })

  describe('getProductDifferences', () => {
    it('should return difference of 0 for best product', () => {
      const results = compareProducts(defaultInput)
      const differences = getProductDifferences(results)

      const bestType = results[0].type
      expect(differences.get(bestType)).toBe(0)
    })

    it('should return positive differences for non-best products', () => {
      const results = compareProducts(defaultInput)
      const differences = getProductDifferences(results)

      results.slice(1).forEach((result) => {
        expect(differences.get(result.type)).toBeGreaterThan(0)
      })
    })

    it('should return empty map for empty results', () => {
      const differences = getProductDifferences([])
      expect(differences.size).toBe(0)
    })
  })
})
