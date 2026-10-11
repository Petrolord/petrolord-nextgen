# Limited and missing curves

The usability rule has two failing grades, and they mean different things. A missing item stops a part of the study at that well. A limited item lets it go on with an estimate, and the result says so.

## Missing: the study cannot go on at that well

Three items can be missing: sonic, density and elevation. Sonic and density are the two curves rock physics cannot run without, because every elastic figure in this tier starts from Vp and density. An unset elevation is missing too; the matrix reads it as the datum item.

On Ekene, one item is missing in one well.

| well | kind | curves | the curve list | density item |
| --- | --- | --- | --- | --- |
| Ekene-9 | deviated | 5 | CALI, GR, DT, DTS, RT | missing |

Ekene-9 has a sonic, a shear sonic and 24 checkshot levels, and the matrix grades all of those good. Its density item reads:

> No density over the zone.

The study has two honest choices: request the density log, or leave Ekene-9 out of every result that needs density. That is every AI (acoustic impedance) figure, every elastic set and every substitution at that well.

## Limited: the study goes on with an estimate

Six items can be limited: shear, porosity, shale volume, saturation, checkshots with fewer than two levels, and a missing deviation survey.

Shear is limited when absent because Vs can be estimated from Vp by a published regression, Greenberg and Castagna, which a later module compares against measured shear. Every logged Ekene well carries DTS, so the shear item is good everywhere.

Porosity, shale volume and saturation feed the substitution and are limited when absent. On Ekene they are limited at all ten logged wells, because the LAS files carry none of the three curves. That single gap is why no cell in the Ekene matrix is good.

Fewer than two checkshot levels is limited. Every logged Ekene well carries 21 or more, so the item is good everywhere.

No deviation survey is limited. The three deviated wells, Ekene-8, Ekene-9 and Ekene-10, grade good on the survey item, so each has one.

## Wells with nothing to grade

Ekene-11 is planned and Ekene-12 is a survey location only. Neither has logs, so neither appears among the 10 cells.

## Closing a limited gap

The three curve gaps are closed before the study starts. In practice porosity, shale volume and saturation come from Petrophysics Studio, and the pack carries the kit's PHIT, VSH and SW for Ekene-1 to Ekene-4 for that reason. By the rule, a well whose only limited items were those three curves would read good once they arrive, since every other item at Ekene-1 to Ekene-4 is already good.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to Data inventory and Data to "Ekene pack: Ekene-1". From the inventory table, list every logged well and, for each, the items you would grade limited or missing using only the columns shown. Then set Data to Ekene-2, Ekene-3 and Ekene-4 in turn and check that each shows leg samples, which rest on the VSH curve the pack adds. Write which items each pack well would lose without its pack curves.
