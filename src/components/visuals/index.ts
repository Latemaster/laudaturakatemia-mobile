import type { ComponentType } from 'react'
import type { VisualKey } from '../../types'
import AngleBisector from './AngleBisector'
import AngleTypes from './AngleTypes'
import BinomialSquare from './BinomialSquare'
import CircleSector from './CircleSector'
import QuadraticDiscriminant from './QuadraticDiscriminant'
import RightTriangleTrig from './RightTriangleTrig'
import ScaleFactor from './ScaleFactor'
import ShapeAreaGrid from './ShapeAreaGrid'
import SimilarTriangles from './SimilarTriangles'
import SolidShapesGrid from './SolidShapesGrid'
import TangentLine from './TangentLine'
import TriangleLawsDiagram from './TriangleLawsDiagram'
import UnitCircle from './UnitCircle'

export const VISUALS: Record<VisualKey, ComponentType> = {
  'quadratic-discriminant': QuadraticDiscriminant,
  'binomial-square': BinomialSquare,
  'unit-circle': UnitCircle,
  'tangent-line': TangentLine,
  'scale-factor': ScaleFactor,
  'angle-types': AngleTypes,
  'similar-triangles': SimilarTriangles,
  'angle-bisector': AngleBisector,
  'right-triangle-trig': RightTriangleTrig,
  'shape-area-grid': ShapeAreaGrid,
  'triangle-laws': TriangleLawsDiagram,
  'circle-sector': CircleSector,
  'solid-shapes-grid': SolidShapesGrid,
}
