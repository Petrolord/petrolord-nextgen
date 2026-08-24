# Reading the peak

The scan on the planted case returns a suggested bulk shift of 8 ms and a correlation of 1 at that shift. Both are graded, the shift to a tolerance of 0.5 ms and the correlation to a tolerance of 0.01. This lesson takes the result apart: why the shift is positive rather than negative, what the sign instructs you to do with the synthetic, and what you have and have not learned when the scan hands you those two numbers.

## Where the sign comes from

The sign is not a convention chosen for taste. It falls directly out of how the engine pairs samples, so you can derive it rather than memorise it.

At lag $\ell$, the engine pairs synthetic sample $i$ with observed sample $i + \ell$. Read that pairing carefully. A positive $\ell$ pairs each synthetic sample with an observed sample further along the trace, which means later in two-way time.

Now put the construction beside it. The observed trace was made by copying the synthetic forward by four samples, so observed sample $i + 4$ holds exactly the value of synthetic sample $i$. The pairing that matches value to identical value is therefore the one with $\ell = +4$ samples. At 2 ms per sample that is $+8$ ms of TWT, and the scan returns 8 ms.

Try the opposite sign to see it fail. At $\ell = -4$, the engine pairs synthetic sample $i$ with observed sample $i - 4$, which holds the value of synthetic sample $i - 8$. That compares the synthetic against a copy of itself offset by eight samples, which is 16 ms of TWT apart. Those two are not identical, so the correlation there is not 1 and $-8$ ms does not win the scan. The negative side of the curve is not a mirror of the positive side around zero, and the peak sits on the positive side because that is the side the observed trace was moved to.

## What the sign tells you to do

Translate the number into an instruction, because that is where sign errors do their damage.

A shift of $+8$ ms means the event the synthetic places at TWT $t$ is found in the observed data at TWT $t + 8$. The synthetic is early. To place it correctly you add 8 ms to the two-way time of every one of its samples, which moves the whole trace later, meaning downward on a conventional section where TWT increases downward.

The mnemonic that survives is this. A positive shift moves the synthetic to larger TWT. A negative shift moves it to smaller TWT. Say it as "the synthetic moves later by 8 ms" rather than as "shift by 8", because the second phrasing is the one that gets applied in the wrong direction six months later by somebody reading your notes.

Getting the direction wrong is expensive and quiet. Applying $-8$ ms here would move the synthetic 8 ms further from the observed data, leaving a 16 ms error where there was an 8 ms one, and nothing in the display would announce it. The trace would still look like a plausible synthetic sitting on plausible seismic. That is why the sign is worth deriving from the pairing rule once, so that you can rederive it whenever you are unsure rather than guessing.

## What the correlation of 1 adds

The second number is the quality attached to the first. The scan reports a correlation of 1 at the winning lag, and 1 is the maximum the measure can reach, so this is a perfect match over the counted overlap.

That is the strongest possible result and it is also the least representative one, which is the subject of the next lesson. For now, hold two ideas at once. The number is correct, and the engine is right to report it. And the number is a property of an exercise in which the observed trace is a copy of the synthetic, so nothing about it should be carried forward as an expectation.

## What the pair of numbers does not tell you

Two limits are worth stating while the result is fresh.

The pair says nothing about the shape of the rest of the curve. A peak of 1 could stand alone above a flat floor, or sit at the top of a broad rise whose neighbours are nearly as good. Those are different situations with different confidence attached, and both would report the same two numbers. The scored series holds that information, and module 3 is where you learn to read it, including the fact that zero lag in this very scan still scores 0.621742.

The pair also says nothing about whether a bulk shift was the right correction at all. The scan answers the question it was asked, which is which single constant shift agrees best. If the true misfit grows with time, as a stretch does, the scan still returns one lag and one correlation and gives no warning. That limitation belongs to the model rather than to the code, and you supply the judgement.

The panel below runs the scan on the planted case and reports both graded numbers together with the curve they came from.

{{panel:sl-shift-explorer}}

## Exercise

Suppose an engine paired synthetic sample $i$ with observed sample $i - \ell$ instead, and everything else about the scan stayed the same. What lag would it report on this exercise, and what instruction would that lag carry? Then, back in the real engine, state what you would do to the synthetic's TWT axis on being handed a shift of $-6$ ms, and say how you would sanity check that you had moved it the right way.

Self-check: with the pairing reversed the engine would report $-8$ ms rather than $+8$ ms, and that number would carry the same physical instruction, which is to move the synthetic 8 ms later in TWT, because the pairing rule and not the digit is what defines the meaning. This is the reason a shift should always be recorded together with the convention that produced it. A shift of $-6$ ms in the real engine means subtracting 6 ms from every synthetic TWT, moving the trace earlier, meaning upward on the section. The sanity check is to run the scan again on the shifted synthetic: if you moved it the right way the new best lag is close to zero, and if you moved it the wrong way the new best lag is close to $-12$ ms, which is twice the original error.
