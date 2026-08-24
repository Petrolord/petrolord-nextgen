# Why that is backwards

The table in lesson 2 runs the wrong way for most people. Frequency rises, amplitude falls. This lesson explains why, and the explanation needs nothing you have not already met.

## The expectation, stated fairly

The intuition being violated is not stupid, so set it out properly before dismantling it.

High frequency data is better data. It resolves thinner beds, it separates events that low frequency data merges, and processors work hard to preserve the high end of the spectrum. A higher frequency wavelet is shorter and sharper, and a sharper pulse feels like it should produce a crisper, stronger event. Low frequency data looks smooth and blurred, and blurred looks weak.

Every clause in that paragraph about **resolution** is correct. The Associate tier established it: a shorter wavelet means two reflections need less separation before they stop overlapping, so higher frequency genuinely does let you distinguish more.

The error is the last step, where resolution is assumed to bring amplitude with it. It does not. Resolution and amplitude are different properties of the same trace, and on this well they move in opposite directions.

## The mechanism, in one sentence

A wavelet has length, so each reflection coefficient contributes to a span of samples rather than to one. Where those spans overlap, the contributions add. A longer wavelet makes wider spans, so more coefficients reach any given sample, so more of them can add together.

That is the whole of it. The rest of this lesson is the same sentence looked at from different angles.

## Reaching across neighbours

Think about what a single sample of the synthetic contains.

At 15 Hz the wavelet is long. Its span in time is wide enough that a sample somewhere in the middle of the logged interval collects contributions from reflection coefficients spread over a considerable stretch of the well above and below it. Many coefficients are in reach. Where a run of them shares a sign, their contributions pile up, and the sum can be several times larger than the largest coefficient in the run.

At 40 Hz the wavelet is short. The same sample now collects from a narrow neighbourhood only. Fewer coefficients are in reach, so fewer are available to add. The sum stays closer to the individual coefficients that produced it.

The reflectivity offered the same opportunities in both cases. The long wavelet took more of them.

You already know this effect by name. At the Associate tier you met **constructive interference**, where contributions of the same sign coincide and add to more than either alone. What the frequency does is set how easy that is to achieve. A long wavelet gives contributions a wide window in which to find each other, so constructive interference is common. A short wavelet gives them a narrow one, so it is rare and the events stay separate.

## Resolution and amplitude are the same fact seen twice

Now put the two together, because they are not two effects. They are one effect described from two sides.

A short wavelet keeps neighbouring reflections **separate**. That is what resolution means: you see the individual events rather than a blend. And because they are separate, they do not add, so each one is only as large as its own coefficient made it.

A long wavelet **blends** neighbouring reflections. That is what poor resolution means: you cannot tell the individual events apart. And because they are blended, they add, so the composite is larger than any of its parts.

Separation and summing are alternatives. You do not get to have both. A wavelet that keeps events apart has, by that same act, stopped them reinforcing.

So the 15 Hz synthetic is brighter than the 40 Hz synthetic **because** it is worse at resolving. The brightness is a symptom of the blurring rather than a compensation for it. Reading that brightness as strength has the causation exactly backwards.

## Checking the logic against the numbers

The three amplitudes support this reading rather than merely being consistent with it.

They fall monotonically as frequency rises: 0.1573149710893631 at 15 Hz, 0.07300488650798798 at 25 Hz, 0.0362229160964489 at 40 Hz. If the effect were about individual reflections getting stronger or weaker there would be no reason for a clean trend, since the coefficients never changed at all. A steady trend in one direction is what you expect from something that varies steadily with wavelet length, and wavelet length is the one thing that varied.

The direction is also the right way round. The longest wavelet gave the largest peak, the shortest gave the smallest, and the intermediate one landed in between.

## What this does not say

Two guards, so the lesson is not over applied.

It does not say low frequency data is better. It says low frequency data is brighter on this trace, and brightness bought by blurring is not an improvement. If you need to separate two close interfaces, you still want the high frequency.

And it does not say the effect always runs this way on every trace. The size of the effect depends on how the reflection coefficients happen to be arranged, and a well with widely spaced isolated contrasts would behave differently from this one, where the logged interval is densely layered. What generalises is the mechanism rather than the ratio.

Lesson 4 takes the mechanism and draws the conclusion the tier is built around.

## Exercise

Explain, in three sentences and without using the word convolution, why lowering the dominant frequency raised the peak amplitude on this well when the reflectivity never changed. Then answer this: a colleague reprocesses a survey to a higher bandwidth and reports that the amplitudes on a prospect have dropped, concluding that the reservoir is weaker than the old data suggested. State what is wrong with the conclusion in one sentence.

As a self-check: a wavelet has length, so each reflection coefficient spreads its contribution across a span of samples rather than landing on one; a longer wavelet spreads further, so contributions from more neighbouring coefficients reach the same sample, and where those share a sign they add to a larger total. Lowering the frequency lengthened the wavelet, which let more of the well's coefficients reinforce each other, and the peak rose even though not one coefficient changed. Your colleague's conclusion is wrong because raising the bandwidth shortens the wavelet, which reduces the constructive summing between neighbouring reflections and lowers amplitudes without anything about the reservoir having changed, so amplitudes from the two processings are not comparable until the wavelets are.
