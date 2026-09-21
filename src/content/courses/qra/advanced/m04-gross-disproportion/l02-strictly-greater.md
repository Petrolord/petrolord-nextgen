# Strictly greater

{{panel:qr-alarp}}

The gross disproportion test is an inequality, and an inequality has an edge. What happens when a measure's cost is exactly DF times its benefit? The engine follows the OWNER'S DECISION that a value exactly at a threshold belongs to the lower band, so a cost exactly at the limit is NOT_GROSSLY_DISPROPORTIONATE, and the measure is still reasonably practicable. This lesson works the golden case that sits on that edge.

## The golden case at the edge

The golden case exactly-at-df puts a cost of 9000.000000000002 against DF 3 times a benefit of 3000.00. On paper the cost is exactly equal to the limit; in double precision it lands a hair above.

| cost | DF | benefit | verdict | atBoundary |
| --- | --- | --- | --- | --- |
| 9000.000000000002 | 3 | 3000.00 | NOT_GROSSLY_DISPROPORTIONATE | true |

Two rules act together here. The boundary snap, 1e-9 relative, treats the computed cost as the limit itself. The lower band rule then places a cost at the limit on the reasonably practicable side, and `atBoundary` records that the verdict came from the edge. Without the snap, a plain comparison would call this measure grossly disproportionate because of the last bit of a floating point product.

## Why strictly greater

The checklist's own words set the direction: a measure is grossly disproportionate when costs over benefits are "greater than" the DF. A ratio equal to the DF is therefore on the reasonably practicable side. The engine's basis model string says the same, with a strict inequality:

> grossly disproportionate when cost / benefit > DF; benefit = (dPLL x VPF + other harms) per year over the life; CPF = cost / (dPLL x years)

The same decision runs through the individual risk bands, where 1e-3 is TOLERABLE for workers and 1e-6 is BROADLY_ACCEPTABLE. The Purple Book Figure 6.8 caption reads the other way at equality, and R2P2's bias to safety could argue for the other convention. The engine takes the checklist's wording, states its choice, and flags every verdict that the choice decided.

## What the edge means for the duty

A verdict at the boundary is still reasonably practicable, and the duty to adopt the measure stands. The `atBoundary` flag is a warning for the note. It says that a slightly different VPF, DF or rate could move the verdict, so the note should show the verdict at those neighbouring choices and say which of them the duty holder relied on.

A reviewer reading a verdict with `atBoundary` true should expect to find exactly that sensitivity in the note. A verdict that turns on the boundary convention and is reported without it hides the one fact a decision maker most needs.

## Exercise

Take the golden case: a DF of 3 and a benefit of 3000.00. Multiply them to find the limit, compare it with the cost of 9000.000000000002, and write the verdict a plain greater-than comparison with no snap would give and the verdict the engine gives. Then write one sentence for an ALARP note reporting this measure at its boundary, naming the flag the engine set.
