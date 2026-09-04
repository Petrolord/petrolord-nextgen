# What counts as a well on stream

Every field day carries a `wellsOn` count, and the test behind it is two clauses long. It never asks what a well is, only what a row says.

{{panel:pd-ledger-explorer}}

## The two clauses

A row counts as on stream when `(oil_stb + water_stb + gas_mscf) > 0` and `hours_on` is either null or above zero. Nothing else is consulted: not the well type, not the injection column, not whether the well appears on any other day.

The first clause adds two units together. Oil and water are stb and gas is Mscf, and the sum of the three becomes one boolean. It is harmless as a boolean, and it is the only place in this domain where a barrel and a thousand cubic feet are added.

## Five rows and what each one does to the count

Derived demonstration rows, each the smallest case that moves the branch:

| The row | wellsOn | Field oil, stb | Field winj, stb |
| --- | --- | --- | --- |
| A well making only gas | 1 | 0.000000 | 0.000000 |
| A well making only water | 1 | 0.000000 | 0.000000 |
| An injector taking 3000 stb | 0 | 0.000000 | 3000.000000 |
| A producer with volumes and zero hours | 0 | 900.000000 | 0.000000 |
| A well that filed a row of zeroes | 0 | 0.000000 | 0.000000 |

Read the fourth row twice. It puts 900.000000 stb of oil into the field oil total for the day and is not counted as on stream, because `hours_on` is zero and zero is not above zero. The volume and the count disagree by construction, and both are in the same returned object.

The third row is the mirror image. An injector taking 3000.000000 stb of water contributes its whole injection volume and counts as zero wells on, because injection is not one of the three columns in the first clause.

## It is not the same number as either well count

On the published surveillance case the field day of 2025-06-30 carries `wellsOn` of 3 while `computeKpis` on the same field reports `wellCount` of 7 and `producerCount` of 6. Three counts, three definitions, and none of them is a count of wells that made oil. A field day of 2025-06-28 on the same ledger carries `wellsOn` of 2.

## The mistake

Reading `wellsOn` as the number of producing wells and dividing the field oil by it. A gas-only row and a water-only row are each counted as one well on stream while contributing 0.000000 stb of oil, and a producer that booked oil against zero recorded hours is not counted at all.

## What it refuses to tell you

Which wells they were. The field point holds a date, four volumes, a liquid, two ratios and a count, and no well identity at all, so a `wellsOn` of 3 on a seven-well field cannot be turned back into three names without reading the ledger rows again.

## Exercise

Build the published field series in the panel and write down `wellsOn` on 2025-06-28 and on 2025-06-30.

Then say which of the two clauses rejects a producer that booked 900.000000 stb of oil.
