# Blocked until declared

abatement gives no net without every input it rests on, and says which is missing first, in a field called blockedBy. The net prints null. It does not print zero, and it does not print the gross flare.

{{panel:gasvalue-route-explorer}}

## Five blocked probes

| probe | netAbatementTonnesCo2ePerYear | blockedBy |
| --- | --- | --- |
| no GWP | null | no methane global warming potential supplied |
| no recovery fraction | null | no recovery fraction in (0, 1]: gas the plant does not recover is still flared |
| recovery 1.5 | null | no recovery fraction in (0, 1]: gas the plant does not recover is still flared |
| no counterfactual label | null | the counterfactual is not declared: what the product displaces, and what burning it emits |
| no displaced fuel figure | null | the counterfactual is not declared: what the product displaces, and what burning it emits |

Three blockedBy texts cover the five probes. Each names one input.

**The GWP.** The methane GWP is an input with no default. The Associate tier printed the same blockedBy on the flare itself: with the GWP left blank, flareCo2eTonnes and the methane share print null, while flareCo2Tonnes and flareCh4Tonnes still print. GWP values are case inputs, and this course does not say which one a study should use.

**The recovery.** A recovery missing, or typed outside (0, 1], blocks the net with the rule of lesson 2 in its text: gas the plant does not recover is still flared.

**The counterfactual.** A missing label and a missing displaced fuel figure both print the same text, and the text names both figures the counterfactual declares: what the product displaces, and what burning it emits.

## Which is missing first

abatement says which input is missing first. Each of the five probes above leaves one input out, and each prints one blockedBy text and a net of null. The course prints no probe with two inputs missing at once, so this lesson does not say which of two missing inputs blockedBy would name.

## The warning and the gross claim

While the counterfactual is undeclared, the warning prints:

"No abatement is reported. The flare's gross emission is not the abatement: recover the gas and somebody burns it, and if that displaces a dirtier fuel the abatement is larger while if it displaces nothing it is smaller. State what the product displaces and what burning it emits."

Beside the blocked net, the flare's gross CO2e is still reported, as grossClaimIfNoCounterfactual: 215946.438 t/yr on EGBEMA, the claim the engine will not make.

## What a blocked net does downstream

A null net carries into the credit test of module 5. With no net abatement, creditSensitivity refuses: "No net abatement to sell. Declare the counterfactual first: a credit computed from a gross flare figure is a credit that cannot be issued."

In the bid table, the three routes with no counterfactual declared print none declared in the net abatement column. Only the CNG route, with its diesel counterfactual, prints a net: 218032.865.

In the panel, clear the GWP, then the recovery, then the displaced fuel, and read blockedBy after each change. Then type them back in the order blockedBy asks for.

## Exercise

Read the five blocked probes. Group them by the blockedBy text they print and name the input each text points at. Then quote what creditSensitivity answers when there is no net abatement, and give the figure the engine still reports beside a blocked net, with its field name.
