# Where the term belongs

Heat loss is a boundary condition acting on the inlet excess. Joule-Thomson cooling is a source spread along the line, and the two do not enter the balance in the same place.

{{panel:pd-hydrate-explorer}}

## The half that is an exponential

Ambient plus the inlet excess decayed by exp(-x/Lc) is the whole heat-loss answer, and Lc is the relaxation length, m Cp over U pi D. On TEACHING LINE AKASO SPUR, a construct this course designed for itself rather than a published case, U referred to the bore is 0.452972856617 Btu/(hr ft2 degF), the relaxation length is 49209.01299043 ft, and over 60000.0 ft the number of transfer units is 1.219288832549.

exp(-ntu) on that line is 0.295440199685. The inlet excess over the 45.00 degF seabed is 150.0000 degF, so what survives to the far end is 44.3160299527 degF of excess and an arrival of 89.316029952695 degF with heat loss alone.

That half is checked. On the published cases the engine and the independent SI oracle, two separate roads to one quantity, agree on arrival to 1.004609e-9 relative at 5280.0 ft and 2.091692e-9 at 105600.0 ft.

## The half that is a source

Pressure falls all the way down a flowline, so the cooling it causes is produced all the way down the line too. It is not delivered at the outlet. A degF of cooling produced at the midpoint enters the fluid there and is then carried through the same relaxation the inlet excess is carried through: the fluid is colder than the surroundings would otherwise leave it, and the surroundings give some of it back before the end.

## What the engine does with it

At each station the engine forms the ambient, adds the decayed inlet excess, then subtracts `jtCoeffFPerPsi` times the pressure drop times the fraction of the length travelled. The subtraction sits outside the exponential. At the arrival that fraction is one, so the entire term, 0.0280 degF/psi against a 900.0 psi drop and therefore 25.2000000000 degF, is taken off undamped.

The two halves then behave differently when the line is lengthened. A derived sweep on those teaching inputs, not a published case, takes 60000.0 ft to 90000.0 ft: the heat loss arrival falls from 89.3160299527 degF to 69.0877170663 degF as ntu goes from 1.2192888325 to 1.8289332488, while the term subtracted stays 25.2000000000 degF. The engine arrival goes from 64.1160299527 degF to 43.8877170663 degF, which is below the 45.00 degF seabed it is losing heat to.

## The mistake

Treating the term as a correction applied at the outlet. The arithmetic looks unarguable: degF per psi times psi is degF, and both inputs are the caller's own. Nothing about the units is wrong. What is wrong is that the product is applied where no relaxation reaches it, on a line whose ntu says relaxation dominates.

## What it refuses

The module refuses a profile with no length, no mass rate, no heat capacity or no U, with a written reason. It refuses nothing about pressure. Any drop, any coefficient and any length come back with `ok` true and no note.

## Exercise

Record the relaxation length, ntu, exp(-ntu) and the heat-loss-only arrival on the teaching line.

Then say where in that sequence the 25.2000000000 degF enters, and which of those four numbers changes when it does.
