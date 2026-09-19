# The eight-hour chemical TWA

{{panel:hy-protection-chemicals}}

The worked example of 29 CFR 1910.1000(d)(1) is 150.000000 ppm for 2.000000 h, 75.000000 ppm for 2.000000 h and 50.000000 ppm for 4.000000 h. Its 8-hour TWA is 81.250000 ppm, and the engine reproduces it. The regulation writes E = (C_a T_a + C_b T_b + ... + C_n T_n) / 8.

| sample | concentration, ppm | hours |
| --- | --- | --- |
| a | 150.000000 | 2.000000 |
| b | 75.000000 | 2.000000 |
| c | 50.000000 | 4.000000 |
| 8-hour TWA | 81.250000 | 8.000000 |

## An arithmetic average

The chemical TWA is a plain time weighted arithmetic mean. Each sample's concentration is multiplied by its hours, the products are added, and the sum is divided by 8. There is no logarithm and no exchange relation. That makes it the simplest average in this tier, and also the one most often confused with the noise exposure metrics beside it, which average energy on a decibel scale. Keep them apart: a chemical exposure of 81.250000 ppm is an arithmetic average of concentrations, and nothing about it behaves like a sound level.

## The divisor is always eight

The door `chemicalTwa8h` divides by 8 hours whatever the record covers. The engine measures the divisor as 8.000000000000 hours by asking for the TWA of 10 ppm for one hour and reading 10 over the answer. The judgement call J6 names the choice: the 8-hour chemical TWA always divides by 8 and warns under or over 8 hours. That is exactly what the regulation writes, and it is the same normaliser the daily noise exposure level uses.

## A full record reads one number

When the samples cover exactly eight hours, dividing by 8 and dividing by the hours covered are the same thing. The IGBOMOTORU full-shift record shows it: 38.000000 ppm for 2.500000 h, 64.000000 ppm for 1.250000 h, 22.000000 ppm for 3.000000 h and 15.000000 ppm for 1.250000 h. It covers 8.000000 hours, its 8-hour TWA is 32.468750 ppm, its average over the hours covered is 32.468750 ppm, and it carries no warning.

## Where this sits in the course

The limit a chemical TWA is compared with is always an input to the engine. This course types only public OSHA values, and it never quotes a licensed limit. The engine does not compare the TWA with a ceiling value, and has no door for one. The next lesson takes a record that covers less than eight hours, which is where the divisor stops being a formality.

## Exercise

From the table, multiply each concentration by its hours, add the three products and divide by 8, and check your answer against 81.250000 ppm. Then repeat the arithmetic for the IGBOMOTORU full-shift record and check it against 32.468750 ppm. Finally, state the hours each record covers and say why the full-shift record carries no warning.
