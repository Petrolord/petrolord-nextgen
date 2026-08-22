# Choosing cutoff values

The previous lesson treated the cutoff values as given. This one asks where they come from, and why the honest answer is a mixture of physics, field history and bookkeeping convention.

## The physical anchor: permeability

The most defensible cutoffs are calibrated to core. The reasoning runs in three steps. Production needs flow, flow needs permeability, and permeability is not logged directly in a standard triple-combo suite. So you take core plugs, measure porosity and permeability on each, and crossplot them. The plot typically shows permeability rising steeply with porosity. You then pick a minimum useful permeability for the reservoir and fluid in question (a common convention for oil is around 0.1 mD, for gas lower, because gas flows through tighter rock) and read across the trend to the porosity that delivers it. That porosity becomes $\phi_{cut}$.

The same logic drives the shale cutoff. Rising clay content destroys effective permeability long before it fills the pore space, so a $V_{sh}$ threshold stands in for a permeability floor in shaly intervals. The saturation cutoff has a different justification: above some $S_w$, the well produces water at rates that make the interval uneconomic to complete, so the threshold approximates a water-cut limit rather than a storage limit.

## The typewell givens

The typewell dataset ships with the three cutoffs already agreed:

| Cutoff | Value | Direction |
|---|---|---|
| $\phi_{cut}$ | 0.08 | pay requires $\phi \geq 0.08$ |
| $V_{sh,cut}$ | 0.5 | pay requires $V_{sh} \leq 0.5$ |
| $S_{w,cut}$ | 0.6 | pay requires $S_w \leq 0.6$ |

These are unremarkable, middle-of-the-road values for a conventional oil sand, and that is deliberate: the teaching point is the machinery, and the machinery is identical whatever the numbers are.

## Convention as much as physics

It is worth being clear-eyed about how much of this is convention. A porosity cutoff of 0.08 rather than 0.07 cannot usually be defended sample by sample; the core crossplot has scatter, and the minimum permeability it was read from was itself a judgement. Different companies inherit different house values. Joint venture agreements and unitisation contracts sometimes write specific cutoffs into the legal definition of net pay, at which point the "right" value is whatever the contract says. Regulators and reserves auditors care less about the specific values than about consistency: the same cutoffs applied the same way across wells and across time.

That leads to the single most important discipline in this lesson: **always report the cutoffs alongside the answer**. A net pay of 18 m is meaningless on its own. A net pay of 18 m at $\phi \geq 0.08$, $V_{sh} \leq 0.5$, $S_w \leq 0.6$ is reproducible by anyone with the curves. When two interpretations of the same well disagree, mismatched cutoffs are one of the first things to check.

## Sensitivity intuition

Because each cutoff is a filter, tightening any one of them can only remove samples; it can never add them. Suppose the partner company insists on $S_{w,cut} = 0.5$ instead of 0.6. Every sample that passed at 0.5 still passes at 0.6, but some samples between 0.50 and 0.60 that used to count now fail. Net pay therefore stays the same or shrinks. It cannot grow.

Worked example: in a zone, the pay samples under the house cutoffs have these saturations: 0.35, 0.35, 0.42, 0.48, 0.55, 0.58 (six samples at 0.5 m each, so 3.0 m of net pay). Tightening $S_{w,cut}$ to 0.5 removes the last two samples. Net pay drops to $4 \times 0.5 = 2.0$ m, a loss of a third. Notice also what happens to the reported average saturation: over the surviving four samples $\bar{S_w} = (0.35 + 0.35 + 0.42 + 0.48)/4 = 0.40$, lower than before. Tighter cutoffs make the booked rock look better while there is less of it. Both effects are automatic consequences of filtering, and a reader who does not know the cutoffs changed could easily misread them as a change in the reservoir.

The reverse reasoning applies to loosening. If someone proposes relaxing $\phi_{cut}$ from 0.08 to 0.06 "to capture upside", net pay can only grow, and the added samples are by construction the worst rock in the zone, so the pay-average porosity will fall. Neither direction is wrong in itself. What matters is that the choice is stated, justified and applied consistently.

## Exercise

A zone books 12.0 m of net pay with cutoffs $\phi \geq 0.08$, $V_{sh} \leq 0.5$, $S_w \leq 0.6$.

1. The team tightens $V_{sh,cut}$ to 0.3. Give the full range of net pay values that are now possible, before looking at any curves.
2. Two wells in the same field were interpreted with different $S_w$ cutoffs, 0.6 and 0.5, and their net pays are being compared in a presentation without a footnote. Why is this comparison unsafe?

Self-check: (1) anywhere from 0 m to 12.0 m; a tighter filter can only remove samples. (2) Some of the difference between the wells may be nothing but the cutoff change, since the tighter cutoff can only have removed pay from the second well; the comparison confounds rock quality with booking convention.
