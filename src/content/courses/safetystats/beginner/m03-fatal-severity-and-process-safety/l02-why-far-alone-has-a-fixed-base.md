# Why FAR alone has a fixed base

{{panel:ss-rates-explorer}}

Call `fatalAccidentRate` with IOGP's 2024 figures, 32 fatalities in 4158877000 hours, and it returns 0.769438 with `basis.base` set to 100000000 and `basis.standard` reading "IOGP safety performance indicators, FAR". Call `incidenceRate` with the same count and hours and a base of 100,000,000, and it returns 0.769438 as well. The arithmetic is identical. What differs is that one function lets the caller choose the base and the other does not.

| function | base argument | base used | rate |
| --- | --- | --- | --- |
| `fatalAccidentRate` | none taken | 100000000 | 0.769438 |
| `incidenceRate` | 100000000 passed | 100000000 | 0.769438 |
| `incidenceRate` | none passed | refused | none |

## The IOGP definition, fixed

Every other rate in this engine has more than one convention in use. A recordable rate may be on 200,000 hours or on 1,000,000, and the two differ by a factor of 5.000000. A severity rate has an OSHA style convention and an older ANSI Z16.1 convention. A process safety event rate may be on either of two bases. For each of those the engine refuses to guess and makes the caller name the base.

FAR is different. The engine takes the IOGP definition, fatalities per 100,000,000 hours, and fixes its base. Other bodies use related framings, such as fatalities per worker-year, so a fatal rate quoted from elsewhere needs its definition checked before it is set beside this one. Every other rate in this course is quoted on more than one base, so the engine refuses to guess. Taking a base argument for FAR would only create a way to get it wrong.

## What the basis block adds

The `basis` block on a FAR result carries four keys: base, baseLabel, formula and standard. The formula reads "fatalities x 100,000,000 / exposureHours". The label reads "per 100,000,000 hours (FAR, IOGP)". The standard names the IOGP indicator set. A FAR copied from the engine into a report therefore carries its own source, which is useful because the FAR is one of the few safety figures regularly compared across companies and years.

`incidenceRate` returns only base, baseLabel and formula, with no standard line, because the engine cannot know what the caller's count means.

## The refusal that still applies

A fixed base does not mean FAR accepts anything. Its hours are checked exactly as every other rate's are, and zero hours gets the same refusal:

> exposureHours must be a finite number of hours above zero: a rate over no exposure is undefined

With no hours there is no rate, fixed base or not.

## Observed and predicted

In this course FAR is always an observed FAR, computed from deaths that happened. Another course in the academy will teach a predicted FAR, which a risk assessment estimates before anyone is exposed. Both are per 100,000,000 hours and both are called FAR. When you write one down where the other could be meant, write "observed FAR" so the reader knows it is a count from the record. Name the thing that could be confused before a reader confuses it.

## Exercise

Open the rates explorer, go to the FAR view, and type 32 fatalities and 4158877000 hours. Confirm it returns 0.769438 and read the standard line it prints. Then go to the count view, type the same figures, and try it first with no base and then with 100,000,000. Record which call is refused, and write one sentence explaining why the FAR view never asks you for a base.
