"""Independent check of the MAA4 rubric answers (docs/rubric-guidelines.md, batch protocol step 4).

Every result is recomputed from the problem statement and its figure (public/utils/MAA4/), not
copied from the source solutions. Where a rubric corrects the source, the comment says SOURCE ERROR.

    python scripts/verify/maa4.py
"""

from math import acos, cos, degrees, pi, radians, sin, sqrt as fsqrt

from sympy import Abs, Interval, Matrix, Rational, Symbol, expand, simplify, solve, solveset, sqrt, symbols
from sympy import cos as scos, pi as spi, sin as ssin

failures = []


def check(name, condition, detail=''):
    if not condition:
        failures.append(f'{name}: {detail}')


def close(a, b, tol=1e-6):
    return abs(a - b) <= tol


def angle(u, v):
    u, v = Matrix(u), Matrix(v)
    return degrees(acos(float(u.dot(v) / (u.norm() * v.norm()))))


x, y, t, a, k = symbols('x y t a k', real=True)

# --- Osa I ------------------------------------------------------------------------------------

check('OSAI_T1', abs(-5) == 5 and 3 - fsqrt(7) > 0 and 2 - fsqrt(5) < 0)

check('OSAI_T2 a)', set(solve(Abs(3 * x) - 7, x)) == {Rational(7, 3), Rational(-7, 3)})
check('OSAI_T2 b)', set(solve(Abs(2 * x - 5) - 16, x)) == {Rational(21, 2), Rational(-11, 2)})

check('OSAI_T3', (Rational(6 - 2, 2), Rational(-3 + 8, 2)) == (2, Rational(5, 2)))

# |y - x| = 2 is the pair of lines y = x + 2 and y = x - 2 (Kuva A); Kuva B is x^2 + y^2 = 4.
check('OSAI_T4', all(abs((xx + 2) - xx) == 2 and abs((xx - 2) - xx) == 2 for xx in range(-5, 6)))

# Points read off the figure: k through (0,0),(1,1); s through (0,3),(1,5); t through (0,-2),(-1,2).
lines5 = {'k': ((0, 0), (1, 1)), 's': ((0, 3), (1, 5)), 't': ((0, -2), (-1, 2))}
eqs5 = {}
for name, ((x1, y1), (x2, y2)) in lines5.items():
    slope = Rational(y2 - y1, x2 - x1)
    eqs5[name] = (slope, y1 - slope * x1)
check('OSAI_T5', eqs5 == {'k': (1, 0), 's': (2, 3), 't': (-4, -2)}, eqs5)
check('OSAI_T5 figure', -4 * (-2) - 2 == 6 and 2 * (-3) + 3 == -3)  # t at x=-2, s meets k at (-3,-3)

check('OSAI_T6 a)', expand(5 * (x + 2) + 2) == 5 * x + 12)
k6 = Rational(7 - 8, 9 + 1)
check('OSAI_T6 b)', k6 == Rational(-1, 10) and expand(k6 * (x + 1) + 8) == -x / 10 + Rational(79, 10))

check('OSAI_T7', solve([x - y - 7, 4 * y + 3 * x - 7], [x, y]) == {x: 5, y: -2})

check('OSAI_T8', sqrt((-4 - 1) ** 2 + (5 - 3) ** 2) == sqrt(29))

va, vb = Matrix([2, -3]), Matrix([-4, 9])
check('OSAI_T9', list(va + vb) == [-2, 6] and list(va - vb) == [6, -12] and va.dot(vb) == -35)

c10, d10 = Matrix([3, 0, -2]), Matrix([4, 0, 4])
check('OSAI_T10', c10.dot(d10) == 4 and c10.norm() == sqrt(13) and d10.norm() == 4 * sqrt(2))
check('OSAI_T10 angle', round(angle(c10, d10), 1) == 78.7, angle(c10, d10))

# --- Osa II -----------------------------------------------------------------------------------

check('OSAII_T1 a)', set(solve(3 * Abs(5 * x - 2) - 4 - 8, x)) == {Rational(6, 5), Rational(-2, 5)})
# b) -4 <= 3x - 2 <= 4  <=>  -2/3 <= x <= 2;  c) |5x - 7| >= 0, so no solutions.
check('OSAII_T1 b)', (Rational(-4 + 2, 3), Rational(4 + 2, 3)) == (Rational(-2, 3), 2))

tt = Symbol('tt', real=True)
roots2 = solve((tt**2 - 5) - (5 - tt), tt)  # k_AB = k_BC
check('OSAII_T2', set(roots2) == {(-1 + sqrt(41)) / 2, (-1 - sqrt(41)) / 2}, roots2)
for r2 in roots2:  # A, B, C collinear: cross product of AB and AC is zero
    A2, B2, C2 = Matrix([3, r2**2]), Matrix([2, 5]), Matrix([1, r2])
    ab, ac = B2 - A2, C2 - A2
    check('OSAII_T2 collinear', simplify(ab[0] * ac[1] - ab[1] * ac[0]) == 0)

check('OSAII_T3 b)', (2 - 2) ** 2 + (4 + 3) ** 2 == 49 and 49 != 36)

kn = Rational(-4, 7)
check('OSAII_T4', Rational(7, 4) * kn == -1 and expand(kn * (x + 9) + 11) == kn * x + Rational(41, 7))
check('OSAII_T4 general form', 4 * (-9) + 7 * 11 - 41 == 0)

d1 = Abs(a - 3 + a) / sqrt(2)
d2 = Abs(2 * a + 3 - 1) / sqrt(5)
sol5 = solve(d1 - d2, a)
want5 = ((19 - 5 * sqrt(10)) / 6, (19 + 5 * sqrt(10)) / 6)
check('OSAII_T5', len(sol5) == 2 and all(any(close(float(v), float(w)) for w in sol5) for v in want5), sol5)
check('OSAII_T5 quadratic', expand(5 * (2 * a - 3) ** 2 - 2 * (2 * a + 2) ** 2) == 12 * a**2 - 76 * a + 37)

check('OSAII_T6 on circle', (8 - 2) ** 2 + (4 - 2) ** 2 == 40)
kr = Rational(4 - 2, 8 - 2)
check('OSAII_T6', kr == Rational(1, 3) and expand(-3 * (x - 8) + 4) == -3 * x + 28)

par = solve((y + 3) ** 2 - ((x - 4) ** 2 + (y - 2) ** 2), y)
check('OSAII_T7', len(par) == 1 and expand(par[0]) == x**2 / 10 - 4 * x / 5 + Rational(11, 10), par)  # opens up, axis x = 4

va8, vb8 = Matrix([-2, -8, 6]), Matrix([5, 20, -15])
check('OSAII_T8', va8 == Rational(-2, 5) * vb8)

r, s, tv = symbols('r s tv')
dec = solve(list(r * Matrix([1, -1, 0]) + s * Matrix([1, 0, 1]) + tv * Matrix([0, 1, 0]) - Matrix([2, -2, 2])), [r, s, tv])
check('OSAII_T9', dec == {r: 0, s: 2, tv: -2}, dec)
check('OSAII_T9 basis', Matrix([[1, -1, 0], [1, 0, 1], [0, 1, 0]]).det() != 0)  # unique decomposition

p10 = Matrix([2, 4, 6]) + t * Matrix([2, -1, 3])
check('OSAII_T10', list(p10) == [2 + 2 * t, 4 - t, 6 + 3 * t])

# --- Osa III ----------------------------------------------------------------------------------

bis = [expand(4 * x - 3 * y - 7 - 5 * (y + 1)), expand(4 * x - 3 * y - 7 + 5 * (y + 1))]
check('OSAIII_T1', bis == [4 * x - 8 * y - 12, 4 * x + 2 * y - 2], bis)  # x-2y-3=0, 2x+y-1=0
check('OSAIII_T1 vertex', solve([4 * x - 3 * y - 7, y + 1], [x, y]) == {x: 1, y: -1})

# SOURCE ERROR: completing the square gives (x - 2a)^2 + (y + a)^2 = 5a - a^2, so the centre is
# (2a, -a), not (2a, a).
lhs = (x - 2 * a) ** 2 + (y + a) ** 2 - (5 * a - a**2)
check('OSAIII_T2 centre', expand(lhs - (x**2 + y**2 - 4 * a * x + 2 * a * y + 6 * a**2 - 5 * a)) == 0)
check('OSAIII_T2', solve(5 - 2 * a, a) == [Rational(5, 2)] and 5 * Rational(5, 2) - Rational(25, 4) == Rational(25, 4))

# SOURCE ERROR: sqrt(5^2 + (-3)^2) = sqrt(34), not 5. The lines are 5x - 3y + 4 -+ 7 sqrt(34) = 0;
# the source's 5x - 3y - 31 = 0 and 5x - 3y + 39 = 0 are only 35/sqrt(34) ~ 6.0 away.
for c3 in (4 - 7 * sqrt(34), 4 + 7 * sqrt(34)):
    check('OSAIII_T3', simplify(Abs(c3 - 4) / sqrt(34)) == 7)
check('OSAIII_T3 source lines', round(35 / fsqrt(34), 2) == 6.0)

# a) x = 1 - 2s and z = 3 - 6s vanish at the same s = 1/2, giving (0, 1/2, 0).
check('OSAIII_T4 a)', Rational(1, 2) == Rational(3, 6))
# SOURCE ERROR: cos(alpha) = |v.j| / |v| = 1/sqrt(41) gives 81.0 deg, not 83 deg.
ang4 = degrees(acos(1 / fsqrt(41)))
check('OSAIII_T4 b)', round(ang4, 1) == 81.0, ang4)

A5, B5, P5 = Matrix([4, -6, 7]), Matrix([8, 1, -2]), Matrix([1, 2, 3])
ab5 = B5 - A5
t5 = (P5 - A5).dot(ab5) / ab5.dot(ab5)
pq5 = A5 + t5 * ab5 - P5
check('OSAIII_T5', t5 == Rational(40, 73) and list(pq5) == [Rational(379, 73), Rational(-304, 73), Rational(-68, 73)])
check('OSAIII_T5 length', simplify(pq5.norm() - sqrt(240681) / 73) == 0 and round(float(pq5.norm()), 2) == 6.72)

check('OSAIII_T6 a)', round(degrees(acos(19 / 24)), 1) == 37.7)
check('OSAIII_T6 b)', 8**2 + 2 * 19 + 3**2 == 111)

F7, G7, H7 = Matrix([4, -5, 9]), Matrix([2, 4, 6]), Matrix([-1, 5, -2])
n7 = (G7 - F7).cross(H7 - F7)
check('OSAIII_T7 normal', n7 == Matrix([-69, -7, 25]), n7)
d7 = Abs(n7.dot(F7)) / n7.norm()
check('OSAIII_T7', simplify(d7 - 16 * sqrt(5435) / 5435) == 0 and n7.dot(F7) == -16, d7)
check('OSAIII_T7 plane', expand(-(n7.dot(Matrix([x, y, symbols('z')]) - F7))) == 69 * x + 7 * y - 25 * symbols('z') - 16)
op7 = n7.dot(F7) / n7.dot(n7) * n7
check('OSAIII_T7 foot', list(op7) == [Rational(1104, 5435), Rational(112, 5435), Rational(-80, 1087)])

d81 = Abs(4 + 2 * a + 1) / sqrt(5)
d82 = Abs(-12 + a - a) / sqrt(10)
sol8 = solve(d81 - d82, a)
check('OSAIII_T8', set(map(simplify, sol8)) == {(-5 + 6 * sqrt(2)) / 2, (-5 - 6 * sqrt(2)) / 2}, sol8)

# f(x) = a x (x - 32.4) through (24, 6.7)
a9 = Rational(67, 10) / (24 * (24 - Rational(162, 5)))
b9 = -Rational(162, 5) * a9
check('OSAIII_T9', a9 == Rational(-67, 2016) and b9 == Rational(603, 560), (a9, b9))
check('OSAIII_T9 rounded', round(float(a9), 4) == -0.0332 and round(float(b9), 2) == 1.08)

check('OSAIII_T10 outside', (-6 - 2) ** 2 + (-2 - 2) ** 2 == 80)
ks = solve((8 * k - 4) ** 2 - 40 * (k**2 + 1), k)
check('OSAIII_T10', set(ks) == {3, Rational(-1, 3)}, ks)
check('OSAIII_T10 lines', expand(3 * (x + 6) - 2 - y) == 3 * x - y + 16 and expand(-3 * (Rational(-1, 3) * (x + 6) - 2 - y)) == x + 3 * y + 12)
check('OSAIII_T10 vertical', abs(-6 - 2) ** 2 != 40)  # x = -6 is not a tangent

# --- Osa IV -----------------------------------------------------------------------------------

n1 = Matrix([1, 1, 1])
v1 = Matrix([cos(pi / 4), sin(pi / 4), 0])
th1 = acos(float(n1.dot(v1) / (n1.norm() * v1.norm())))
check('OSAIV_T1 a)', close(th1, acos(fsqrt(2 / 3))) and round(th1, 2) == 0.62 and th1 < pi / 2, th1)
# b) v = c n would need c = 0 from the z-component, but |v| = 1: never.
# c) cos t + sin t = 0 on [0, 2pi]
tc = solveset(scos(t) + ssin(t), t, Interval(0, 2 * spi))
check('OSAIV_T1 c)', set(tc) == {3 * spi / 4, 7 * spi / 4}, tc)

# SOURCE ERROR: the line passes through the origin, so c = 0; the source keeps c and divides by it.
aa, bb, rr = symbols('aa bb rr', positive=True)
xs = solve((aa**2 + bb**2) * x**2 - bb**2 * rr**2, x)
check('OSAIV_T2', set(xs) == {bb * rr / sqrt(aa**2 + bb**2), -bb * rr / sqrt(aa**2 + bb**2)}, xs)
for xv in xs:
    yv = -aa / bb * xv
    check('OSAIV_T2 on both', simplify(xv**2 + yv**2 - rr**2) == 0 and simplify(aa * xv + bb * yv) == 0)

# SOURCE ERROR: 10 cos 32 = 8.48 rounds to 8 N (one significant figure), not 9 N.
N4, F4 = 10 * cos(radians(32)), 10 * sin(radians(32))
check('OSAIV_T4', round(N4, 1) == 8.5 and round(F4, 1) == 5.3, (N4, F4))

centre5, rad2 = (48, 35), 48**2 + 35**2 - 1250
check('OSAIV_T5 circle', rad2 == 2279)
xs5 = solve(x**2 - 99 * x + 1313, x)  # circle with y = 86 - x
check('OSAIV_T5 bisector', expand(x**2 + (86 - x) ** 2 - 96 * x - 70 * (86 - x) + 1250) == 2 * (x**2 - 99 * x + 1313))
D5 = ((99 + fsqrt(4549)) / 2, (73 - fsqrt(4549)) / 2)
E5 = ((99 - fsqrt(4549)) / 2, (73 + fsqrt(4549)) / 2)
dD, dE = fsqrt((D5[0] - 52) ** 2 + (D5[1] - 34) ** 2), fsqrt((E5[0] - 52) ** 2 + (E5[1] - 34) ** 2)
check('OSAIV_T5 closer', dD < dE and round(dD, 1) == 44.2 and round(dE, 1) == 51.2, (dD, dE))
# SOURCE ERROR: the walk goes straight from a cabin to D, not via the midpoint (52, 34). The source
# adds the legs (58.3 units) and rounds to 600 m; the hypotenuse is 46.4 units = 463.7 m.
walk = fsqrt((D5[0] - 42) ** 2 + (D5[1] - 24) ** 2)
walk_a = fsqrt((D5[0] - 62) ** 2 + (D5[1] - 44) ** 2)
check('OSAIV_T5 equal', close(walk, walk_a) and close(walk**2, 2487 - 5 * fsqrt(4549)), (walk, walk_a))
metres = 10 * walk
check('OSAIV_T5 walk', round(metres) == 464, metres)
tupu, hupu = metres / 2 / 60, metres / 1 / 60  # minutes
check('OSAIV_T5 times', round(tupu, 2) == 3.86 and round(hupu, 2) == 7.73, (tupu, hupu))
# Leave at the latest 19:00 - 3 min 52 s = 18:56:08 and 19:00 - 7 min 44 s = 18:52:16.
check('OSAIV_T5 departures', int(60 - tupu) == 56 and int(60 - hupu) == 52)

if failures:
    print('FAILED')
    for failure in failures:
        print(' ', failure)
    raise SystemExit(1)
print('MAA4: all checks pass')
