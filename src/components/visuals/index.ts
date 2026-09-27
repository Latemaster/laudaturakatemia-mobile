import type { ComponentType } from 'react'
import type { VisualKey } from '../../types'
import AbsoluteValueLine from './AbsoluteValueLine'
import AngleBisector from './AngleBisector'
import AngleTypes from './AngleTypes'
import BinomialSquare from './BinomialSquare'
import CircleEquation from './CircleEquation'
import CircleSector from './CircleSector'
import DistanceMidpoint from './DistanceMidpoint'
import DotProductAngle from './DotProductAngle'
import LineSlope from './LineSlope'
import ParabolaShape from './ParabolaShape'
import PerpendicularLines from './PerpendicularLines'
import PointLineDistance from './PointLineDistance'
import QuadraticDiscriminant from './QuadraticDiscriminant'
import RightTriangleTrig from './RightTriangleTrig'
import ScaleFactor from './ScaleFactor'
import ShapeAreaGrid from './ShapeAreaGrid'
import SimilarTriangles from './SimilarTriangles'
import SolidShapesGrid from './SolidShapesGrid'
import TangentLine from './TangentLine'
import TriangleLawsDiagram from './TriangleLawsDiagram'
import UnitCircle from './UnitCircle'
import UnitVectorViz from './UnitVectorViz'
import VectorAddition from './VectorAddition'

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
  'absolute-value-line': AbsoluteValueLine,
  'distance-midpoint': DistanceMidpoint,
  'line-slope': LineSlope,
  'perpendicular-lines': PerpendicularLines,
  'circle-equation': CircleEquation,
  'point-line-distance': PointLineDistance,
  'parabola-shape': ParabolaShape,
  'vector-addition': VectorAddition,
  'dot-product-angle': DotProductAngle,
  'unit-vector': UnitVectorViz,
}
