# Handing in a mass that is wrong

Multiply every well stream mass by any factor you like. The module propagates it, returns `ok` true, and says nothing.

{{panel:pd-fight-explorer}}

## The sweep

The teaching network AGBADA WEST, solved once and left alone. Only the masses attached to the four well streams are scaled, so the pressures, the flows and the well rates are identical on every row. The solved trunk is 12955.677151 lb/d throughout.

| Mass multiplier | Trunk stream mass, lb/d | ok | Warnings |
| --- | --- | --- | --- |
| 0.80 | 10640.541721 | true | none |
| 0.90 | 11970.609436 | true | none |
| 1.00 | 13300.677151 | true | none |
| 1.10 | 14630.744866 | true | none |
| 1.25 | 16625.846439 | true | none |
| 2.00 | 26601.354302 | true | none |

Note the row in the middle. At a multiplier of 1.00, the honest one, the trunk stream is still 13300.677151 lb/d against a solved trunk of 12955.677151 lb/d, because the caller handing in the truth is not the same thing as the solve delivering it. There is no multiplier on this network at which the two agree.

## The components do not move

At a doubled mass the separator is told oil 3455.000000000 stb/d, against 3455.000000000 stb/d at the honest mass, a difference of 0.0000e+0 stb/d. The split at a junction is by mass SHARE and the shares are unchanged when every mass scales together, so oil, water and gas come through untouched. Every ratio a reader would compute from those component rates is also untouched. The one number that moved by a factor of two is the one nobody reconciles.

## Why nothing catches it

`wellStreams[id].massLbD` arrives from the caller and is never compared with `wellRates[id]`. `buildNetwork` refuses eleven distinct malformed networks with `ok` false and a reason, so a caller is trained to key on `ok`, and `ok` here is true on every row. There is no independent referee either: `oracle_network.py` never propagates a stream at all, so the only thing standing behind this function is the engine gate, and the gate asserts the component arithmetic rather than the mass.

## The mistake

Treating a stream result as validated because the solve it was run on was validated. The solve on this network reports `converged` true, 11 iterations, `residualLbD` 1.546141e-11 lb/d and `pinned` t4, while `checkConservation` on that same answer reports produced 13300.677150912 lb/d, delivered 12955.677150912 lb/d, gap 345.000000000 lb/d, 2.593852900 percent. A clean solve does not make the masses beside it clean, and a factor of 2.00 on the input passes just as quietly as a factor of 1.00.

## Exercise

Run the propagation at multipliers of 0.80 and 2.00 and record the trunk stream mass, `ok` and the warnings at each. Then write the separator oil at both, and say what that tells you about which quantities in a stream result are worth reconciling.
