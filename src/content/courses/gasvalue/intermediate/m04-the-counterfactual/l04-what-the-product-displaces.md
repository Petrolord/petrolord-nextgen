# What the product displaces

The third term of the net abatement is added. It is what the product displaces, and the counterfactual declares it as a figure. The net abatement is the avoided flare, less what burning the product emits, plus what the product displaces.

{{panel:gasvalue-route-explorer}}

## Three markets for one product

The CNG route recovers 0.88 of EGBEMA's flare and avoids 190032.865 t/yr of it. Burning the CNG emits the 128000 the counterfactual declares. What changes from one counterfactual to the next is what the CNG displaces:

| counterfactual | avoidedFlareCo2eTonnes | product combustion (input) | displaced fuel (input) | netAbatementTonnesCo2ePerYear | net minus the gross flare |
| --- | --- | --- | --- | --- | --- |
| CNG displacing diesel in haulage trucks | 190032.865 | 128000 | 156000 | 218032.865 | 2086.427 |
| CNG displacing pipeline gas already burned | 190032.865 | 128000 | 128000 | 190032.865 | -25913.573 |
| CNG sold into a market that burned nothing | 190032.865 | 128000 | 0 | 62032.865 | -153913.573 |

One flare, three answers. Displacing diesel, the net abatement is larger than the gross flare; displacing gas already burned, or selling into a market that burned nothing, it is smaller.

## Reading the three rows

**Diesel in haulage trucks.** The displaced fuel is 156000. The net prints 218032.865, and the net minus the gross flare prints 2086.427. This is the one CNG row where the net is larger than the gross flare of 215946.438.

**Pipeline gas already burned.** The displaced fuel is 128000, the same figure as the product combustion. The net prints 190032.865, the same figure as the avoided flare. The net minus the gross flare prints -25913.573.

**A market that burned nothing.** The displaced fuel is 0. The net prints 62032.865, and the net minus the gross flare prints -153913.573.

Each displaced fuel figure is the study's input for its counterfactual, invented and illustrative. This course does not say which counterfactual a real project should declare.

## The warning names both directions

The engine's warning, printed while the counterfactual is undeclared, names this term in both directions: "recover the gas and somebody burns it, and if that displaces a dirtier fuel the abatement is larger while if it displaces nothing it is smaller."

The three CNG rows show both directions against the gross flare. The diesel row's net minus the gross flare is 2086.427. The row that displaces nothing prints -153913.573.

## The counterfactual has a label

A counterfactual carries a label as well as its two figures. The labels on EGBEMA are "CNG displacing diesel in haulage trucks", "CNG displacing pipeline gas already burned", "CNG sold into a market that burned nothing" and, on gas to power, "Gas to power for a new load that burned nothing". abatement blocks the net when the label is missing, just as it does when the displaced fuel figure is missing. Both probes print the same blockedBy: "the counterfactual is not declared: what the product displaces, and what burning it emits".

The bid table of module 5 carries only one declared counterfactual, the diesel one, on the CNG route. Its netAbatementTonnesCo2ePerYear there reads 218032.865. The other three routes read none declared.

In the panel, pick the CNG route and step through the three counterfactuals. Read the net and the net minus the gross flare on each, with the avoided flare fixed at 190032.865.

## Exercise

Read the three CNG counterfactual rows. For each, give the displaced fuel, the net and the net minus the gross flare. Say on which row the net equals the avoided flare and which two inputs on that row print the same figure. Then quote the blockedBy text abatement prints when the counterfactual label is missing.
