# Exclusions and the band edge

{{panel:joa-account-calculator}}

Two details decide whether an overhead charge is right to the dollar: what is taken out of the base before the scale is applied, and what happens to a base that lands exactly on a band's upper limit. This lesson works both, and the refusals that guard a scale.

## Exclusions

An agreement can state costs in a category that carry no overhead, such as the area fees and CO2 duty of the Norwegian worked case below. The engine takes them out of the base before the scale is applied, and only as stated. On the Ekene 2031 terms, 2000000.000000 of operating cost is excluded, so the operating base is 58000000.000000 on a cost of 60000000.000000.

A worked case states the Norwegian scale in NOK million with 150 of area fees and CO2 duty excluded from an operating cost of 1000. The engine's reason:

> operating: base 850 (cost 1000 less exclusions 150); 2.7% of 850 = 22.95

The reduced base sits inside the first band, at 2.7%.

An exclusion cannot exceed its category's cost, and it must name a category that exists:

> excluded.operating must be at or below the cost of the category 10; got 11

> excluded.drilling is not a cost category; the categories are operating

## The band edge

A base exactly at a band's upper limit is charged in that band only. A worked case states an operating base of 1000 on a scale whose first band ends at 1000, at 2.7%:

> operating: base 1000; 2.7% of 1000 = 27

The engine charges 1000.000000 in the first band and 0.000000 in the second, a total of 27.000000. A base of nothing charges nothing:

> operating: base 0; nothing to charge = 0

## What the engine refuses in a scale

Each band's upper limit must be above the one before:

> scale.operating.bands[1].upTo must be above the previous band's upTo 100; got 100

The rate above the last band must be stated, even as zero:

> scale.operating.abovePct must be a number from 0 to 100; got nothing

And a band reads only `upTo` and `pct`, so a rate typed under another name is refused:

> scale.operating.bands[0].rate is not an accepted key; the accepted keys of scale.operating.bands[0] are upTo, pct

## What the scale does not do

The Norwegian text moves its band limits every year with the consumer price index:

> "The intervals above will be adjusted at the beginning of each Year on the basis of the consumer price index as published by Statistics Norway per 15 July of the current year." (Norway Accounting Agreement Art. 2.2.2)

The engine does no index adjustment of a scale. It applies the limits you state, so a later year's scale is stated with that year's limits.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Operator overhead". Start from "The Ekene 2031 overhead" and run it. In the box, raise the operating `excluded` figure until the operating base sits exactly on its first band's upper limit, run it, and read the charge in each operating band. Then set the second operating band's `upTo` equal to the first band's and read the refusal. Restore it, delete `abovePct` from the operating scale, and write down the field each refusal named.
