# Choosing the flattening top

Four surfaces are picked on the Ekene section and any of them can be handed to the flattening arithmetic. Three of them would produce a clean panel. This tier uses TOP_A, and the reasons are specific enough to be worth stating one at a time, because the same reasoning is what you will apply to a section you have never seen.

## It is present in all four wells

TOP_A is picked in Ekene-1, Ekene-2, Ekene-3 and Ekene-4, at 1500, 1512, 1495 and 1530 m. Every well therefore has a flattening pick, every well gets a shift, and the whole section is flattened rather than part of it.

This is the first criterion and it is close to absolute. A flattening top that some wells lack produces a panel that is partly flattened and partly not, and a panel in that state is harder to read correctly than a structural one, because it looks like a single coherent view and is not.

TOP_SAND and BASE_SAND are also present in all four wells, so presence alone does not settle the choice. TOP_B is present in three, which rules it out.

## It is the shallowest correlatable marker

Of the four surfaces, TOP_A is the shallowest in every well. That matters because of where it puts the rest of the section on the panel.

Level TOP_A at 1450 m and everything else in the dataset draws below the datum line, reading downward from a common start. Each well's column hangs from the same point, so the depth of any pick below the line is that pick's distance from TOP_A in that well, which is exactly the quantity the tier is measuring. The four TOP_SAND picks display at 1498, 1503, 1496 and 1510 m, and the separation between those displayed depths is the separation between the intervals: 48, 53, 46 and 60 m.

Compare that against the Associate tier's view, which levelled TOP_SAND. There the TOP_A to TOP_SAND interval is still 48, 53, 46 and 60 m, because intervals do not care about the datum, but it reads upward from the datum line as four different heights above it, with the rest of the section below. Both panels contain the same information. One of them puts the interval this tier is about into a single downward reading from a single line, and that is the one worth using while the question is growth.

There is a second, quieter benefit. Because TOP_A is shallowest, no pick in the dataset displays above the datum line at all, so the displayed span of 150 m runs from the datum itself down to the deepest displayed pick. A panel whose top edge is the datum is easy to describe and hard to misread.

## Flattening on it isolates everything below

This is the real argument, and it is worth stating carefully.

Levelling TOP_A removes the structural relief of TOP_A, which is 35 m across these four wells, from the display. Whatever separation remains between the wells at any deeper surface cannot be that relief, because it has been subtracted out. What is left is the material that accumulated below TOP_A, well by well.

That makes the panel an argument about one thing: what happened underneath TOP_A. Every deeper surface is now positioned relative to a common reference, so a difference between wells at TOP_SAND is a difference in the TOP_A to TOP_SAND interval and nothing else. The 14 m growth range is that difference, measured.

Notice what the choice costs. The panel now contains no information about relief on TOP_A. The 35 m is real and it is readable, in the structural view, and it does not come back by staring at the flattened one. Every flattening spends one surface to clarify the others, and choosing which surface to spend is choosing what the panel cannot tell you.

## The reliability requirement

A flattening pick is the anchor for its whole column, and an error in it propagates at full size into every other surface in that well, in the same direction. Ekene-2's shift is -62 m because its TOP_A is picked at 1512 m. Had that pick been ten metres off, every displayed depth in Ekene-2 would be ten metres off with it, and the interval you read between that well's displayed TOP_A and displayed TOP_SAND would be wrong by the same ten metres.

The flattened panel cannot warn you. TOP_A draws as a perfectly flat line at 1450 m whether the picks feeding it are right or wrong, because that flatness is a construction guarantee rather than a measurement. The one surface a flattened panel cannot quality-control is the surface it was flattened on, which is why a flattening pick deserves a second look before anything is built on it.

## What changes if a well lacks the flattening top

Flatten this section on TOP_B and Ekene-4 has no pick to subtract from the datum. The engine does not guess a value, does not interpolate from the neighbours, and does not quietly drop the well. It gives that well no shift, draws it at measured depth, and flags it as lacking the flattening top.

That is the honest behaviour and it puts the decision back on you. A well hung at measured depth beside three flattened neighbours is not comparable to them, and the flag exists so that nobody reads it as though it were. Your options are to pick the missing top if the logs support it, to choose a flattening top that every well carries, or to keep the well on the panel and describe it as the exception it is.

On this section the third option is unnecessary, because TOP_A, TOP_SAND and BASE_SAND are each carried by all four wells. When a real section offers no such surface, the choice becomes a genuine trade between a top that is geologically better and a top that is more completely picked, and that trade is decided by which wells the argument needs to cover.

## Exercise

Rank the four Ekene surfaces as candidate flattening tops for this tier's question, and give one sentence of justification for each position. Then say what you would lose from the panel by flattening on BASE_SAND instead of TOP_A, and what the engine would do to Ekene-4 if you flattened on TOP_B.

Self-check: TOP_A ranks first because it is present in all four wells, is the shallowest of the four so the whole section reads downward from the datum, and its levelling isolates everything that accumulated below it. TOP_SAND and BASE_SAND are usable, since both are present in all four wells, but each spends a surface that sits inside or below the interval being measured, so the TOP_A to TOP_SAND growth no longer reads as one downward distance from the datum line. TOP_B is ruled out on presence, being carried by three wells. Flattening on BASE_SAND would remove the 45 m of relief on BASE_SAND from the display and give up the clean downward reading. Flattening on TOP_B would leave Ekene-4 with no shift, drawn at measured depth and flagged as lacking the flattening top.
