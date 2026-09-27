import type { ComponentType } from 'react'
import type { VisualKey } from '../../types'
import BinomialSquare from './BinomialSquare'
import QuadraticDiscriminant from './QuadraticDiscriminant'
import TangentLine from './TangentLine'
import UnitCircle from './UnitCircle'

export const VISUALS: Record<VisualKey, ComponentType> = {
  'quadratic-discriminant': QuadraticDiscriminant,
  'binomial-square': BinomialSquare,
  'unit-circle': UnitCircle,
  'tangent-line': TangentLine,
}
