# Deck load and deadweight

{{panel:marine-voyage-calculator}}

Area is one limit on deck cargo, and weight is another. A deck has a rated load, and the whole vessel has a cargo deadweight it can carry across deck and tanks together. The engine checks both. This lesson builds the Ekene milk run's two weight figures and shows a small case where a heavy liquid tips a voyage over its deadweight.

## Deck load

The deck load is the tonnes of deck cargo, checked against the vessel's stated deck load. On the Ekene PSV milk run the deck cargo weighs 635.000000 t against a deck load of 2000.000000 t, a utilisation of 0.317500. The deck fills by area long before it fills by weight here, because much of the cargo is bulky and light.

## Deadweight

The deadweight load is the deck cargo's weight plus the weight of every bulk product, each volume times its stated density. On the Ekene milk run the 635.000000 t of deck cargo is joined by six bulk products:

| product | m3 on the milk run | density, t a m3 |
| --- | --- | --- |
| diesel | 460.000000 | 0.85 |
| water | 745.000000 | 1 |
| mud | 200.000000 | 1.4 |
| brine | 85.000000 | 1.2 |
| cement | 60.000000 | 1.5 |
| barite | 70.000000 | 2.1 |

The engine returns a deadweight load of 2390.000000 t. Against the PSV's deadweight of 3500 t, that is a utilisation of 0.682857. The cargo deadweight is the planner's net figure for cargo. The engine applies no stowage factor and adds no allowance: every figure it needs is a stated density or a stated capacity.

## A heavy liquid

Densities decide how much a tank of bulk weighs, and some completion fluids are far heavier than water. The small teaching case "A heavy liquid and the deadweight" carries 60 t of deck cargo and 50 m3 of a product d at 2.9 t a m3, against a deadweight of 200 t. The engine returns a deadweight load of 205.000000 t and a deadweight utilisation of 1.025000. Its reasons, verbatim:

> the binding constraint is deadweight: 205 t of 200 t (102.5%)

> overloaded: deadweight needs 205 t against a capacity of 200 t

The voyage is a result with its reasons: planned, and flagged as overloaded on deadweight. Nothing about the deck area or the tank warned of it. Only the density did.

## Why the density is required

A density is required for every product, with no assumed value. A planner who treated brine or mud as water would understate the deadweight and could plan a voyage the vessel cannot safely carry. The densities in the Ekene fixture are its own stated inputs.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Multiply each bulk volume above by its density, add the deck cargo, and check your total against the deadweight row of the constraints table. Then set Start from to "A heavy liquid and the deadweight" and read the reasons. Change "Cargo deadweight, t (stated)" from 200 to 205, so the capacity equals the load exactly, and predict whether the engine calls the voyage feasible. Check the feasible column and the binding utilisation, then restore 200.
