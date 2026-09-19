# Giveaway is quality handed over

The non-binding specifications at Apapa are met with room to spare. That room has a name in blending, giveaway, and it is the second half of reading a specification table.

## The definition

Giveaway is how far inside its limit the blend sits. The engine computes it by the kind of limit:

- for a maximum, the limit minus the achieved value;
- for a minimum, the achieved value minus the limit;
- for a range, the smaller of the two.

Positive giveaway is quality handed over for nothing. The buyer asked for a RON of at least 91 and pays for a cargo that meets 91. Every octane number above that is delivered and not charged for.

## The Apapa giveaway

| specification | min | max | achieved | giveaway | binding |
| --- | --- | --- | --- | --- | --- |
| RON | 91 | no maximum | 94.5010 | 3.5010 | false |
| MON | 81 | no maximum | 84.4928 | 3.4928 | false |
| Sulfur | no minimum | 50 | 50.0000 | 0.0000 | true |
| RVP | no minimum | 9 | 9.0000 | 0.0000 | true |
| Density | 0.72 | 0.775 | 0.7547 | 0.0203 | false |

RON has a giveaway of 3.5010 and MON of 3.4928, each the achieved value minus its minimum. Density sits inside a range, so its giveaway is the smaller of the two gaps, and the engine reports 0.0203. The two binding rows give nothing away, which is what binding means.

## Why a least-cost recipe gives quality away

It can look like waste. If the cargo only needs 91 RON, why does the cheapest recipe deliver more? The answer is in the rows that bind. The recipe is pressed against sulfur and RVP, and those rows, with the batch and Butane's tank limit, hold it at its vertex. The RON row does not: module four reads its value of one unit of relief as 0.0000, so lowering the RON minimum saves nothing. The octane above 91 arrives with the barrels the binding rows call for, and among them is Reformate, which carries a RON of 98.6.

So a planner who wants to cut the octane giveaway looks first at sulfur and RVP, because those are the rows holding the recipe where it is.

## Giveaway and binding are two views of one table

A specification either binds, with zero giveaway, or gives quality away and does not bind. The Apapa table shows the pairing in every row: the two zeros are the two trues. The AGO cargo shows it too: Cetane number and Density bind with a giveaway of 0.0000, while Sulfur gives away 21.8467, Viscosity at 40 C gives away 1.0036 and Flash point gives away 18.7403.

## What giveaway is not

Giveaway is measured in the property's own unit. A RON giveaway of 3.5010 is octane numbers. A density giveaway of 0.0203 is kg/l. The two cannot be added or compared, because they are different quantities. Whether either is worth money is a separate question, and the engine does not answer it on its own: the next lesson shows that a price per unit has to come from the user.

{{panel:crude-recipe-explorer}}

In the panel, raise the RON minimum toward the achieved value and watch the RON giveaway shrink. Watch also whether the recipe moves before RON binds.

## Exercise

Read the Apapa table: RON achieved 94.5010 against a minimum of 91 with giveaway 3.5010, and Density achieved 0.7547 inside 0.72 to 0.775 with giveaway 0.0203. Say which rule the engine applied to each, and say what the giveaway of 0.0000 on Sulfur and RVP shows about how giveaway and binding relate.
