# Quantities no project can recover

{{panel:prms-classification-calculator}}

Not all petroleum in the ground can be recovered. Some stays in the rock after every project anyone can describe has done its work. The framework still counts it, so that the whole accumulation is accounted for, and gives it its own class: Unrecoverable (PRMS 2.1.0.1, 2.1.1.2). The engine reaches that class at the second step of its decision list, when the stated recovery project is none.

## Two kinds of unrecoverable

| discovery (stated) | recovery project (stated) | class (engine) | example |
| --- | --- | --- | --- |
| discovered | none | Discovered Unrecoverable | EKN-8 Ekene Main residual oil |
| undiscovered | none | Undiscovered Unrecoverable | the golden input class-undiscovered-unrecoverable |

## Ekene Main residual oil

EKN-8 is the oil left in the Ekene Main reservoir that neither the waterflood of EKN-1 nor the infill wells of EKN-2 can reach. It is discovered, and its stated recovery project is none. The engine's first two reasons read:

> discovery: discovered: a known accumulation (PRMS 2.1.1.1)

> recovery project: none applies with established technology or technology under development: Discovered Unrecoverable (PRMS 2.1.0.1, 2.1.1.2)

The engine then stops. It reads no commerciality, no sub-class and no chances, and it returns no category labels. Its basis says why, in its own words:

> none: unrecoverable quantities are not categorized

## Nothing further is stated

Because no project applies, anything that describes a project is refused. A sub-class stated on EKN-8 is refused with the reason:

> subClass must be left out for unrecoverable quantities (no recovery project applies); got "development-not-viable"

The sub-class "development-not-viable" belongs to Contingent Resources: a project exists and is described, but it is not expected to go ahead. Unrecoverable quantities have no project at all. The difference matters in a report, because a not-viable project can be revisited with new prices or costs, while unrecoverable oil needs a new way of recovering it before it can enter any other class.

## Not forever

The class is a statement about today's facts. If a new recovery method is shown to work, or a project is designed that can reach part of the residual oil, that part is stated again with the new project and classified again. The engine keeps no memory of an earlier class: every call reads only the facts in its box.

## A declaration of no interest

The Nigerian terms of the last module add one more route here. A licensee may tell the Commission a discovery is of no interest (PIA 2021 s.78(8)(c)). The course's small case "A discovery of no interest" states such a project with no recovery project, and the engine returns Discovered Unrecoverable with a note citing the Act. The note is printed beside the class and does not change it.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality", and start from "EKN-8 Ekene Main residual oil". Read both reason lines and the Source block. Set the Sub-class control to "development-not-viable (Contingent)" and read the refusal, then set it back to "not stated". Next set the Discovery control to "a potential accumulation (undiscovered)" and read the Class tile. Finally start from "A discovery of no interest" and copy its Nigerian note.
