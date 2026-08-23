# The header line grammar

Every line in the `~V`, `~W`, `~C` and `~P` sections follows one grammar:

```
MNEM.UNIT    VALUE : DESCRIPTION
```

Four fields: a mnemonic, a unit stuck to it with a dot, a value, and a description after a colon. The grammar looks trivial until you meet real files, where values contain colons, units are missing, and spacing is chaos. This lesson gives you the exact rules the app's parser applies, which are deliberately the rules of lasio, the industry-standard Python reader, so that a file reads the same here as it does everywhere else.

## The four fields, precisely

The parser finds the fields in this order:

1. The mnemonic is everything before the first dot, trimmed. Trailing spaces inside the field are common (`FLD .` and `GR  .` both appear in the teaching files) and harmless.
2. The unit starts immediately after that dot and runs to the first whitespace. A unit is optional: `NULL.   -999.25` has none. A trailing period is shed, and brackets around a unit are stripped.
3. The value is everything between the unit and the colon. The critical rule: the value runs greedily to the LAST colon on the line, not the first.
4. The description is whatever follows that last colon, trimmed.

If the line has no colon at all, everything after the unit is value and the description is empty. If there is a colon but no dot before it, the line is read as the simpler `name : value` form.

## Why the last colon wins

Real header values contain colons: well names, time stamps, comments. Splitting at the first colon would truncate them. The teaching file `quirks_20.las` carries the proof:

```
 WELL.           KETA G1-3: THE "QUIRKY" ONE :WELL NAME
```

Split at the first colon and the well would be named `KETA G1-3` with the description `THE "QUIRKY" ONE :WELL NAME`. Split at the last colon, as the parser does, and the value is `KETA G1-3: THE "QUIRKY" ONE` with the description `WELL NAME`. The colon inside the value survives because only the final one separates value from description. The cost of this rule is that a description itself can never contain a colon, which is the lesser evil and is what lasio settled on.

## Two real lines, dissected

Take the start-depth line from `basic_20.las`:

```
STRT.M  1500.0000 : START DEPTH
```

Mnemonic `STRT`; unit `M` (after the dot, up to the first space); value `1500.0000`, which parses as the number 1500; description `START DEPTH`. Numbers are recognised where possible, so downstream code sees a float, not a string. One deliberate exception: `UWI` and `API` identifiers always stay strings, because their leading zeros are significant and a numeric conversion would destroy them.

Now the well-name line from the same file:

```
WELL.   KETA G1-1 : WELL
```

Mnemonic `WELL`; no unit (the dot is followed by spaces); value `KETA G1-1`; description `WELL`. The value keeps its internal space because the value field is everything up to the last colon, whitespace included, then trimmed at the ends.

## The LAS 1.2 twist

LAS 1.2 files order some well-section entries differently: string entries put the value after the colon. From `wrapped_12.las`:

```
WELL.   WELL : KETA G1-2
```

Read with 2.0 rules, the well would be called `WELL`. The parser knows the file declared `VERS 1.2` and swaps value and description for well-section string entries, recovering `KETA G1-2`. The numeric housekeeping entries `STRT`, `STOP`, `STEP` and `NULL` keep the value-first layout even in 1.2, so depth ranges read identically in both versions. This is exactly why the previous lessons insisted the version section is read first: the grammar of a later section depends on it.

## Tolerated mess

The quirky file shows the tolerances that matter in practice: leading spaces before mnemonics, columns aligned with wildly variable whitespace, comment lines inside sections, and a description jammed against its colon (`:START DEPTH`). All of it parses, because the grammar anchors on the first dot and the last colon, not on spacing. A curve line may also carry an API code in the value slot, as in `GR  .GAPI      45 310 01 00            :GAMMA RAY: TOTAL`, where the code is the value and the description again sits after the last colon.

## Exercise

Dissect this line by hand into its four fields: `STOP.M          1540.0000               :STOP DEPTH`. Self-check: mnemonic `STOP`, unit `M`, value 1540 (numeric), description `STOP DEPTH`. Then explain in one sentence why the parser splits value from description at the last colon rather than the first. Self-check: values in real files legitimately contain colons, and only the last colon reliably marks the description.
