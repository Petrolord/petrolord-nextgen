# The state words

{{panel:qr-societal}}

The comparison function answers in words as well as numbers. Four state words appear in its results, three for a whole curve and one for a single corner, and each has a precise meaning. A report that paraphrases them loosely can say something the engine did not. This lesson sets out the four, shows each on a curve from this module, and explains why a state word on its own is never enough.

## The four words

| state word | meaning |
| --- | --- |
| BELOW | every checked corner strictly below the line or point |
| TOUCHES | no corner above, and at least one on the line within the snap |
| EXCEEDS | at least one corner strictly above |
| AT_LINE | the state of one corner on the line |

BELOW, TOUCHES and EXCEEDS describe the whole comparison. AT_LINE describes a single corner, and a curve with an AT_LINE corner and no exceeding one TOUCHES. A corner above the line carries EXCEEDS itself.

## Each word on a curve you have met

| curve and criterion | state | worst ratio |
| --- | --- | --- |
| JISIKE off-site against the Dutch line | EXCEEDS | 18.000000 |
| JISIKE off-site against the R2P2 point | BELOW | 0.001000 |
| JISIKE off-site against the analyst's slope-one line | BELOW | 0.014910 |
| the touching curve against the Dutch line | TOUCHES | 1.000000 |

## A state word is a summary

Two BELOW results can differ many times over. The JISIKE curve is BELOW the R2P2 point with a ratio of 0.001000, and BELOW the analyst's line with a worst ratio of 0.014910. Both are the same word. Only the ratio says how much margin there is, and only the criterion's name says what the margin is against. That is why this course never grades a state word on its own: a capstone asks for the ratio, the N, and the criterion, and the word follows from them.

## The boundary decides the middle word

A curve exactly on the line TOUCHES it. The engine counts a corner within 1e-9 relative of the line as on it, so a curve that lands a hair either side of the line through rounding still reads as touching. A value at a threshold belongs to the lower of the two states on either side of it, which is the owner's convention for the whole course.

## Reading a result in full

A comparison result carries more than its state. It lists every checked corner with its F, the criterion's value there, the ratio and the corner's own state; it gives the worst ratio and the N where it sits; and for a curve that exceeds, it gives the range of N over which each exceeding step lies above the line. A report built from a result should quote, in order, the criterion and its source, the state, the worst ratio with its N, and the exceeding ranges if there are any. Written that way, the state word is the last and least informative thing on the line, and a reader can check each figure against the one before it.

## Exercise

For each row of the second table, say how far the curve would have to move at its worst corner, as a factor, for its state to change to TOUCHES, and in which direction. Use only the worst ratios printed there.
