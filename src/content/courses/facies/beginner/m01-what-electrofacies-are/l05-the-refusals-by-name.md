# The refusals, each naming its field

{{panel:ef-cluster-explorer}}

When the engine cannot answer a call honestly it refuses it. A refusal is an object with two parts: an `error`, which is a sentence in the engine's own words, and a `field`, which names the exact input it refused. The sentence starts with the name of that field, so you can read what to fix without opening any code. A refusal carries no number of its own; any figure inside the sentence is part of the message. This lesson reads three refusals you will meet at this tier.

| what was passed | function | field named |
| --- | --- | --- |
| the 180 cored rows with row 40's RHOB null | `pca` | `X[40][1]` |
| one row | `pca` | `X` |
| no seed | `kmeans` | `seed` |

## A missing value

Take the 180 cored rows, blank the RHOB of row 40, and ask for principal components. The engine replies, in its own words:

> X[40][1] must be a finite number: fill or drop missing values first

The field names the row and the column, both counted from 0: row 40, column 1, which is RHOB in the order GR, RHOB, NPHI, PEF. The engine names the first row and column it meets, so a table with several gaps shows one of them at a time. It fills nothing. Filling a gap or dropping the row is a decision about the data that belongs to you, and conditioning logs is the data quality course's work.

## One row

Principal components describe how rows spread about their centre, and one row has no spread. Pass a single row to `pca` and it says:

> X must be an array of at least 2 rows

The field is `X`, the whole table, because the fault lies in its size and in no single entry.

## A seed left out

k-means draws its starting rows at random, from one seeded generator, so the same seed gives the same clusters on any machine. The engine takes no default seed. Leave it out and `kmeans` says:

> seed must be a whole number from 0 to 4294967295

A negative seed gets the same answer. The refusal forces every clustering to carry its seed, which is why this course never quotes a k-means result without one.

## A refusal against a warning

A refusal returns no result at all: no components, no clusters, no partial answer to be read by mistake. A warning is different. The engine returns a full result and adds a `warning` sentence beside it, for a result that is valid but needs a caution attached.

## Reading a refusal

Read the field first. It says where the fault is: a cell, a whole table, or a setting. Then read the sentence for what the engine needs instead. Correct the input and call again. Never work around a refusal by changing a setting you did not mean to change, because the new result then answers a different question.

## Exercise

Open the cluster explorer on the view "Principal components". In the table, find one RHOB value and replace it with null. Write down the field the engine names and check that its row and column count from 0. Then delete every row but one and read the refusal again. Finally open the view "k-means, start by start", clear the seed and read the refusal it shows. For each of the three, write down the input you would change to clear it.
