# Why the response is not linear

The previous lesson showed the leverage. This one explains it, because a mechanism you understand is a mechanism you can carry to a field that is not Ekene.

The short version is that a deeper contact adds area and column at the same time, and two growing factors multiply.

## The two factors

Gross rock volume is the sum of the oil column over every cell that holds oil, each column multiplied by the cell area of 10,000 square metres. Written as a product of averages,

$$GRV \approx N \times \bar{t} \times A$$

where $N$ is the number of oil cells, $\bar{t}$ is the mean oil column and $A$ is the cell area. The cell area is fixed by the grid. The other two both respond to the contact, and they respond in the same direction.

| OWC (m) | Oil cells | Max column (m) | GRV (million m3) |
| --- | --- | --- | --- |
| 1550 | 128 | 10.2818603515625 | 7.036696 |
| 1560 | 169 | 20.2818603515625 | 22.269036 |
| 1570 | 190 | 30.2818603515625 | 40.439926 |

If only the count grew and the columns stayed put, GRV would grow like the count. If only the columns grew and the count stayed put, GRV would grow like the column. Both grow, so GRV grows like the product, and a product of two rising terms rises faster than either.

## Where the extra cells come from

Picture the contact as a horizontal plane cutting the mapped TOP_SAND surface. The oil area is the ground inside the line where the plane meets the surface. Push the plane down and the line moves outward and downhill, taking in the ground in the depth slice you just added.

That is why the count goes 128, then 169, then 190. Each ten metres of contact takes in another band of the flanks.

Notice that the steps get smaller. There is a hard reason for that on this map: the surface has only 201 live nodes in total. The area term cannot pass 201 no matter how deep the contact goes, so it must run out of room. By 1570 m, 190 of the 201 available nodes already hold oil and there is very little ground left to gain. On a real field the same ceiling exists, set by the spill point or by the limit of mapped ground rather than by the mask, but it is always there.

## The column term keeps going

The thickness term has no such ceiling in this range.

At the capstone contact the maximum oil column is the contact minus the mapped crest, $1560 - 1539.7181396484375 = 20.2818603515625$ m. The crest does not move when the contact moves, so every ten metres of contact adds exactly ten metres to the maximum column. That is the 10.2818603515625, 20.2818603515625, 30.2818603515625 sequence in the table, and it is arithmetic rather than geology.

The increment reaches every cell, not just the crestal one. At the capstone contact the column at each of the 169 oil cells is the contact minus the top at that cell, because at all 169 the BASE_SAND surface is deeper than the contact. The accumulation is limited by the contact everywhere, so a metre of extra contact is a metre of extra column on every cell that already held oil, on top of whatever new cells joined. That stays true until the contact reaches the shallowest point on BASE_SAND at 1570 m, below which the base starts to cap columns and the column term begins to flatten too.

## What the two terms do together

Now the shape of the response makes sense. Between 1550 and 1560 m both terms are growing hard, the count by a large step and the column by roughly a doubling, and the volume roughly triples. Between 1560 and 1570 m the column still gains its full ten metres but the count is close to its ceiling, so the growth eases off and the volume only roughly doubles.

Two practical consequences follow.

You cannot interpolate a volume between contact cases. If you know the answer at 1550 m and at 1570 m, the answer at 1560 m is not the average of them, and on this field the true mid case is below that average. Recompute at each contact rather than sketching a straight line between two.

A symmetric uncertainty on the contact is not a symmetric uncertainty on the volume. Ten metres either side of the capstone contact gives 3.835815 MMstb low and 22.044451 MMstb high around a mid case of 12.139208 MMstb. Quoting that as a plus or minus is misleading, because the low and high excursions are not the same size and the mid case does not sit in the middle of them. Quote the three cases.

Try it yourself: step the contact through the three cases in the panel below and watch the cell count and the maximum column move together.

{{panel:rc-volume-explorer}}

## Exercise

Using only the table in this lesson, explain in three sentences why moving the contact from 1560 m to 1570 m produces a smaller multiple on GRV than moving it from 1550 m to 1560 m did, even though both moves add exactly ten metres to the maximum column.

Self check: the ten metres of column is the same in both moves, so the difference has to be in the area term. Between 1550 and 1560 m the oil cell count rises from 128 to 169, a large gain, while between 1560 and 1570 m it only rises from 169 to 190 and is running against the ceiling of 201 live nodes on the map. With one factor growing strongly and the other growing weakly, the product grows less than it did when both were growing strongly, which is why GRV goes from 7.036696 to 22.269036 and then only to 40.439926 million m3.
