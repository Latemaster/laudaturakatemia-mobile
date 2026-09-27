import type { ComponentType } from 'react'
import type { VisualKey } from '../../types'
import BinomialSquare from './BinomialSquare'
import QuadraticDiscriminant from './QuadraticDiscriminant'

export const VISUALS: Record<VisualKey, ComponentType> = {
  'quadratic-discriminant': QuadraticDiscriminant,
  'binomial-square': BinomialSquare,
}
