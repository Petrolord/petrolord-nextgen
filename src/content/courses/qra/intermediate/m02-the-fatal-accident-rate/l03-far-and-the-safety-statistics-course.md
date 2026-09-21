# FAR and the safety statistics course

{{panel:qr-societal}}

The academy already teaches a fatal accident rate. The safety statistics course computes it from fatalities that happened and hours that were worked, as an operator reports it to IOGP. This course computes a FAR from fatalities that are expected and hours that are planned. The two must use the same base, or a predicted FAR could never be set beside a recorded one, and the engine guarantees it by importing the base instead of restating it.

## One base, imported

The basis the engine returns names where the hundred million comes from, verbatim:

> engines/hse/safetyStats.js RATE_BASES.FAR_100M (IOGP: fatalities per 100,000,000 hours)

That is a declared choice. A second copy of the constant in this engine could drift from the first without anyone noticing, and a learner moving between the two courses would meet two definitions of the same word. One constant in one place means one FAR.

## Bit for bit

The engine's check is simple. A PLL of 2 over 4e+7 exposed hours, both stated, gives a FAR of 5.000000 through this engine. The safety statistics engine's fatal accident rate for 2 fatalities over the same hours also gives 5.000000.

| engine | numerator | hours, stated | FAR per 100,000,000 exposed hours |
| --- | --- | --- | --- |
| this engine | PLL of 2 per year | 4e+7 | 5.000000 |
| the safety statistics engine | 2 fatalities | 4e+7 | 5.000000 |

The two agree to the last bit, which is the only honest standard for a shared constant. Agreement to six decimals could hide a base that differed in a far digit; agreement bit for bit cannot.

## Counted and expected

The arithmetic is identical and the meaning is different. The safety statistics course counts deaths that happened: its numerator is a whole number from an incident register, and its FAR describes the past. This course counts deaths expected: its numerator is a PLL, a sum of frequency times expected deaths that need not be whole, and its FAR describes a design or an operation as assessed. Comparing the two for one installation is a useful check on an assessment. A predicted FAR far below the recorded one suggests scenarios missing from the model; one far above suggests pessimistic inputs.

## Two golden cases

The engine's golden set carries two FAR cases, which the engine reproduces: platform, 1.312785, and whole-count, 12.000000. Both come from the golden file the engine's independent oracle wrote, so each is a second, separate computation of the same division on the same base. They confirm that the engine does what its model string declares, and a reader should quote them as that kind of check.

## Exercise

Using the check above, compute by hand the FAR for a PLL of 2 per year over 4e+7 exposed hours and confirm the 5.000000 both engines return. Then say what a recorded FAR would have to be, beside the JISIKE crew's assessed FAR of 2.016667, for you to suspect that the assessment has missed scenarios.
