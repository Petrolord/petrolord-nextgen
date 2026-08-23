# The NULL flag

A LAS file records everything in one rectangular grid of numbers: one row per depth, one column per curve. But real logging runs do not produce a measurement at every depth for every tool. The file still has to put a number in every cell, so the format needs a way to write "there is no measurement here" using nothing but a number. That is the NULL flag.

## The NULL declaration

The well information section (~W) carries a line that declares the sentinel:

```
NULL.   -999.25 : NULL VALUE
```

From that line onward, every occurrence of the declared value in the data section means absent, not measured. The value -999.25 is the classic convention, chosen long ago precisely because no real log reading lands on it: gamma ray does not go negative, porosity does not reach minus one thousand, and so on. When you scan a raw data section and see a column of -999.25 entries, you are looking at holes in the data, not at readings.

## A declaration, not a constant

Here is the trap the teaching set is built to expose. The NULL value is declared per file, and files differ. Five of the six teaching files declare -999.25, but nullheavy_20 declares:

```
NULL.   -9999 : NULL VALUE
```

Every -9999 in that file's grid means absent. A reader that hard-codes the classic -999.25 instead of reading the declaration will find no matches in nullheavy_20 at all. It will report zero nulls, treat all 71 of the GR column's -9999 entries as real gamma ray readings, and hand its statistics a stack of huge negative numbers. The damage is silent: the file parses, the columns line up, and every downstream average is poisoned. The rule is absolute: read the NULL line, then apply it.

## Why measurements go missing

Nulls are not file corruption. They record honest facts about the logging operation:

* The tool was not yet on depth. Curves often start recording partway into the run, so the first samples of a column are flagged.
* Washouts and bad hole. Some tools cannot read against an enlarged borehole, and the affected interval is flagged rather than filled with garbage.
* Tool or channel failure. A cartridge dies mid-run and its curve stops.
* Splices. When a composite file is built from several runs, intervals no run covered are flagged.

Each pattern of nulls tells a story, and the next lesson is about reading those stories from the counts.

## What the parser does with them

The engine's parser reads the declaration and converts every flagged value to NaN, the floating-point "not a number". This is a deliberate safety choice: NaN contaminates any arithmetic it touches, so a computation that accidentally includes a missing sample announces itself instead of quietly shifting a mean. Statistics are then computed over the finite samples only, which is the subject of the last lesson of this module.

## Worked example

Open nullheavy_20 in the app and read its QC panel against the raw file:

1. The ~W section declares NULL as -9999. The panel's "Samples / NULL flag" tile shows 201 / -9999.
2. The GR row reports 71 nulls out of 201 samples. Those are the 71 grid cells holding -9999.
3. The GR mean shows 44.3489 GAPI, computed over the 130 samples that carry real readings.

Now imagine the hard-coded reader that assumes -999.25. It finds no sentinel values, reports 0 nulls, and computes its GR mean over all 201 values including seventy-one entries of -9999. The result is a large negative "gamma ray", a number no rock on Earth can produce. The declaration line is one short row of text, and skipping it wrecks every statistic in the file.

## Exercise

Without the app, answer from the file excerpts above: nullheavy_20 declares NULL as -9999 and its GR column holds 71 flagged entries among 201 samples. State (a) how many GR samples carry real measurements, and (b) what null count a reader hard-coded to -999.25 would report for this file, and why. As a self-check: (a) 201 - 71 = 130 finite samples; (b) zero, because no cell in the file contains -999.25, so every sentinel would be mistaken for data. Finish with one sentence on why the NULL flag must always be read from the ~W section rather than assumed.
