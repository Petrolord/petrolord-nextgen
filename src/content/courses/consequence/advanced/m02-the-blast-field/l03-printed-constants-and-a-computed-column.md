# Printed constants and a computed column

{{panel:cq-harm}}

A published paper can disagree with itself. The evidence behind this course's graded overpressure is a table from a 2020 conference paper, and that paper prints the Kinney and Graham formula with constants its own numbers do not follow. This lesson reads the column, names the discrepancy as a fact about the published source, and explains why the column, rather than the formula printed beside it, counts as evidence.

## The column

Five values from the paper's table, at an ambient of 101.325 kPa, against the engine (golden):

| golden case | engine kPa | printed kPa | relative difference |
| --- | --- | --- | --- |
| cbu-1kg-5m | 29.238107 | 29.24 | 6.47e-5 |
| cbu-0.5kg-5m | 19.626657 | 19.63 | 1.70e-4 |
| cbu-0.1kg-5m | 9.065697 | 9.066 | 3.34e-5 |
| cbu-0.1kg-2m | 38.707784 | 38.71 | 5.73e-5 |
| cbu-0.1kg-1m | 174.869459 | 174.87 | 3.09e-6 |

Every relative difference is at the size the paper's printed rounding allows. The printed values carry two or three decimals, and the engine's value rounds to each of them.

## The constants the paper prints

The paper PRINTS the formula with 800 and 0.049. Its own column follows 808 and 0.048. Those are the constants the engine uses, and two other sources print them. Look back at the engine's model string: "808[1+(Z/4.5)^2]" in the numerator and "sqrt(1+(Z/0.048)^2)" as the first factor of the denominator.

So the paper's formula and the paper's table cannot both be right, and the table is the one that agrees with the independent sources. This is an erratum in the published paper. It says nothing against the engine, which uses 808 and 0.048 and reproduces the column.

## Why the column is the evidence

A printed constant is a claim. A computed column is a test of the formula that actually produced it. When the two disagree, the numbers reveal which formula the authors really ran. The engine's golden labels this case PUBLISHED because its numbers reproduce; the label follows what reproduces, whatever the page printed beside it.

The engine's validation record names this table as SECONDARY. It is a single paper's worked column and a secondary printing of Kinney and Graham, and the course treats it with that weight: good enough to catch a transcription mistake copied into both the engine and its oracle, which is exactly what this course asks of the evidence behind a graded quantity.

## The habit this teaches

When you check a model against a published example, check the example's numbers against its own stated formula before you trust either. The Professional tier met the same habit in the Yellow Book pool fire, where a printed Froude number did not produce the printed tilt. In both cases the erratum belongs to the source, and the note says which printed item was set aside and why.

## Exercise

On the harm panel's blast view, reproduce the five rows of the column by entering each charge and distance the case name gives, and record the engine's overpressure in kPa beside the printed value. For the 0.1 kg at 1 m case, write one sentence stating whether the printed 174.87 kPa agrees with the engine to the paper's two decimals. Then write the two sentence erratum note you would attach to this table if you cited it in a report.
