# Measures that pay for themselves

The curve reports how much of its axis costs less than nothing. SECTION 20 prints two outputs for it: paysForItselfTonnes and paysForItselfMeasures. This lesson reads them on the six invented AGBOR measures, costed at the invented rate of 0.1 in US dollars, and reads the limit that SECTION 26 places on one of them.

{{panel:carbon-abatement-explorer}}

## The two outputs

| output | value |
| --- | --- |
| totalAbatementTonnes | 15460.000 |
| paysForItselfTonnes | 5310.000 |
| paysForItselfMeasures | Tune the fired heaters; Repair failed steam traps; Heat integration project |

The engine prints paysForItselfTonnes 5310.000 and names the three measures whose pays-for-itself flag is true. Those are the three measures with a negative cost per tonne: -167.4364, -156.4390 and -14.2492 USD a tonne. On the step chart they are orders 1, 2 and 3, and the cumulative end of order 3 is 5310.000 t, the same figure.

## Pays for itself, and abates as a side effect

SECTION 18 says what the flag means: a negative cost per tonne means the measure pays for itself and abates carbon as a side effect. So 5310.000 t a year of Agbor's abatement comes from measures whose savings cover their annualised capital and running cost. The other three measures, 1850.000, 2100.000 and 6200.000 t a year, carry positive costs.

The Heat integration project is in the list at -14.2492 USD a tonne, with 2750000 USD of capital levelised over 15 years at 0.1. Module one read the same measure at 688.2353 USD a tonne with the whole capital set against one year. That column is marked computed here, and SECTION 18 prints that the engine refuses to compare a one-off cost with a recurring saving. The list carries the levelised figure, -14.2492.

## Two of the three share a source

SECTION 20's interaction table names one source: heaters, with Tune the fired heaters and Heat integration project acting on it. Both are in paysForItselfMeasures. The interaction note says their abatements are not additive and the cumulative curve is an upper bound. So the 5310.000 t is a sum that includes two measures on one source. Module three takes that up.

## What no oracle recomputes

SECTION 26 lists paysForItselfTonnes among the outputs recomputed by neither oracle, beside carbonIntensity, the curve's residual to target, compositeCurve and the simple payback. The digest says they are taught from the engine and never graded. SECTION 18 prints what the flag reads: "A negative cost per tonne means the measure pays for itself". The cost per tonne is not on SECTION 26's list of outputs neither oracle recomputes. paysForItselfTonnes is on it, so 5310.000 t is taught as the engine prints it.

## Reading the list against the tonnes

Read paysForItselfTonnes beside totalAbatementTonnes: 5310.000 and 15460.000 t a year. SECTION 20 prints the first as a share of the second, computed here: 0.343467. The tonnes between 5310.000 and 15460.000 on the axis belong to the three measures with positive costs, Vapour recovery on the storage tanks, Solar for purchased power and Flare gas recovery, whose steps run from 5310.000 to 15460.000 t.

## Exercise

Read paysForItselfTonnes, the three measures in paysForItselfMeasures with their costs per tonne, and the cumulative end of order 3 on the curve. Say what the two tonne figures, read together, show about where the measures that pay for themselves sit on the axis, and what SECTION 26 says about how far to lean on paysForItselfTonnes.
