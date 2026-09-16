# Choosing one, and an amine the table lacks

Two things close this module. What a selection actually rests on once the table has been read, and what happens when the amine you want is not one of the three.

## An amine the table does not carry

Ask the module for an amine it does not have and the lookup returns null. Ask the sweetening package for one and it declines by name:

| asked for | what comes back |
| --- | --- |
| DIPA | { error: "unknown amine 'DIPA'; this module carries MEA, DEA, MDEA" } |

This is the one catalogue lookup in the module, and it says it does not know. That is the right answer and it is a rarer one than it should be. The failure this avoids is a lookup that falls back to a default when it misses, which produces a complete and plausible answer for a solvent nobody asked about.

{{panel:fc-absorber-explorer}}

## The message is the useful part

The refusal names the amine that was asked for and lists the three that are available. A reader gets the correction and the catalogue in one line, without going to the source.

There is nothing in the module that lets a caller add a fourth row. A solvent outside these three has to be worked by hand, and the honest reading of that is a scope boundary rather than a defect. The package answers for three amines and says so.

## What a choice actually rests on

The comparison in the previous lesson ranks the three the same way three times over, so the table alone makes the choice look obvious. It is not, and the reasons it is not are all things this module does not carry.

It does not separate CO2 from H2S, because the two are added together at the very first step and carried as one figure from there. It has no input for solvent degradation, for reclaiming, for foaming or for the cost of the solvent itself, and its only corrosion handling is the one customary loading limit. It carries no rate-based absorber model, so the acid gas partial pressures that drive a real absorption have nowhere to go.

So the table gives you a first pass on circulation and regenerator size for three coherent sets of operating assumptions, and everything that usually decides a solvent selection sits outside it. A learner who leaves this module quoting the ranking as the decision has read the numbers correctly and the engine wrongly.

## The habit to take forward

Read every answer this package gives as the answer to a narrower question than the one you asked. The narrower question is usually visible in what the inputs are: three amines, one swing, one strength, one duty per gallon. Nothing that is absent from that list is in the answer.

## Exercise

Record the refusal for an amine the table does not carry and the three amines it lists. Then name three things a real solvent selection depends on that this module does not carry, and say what the module would have done wrong had it fallen back to a default amine instead of declining.
