# What the method does not know

Six things this course teaches as limits and never as answers, and two more that are simply absent. The difference between the two is worth holding, because they call for different actions.

{{panel:fc-water-explorer}}

## The six limits

The real-gas departure of the saturated water content is held for literature. The engine warns above 1000.000000 psia that the correction reaches tens of percent, and nothing in this package stands behind a figure for it. Every graded water content in this course sits below that threshold.

The water overhead the reboiler pays for, 1100.000000 Btu a lb, is declared. It is an input with that default and no publication here fixes it.

The glycol density, 9.300000 lb a gallon, is declared. It is the module's one glycol density, and both the loop balance and the vessel sizing read it, so a reader always knows which number they are holding.

The water density the amine gallons chain divides by, 8.340000 lb a gallon, is declared. The module's own comment records that it sits above the measured density of water at the standard temperature, because it is the figure the amine charts are drawn with.

The three amines' property set is declared. The molecular weights are chemistry. The typical strengths, the rich limits, the duties and the solution gravities are customary practice with no source here.

The BTEX absorbed fraction and its single molecular weight are declared. The fraction is a chart or operating value, and the molecular weight is one compound standing for four.

## One export that collects them

`DECLARED_CONSTANTS` is an export whose whole purpose is to say which numbers no check in this package can reach, and its own comment says that pinning them is the honest best available rather than a validation. A course that presented a pinned constant as a verified one would be making exactly the claim that export exists to refuse.

## Two absences, which are a different thing

There is no hydrate boundary in this engine, and there is no stage efficiency. A hydrate margin is the Production module Flow Assurance engine, which owns subcooling, the depression correlations and the inhibitor dose, and computes no hydrate boundary of its own either. Dehydration and a cold separator are the other two answers to the same question, and the seam between the three is a course boundary rather than a gap.

## Nothing here models a real absorber

A theoretical stage is not a tray. There is no rate-based mass transfer and no approach to equilibrium anywhere in this module. The Professional tier gives a stage count and a circulation, and turning either into steel needs a vendor.

## Limit or absence

A limit is a number this package holds and cannot check, and it becomes an answer the day a source is read against it. An absence is a subject this engine does not contain, and it becomes an answer only in the engine that owns it. Naming which you are looking at is the last habit this tier asks for.

## Exercise

List the six limits with their values where they have one, and say which is held for literature and which are declared. Name the export that collects them. Then name the two absences, the engine that owns each, and the difference between a limit and an absence.
