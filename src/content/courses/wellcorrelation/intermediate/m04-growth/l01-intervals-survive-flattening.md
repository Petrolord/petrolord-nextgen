# Intervals survive flattening

This module is the centre of the tier, and it rests on one small result that the previous module already stated. An interval is a difference of two picks in the same well, both ends move by the same shift, so the difference is unchanged. That invariance is why flattening is safe to do, and it is also why flattening reveals growth. Both halves of that sentence matter, so this lesson takes them one at a time.

## What an interval is

An interval is the measured distance between two picks in one well. Two conditions are doing work in that definition.

**Two picks.** An interval always has a top and a base, both named. "The A-to-SAND interval in Ekene-2" is 1565 minus 1512, which is 53 m. A single pick has no interval, and an interval quoted without both of its surfaces cannot be checked by anyone.

**In one well.** Both picks come from the same wellbore. A number built from Ekene-2's TOP_SAND and Ekene-1's TOP_A is not an interval of anything. It is the difference of two depths in two different holes, and it has no thickness meaning at all. This sounds too obvious to state until you are reading across a four-column panel with a ruler.

An interval is a stratigraphic quantity. It says how much section accumulated between one surface and another at that location. It is a fact about the rocks in that well.

## The invariance, in one line

Let a well have picks at measured depths $a$ and $b$, and let its flattening shift be $s$. The two picks display at $a + s$ and $b + s$. The displayed interval is

$$(b + s) - (a + s) = b - a$$

The shift appears once with a plus and once with a minus and removes itself. The result does not depend on the value of $s$, on which top you flattened, on the datum depth, or on anything else about the view. Any interval, any well, any datum, the same conclusion.

## Worked across the section

The A-to-SAND interval, computed both ways, on this tier's datum of TOP_A at 1450 m.

| well | shift | TOP_A measured | TOP_SAND measured | measured interval | TOP_A displayed | TOP_SAND displayed | displayed interval |
|---|---|---|---|---|---|---|---|
| Ekene-1 | -50 | 1500 | 1548 | 48 | 1450 | 1498 | 48 |
| Ekene-2 | -62 | 1512 | 1565 | 53 | 1450 | 1503 | 53 |
| Ekene-3 | -45 | 1495 | 1541 | 46 | 1450 | 1496 | 46 |
| Ekene-4 | -80 | 1530 | 1590 | 60 | 1450 | 1510 | 60 |

The last two columns agree row by row, as the algebra promised. Note that the shifts are all different and all large, between 45 and 80 m, and none of that reached the interval column.

## Why that makes flattening safe

An operation that redraws a section is only trustworthy if you can say exactly what it can and cannot alter. Flattening can alter displayed depths and nothing else. In particular it cannot alter a thickness, so it cannot manufacture a thick sand, thin a reservoir, or move a fluid contact relative to a top. Whatever you measure between two surfaces in one well is the same number before and after.

Compare that with operations that genuinely do distort. Stretching a log to tie it to another well changes intervals by design. Depth conversion changes them, because the velocity that converts the top differs from the velocity that converts the base. Flattening sits in a different class: it is a rigid translation of each column, one number per well, and rigid translations preserve distances along the axis they act on.

## Why that reveals growth

Here is the turn the tier is built on. Because the interval survives, and because flattening pins every well's TOP_A onto one line, the displayed depth of TOP_SAND becomes a direct picture of the A-to-SAND interval. Put the two formulas together:

$$displayed(TOP\_SAND) = 1450 + (md(TOP\_SAND) - md(TOP\_A)) = 1450 + interval$$

So on the flattened panel, the vertical distance from the datum line down to each sand pick is that well's interval, drawn to scale, side by side, with the structure taken out of the way. In the structural view those same intervals were buried under 35 m of relief on TOP_A and you had to compute each one to compare them. In the flattened view your eye does the comparison, because a well with more section between the two surfaces draws its sand pick further below the line.

That is the whole method. Flattening does not measure anything the structural section could not have measured. It arranges the section so that a difference in intervals becomes a difference in position, which is the thing human eyes are good at. The rest of this module gives that difference a name, a number, and a meaning.

## Exercise

Take Ekene-1 and Ekene-4, whose shifts are -50 and -80. Compute the TOP_SAND to BASE_SAND interval in each well from the measured picks, then compute it again from the displayed depths, and say what the two results together tell you about the sand across those two wells.

Self-check: measured, Ekene-1 gives 1580 minus 1548, which is 32 m, and Ekene-4 gives 1615 minus 1590, which is 25 m. Displayed, Ekene-1's picks are at 1530 and 1498, giving 32 m again, and Ekene-4's are at 1535 and 1510, giving 25 m again. The interval calculation is unaffected by a 30 m difference in the two shifts. Between those two wells the sand is 7 m thinner in Ekene-4, and that statement is equally true in either view, because it was never a statement about the display.
