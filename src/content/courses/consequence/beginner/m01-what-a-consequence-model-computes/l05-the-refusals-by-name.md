# The refusals, each naming its field

{{panel:cq-release}}

A refusal is the engine saying, in words, that it will not compute what you asked. Each one names the field that caused it and explains why. This lesson reads six refusals from the Associate functions, so that on the panel you already know what each means. Every message below is the engine's own `error` string, verbatim.

## A discharge coefficient above one

> dischargeCoefficient: must lie in (0, 1]: the YB recommends 0.62 for a sharp orifice

The field is `dischargeCoefficient`. A coefficient is the ratio of the real flow to the ideal Bernoulli flow, so a value above one would claim more liquid leaves the hole than the ideal equation allows. The message also carries the Yellow Book's recommendation for a sharp edged hole. A coefficient of exactly one is accepted as the ideal upper bound.

## An ullage below ambient and no head

> pressureAboveLiquidPa: the pressure at the hole does not exceed ambient, so nothing flows out

The field is `pressureAboveLiquidPa`. The pressure at the hole is the static head plus the pressure above the liquid. With no head and an ullage below ambient that sum cannot push liquid out, so there is no outflow to compute. A mass rate of zero could be mistaken for a small leak, so the engine says so in words. The gas function has its own form of the same edge:

> upstreamPressurePa: must exceed the ambient pressure, or nothing flows out

## No bund area and no thickness

> bundAreaM2: a bund area (confined pool) or a pool thickness (unconfined pool) is required: no spreading model is implemented

The field is `bundAreaM2`. A spill becomes a pool either by filling a bund floor or by lying at a thickness the analyst states. The engine has no model of a liquid spreading freely across open ground, and the message says exactly that. To proceed you supply one of the two inputs it names.

## Two refusals from the plume

The first comes from a wind speed of zero:

> windSpeedMS: must be above 0 m/s: the Gaussian plume divides by the wind speed and has no calm-air form

The field is `windSpeedMS`. The plume concentration is inversely proportional to the wind speed, so a still day sends the expression to infinity. A real calm needs a different model, and this engine carries none.

The second comes from a class the table does not carry:

> stabilityClass: must be a Pasquill-Gifford class, one of A, B, C, D, E, F

The field is `stabilityClass`. The Briggs table has six rows, and a letter outside them has no sigma coefficients. The message lists the six classes it does carry, so the correction is immediate.

## Exercise

Provoke each of these on the release explorer. On the outflow view, set the liquid discharge coefficient to any value above one and read the refusal. Restore 0.62, set the head to 0 and the pressure above the liquid to 101325 Pa, and read the next. On the pool view, clear both the bund floor area and the pool thickness. On the plume view, set the wind speed to 0. For each refusal, write down the field it named and the single input you would change to turn it back into a result.
