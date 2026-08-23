# Sensitivity of booked pay

Everything in this course so far has produced continuous curves: porosity, shale volume, water saturation, each a smooth function of depth. Net pay is different. It is a discrete decision made sample by sample: each 0.5 m sample either passes all three cutoffs or it does not. That discreteness has a consequence every professional needs to internalise: small, smooth changes in an input curve can produce sudden, stepwise changes in the booked result. This lesson demonstrates it on the typewell with a controlled experiment.

## The experiment

Book net pay for SAND_A (2010 to 2030 m) three times. Hold everything constant: porosity is neutron-density, $\phi_{ND}$, shale volume is the linear transform, and the cutoffs are the course standards of $\phi \ge 0.08$, $V_{sh} \le 0.5$ and $S_w \le 0.6$. Change only the saturation model between runs.

The engine results:

| Saturation model | Gross (m) | Net (m) | NTG | Mean $\phi$ | Mean $S_w$ |
|---|---|---|---|---|---|
| Archie | 20.5 | 19.0 | 0.927 | 0.1752 | 0.4382 |
| Simandoux | 20.5 | 20.0 | 0.976 | 0.1762 | 0.4335 |
| Indonesia | 20.5 | 20.0 | 0.976 | 0.1762 | 0.4280 |

Read the saturation column first. The three zone means sit within about 0.010 saturation units of one another: 0.4382, 0.4335, 0.4280. In a clean sand like SAND_A that is exactly the small spread the previous module taught you to expect, because both shaly-sand models collapse toward Archie as $V_{sh}$ goes to zero.

Now read the net column. Archie books 19.0 m of net; Simandoux and Indonesia each book 20.0 m. A full metre of pay, about five percent of the zone, appears or disappears depending on which saturation equation you selected, even though the equations disagree by only about one saturation point on average.

## Why one metre flips

The mechanism is the cutoff. Near the edges of the sand, samples carry a little shale and slightly poorer porosity, so their computed $S_w$ sits close to the 0.6 cutoff. Archie, which sends all conductivity to the water term, computes the highest saturation of the three models at every shaly sample. For a couple of edge samples that is enough to push $S_w$ just above 0.6, and the pay flag flips from 1 to 0. Simandoux and Indonesia assign part of the same conductivity to the shale, their $S_w$ at those samples lands just below 0.6, and the flag stays up.

Notice that the flipped samples also drag the reported averages around. The Archie run shows a lower mean porosity (0.1752 against 0.1762) not because porosity changed, but because the samples it excluded happened to carry slightly better porosity than the ones it kept, and zone means are computed over net samples only. The booked averages are conditional on the booking itself. This is a subtle trap when comparing runs: differences in phi_avg between two runs may reflect which samples were counted, and only secondarily what any curve did.

## The general principle

A cutoff is a step function applied to a noisy, model-dependent curve. Wherever the curve grazes the cutoff value, tiny perturbations in the curve translate into whole samples entering or leaving the net count. The zone means then shift because the membership of the averaged set changed. In other words, cutoff interactions amplify small continuous differences into discrete booking differences.

This is why a single-run evaluation is never a professional product. The honest deliverable is the base case plus a sensitivity: rerun the booking with the plausible alternative models and parameters, and report the range. On the typewell the range is 19.0 to 20.0 m of net for SAND_A across the three saturation models. If a development decision would change somewhere inside that range, the evaluation, not the decision maker, must say so.

## Worked example

Confirm the NTG arithmetic for the Archie run, step by step:

1. Gross interval: the zone summary counts 20.5 m of gross section in SAND_A.
2. Net: 19.0 m of samples pass all three cutoffs.
3. NTG: $19.0 / 20.5 = 0.927$.

And for the shaly-sand runs: $20.0 / 20.5 = 0.976$. The difference in NTG, about 0.049, is exactly one metre of section over 20.5 m. If you saw these two NTG values in two reports on the same sand, the first question to ask is not which is right but what differs between the runs. Here the answer is two edge samples and a saturation model.

## Exercise

Using the table above, compute the hydrocarbon-metres for each run as $net \times \phi_{avg} \times (1 - S_{w,avg})$. Self-check: Archie gives $19.0 \times 0.1752 \times 0.5618 = 1.870$ porosity-metres of hydrocarbon; Simandoux gives $20.0 \times 0.1762 \times 0.5665 = 1.996$; Indonesia gives $20.0 \times 0.1762 \times 0.5720 = 2.016$. State in one sentence which step of the calculation contributed most to the seven percent spread between Archie and Indonesia, and whether it was the continuous saturation difference or the discrete net difference.
