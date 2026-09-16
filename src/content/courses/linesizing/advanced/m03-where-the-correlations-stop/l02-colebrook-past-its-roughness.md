# Colebrook past its roughness

Colebrook is a fitted curve, and a fit has a region it was fitted over. This one was published for relative roughness reaching about 0.05, and the engine will answer well past that without saying a word.

{{panel:fc-liquid-explorer}}

## Five answers at one Reynolds number

| relative roughness | f at Reynolds 1000000.0000 |
| --- | --- |
| 0.010000 | 0.0379647419 |
| 0.050000 | 0.0715737539 |
| 0.100000 | 0.1016731332 |
| 0.200000 | 0.1557055485 |
| 0.500000 | 0.3308894263 |

The engine answers all five and flags none of them.

The first two sit inside the published range. The last three do not, and the last one describes a pipe whose wall roughness is half its own bore, which is a geometry the word roughness stops covering. At that point the obstruction is the pipe.

## Nothing about the answer looks wrong

This is what makes extrapolation dangerous rather than merely inaccurate. 0.3308894263 arrives in the same field, in the same shape, with the same ten decimals as a friction factor from the middle of the fit. The curve is smooth and monotonic across the whole table, so the numbers give a reader no signal.

A correlation outside its range does not usually produce nonsense. It produces a plausible number, which is worse, because nonsense gets caught.

## The engine guards a different thing here

Roughness does have a guard, and it catches the case that has no physical meaning: a negative roughness returns "absolute roughness is a length and cannot be negative". A length cannot be negative, so the engine refuses.

A relative roughness of 0.500000 is a perfectly meaningful quantity. It is just outside the range anybody fitted. The engine guards meaning rather than validity, which is a real distinction and one a reader has to carry, because the presence of one guard invites the assumption that the other exists too.

## The mistake

The mistake is reading a returned number as a statement that the method applies. The engine answered the question it was asked. Whether the question was inside Colebrook's range is a judgement that lives with the caller, and nothing in the return carries it.

The second mistake is reaching for a high relative roughness to model something that is not roughness. Scale, wax and a partially blocked bore change the flow area and the geometry, and pushing a roughness value up to represent them puts a real effect into a term that was never fitted for it.

## Exercise

Give the friction factor at relative roughness 0.050000 and at 0.500000, and say which of the five rows sit outside the published range. Then explain why nothing in the returned values marks the extrapolation, and state the difference between the roughness case the engine guards and the one it does not.
