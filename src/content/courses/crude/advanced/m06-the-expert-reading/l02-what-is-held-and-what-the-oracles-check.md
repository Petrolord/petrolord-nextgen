# What is held and what the oracles check

The digest's last section answers two questions beyond the result: what the engines state as limits, and what independent check each engine is held to. This lesson reads both for the three engines in this course. The first answer is three held items, stated as limits. The second is three independent oracles.

## Three held items

The digest prints each with two columns: what the engine does, and the limit. The course states both, and it does not tell the learner which choice is right. The digest says each is "taught as a stated limit and never graded".

| item | what the engine does | the limit |
| --- | --- | --- |
| L4 | the LP kernel uses absolute tolerances on its pivots and on phase one | right for the barrel-scale problems the two apps pose; a problem scaled in millions is outside what it is shown to handle |
| C12 | the Refutas index blends on mass fraction ("Refutas index on mass fraction") | ASTM D7152 blends on volume; the two disagree (the Obigbo export blend reads 7.4743 cSt on mass and 7.3107 cSt on volume), and the basis is a course and owner decision |
| C13 | Watson K is taken at the blend's T50 | a screening basis; the strict basis is the mean average boiling point |

**L4 belongs to this tier.** Every result in modules one to five came from a kernel that, in the digest's words, "uses absolute tolerances on its pivots and on phase one". The Apapa cargo of 8000 bbl and the AGO cargo of 6000 bbl are the barrel-scale problems the apps pose, and there, the digest says, the tolerances are right. The limit is a statement about scale.

**C12 reaches this tier through the AGO pool.** The optimizer blends viscosity through the same Refutas index on mass as the assay studio. The AGO recipe's viscosity reads 3.0036 cSt on mass and 2.9518 cSt with the index on volume instead. Both are printed, and the choice between the bases is held.

**C13 belongs to the Professional tier's Watson factor.** It is listed here so the three held items are read together once.

A held item travels with the figure it touches. The AGO viscosity of 3.0036 cSt is quoted with the basis the engine used, the index on mass, and the L4 limit is quoted as the digest states it: right for barrel-scale problems, with a problem scaled in millions outside what the kernel is shown to handle.

## Three oracles

In the digest's words, "Each engine is held to an independent Python oracle in tools/validation/downstream, written from the rules and not from the JavaScript". Each computes by the route its row names:

| oracle | how it computes | golden cases |
| --- | --- | --- |
| oracle_crudeassay.py | loads a cargo in barrels and pounds; Refutas inverted by bisection; yields by segment overlap; T50 by bisection; netback as a 100,000 bbl account | 6 blends, 4 curve cases, 1 blended default curve |
| oracle_productblending.py | rows built from physical mass balances, solved by exact rational vertex enumeration; properties from physical inventories; relief by exact re-solve with the limit moved by a step of 1/10^7 of a unit each way, an exact one-sided derivative on each side | 9 pools |
| oracle_lp.py | exact rational vertex enumeration with no simplex at all; shadow prices as exact one-sided derivatives by re-solve | 181 problems (124 optimal, 44 infeasible, 13 unbounded) |

Read the LP oracle against module one. Its row reads "exact rational vertex enumeration with no simplex at all", and module one's fact is that the optimum, when there is one, is found at a vertex. The kernel works with absolute tolerances, which is L4; the oracle's row names exact rational arithmetic. Its 181 problems are 124 optimal, 44 infeasible and 13 unbounded, and module one printed the digest's line on the last two: "Infeasible and unbounded are answers".

Read the blending oracle against module four. It prices relief by exact re-solve with the limit moved by a step of 1/10^7 of a unit each way. Lesson five of that module re-solved at one whole unit, a different step.

The digest also counts its refusals: 17, each asserted against the engine before it was printed.

## Constants the engines state

The engines export their constants, so a reader can read them from the modules: RVP_INDEX_EXPONENT 1.25, the default exponent of rvpIndex and rvpFromIndex; BINDING_TOLERANCE 1e-7; CII_BANDS.STABLE 0.7 and CII_BANDS.UNSTABLE 0.9.

## Exercise

Read the oracle_lp.py row: 181 problems, 124 optimal, 44 infeasible and 13 unbounded, by exact rational vertex enumeration with no simplex. Read the L4 limit beside it. Say what the vertex enumeration relies on from module one. Then quote what L4 says the kernel uses, and the words in the oracle's row that describe how the oracle computes instead.
