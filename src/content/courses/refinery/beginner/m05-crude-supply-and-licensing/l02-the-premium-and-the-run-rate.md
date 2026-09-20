# The premium and the run rate

A supply scenario changes two things at once: how many barrels the plant runs and what it pays for each one. This lesson reads OKORDIA under all three scenarios, and it is built on one trap: a reader who applies only one of the two changes misses the margin.

{{panel:refinery-screen-explorer}}

## OKORDIA under each scenario

The premium is added to the crude cost before the streams are built, and the utilisation replaces the plant's:

| scenario | crude cost with premium | annual throughput (bbl) | gross margin per bbl | first operating year revenue | first operating year crude cost |
| --- | --- | --- | --- | --- | --- |
| firm | 76.0000 | 1518000.00 | 4.5900 | 127193220.00 | 115368000.00 |
| tight | 79.0000 | 1237500.00 | 1.5900 | 103690125.00 | 97762500.00 |
| disrupted | 82.0000 | 825000.00 | -1.4100 | 69126750.00 | 67650000.00 |

All three are hydroskimming at 5000 bpd and 330 on-stream days, with a gross value per barrel of crude of 83.7900 and a variable operating cost of 3.2000.

## Where each change lands

The two changes land on different figures, and the table lets you see which.

The premium lands on the margin. The gross margin per barrel is the gross value less the crude cost less the variable operating cost, and the premium goes into the crude cost. Utilisation is not in that formula. So the margin per barrel column is set by the premium alone: 4.5900, 1.5900 and -1.4100, as the crude cost reads 76.0000, 79.0000 and 82.0000.

The utilisation lands on the throughput. Annual throughput is capacity times on-stream days times utilisation, and the premium is not in that formula. So the throughput column is set by the utilisation alone: 1518000.00, 1237500.00 and 825000.00 bbl, as utilisation reads 0.9200, 0.7500 and 0.5000.

The annual money columns carry both. The first operating year revenue depends on how many barrels are run. The first operating year crude cost depends on how many barrels are bought and at what price. Both columns move under every scenario.

## The trap

Suppose a reader treats tight supply as a throughput problem only. They cut the run rate to 1237500.00 bbl and keep the firm margin of 4.5900. They have kept a margin the tight scenario does not give: the engine prints 1.5900.

Suppose instead they treat it as a price problem only. They take the margin of 1.5900 and keep the firm throughput of 1518000.00 bbl. They have run barrels the scenario does not supply: the engine prints 1237500.00 bbl.

Either way the year is wrong. The scenario is one choice that sets two inputs, and the only safe reading takes both from the engine's own row.

## The sign under disruption

Under disrupted supply the gross margin per barrel reads -1.4100. Every barrel run loses money before any fixed cost is paid, and running more barrels would lose more. That is a different kind of answer from a small margin. It says each barrel the hydroskimming plant runs under disruption, at these prices and this premium, costs more to buy and process than its products sell for. The note the engine attaches to that scenario says this is where most of these projects are actually decided, and the sign is why.

## The mistake

Applying the premium or the utilisation by hand to the firm case. Read the scenario's row instead. The engine applies both before building the streams, so its row is already consistent.

## Exercise

Read OKORDIA's firm and tight rows. Quote the crude cost with premium, the annual throughput and the gross margin per barrel for each. Then say which of those three figures the premium sets, which the utilisation sets, and which figure a reader who applied only the utilisation would have got wrong.
