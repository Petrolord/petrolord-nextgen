# The gross flare is not the abatement

The Associate tier weighed EGBEMA's flare. This module asks what recovering it abates. abatement answers that question, and it gives no net until a counterfactual is declared.

{{panel:gasvalue-route-explorer}}

## The gross flare

EGBEMA flares 7.5 MMscfd on 355 days a year, at a destruction efficiency of 0.97, a combustion efficiency of 0.955 and the study's methane GWP of 29.8. The Associate tier printed the flare:

| EGBEMA flare | value |
| --- | --- |
| flareCo2Tonnes (t/yr) | 182079.024 |
| flareCh4Tonnes (t/yr) | 1136.490 |
| flareCo2eTonnes (t/yr) | 215946.438 |

That flareCo2eTonnes is the flare's gross emission. A flare is also a line in an emissions inventory, and the `carbon` course owns that inventory. The GWP of 29.8 is the study's input. The engine ships no GWP, and this course does not say which one a study should use.

## The engine's warning

While the counterfactual is undeclared, the engine prints no net abatement, and it prints this warning:

"No abatement is reported. The flare's gross emission is not the abatement: recover the gas and somebody burns it, and if that displaces a dirtier fuel the abatement is larger while if it displaces nothing it is smaller. State what the product displaces and what burning it emits."

The warning names the two figures a counterfactual declares: what the product displaces, and what burning it emits.

## The rule for the net

The net abatement is the avoided flare, less what burning the product emits, plus what the product displaces. Each of the three terms has its own lesson in this module:

- the avoided flare, which is the flare's CO2e times the recovery (lesson 2);
- what burning the product emits, an input (lesson 3);
- what the product displaces, an input (lesson 4).

Lesson 5 reads what the engine gives when any of them is missing.

## One flare, three answers

Three counterfactuals on the same flare and the same CNG route give three nets:

| counterfactual | flareCo2eTonnes | netAbatementTonnesCo2ePerYear | net minus the gross flare |
| --- | --- | --- | --- |
| CNG displacing diesel in haulage trucks | 215946.438 | 218032.865 | 2086.427 |
| CNG displacing pipeline gas already burned | 215946.438 | 190032.865 | -25913.573 |
| CNG sold into a market that burned nothing | 215946.438 | 62032.865 | -153913.573 |

One flare, three answers. Displacing diesel, the net abatement is larger than the gross flare; displacing gas already burned, or selling into a market that burned nothing, it is smaller. The last column prints each difference as its own figure: 2086.427, -25913.573 and -153913.573.

A fourth counterfactual sits on the gas to power route, "Gas to power for a new load that burned nothing", and its net is below zero. Lesson 3 reads it. Every counterfactual figure in this module is an input the study typed, invented and illustrative.

## The claim the engine will not make

The flare's gross CO2e is still reported beside a blocked net, as grossClaimIfNoCounterfactual. On EGBEMA it reads 215946.438 t/yr: the claim the engine will not make. The engine prints it beside a net of null, so the gross figure is on the page and the net abatement is not.

In the panel, pick the CNG route, clear the counterfactual and read grossClaimIfNoCounterfactual beside the blocked net. Then pick each of the three counterfactuals and read the net and the net minus the gross flare.

## Exercise

Read the three counterfactual rows. Give the net abatement and the net minus the gross flare for each. Say which counterfactual gives a net larger than the gross flare and which give a smaller one. Then quote the field that carries the gross CO2e beside a blocked net, with its EGBEMA value.
