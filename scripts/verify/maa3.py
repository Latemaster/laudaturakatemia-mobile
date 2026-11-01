"""Independent check of the MAA3 rubric answers (docs/rubric-guidelines.md, batch protocol step 4).

Every result is recomputed from the problem statement and its figure (public/utils/MAA3/), not
copied from the source solutions. Where a rubric corrects the source, the comment says SOURCE ERROR.

    python scripts/verify/maa3.py
"""

from math import acos, asin, atan, cos, degrees, pi, radians, sin, sqrt as fsqrt, tan

from sympy import Rational, S, Symbol, nsimplify, simplify, solve, solveset, sqrt, symbols, Interval, Union, oo, Eq

failures = []


def check(name, condition, detail=''):
    if not condition:
        failures.append(f'{name}: {detail}')


def close(a, b, tol=1e-6):
    return abs(a - b) <= tol


def sind(d):
    return sin(radians(d))


def cosd(d):
    return cos(radians(d))


def tand(d):
    return tan(radians(d))


# --- Osa I ------------------------------------------------------------------------------------

check('OSAI_T1 a)', 10 * 1000 * 1000 == 10**7)  # km -> m -> mm
check('OSAI_T1 b)', 450 * 1 == 450)  # 1 l = 1 dm^3

check('OSAI_T3', simplify(sqrt(6**2 + 13**2) - sqrt(205)) == 0)

# SOURCE ERROR: the source rounds 750 m to "1 km".
check('OSAI_T4', 25000 * 3 == 75000)  # cm = 750 m

# SOURCE ERROR: in the figure the side 5 is adjacent to theta (hypotenuse 7), so cos(theta) = 5/7.
theta = degrees(acos(5 / 7))
alpha = 90 - theta
check('OSAI_T5', round(theta, 1) == 44.4 and round(alpha, 1) == 45.6 and theta < alpha, (theta, alpha))

check('OSAI_T6', Rational(2, 7) * 5 == Rational(10, 7))

x8 = 5 * sind(32.9) / sind(27.3)
check('OSAI_T8', round(x8, 1) == 5.9, x8)

a, b = symbols('a b', positive=True)
sides = solve([Eq((a + b) / 2 * 8, 32), Eq(a - b, 5)], [a, b])
check('OSAI_T7', sides == {a: Rational(13, 2), b: Rational(3, 2)}, sides)

r = sqrt(16 / S.Pi)
check('OSAI_T9', simplify(r - 4 / sqrt(S.Pi)) == 0 and simplify(2 * S.Pi * r - 8 * sqrt(S.Pi)) == 0)

h10 = 22 * 3 ** (1 / 3)
check('OSAI_T10', round(h10, 1) == 31.7, h10)

# --- Osa II -----------------------------------------------------------------------------------

# SOURCE ERROR: alpha is an inscribed angle on the same arc as the central angle beta (100 deg),
# so alpha = 50 deg (also: opposite angles of a cyclic quadrilateral sum to 180 deg), not 65.
beta = 360 - 2 * 130
check('OSAII_T1', beta == 100 and beta / 2 == 50 and 180 - 130 == 50)

check('OSAII_T2', simplify(sqrt(7**2 + 12**2) - sqrt(193)) == 0 and simplify(sqrt(12**2 - 7**2) - sqrt(95)) == 0)

# Assumes DE parallel to AB (the prompt only says DE || FG). EG = 1, BC = 7.
eg = Symbol('eg')
check('OSAII_T3 BC', solve(Eq(Rational(7) / (6 + eg), Rational(5) / (4 + eg)), eg) == [1])
# SOURCE ERROR: AB = BC = 7, so the base angles at A and C are 78 deg and AC = 2 * 7 * cos 78.
ac = 2 * 7 * cosd(78)
ac_cosine_rule = fsqrt(49 + 49 - 2 * 49 * cosd(180 - 2 * 78))
check('OSAII_T3 AC', close(ac, ac_cosine_rule) and round(ac, 1) == 2.9, (ac, ac_cosine_rule))

check('OSAII_T4', round(3 / tand(31), 1) == 5.0 and round(3 / sind(31), 1) == 5.8 and 90 - 31 == 59)

x5 = 1.5 * tand(1.5) / (tand(4.0) - tand(1.5))
h5 = x5 * tand(4.0)
# SOURCE ERROR: the height is 0.063 km = 63 m; the source says 0.63 km = 630 m.
check('OSAII_T5', round(x5, 2) == 0.90 and round(x5 + 1.5, 1) == 2.4 and round(h5 * 1000) == 63, (x5, h5))

d6 = 6370 / sind(1.5) - 6370
check('OSAII_T6', round(d6, 1) == 236973.9, d6)

check('OSAII_T7', round(34 * sind(47)) == 25)

# UNRESOLVED: the figure puts the semicircle's diameter on the square's side, which contradicts
# r = 1 with diagonal 2*sqrt(3). With the stated data the ratio is pi/12.
side_sq = Rational(12, 2)
check('OSAII_T8', simplify((S.Pi / 2) / side_sq - S.Pi / 12) == 0)

check('OSAII_T9 a)', 5 * 30000 == 150000)  # cm = 1.5 km
check('OSAII_T9 b)', round(1.5e8 / 30000**2, 2) == 0.17)

# UNRESOLVED: tan 28 deg != 5/6, so the figure's data are inconsistent; similarity gives 147/5.
ab = Rational(7) * 6 / 5
check('OSAII_T10', ab == Rational(42, 5) and ab * 7 / 2 == Rational(147, 5))

# --- Osa III ----------------------------------------------------------------------------------

av = Symbol('av', real=True)
check('OSAIII_T1 right', set(solve(Eq((av - 1) ** 2 + av**2, (av + 1) ** 2), av)) == {0, 4})
# SOURCE ERROR: the sides form a triangle only when a > 2 (a-1 > 0 and (a-1) + a > a+1).
triangle = solveset((av - 1) + av > av + 1, av, Interval.open(1, oo))
check('OSAIII_T1 triangle', triangle == Interval.open(2, oo), triangle)

R = 20000 / pi
chord = fsqrt(2) * R
check('OSAIII_T2 a)', round(chord) == 9003 and round(100 * (1 - chord / 10000)) == 10)
Rk, hk = 6370, 0.0458
horizon = fsqrt((Rk + hk) ** 2 - Rk**2)
# SOURCE ERROR: the swim is the arc with cos(angle) = R / (R + h), about 24.2 km; the source uses
# arcsin and gets 174 km.
swim = Rk * acos(Rk / (Rk + hk))
check('OSAIII_T2 b)', round(horizon, 1) == 24.2 and round(swim, 1) == 24.2, (horizon, swim))

# SOURCE ERROR: the angle to the driving direction at the second point is 78 deg, so the interior
# angle there is 102 deg and the island's angle 33 deg. The source uses 75 deg and gets 2.8 km.
s3 = 50 * 3 / 60
x3 = s3 * sind(180 - 78) / sind(180 - 45 - (180 - 78))
check('OSAIII_T3', s3 == 2.5 and round(x3, 1) == 4.5, x3)

cl = 2 * 170 * sind(55)
check('OSAIII_T4', round(cl) == 279 and close(cl, 170 * sind(110) / sind(35), 1e-9), cl)

xs = Symbol('xs')
part = solve(Eq(xs / (12 - xs), Rational(6, 8)), xs)
check('OSAIII_T5', part == [Rational(36, 7)] and 12 - part[0] == Rational(48, 7))

b6 = degrees(asin(29 / 33))
check('OSAIII_T6', round(b6, 1) == 61.5 and round(180 - b6, 1) == 118.5, b6)

rr = Rational(5**2 + 4**2, 2 * 4)
volume = 4 * pi * float(rr) ** 3 / 3
check('OSAIII_T7', rr == Rational(41, 8) and round(7.87 * volume / 1000, 2) == 4.44, volume)

check('OSAIII_T9', fsqrt(5**2 - 4**2) == 3 and 2 / 3 * 3 == 2)  # prompt typo fixed

check('OSAIII_T10', Rational(23 * 180, 26 * 180) == Rational(23, 26))

# --- Osa IV -----------------------------------------------------------------------------------

ratio = Rational(11, 1) / (Rational(1, 3) * 228)  # rain 11 mm, cone 228 mm, same base radius
check('OSAIV_T1', ratio == Rational(11, 76) and round(22.8 * float(ratio) ** (1 / 3), 1) == 12.0)

hyp2 = 7**2 + (3 * sqrt(3)) ** 2 - 2 * 7 * 3 * sqrt(3) * (-1 / sqrt(2))
check('OSAIV_T3', simplify(hyp2 - (76 + 21 * sqrt(6))) == 0)

xe = Symbol('xe', positive=True)
base = sqrt(3) * xe**2 / 4
height = sqrt(xe**2 - (xe * sqrt(3) / 3) ** 2)
check('OSAIV_T4', simplify(base * height / 3 - xe**3 * sqrt(2) / 12) == 0)

sight = 1.5 - 2 * (10.1 - 1.5) / 23  # line of sight over the hedge, 2 m further
check('OSAIV_T5', round(sight, 2) == 0.75 and 0.95 > sight, sight)

if failures:
    print('FAILED')
    for failure in failures:
        print(' ', failure)
    raise SystemExit(1)
print('MAA3: all checks pass')
