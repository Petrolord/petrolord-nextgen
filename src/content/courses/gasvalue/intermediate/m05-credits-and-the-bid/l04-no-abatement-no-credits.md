# No abatement, no credits

A credit is sold on a net abatement. creditSensitivity refuses when there is none to sell, and it answers without a verdict when it lacks a margin or a hurdle.

{{panel:gasvalue-route-explorer}}

## What creditSensitivity refuses, and what it answers without a verdict

| probe | engine |
| --- | --- |
| the gas-to-power counterfactual, which adds emissions | REFUSED: The net abatement is -2010.348 tCO2e a year: the project does not abate, so there are no credits to sell. |
| no net abatement (the counterfactual undeclared) | REFUSED: No net abatement to sell. Declare the counterfactual first: a credit computed from a gross flare figure is a credit that cannot be issued. |
| a hurdle that is not a number ('x') | REFUSED: The hurdle margin must be a number. |
| no margin for the route (price missing) | answers with no verdict: breakevenCreditPrice null; "No margin for this route, so whether it needs credits cannot be said. Supply its price and costs." |
| hurdle left blank ('') | answers with no verdict: breakevenCreditPrice null; "No hurdle margin, so whether it needs credits cannot be said." |

Three probes are refused. Two are answered with no verdict and a null breakeven.

## A net below zero

The gas to power route's counterfactual, "Gas to power for a new load that burned nothing", gives a net abatement of -2010.348 t/yr. Module 4 read it: the avoided flare of 202989.652, less a product combustion of 205000, with nothing displaced. The net is below zero: this route adds emissions.

creditSensitivity refuses it, and the refusal quotes the net: "The net abatement is -2010.348 tCO2e a year: the project does not abate, so there are no credits to sell." The route still has a year. Its gross margin is 7540432.50 and its capital is 32753824.67. It has no credits.

In the EGBEMA bid table of the next lesson, the gas to power row prints none declared in its net abatement column. The -2010.348 belongs to the counterfactual probe read here, and the bid study carries a declared counterfactual on the CNG route alone.

## No net at all

With the counterfactual undeclared, the net abatement is null, and creditSensitivity refuses: "No net abatement to sell. Declare the counterfactual first: a credit computed from a gross flare figure is a credit that cannot be issued."

The gross flare, 215946.438 t/yr on EGBEMA, is still printed beside a blocked net as grossClaimIfNoCounterfactual. The refusal says what a credit computed from a gross flare figure is: "a credit that cannot be issued."

## A hurdle that is not a number, and a hurdle left blank

The hurdle is typed two wrong ways in the probes. Typed as 'x', it is refused: "The hurdle margin must be a number." Left blank (''), it is answered with no verdict, a null breakeven, and "No hurdle margin, so whether it needs credits cannot be said."

The two probes print two different answers. A value that is not a number is refused. A blank box is answered with no verdict. Neither gives a breakeven.

## No margin

With the route's price missing, there is no margin. creditSensitivity answers with no verdict and a null breakeven, and it names what to supply: "Supply its price and costs."

## Reading the five together

Every probe here ends without a breakeven figure. Three end in a refusal and two in a null with a sentence that says what is missing.

In the panel, pick the gas to power route with its counterfactual and open the credit test to read the refusal. Then declare no counterfactual on the CNG route and read the second refusal.

## Exercise

Read the five probes. Say which three are refused and which two are answered with no verdict, and quote the engine's words for each of the two hurdle probes. Then quote the refusal for the gas to power counterfactual, and give the net abatement it names.
