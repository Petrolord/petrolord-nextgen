# How close is close

The whole discipline is one subtraction. What the line arrives at, less a temperature somebody measured in a laboratory. The engine supplies the first number and refuses the second.

{{panel:pd-line-explorer}}

## The number neither engine will give you

Both module headers say so in as many words. `flowlineThermal` says hydrate and wax boundaries "are fluid properties, they come from a lab or a compositional flash, and the consumer supplies them", and `hydrateInhibition` says it "does NOT compute where the hydrate boundary is in the first place".

That is why the three published arrivals in this course carry no verdict at all. At 5280.0 ft the line arrives at 156.177943871283 degF, at 26400.0 ft at 95.094251524883 degF and at 105600.0 ft at 43.357693442744 degF, and not one of those is safe or unsafe, because no boundary was supplied to judge it against.

## The subtraction, on a line that has a boundary

TEACHING LINE AKASO SPUR is 60000.0 ft on a 9.562 in bore, buried 3.00 ft to centreline, carrying 90000.0 lb/hr at Cp 0.620 from a 195.00 degF inlet against a 45.00 degF seabed. Its overall U referred to the bore is 0.452972856617 Btu/(hr ft2 degF), its relaxation length is 49209.01299043 ft, and its ntu over that length is 1.219288832549. With heat loss only it arrives at 89.316029952695 degF.

Its hydrate boundary is 71.00 degF while flowing. That number is a TEACHING INPUT chosen for this line. No engine produced it and no oracle has checked it.

The margin is 18.3160299527 degF outside the hydrate region, and it exists only because somebody typed 71.00 degF.

## The mistake that makes a line look safe

The same arrival supports two subtractions. Its excess over the seabed is 44.3160299527 degF, against an inlet excess of 150.0000 degF. Its margin against the boundary is 18.3160299527 degF. Only the second one is a verdict, and reading the first as though it were is the most common way a flow assurance answer comes out cheerful and wrong.

## How close is close

There is no natural scale on a margin. AKASO SPUR carries a safety margin of 5.00 degF, which is an operator policy input and not a computed quantity. The other reading is in insulation rather than in degrees: the U that would land this line exactly on 71.00 degF is 0.651078288819 Btu/(hr ft2 degF), which is 1.43734504 times the U the line has. The margin in degrees and the margin in U are the same statement.

## What it refuses

No returned object in either module has a margin field, a boundary field or a verdict. `steadyStateProfile` returns `ok = true`, an arrival and its stations, and `ok = true` means only that it had a length, a mass rate, a heat capacity and a heat transfer coefficient.

## Exercise

Run AKASO SPUR in the panel and write down its arrival and its excess over the seabed.

Then say which of the two you would need a laboratory report to turn into a verdict, and what the report has to contain.
