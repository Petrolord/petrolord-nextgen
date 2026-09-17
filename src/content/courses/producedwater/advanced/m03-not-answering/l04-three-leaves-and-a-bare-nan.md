# Three leaves, and a bare NaN

Most of this module answers with an object. A handful of functions cannot, and what they do instead is a documented contract rather than an oversight.

## The census, measured rather than listed

The error contract was not asserted from the source. It was MEASURED, by calling every export twice, once with a question it can answer and once with a question it cannot, and recording both shapes.

Thirteen exports carry the object contract. Given something answerable they return an object of results, and given something they cannot use they return an object with a named `error`. That covers the property functions, the bin builder, the device application, both rise velocities, every device door and the train itself.

Three do not. They are LEAVES.

## The three leaves

`logNormalCdf`, `gradeEfficiency` and `medianOfBins` are helpers. Each answers with a bare number, so there is nowhere in the return to put an error key without changing what every caller receives.

So they say they have no answer with a bare NaN.

- `gradeEfficiency` at a cut size of zero returns a bare NaN.
- `medianOfBins` on an empty bin set returns a bare NaN.
- `logNormalCdf` at a negative diameter returns a bare NaN.

## Why NaN and not a number

A leaf has two honest options and one dishonest one. It can return the right answer, it can say it has none, or it can return something plausible. The third is dangerous, because a plausible number propagates silently through everything downstream and arrives at a reader looking exactly like a result.

NaN is not plausible. It poisons every arithmetic operation it touches, it compares false against everything including itself, and it cannot be mistaken for a measurement.

## The callers turn a NaN into a name

A bare NaN is honest and it is not informative, so it does not reach a user. The callers inside the module catch it and convert it into a named refusal.

`applyDevice` is the one to watch. Ask it to apply a device at a cut size of zero and the leaf underneath it produces a NaN. What comes back to the caller is an object with an error saying a device cannot be applied without a positive cut size and this one reports 0.

That is the pattern: the leaf reports an absence in the only way it can, and the layer above it, which does have somewhere to put a sentence, supplies the sentence. The absence is never lost and it is never silently converted into a number.

## Why this is an Expert concern

A reader who takes a leaf's output directly gets a NaN with no explanation, and one who goes through the device functions gets a sentence. A NaN arriving where you expected a refusal object usually means you reached past the layer that was going to explain it.

## Exercise

Write down which of the three leaves each of the four device doors would reach, and what each one would do with a NaN coming back.

Then say what would go wrong if a leaf answered zero when it had no answer, and trace that zero through one device and one train.
