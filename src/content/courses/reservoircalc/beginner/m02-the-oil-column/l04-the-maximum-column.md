# The maximum column

Every oil bearing node on Ekene is contact limited, so the column at each of them is 1560 minus the top at that node. The tallest column in the field therefore sits wherever the top surface is shallowest, and its height is the contact minus the mapped crest. Nothing else can produce it.

$$1560 - 1539.7181396484375 = 20.2818603515625 \text{ m}$$

That is the maximum oil column at the capstone contact, and it is one of the six numbers the capstone grades, to a tolerance of 0.1 m.

## Where that crest came from

Read the subtraction again and look at what is standing in it. The contact is an interpretation, which the earlier lesson already made you uneasy about. The other term is 1539.7181396484375 m, the shallowest value on the mapped TOP_SAND surface, and it deserves the same scrutiny.

The mapping course took a whole lesson over it. That value is not a pick. The shallowest measurement anywhere in the Ekene dataset is Ekene-3 at 1541 m, and the mapped crest sits 1.2819 m above it. It is also not at a well: the crest node is about 300 m from Ekene-3, on ground where nothing was drilled and nothing was logged.

It is the thin-plate spline overshooting. The surface is rising north across the field toward Ekene-3, and a minimum curvature solution will not pay for the sharp kink that stopping exactly at the pick would require, so the rise carries a little past the last control before it turns over. Every smooth interpolator does this. It is not a bug and it was not a discovery, and the mapping course established that it is not fixed by tightening the extrapolation limit or by changing the cell size, because the crest node sits deep inside the supported part of the map.

## What that does here

In the mapping course the overshoot was a number you had to report carefully. Here it is load bearing.

The maximum oil column is 20.2818603515625 m, and 1.2819 m of that comes from a value no measurement produced. The thickest part of the Ekene accumulation, the place where the oil column is greatest, is measured from an artefact of the interpolator, at a location 300 m from the nearest well.

Take the overshoot away and the tallest column you could defend from measurement alone would be the contact minus the shallowest pick. The difference between those two is the same 1.2819 m, arriving one for one into the headline column. There is no averaging and no smoothing to soften it, because a maximum is a single value read from a single node, and that node is the one the spline was most free to invent.

This is the honesty spine of the course. The number that sounds the most physical, the thickness of oil at the top of the structure, is the number with the least measurement behind it.

## The other two numbers it touches

The maximum column does not travel alone.

The mean oil column over the accumulation is 13.176944 m, which is the gross rock volume divided by the 169 cells and their area. Notice how far the maximum sits above it. The distribution of column heights across the field is not centred on its own extreme, and a volume estimated by taking the tallest column and multiplying it by the area would be wrong by a wide margin. Anyone who quotes a maximum column as though it characterised the accumulation has picked the single least representative number available.

The crest also enters the gross rock volume, but differently. Volume is a sum over 169 cells, and the overshoot only raises the surface over the cells near the crest, so its effect there is diluted by everything further out on the flanks. This course does not put a figure on that dilution, and you should not guess at one. What you can say without any calculation is the direction: a surface that sits above its control across the crestal area adds rock that no well supports, so the gross rock volume is biased high rather than low.

## Reporting it

Three habits, and they are the same habits the mapping course asked for, applied to a volume.

Quote the maximum column against its crest. "Maximum oil column, being a contact at 1560 m against a mapped crest of 1539.72 m, which is 1.2819 m shallower than the shallowest pick of 1541 m at Ekene-3, some 300 m away." That sentence is not much longer than the bare number and it cannot be misread.

Say which of the two inputs you would defend and which you would test. The contact is interpreted and can be revised by the next well. The crest is interpolated and will not be revised by anything except a well drilled at the crest.

Never let a maximum column stand in for the accumulation. Give the area and the mean column alongside it, or give the gross rock volume, so that a reader who wants a sense of the size of the thing has something representative to hold.

That is what the Professional tier assumes you already do. Its property models and its uncertainty work all sit on geometry built exactly like this, and none of them repair a crest.

Read the maximum column in the panel below and check it against the contact you set.

{{panel:rc-volume-explorer}}

## Exercise

Compute the maximum oil column at a contact of 1550 m from the mapped crest, and say which well pick you would compare it against. Then write the one sentence you would put in a report to describe the maximum column at the 1560 m contact. Finally, answer in one sentence: if a well were drilled at the crest node and picked TOP_SAND at 1542 m, what would happen to the reported maximum column?

Self check: at a 1550 m contact the maximum column is 1550 minus 1539.7181396484375, and the pick to compare against is Ekene-3 at 1541 m, which is the shallowest measurement in the dataset. Your report sentence should carry the contact at 1560 m, the mapped crest of 1539.72 m, the 1.2819 m of overshoot above the shallowest pick, and the fact that the crest node is about 300 m from the nearest well. If a well at the crest node picked 1542 m, the surface would be forced through that value there, the crest would no longer be shallower than every pick, and the maximum column would fall, which is the general point: the overshoot exists because there is no control at the crest.
