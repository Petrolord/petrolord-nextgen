# The implied cost of averting a fatality

{{panel:qr-alarp}}

The cost to benefit ratio compares a measure's cost with everything it prevents. A second figure answers a narrower question: what does this measure pay for each fatality it prevents? The engine calls it the ICAF, the implied cost of averting a fatality. R2P2 Appendix 3 paragraph 15 calls the same quantity the cost per fatality prevented, CPF, and the engine's own basis string uses that name.

## The definition

The ICAF is the present value of the cost over the number of fatalities prevented, where fatalities prevented = deltaPLL x the life in years, UNDISCOUNTED. The engine's basis model string carries it at its end:

> grossly disproportionate when cost / benefit > DF; benefit = (dPLL x VPF + other harms) per year over the life; CPF = cost / (dPLL x years)

For the EDIKAN firewall, deltaPLL is 2e-3 per year over a life of 20 years, so the fatalities prevented are 0.040000.

## The firewall's ICAF

| convention | fatalities prevented | present value of the cost | ICAF |
| --- | --- | --- | --- |
| undiscounted | 0.040000 | 350000.00 | 8750000.00 |
| the 2003 checklist limits | 0.040000 | 321062.02 | 8026550.41 |
| R2P2 Appendix 3 | 0.040000 | 307349.61 | 7683740.15 |

Only the cost changes from row to row. The number of fatalities prevented stays at 0.040000, because the engine counts it undiscounted, and the next lesson shows why that choice matters. As the cost is discounted, the ICAF falls: from 8750000.00 undiscounted to 7683740.15 under R2P2.

## Reading the ICAF against the VPF

An ICAF is read against the VPF the analyst stated. The firewall's VPF is 1000000, and its undiscounted ICAF is 8750000.00, so the measure pays many times the value of a prevented fatality for each one it prevents. A measure whose ICAF is below VPF times the DF passes the gross disproportion test when injuries add nothing to the benefit.

The firewall prevents fatalities only, so undiscounted its ICAF and its ratio tell the same story: 8750000.00 over a VPF of 1000000 is the ratio of 8.750000. Under a discounting convention the two part company, as the next lesson shows, and the ratio is the figure the verdict is read from.

## When injuries are in the benefit

With injuries in the benefit, compare the cost to benefit ratio with the DF. The ICAF alone leaves the injuries out: its denominator counts fatalities prevented and nothing else. A measure that prevents many serious injuries and few deaths can carry a high ICAF and still be reasonably practicable on its ratio. The ICAF is then reported beside the VPF as a comparison, and the verdict is read from the ratio, which carries every harm the measure prevents.

## Exercise

Take the undiscounted row: a present value of the cost of 350000.00 over 0.040000 fatalities prevented. Divide to check the ICAF of 8750000.00. Then set it beside the VPF of 1000000 and the DF of 3, and write one sentence saying whether the ICAF on its own would pass the firewall, given that the firewall prevents no injuries.
