# Formation volume factor

Three volume factors do the conversion, and they are not three versions of the same idea. Two are near one, and the third turns a number in scf into a number in barrels.

{{panel:pd-lift-explorer}}

## The three of them

| Case | Bo, rb/stb | Bw, rb/stb | Bg, rb/scf |
| --- | --- | --- | --- |
| gassyOffshore, published | 1.2000 | 1.0200 | 0.001200 |
| highWaterCut, published | 1.1200 | 1.0100 | 0.001800 |
| QUA-IBOE-4, teaching | 1.2500 | 1.0300 | 0.001400 |

Bo is the lever on an oil well. It takes 1200.0 stb/d to 1440.000000 bbl/d on the published golden design gassyOffshore and 1400.0 stb/d to 1750.000000 bbl/d on the teaching well QUA-IBOE-4, which is not a published case. Bw barely moves anything: 3600.000000 stb/d of water becomes 3636.000000 bbl/d at 1.0100.

## Bg is a different animal

Bg is not a swelling factor, it is a unit change with a very large ratio inside it. On QUA-IBOE-4, 630000.00 scf/d at 0.001400 rb/scf becomes 882.000000 bbl/d at the intake, which is more gas volume than the 776.461538 bbl/d of water on the same well. A gas stream that looks trivial in standard volume can be the largest phase at depth.

It also swings hardest across cases: 0.001200, 0.001400 and 0.001800 rb/scf on three different fluids at three different intake conditions. These are three separate reservoirs, so the spread is not a pressure trend anybody can read off, which is exactly why the module will not guess it.

## Where they must be evaluated

At the intake, at 1340.0000 psia on gassyOffshore, 932.0000 psia on highWaterCut and 1432.0000 psia on QUA-IBOE-4. A Bo lifted from a reservoir condition table is evaluated at the wrong pressure, and a Bg from a different depth is wrong by a factor rather than by a few percent.

## The mistake

Bringing a volume factor set down from the reservoir. On an oil well the Bo error is quiet and the design is a little wrong. The Bg error is loud, because Bg is the number multiplying a quantity that is thousands of times larger than everything around it, so it moves the free gas at depth, the gas volume fraction, the mixture density, the gradient, the head and the verdict all at once.

## What it refuses

There is no black oil correlation in this module and there is no attempt to build one. Bo, Bw, Bg, the solution gas and the three densities are supplied by the caller and used exactly as given. Nothing checks them against the intake pressure it just computed, so a consistent looking design can rest on a PVT set from the wrong depth without a single flag.

## Exercise

Convert each phase from tank rate to rate at depth for the three cases, and confirm the three totals in the panel.

Then take QUA-IBOE-4 and say which of its three volume factors, changed alone, moves the gas volume fraction through the pump.
