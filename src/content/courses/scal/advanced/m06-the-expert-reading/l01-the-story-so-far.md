# The story so far

The Associate tier gave you one displacement and one answer: the Ekene sand, a mobility ratio of 1.2, a front at 0.6372, half the movable oil recovered by breakthrough. The Professional tier gave you the capillary half: one J curve under three plugs, a free water level below the mapped contact, a crest that just drains to connate. This tier gave you something different. It gave you the levers.

Five modules, five levers, and every one of them was measured rather than described. Fitting turned a lab table back into the exponents that generated it. Normalization carried a curve shape from one rock frame to another. The averaging module showed you a workflow that is exact in four moves and biased in the fifth. Gravity and polymer each moved the breakthrough efficiency, one barely, one substantially, and the point in both cases was knowing which and by how much.

## The six numbers

The Expert capstone grades six fields. Each one was earned in a specific module, on a specific designed case, and each has a wrong-method neighbour that its tolerance was built to reject.

| Field | Value | Designed case | Owned by |
| --- | --- | --- | --- |
| fitted_nw | 2.4999999999999996 | 13-row lab grid, Sw 0.35 to 0.75, fixed endpoints | m01 |
| avg_refit_a | 0.2491501585202375 | averageJCurves over the three Ekene plugs, Swirr 0.25 | m03 |
| gravity_ed_bt | 0.5095807170488317 | k 250 md, A 20000 ft2, qt 2000 rb/d, dip 10 degrees updip | m04 |
| downdip_ed_bt | 0.5081700834294871 | the same case with dip reversed to minus 10 degrees | m04 |
| polymer_ed_bt | 0.5771964898801638 | polymerMuMult 4 on the base Ekene displacement | m05 |
| sw_avg_crest_column | 0.48345033394940007 | trapezoid, 2000 intervals, contact to crest | m03 |

Look down the middle column and notice how much of it is the same quantity. Three of the six are a breakthrough displacement efficiency, and they differ from the flat base value of 0.5088773453049006 by amounts ranging from seven parts in ten thousand to seven parts in a hundred. That is deliberate. The tier's whole argument is that design decisions live in the third and fourth decimal places, and that an engineer who cannot keep three EDbt variants apart by provenance cannot keep a design study apart from a typo.

## What each lever taught

The fit taught you that the machinery is honest when the data is: nw came back as 2.4999999999999996 with an rmsLog of 1.3784958753881249e-16, which is the arithmetic saying the plant and the recovery are the same number. The lesson was never the fit succeeding. It was the two rows the krFloor excluded, the confidence intervals collapsing to zero width, and what both of those would look like on real, noisy core data.

The average taught you the opposite: machinery that is honest in every visible way and still biased. The refit of the averaged curve lands at 0.2491501585202375 against a plant of 0.25, with an r2Log of 0.9998442671274563 that would pass any review in the industry. The bias enters in the one move nobody audits, the log-linear resample, and it is why the capstone grades the drifted value rather than the design value.

Gravity taught you scale. The dip term at field rate moved the front from 0.6372 to 0.6376 and the efficiency by 0.0007. Reversing the dip moved it the same distance the other way. Rate is the multiplier: cut the rate to 500 rb/d and the gain grows to 0.511665846741284. None of these is a rescue. All of them are real, and pricing them honestly is the skill.

Polymer taught you what an actual design lever looks like: multiply the water viscosity by four and the efficiency at breakthrough climbs from 0.5088773453049006 to 0.5771964898801638, nearly seven saturation points of average water behind the front. It also taught you the cost of the word screening, because the engine models none of the chemistry that decides whether that multiplier survives contact with the rock.

And the column average closed the loop with the booking you started this course from. The flat Sw of 0.35 that the volumetric STOIIP used is the crest value. Integrated over the crest column, the honest average is 0.48345033394940007. The gap between those two numbers is the transition zone the flat model ignored.

## The misconception to avoid

The misconception at this stage is treating the six values as six facts to memorize. They are not facts about nature. Every one is a fact about a stated case: a stated grid, a stated Swirr, a stated rate and dip and area, a stated integration rule. Change any part of the statement and the value moves, which is exactly why the capstone prompts restate the cases in full. An Expert answer is a number wearing its provenance, and a bare number, however precise, is a Professional answer at best.

## Exercise

First, without looking back, write down for each of the six fields which single input you would change to move it and in which direction the value would go. Then check yourself against the modules.

Second, take the three EDbt variants and the flat base value and arrange all four on a line. Annotate each gap with the lever that creates it and the capstone tolerance that has to resolve it. Decide which gap you consider a design signal and which is bookkeeping, and write one sentence defending the split.
