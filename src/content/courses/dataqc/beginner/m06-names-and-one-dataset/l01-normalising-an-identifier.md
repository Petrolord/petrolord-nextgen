# Normalising an identifier

{{panel:dq-checks-explorer}}

The uniqueness dimension asks whether one real object hides under several names. For wells, it usually does. The Ekene well list below is three header lists concatenated: the drilling database, the production database and a consultant's spreadsheet, 13 names in all. Several of them are the same well written differently.

| entry | as written | normalised |
| --- | --- | --- |
| 0 | EKENE-1 | EKENE1 |
| 1 | EKENE-2 | EKENE2 |
| 2 | EKENE-3 | EKENE3 |
| 3 | EKENE-3 | EKENE3 |
| 4 | Ekene 3 | EKENE3 |
| 5 | EKENE-03 | EKENE3 |
| 6 | EKENE-4 | EKENE4 |
| 7 | EKNE-4 | EKNE4 |
| 8 | EKENE-7 | EKENE7 |
| 9 | EKENE 7 | EKENE7 |
| 10 | ÉKENE-7 | EKENE7 |
| 11 | EKENE-10 | EKENE10 |
| 12 | EKENE-12 | EKENE12 |

## The stated normalisation

`duplicateIdentifiers` compares names after a normalisation it states in full: NFKD, trim, upper case, keep A to Z and 0 to 9, and strip leading zeros in each digit group. Each step removes one kind of difference that the engine treats as not changing which well is meant.

NFKD is a Unicode decomposition. It splits an accented letter into the plain letter and a separate accent mark. The letter filter then drops the accent mark, so the accented entry 10 normalises to EKENE7. Trim removes spaces at the ends. Upper case makes "Ekene" and "EKENE" the same. Keeping only A to Z and 0 to 9 removes hyphens and spaces inside the name. Stripping leading zeros in each digit group makes "03" read as "3".

The normalisation is a choice, and it is written into the result so a reader can see exactly what was treated as the same.

## Three classes of pair

A pair is EXACT when the raw strings are equal, NORMALISED when the normalised forms are equal, and NEAR when the normalised forms are close, which the next lesson covers. A pair is reported under its strongest class only.

| kind | pairs |
| --- | --- |
| exact | 1 |
| normalised | 8 |
| near | 1 |

The one exact pair is entries 2 and 3, both written "EKENE-3". Its reason, verbatim:

> "EKENE-3" repeats entry 2 exactly

That pair also matches after normalisation, but it is reported once, as exact.

The eight normalised pairs are the four EKENE-3 entries matched with one another, less the exact pair, and the three EKENE-7 entries matched with one another. One reason, verbatim:

> "EKENE-3" and "EKENE-03" are the same after normalisation (EKENE3)

## One step, switched off

| setting, stated | exact | normalised | near |
| --- | --- | --- | --- |
| the defaults | 1 | 8 | 1 |
| stripLeadingZeros false | 1 | 5 | 1 |

With leading zeros kept, EKENE-03 normalises differently, and the pairs it made with the other spellings of EKENE-3 are no longer normalised pairs. The normalised count falls from 8 to 5 with one step switched off. It shows what a step buys: remove it, and some real duplicates go unreported.

## What the check will not do

It does not merge names or pick a preferred spelling. It reports pairs with their class and reason. Which spelling becomes the master record is a decision for whoever owns the well list. An empty list is refused, naming the field `ids`:

> ids must be a non-empty array of strings

## Exercise

Open the checks explorer on the well names view. The names box holds all 13 Ekene names. Read the Exact, Normalised and Near tiles and the box headed THE STATED NORMALISATION. Now delete the line "EKENE-03" and read the tiles again. Explain which pairs disappeared, and why deleting one spelling removed more than one pair.
