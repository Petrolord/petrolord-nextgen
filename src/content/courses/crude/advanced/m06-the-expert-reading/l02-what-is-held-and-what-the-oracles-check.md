# What is held and what the oracles check

An expert reader of any engine asks two questions beyond the result: what does this engine not claim to do, and who checked the part it does claim? This lesson answers both for the three engines in this course. The first answer is three held items, stated as limits. The second is three independent oracles.

## Three held items

Each is a place where the engine makes a choice that a reasonable planner could make differently. The course states what the engine does and where the limit lies, and it does not tell the learner which choice is right. None is graded.

| item | what the engine does | the limit |
| --- | --- | --- |
| L4 | the LP kernel uses absolute tolerances on its pivots and on phase one | right for the barrel-scale problems the two apps pose; a problem scaled in millions is outside what it is shown to handle |
| C12 | the Refutas index blends on mass fraction ("Refutas index on mass fraction") | ASTM D7152 blends on volume; the two disagree (the Obigbo export blend reads 7.4743 cSt on mass and 7.3107 cSt on volume), and the basis is a course and owner decision |
| C13 | Watson K is taken at the blend's T50 | a screening basis; the strict basis is the mean average boiling point |

**L4 belongs to this tier.** Every result in modules one to five came from a kernel that decides "zero" and "exactly met" by fixed tolerances. The Apapa cargo of 8000 bbl and the AGO cargo of 6000 bbl are the barrel-scale problems the apps pose, and there the tolerances are right. A problem whose coefficients run into millions sits outside what the kernel is shown to handle. The limit is a statement about scale. It does not say such a problem fails, only that nothing here shows it succeeds.

**C12 reaches this tier through the AGO pool.** The optimizer blends viscosity through the same Refutas index on mass as the assay studio. The AGO recipe's viscosity reads 3.0036 cSt on mass and 2.9518 cSt with the index on volume instead. Both are printed, and the choice between the bases is held.

**C13 belongs to the Professional tier's Watson factor.** It is listed here so the three held items are read together once.

A held item changes how a result is quoted. A planner who reports an AGO viscosity names the basis the engine used, and a planner who solves a problem far from barrel scale says the kernel is outside its shown range. Stating the limit beside the figure is the whole of the discipline.

## Three oracles

Each engine is held to an independent Python oracle, written from the rules, independently of the JavaScript. An oracle that restated the engine's code would share its mistakes, so each computes by a different route:

| oracle | how it computes | golden cases |
| --- | --- | --- |
| oracle_crudeassay.py | loads a cargo in barrels and pounds; Refutas inverted by bisection; yields by segment overlap; T50 by bisection; netback as a 100,000 bbl account | 6 blends, 4 curve cases, 1 blended default curve |
| oracle_productblending.py | rows built from physical mass balances, solved by exact rational vertex enumeration; properties from physical inventories; relief by exact re-solve with the limit moved | 9 pools |
| oracle_lp.py | exact rational vertex enumeration with no simplex at all; shadow prices as exact one-sided derivatives by re-solve | 181 problems (124 optimal, 44 infeasible, 13 unbounded) |

Read the LP oracle against module one. It uses no simplex at all. It enumerates vertices in exact rational arithmetic, which is possible because the optimum sits at a vertex, and it has no tolerances, which is exactly what L4 is about. Its 181 problems include 44 infeasible and 13 unbounded, because those statuses are answers and have to be checked as answers.

Read the blending oracle against module four. It prices relief by exact re-solve with the limit moved, the check lesson five of that module read, so the engine's scaled derivative is held to a separate computation.

The digest also counts its refusals: 17, each asserted against the engine before it was printed.

## Constants the engines state

The engines export their constants, so a reader reads them and never recalls them: RVP_INDEX_EXPONENT 1.25, BINDING_TOLERANCE 1e-7, CII_BANDS.STABLE 0.7 and CII_BANDS.UNSTABLE 0.9.

## Exercise

Read the oracle_lp.py row: 181 problems, 124 optimal, 44 infeasible and 13 unbounded, by exact rational vertex enumeration with no simplex. Read the L4 limit beside it. Say what the vertex enumeration relies on from module one, and say what an oracle with no tolerances shows about the held item L4.
