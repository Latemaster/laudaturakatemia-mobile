"""Independent check of the MAA5 rubric answers (docs/rubric-guidelines.md, batch protocol step 4).

Every result is recomputed from the problem statement and its figure (public/utils/MAA5/), not
copied from the source solutions. Where a rubric corrects the source, the comment says SOURCE ERROR.

    python scripts/verify/maa5.py
"""

from math import asin, atan, cos as fcos, degrees, exp, gcd, log, pi as fpi, sin as fsin, sqrt as fsqrt

from sympy import (
    Interval, Rational, S, Symbol, cos, pi, simplify, sin, solve,
    solveset, sqrt, symbols, trigsimp,
)

failures = []


def check(name, condition, detail=''):
    if not condition:
        failures.append(f'{name}: {detail}')


def close(a, b, tol=1e-6):
    return abs(a - b) <= tol


x, t = symbols('x t', real=True)

# --- Osa I ------------------------------------------------------------------------------------

check('OSAI_T1 a-d)', 30 * pi / 180 == pi / 6 and Rational(179, 180) * pi == 179 * pi / 180
      and Rational(3, 2) * 180 == 270 and Rational(5, 2) * 180 == 450)
check('OSAI_T1 e)', round(42 / 37, 1) == 1.1 and round(degrees(42 / 37)) == 65, degrees(42 / 37))

# a) cos x < 0 on [pi/2, pi]
check('OSAI_T3 a)', simplify(-sqrt(1 - Rational(1, 25)) + 2 * sqrt(6) / 5) == 0)

check('OSAI_T4 a)', all(close(fsin(2 * v), fsqrt(3) / 2) for v in (fpi / 6, fpi / 3, fpi / 6 + fpi, fpi / 3 + fpi)))
check('OSAI_T4 b)', close(fcos(3 * fpi / 10), fsqrt(10 - 2 * fsqrt(5)) / 4))

# SOURCE ERROR: 81^(1/3) has the exact value 3*cbrt(3); the source only gives 4,33.
check('OSAI_T5 a)', simplify(81 ** Rational(1, 3) - 3 * 3 ** Rational(1, 3)) == 0 and round(81 ** (1 / 3), 2) == 4.33)
check('OSAI_T5 b)', round(125 ** (1 / 5), 2) == 2.63)
check('OSAI_T5 d)', gcd(113, 792) == 1)

check('OSAI_T8', Rational(70 * 12, 27) == Rational(280, 9))
check('OSAI_T9', Rational(5**7 - 5, 4) == 19530)

# SOURCE ERROR: the amount triples in half an hour, so 9-fold in an hour, and starts at 3000:
# f(t) = 3000 * 9^t; the source drops the 3000 (f(t) = 9^t) and says "kolminkertaistuu tunnissa".
f10 = lambda tt: 3000 * 9**tt
check('OSAI_T10', f10(0) == 3000 and f10(Rational(1, 2)) == 9000)

# --- Osa II -----------------------------------------------------------------------------------

check('OSAII_T1', close(fcos(fpi / 5), (fsqrt(5) + 1) / 4) and close(fsin(fpi / 5), fsqrt(10 - 2 * fsqrt(5)) / 4))

check('OSAII_T2 a)', sin(5 * pi) + cos(-13 * pi / 2) == 0)
check('OSAII_T2 b)', (cos(8 * pi) - sin(15 * pi / 2)) / cos(17 * pi) == -2)

x3 = 7 * pi / 8  # 2x in [pi, 2pi] with cos 2x = 1/sqrt 2
check('OSAII_T3 a)', simplify(cos(2 * x3) - 1 / sqrt(2)) == 0 and close(float(cos(x3)), -fsqrt(2 + fsqrt(2)) / 2))
check('OSAII_T3 b)', simplify(sin(pi / 3 - pi / 6) - Rational(1, 2)) == 0 and simplify(cos(pi / 3 - pi / 6) - sqrt(3) / 2) == 0)

roots4a = solveset(sin(4 * x) - sin(2 * x), x, Interval(0, pi))
check('OSAII_T4 a)', set(roots4a) == {0, pi / 6, pi / 2, 5 * pi / 6, pi}, roots4a)
check('OSAII_T4 b)', set(solveset(sin(x) ** 2 - sin(x), x, Interval(0, 2 * pi))) == {0, pi / 2, pi, 2 * pi})
check('OSAII_T4 c)', all(close(2 * fsin(4 * v), -1) for v in (7 * fpi / 24, -fpi / 24, 7 * fpi / 24 + fpi / 2)))
check('OSAII_T4 d)', fpi / 2 > 1)  # sin(sin x) = 1 needs sin x = pi/2 + 2n pi, impossible

check('OSAII_T5 a)', all(close(fcos(2 * v + fpi / 2), 0.5) for v in (-fpi / 12, -5 * fpi / 12)))
check('OSAII_T5 b)', close(fsin(fpi / 10), (fsqrt(5) - 1) / 4) and close(fsin(2 * 9 * fpi / 20), (fsqrt(5) - 1) / 4))
check('OSAII_T5 c)', close(fcos(fpi / 12), (fsqrt(6) + fsqrt(2)) / 4))
check('OSAII_T5 d)', 1 - 4 < 0)  # t^2 + t + 1 = 0 has discriminant -3

# Read off the figure: f through the origin, max 3 at pi/4, period pi; g min -2 at 0, period 2 pi.
check('OSAII_T6', close(3 * fsin(2 * fpi / 4), 3) and close(-2 * fcos(0), -2) and close(-2 * fcos(fpi), 2))

# SOURCE ERROR: -1 <= cos 5x <= 1 gives 0 <= 2 - 2 cos 5x <= 4; the source gets [-4, 0].
vals7 = [2 - 2 * fcos(5 * k * 0.001) for k in range(0, 1300)]
check('OSAII_T7', close(min(vals7), 0, 1e-4) and close(max(vals7), 4, 1e-4) and close(2 * fpi / 5, 1.2566370614359172))

check('OSAII_T8', solve((x + 1) ** 2 - (x**2 + 3 * x), x) == [1])

x9 = log(444, 8) - 2
check('OSAII_T9 a)', round(x9, 2) == 0.93, x9)
check('OSAII_T9 b)', Rational(8, 20) == Rational(2, 5))  # 0.4^x > 0.4, decreasing, x < 1

n10 = 3**2024
check('OSAII_T10', len(str(n10)) == 966 and str(n10)[:4] == '4936', str(n10)[:6])

# --- Osa III ----------------------------------------------------------------------------------

tp = Symbol('tp', real=True)
q = (4 + 7 * tp) / (3 * tp)
ok1 = solveset(q >= 0, tp, S.Reals).intersect(solveset(q <= 1, tp, S.Reals))
check('OSAIII_T1', ok1 == Interval(-1, Rational(-4, 7)), ok1)

h2 = 2 * fsin(2 * fpi * 0.4 * 11)
check('OSAIII_T2 a)', round(h2, 2) == 1.18, h2)
check('OSAIII_T2 b)', close(2 * fsin(fpi * 0.5 * (1 / 6) * 2), 1) and round(1 / 6, 2) == 0.17)

k3 = (10800 / 38700) ** (1 / 5)
check('OSAIII_T3 c)', round((1 - k3) * 100, 1) == 22.5, k3)
t3 = log(1000 / 2700) / log(k3)
check('OSAIII_T3 d)', round(t3, 2) == 3.89 and 18 < 15 + t3 < 19, t3)

t4a = 32 * log(5) / log(2)
t4b = 32 * log(100) / log(2)
# SOURCE ERROR (wording): a) ends with "Alueella voi liikkua turvallisesti 75 vuoden kuluttua"; the answer is ~74 years.
check('OSAIII_T4', round(t4a, 1) == 74.3 and round(t4b, 1) == 212.6, (t4a, t4b))

# SOURCE ERROR (prompt): max 10.4 m at 8.05 and min 2.5 m at 15.50 are 7 h 45 min apart, but with an
# 11-hour period they must be 5.5 h apart. The rubric uses the maximum and the period, like the source.
A5, d5, b5 = (10.4 - 2.5) / 2, (10.4 + 2.5) / 2, 2 * fpi / 11
c5 = 97 / 12 - 11 / 4
check('OSAIII_T5 a)', close(A5, 3.95) and close(d5, 6.45) and close(c5, 16 / 3))
H = lambda tt: A5 * fsin(b5 * (tt - c5)) + d5
check('OSAIII_T5 max', close(H(97 / 12), 10.4) and close(H(97 / 12 + 5.5), 2.5))
check('OSAIII_T5 b)', round(H(24 + 11 + 50 / 60), 2) == 2.54, H(24 + 11 + 50 / 60))
crossings, step, prev = [], 1e-4, H(0) - 7
for i in range(1, int(30 / step)):
    cur = H(i * step) - 7
    if prev < 0 <= cur or prev > 0 >= cur:
        crossings.append(i * step)
    prev = cur
third = crossings[2]
# Exact c = 16/3 gives 16.578 h = 16:34.7; the source's rounded c = 5.33 gives 16.575 h = 16:34.
check('OSAIII_T5 c)', round(third, 2) == 16.58 and int((third % 1) * 60) == 34, crossings[:3])

t6 = log(21.5 / 14.7) / log(1.027 / 0.985)
# SOURCE ERROR: the crossing is at t ~ 9.1, not 9.49; the year answer (during the 10th year) is unchanged.
check('OSAIII_T6', round(t6, 1) == 9.1, t6)

r7 = (3 + fsqrt(41)) / 8
check('OSAIII_T7 a)', close(4 * r7**2 - 3 * r7 - 2, 0) and (3 - fsqrt(41)) / 8 < 0 and round(log(r7), 4) == 0.1616, log(r7))
check('OSAIII_T7 c)', 81**24 == 3**96 and 3**100 > 81**24)

# SOURCE ERROR (missing case): the expression is 0/0 at x = 1 (log_3 1 = 0); elsewhere it is -22/9.
L = Symbol('L', nonzero=True)  # L = log_3 x
check('OSAIII_T8', simplify((L + 3 * L - L / 3) / (L / 2 - 2 * L)) == Rational(-22, 9))

# SOURCE ERROR: the prompt has ln(2x + 2) - ln(x); the source solves it with ln(2x).
xs9 = [1.001, 1.5, 2, 10, 1000]
check('OSAIII_T9', all(log((2 * v + 2) / v) > log((4 * v + 2) / (4 * v)) for v in xs9))
check('OSAIII_T9 form', all(close(log((2 * v + 2) / v), log(2 + 2 / v)) for v in xs9))

# SOURCE ERROR: on [0, pi] the point (x, 4x) needs y >= 0, so x = 1/sqrt 17 only; 104,0 deg puts the
# point at (-1/sqrt17, 4/sqrt17), which is on y = -4x.
th10 = degrees(atan(4))
check('OSAIII_T10', round(th10, 1) == 76.0 and close(fsin(fpi - atan(4)), 4 / fsqrt(17)) and not close(4 * fcos(fpi - atan(4)), fsin(fpi - atan(4))))

# --- Osa IV -----------------------------------------------------------------------------------

check('OSAIV_T1 a)', round(2000 * fsin(40 * fpi / 180)) == 1286)
check('OSAIV_T1 b)', close(asin(0.5), fpi / 6))
check('OSAIV_T1 c)', close(2000 - 2000 * fsin(fpi / 6), 1000) and round(2000 * (fsin(fpi / 3) - 0.5)) == 732)

check('OSAIV_T2', trigsimp(sin(x) ** 2 - (1 - cos(2 * x)) / 2) == 0)

g3 = [2 ** (a - 1) + 3 ** (a + 1) for a in [k / 1000 for k in range(0, 1001)]]
check('OSAIV_T3', max(g3) <= 10 + 1e-12 and close(g3[-1], 10) and all(u < v for u, v in zip(g3, g3[1:])))

lo, hi = 3 + 23 / 60, 22 + 34 / 60
a4, d4, b4 = (hi - lo) / 2, (hi + lo) / 2, 2 * fpi / 365
c4 = 356 - 3 * 365 / 4  # minimum at day 356 (the source's choice)
check('OSAIV_T4 a)', round(a4, 2) == 9.59 and close(d4, 12.975) and close(c4, 82.25), (a4, d4))
f4 = lambda xx: a4 * fsin(b4 * (xx - c4)) + d4
check('OSAIV_T4 b)', round(f4(4), 1) == 3.6, f4(4))
s4 = asin((19 - d4) / a4)
lo4, hi4 = c4 + s4 / b4, c4 + (fpi - s4) / b4
check('OSAIV_T4 c)', round(lo4) == 122 and round(hi4) == 225, (lo4, hi4))
# With the source's rounded a = 9.61, d = 12.99 the interval is 121.5 ... 225.5.

T40 = 14.98 + 0.3 * exp(0.05 * 40)
check('OSAIV_T5 a)', round(T40, 1) == 17.2, T40)
# SOURCE ERROR: the source restarts the model at 2063 with T0 = 17.2 (20.2 = 17.2 + 0.3 e^{0.05 t},
# t = 46.1). In the model T(t) = 14.98 + 0.3 e^{0.05 t} from 2023, T = 20.2 at t = ln(17.4)/0.05 = 57.1,
# i.e. 17.1 years after 2063.
t5 = log((20.2 - 14.98) / 0.3) / 0.05
check('OSAIV_T5 b)', round(t5, 1) == 57.1 and round(t5 - 40, 1) == 17.1, t5)
# SOURCE ERROR: with r < 0, e^{rt} decreases to 0, so T(t) = T0 + v e^{rt} decreases towards T0
# (for v > 0); the source says the temperature would not fall.
check('OSAIV_T5 c)', 14.98 + 0.3 * exp(-0.05 * 10) < 14.98 + 0.3 * exp(-0.05 * 5) and 14.98 + 0.3 * exp(-0.05 * 500) > 14.98)

if failures:
    print('FAILED')
    for failure in failures:
        print(' ', failure)
    raise SystemExit(1)
print('MAA5: all checks pass')
