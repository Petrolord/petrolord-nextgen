# The five dimensions the engine reports

{{panel:dq-checks-explorer}}

"Is this data any good?" is too broad a question to answer with one rule. The engine splits it into five narrower questions, which it calls dimensions, and exports their names in a fixed display order. Every check belongs to exactly one of them, and every flag it raises says something about that dimension and nothing else.

| order | dimension |
| --- | --- |
| 1 | completeness |
| 2 | validity |
| 3 | consistency |
| 4 | uniqueness |
| 5 | plausibility |

## Completeness: is it there

Completeness asks whether a value was recorded at all. Two functions answer it. `completeness` counts present values over n and raises one flag for each run of missing values. `coverage` asks what fraction of a depth or time interval is spanned by steps no longer than a stated `maxStep`. Module two works through both.

## Validity: could it be true at all

Validity asks whether a value can exist as written. `rangeCheck` compares values with a definitional limit keyed by unit, or with a minimum and maximum you supply. `indexCheck` looks at the depth or time index for missing entries, duplicates, reversals and irregular steps. `rateCheck` flags a negative rate and a positive rate while the well is shut in. Modules three and four cover these.

## Consistency: does it agree with itself

Consistency asks whether channels that should agree actually do. `cumulativeCheck` flags a cumulative that falls. `waterCutCheck` compares a reported water cut with water over oil plus water. `phaseSumCheck` compares parts with the total they should add to. `frozenRuns` finds a stretch where a value stays stuck. Module five takes each in turn.

## Uniqueness: is each thing named once

Uniqueness asks whether one real object hides under several names. `duplicateIdentifiers` compares well names exactly, after a stated normalisation, and within a small number of edits. Module six opens with it.

## Plausibility: which values stand apart

The fifth dimension asks a different kind of question: among values that are present, valid and consistent, which ones sit far from the rest, and by which measure? That is the Professional tier's question, and this tier leaves it alone. You can use every Associate check without it.

## Why split the question at all

One verdict on a whole file would hide where the trouble is. A log can be complete and still hold a value written in the wrong unit. A production sheet can pass every range check and still carry a cumulative that falls. Keeping the dimensions apart means a flag always points at one kind of problem.

It also keeps the tiers honest. This tier asks whether the data are fit to use, which is four of the five dimensions. The Professional tier owns plausibility. The Expert tier asks whether the process that makes the data has changed. Each tier's capstone grades only its own question.

## Exercise

Open the checks explorer and open its view menu. Five views are listed: is it there, is it valid, the depth or time index, does it agree with itself, and well names. Write down, for each view, which of the five dimensions it belongs to, using the function lists above. Two of the views belong to the same dimension; name it. Then say which of the five dimensions has no view in this explorer, and why this tier leaves it out.
