# Top and base

Two thicknesses live in this fixture, and beginners routinely use one when they mean the other. They are made from the same two surfaces, they are quoted in the same units, and at some wells they are not even close to equal. Getting them apart is the first job of this module.

The first is the sand thickness, also called the isochore: base minus top. It is a property of the rock.

The second is the oil column: how much of that sand sits above the contact. It is a property of the rock and the contact together.

## The rock: base minus top

At any location where both surfaces are mapped, the vertical distance between them is the sand thickness.

$$\text{sand thickness} = \text{base} - \text{top}$$

Nothing about a fluid enters that expression. It is the same number in a dry hole as in the best producer in the field, and it does not change when a new well moves the contact.

At the wells you can read it straight off the picks. Ekene-1 tops at 1548 m and bases at 1580 m, so 32 m of sand. Across all six wells the thicknesses are 32, 36, 29, 25, 31 and 34 m.

Two terms are worth having straight. An isochore is a true vertical thickness, measured down a vertical line. An isopach is a stratigraphic thickness, measured perpendicular to bedding. On a steeply dipping bed the two differ, and on this fixture the wells are vertical and the structure is gentle, so vertical thickness is what the grids give you and what the volume calculation wants. Volumetrics on a grid always wants the vertical thickness, because it is stacking vertical prisms of ground.

## The oil: contact minus top

The oil column is a different measurement with a different reference.

$$\text{oil column} = \text{contact} - \text{top}$$

when the contact is inside the sand, which is the case at every oil bearing node on Ekene. Its reference is a plane you interpreted, not a surface you mapped. Change the contact by 10 m and every oil column in the field changes by 10 m, while not one sand thickness moves.

Put the two side by side at the 1560 m contact and the difference is plain.

| Well | TOP_SAND (m) | BASE_SAND (m) | Sand thickness (m) | Oil column at 1560 m (m) |
| --- | --- | --- | --- | --- |
| Ekene-1 | 1548 | 1580 | 32 | 12 |
| Ekene-2 | 1565 | 1601 | 36 | 0 |
| Ekene-3 | 1541 | 1570 | 29 | 19 |
| Ekene-4 | 1590 | 1615 | 25 | 0 |
| Ekene-5 | 1552 | 1583 | 31 | 8 |
| Ekene-6 | 1546 | 1580 | 34 | 14 |

Read the last two columns against each other and the two thicknesses agree nowhere. At every well the oil column is shorter than the sand, and by a different margin each time, so there is no factor you could apply to one to obtain the other. At Ekene-2 and Ekene-4 the oil column is zero while the sand is 36 m and 25 m thick, which is the case that makes the distinction impossible to fudge.

The ordering does not even survive. Ekene-2 has the thickest sand in the field and the least oil. Ekene-3 has close to the thinnest sand and the tallest column. A map of sand thickness would rank these wells in an order that has almost nothing to do with where the oil is.

## Why the confusion is expensive

The mistake has a standard shape. Someone has an isochore map, because sand thickness is a natural thing to map and a familiar thing to look at, and they multiply it by area and by the property constants to get a volume.

What comes out is the volume of the whole sand body, water leg included. On Ekene that would count all 36 m at Ekene-2 and all 25 m at Ekene-4, two locations where a well has already established there is no oil. It would count the water leg beneath every producing well as well. The number that comes out is not a wrong estimate of the oil in place. It is a correct estimate of a different quantity, which is worse, because it looks reasonable and is internally consistent.

The reverse error is quieter. Someone treats the oil column as if it were a rock property and carries it into a calculation where the contact has since been revised. The columns were computed against the old contact, the sand thicknesses would still have been valid, and nothing in the numbers announces the problem.

The habit that prevents both is to say which thickness you mean every time you quote one, and to name the contact whenever the answer depends on it. "34 m of sand at Ekene-6" and "14 m of oil column at Ekene-6 against a contact at 1560 m" are both correct statements about the same well, and neither can be mistaken for the other.

## Where this is going

The oil column formula above was written with a caveat: it holds when the contact is inside the sand. There is a second case, where the sand runs out before the contact does, and the base surface takes over as the limit. The next lesson gives the rule that covers both cases in one expression, and the lesson after that establishes which of the two cases actually applies on Ekene.

## Exercise

Without looking at the table, write the two formulas and say which inputs each one needs. Then rank the six wells by sand thickness and by oil column at the 1560 m contact, and say in one sentence what the comparison shows. Finally, state what would happen to each of the two rankings if the contact were revised from 1560 m to 1555 m.

Self check: sand thickness is base minus top and needs only the two mapped surfaces; oil column is the contact minus the top where the contact is inside the sand, so it needs a surface and an interpretation. By sand thickness the order is Ekene-2 at 36, Ekene-6 at 34, Ekene-1 at 32, Ekene-5 at 31, Ekene-3 at 29 and Ekene-4 at 25. By oil column at 1560 m it is Ekene-3 at 19, Ekene-6 at 14, Ekene-1 at 12, Ekene-5 at 8, and Ekene-2 and Ekene-4 at zero. The two orders are almost reversed at the top, which shows that thickness of rock is a poor guide to volume of oil. Revising the contact to 1555 m would leave the sand thickness ranking untouched, because no rock moved, and would shorten every oil column by 5 m while leaving both dry wells dry.
