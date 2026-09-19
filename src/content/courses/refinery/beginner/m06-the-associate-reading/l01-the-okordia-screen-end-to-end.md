# The Okordia screen end to end

Five modules have taken the screen apart. This lesson puts OKORDIA back together in the order the screen builds it, from a quotation to a year of money, so you can read the whole screen as one chain.

{{panel:refinery-screen-explorer}}

## The chain

| step | what the screen uses | what it returns |
| --- | --- | --- |
| capital | quotation 64000000.00 for 5000 bpd, modular law | 64000000.00; 12800.00 per bpd |
| slate | hydroskimming yields, OKORDIA's prices | gross value per barrel of crude 83.7900 |
| throughput | 5000 bpd, 330 on-stream days, utilisation 0.9200 | 1518000.00 bbl a year |
| margin | 83.7900 less crude 76.0000 less variable cost 3.2000 | 4.5900 a barrel of crude |
| streams | 2 construction years, 20 operating years | 22 years; first producing year revenue 127193220.00 |

## Before the chain runs

The screen checks its boxes first. A blank crude cost, capital cost, capacity or operating cost is refused by name, with the instruction to enter 0 where the value really is zero. A utilisation outside 0 to 1 is refused with the example 0.9 for 90 percent, and on-stream days outside 1 to 366 are refused with the range. OKORDIA's inputs pass all of those checks, so every step below is answered.

## Capital

OKORDIA is screened at the reference size, so the capital is the quotation itself on either law, and the exponent does not matter here. At any other size it would, and the screen would show both laws with the exponent beside each. The exponents are defaults that a vendor's figures replace. The capital per bpd of 12800.00 is the figure to set against any cost per barrel a day quoted for a similar plant.

## Slate

Hydroskimming carries a crude distillation unit, a naphtha reformer and a diesel hydrotreater. Its yield row closes at 1.0000, its unpriced list reads none, and the loss of 0.0200 is carried as a yield with no value. All three check lines read clean, so the gross value of 83.7900 is a value of the whole barrel at fully priced products.

## Throughput

Capacity times on-stream days times utilisation. Firm supply sets utilisation to 0.9200 and adds no premium. The plant runs 1518000.00 bbl a year, where nameplate on every on-stream day would give 1650000.00 bbl.

## Margin

The gross value less the crude cost less the variable operating cost gives 4.5900 a barrel of crude. The fixed operating cost of 7500000.00 a year stays out of it and appears in the streams.

## Streams

Two construction years carry 32000000.00 of capex each. From year 2 the plant produces: a crude run of 1518000.00 bbl, revenue of 127193220.00, crude cost of 115368000.00, fixed opex of 7500000.00 and variable opex of 4857600.00 each year the table shows, through year 21.

## What to check when a figure looks wrong

Because every step feeds the next, a surprising figure at the end has a cause at one step. Revenue looks wrong: check the slate and the throughput. Crude cost looks wrong: check the crude price, the premium and the throughput. Capex looks wrong: check the quotation, the capacity, the exponent and the construction years. The chain is short enough to walk in a minute, and every link is on the panel.

## What the screen has decided

On firm supply, with these invented prices, OKORDIA's hydroskimming plant has a positive gross margin per barrel of crude. That earns it a valuation, which the Studio runs through the screening engine and the Economics courses teach. It has not yet been read under the supply that makes these projects hard, and that is the next lesson.

## Exercise

Starting from the quotation of 64000000.00 for 5000 bpd, write the chain for OKORDIA in five lines: the capital, the gross value per barrel of crude, the annual throughput, the gross margin per barrel and the first producing year's revenue. For each line, name the inputs it uses and quote the figure the screen returns.
