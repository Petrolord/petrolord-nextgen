# Ties and the listed order

{{panel:pf-uncertainty-explorer}}

Two methods can score the same, and a ranking still has to put one first. The engine's rule, stated in its basis and its defaults: values within a relative band of each other keep the order the methods were listed in, with arps last.

## Why a band, and how wide

Decimal rates are not exact in binary floating point. Two metrics that are equal on paper can differ in their last bits after the arithmetic, and a ranking decided by those bits would be decided by rounding. The engine therefore treats two metrics as tied when they are within `RANK_TIE_REL`, 1.00e-12, of each other, relative. Inside the band the ranking keeps the listed order: the methods in the order you gave them, then arps.

The fit has a band of the same size for the same reason: on the coarse grid a later point replaces the best only when its SSE is below best x (1 - 1.00e-12), so a tie keeps the earlier grid point.

## A tie on purpose: the constant series

The engine's golden case `cmp-constant-ties` is a constant rate of 50 for 10 months, with the methods listed damped, ses, holt and ranked by mae. Every smoothing method forecasts a constant exactly, so every smoothing MAE is 0 and all three are tied. The ranking is the listed order: damped, ses, holt. Arps cannot fit a flat series, so its row carries an error and it is unranked.

List the same methods in another order and the tie resolves in that order. Nothing about the methods changed; only the listing did. When a ranking matches the listed order exactly, check whether the metrics were tied.

## Without a tie, the listing changes nothing

On EKENE-P1 from first origin 30, horizon 6, step 3, the ranking by MASE is arps, damped, holt, ses. List the methods damped, holt, ses and the ranking is the same, arps, damped, holt, ses. Where the metrics differ by more than the band, the metric decides and the listing is ignored.

## Printed alike is not tied

Two metrics that print alike at six decimals can still differ by more than 1.00e-12 relative, and then they are not tied: the smaller ranks first, whatever the listing. Read the ranking the engine returns, and never infer a tie from a printed table.

## The list itself has rules

An empty list, a method the engine does not offer and a method listed twice are each refused, naming the field:

> methods must be a non-empty array of 'ses', 'holt' and 'damped'

> methods[1] must be 'ses', 'holt' or 'damped'

> methods[2] repeats ses

The field names the position in the list, counted from 0, so `methods[2]` is the third method listed. arps is never listed: the engine always adds it, and always last.

## Exercise

Open "Methods ranked against Arps" and type a constant series of 50 for 10 months. List the methods damped, ses, holt, rank by mae, and read the ranking and the unranked list. Change the order to holt, damped, ses and read them again. Then start from EKENE-P1 with first origin 30, horizon 6 and step 3, list the methods in two different orders, and say in one sentence why the ranking did not move.
