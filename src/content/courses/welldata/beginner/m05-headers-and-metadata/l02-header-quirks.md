# Header quirks

The basic_20 header from the previous lesson is a laboratory specimen: one entry per line, tidy columns, nothing surprising. Real exports are not written by the standard, they are written by whatever tool the vendor happened to run, and they arrive with rough edges. The teaching case for those edges is quirks_20, whose very first line warns you what is coming.

```
# Exported by a legacy vendor tool - expect rough edges below
```

Here is its entire well section, exactly as the file carries it, comment lines included:

```
~Well Information Block
#MNEM.UNIT       DATA                    DESCRIPTION
#---------      ------------            -----------------------------
 STRT.M          1500.0000               :START DEPTH
 STOP.M          1540.0000               :STOP DEPTH
 STEP.M          0.5000                  :STEP
 NULL.           -999.25                 :NULL VALUE
 WELL.           KETA G1-3: THE "QUIRKY" ONE :WELL NAME
 UWI .           KETA-G1-QUIRKS          :UNIQUE WELL ID
```

Everything a QC check needs is in there, but three things about it break readers that were written for tidy files.

## Ragged spacing

Compare this block against basic_20 and the first difference is layout. Every line starts with a leading space. The section title is `~Well Information Block` rather than `~Well`. The gap between the mnemonic and the value is a wide run of spaces here and a two-space gap there, and the colon sits hard against the description with no space after it. The two `#` lines even draw a ruler that suggests fixed columns, and that ruler does not line up with the entries below it.

A reader that locates the value by character position, taking columns 17 to 40 because that is where basic_20 happens to put them, produces nonsense on this file and produces it silently. The fix is not a cleverer set of column numbers, it is refusing to use column numbers at all. LAS header lines have a grammar, described in module 2: a mnemonic, a dot, an optional unit, the value, a colon, a description. The engine's `parseHeaderLine` works entirely on that grammar, finding the first dot and the colon and trimming whitespace off whatever falls between them. Because it never counts columns, quirks_20 parses to exactly the same six entries a tidy file would give, with STRT 1500, STOP 1540, STEP 0.5 and NULL -999.25 all read correctly. Whitespace is separation, never position.

## A colon inside the value

The `WELL` line is the interesting one:

```
 WELL.           KETA G1-3: THE "QUIRKY" ONE :WELL NAME
```

This well really is called KETA G1-3: THE "QUIRKY" ONE, quotation marks and internal colon and all. A file like this exists because somebody typed a memorable name into a logging unit, and nothing in the LAS standard forbids it.

Now think about the obvious way to split a header line, which is to cut at the first colon. That reader would report a well name of `KETA G1-3` and a description of `THE "QUIRKY" ONE :WELL NAME`. The name looks perfectly plausible, which is what makes the failure dangerous, and the field is now silently truncated.

The engine takes the opposite rule. Its value runs greedily to the **last** colon on the line, and the description is whatever follows that last colon. On this line the last colon is the one before `WELL NAME`, so the value keeps its own colon and comes back as `KETA G1-3: THE "QUIRKY" ONE`, with the description `WELL NAME`. The rule is inherited deliberately: the parser is validated against lasio, so it reads ambiguous lines the way lasio reads them.

Greedy is not free. In the same file, the curve line for GR carries a colon inside its description, `:GAMMA RAY: TOTAL`, and the last-colon rule hands back a description of just `TOTAL` with the rest swept into the API value. That is a cosmetic loss on a curve label, whereas the alternative rule loses part of a well name, and a well name is the key everything downstream is filed under. Both readings are defensible LAS; knowing which one your parser uses is the point.

## The quirk of absence

The third quirk is what the block does not contain. There is no `COMP`, no `FLD`, no `LOC`, no `SRVC` and no `DATE`. Only the four framing entries, the well name and a UWI survived the export.

Nothing is broken. The LAS standard requires very little of the well section, and files this thin are common, especially when they have passed through a conversion step that kept the numbers and dropped the paperwork. The parser reports six entries and no errors, so nothing in the software will complain.

Absence is still information, and it is the kind you have to notice yourself. For basic_20 you can say who logged the well, for whom, in which field, on which date. For quirks_20 you can say none of that. The curves are usable, but their provenance is unknown, and if two files ever disagree about this well there is nothing in this header to arbitrate with. The QC habit from the previous lesson applies exactly here: record which entries are missing as a finding rather than treating a clean parse as a clean file.

Try it yourself: the panel below runs the real parser over the teaching files.

{{panel:wd-las-inspector}}

## Exercise

Take the `WELL` line above and write down, by hand, what a first-colon reader and a last-colon reader each return for the value and for the description. Self-check: first-colon gives value `KETA G1-3` and description `THE "QUIRKY" ONE :WELL NAME`; last-colon gives value `KETA G1-3: THE "QUIRKY" ONE` and description `WELL NAME`, which is what the engine reports.

Then use the framing entries to predict the sample count of quirks_20 before opening the data. Self-check: $(1540 - 1500)/0.5 + 1 = 81$, and the file does carry 81 samples. Finally, list the five identity entries that basic_20 carries and quirks_20 does not, and say in one sentence what you can no longer establish about the curves because of it.
