# A marginal sliding scale

{{panel:joa-account-calculator}}

An overhead scale charges a falling percentage as the base grows: a higher rate on the first part of the cost, a lower rate on the next part, and so on. The scale is marginal, like a tax band. Each rate applies only to the part of the base inside its band. This lesson works the Ekene 2031 scale band by band and the flat charge beside it.

## The rule

The engine's basis:

> base = annual cost - stated exclusions; the scale is marginal: each band's per cent on the part of the base inside the band, abovePct on the part above the last band; a flat percentage is a scale with no bands

A band is stated by its upper limit `upTo` and its rate `pct`. The part of the base above the last band is charged at `abovePct`, which you must also state, even if it is zero.

## The operating category

The Ekene operating base is 58000000.000000. The scale has two bands:

| band | from | up to | per cent | part of the base in it | charge |
| --- | --- | --- | --- | --- | --- |
| band 1 | 0.000000 | 50000000.000000 | 2.750000 | 50000000.000000 | 1375000.000000 |
| band 2 | 50000000.000000 | 125000000.000000 | 1.000000 | 8000000.000000 | 80000.000000 |
| above the last band | 125000000.000000 | none | 0.000000 | 0.000000 | 0.000000 |

The first band is full, so it takes 50000000.000000 of the base. The second takes the remaining 8000000.000000. The engine's reason writes the sum:

> operating: base 58000000 (cost 60000000 less exclusions 2000000); 2.75% of 50000000 + 1% of 8000000 = 1455000

The operating charge is 1455000.000000. Charging the whole base at the first band's rate, or at the rate of the band the base ends in, gives a different figure; the scale is marginal and the engine charges it band by band.

## Development and exploration

The development base of 150000000.000000 runs through three bands:

> development: base 150000000; 2.5% of 50000000 + 1% of 50000000 + 0.5% of 50000000 = 2000000

The exploration base of 5000000.000000 sits inside its first band:

> exploration: base 5000000; 2.5% of 5000000 = 125000

The total overhead for 2031 is 3580000.000000.

## The Norwegian scale, in NOK million

The Norwegian accounting agreement (Attachment B, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024) prints a development scale; a worked case states it on a base of 4000 NOK million. The text prints nothing above its last band, so the case states 0:

> development: base 4000; 2.5% of 1000 + 1% of 1000 + 0.5% of 1500 + 0% of 500 above 3500 = 42.5

## A flat charge

A flat percentage is a scale with no bands: the whole base is charged at `abovePct`. The Ekene fixture's corporate charge of 0.625000 percent on the three categories together gives 1343750.000000:

> exploration, operating and development: base 215000000; 0.625% of 215000000 = 1343750

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Operator overhead". Start from "The Ekene 2031 overhead" and run it; check the operating band table against the one above. Then choose the start "The Norwegian development scale, NOK million" and run it. In the box, change the development cost to 3000, run it, and write down the charge in each band and the total. Finally, change the cost to 1000 and write down which bands are charged.
