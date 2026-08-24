# Zero lag is not innocent

This is the lesson the module exists for. Everything else here is scaffolding around one number, and the number is 0.621742.

That is the correlation the scan reports at a lag of 0 ms. A lag of 0 ms means you did nothing. You loaded the synthetic, you loaded the observed seismic, you compared them where they lay, and you moved neither. On a tie that is a full 8 ms out of alignment, doing nothing scores 0.621742.

## Why that number is dangerous

Look at 0.621742 the way an interpreter under time pressure would look at it.

It is not zero. It is not negative. It is comfortably on the positive side, which means the two traces agree about polarity: peaks tend to sit near peaks, troughs near troughs. It is above a half, so more of the shape matches than does not. If someone showed you a well tie and told you the correlation was 0.62, you would probably nod. Plenty of real ties, on real seismic, with real noise, do not do better than that.

And it is wrong. The synthetic in this exercise is a perfect copy of the observed trace, differing only by a shift of 8 ms. There is no noise, no wavelet mismatch, no geology the well missed. The only defect in the tie is the misalignment, and that single defect, on a flawless pair of traces, still leaves a number you would have accepted.

That is the trap. A plausible correlation is not evidence of alignment. It is evidence that the two traces have something in common, which they will have whether or not you have tied them properly.

## Where the false comfort comes from

The mechanism is worth understanding, because it generalises past this exercise.

Seismic traces are oscillatory. A synthetic built with a 25 Hz Ricker wavelet has a dominant period of 40 ms, so its peaks and troughs recur on that sort of spacing. Shift such a trace by 8 ms and you have moved it by a fifth of a period. Every peak is still mostly on top of a peak. The shapes have slid against each other, so they no longer match exactly and the correlation drops below 1, but they have not slid far enough to start cancelling.

That is why the flanks of the curve in lesson 1 are broad. Small misalignments cost the correlation very little, because the traces are made of long smooth humps rather than sharp spikes. Even 8 ms of error, which is four whole samples at this sample rate, only costs about 0.38 of correlation on a pair that would otherwise score 1.

Notice the consequence carefully. The oscillatory nature of seismic protects a bad tie from looking bad. The very smoothness that makes traces easy to look at is what makes misalignment hard to see.

## The habit this should build

There is one professional response to all of this, and it is a habit rather than a calculation.

**Scan. Do not eyeball.**

The eyeball test asks whether the synthetic looks like it lines up. On this pair it does, because at zero lag the two traces share 0.62 worth of shape and your eye is more forgiving than that. The eyeball test is answering a question about resemblance, and you needed an answer about position.

The scan asks a different question. It asks whether any other shift would do better. That is the question that matters, because a shift is not right or wrong on its own. It is right or wrong compared with the alternatives. On this pair the alternatives are decisive: 8 ms scores 1.000000 against 0.621742 for doing nothing, and the gap is large enough that no reasonable person would argue.

You could not have found that gap by looking. You find it by testing every lag in the window and comparing.

## Stating the rule properly

Two sentences, and they are not the same sentence.

A high correlation at your chosen shift tells you the traces resemble each other at that shift. A high correlation *relative to every other shift in the window* tells you that shift is the best available alignment.

Only the second is a tie. The first is a number that happens to be high, and 0.621742 at zero lag is exactly what it looks like when the first is satisfied and the second is not.

This also tells you what to record. Reporting the correlation on its own is reporting half of the evidence. Report the lag you applied, the correlation at that lag, and the fact that you searched a window. Someone reviewing your tie can then see that a comparison was made, not just that a number was produced.

## A note on what would happen in the field

You will not usually have a planted answer to check against. What you will have is the scan curve, and the shape of it does the work the planted answer does here. If the peak sits away from zero and stands clearly above the rest of the curve, the shift is doing something real. If the peak sits at zero, that is worth a second look rather than a sigh of relief, because a scan that reports no shift needed is either a genuinely aligned tie or a scan that failed to find anything.

Open the panel, and read the correlation at zero lag before you read anything else.

{{panel:sl-shift-explorer}}

## Exercise

Before touching the panel, write down what you would have concluded if the only number anyone gave you was a correlation of 0.621742, with no lag and no curve attached. Then open the panel, read the correlation at zero lag and at the best lag, and write one sentence explaining to a colleague why the first number does not mean the tie is acceptable.

As a self-check: given 0.621742 on its own, most people would conclude the tie is acceptable, because the value is positive, above a half, and comparable to correlations that real ties on noisy data produce. The panel shows 0.621742 at zero lag and 1.000000 at 8 ms. The sentence for a colleague is that 0.621742 measures how much the two traces resemble each other where they happen to be sitting, and the trace pair here is 8 ms out, so a respectable correlation is telling you the traces are similar in shape rather than telling you they are aligned. The only way to tell those apart is to compare every lag in the window and see whether a better one exists.
