# Gas cools as it expands

A gas that loses pressure without losing enthalpy changes temperature, and on a long subsea gas line that term is the same size as the heat the sea takes.

{{panel:pd-hydrate-explorer}}

## Two inputs, neither of them computed here

`steadyStateProfile` takes `inletPsia`, `outletPsia` and `jtCoeffFPerPsi`. It forms the pressure drop as the inlet less the outlet and multiplies that drop by the coefficient. It computes neither. The coefficient is a fluid property that comes out of an equation of state, and the pressure traverse is a hydraulics problem this module does not solve. The coefficient carries a sign, and for natural gas at flowline conditions it is positive, so expansion cools and the term subtracts.

`jtCoeffFPerPsi` defaults to zero. A caller who omits it gets a complete-looking profile, a full station table and `ok` true, with the effect silently absent.

## Every published case has the term at zero

No golden case sets a pressure anywhere, so the Joule-Thomson term is exactly zero in all of them. The published profile at 105600.0 ft returns 21 stations and prints a pressure column that reads n/a in every one of them, rather than hiding it.

With the term at zero, on a 180.0 degF inlet against a 40.0 degF ambient at 120000.0 lb/hr and Cp 0.5 through the published insulated build, the engine arrives at 156.177943871283 degF over 5280.0 ft, 95.094251524883 degF over 26400.0 ft and 43.357693442744 degF over 105600.0 ft. Those are heat loss and nothing else.

## What pressures do to an answer

TEACHING LINE AKASO SPUR is a construct this course designed for itself, not a published case and not a real line. It runs 90000.0 lb/hr of gas at Cp 0.620 into a 9.562 in bore, 195.00 degF in against a 45.00 degF seabed, over 60000.0 ft, and it carries pressures: 2400.0 psia at the inlet, 1500.0 psia at the outlet, a drop of 900.0 psi, and a Joule-Thomson coefficient of 0.0280 degF/psi.

Multiplied out, that is a Joule-Thomson term of 25.2000000000 degF. With no pressures passed the engine arrives at 89.316029952695 degF. With them passed, the same line at the same U losing heat at the same rate arrives at 64.116029952695 degF.

## The mistake

Reading a heat-loss profile as a gas line profile. The pressure column reading n/a is the only visible sign that the term was never applied, and it sits in a station array most callers never open. The arrival temperature carries no flag, no note and no difference in shape, and a liquid line and an uninstrumented gas line return the same object.

## What it refuses

Nothing about pressures. An inlet pressure with no outlet leaves the drop at zero. Both pressures with no coefficient leaves the term at zero. Neither case is refused and neither is noted.

## Exercise

Run the teaching line in the panel with no pressures and record the arrival, then with the inlet, outlet and coefficient set and record it again.

Then say which of the two a reviewer would call the flowline answer, and what in the returned object tells them which one they are holding.
