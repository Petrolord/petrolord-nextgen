# Structural relief

Relief is the simplest quantitative statement you can make about a surface on a structural section. It is one subtraction, and it turns a picture of a dipping horizon into a number you can write in a report, put on a map legend or compare against another surface.

## The definition

The structural relief of a surface across a section is its deepest occurrence minus its shallowest occurrence, taken over the wells that carry it.

Every clause in that sentence does work. Deepest minus shallowest, so relief is always zero or positive. Across a section, so the answer depends on which wells are on the panel and would change if you added a fifth well. Over the wells that carry it, so a well that never penetrated the surface is excluded rather than counted as some default value. That last clause is the one beginners drop, and dropping it is how a three-well number gets quoted as if it were a four-well number.

Relief measures vertical range only. It says nothing about how far apart the wells are, so it is not a dip and not a gradient. Two fields with identical relief can have wildly different structures if one spreads its wells over two kilometres and the other over twenty.

## The four Ekene surfaces

Work each one the same way. Find the shallowest pick, find the deepest pick, subtract.

TOP_A is present in all four wells at 1500, 1512, 1495 and 1530 m for Ekene-1 through Ekene-4. The shallowest is 1495 in Ekene-3 and the deepest is 1530 in Ekene-4. Relief is 1530 minus 1495, which is 35 m.

TOP_SAND is present in all four wells at 1548, 1565, 1541 and 1590 m. The shallowest is 1541 in Ekene-3 and the deepest is 1590 in Ekene-4. Relief is 1590 minus 1541, which is 49 m.

BASE_SAND is present in all four wells at 1580, 1601, 1570 and 1615 m. The shallowest is 1570 in Ekene-3 and the deepest is 1615 in Ekene-4. Relief is 1615 minus 1570, which is 45 m.

TOP_B is present in three wells only, at 1640 in Ekene-1, 1662 in Ekene-2 and 1628 in Ekene-3. Ekene-4 does not reach it. The shallowest is 1628 in Ekene-3 and the deepest is 1662 in Ekene-2. Relief is 1662 minus 1628, which is 34 m, over three wells.

## Quote the well count with the number

The TOP_B result is the teaching case of this module. Its relief of 34 m is a three-well figure, and it must be quoted as such every time it is written down.

The reason is not pedantry. Ekene-4 is the deepest well on every surface it reaches: deepest TOP_A, deepest TOP_SAND, deepest BASE_SAND. Had it reached TOP_B, it would almost certainly have supplied the deepest TOP_B pick too, and the relief would have been larger than 34 m. So the TOP_B number is not merely computed over fewer wells, it is systematically biased low by the absence of the very well that would have extended the range. A reader who sees 34 m next to 35, 49 and 45 with no annotation will read it as a genuinely flat surface. It may not be one. It is an under-sampled one.

The habit to build is to carry the sample size alongside the statistic. Write it as 34 m over three wells, or 34 m excluding Ekene-4, and the number becomes honest instead of misleading.

The TOP_SAND relief of 49 m is one of the six numbers the Associate capstone grades, so make sure you can reproduce it without notes: 1590 in Ekene-4 minus 1541 in Ekene-3.

## Different surfaces, different relief

Line the four results up: 35, 49, 45 and 34 m, reading from TOP_A down to TOP_B. If the whole section were a rigid slab that had been tilted, every surface would show the same relief, because tilting a rigid body moves every layer in it by the same amount. These four do not agree, and that disagreement is information.

Compare TOP_A at 35 m against TOP_SAND at 49 m. TOP_SAND has 14 m more relief than the surface above it, which means the interval between them is not constant. The TOP_A to TOP_SAND thickness confirms it directly: 48, 53, 46 and 60 m for Ekene-1 through Ekene-4, thickest in the well where TOP_SAND is deepest. The interval expands toward Ekene-4, and that expansion is exactly the extra relief.

An interval that thickens toward the structurally low side is the classic signature of deposition happening while the structure was growing. Sediment accumulates preferentially where there is more room to accumulate in, which is the sinking side. The structure did not simply appear after the rocks were laid down. It grew as they were laid down, and the changing relief from surface to surface is the record of that growth.

BASE_SAND at 45 m against TOP_SAND at 49 m tells a smaller version of the same story with the opposite sign, since 45 is less than 49 by 4 m and the sand interval itself is therefore slightly thinner where TOP_SAND is deepest.

Try it yourself: the panel below draws the Ekene section from the same engine, with the datum under your control.

{{panel:wc-section-explorer}}

## Exercise

Compute the relief of all four Ekene surfaces from the pick table without looking at the worked values, and for each one write down the well that supplied the shallowest pick, the well that supplied the deepest, and the number of wells used. As a self-check: TOP_A 35 m over four wells, TOP_SAND 49 m over four wells, BASE_SAND 45 m over four wells, TOP_B 34 m over three wells. Then answer in one sentence why the TOP_B figure is likely to understate the true relief of that surface across the field.
