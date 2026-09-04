# The spellings of no value

A column that was never computed still holds a value in JavaScript, and which value depends on how the export spelled it. One spelling makes the engine reassuring. The other makes it honest.

{{panel:pd-candidate-explorer}}

## What the coercions do

`chanDiagnosis` keeps a sample when `Number.isFinite(p.t)` and `Number.isFinite(p.ratio)`. It does not require the derivative to be finite. The derivative is then coerced and tested against `Math.abs(p.derivative) < 1e-12`.

| Handed in | Number() gives | isFinite | Passes the flat test |
| --- | --- | --- | --- |
| null | 0.0 | true | true |
| empty string | 0.0 | true | true |
| empty array | 0.0 | true | true |
| false | 0.0 | true | true |
| the string "0" | 0.0 | true | true |
| undefined | NaN | false | false |
| the string "n/a" | NaN | false | false |

Those are derived coercion values. A JSON export writes null, a SQL null arrives as null, an empty spreadsheet cell arrives as an empty string, and every one of them reads as a derivative of zero.

## The same history, two spellings

Teaching well ELELENWO-4, a teaching case and not a published one, with the Bourdet derivative column removed. The ratios are identical between the runs.

Spelled `null`: `ok = true`, mechanism displacement, treatable false, confidence n/a, ambiguous n/a. Its note reads "The ratio is sitting flat at 9.33 and its derivative is zero throughout. Nothing is changing, so there is no mechanism to diagnose and nothing on this well for an intervention to fix. That is a finding, not a failure to reach one."

Spelled `undefined`: `ok = true`, mechanism indeterminate, treatable false, confidence low. Its note reads "A slope needs at least three points that are both positive; a log-log plot has nothing to say about zero or negative values."

Both runs return `worSlope` 1.040602176 at `worR2` 0.921895186, fitted on the late window opening at t = 250.242976 days, and neither returns a derivative slope or a span.

## Which answer the export decides

The missing data is the same. One spelling reports that the question cannot be answered. The other reports that there is nothing on the well to fix, and the reassuring one is the spelling every JSON export and every SQL null produces.

## Provenance, which matters here

No golden covers this. The oracle publishes four labelled histories and their late derivative slopes and stops: no expected mechanism, no expected confidence, no expected verdict. `chanDiagnosis` is asserted against nothing, so both of these answers come from a function nothing checks.

## The mistake

Validating that the derivative column is present rather than that each value in it is finite. A present column full of nulls passes the first test and fails the well.

## What it refuses

The filter refuses a sample whose time or ratio is not finite. It refuses nothing on the derivative, and no field of the result says how many derivatives were coerced.

## Exercise

Load ELELENWO-4 with the derivative column spelled `null`, then with it spelled `undefined`, and record the mechanism and confidence each returns.

Then say which field is the same in both runs, and why that field is the one worth reading.
