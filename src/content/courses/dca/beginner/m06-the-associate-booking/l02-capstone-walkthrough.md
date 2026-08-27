# The capstone walkthrough

The Associate capstone asks you to fit and book one well, Ekene-1, on its primary window. Six numbers are graded, each within a stated tolerance. This lesson shows you exactly where each number comes from. It does not hand you six answers to copy; it walks two of them end to end, one from the panel and one by hand, and then points you at the lesson that derives each of the rest. If you worked modules 2 through 5, nothing here is new. The capstone is the course, asked back.

The six graded fields are:

| Field | Unit | Tolerance |
|---|---|---|
| Fitted initial rate qi | stb/d | 0.5 |
| Fitted nominal decline Di | 1/d | 0.00002 |
| EUR at the 10 stb/d limit | stb | 500 |
| Time to the 10 stb/d limit | days | 10 |
| Cumulative production at 2023-01-01 | stb | 400 |
| Tangent effective annual decline | %/yr | 0.1 |

Read the tolerances as a promise: any honest route to the number lands inside them. Panel readings, hand closed forms, and the full-precision engine values all agree far more tightly than the tolerance asks.

## Walkthrough 1: qi and Di, off the panel

Open the fit explorer below. Set the well to Ekene-1, the model to Auto-select, and the window to Primary (pre-flood). The grey points beyond the flood line drop out of the fit; that is the window doing its job.

{{panel:dca-fit-explorer}}

The engine returns Exponential, and the tiles read qi = 120 stb/d and Di = 0.0012 per day, with R2 of 1. Those two tiles are two of your six answers, at full precision, because this data is noise-free and the fit recovers the planted truth exactly. The thing being graded is not arithmetic, it is the choice you made one step earlier: the window. Move the window to Full history and watch the fit change family and the tiles walk away from the truth. Submitting those numbers fails four of the six fields at once. The capstone is, quietly, a test of step 2 of the workflow.

## Walkthrough 2: the effective decline, by hand

The sixth field converts Di into the form a reserves report quotes. The tangent effective annual decline is

$$D_e = 1 - e^{-D_i \times 365}$$

with Di per day, so the exponent is the annual nominal decline. Work it with a calculator:

$$D_i \times 365 = 0.0012 \times 365 = 0.438$$

$$D_e = 1 - e^{-0.438} = 1 - 0.645325782857295 = 0.354674217142705$$

As a percentage, 35.4674217142705 percent per year, and the graded tolerance of 0.1 means 35.47 or even 35.5 passes. Do this one on paper. It is thirty seconds of work, and it is the single most common place a real-world booking misstates itself, because 0.438 per year nominal and 35.47 percent per year effective are answers to two different questions. Module 2 lesson 4 is the place to reread if that sentence is not obvious yet.

## Where the other three come from

**EUR at 10 stb/d.** The exponential closed form from module 5 lesson 2: EUR = (qi - q_limit) / Di. Two subtractions and a division from the qi and Di you already have. The panel's EUR tile shows the same number, but derive it once by hand so you know the tile is not magic.

**Time to the limit.** Module 5 lesson 3: t = ln(qi / q_limit) / Di. Note it is graded in days because Di is per day. Reporting it in years without converting is the error the tolerance of 10 days will not forgive.

**Cumulative at 2023-01-01.** Module 3 lesson 2: Np(t) = (qi / Di)(1 - e^{-Di t}), with t the days from 2020-01-01 to 2023-01-01, which is 1096 (2020 is a leap year). The panel's Np tile reads it directly. Do not sum the monthly table instead; module 3 lesson 4 showed why a snapshot sum lands outside honest agreement with the integral, and the tolerance here is deliberately tighter than that shortcut's error.

## Submitting

The capstone form is on the Learning Mode page, under the course. Enter the six numbers, at whatever precision you carried, and submit. Grading is server-side against the engine truth within the stated tolerances; you will see which fields passed. If one fails, the fix is almost never more decimal places. It is rereading the lesson that derives that field, because a miss outside these tolerances means a method error, not a rounding error.

## Exercise

Before submitting, predict which of the six fields would fail, and in which direction, if you made each of these mistakes: fitting the full history instead of the primary window; using 365 times Di as the effective decline; computing time to limit with natural log base 10; and summing the monthly rows for the cumulative. Then make the first mistake deliberately in the panel and check your prediction against the tiles. The next lesson catalogues these errors properly.
