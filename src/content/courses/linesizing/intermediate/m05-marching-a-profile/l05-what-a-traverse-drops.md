# What a traverse drops

A single call on the OGBIA line carrying the isometric's 4.500000 velocity heads spends 25.793983 psi. The traverse of the same line spends 25.660631 psi. The gap of 0.133351 psi is exactly the fittings.

{{panel:fc-liquid-explorer}}

## The two calls side by side

| call | carries the fittings | spend psi |
| --- | --- | --- |
| a single call with a resistance sum of 4.500000 | yes | 25.793983 |
| the traverse | no | 25.660631 |

The gap is not an approximation and not a segmentation effect. The traverse has no resistance-sum argument at all, so there is nowhere to put a fitting list, and the fittings are absent by construction.

## An omission in the signature rather than in the arithmetic

This distinction matters for how much it can be trusted. An arithmetic error is a defect that might be fixed in a release. A missing argument is a property of the call that will still be there tomorrow, and it is visible before the call is made, by looking at what it accepts.

It also means the traverse is not wrong. It computed a correct answer to the question it can be asked, which is what this line spends in pipe friction and elevation over these segments. It cannot be asked about fittings, so it did not answer about fittings.

## Why the size of the gap is not the lesson

On this line the fittings are worth 0.133351 psi, which is small beside 25.660631 psi of pipe. That is a fact about this isometric rather than about traverses. The gap is exactly whatever the fitting list is worth, so a line with the same pipe and a heavier fitting count has the same structural omission and a larger consequence.

Nothing in the traverse output says any of this. There is no zero fittings field and no note. The absence is silent, and a reader who has not compared the two calls has no way to discover it from a station list.

## Reading the two calls together

The practical habit is to use each for what it returns. The traverse gives the profile and locates the worst station. The single call gives a total that can include the fittings. A design review that quotes the traverse arrival as the line's pressure drop is quoting a figure that omits every elbow, valve and exit on the isometric.

## How an omission like this one is noticed

The general method is the one this lesson used. Put the same case through two calls that ought to agree, and then account for the difference rather than accepting it. Here the difference was 0.133351 psi and it matched the fittings exactly, which identified the omission and ruled out every other explanation at the same time. A difference that had not matched a known term would have been the more interesting finding.

## The mistake

The mistake is comparing a traverse total against a single-call total and concluding that the march is more optimistic. The difference is the fittings and nothing else.

The second mistake is adding the fittings on afterwards without saying so, which produces a correct total attached to a station list that does not support it.

## Exercise

Give both spends and the gap between them, and say what the gap is. Explain why the omission is structural rather than an error in the traverse arithmetic. Then state which of the two calls a review should quote for a total and which for a profile.
