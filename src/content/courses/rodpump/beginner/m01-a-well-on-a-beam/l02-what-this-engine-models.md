# What this engine models

Four files, a handful of closed forms and one march, with every constant built from its definition rather than remembered as a number.

## The closed forms

A compliance sum, Archimedes, a stepped bar eigenvalue, a four-bar closure, a differential times an area, and a volume per stroke. On the published taper the compliance sum returns an elastic constant of 3.744037060e-3 in/lb and a spring rate of 267.091373300 lb/in. Archimedes returns a buoyancy factor of 0.872611464968 and a buoyed weight of 8673.757961783 lb. The eigenvalue returns 53.362124006 spm. None of the three has a time step in it, and none of them changes when the pumping speed does.

## The march

`predictCard` marches the damped wave equation down the string and reports what the pump end did. `diagnoseCard` goes the other way, propagating Fourier harmonics of a measured surface card down to the pump. The two share no code path, which is why one can be checked against the other.

## Constants it builds rather than remembers

The pump displacement constant is 0.116571155977 bbl per day per in2 per in per spm, assembled from 9702 in3 per bbl, itself 42 gallons of 231 in3. Young's modulus for API sucker rods is 30500000 psi, steel specific gravity 7.85 and steel density 490 lb/ft3.

The wave speed of a 7/8 rod is 16288.760984482 ft/s, not the 16981.875572480 ft/s that modulus and density alone give, because published rod weights include couplings. The catalog states a coupling allowance of 1.087, and dividing the bare steel velocity by its square root gives 16288.117080010 ft/s. The catalog also ships one conventional figure, 16333 ft/s, for anyone who wants a single number for every size.

## Two routes on purpose

Golden values come from an independent oracle: a finite element eigenvalue for the note, a Newton four-bar closure for the linkage, a staggered grid march for the card. On the closed forms the engine reproduces it exactly, a difference of 0.000e+0 on weight in air, buoyed weight, elastic constant and spring rate for both published strings.

The two routes separate only on the eigenvalue. The uniform string is 40.722116061 spm from the oracle against 40.721902461206 spm from the engine scan, a difference of -2.1360e-4 spm. The taper is 53.362201213 spm against 53.362124005810 spm, a difference of -7.7207e-5 spm.

## What that agreement is worth

The oracle's gates hold the two routes to 2 percent on plunger stroke and 3 percent on the minimum load, so anything smaller is invisible to it by construction. Agreement to the last figure on a compliance sum is agreement about arithmetic. It is not evidence about a well.

## Exercise

List the quantities that survive a change of pumping speed and the quantities that do not, using the published taper.

Then write the two eigenvalue differences with their signs and say which of the two routes you would quote in a report, and why the choice barely matters here.
