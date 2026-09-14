# One average correlation

The portfolio engine takes one correlation, rho, and applies it to every pair of funded projects. rho is the correlation of the latent drivers behind success and behind the success spread, and the correlation it implies between two projects' success or failure events is lower than rho.

{{panel:ec-governance-explorer}}

## One number for every pair

rho is clamped to run from 0 to 1. The published clampAbove case asks for more than 1 and the engine uses 1.000000; clampBelow asks for less than 0 and the engine uses 0.000000.

On OKONO's 600.0000 set the same rho ties the workovers of OK-5 to the waterflood of OK-4 as tightly as it ties the infill drilling of OK-1 to the gas compression of OK-2. There is no matrix and no cluster.

## What rho correlates

Every iteration draws two shared normals, F1 and F2, and two of each project's own, e1 and e2. A project's success driver is z1 = sqrt(rho) F1 + sqrt(1 - rho) e1, and its success spread driver is z2 = sqrt(rho) F2 + sqrt(1 - rho) e2. Any two projects' z1 drivers correlate at exactly rho, and so do their z2 drivers. The drivers are latent: nobody observes them, only the outcomes they produce.

## The event correlation is lower

A project succeeds when normalCDF(z1) is below pos. That test turns a continuous driver into a yes or a no, and discards how far past the threshold the driver fell. Two drivers correlated at rho produce two success events correlated less than rho, except at 0, where both are independent. At 1 every z1 is F1 itself, so the less likely project never succeeds without the more likely one, and the event correlation reaches 1 only when both share the same pos. The engine does not report the event correlation that a given rho implies.

At rho 1 three identical wildcats succeed or fail together: comonotoneIdentical3 has an exact P(loss) of 0.700000, the same as a single wildcat.

## The mistake

The mistake is to type an observed correlation of outcomes into rho. Suppose a team has measured how closely two plays' successes and failures move together. Because the event correlation is lower than the latent rho that produces it, entering that measured figure as rho builds a portfolio whose events move together less than the ones observed, and its P(loss) and P90 come out too comfortable. rho asks for the correlation of the hidden drivers, which is the larger number.

## What it refuses

A negative correlation is clamped to 0.000000, so a project that does well when the others do badly cannot be represented as a hedge. One project has nothing to correlate with: the published singleProject case uses correlation 0.900000 and reports stdDev 46.8183, which no value of rho can change. The Suite's correlation slider stops at 0.9, a finding left unrepaired, so rho 1.000000 is reachable through the engine but not from the slider.

## Exercise

Write the two driver equations for one project and say which terms every project shares. Then explain why the correlation between two projects' success events is lower than rho, name the two values of rho where it is not, and say what the engine does with a requested correlation below 0.
