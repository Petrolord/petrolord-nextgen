# Float32 and the digits you see

The previous lesson left a loose end on purpose. You computed 4900 x 0.3048 = 1493.52 and the panel reported 1493.52001953125 m converted. This lesson closes it, and the first thing to settle is which of the two answers is wrong.

Neither is wrong. Say it in full, because the wrong lesson is easy to draw here. The hand answers 1493.52 m and 1584.96 m converted are correct answers, they agree with the graded values through the fourth decimal place, they sit far inside the 0.01 m tolerance, and they pass. The graded values 1493.52001953125 m and 1584.9599609375 m converted are also correct, and they are what the pipeline reports because of how a log is stored. Both answers describe the same place in the ground to a precision no logging tool can resolve.

What is worth your attention is not which number to prefer. It is why the second one has that shape at all, because you will meet the shape again in every array of samples the platform handles.

## What float32 storage is

A log curve is stored as an array of 32-bit floating point numbers, float32 for short. Each sample gets 32 bits: one for the sign, eight for an exponent, and twenty-three for the fraction, with one further leading bit implied. That gives twenty-four significant binary digits, which works out to roughly seven significant decimal digits.

The consequence that matters is structural. Every value a float32 can hold is an integer multiplied by a power of two. That is the entire set. Any real number you try to store lands on the nearest member of that set, and the storage rounds to whichever neighbour is closer.

Small integers are in the set exactly, which is why the native depths give you no trouble. The number 4900 is an integer well inside the exactly representable range, so the depth column of feet_20.las holds 4900 ft with no error at all, and the same for 5200 ft and every 2 ft step between them. Nothing has gone wrong yet.

## Where the digits come from

The digits appear at the multiplication.

The pipeline takes each native sample, multiplies it by the factor in double precision, then casts the product back to float32 for storage. The double precision product for the first sample sits within a whisper of 1493.52. Casting it to float32 snaps it onto the float32 grid, and 1493.52 is not on that grid, because the decimal fraction 0.52 has no terminating binary expansion, in the same way that one third has no terminating decimal expansion.

So the value stored is the nearest float32 neighbour to 1493.52, and that neighbour is 1493.52001953125. For the last sample the nearest neighbour lies on the other side, which is why 1584.96 is stored as 1584.9599609375. One rounds up and one rounds down, which is what rounding to nearest looks like when you see two examples of it.

How far can that snap move a value? In the neighbourhood of 1500 m, neighbouring float32 values are about 0.000122 m apart, so a stored depth sits within half of that gap of the value you asked for. In units a driller would use, that is well under a tenth of a millimetre.

Two further points about the digits themselves.

They are exact, not approximate. 1493.52001953125 is the precise decimal value of a particular bit pattern, which is why it terminates rather than running on forever. Every float32 value has a terminating decimal expansion, and expansions ending in 5, 25, 125 or 9375 are the signature of a binary fraction written out in full.

They are reproducible. Run the import a thousand times and the trailing digits are identical every time, on every machine. This is not measurement noise and it is not a bug, and treating it as either will send you looking for a fault that does not exist.

## Why float32 is the right choice for a log

It is worth defending the storage decision rather than merely tolerating it, because you may be asked why the platform does not store everything in double precision.

Seven significant decimal digits is far more resolution than any logging measurement carries. A wireline depth is good to centimetres at best, once you account for cable stretch, tool sticking and the depth reference itself. Storage noise a few thousand times smaller than the measurement noise contributes nothing to the total error budget.

Against that, float32 halves the memory of every curve. A campaign of wells with dozens of curves each is a large amount of data to hold, cache, transfer and render, and halving it is a real operational gain.

So the trade is favourable, and the honest way to describe the situation is that the storage format is precise enough to be invisible in any petrophysical answer, while being visible in the last few printed digits of a converted number.

## The rule this leaves you with

Never compare converted depths for exact equality. Compare with a tolerance, always, and pick the tolerance from the physics rather than from the storage.

This is why the graded readings in this tier carry tolerances at all, and it is why the uniformity test in module 5 asks whether every increment is within a tolerance of the first rather than whether every increment is identical to it. A test for exact equality on a converted depth column would fail on a perfectly regular log, for reasons that have nothing to do with the log.

## Exercise

Explain, in three sentences, why 4900 ft is stored with no error while its converted value is not. Then answer two questions. Would the same shape of trailing digits appear if the file had been in metres to begin with, and why. And if a colleague reports that your converted start depth of 1493.52 m disagrees with the pipeline's, what do you tell them.

Self-check: 4900 is a small integer and every small integer is exactly representable in float32, whereas the product 4900 x 0.3048 is close to 1493.52, whose fractional part 0.52 has no terminating binary expansion, so storing it snaps the value to the nearest float32 neighbour, which is 1493.52001953125 m converted. A metric file would show no such digits on its depth column, because no conversion is applied when the factor is 1 and the native values are stored as they were parsed. And you tell your colleague there is no disagreement: the two values agree through the fourth decimal place, the tolerance is 0.01 m, both pass, and the trailing digits are the exact decimal expansion of the stored float32 rather than an error in either answer.
