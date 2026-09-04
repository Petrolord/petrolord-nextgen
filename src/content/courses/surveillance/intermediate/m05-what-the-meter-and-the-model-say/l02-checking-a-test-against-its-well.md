# Checking a test against its well

`crossCheckTestsAgainstNodal` is the strongest test QC in the domain and the only one that needs something the field may not have: a well model. It asks what the well should flow at the pressure the test recorded, and compares.

{{panel:pd-exception-explorer}}

## One instrument, six tests, five statuses

The published case injects a solver as a stub and runs six tests against it. The instrument is a reservoir pressure of 2600.000000 psia, a productivity index of 1.8, outflow constants A of 950 and B of 0.00035, a `tolerancePct` of 35 and a `minRateStbd` of 1.

| Test | Status | Measured, stb/d | Nodal, stb/d | Deviation, per cent |
| --- | --- | --- | --- | --- |
| n-dead | dead | 700.000000000 | null | null |
| n-low | off | 600.000000000 | 1311.077593164 | -54.236118203180 |
| n-high | off | 1900.000000000 | 1311.077593164 | 44.918959023262 |
| n-nothp | no-thp | 1100.000000000 | null | null |
| n-nomodel | no-model | 800.000000000 | null | null |
| n-ok | ok | 1180.000000000 | 1311.077593164 | -9.997699132922 |

Those are producing-day rates in stb/d and not volumes. The five statuses are dead, off, no-thp, no-model and ok, ranked in that order, so a well the model says should not flow at all is read before anything is compared.

## The deviation is not symmetric

It divides by the nodal rate, so it says how far the test sits from the model and not how far the model sits from the test. n-low is -711.077593164 stb/d from the model and reads -54.236118203180 per cent; n-high is 588.922406836 stb/d from it and reads 44.918959023262 per cent. Divide the same two gaps by the measured rate instead and neither printed percentage is the one you get, and nothing in the returned row names the denominator.

## Two adjacent lines, two conventions

The water cut the check hands the solver falls back to the well model's own water cut when the test recorded no liquid. The gas-oil ratio on the very next line falls back to zero, a dead-oil column, rather than to the model's gas-oil ratio. A test that recorded a rate and no gas is therefore solved against a well the module has just decided makes no gas, and the deviation that comes back is compared with the same 35 per cent tolerance as any other.

## The mistake

Reading a null deviation as a passed check. Three of the six published tests return a null nodal rate and a null deviation, and each of them has a status naming the reason: no tubing head pressure, no model, or a model that says the well is dead. None of them is a verdict on the test.

## What it refuses

It will not guess a well model, will not guess a tubing head pressure, and will not compare below `minRateStbd`. `validateWellTests` is the check that runs without any of that, against the test's own duration, the well's test history and the ledger row on the test date, and the two never consult each other.

## Exercise

Write the measured rate, the nodal rate and the deviation for n-low and n-high.

Then say which rate each of those two percentages was divided by.
