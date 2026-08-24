# Why volumes matter

Four courses have each answered a different question about the same rock, and not one of them produced a number a company can act on. Petrophysics worked down a single vertical line and reported what that line holds. Correlation worked laterally and decided which surface in one well is the same surface in the next. Mapping took the picks that survived correlation and produced a continuous surface, a depth for TOP_SAND everywhere inside a defined area rather than only where a bit was turned.

Every one of those outputs is a description. This course produces a decision variable. Volumetrics integrates the mapped surface into a single quantity of oil, and that quantity is the one that gets written into a development plan, a reserves filing and a bank case.

## The number at the end of the chain

The quantity is stock tank oil initially in place, STOIIP: the volume of oil the reservoir held before anything was produced, expressed at surface conditions rather than at reservoir conditions. On the Ekene field, with the oil water contact at 1560 m, it is 12.139208 MMstb.

That is the destination. Six well picks, a 100 m grid, a thin-plate spline, an 800 m extrapolation limit and 201 live nodes all exist so that one number can be computed. Everything the mapping course taught you to be careful about now has somewhere to go.

## What rests on it

A volume is not an academic result. Four expensive decisions read it directly.

Whether the accumulation is developed at all. Below some threshold the facilities, the wells and the export route cost more than the oil is worth, and the field is left in the ground. That threshold is compared against a volume.

How large to build. Well count, platform size, pipeline diameter and processing capacity are all sized off an in-place volume and a recovery assumption. Building for a volume that is not there is expensive in a way that cannot be undone once steel is in the water.

What can be booked. Reserves are reported to owners, lenders and regulators, and a booked number carries an audit trail. Someone will eventually ask which surface, which contact and which cell size produced it.

Where to appraise. If moving one assumption changes the volume enough to change the decision, that assumption is worth spending a well on. If it does not, the well is a waste. You cannot rank appraisal targets without a volume that responds to them.

## Volumetrics is an integral, so it collects error rather than cancelling it

Here is the property that makes this course different from the ones before it.

Gross rock volume is the mapped surface summed over area. On Ekene the sum runs over grid nodes, each standing for one cell of 100 by 100 m, which is 10,000 square metres of ground. A node is not an opinion about one location. It is a block of rock that gets added to a running total.

That changes how map error behaves. When you read a single depth off a map, an error of a metre is an error of a metre. When you integrate the same map, a surface that sits a metre too shallow across the crestal area adds a metre of rock on every cell in that area, and the errors sum instead of averaging out. Mapping is where the assumptions are made. Volumetrics is where they are cashed.

## What this tier hands you, and what it hides

At Associate level the rock properties arrive as constants, in the way a laboratory hands out a report: net to gross 0.8, porosity 0.20, water saturation 0.35, formation volume factor 1.2 reservoir barrels per stock tank barrel, and the conversion 1 cubic metre is 6.2898 stock tank barrels.

The full chain at the Ekene contact of 1560 m runs like this.

$$\text{STOIIP} = \frac{GRV \times NTG \times \phi \times (1 - S_w)}{B_o} \times 6.2898$$

Step by step, in millions of cubic metres:

| Step | Operation | Result |
| --- | --- | --- |
| Gross rock volume | rock above the contact | 22.269036 |
| Net volume | GRV multiplied by NTG 0.8 | 17.815229 |
| Pore volume | net multiplied by porosity 0.20 | 3.563046 |
| Hydrocarbon pore volume | pore multiplied by (1 minus Sw 0.35) | 2.315980 |
| STOIIP | HCPV divided by Bo 1.2, converted at 6.2898 | 12.139208 MMstb |

Every step after the first is a plain multiplication by a constant, so STOIIP scales linearly with any one of them. Halve the porosity and you halve the oil. That makes the property side of the calculation predictable and, at this tier, uninteresting.

The geometry is the part that is not predictable, and it is the only part you actually build in this course. Gross rock volume comes from two mapped surfaces and a contact, and it responds to those inputs in ways that are not linear at all.

## The honest version of a volume

The mapping course ended on a warning that was easy to file away as a matter of taste. The mapped crest of TOP_SAND on Ekene is 1539.7181396484375 m, and it is shallower than the shallowest pick in the dataset, at a location where no well was drilled.

In this course that stops being a matter of taste. The thickest part of the Ekene accumulation is measured from that crest. Module 2 works out exactly how much of the maximum oil column rests on a value no measurement produced, and the answer is uncomfortable enough that it is worth carrying with you from the first lesson.

A volume quoted without its contact, its surfaces and its support is a number pretending to be a measurement. A volume quoted with them is a piece of engineering. The Professional tier assumes you can tell the difference.

## Exercise

Write down the four decisions that read a volume directly. Then answer two questions in one sentence each. First, if the porosity handed to you were revised from 0.20 to 0.10 and nothing else changed, what would happen to the STOIIP of 12.139208 MMstb? Second, why does an error in the mapped surface behave differently in a volume calculation than it does when you read a depth at a single location?

Self check: the four decisions are whether to develop at all, how large to build the facilities and well count, what can be booked as reserves, and where appraisal is worth paying for. Halving the porosity halves the STOIIP, because every step after gross rock volume at this tier is a multiplication by a constant, so the result scales linearly with each one. A surface error behaves differently in a volume because volume is an integral over area: a surface that is a metre too shallow across the crestal area adds a metre of rock on every cell in that area, and those contributions are summed rather than averaged, so the error arrives in the total magnified rather than smoothed away.
