# The golden fixtures

Every number in this course comes from a fixture, and it is worth knowing exactly what a fixture is before you start computing with one. Nobody drilled these cases. They were constructed so that the right answer at every step is known in advance and can be checked to the last digit against an implementation written independently, in a different language, by someone working from the equations rather than from the code.

## What committed and golden mean

The teaching data is not a spreadsheet that lives on someone's laptop. It is a file committed to the engine repository, tested on every build, and used unchanged by three things: the panels you will use in this course, the capstone that grades you, and the engine that the Suite application runs in production. If any of them drifted from the others, the build would fail.

That is what golden means. The expected values are stored beside the code, and the code is not allowed to disagree with them.

## The independent oracle

Beside the engine sits a second implementation of the same physics, written in plain Python with no shared code and no shared libraries. It reads the same inputs and produces its own answers. The two are then compared.

They agree to about 1e-9 on the kinetics and about 1e-4 m on the geometry.

Take a moment over what that buys you. Two people writing the same equation in two languages make different mistakes. They pick different loop structures, different orders of summation, different ways of handling the first and last cell. If either had misread the equation, or dropped a term, or set an index one place off, the two answers would differ in the third significant figure and not in the ninth. Agreement at 1e-9 is not proof that the physics is the right physics for the earth. It is strong evidence that both programs are computing the equation that was written down, which is a different claim and the one you need before you trust a number.

The graded tolerances in this course sit far above that agreement. A thickness is graded to 0.05 m and a porosity to 0.001 v/v, while the two implementations differ by around 1e-4 m on a geometry that is hundreds of metres long. The numerical disagreement between the two codes is orders of magnitude smaller than the tolerance you are marked against, so if your answer is outside tolerance, the cause is your arithmetic and never the fixture.

## Fixture one: the decompaction cases

The first family of fixtures is a set of compaction and decompaction cases on a single lithology, shale, with the engine's library values of surface porosity 0.63 and compaction constant 0.00051 per m.

Each case takes a 100 m layer of shale found at a stated burial depth, computes the solid thickness of grain inside it, and restores that same grain to the surface.

| buried at | solid thickness | restored thickness |
|---|---|---|
|  500 m | 52.404268 m | 134.010303 m |
| 1000 m | 63.117282 m | 159.795535 m |
| 2000 m | 77.852091 m | 194.513330 m |
| 3000 m | 86.700278 m | 214.973300 m |

Read the table downwards. The deeper a 100 m layer is found today, the more grain is packed into it, and the more it expands when the pore space is put back. Module 2 builds the solid thickness column and module 3 builds the restored thickness column.

## Fixture two: the two layer steady heat column

The second fixture is a column of rock with a fixed heat flow driven through it.

The surface temperature is 10 degC. The basal heat flow is 0.06 W/m2, which is 60 mW/m2. An upper layer 1000 m thick with a thermal conductivity of 1.8 W/m/K sits over a lower layer 1000 m thick with a conductivity of 3.5 W/m/K. Each layer is divided into ten cells of 100 m, so the cell centres sit at 50 m, 150 m and on down to 1950 m.

That is the whole fixture, and module 4 shows that the answer to it is arithmetic you can do on paper. The interesting part is not the temperatures themselves but the fact that one heat flow through two conductivities produces two different geothermal gradients in the same column.

## Fixture three: the reference basin

Behind both of those sits a four layer basin that the higher tiers run. It carries 150 million years of history, a heat flow that cools from 80 mW/m2 to 60 mW/m2, and a 600 m erosion event 10 million years ago.

You will not run it at this tier. It is described here so that you know the small fixtures are not toys invented for a beginner course. They are the first two stages of the same pipeline, using the same engine, with the same oracle behind them. The Professional tier adds the maturity kinetics on top of these two stages and the Expert tier runs the whole 150 million year history and reads generation and expulsion out of it, then recovers the erosion signature by rerunning the model without the event.

## Why a synthetic

On a real basin, every disagreement has two explanations, an error in your method or a genuine feature of the geology, and a beginner has no way to separate them. On these fixtures there is no ambiguity. The inputs were chosen, the equations follow, and the answers are facts about the fixture rather than opinions about a field.

So when your number matches, you have the method right, and you can take that method somewhere nobody knows the answer.

## Exercise

State in one sentence what the agreement of 1e-9 between the two implementations does establish, and in one sentence what it does not. Then say why a graded tolerance of 0.05 m on a thickness is safe given a geometry agreement of about 1e-4 m.

Self check: the agreement establishes that two independently written programs are evaluating the same equations correctly, so a discrepancy in your answer is your arithmetic rather than a defect in the fixture. It does not establish that the equations are a correct description of any real basin, which is a question about the physics and about the input parameters, not about the code. The tolerance is safe because 0.05 m is orders of magnitude larger than the 1e-4 m disagreement between the implementations, so the numerical noise cannot move an answer across the tolerance boundary.
