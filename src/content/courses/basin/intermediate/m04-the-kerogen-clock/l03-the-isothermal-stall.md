# The isothermal stall

Hold a Type II kerogen at 100 degC forever and it does not slowly finish the job. It stalls. This lesson quantifies the stall with the fixture's three values, opens the bins to show the mechanism, and names the consequence that matters in basins: patience is not a substitute for burial.

{{panel:bs-kinetics-explorer}}

## The three values

TR at 100 degC: 0.022481215976523083 after 10 Ma, 0.05477927380797565 after 50 Ma, 0.07419624543388115 after 100 Ma.

Read the multipliers. Five times the duration, 10 to 50 Ma, bought 2.44 times the conversion. The next doubling, 50 to 100 Ma, bought a factor of 1.35. If the reaction were a single first-order process far from completion, conversion would grow nearly linearly in time: five times the duration, five times the TR. The curve on the panel bends over instead, and by 100 Ma it is crawling. Extrapolate the trend and even a billion years at 100 degC leaves the bulk of the potential untouched.

## Inside the bins at 50 Ma

The engine's state at 50 Ma, bin by bin, tells the whole story. The 46 kcal bin has reacted 0.00999999984675959 of its 0.01: gone, to nine digits. The 48 bin has reacted 0.035128298223581114 of 0.05, seventy percent drained and slowing. The 50 bin has reacted 0.00863087004667172 of 0.11, under eight percent. The 52 bin: 0.0009335093188213295 of 0.17, half a percent. Above that, nothing meaningful: the 54 kcal bin, the spectrum's 0.22 peak, has lost 0.00008 of its content.

So the stall is structural, exactly as the ladder arithmetic predicts. Each bin is fifteen times slower than the one below at this temperature. The front drains the toe, then faces the 50 kcal wall where a factor of fifteen turns decades of megayears into nothing, and the spectrum's bulk sits two more walls behind that. Waiting longer moves the front's edge logarithmically at best.

## The ceiling, made precise

Lesson 1 put the occupancy at or below 50 kcal at 0.17, and called it the 100 degC ceiling. The 50 Ma state refines that: the practical ceiling on any human-relevant geological window is nearer the toe occupancy plus a slice of the 50 bin, which is why 100 Ma achieves only 0.074. TR at 100 degC will pass 0.10 eventually, and creep toward 0.17 on timescales that outrun most basins' lifetimes; it will never approach the 0.5 a hot history reaches easily.

For the working intuition, keep the pair of graded numbers: a 40 Ma wait at fixed temperature, 10 to 50 Ma, added just 0.0323 of TR. The next lesson shows a 20 degree warming doing five times that in a quarter of the time.

## Why basins care

A source rock parked at mid-oil-window temperature by a burial history that then stops is a common exploration situation: subsidence ceased, the basin cooled or held. The stall says its generation largely stops with it. Ongoing charge needs ongoing burial, or a heat-flow event, not the mere passage of time. Conversely, an old cratonic basin's great age is no evidence of exhausted sources if those sources never got hot: at 80 degC the fixture kerogen manages only TR 0.0013691978345186095 in 10 Ma, and the ladder makes even eons at 80 degC almost harmless.

Both directions of the error appear in real prospect reviews, and both are one bin-arithmetic away from being caught.

## Worked example

Estimate TR at 100 degC after 200 Ma, before checking the shape. The 46 bin is finished at 0.01. The 48 bin: survival $0.97604^{200} = e^{-4.8502} = 0.0078$, contributing 0.0496. The 50 bin: survival $0.99843^{200} = e^{-0.3268} = 0.7212$, contributing $0.11 \times 0.2788 = 0.03067$. The 52 bin contributes about 0.0037. Total near 0.094. Two hundred Ma, twice the tabulated century, and TR still has not reached 0.10: the stall in one line of arithmetic.

## Exercise

Compute the conversion multipliers between the three fixture values, and state which single bin dominates the 10-to-50 Ma gain. Then answer in one sentence: what would you tell an explorationist who argues that a Permian source at 95 degC "must be cooked by now, it has had 250 million years"?

As a self check: the multipliers are $0.05477927380797565 / 0.022481215976523083 = 2.4367$ and $0.07419624543388115 / 0.05477927380797565 = 1.3545$; the gain from 10 to 50 Ma is dominated by the 48 kcal bin, whose reacted weight grows from 0.0108 to 0.0351. The Permian argument fails because time at fixed temperature acts logarithmically on a kinetic ladder: at 95 degC the front sits even lower than in the fixture, and 250 Ma of patience achieves less conversion than a single kilometre of additional burial would.
