# Only the recovered share is avoided

The first term of the net abatement is the avoided flare. A route avoids the flare only for the gas it recovers.

{{panel:gasvalue-route-explorer}}

## The rule

The CNG route recovers 0.88 of EGBEMA's flare. The gas it does not recover is still flared, so the avoided flare CO2e is the flare's CO2e times the recovery.

| route | flareCo2eTonnes | recoveryFraction | avoidedFlareCo2eTonnes |
| --- | --- | --- | --- |
| Compressed natural gas | 215946.438 | 0.88 | 190032.865 |
| Gas to power or gas to wire | 215946.438 | 0.94 | 202989.652 |

Both rows start from the same flare, 215946.438 t/yr of CO2e. The CNG route recovers 0.88 of it and avoids 190032.865 t/yr. Gas to power recovers 0.94 and avoids 202989.652 t/yr. The recovery is the same figure each route typed for its year in module 3, where it set the product.

## The same recovery on every counterfactual

The avoided flare depends on the flare and the recovery. It does not change with the counterfactual. On the three CNG counterfactuals it prints the same figure every time:

| counterfactual | flareCo2eTonnes | recoveryFraction | avoidedFlareCo2eTonnes |
| --- | --- | --- | --- |
| CNG displacing diesel in haulage trucks | 215946.438 | 0.88 | 190032.865 |
| CNG displacing pipeline gas already burned | 215946.438 | 0.88 | 190032.865 |
| CNG sold into a market that burned nothing | 215946.438 | 0.88 | 190032.865 |

The counterfactual moves the other two terms: what burning the product emits and what the product displaces. The avoided flare stays at 190032.865 on all three rows.

## The trap this tier is built on

Count the whole flare as avoided at a plant that recovers part of it, and the figure is the gross flare, 215946.438 t/yr on EGBEMA. The engine does not count it as avoided. The CNG route's avoided flare is 190032.865 t/yr, the flare times 0.88, and that is the figure the net abatement starts from.

The gross figure still appears in the output. It is reported beside a blocked net as grossClaimIfNoCounterfactual: the claim the engine will not make. The first term of the net is the avoided flare.

The unrecovered gas appears only as a rule: gas the plant does not recover is still flared. The course prints no separate tonnage for the unrecovered gas, and this lesson computes none.

## A recovery the net cannot use

When the recovery is missing or out of range, abatement blocks the net. It names the missing input in blockedBy:

| probe | netAbatementTonnesCo2ePerYear | blockedBy |
| --- | --- | --- |
| no recovery fraction | null | no recovery fraction in (0, 1]: gas the plant does not recover is still flared |
| recovery 1.5 | null | no recovery fraction in (0, 1]: gas the plant does not recover is still flared |

The interval is the same (0, 1] routeEconomics uses. The blockedBy text restates the rule of this lesson in the engine's own words: gas the plant does not recover is still flared.

The two engines are probed at different recoveries. routeEconomics refuses a CNG recovery of 0, 1.2 or blank: the route "needs a recovery fraction in (0, 1]." abatement, with no recovery or with 1.5, returns a net of null and names the reason in blockedBy.

## Reading the avoided flare with the year

A route's recovery appears in two places in this tier. In the route's year, productPerYear is mscfPerYear times the yield times the recovery: 43345500.0000 kg of CNG on EGBEMA. In the abatement, the avoided flare is the flare's CO2e times the recovery: 190032.865 t/yr. The same 0.88 sets both. Gas to power reads the same way: its recovery of 0.94 sits in a year of 212733.7500 MWh and in an avoided flare of 202989.652 t/yr.

In the panel, lower the CNG recovery and read the avoided flare and the product change together. Then type 1.5 and read blockedBy.

## Exercise

Read the CNG and gas to power rows of the avoided flare. Give each route's recovery and avoided flare CO2e, and state the rule that connects them to the flare's CO2e. Then quote the blockedBy text for a recovery of 1.5, and say what the CNG route's avoided flare prints on each of its three counterfactuals.
