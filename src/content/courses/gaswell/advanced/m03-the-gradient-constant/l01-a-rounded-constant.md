# A rounded constant

`plungerLift.PSI_PER_FT_SG` is 0.4330000000000 psi/ft per unit specific gravity. The quantity it stands for is 0.4335275040010, and the gap is not a modelling choice.

{{panel:pd-remedy-explorer}}

## Where the exact number comes from

It is one thousand kilograms per cubic metre times g, expressed in psi per foot per unit specific gravity, and it is built from three conversion constants and nothing else.

| Step | Value |
| --- | --- |
| 1000.0 kg/m3 times g of 9.80665 m/s2 | 9806.650000 Pa/m |
| times 0.3048 m per ft | 2989.066920 Pa/ft |
| divided by 6894.757293168 Pa per psi | 0.4335275040010 psi/ft per unit SG |

Nothing in that chain is a correlation or a fit. There is no water sample, no temperature, no salinity. It is a unit conversion, and it has one right answer.

## The size of the gap

The shipped constant is 0.4330000000000. Exact minus rounded is 0.0005275040010 psi/ft per unit SG, exact over rounded is 1.0012182540439, and the rounding is 0.1216771707 percent of the exact value and 0.1218254044 percent of the rounded one. It is a fixed percentage, so it never cancels and never grows relative to what it sits on.

## What the golden publishes

The published plunger case carries a 200.0 ft slug of 1.02 SG liquid. The oracle, working in SI throughout, publishes 88.4396108162 psi for that slug. The engine, using 0.433, returns 88.3320000000 psi. The cost on the slug is 0.1076108162 psi and the cost on the required lift pressure is 0.1076454958 psi, which is 0.04763796 percent of it.

That is the interesting part. The golden publishes a number the shipped engine cannot produce, and the gate that checks the engine against the golden loosens that one assertion to a relative tolerance of 5e-3, which is 4.109234 times the disagreement it is covering. The disagreement is not hidden. It is accommodated.

## The mistake

Calling the difference small and stopping there. Small compared with a lift pressure, yes. But the gate pins `PSI_PER_FT_SG` to 0.433 exactly while loosening the answer built on it, which means the constant is protected from change by the same test suite that knows it is wrong. A test that asserts a constant equals its current value is a test that a future correction has to be allowed to break, and nobody encountering it in isolation would know that.

## What it refuses

The plunger force balance is static. It has no friction unless friction is handed in, no velocity, no gas slippage past the plunger and no fallback of the slug during the rise. Against those refusals a tenth of a percent on the hydrostatic term is genuinely minor, and it is still the only term in the balance that could be exact and is not.

## Exercise

Rebuild 0.4335275040010 from 1000.0 kg/m3, 9.80665 m/s2, 0.3048 m per ft and 6894.757293168 Pa per psi.

Then compute the published 200.0 ft slug of 1.02 SG both ways and state the difference in psi.
