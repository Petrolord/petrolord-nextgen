# Wait and weight

One circulation, and the schedule that makes it work.

{{panel:wc-killsheet-explorer}}

## The sequence

Build the kill mud. Then start the pump at the slow circulating rate while holding the casing pressure constant, and once at rate, follow the drill pipe schedule.

## Why there is a schedule

Because the string is being filled with kill mud as the circulation proceeds, and kill mud is heavier than the original.

Every stroke replaces some original mud in the string with kill mud, which raises the hydrostatic head inside the string. To keep the bottom hole pressure constant, the surface pressure has to fall by the same amount.

## Why it is a straight line

Because the displacement is at a constant rate and the string's capacity per stroke is what it is.

Strokes go in linearly, kill mud goes down linearly, the head inside the string grows linearly, so the surface pressure falls linearly. From the initial circulating pressure to the final one, over the strokes to the bit.

## The two endpoints

**Initial circulating pressure:** the slow circulating rate pressure plus the shut-in drill pipe pressure. Original mud in the string.

**Final circulating pressure:** the slow circulating rate pressure scaled by the ratio of the kill mud to the original. Kill mud in the string.

On the horizontal well's moderate scenario those are 6500000 Pa and 5024606.182497741 Pa.

## After the bit

The schedule is over. The drill pipe pressure is held at the final circulating pressure for the rest of the circulation, which is bottoms up.

Nothing about the string changes any more, so nothing about the drill pipe pressure needs to.

## The advantage

One circulation, and a lower peak casing pressure, because the heavier mud is already in the string reducing the surface pressure needed while the influx is still on its way up.

## The disadvantage

The wait, and the risk that accumulates during it: gas migration, a rising casing pressure, and a crew standing by.

## The step count

The engine produces a schedule with a chosen number of steps, ten by default. That is a presentation choice: the underlying relationship is a straight line and any number of points on it describes the same line.

A real kill sheet uses whatever spacing the choke operator can follow, often every hundred strokes.

## Exercise

From the two endpoints above and the horizontal well's strokes to the bit, compute the drill pipe pressure at 1000 strokes.

Check it against the panel's schedule, and say what a step count of 20 would change about the answer.
