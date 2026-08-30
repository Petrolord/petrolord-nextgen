# Six numbers at a depth

What a mechanical earth model actually is.

{{panel:gm-stress-explorer}}

## The list

At any true vertical depth, six numbers describe the rock for drilling purposes:

- The **overburden**, the vertical stress from the weight of everything above.
- The **maximum horizontal stress**, SHmax.
- The **minimum horizontal stress**, Shmin.
- The **pore pressure** in the rock's connected pore space.
- A **sonic slowness**, from the log.
- An **unconfined compressive strength**, the load the rock carries with nothing holding it in.

## What the rest of the course does with them

Everything. There is no seventh input. The wall stresses come from the first four, the failure criteria from the sixth and a friction angle, and the mud window from all of it.

That is worth saying plainly at the start, because a geomechanics report can run to a hundred pages and it is easy to lose sight of how small the input list is.

## At 2500 m in this profile

| quantity | value |
|---|---|
| overburden | 56388237.49999999 Pa |
| SHmax | 48475574.40277777 Pa |
| Shmin | 44569324.402777776 Pa |
| pore pressure | 28880584.25 Pa |
| sonic | 200 us/m |
| strength | 132798979.91564198 Pa |

## Reading them

The overburden is the largest, which is what a normal faulting stress state means. The pore pressure is a little over half of it. The two horizontal stresses sit between, close to each other and much closer to each other than either is to the overburden.

The strength is larger than any of the stresses, which is normal: a rock at depth is strong under confinement, and it is the DIFFERENCE between the wall stresses that breaks it rather than their size.

## The units

Pascals throughout. Every pressure and every stress in this course is in pascals at the interface, and every depth is in metres.

The one place that changes is when a stress is quoted as an equivalent mud weight, which is the next lesson but two.

## What is not on the list

Temperature. Time. Chemistry. Anisotropy. Natural fractures. Bedding.

All six of those affect wellbore stability in the field, and none of them is in this model. The Expert tier names each one and says what it would take to add it.

## Exercise

Open the panel at 1000 m and write the six numbers down, then do the same at 2600 m.

Then say which of the six changes least between the two depths, as a fraction of itself.
