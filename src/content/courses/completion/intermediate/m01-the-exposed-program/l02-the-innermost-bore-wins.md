# The innermost bore wins

The rule that resolves overlapping strings, and why it is the only rule that could be right.

{{panel:cd-clearance-explorer}}

## The rule

At any depth where more than one string is present, the exposed bore is the smallest inside diameter among them.

That is it. There is no weighting, no preference for the more recent string and no special case for liners.

## Why it has to be the smallest

Because the completion is a physical object going down a physical hole. If two pipes are concentric, the inner one is what the completion touches. The inner one is the smaller one, by definition of being inside.

Saying the innermost bore wins and saying the smallest bore wins are the same statement in this geometry, and the engine implements it as the smallest, which is the version that is still correct if the depths of the two strings were entered in an unexpected order.

## What it means for the liner overlap

Over the bottom six hundred metres of the published well the choice is between a nine and five eighths inch casing bore of about two hundred and seventeen millimetres and a seven inch liner bore of about one hundred and fifty seven. The liner wins.

A component run to two thousand five hundred metres has to fit one hundred and fifty seven millimetres, not two hundred and seventeen. Anything that reads the casing program and takes the production casing at that depth gets an answer that is sixty millimetres too generous, which in this well is the difference between every row passing and the packer failing by a wide margin.

## The liner top is the interesting depth

At twenty four hundred metres the exposed bore steps down by about a quarter. Everything above it is checked against one bore and everything below against another.

That single depth is where the whole clearance module lives. Two components in this string are physically similar and get completely different verdicts because one is above the liner top and one is below.

## What the rule does not do

It does not merge the two strings into one pipe with an average bore. It does not track annular space between them. It does not know which is cemented.

It answers exactly one question: at this depth, what is the bore the completion sees.

## Exercise

State the innermost bore rule in one sentence.

Then compute, for the published well, how much smaller the exposed bore is at twenty five hundred metres than at twenty three hundred, both in millimetres and as a fraction.

Finally, say what the rule would give if a tie back had been run inside the liner as well, and what the profile would then have.
