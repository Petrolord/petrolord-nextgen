# What structure hides

Every display makes a choice about what to show clearly, and every such choice makes something else harder to see. The structural section shows depth honestly, and the price it pays is that thickness becomes almost unreadable. Knowing the price is what lets you decide when to pay it.

## The question the structural view answers

Where is each surface. That is the whole of it, and it answers it completely and without assumption. Ekene-3 is the structural high, Ekene-4 is the low, TOP_SAND falls 49 m between them, the panel spans 167 m from the shallowest pick to the deepest. Every one of those statements is a depth statement, and every one is read directly off the picks with no processing in between.

Depth statements are what most downstream work needs. Where to drill next, how deep the target will be, which well sits highest and therefore where hydrocarbons collect first: all of that comes from the structural view and from nothing else.

## The question it does not answer

How thick is the sand. Compute the SAND gross thickness in each well by subtracting TOP_SAND from BASE_SAND: 1580 minus 1548 is 32 m in Ekene-1, 1601 minus 1565 is 36 m in Ekene-2, 1570 minus 1541 is 29 m in Ekene-3, and 1615 minus 1590 is 25 m in Ekene-4.

Those four numbers are 32, 36, 29 and 25 m. The thickest well is Ekene-2 and the thinnest is Ekene-4, so the spread is 36 minus 25, which is 11 m.

Now compare that against the depth variation happening over the same four wells. TOP_SAND itself moves 49 m from Ekene-3 to Ekene-4. The structural signal is 49 m and the thickness signal is 11 m, so the thing you want to see is roughly a quarter of the size of the thing that dominates the display.

It is worse than the raw ratio suggests, because the panel is not scaled to 49 m. It is scaled to the full 167 m from the shallowest pick to the deepest. The whole thickness story across the field occupies 11 m out of 167, about seven percent of the panel height, while the depth range of TOP_SAND alone occupies 49 out of 167, about twenty-nine percent. Small differences drawn at that scale are a few pixels wide, comfortably inside the width of the line used to draw the surface.

## Why the eye cannot fix this

You might expect a careful reader to compensate, but the geometry works against you. Reading thickness off a structural panel means judging the vertical gap between two lines that are themselves sloping steeply and by different amounts. The eye is poor at comparing small gaps between non-parallel lines, and it is systematically biased: a gap measured perpendicular to a steeply dipping pair of lines looks smaller than the same gap measured vertically.

The Ekene thickness pattern also does not follow the structural pattern, so no amount of structural intuition will let you infer it. Structurally the wells rank Ekene-3, Ekene-1, Ekene-2, Ekene-4 from high to low. By SAND thickness they rank Ekene-2 at 36 m, Ekene-1 at 32 m, Ekene-3 at 29 m and Ekene-4 at 25 m, which is a different order entirely. The thickest well is the third-highest well. That is a real depositional observation, and it is invisible on the structural section.

The same holds for the interval above. TOP_A to TOP_SAND runs 48, 53, 46 and 60 m across Ekene-1 through Ekene-4, a spread of 60 minus 46, which is 14 m. Again a genuine trend, again small against a 167 m panel, again drawn as a sliver.

## The trade, stated explicitly

This is exactly the problem flattening solves, and the next module is entirely about it. Flattening removes the structural component from the display by shifting each well so that a chosen surface lies flat. Once the 49 m of TOP_SAND relief has been taken out, the panel no longer needs to accommodate it, the vertical scale can expand, and the 11 m of thickness variation stops being a sliver and becomes the dominant feature on screen.

State the trade in full, because both halves are real:

* You gain interval comparison. Thicknesses, thinning trends and truncations become directly readable, well against well, because the structural noise has been subtracted out.
* You lose true depth. Every depth on a flattened panel is a displayed depth, not a real one. You cannot read a drilling target off it, you cannot identify the structural crest from it, and quoting a number from a flattened section as though it were a true depth is one of the standard beginner errors.

Neither view is better. They answer different questions, and a competent correlation uses both: the structural section for where, the flattened section for how thick. The discipline is knowing at every moment which one is on screen, and refusing to take a depth from the wrong one.

## Exercise

Compute the SAND gross thickness for all four Ekene wells from the pick table and find the spread between thickest and thinnest. As a self-check, the thicknesses are 32, 36, 29 and 25 m for Ekene-1 through Ekene-4, and the spread is 11 m. Then rank the wells by SAND thickness and compare that ranking against the structural ranking from the previous lesson, and note in one sentence whether they agree. As a further check, the TOP_A to TOP_SAND interval spread is 14 m, from 46 m in Ekene-3 to 60 m in Ekene-4. Finally, write down in two sentences what you gain and what you give up when you flatten a section.
