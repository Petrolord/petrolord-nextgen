# Seven treatments, one well

`screenTreatments` returns a verdict for all seven treatments on every call. It chooses none of them and it prices none of them.

{{panel:pd-channel-explorer}}

## The catalogue is a lookup, not a result

Matrix acid, hydraulic fracture and recompletion are flagged as addressing skin. Water shutoff squeeze and reduce drawdown address water, gas shutoff addresses gas, artificial lift addresses lift. Those flags are catalogue entries: nothing computes them and nothing checks them against a well.

## One well row, seven verdicts

Teaching well ELELENWO-4 was built by this course to carry a result, not a real well and not a published case. It carries a water cut of 74.5 percent, a skin of 7.5, a gas-oil ratio of 2152 scf/stb against an expected 950 scf/stb, and it is flowing. Its diagnosis here was taken at the default late window, which starts at t = 250.242976 days and returns a derivative slope of 1.442132492 fitted on the 15 positive samples of that window across 0.900620470 log cycles.

| Treatment | Verdict | Reasons |
| --- | --- | --- |
| Matrix acid stimulation | candidate | 1 |
| Water shutoff squeeze | candidate | 3 |
| Recompletion or reperforation | candidate | 1 |
| Hydraulic fracture | consider | 3 |
| Gas shutoff squeeze | consider | 2 |
| Add or upgrade artificial lift | consider | 1 |
| Reduce drawdown | no | 1 |

`rankTreatments` hands them back in that order. The sort key is the verdict, the verdict order is fixed at candidate, consider, marginal, blocked, unknown, no, and ties are broken by the order the treatments were pushed rather than by anything about the well.

## The reasons are the product

A verdict is one word. The reason strings, between one and three per treatment, carry the argument. Matrix acid reads "A skin of 7.5 is heavy damage. Most of what this well could make is being lost in the last few feet." Reduce drawdown reads "Only worth it for coning, and the diagnostic does not say coning. Choking a channelling well back gives away rate without touching the water path." The second is a refusal that names the evidence which would reverse it.

## What the screening refuses to do

It returns no cost, no duration, no volume and no rate. Nothing says how much acid or how many days on a rig. It gates whether a treatment is arguable, and the sizing sits outside the module. With no skin entered, matrix acid comes back unknown rather than refused and the other six are unchanged.

## The mistake

Reading the ranked list as a ranking of value. Three treatments come back candidate at once, and the one printed first is first because of a push order in the source. A planner who reads position as priority has been told nothing: the engine sorted on a six-value enumeration and on nothing else.

## Exercise

Run a channelling diagnosis in the panel and write the seven verdicts with the reason count beside each.

Then say which single field of the diagnosis decided all seven.
