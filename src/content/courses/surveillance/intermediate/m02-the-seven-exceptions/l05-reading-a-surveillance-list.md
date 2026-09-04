# Reading a surveillance list

The return is an array of exceptions, not a list of wells and not a ranking. Reading it top to bottom as a work order gets the day wrong in three specific ways.

{{panel:pd-exception-explorer}}

## The sort carries no information about size

The sort key is severity, then well name. Severity ranks are high 0, medium 1 and info 2, and ties break on `String(wellName).localeCompare`. Two exceptions of the same rank are therefore in alphabetical order, and nothing anywhere in the ordering reflects how much oil is involved.

On the teaching field OGUTA, invented for this course and neither published nor real, the eight exceptions come back with OGUTA-14 first at `rate_drop` high, value = 11600.000000000000 against a baseline of 24400.000000000000, and OGUTA-2 second at `rate_drop` high, value = 618.142857142857 against 1038.900000000000. The first is above the second because of its name.

## One well can hold three rows, and a silent well can be missing

OGUTA-2 appears three times in that list, as `rate_drop`, `watercut_rise` and `gor_rise`. Eight exceptions is not eight wells.

The count of wells actually surveilled is 7 of 8. `detectExceptions` filters out the type `observation` before any comparison runs, so OGUTA-21 raises nothing because it was never read. OGUTA-9 also raises nothing, and it was read: its recent mean calendar oil is 942.836455279584 stb against a baseline of 1004.457323679256 stb, a change of -6.134742308 per cent, under every trigger. Two silences, two different reasons, and the list shows neither.

## The type filter is a string match

The filter is on the exact type `observation` and the rate key is chosen by a branch on the exact type `injector`. Every other spelling of a well type takes the producer path and is compared on its oil column, whatever the person filing the well record meant by it.

## The mistake

Treating the top of the list as the biggest problem on the field. The top of the list is the alphabetically first well among those whose comparison crossed a doubled threshold, under one set of settings, on the calendar volume. On the teaching field the medium block holds OGUTA-6 at `rate_drop`, value = 307.504761904762 stb against a baseline of 502.666666666667 stb, whose producing-day oil rate did not fall.

## What it refuses

No row names the setting that put it there, and no row names the window it used. A list of 8 and a list of 9 on identical data differ only by a dial, and the return will not say which one.

## Exercise

Read the OGUTA list in the panel and write down how many rows it holds and how many distinct wells appear in it.

Then say which wells on the field raised nothing, and for each one whether it was compared.
