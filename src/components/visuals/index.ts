import type { ComponentType } from 'react'
import type { VisualKey } from '../../types'
import AbsoluteValueLine from './AbsoluteValueLine'
import AlgorithmFlowchart from './AlgorithmFlowchart'
import AngleBisector from './AngleBisector'
import AngleSymmetry from './AngleSymmetry'
import AngleTypes from './AngleTypes'
import BinomialSquare from './BinomialSquare'
import CircleEquation from './CircleEquation'
import CircleSector from './CircleSector'
import ContinuityKink from './ContinuityKink'
import DistanceMidpoint from './DistanceMidpoint'
import DomainRangeHyperbola from './DomainRangeHyperbola'
import DotProductAngle from './DotProductAngle'
import AreaUnderCurve from './AreaUnderCurve'
import CompoundInterest from './CompoundInterest'
import CrossProductViz from './CrossProductViz'
import ExpEquationGraph from './ExpEquationGraph'
import ExpLogMirror from './ExpLogMirror'
import EuclideanAlgorithm from './EuclideanAlgorithm'
import ExtremaGraph from './ExtremaGraph'
import GradientField from './GradientField'
import ImproperIntegralConvergence from './ImproperIntegralConvergence'
import IntegrationByPartsFlow from './IntegrationByPartsFlow'
import InverseFunctionMirror from './InverseFunctionMirror'
import LevelCurves from './LevelCurves'
import LineSlope from './LineSlope'
import LoanComparison from './LoanComparison'
import LogicTruthTable from './LogicTruthTable'
import LogPointGraph from './LogPointGraph'
import LogRuleCheck from './LogRuleCheck'
import ModularClock from './ModularClock'
import NormalDistribution from './NormalDistribution'
import ParabolaShape from './ParabolaShape'
import ParallelepipedViz from './ParallelepipedViz'
import ParametricLine3D from './ParametricLine3D'
import PerpendicularLines from './PerpendicularLines'
import PlaneNormal3D from './PlaneNormal3D'
import PointLineDistance from './PointLineDistance'
import PowerRuleGraph from './PowerRuleGraph'
import PowerRuleIntegral from './PowerRuleIntegral'
import PythonConditional from './PythonConditional'
import QuadraticDiscriminant from './QuadraticDiscriminant'
import RiemannSum from './RiemannSum'
import RevolutionSolid from './RevolutionSolid'
import RightTriangleTrig from './RightTriangleTrig'
import ScaleFactor from './ScaleFactor'
import SecantToTangent from './SecantToTangent'
import SequenceBars from './SequenceBars'
import SeriesSum from './SeriesSum'
import ShapeAreaGrid from './ShapeAreaGrid'
import SieveOfEratosthenes from './SieveOfEratosthenes'
import SimilarTriangles from './SimilarTriangles'
import SineEquationGraph from './SineEquationGraph'
import SineWaveParams from './SineWaveParams'
import SolidShapesGrid from './SolidShapesGrid'
import SpaceVectorAxes from './SpaceVectorAxes'
import TangentGraph from './TangentGraph'
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
  'angle-symmetry': AngleSymmetry,
  'tangent-graph': TangentGraph,
  'sine-equation-graph': SineEquationGraph,
  'sine-wave-params': SineWaveParams,
  'log-point-graph': LogPointGraph,
  'log-rule-check': LogRuleCheck,
  'exp-log-mirror': ExpLogMirror,
  'exp-equation-graph': ExpEquationGraph,
  'secant-to-tangent': SecantToTangent,
  'power-rule-graph': PowerRuleGraph,
  'extrema-graph': ExtremaGraph,
  'riemann-sum': RiemannSum,
  'power-rule-integral': PowerRuleIntegral,
  'integration-by-parts-flow': IntegrationByPartsFlow,
  'area-under-curve': AreaUnderCurve,
  'revolution-solid': RevolutionSolid,
  'sequence-bars': SequenceBars,
  'series-sum': SeriesSum,
  'compound-interest': CompoundInterest,
  'loan-comparison': LoanComparison,
  'space-vector-axes': SpaceVectorAxes,
  'parametric-line-3d': ParametricLine3D,
  'plane-normal-3d': PlaneNormal3D,
  'cross-product-viz': CrossProductViz,
  'parallelepiped-viz': ParallelepipedViz,
  'level-curves': LevelCurves,
  'gradient-field': GradientField,
  'algorithm-flowchart': AlgorithmFlowchart,
  'logic-truth-table': LogicTruthTable,
  'modular-clock': ModularClock,
  'euclidean-algorithm': EuclideanAlgorithm,
  'sieve-of-eratosthenes': SieveOfEratosthenes,
  'python-conditional': PythonConditional,
  'domain-range-hyperbola': DomainRangeHyperbola,
  'continuity-kink': ContinuityKink,
  'inverse-function-mirror': InverseFunctionMirror,
  'improper-integral-convergence': ImproperIntegralConvergence,
  'normal-distribution': NormalDistribution,
}
