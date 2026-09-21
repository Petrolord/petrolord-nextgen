# Flash fire and explosion

{{panel:qr-event-tree}}

A vapour cloud that ignites late can burn in two ways. It can burn through as a flash fire, killing mainly those inside the cloud, or it can explode, and the overpressure of that explosion belongs to the consequence course. The last branch set of the flammable release tree divides a delayed ignition between the two. That set is the vapour cloud split, and the engine has a preset for it and accepts a split you state instead.

## The preset split

The preset is flash fire 0.6 and explosion 0.4. When you use it, the basis says, verbatim: "flash fire 0.6, explosion 0.4 (TNO Purple Book CPR 18E (1999) section 4.8)".

| frequency per year | outcome | split |
| --- | --- | --- |
| 0.000081000000 | flash fire | 0.6, preset |
| 0.000054000000 | explosion | 0.4, preset |

These are EREMOR's two delayed outcomes, from a release stated at 5e-4 per year with immediate ignition 0.1 and delayed ignition 0.3 given no immediate ignition.

## Stating the split

You may instead state the split as { flashFire: 0.6, explosion: 0.4 }. The engine then gives the same four frequencies to the last bit, and the basis says "as given". The numbers are identical; only the record of where they came from changes.

That record matters. The preset rests on one reading of one source. The split you state rests on whatever your assessment cites. Every capstone in this course states its ignition probabilities and its split, so its answer rests on the stated numbers alone and on no table lookup.

A stated split is a branch set like any other, so it must sum to one within 1e-9. A split that does not close is refused, with the field `vapourCloudSplit` and the path of the set inside the tree.

## Swapping the split

The two numbers are easy to transpose. With 0.4 flash fire and 0.6 explosion, the explosion frequency becomes 0.000081000000 per year, which is 1.500000 times the right figure. The tree still closes, so the engine runs it without complaint.

The swap matters because the two outcomes kill differently at each place, and an individual risk is built outcome by outcome. At EREMOR's control room the stated probability of death is 0 for the flash fire and 0.1 for the explosion, so moving frequency from one to the other moves the individual risk there. At the process deck the flash fire has a stated Pd of 1 and the explosion 0.7, so the same swap moves the deck's figure too, in a direction you can work out from those two stated values.

## Exercise

Divide the swapped explosion frequency, 0.000081000000 per year, by the right one, 0.000054000000 per year, and confirm you reach 1.500000. Then explain why the swapped explosion frequency is exactly the same number as the correct flash fire frequency.
