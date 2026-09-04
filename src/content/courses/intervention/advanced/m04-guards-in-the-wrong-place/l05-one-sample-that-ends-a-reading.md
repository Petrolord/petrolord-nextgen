# One sample that ends a reading

`minWor` is 0.1, it is compared against the last sample of the history and nothing else, and it is applied to whatever ratio column arrives.

{{panel:pd-candidate-explorer}}

## The gate

The default is documented as "Below this water-oil ratio there is no water problem to diagnose", which is sound for the fluid it was named for. The comparison is made against the final ratio in the series, so it is a test on one reading rather than on a history, and it fires before any slope is computed.

## One reading, two answers

The teaching low-last-sample demonstration is a climbing history, WOR = 0.004 t^1.15, 24 samples from t = 30 to 2000 days, reaching 20.279117393 at the second to last sample. The final entry is a post-shut-in test of 0.060000000.

With that test in place, `chanDiagnosis` returns ok = true, mechanism displacement, confidence n/a, ambiguous n/a, with every slope, every fit quality, the span and the window start all unavailable, and the note "The ratio is still only 0.060. There is no water problem here to diagnose, and nothing to treat."

Restore that one sample and the same call returns mechanism displacement at confidence low, ambiguous true, worSlope 1.150000000 at a fit quality of 1.000000000, derivativeSlope 1.150000000 at 1.000000000, spanDecades 0.872304180, over the late window starting at 268.364963 days. A slope of 1.15 on a window of 0.872304180 log cycles, and it exists or does not exist depending on the last row in the file.

## Unit blind

The threshold is a bare 0.1 and the column is whatever was handed in. On the teaching gas history the last gas-oil ratio is 2151.864192 scf/stb, which clears a water-oil-ratio threshold of 0.1 by a factor of 2.151864e+4. The gate is inert by four orders of magnitude on the fluid the module's own gas reasoning sends the user to.

## The refusal that does count first

The one place the module counts before it reads is the length check. A history of five samples returns ok = false, mechanism indeterminate, everything else unavailable, and the words "A Chan reading needs a history, not a handful of points. Six producing samples is the bare minimum and a useful reading wants far more." That refusal is honest: it says what it wants and it gives no verdict.

## The mistake

Trusting a diagnosis that arrived with no numbers in it. Both outcomes here return ok = true and mechanism displacement, and only one of them fitted anything. The tell is the object: no slope, no fit quality, no span, no window start. A returned mechanism with an empty fit beside it is a gate speaking, not a reading.

## Exercise

Write the two mechanisms, the two confidences and the two derivative slopes this demonstration returns with the final sample removed and restored, naming the window the surviving slope was taken over. Then say which field of the return object distinguishes a gate from a reading.
