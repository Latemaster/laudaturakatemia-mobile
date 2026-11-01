"""Independent check of the MAA2 rubric answers (docs/rubric-guidelines.md, batch protocol step 4).

Every result is recomputed with sympy from the problem statement in src/data/problems/maa2.json,
not copied from the source solutions, so a wrong source solution fails here too. When a rubric's
model solution corrects the source, the expected value here is the corrected one and the comment
says so.

    python scripts/verify/maa2.py
"""

from sympy import (
    Eq, Interval, Rational, S, Symbol, expand, factor, nsimplify, oo, real_roots, simplify, solve,
    solveset, sqrt, symbols, root, Union, Poly, degree, cancel,
)

x, t, a, b, y, n = symbols('x t a b y n', real=True)
failures = []


def check(name, condition, detail=''):
    if not condition:
        failures.append(f'{name}: {detail}')


def real_solutions(equation, var=x, domain=S.Reals):
    return solveset(equation, var, domain)


# --- Osa I ------------------------------------------------------------------------------------

f = 2 * x**2 + 4 * x + 7
check('OSAI_T1', Poly(f, x).degree() == 2 and f.subs(x, 0) == 7 and Poly(f, x).coeff_monomial(x) == 4)

check('OSAI_T2 a)', expand((3 * x + 4) + (-5 * x - 7)) == -2 * x - 3)
check('OSAI_T2 b)', expand(-3 * (2 * x - 4) - (-3 * x + 6)) == -3 * x + 6)

check('OSAI_T3 a)', expand((4 * x + 3) ** 2) == 16 * x**2 + 24 * x + 9)
check('OSAI_T3 b)', factor(x**2 + 10 * x + 25) == (x + 5) ** 2)

check('OSAI_T4 a)', simplify(sqrt(2) * sqrt(8)) == 4)
check('OSAI_T4 b)', simplify((sqrt(12) + sqrt(75)) / 7 - sqrt(3)) == 0)

check('OSAI_T5 a)', real_solutions(Eq(x**2 - 16, 0)) == {-4, 4})
check('OSAI_T5 b)', real_solutions(Eq(x**3, 8)) == {2})

check('OSAI_T6 a)', solveset(-3 * x + 6 < 0, x, S.Reals) == Interval.open(2, oo))
check('OSAI_T6 b)', solveset(-3 * x + 6 >= 0, x, S.Reals) == Interval(-oo, 2))

check('OSAI_T7 a)', real_solutions(Eq(x**2 + 7 * x - 5, 0)) == {(-7 - sqrt(69)) / 2, (-7 + sqrt(69)) / 2})
check('OSAI_T7 b)', real_solutions(Eq(4 * x**2 + 8 * x + 16, 0)) == S.EmptySet)
check('OSAI_T7 c)', real_solutions(Eq((x - 1) * (x + 5), 0)) == {1, -5})

check(
    'OSAI_T8',
    solveset(x**4 + 2 * x**3 - 3 * x**2 > 0, x, S.Reals)
    == Union(Interval.open(-oo, -3), Interval.open(1, oo)),
)

check('OSAI_T9 b)', cancel((x**2 - 4) / (2 * x + 4)) == x / 2 - 1)

xp = Symbol('xp', positive=True)
check('OSAI_T10 b)', simplify(root(xp, 4) / root(sqrt(xp), 3) - root(xp, 12)) == 0)

# --- Osa II -----------------------------------------------------------------------------------

check('OSAII_T1', expand((2 * x**3 + 4 * x**2 - 3) - (3 * x**2 + 4 * x - 2)) == 2 * x**3 + x**2 - 4 * x - 1)

check('OSAII_T2 domain', real_solutions(Eq(x**2 + 8 * x + 16, 0)) == {-4})
check('OSAII_T2 reduced', cancel((x**2 - 16) / (x**2 + 8 * x + 16) - (x - 4) / (x + 4)) == 0)

value = sqrt(50) + sqrt(63) - sqrt(196)
check('OSAII_T3 Eetu', simplify(value - (5 * sqrt(2) + 3 * sqrt(7) - 14)) == 0)
check('OSAII_T3 Peetu', simplify(value - (7 * sqrt(3) + 9 * sqrt(2) - 12)) != 0)

# Domain x > -6; only the root of x^2+5x+3 above -2 works. The source's interval "-2 < x <= 1" is
# not justified by anything, but its final answer is right.
sol = solveset(Eq(x + 2, 3 / sqrt(x + 6)), x, Interval.open(-6, oo))
check('OSAII_T4', sol == {(-5 + sqrt(13)) / 2}, sol)
check('OSAII_T4 cubic', factor(expand((x + 6) * (x + 2) ** 2 - 9)) == (x + 5) * (x**2 + 5 * x + 3))

check('OSAII_T5', 51**2 - 4 * 101 * 78 == -28911)

check('OSAII_T6', set(solve(Eq(b**2 - 4 * 8 * 4, 0), b)) == {8 * sqrt(2), -8 * sqrt(2)})

check('OSAII_T7', real_solutions(Eq(x**4 + x**2 - 2, 0)) == {-1, 1})

a_coef = solve(Eq(a * (2 + 4) * (2 - 1) * (2 - 3), 5), a)
check('OSAII_T8', a_coef == [Rational(-5, 6)], a_coef)
check(
    'OSAII_T8 expanded',
    expand(Rational(-5, 6) * (x + 4) * (x - 1) * (x - 3)) == Rational(-5, 6) * x**3 + Rational(65, 6) * x - 10,
)

check('OSAII_T3 decimals', round(float(5 * sqrt(2) + 3 * sqrt(7) - 14), 2) == 1.01 and round(float(7 * sqrt(3) + 9 * sqrt(2) - 12), 2) == 12.85)
check('OSAII_T10 discriminant', 75**2 + 4 * 2 * 750 == 11625)

sol = solveset(Eq(sqrt(3 - x) + 7, 4 * x), x, S.Reals)
check('OSAII_T9', sol == {2}, sol)
check('OSAII_T9 squared', set(solve(16 * x**2 - 55 * x + 46, x)) == {2, Rational(23, 16)})

# SOURCE ERROR: the source sets the outer rectangle (25+2x)(50+2x) equal to the 1500 m^2 of tiles and
# gets 1.60 m. The tiles cover the outer rectangle minus the pool.
sol = [s for s in solve(Eq((25 + 2 * x) * (50 + 2 * x) - 25 * 50, 1500), x) if s > 0]
check('OSAII_T10', len(sol) == 1 and abs(float(sol[0]) - 8.205) < 0.001, sol)

# --- Osa III ----------------------------------------------------------------------------------

h = 25 * t - Rational(58, 10) * t**2
t1, t2 = sorted(float(s) for s in solve(Eq(h, 10), t))
check('OSAIII_T1 a)', round(t2 - t1, 1) == 3.4, (t1, t2))
check('OSAIII_T1 b)', round(float(max(solve(Eq(h, 0), t))), 1) == 4.3)
check('OSAIII_T1 c) vertex', round(float(Rational(25, 116) * 10), 2) == 2.16 and round(float(h.subs(t, Rational(250, 116))), 1) == 26.9)

steps = symbols('steps', real=True)
price = 2 + Rational(3, 10) * steps
sold = 300 - 60 * steps
profit_set = solveset(price * sold - Rational(11, 10) * sold > 0, steps, S.Reals)
check('OSAIII_T2 steps', profit_set == Interval.open(-3, 5), profit_set)
check('OSAIII_T2 prices', price.subs(steps, -3) == Rational(11, 10) and price.subs(steps, 5) == Rational(7, 2))
check('OSAIII_T2 factored', expand(price * sold - Rational(11, 10) * sold - 18 * (3 + steps) * (5 - steps)) == 0)
check('OSAIII_T3 discriminant', expand((a + 1) ** 2 - 4 * (a + Rational(9, 4))) == a**2 - 2 * a - 8)
check('OSAIII_T1 a) root', 25**2 - 4 * Rational(58, 10) * 10 == 393)
check('OSAIV_T3 equation', expand((240 * x - 2 * x**2 - 800) / -2) == x**2 - 120 * x + 400)

# SOURCE ERROR: the source misses a = -9/4, where the equation is linear and has one solution.
quad = (a + Rational(9, 4)) * x**2 + (a + 1) * x + 1
discriminant_zero = set(solve(Eq((a + 1) ** 2 - 4 * (a + Rational(9, 4)), 0), a))
check('OSAIII_T3 D=0', discriminant_zero == {-2, 4}, discriminant_zero)
linear = solveset(Eq(quad.subs(a, Rational(-9, 4)), 0), x, S.Reals)
check('OSAIII_T3 linear case', linear == {Rational(4, 5)}, linear)
for value in (-2, 4):
    check(f'OSAIII_T3 a={value}', len(solveset(Eq(quad.subs(a, value), 0), x, S.Reals)) == 1)

tunnel = 7 - x**2 / 2
check('OSAIII_T4 a)', tunnel.subs(x, 0) == 7)
check('OSAIII_T4 b)', set(solve(tunnel, x)) == {sqrt(14), -sqrt(14)} and round(float(2 * sqrt(14)), 1) == 7.5)
check('OSAIII_T4 c)', tunnel.subs(x, Rational(31, 10)) == Rational(439, 200) and Rational(439, 200) < 3)

numerator = x**3 - 3 * x**2 + b * x + 24
b_value = solve(Eq(numerator.subs(x, 4), 0), b)
check('OSAIII_T5 b', b_value == [-10], b_value)
check('OSAIII_T5 reduced', cancel(numerator.subs(b, -10) / (x**2 - 8 * x + 16) - (x + 3) * (x - 2) / (x - 4)) == 0)
check('OSAIII_T5 factor', factor(numerator.subs(b, -10)) == (x - 4) * (x - 2) * (x + 3))

# SOURCE ERROR: the source answers a different problem (perimeter 240 m, sides differing by 20 m).
# The prompt: area 240 m^2, longer side twice the shorter.
side = [s for s in solve(Eq(x * 2 * x, 240), x) if s > 0]
check('OSAIII_T6', side == [2 * sqrt(30)] and round(float(4 * sqrt(30)), 1) == 21.9, side)

# SOURCE ERROR: the source drops y = -20 with a condition y > 0 the problem doesn't have.
middles = set(solve(Eq((y - 1) ** 2 + y**2 + (y + 1) ** 2, 1202), y))
check('OSAIII_T7', middles == {20, -20}, middles)

check('OSAIII_T8', sqrt(17) > 4 and simplify((4 - sqrt(17)) ** 2 - (33 - 8 * sqrt(17))) == 0)

check('OSAIII_T9', factor(n**8 - 1) == (n - 1) * (n + 1) * (n**2 + 1) * (n**4 + 1))

check('OSAIII_T10', real_solutions(Eq(x, (1 / (-x)) ** 2), x, S.Reals - {0}) == {1})

# --- Osa IV -----------------------------------------------------------------------------------

A, B, C = symbols('A B C', real=True)
for r in solve(A * x**2 + B * x + C, x):
    check('OSAIV_T1 formula', simplify(A * r**2 + B * r + C) == 0)

g = sqrt((2 * x + 1) / (2 * x))
# SOURCE ERROR: the source gives the domain as x <= -1 or x > 0; it is x <= -1/2 or x > 0.
domain = solveset((2 * x + 1) / (2 * x) >= 0, x, S.Reals)
check('OSAIV_T2 b) domain', domain == Union(Interval(-oo, Rational(-1, 2)), Interval.open(0, oo)), domain)
check('OSAIV_T2 b) values', g.subs(x, Rational(-1, 2)) == 0 and simplify(g.subs(x, 1)) == sqrt(Rational(3, 2)))

road = solve(Eq(120 * x + 2 * 60 * x - 2 * x**2, 800), x)
check('OSAIV_T3', round(float(min(road)), 2) == 3.43 and float(max(road)) > 60, road)

check('OSAIV_T4', all((r * (r + 1) * (r + 2) * (r + 3) * (r + 4)) % 5 == 0 for r in range(-50, 50)))

ap, bp = symbols('ap bp', nonnegative=True)
check('OSAIV_T5', simplify(sqrt(ap) * sqrt(bp) - sqrt(ap * bp)) == 0)

if failures:
    print('FAILED')
    for failure in failures:
        print(' ', failure)
    raise SystemExit(1)
print('MAA2: all checks pass')
