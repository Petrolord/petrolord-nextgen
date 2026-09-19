# What the basis block tells you

{{panel:ss-rates-explorer}}

Every result the engine returns carries a `basis` object beside the number. On UGHELLI's recordables the rate is 0.776317 and the basis block says the base was 200000 and the formula was count x base / exposureHours. It is the part of the answer that says what the number means, and it differs from function to function.

| function | basis keys | base | formula |
| --- | --- | --- | --- |
| `incidenceRate` | base, baseLabel, formula | 200000 | count x base / exposureHours |
| `fatalAccidentRate` | base, baseLabel, formula, standard | 100000000 | fatalities x 100,000,000 / exposureHours |
| `severityRate` | base, baseLabel, formula, note | 200000 | daysLost x base / exposureHours |
| `pseRate` | base, baseLabel, formula, standard | 200000 | Tier 1 PSE count x base / total work hours |
| `pooledRate` | base, baseLabel, formula, note | 200000 | sum(counts) x base / sum(exposureHours) |
| `rollingRate` | base, baseLabel, windowPeriods, formula, note | 200000 | sum(counts in window) x base / sum(exposureHours in window) |

## The keys every block has

Three keys appear in every row. The `base` is the number of hours the rate is expressed per. The `baseLabel` names it in words, for example "per 1,000,000 hours (IOGP)". The `formula` says how the rate was built. Together they answer the first question any reader should ask of a safety rate: per what?

A report that copies the rate and drops the basis block has thrown away the answer to that question. UGHELLI's 0.776317 on the OSHA base and 3.881586 on the IOGP base are the same safety record, and only the base tells a reader which one is in front of them.

## The keys only some blocks have

The others are specific to one kind of result, and each one records a choice this tier has taught.

The `standard` key appears on the FAR and the PSE rate, the two rates with an outside definition. The FAR's reads "IOGP safety performance indicators, FAR". The PSE rate's reads "API RP 754, API Guide to Reporting Process Safety Events section 3.3".

The `note` key appears on the severity rate and the pooled and rolling rates, the three results where a reader is most likely to assume something the engine did not do. The severity rate's note says no ANSI Z16.1 time charges are added. The pooled rate's note says the mean of the period rates is not the pooled rate, and the rolling rate's says the mean is for comparison only and leaves out periods with no hours.

The `windowPeriods` key appears on the rolling rate, so the length of the window travels with the answer.

## Reading a block

Read the basis block before the number. Check the base against the base you meant. Check the formula against the quantity you meant: days over hours for a severity rate, summed counts over summed hours for a pooled one. Read the note if there is one, because it is the engine telling you the most likely misreading. Then read the number.

This habit costs a few seconds and prevents every mistake in module two. The factor of five between OSHA TRIR and IOGP TRIR cannot survive a reader who reads the base first.

## Exercise

Open the rates explorer and compute UGHELLI's 96 days lost in 2318640 hours as a severity rate on the OSHA base. Confirm the rate reads 8.280716, then list the four keys of its basis block and copy the note word for word. Finally, recompute the same rate on the IOGP base and say which keys of the basis block changed and which stayed the same.
