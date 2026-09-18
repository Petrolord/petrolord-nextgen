# The stream power caps it and floors it

The pressure ratio proposes a band. The stream power then has the right to overrule it in both directions, and the two probes where that happens are the reason the screen is worth running at all.

## The power thresholds

The stream power bands the engine exports are quiet at 1.000000 kW and loud at 1000.000000 kW. Stream power is a measure of the energy the gas gives up expanding through the valve, and this engine forms it from the mass flow, the absolute flowing temperature and the logarithm of the pressure ratio. It is the size of the energy stream the noise has to come out of.

## The two probes that moved

The engine reports that the stream power moved the band off the pressure ratio alone on 2 probes, counted over the 3 noise probes asked of the indication, with a probe counting when the engine returns a non-null power effect.

The first is the bleed. Its ratio is 12.000000 and its stream power is 0.00133650 kW, and the engine says:

> `held down to low: the stream power of 0.00134 kW is below 1 kW, and a trickle cannot be loud however hard it is throttled. On the pressure ratio alone this service would have read severe`

The second is the large flow. Its ratio is 1.898734 and its stream power is 34486.0 kW, and the engine says:

> `raised to moderate: the stream power of 34486.0 kW is above 1000 kW, which is not a quiet valve at any pressure ratio. On the pressure ratio alone this service would have read low`

The final bands tell the story on their own. The bleed ends at low with a ratio band of severe. The large flow ends at moderate with a ratio band of low.

## The probe that did not move

The third probe is a moderate station flow at a pressure ratio near six, with a ratio of 6.000000, a stream power of 2312.85 kW, a ratio band of high and a band of high. The engine names the two probes where the power moved the band and this is not one of them, so the screen is leaving the ratio's proposal where it found it.

## Why a screen needs two variables

A screen built on one variable can only be wrong in one direction at a time, and both directions matter here. Flagging a trickle as severe wastes a specialist's time and fills a register with entries nobody can close. Reporting a large transmission valve as low is the failure that ends with acoustic lagging missing from an estimate. Capping and flooring the ratio's proposal on stream power removes both of those failures with one extra input.

## Exercise

Write down the two stream power thresholds the engine exports, the stream power of each of the three probes, and the ratio band and final band of each. Then say which of the three the engine left where the ratio put it, and describe in one sentence the failure each of the two overrules prevents.
