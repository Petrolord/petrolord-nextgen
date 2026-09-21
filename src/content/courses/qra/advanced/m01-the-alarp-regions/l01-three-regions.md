# Three regions

{{panel:qr-alarp}}

An individual risk on its own is a number per year. It becomes a decision only when it is set against limits, and the limits this tier uses come from UK HSE, Reducing risks, protecting people (2001), known as R2P2. R2P2 divides individual risk into three regions. The engine's `alarpBand` takes a stated individual risk and a set of limits, and returns the region it falls in, the boundary it touched, and its ratio to both limits. This lesson walks the regions with the worker preset.

## The three regions

Above the upper limit an individual risk is UNACCEPTABLE whatever the benefit of the activity. At or below the lower limit it is BROADLY_ACCEPTABLE. Between the two it is TOLERABLE, and only if it has been reduced as low as reasonably practicable, which is what ALARP stands for. When a stated individual risk lands in the middle region the engine sets `alarpDemonstrationRequired` to true. The engine's model string says it in its own words:

> UNACCEPTABLE if IR > upper; BROADLY_ACCEPTABLE if IR <= lower; TOLERABLE (reduce ALARP) between

For workers the preset puts the upper limit at 1e-3 per year and the lower limit at 1e-6 per year.

| individual risk per year, stated | workers band | ALARP demonstration required |
| --- | --- | --- |
| 1e-2 | UNACCEPTABLE | false |
| 5e-4 | TOLERABLE | true |
| 2e-5 | TOLERABLE | true |
| 5e-7 | BROADLY_ACCEPTABLE | false |

## Why the flag is false at both ends

At 1e-2 per year `false` is bad news: an UNACCEPTABLE individual risk lies outside the region where a demonstration can help, because no argument about cost makes it tolerable. The activity has to change until the individual risk falls to the upper limit or below. At 5e-7 per year the flag is false for the opposite reason. So always read the flag together with the band.

## The ratios beside the band

The engine returns two ratios with every band. For 2e-5 per year against the worker preset, the individual risk is 0.020000 of the upper limit and 20.000000 times the lower. Those two numbers say where inside the TOLERABLE region the individual risk sits, which the band word alone cannot say.

R2P2 says the limits are guidelines, to be applied with judgement. The engine applies them exactly, so the judgement is yours to write down beside its result.

## A call with no limits

The engine invents no threshold. A call to `alarpBand` with no thresholds is refused, and the refusal names the field:

> thresholds: a preset name or { unacceptableAbovePerYr, broadlyAcceptableAtOrBelowPerYr } is required

A caller names a preset or gives both limits.

## Exercise

Take 2e-5 per year and the two ratios the engine returned for it, 0.020000 and 20.000000. Multiply the upper limit of 1e-3 by the first ratio, and the lower limit of 1e-6 by the second, and check that both give back the stated individual risk. Then write the band and the demonstration flag for it, and write one sentence explaining to a site manager why the flag is also false at 1e-2 per year.
