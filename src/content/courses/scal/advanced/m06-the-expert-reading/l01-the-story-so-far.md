# The story so far

The Associate tier gave you one displacement and one answer: the Ekene sand, a mobility ratio of 1.2, a front at 0.6372, half the movable oil recovered by breakthrough. The Professional tier gave you the capillary half: one J curve under three plugs, a free water level below the mapped contact, a crest that just drains to connate. This tier gave you something different. It gave you the levers.

Five modules, five levers, and every one of them was measured rather than described. Fitting turned a lab table back into the exponents that generated it. Normalization carried a curve shape from one rock frame to another. The averaging module showed you a workflow that is exact in four moves and biased in the fifth. Gravity and polymer each moved the breakthrough efficiency, one barely, one substantially, and the point in both cases was knowing which and by how much.

## The six numbers

The Expert capstone grades six fields. Each one was earned in a specific module, on a specific designed case, and each has a wrong-method neighbour that its tolerance was built to reject.

| Field | Designed case | Worked in the module on | Owned by |
| --- | --- | --- | --- |
| fitted_nw_printed_grid | 13-row lab grid, Sw 0.35 to 0.75, kr printed to 3 dp, fixed endpoints | the noise-free grid | m01 |
| avg_refit_a | averageJCurves over the three Ekene plugs, Swirr 0.25 | the mechanism, and Swirr 0.2 on the panel | m03 |
| gravity_ed_bt | k 250 md, A 20000 ft2, qt 2000 rb/d, dip 10 degrees updip | 5 degrees at 500 rb/d | m04 |
| downdip_ed_bt | the same case with dip reversed to minus 10 degrees | minus 5 degrees at 500 rb/d | m04 |
| polymer_ed_bt | polymerMuMult 4 on the base Ekene displacement | a multiplier of 2 | m05 |
| sw_avg_crest_column | trapezoid, 2000 intervals, contact to crest, Ekene rock | the 180 md teaching sand | m03 |

The values are yours to produce: each module worked its chain on a nearby case, and the capstone asks for the designed one.

Look down the middle column and notice how much of it is the same quantity. Three of the six are a breakthrough displacement efficiency, and they differ from the flat base value of 0.5088773453049006 by amounts ranging from parts in ten thousand to parts in a hundred. That is deliberate. The tier's whole argument is that design decisions live in the third and fourth decimal places, and that an engineer who cannot keep three EDbt variants apart by provenance cannot keep a design study apart from a typo.

## What each lever taught

The fit taught you that the machinery is honest when the data is, and the capstone then asks what it does when the data is merely printed: nw came back as 2.4999999999999996 with an rmsLog of 1.3784958753881249e-16, which is the arithmetic saying the plant and the recovery are the same number. The lesson was never the fit succeeding. It was the two rows the krFloor excluded, the confidence intervals collapsing to zero width, and what both of those would look like on real, noisy core data.

The average taught you the opposite: machinery that is honest in every visible way and still biased. The refit of the averaged curve lands below the plant of 0.25, with an r2Log of 0.9998442671274563 that would pass any review in the industry. The bias enters in the one move nobody audits, the log-linear resample, and it is why the capstone grades the drifted value rather than the design value.

Gravity taught you scale. Five degrees at a slow 500 rb/d moved the front two grid steps and the efficiency by 0.0014; reversing the dip moved it about the same distance the other way. Rate is the multiplier: cut the rate to 250 rb/d and the efficiency reaches 0.5116763590144309, while at field rates the term nearly vanishes. None of these is a rescue. All of them are real, and pricing them honestly is the skill.

Polymer taught you what an actual design lever looks like: merely double the water viscosity and the efficiency at breakthrough climbs from 0.5088773453049006 to 0.5492340379388816, four saturation points of average water behind the front, and the design multiplier of 4 climbs further. It also taught you the cost of the word screening, because the engine models none of the chemistry that decides whether that multiplier survives contact with the rock.

And the column average closed the loop with the booking you started this course from. The flat Sw of 0.35 that the volumetric STOIIP used is close to the crest value. Integrated over the crest column, the honest average is far wetter: on the teaching sand, 0.49854926237175007. The gap between those two numbers is the transition zone the flat model ignored.

## The misconception to avoid

The misconception at this stage is treating the six values as six facts to memorize. They are not facts about nature. Every one is a fact about a stated case: a stated grid, a stated Swirr, a stated rate and dip and area, a stated integration rule. Change any part of the statement and the value moves, which is exactly why the capstone prompts restate the cases in full. An Expert answer is a number wearing its provenance, and a bare number, however precise, is a Professional answer at best.

## Exercise

First, without looking back, write down for each of the six fields which single input you would change to move it and in which direction the value would go. Then check yourself against the modules.

Second, take the three EDbt variants and the flat base value and arrange all four on a line. Annotate each gap with the lever that creates it and the capstone tolerance that has to resolve it. Decide which gap you consider a design signal and which is bookkeeping, and write one sentence defending the split.
