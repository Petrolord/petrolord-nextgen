# What missing means

{{panel:dq-checks-explorer}}

Before the engine can say whether a value is there, it needs a rule for what "not there" looks like. Its rule is short: a missing value is null, undefined or NaN. Anything else that is a finite number is present, whatever it happens to be. Put a three-entry series through `completeness` and change only the middle entry, and the rule shows itself.

| middle entry | missing | present | completeness |
| --- | --- | --- | --- |
| `null` | 1 | 2 | 0.666667 |
| `undefined` | 1 | 2 | 0.666667 |
| `NaN` | 1 | 2 | 0.666667 |
| -999.25 | 0 | 3 | 1.000000 |
| 0 | 0 | 3 | 1.000000 |

## Three spellings of absence

Null, undefined and NaN are the three ways a program ends up holding "no number here". A spreadsheet blank read into a program becomes one of them, a column that was never filled becomes another, and a failed parse of a text cell becomes the third. The engine treats all three the same, because in every case nobody recorded a value.

## Zero is a value

The last row deserves a second look. A zero is present. A zero oil rate on a shut-in day is the correct record of that day, and later in this tier the rate check depends on exactly that: a zero rate while shut in is correct and is not flagged. If the engine counted zeros as missing, every shut-in day would look like a lost reading.

## Infinity is refused

Plus or minus infinity is neither a measurement nor an absence. It can come from a division by zero somewhere upstream, and the engine will not guess which of the two it should be. It refuses the call and names the entry, in its own words:

> values[1] must be a finite number or missing (null)

A refusal carries no number. It tells you which input to fix before the question can be asked.

## A declared choice

This definition is a choice the engine makes and states, and there is an obvious alternative: treat common placeholder numbers as missing automatically. The engine does not, and the next lesson shows the price. The reason is that a placeholder is a convention of one file format or one database, declared in that file's own header, and the same number can be a real reading somewhere else. Guessing would quietly change data the caller never asked to change. So the engine keeps one rule, applies it the same way everywhere, and leaves converting a placeholder to the caller, who can read the header.

The rule is also the course's vocabulary. In every lesson from here on, "missing" means null, undefined or NaN, and nothing else. A value that is present but wrong is a question for the validity checks.

## Exercise

Open the checks explorer on the view for completeness and coverage. The values box holds a stretch of EKENE-7's bulk density that runs into its gap. Read the Missing tile and the completeness tile. Now replace one `null` in the box with -999.25 and read both tiles again: say which way each one moved and why. Put the `null` back, replace another one with 0, and explain why the tiles move the same way as they did for -999.25.
