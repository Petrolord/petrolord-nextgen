# An analysis that does not sum to one

EGBEMA's laboratory sheet sums to one. The same sheet typed short does not, and characteriseGas reports what it does with a sheet like that.

{{panel:gasvalue-flare-explorer}}

## EGBEMA's sheet, typed twice

EGBEMA's laboratory sheet, typed in full, reads: C1 0.742, C2 0.104, C3 0.062, IC4 0.013, NC4 0.021, C5 0.012, N2 0.018, CO2 0.028.

The same sheet typed short, with less methane, reads: C1 0.73, C2 0.102, C3 0.061, IC4 0.013, NC4 0.021, C5 0.012, N2 0.018, CO2 0.028.

The engine reports the raw sum of each sheet and a note:

| sheet | rawMoleFractionSum | normalisationNote |
| --- | --- | --- |
| EGBEMA in full | 1.0000 | none |
| EGBEMA typed short | 0.9850 | The mole fractions summed to 0.985 and were scaled to one. Check the analysis if that was not intended. |

## The engine scales and says so

The engine scales a sheet to one and says so. The full sheet sums to 1.0000 and carries no note. The short sheet sums to 0.9850, and the engine's note reads: "The mole fractions summed to 0.985 and were scaled to one. Check the analysis if that was not intended."

Two things happen. The engine works on with the scaled fractions. And the raw sum and the note are reported with the answer, so the scaling is reported with the answer.

## The scaled fractions

These are the fractions the engine works with:

| code | typed (short sheet) | normalised (short sheet) | typed (full sheet) | normalised (full sheet) |
| --- | --- | --- | --- | --- |
| C1 | 0.73 | 0.7411 | 0.742 | 0.7420 |
| C2 | 0.102 | 0.1036 | 0.104 | 0.1040 |
| C3 | 0.061 | 0.0619 | 0.062 | 0.0620 |
| IC4 | 0.013 | 0.0132 | 0.013 | 0.0130 |
| NC4 | 0.021 | 0.0213 | 0.021 | 0.0210 |
| C5 | 0.012 | 0.0122 | 0.012 | 0.0120 |
| N2 | 0.018 | 0.0183 | 0.018 | 0.0180 |
| CO2 | 0.028 | 0.0284 | 0.028 | 0.0280 |

Read the full sheet's columns first. Every normalised figure equals its typed figure: C1 0.742 and 0.7420, CO2 0.028 and 0.0280. A sheet that sums to one is used as typed.

Now read the short sheet's columns. Every normalised figure differs from its typed figure: C1 0.73 becomes 0.7411, C3 0.061 becomes 0.0619, CO2 0.028 becomes 0.0284. After scaling, every component on the short sheet has moved from its typed figure, the inerts included: N2 0.018 becomes 0.0183.

## What the scaled sheet is and is not

Compare the two normalised columns. The short sheet's C1 is 0.7411 and the full sheet's is 0.7420. Its CO2 is 0.0284 and the full sheet's is 0.0280. The scaled short sheet is a gas that sums to one. It is not EGBEMA's laboratory sheet, and any figure computed from it is computed on the scaled fractions.

The note ends with the engine's own instruction to the reader: "Check the analysis if that was not intended." The engine scales the sheet and reports the raw sum. Whether the scaling was intended is the question the note hands back.

## The note in the explorer

The flare explorer carries the short sheet as a preset. Load it and find the sheet sum and the normalisation note beside the analysis. Then load EGBEMA in full and confirm the sum reads 1.0000 and the note is gone.

## Exercise

Read the C1 row: typed 0.73 and normalised 0.7411 on the short sheet, typed 0.742 and normalised 0.7420 on the full sheet. Read the two rawMoleFractionSum figures, 0.9850 and 1.0000. Say which sheet the engine scaled, what it reported when it did, and which sheet is used as typed.

Self check: the short sheet summed to 0.9850, so the engine scaled it to one and reported the note "The mole fractions summed to 0.985 and were scaled to one. Check the analysis if that was not intended." The full sheet summed to 1.0000, carries no note, and every normalised figure equals its typed figure.
