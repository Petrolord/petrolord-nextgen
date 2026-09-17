# Optimistic by a step or two

{{panel:fc-rate-explorer}}

The engine makes an unusual admission about its own labels. Its held list says the rate category bands carry no source and may be optimistic by one or two steps against the bands commonly cited for carbon steel in production service. Take that sentence apart, because it is doing more work than it looks.

## What optimistic means here

Optimistic means the word errs towards reassurance. If the true edges sit lower than 0.100000000000, 0.500000000000 and 1.000000000000 mm/yr, then a rate that this module calls moderate would be called high elsewhere, and a rate it calls high would be called severe. The direction of the error is stated. The size of it is not, beyond one or two steps, and the phrase commonly cited names no document a reader could go and check.

That is the honest position, and it is the reason the sentence sits on the held list rather than in a help page as guidance. A direction without a magnitude and without a citation is a warning that a reader can carry into a conversation. It is not a correction, and nobody can apply it to a number on a screen.

## Why the bands were left where they are

There is a tempting alternative: tighten the edges so the words read more conservatively. Tightening them would replace one unsourced set of numbers with a different unsourced set, and it would do so under the appearance of a fix. The screen would then carry a number nobody could source, with a claim of correctness attached that the first set never had.

The same reasoning governs the H2S screening threshold, which sits at 0.003500000000 bar and is declared held in a field. It stayed where it was and prints in both units. Changing a live number without a source is the same mistake with the sign flipped.

## What this costs a reader

At the shipped defaults the rate is 0.754524 mm/yr and the label is high. A band set one step tighter would call that same rate something worse, and nothing in this repository says which band set is right. The word on that screen is a convention rather than a measurement, and `categoryHeld` says so in the output.

So the practical rule for reading a label here is short. Treat the word as a rough sort. Treat any decision that turns on the difference between two adjacent words as a decision the module cannot support, because that difference is exactly the width of the admitted uncertainty. And when you need the argument rather than the sorting, take the rate, the conditions and the held list to whoever owns the decision.

## Exercise

Take three rates from the shipped streams, record the word each gets, and then record what each would get if all three edges were one step tighter in the direction the engine warns about. Write down which of the three changed word, and say what evidence you would need before acting on the change.
