# Two roundings, measured

Two of this module's constants are neither fitted nor held. They are roundings of exact derivations, and the difference each one causes downstream can be measured out of the engine itself. Neither is moved, and that is a decision rather than an oversight.

{{panel:fc-coefficient-explorer}}

## The viscosity conversion

The engine carries 2.419100 for centipoise to pounds per foot per hour. It can be recovered from an answer rather than read from the source: at a unit viscosity the Prandtl number comes back as 30.238750, and the heat capacity and the conductivity it was formed from are conditions of the case, so the conversion the engine used is 2.419100, taking the Prandtl number times the conductivity over the heat capacity.

The published file carries the exact derivation beside it. That figure is 2.419088 against the engine's 2.419100, a ratio of 1.000004832191 formed from those two.

## The gas constant

The same shape, on the air density path. The engine carries 10.731600 psia ft3 per lbmol degR. Derived from the SI gas constant the figure is 10.731577, a ratio of 1.000002134913.

## Why neither is moved

Moving either would move every shipped number that reads it, in this module and in the apps built on it. What is done instead is that the residual each one causes downstream is asserted to equal the rounding. The named cause is then itself a check: if the downstream difference ever stops matching the rounding, something other than the rounding has changed.

That is a different discipline from pinning. A pin records a value. This records a consequence, which means the constant is tied to an effect a test can see. It also puts a number on the size of the compromise, so nobody has to guess whether the rounding matters.

## What else can be measured rather than cited

Two more numbers in this module are recovered rather than quoted, and both are worth knowing as a technique.

The Rankine offset lives as a literal inside the air density helper rather than as a row of the constants table, so it cannot be read off that table at all. It can be measured from two calls: densities of 0.076341600 and 0.068439697 lb per ft3 at 60.000000 and 120.000000 degF imply an offset of 459.670000 degR, because an ideal-gas density is inversely proportional to absolute temperature and the offset is the only unknown left.

The fan constant is the other. It is written against a water density this module never states, and the published file carries that density at 62.303335 lb per ft3 as a measurement rather than a citation.

## One more check in the same family

A Reynolds number is inversely proportional to viscosity, so doubling the viscosity has to halve it. The engine gives 22025.923000 at one viscosity and 11012.961500 at twice it, a ratio of 0.500000. That is a limit rather than a comparison with a publication, and it costs one extra call.

## Exercise

Record both roundings with the exact figure beside each and the ratio between them. Reproduce the viscosity conversion from the Prandtl number, the conductivity and the heat capacity. Then record the two densities that imply the Rankine offset and the offset they imply, and say why that constant cannot be read off the declared constants table.
