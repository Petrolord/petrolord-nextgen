# When routes disagree

The typewell's triangle closes, but most of your career will be spent on wells where it does not. This lesson is the diagnostic playbook for an open triangle: how to read the pattern of disagreement, which failure modes to suspect first, and what to report when no reconciliation is possible.

## Read the pattern, not the values

When one route stands apart from the other two, the pattern itself carries information, because each route fails in its own characteristic ways. Work through the three cases.

**The lab sample reads high while SP and Pickett agree low.** The first suspect is the sample itself. Water sampled during drilling or testing is easily cut with mud filtrate, and filtrate from a fresh mud is more resistive than saline formation water, so contamination pulls the laboratory value up. The second suspect is temperature bookkeeping: if the reported measurement temperature is wrong, the Arps correction starts from the wrong anchor. A sample recorded at 75 degF but actually measured warmer would be over-corrected. Both errors leave the SP and Pickett routes untouched, which is exactly the observed pattern.

**The SP route stands apart while lab and Pickett agree.** Now the suspects live in the SP chain. SSP may be misread: the bed may be too thin for the deflection to develop fully, hydrocarbons in the sand suppress the deflection, and a drifting shale baseline shifts the reference the deflection is read against. Each of these biases SSP toward smaller magnitude, which biases $R_{we}$ toward $R_{mfe}$ and usually away from the true Rw. Alternatively the mud filtrate resistivity itself may be wrong; $R_{mfe}$ enters the quicklook multiplicatively, so an error in it passes straight through to the answer.

**The Pickett route stands apart while lab and SP agree.** Suspect the water leg. If the fitted interval is not truly at $S_w = 1$, residual hydrocarbon lifts the resistivities and the intercept overstates $aR_w$. If the leg is shaly, clay conduction bends the trend and both the slope and the intercept are corrupted. If invasion is deep, the resistivity log never reads the undisturbed zone at all. And even with a perfect leg, the intercept is the product $aR_w$ with an assumed $m$ from the slope: force the wrong $m$ and the intercept compensates in the wrong direction.

## Two against one is a heuristic, not a vote

The natural instinct is to trust the pair and discard the outlier. That is a reasonable place to start and a dangerous place to stop. The pair must each survive a review of their own failure modes before their agreement counts. Two routes can agree for unrelated bad reasons: a suppressed SSP and a hydrocarbon-tainted water leg both push their estimates in the same direction, and an analyst who takes the two-vote majority would adopt a wrong Rw with false confidence.

So the discipline is: identify the outlier, list the failure modes that could displace it, then do the same for the two that agree. Only when the pair's failure modes are checked and found unlikely, and a plausible failure mode is found for the outlier, does the majority win. The playbook is a structured search for the explanation, never a ballot.

## When nothing reconciles

Sometimes the review finds plausible faults everywhere, or none anywhere, and the triangle simply will not close. The professional answer is not a silent pick. It is a documented range: state each route's value, the review of each route's reliability, and carry the range into the evaluation as an explicit sensitivity, booking the reservoir at both ends. The next module shows exactly what such a sensitivity looks like on the typewell, where the raw and corrected sample values bracket a 1.5 m difference in SAND_A net pay. A reader of your report should be able to see what the disagreement costs, in metres of pay and in saturation, and what new data would settle it: a cleaner water sample, a repeat SP in a thicker sand, or a better-established water leg in a later well.

## Worked example

A well delivers: lab (Arps-corrected) 0.081 $\Omega\cdot m$, SP quicklook 0.052 $\Omega\cdot m$, Pickett $aR_w$ 0.050 $\Omega\cdot m$. Apply the playbook step by step:

1. Pattern: the lab route stands apart, high, by a factor of roughly 1.6 against the agreeing pair.
2. Outlier review: a high lab value fits filtrate contamination from a fresher mud, or an understated measurement temperature. Both are common.
3. Pair review: SP and Pickett share no failure mode, and their agreement within 4 percent is independent corroboration.
4. Conclusion: adopt approximately 0.05, note the suspected contamination, and request a repeat sample from production.

The saturation consequence of having instead trusted the lab value would have been a factor $\sqrt{0.081/0.050} = 1.27$ on every Archie Sw, more than enough to move pay, as the next module quantifies.

## Exercise

A triangle reads: lab 0.048, SP 0.036, Pickett 0.049 (all $\Omega\cdot m$). Name the outlier, list two failure modes that could displace it in the observed direction, and state the check you would run on each of the agreeing routes before adopting their value. As a self-check: the SP route is the outlier, low magnitude SSP errors do not fit (suppression biases $R_{we}$ toward $R_{mfe}$, so the direction depends on whether the mud is fresher or more saline than the formation water), and a wrong $R_{mfe}$ passes straight through; the lab route should be checked for sample provenance and temperature records, and the Pickett route for leg quality, before 0.048 to 0.049 is adopted.
