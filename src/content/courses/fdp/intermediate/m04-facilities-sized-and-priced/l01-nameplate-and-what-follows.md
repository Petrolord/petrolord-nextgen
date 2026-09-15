# Nameplate, and what follows

A facility's nameplate is the throughput it is built to handle, and in the screening tier it is the one input from which the capex, the operating cost, the decommissioning allowance and the handling capacities all follow. Type chooses the family and nameplate sets the size.

{{panel:ec-schedule-explorer}}

## Three facilities on one plan

| facility | type | nameplate bopd | capex | annual opex | decommissioning |
| --- | --- | --- | --- | --- | --- |
| Egina FPSO | FPSO | 60000 | 1363.3524 | 55.7800 | 204.5029 |
| Egina FPSO, debottlenecked | FPSO | 150000 | 2589.2031 | 96.6591 | 388.3805 |
| Deep tie-back | Subsea Tie-back | 25000 | 184.6717 | 9.8963 | 27.7007 |

Every money column is million USD. Not one of those figures was typed by a cost engineer. Move the nameplate from 60000 to 150000 and all three money columns move with it, because each is a function of the type and the number of barrels a day the unit is sized for.

## Capacity moves in step with the nameplate

The Egina FPSO carries 90000 Mscf/d of gas handling and 48000 bopd of water handling against a nameplate of 60000. The debottlenecked case carries 225000 and 120000 against a nameplate of 150000. Multiply the nameplate by 2.500000 and both capacities multiply by 2.500000 as well. The handling side of a facility is sized in proportion, and that is the only part of the card that is. The Deep tie-back keeps the same relationship at a nameplate of 25000, with 37500 Mscf/d of gas handling and 20000 bopd of water handling.

## The money does not

Capex rises by a factor of 1.899144 over the same step, from 1363.3524 to 2589.2031, and the annual operating cost by 1.732862, from 55.7800 to 96.6591. A unit two and a half times the size costs 1.899144 times the money. The decommissioning allowance follows the capex rather than the nameplate, which is why it reads 204.5029 against 388.3805.

## A screening estimate among three estimates

The 1363.3524 on the FPSO card is a class 5 figure derived from a type and a nameplate. The concept the plan is running carries its own facilities capex of 1350.0000 inside a total capex of 2250.0000, and the plan's own cost items add to a CAPEX total of 2250.0000 line by line. Three numbers describe overlapping things by three different methods, and the studio shows all three rather than picking one.

## The mistake

The mistake is to carry 1363.3524 forward as the price of the vessel. It is an output of two inputs, and it changes the moment somebody revises the nameplate, with no new engineering behind the change. The matching error runs the other way: reading a concept's capex off a facility card, when the concept's drilling, facilities and subsea fields are where the scenario economics actually read from.

## Exercise

Write the nameplate, capex and decommissioning of all three facilities. Then state the gas and water handling capacities at 60000 and at 150000, give the factor between the two nameplates, and say which columns moved by that same factor and which did not.
