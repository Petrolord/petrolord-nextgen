# The fourth power

Two terms, one linear in the spacing and one quartic, and only one of them matters.

{{panel:cm-standoff-explorer}}

## The two dependencies

**The centralizer deflection** is the load over the spring rate, and the load is linear in the spacing.

    deflection at the centralizer proportional to L

**The sag** is quartic.

    sag proportional to L^4

## What that does over a realistic range

Take the horizontal well at 90 degrees, in the open hole, and double the spacing from 6 m to 12 m.

| spacing | deflection at the centralizer (m) | sag (m) |
|---|---|---|
| 6 | 0.0014647403584964293 | 0.0002941350047168305 |
| 9 | 0.002197110537744644 | 0.0014890584613789543 |
| 12 | 0.0029294807169928587 | 0.004706160075469288 |

The deflection doubled. The sag went up by a factor of sixteen.

At 6 m the sag is a fifth of the centralizer deflection. At 12 m it is 1.6 times it. The two cross somewhere around 9 m and after that the sag runs away.

## The standoff that results

| spacing | at the centralizer | mid span |
|---|---|---|
| 6 | 0.9231107423361454 | 0.9076705846082277 |
| 9 | 0.8846661135042182 | 0.8065003150066353 |
| 12 | 0.8462214846722909 | 0.599178961025609 |

The centralizer column falls gently and almost linearly. The mid-span column falls off a cliff.

## The design consequence

**Halving the spacing beats doubling the spring.**

Doubling the restoring force from 8900 to 17800 N halves the centralizer deflection, and does nothing at all to the sag. On the horizontal well at 12 m that takes the minimum standoff from 0.599178961025609 to 0.6760682186894637.

Going from 12 m to 9 m at the original spring takes it to 0.8065003150066353.

One of those buys 8 points and one buys 21, and the second is usually the cheaper of the two.

## Why the intuition runs the other way

Because a centralizer is a THING you can hold and specify and buy, and a span is an absence. The conversation about centralization naturally becomes a conversation about centralizers.

The arithmetic says it should be a conversation about how many.

## The general shape

Any design where one term goes as the first power and another as the fourth has a regime where the first term dominates and a regime where the second does, and the crossover is narrow.

Knowing which side of the crossover you are on decides which lever to pull, and on this casing at these clearances the crossover is at about 9 m.

## Exercise

Compute the ratio of the sag at 15 m to the sag at 12 m using only the fourth-power rule.

Then check it against the spacing sweep in the panel, which gives minimum standoffs of 0.2046456945935818 at 15 m and 0.599178961 at 12 m on the horizontal well.
