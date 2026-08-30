# Flow efficiency

The same information as skin, in the form a decision is made in.

## The definition

    FE = (p_avg - p_wf - dp_skin) / (p_avg - p_wf)

The denominator is the total pressure drop the well is being produced under. The numerator is the part of it that is doing work in the reservoir rather than being spent crossing the damaged zone.

So flow efficiency is a fraction between zero and one for a damaged well, and above one for a stimulated one. It is often quoted as a percentage, and it is the number that communicates.

## Which average pressure

The p_avg in the formula is meant to be the average pressure of the drainage volume. In a buildup analysis, what you have is p*, the pressure the semilog line extrapolates to at infinite shut-in time, and those are not the same thing.

For a well early in its life, in a reservoir large enough that no boundary has been felt, p* is a good approximation to the average pressure and using it is standard. For a well in a small compartment that has been produced for years, p* is substantially higher than the average pressure, and using it flatters the flow efficiency.

The engine's `flowEfficiency` takes whatever average pressure you hand it. Which one you hand it is your decision and it should be stated in the report.

## What the number means

A flow efficiency of 1 is an undamaged well. Of 0.5, a well spending half its drawdown crossing the skin. Of 1.4, a well that has been fractured or acidised successfully.

The well in this course is well below 1, and you will compute exactly how far below in the capstone. The interpretation is direct: if the damage were removed, this well would deliver its current rate at a substantially higher flowing pressure, or a substantially higher rate at its current flowing pressure.

That second form is what the production engineer wants, and getting from flow efficiency to a rate gain needs one more assumption: that the well's productivity is proportional to drawdown, which is true for single-phase liquid flow and not true once free gas appears near the wellbore.

## The damage ratio, and why it is worse

Some reports quote a damage ratio, which is one divided by the flow efficiency. It carries the same information. It has the unfortunate property of running to infinity as a well approaches zero flow efficiency, which makes it a poor thing to average, plot, or compare between wells.

Flow efficiency is bounded and behaves sensibly. Prefer it.

## What it hides

Flow efficiency is a ratio, and like every ratio it discards the scale. A well with a flow efficiency of 0.5 producing 50 stb/d and a well with a flow efficiency of 0.5 producing 5000 stb/d have the same number and completely different intervention economics.

So the honest pair is the flow efficiency and the skin pressure drop together: the fraction and the psi. One says how bad the well is, the other says how much it is worth.

## The misconception to avoid

"Flow efficiency is a measurement." It is a derived quantity three steps downstream of a window choice, and it uses an average pressure that a buildup does not directly measure. It is a good way to communicate a result and it is not a more reliable number than the skin it came from. Anything that was uncertain in the skin is at least as uncertain here.

## Exercise

A well reports a flow efficiency of 0.61 and a skin pressure drop of 64 psi at its test rate.

Write the two-sentence summary you would put at the top of a report for a production engineer who will not read the rest of it. Then add the one caveat that the summary should carry, drawn from the section on which average pressure was used.
