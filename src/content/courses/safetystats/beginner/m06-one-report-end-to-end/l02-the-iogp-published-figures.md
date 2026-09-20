# The IOGP published figures

{{panel:ss-rates-explorer}}

IOGP published a fatal accident rate of 0.77 for 2024 and 0.82 for 2023. Given the golden counts and hours, the engine returns 0.769438 and 0.820324, both matching the golden with a relative difference of 0. The same 2024 hours with the 21 fatal incidents in place of the 32 fatalities give a fatal incident rate of 0.504944, a figure with no published value printed beside it in the golden.

| case | count | hours | engine | published |
| --- | --- | --- | --- | --- |
| IOGP 2024 FAR | 32 | 4158877000 | 0.769438 | 0.77 |
| IOGP 2023 FAR | 27 | 3291382000 | 0.820324 | 0.82 |
| IOGP 2024 FAR through incidenceRate on 100,000,000 | 32 | 4158877000 | 0.769438 | 0.77 |
| IOGP 2024 fatal incidents per 100,000,000 hours | 21 | 4158877000 | 0.504944 | none printed |

## What reproducing a published figure proves

The engine carries no benchmark rates of its own. The IOGP figures come from the vendored golden, where they are published inputs: a count, a number of hours and the rate IOGP printed. Putting the count and hours through the engine and landing on the printed rate shows that the engine's formula is the one IOGP used. It does not make the IOGP figure a target, and it does not say anything about any single company inside it.

The published values are printed to two decimals, 0.77 and 0.82. The engine prints six, 0.769438 and 0.820324. Round the engine figures to two decimals and they match. A report should quote the engine's figure with its count and hours, and may quote IOGP's rounded one beside it, labelled as the published value.

## The two functions agree

The third row of the table puts the 2024 fatalities through the general `incidenceRate` function with a base of 100,000,000 and gets the same 0.769438 that `fatalAccidentRate` returns. That is a check worth keeping in a report pack: the fixed base function and the general function, fed the same numbers, must agree. If they ever did not, one of the two inputs had been mistyped.

## The five year figure

IOGP also computes a five year rolling fatal accident rate, as the sum of fatalities over the sum of hours. For 2020 to 2024 the engine's figure is 0.826095, and the golden holds the same. The mean of the five yearly rates is 0.833228. A report quoting the five year view quotes 0.826095, because it is the rate over every hour worked in those years.

| IOGP five year view, 2020 to 2024 | value |
| --- | --- |
| sum then divide | 0.826095 |
| mean of the five yearly FARs | 0.833228 |

## Observed, and on its own base

Every figure here is an observed FAR, built from fatalities that happened over hours that were worked. Each is on the fixed 100,000,000 hour base, so they can be set beside each other directly. Setting a company's own figure beside them needs the same base and the same definition of the count, and how far such a comparison can be trusted is a question the later tiers of this course take up.

## Exercise

Open the rates explorer's FAR view and type 27 fatalities and 3291382000 hours. Confirm the engine returns 0.820324 and round it to two decimals to compare with the published 0.82. Then type the 2024 figures into the count view with a base of 100,000,000 and confirm the 0.769438. Finally, write one report line for the 2024 year that gives the engine's rate, the published rate, the count and the hours.
