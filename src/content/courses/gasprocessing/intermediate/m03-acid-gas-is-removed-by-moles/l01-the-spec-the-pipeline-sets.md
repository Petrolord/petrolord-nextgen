# The spec the pipeline sets

Sweetening is a mole balance from end to end. The gas carries a mole percent of CO2 and of H2S, the spec says what may stay, and the difference is what the solution has to pick up. Nothing in that chain is a mass until the very last step.

## Four numbers before anything is computed

| the stream | CO2, mol percent | H2S, mol percent |
| --- | --- | --- |
| UBIE at the inlet | 5.200000 | 1.400000 |
| what may leave | 2.000000 | 0.000400 |

Two of those four describe a gas and two describe a contract. The engine treats all four as inputs and picks none of them. That matters because the two spec figures carry most of the cost of the unit and neither is derived from anything physical in this module.

{{panel:fc-absorber-explorer}}

## Adding two differences

The removal is the CO2 difference plus the H2S difference: 5.200000 less 2.000000, plus 1.400000 less 0.000400, which is 4.599600000 mol percent removed.

The two acid gases are added and then carried as one figure from there on. That is the modelling decision at the heart of this half of the engine, and it is worth stating plainly rather than letting it slip past. A mole of H2S and a mole of CO2 are loaded onto the amine on equal terms here, and whether a particular solvent behaves that way is not a question this module asks.

Notice also what the two spec figures actually are: 2.000000 mol percent for CO2 and 0.000400 for H2S. A pipeline treats the two gases differently, and those two entries are what that difference looks like once somebody has written it into a contract. The engine does not know why they differ. It subtracts, adds, and moves on, and the whole of the rest of the sweetening chain hangs off the single figure that comes out.

## Three ways the specs can be wrong

The engine declines a spec pair that leaves it nothing to do, and it distinguishes the cases rather than lumping them together.

| what was asked | what comes back |
| --- | --- |
| a spec already met at the inlet | { error: "no acid gas to remove at these specs: CO2 5.2 to 5.2 and H2S 1.4 to 1.4 mol percent" } |
| a spec set above the inlet | { error: "a spec above the inlet is already met: CO2 7.5 against 5.2 mol percent, H2S 0 against 1.4" } |
| a lean loading at or above the rich | { error: "rich loading must exceed lean loading: 0.48 against 0.48 mol acid gas per mol amine leaves no swing to circulate on" } |

The first two look alike and are not. One says the gas is already on spec. The other says a figure was typed into the spec box that is larger than the inlet beside it, which is a typing error rather than a plant condition, and the message quotes both sides so it can be seen at a glance. The third refusal is about the solvent loop rather than the gas, and the next lessons are about it.

## Exercise

Record the four mole percentages for UBIE and the removal they imply. Then say which two of the four belong to the gas and which two belong to a contract, and name the difference between the first two refusals above.
