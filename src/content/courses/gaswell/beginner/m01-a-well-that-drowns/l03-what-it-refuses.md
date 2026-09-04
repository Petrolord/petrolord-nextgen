# What it refuses

Some inputs come back with `ok = false` and no answer. Others come back with an answer that is not the one you asked for, and those are the dangerous ones.

## It refuses three things outright

| Input | Result |
| --- | --- |
| liquid density 2.0 lbm/ft3 below gas density 5.0 lbm/ft3 | ok = false, no velocity |
| sigma 0.0 dyne/cm | ok = false, no velocity |
| an unknown correlation name | ok = false, error `Unknown loading correlation "guess". Use turner or coleman.` |

A liquid lighter than the gas around it has no submerged weight to lift, and a liquid with no interfacial tension forms no droplet, so neither question has an answer to give. An empty traverse is refused in the same spirit rather than treated as a passing well. `velocityAtRate` with a zero flow area and `gasDensityLbFt3` at zero temperature both return nothing at all rather than a large number.

## It refuses to know what the well produces

There is no inflow performance anywhere in these modules. The gas rate is an input, so every loading verdict is a verdict at a rate somebody supplied and not a forecast. The flowing traverse is the same story: it is passed in as a list of stations with their own pressure, temperature, z and diameter. `loadingProfile` does not solve multiphase flow and does not invent a gradient, so the stations you get out are the stations you put in.

## It refuses to decide the correlation

`recommendCorrelation` takes one pressure and returns guidance. It does not switch the correlation for anybody, and it cannot see which station that pressure came from. `sizeTubingForRate` has the same blindness by design: it has no opinion about which station supplied its pressure, temperature and z, and it will size a string from any of them.

## What it does not refuse

An unknown fluid id falls back to water rather than refusing. Hand it a misspelled label and the module quietly selects 60.0 dyne/cm and 67.0 lbm/ft3, returns a perfectly good velocity for brine, and reports it under whatever name you asked for. Water is the harsher fluid of the two the module publishes, so the failure flags healthy wells as loaded rather than the reverse, which is why it can survive for years without anyone noticing.

## The mistake

Treating a returned number as evidence the inputs were understood. Two of the three refusals here concern physical impossibilities, which nobody types by accident. The realistic error is a typo in a fluid name or a pressure lifted from the wrong station, and neither of those produces `ok = false`. They produce a number with the full run of decimals on it.

## Exercise

Write the three inputs that return `ok = false` and say, for each, what has no answer rather than what was typed wrongly.

Then say what a misspelled fluid id returns, and which direction its verdict errs in.
