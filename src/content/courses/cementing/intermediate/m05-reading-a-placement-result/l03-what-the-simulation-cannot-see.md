# What the simulation cannot see

Seven things, and two of them are the biggest levers a cementer has.

## One, mixing

Plug flow. Every interface is a face. Real interfaces are mixing zones tens of metres long, longer on the narrow side of an eccentric annulus, and a slurry contaminated with mud can fail to set entirely.

The spacer exists to manage exactly this and the model treats it as a block of density and rheology.

## Two, casing movement

Rotating or reciprocating the casing during the job is the most effective mud removal technique there is, more effective than centralization on many wells.

Nothing in this engine represents it. A job simulated here is a job with the casing sitting still.

## Three, temperature

Slurries thicken faster hot. The bottomhole circulating temperature is what a laboratory schedule is designed against, and it changes through the job as cold fluid is pumped down.

No temperature anywhere in this engine.

## Four, losses

If the formation takes fluid, the volume balance breaks: less comes back than went in, the annular column is shorter than computed, and the top of cement is high.

The engine's warning about a missed top of cement would fire, but the engine has no loss model and cannot predict it.

## Five, the transient free-fall rate

Detected and reported and deliberately not modelled. During free fall the actual rate is unknown to this engine, which means the friction, the circulating density and the annular velocity over that period are all unknown too.

So a job that free falls has a stretch in the middle where none of the numbers apply.

## Six, gas migration after placement

Cement in transition from a fluid to a solid loses hydrostatic before it gains strength, and gas can channel through it. It is the mechanism behind most sustained casing pressure, and it happens hours after the last number in this simulation.

## Seven, the float equipment

Treated as having no restriction. Real float equipment has a pressure drop, and a differential-fill or auto-fill float has a very different one from a conventional one.

## What is left

A rigorous answer to a narrower question: given these fluids in this geometry at this rate, with no mixing, no movement, no temperature and no losses, where is everything and what pressure do the pumps see.

That question is worth answering. It is not the whole job.

## Exercise

Of the seven, pick the two you would most want represented before recommending a rate.

For each, say whether adding it would make the reported peak circulating density higher or lower.
