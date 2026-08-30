# Reading the regime off a row

A two-step lookup you can do without a computer, and what it tells you.

{{panel:ct-rating-explorer}}

## The procedure

1. Compute the ratio of outside diameter to wall.
2. Read the three boundaries for the grade.
3. Place the ratio among them.

That is it. The regime follows, and with it the answer to the only question that matters at this stage: will a higher grade buy me any collapse resistance here.

## Worked, three times, all at L-80

L-80 boundaries: 13.38484007633007, 22.471346692258702, 31.016243791002484.

**9-5/8 inch 53.5 lb/ft, ratio 17.660550458715594.** Between the first and second, so PLASTIC. Collapse 45624175.296599805 Pa. The grade helps strongly here.

**13-3/8 inch 54.5 lb/ft, ratio 35.19736842105264.** Above the third, so ELASTIC. Collapse 7864280.783253678 Pa. The grade does not help at all.

**20 inch 133 lb/ft, ratio 31.49606299212598.** Just above the third, so ELASTIC by a small margin. Collapse 11051233.548654662 Pa.

## The third one is worth staring at

At L-80 the 20 inch 133 lb/ft pipe is elastic, just. At K-55 the third boundary is 37.20706040101535, which is above 31.49606299212598, so at K-55 the same pipe is in the TRANSITION regime instead.

And the K-55 collapse for that row is 10313129.625925248 Pa against the L-80 value of 11051233.548654662, so moving from K-55 to L-80 bought about seven percent of collapse. Moving from L-80 to P-110 buys none, because both are elastic and both give 11051233.548654662.

Seven percent, then nothing. The curve does not just flatten, it stops.

## What to carry away

The regime is the first thing to establish about any collapse-critical joint, before any number is quoted. Two engineers who agree on the collapse rating and disagree about the regime will give opposite advice about how to fix it.

## Exercise

Take the 9-5/8 inch 36 lb/ft pipe, ratio 27.343750000000004.

Find its regime at K-55, at L-80 and at P-110 from the boundary table. Then predict, before opening the panel, whether its collapse rating rises between L-80 and P-110, and check.
