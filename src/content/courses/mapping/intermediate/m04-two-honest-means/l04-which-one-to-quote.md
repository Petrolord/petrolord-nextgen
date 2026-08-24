# Which one to quote

Two honest averages of the same rock, 1.09 m apart. This lesson is a decision rule for which one belongs in which sentence, and what happens when the wrong one is used.

## The rule

> Use the **map mean** whenever the number will be multiplied by an area. Use the **well mean** whenever the number is a summary of what has been measured.

Almost everything follows from that.

## The cases

**Gross rock volume: map mean.** Volume is thickness integrated over area, and the map mean is the area integral divided by the area. Using the well mean here treats every well as if it controlled a sixth of the field, which no one believes and the map explicitly contradicts.

**A reserves summary table: both, labelled.** A row reading *average net thickness 32.25 m (map, 201 nodes at 100 m)* alongside *well average 31.17 m (6 wells, range 25 to 36 m)* is complete. Either alone invites the reader to assume the other.

**Comparing this field with an analogue: well mean.** Analogue comparisons are usually well-to-well, and an area-weighted mean carries this field's particular well pattern and mask into the comparison, which the analogue does not share.

**Deciding whether the interval is thickening in a direction: neither.** That is a question for the map itself rather than for a statistic of it. A single average destroys exactly the information being asked about.

**Early field life with two or three wells: well mean, with the count.** A map from three points has an area weighting dominated by the hull geometry of three points, which is close to arbitrary. The plain average of what has been drilled is more defensible and easier to defend.

## What the wrong choice costs here

Suppose the well mean of 31.167 m were used for a gross rock volume over the 201 live nodes.

$$V_{correct} = 32.25429 \times 201 \times 10{,}000 = 64{,}831{,}124\ \mathrm{m^3}$$

$$V_{wrong} = 31.16667 \times 201 \times 10{,}000 = 62{,}645{,}000\ \mathrm{m^3}$$

The difference is 2,186,124 m³, which is 3.4 percent of the volume. On this small field that is about 2.2 million cubic metres of rock quietly not booked.

Three and a half percent is not a catastrophe, and that is exactly why the error survives. It is too small to look wrong and too large to ignore, and it is systematic, so it will bias every field mapped the same way in the same direction.

## The direction is not guaranteed

On Ekene the map mean is higher than the well mean, because the area weighting promoted a thick interior well. Reverse the geometry, put the thinnest well in the middle of the pattern, and the map mean would come out **below** the well mean by a similar mechanism.

So the rule is not that maps read high. The rule is that the two means weight differently and the direction depends on where the thick and thin wells sit relative to the control geometry. Assuming a direction from experience on one field is how the error becomes invisible on the next.

## The reporting habit

Every mapped average travels with four things: the number, the count it averages, the cell size, and the mask setting. On Ekene that is *32.25 m over 201 live nodes at a 100 m cell with an 800 m extrapolation limit*.

Every well average travels with two: the number and the sample. On Ekene, *31.17 m from six wells, range 25 to 36 m*.

Neither is long, both are checkable, and a reader given both can do their own arithmetic.

## Worked example

A volume is reported as 64.8 million cubic metres of gross rock. A reviewer recomputes it from the well average and gets 62.6 million, and asks which is right.

Both are arithmetically right and the first is the correct one to report. The reviewer has computed a volume in which each well's thickness applies to a sixth of the mapped area, which the isochore contradicts: Ekene-6's 34 m applies to about a third of the area and Ekene-4's 25 m to about a tenth.

The 3.4 percent difference is the value of the area weighting, and the sentence that closes the discussion is that the map already contains the information about which parts of the field are thick and the well average throws it away.

## Exercise

State the rule for choosing between the two means, compute the gross rock volume both ways on the Ekene isochore, and give the percentage difference.

As a self-check: use the map mean whenever the number is to be multiplied by an area and the well mean whenever it is a summary of what has been measured. The map mean gives $32.25429 \times 201 \times 10{,}000 = 64{,}831{,}124$ m³ and the well mean gives $31.16667 \times 201 \times 10{,}000 = 62{,}645{,}000$ m³, a difference of 2,186,124 m³ or 3.4 percent, with the well-mean version understating the volume because the area weighting the map applies promotes the thicker interior of the field.
