# Two sources for one substance

{{panel:cq-harm}}

For chlorine the engine carries two presets from two published sources: Lees, as OSD/30 prints it, and the Purple Book. They use different units, different coefficients and a different exponent on the concentration. This lesson runs one chlorine exposure through both and reads what the disagreement says.

## The two presets

| preset | a | b | n | unit |
| --- | --- | --- | --- | --- |
| lees-chlorine | -8.29 | 0.92 | 2 | ppm |
| pb-chlorine | -6.35 | 0.5 | 2.75 | mg/m3 |

Chlorine for 10 minutes (stated), both presets. The ppm is converted for the Purple Book at 25 C with a molar mass of 70.9 g/mol (stated):

| chlorine ppm, stated | lees toxic load | lees probability | pb concentration mg/m3 | pb toxic load | pb probability |
| --- | --- | --- | --- | --- | --- |
| 50 | 25000.000000 | 0.000035 | 144.898488 | 8768505.854629 | 0.000395 |
| 100 | 100000.000000 | 0.003487 | 289.796976 | 58987241.122310 | 0.008118 |
| 200 | 400000.000000 | 0.077409 | 579.593951 | 396817276.843654 | 0.073459 |
| 400 | 1600000.000000 | 0.441437 | 1159.187903 | 2669457804.868559 | 0.309443 |

## Where they cross

Read the two probability columns together. At 50 ppm the Purple Book gives 0.000395 against Lees's 0.000035: the Purple Book is the more cautious source at low concentration. At 200 ppm the two nearly meet, 0.073459 against 0.077409. At 400 ppm Lees gives 0.441437 against the Purple Book's 0.309443: now Lees is the more cautious one.

So neither source is simply higher. They cross, and which one reads worse depends on where the exposure sits. An analyst who picks a preset once, for its reputation, will sometimes have picked the lower answer without knowing it.

## Why they cross

The exponent n decides how fast the toxic load grows with the concentration: 2 for Lees and 2.75 for the Purple Book. The probit, though, is b times the logarithm of the toxic load, so what sets how steeply the probit rises with ln C is b times n. Work it from the table of coefficients: Lees has the larger b, 0.92 against 0.5, and that outweighs the Purple Book's larger n. Lees therefore rises more steeply, so it starts lower and ends higher. Converting ppm to mg/m3 only shifts ln C by a constant, so the unit changes the offset and leaves the slope alone. The toxic load units differ too, (ppm)^2 min for Lees and (mg/m3)^2.75 min for the Purple Book, which is why the two toxic load columns cannot be compared directly even at the same exposure.

## Which one is graded

The Lees coefficients are graded in this course. OSD/30 Table 2 prints fifty-two ppm values for thirteen substances, and all reproduce through the engine's inverse within one percent or one ppm. The Purple Book chlorine preset has no such printed column behind it; outside its carbon monoxide worked case, a Purple Book toxic preset rests on the transcription alone. It is taught here as a teaching comparison, and it never carries a graded answer.

That rule does not make the Purple Book wrong. It means only that a mistake copied into both the engine and its oracle would go uncaught for it. A consequence note can still show the Purple Book figure beside a Lees result, labelled as a comparison, and the disagreement between them is worth a reader's attention.

## Exercise

On the harm panel's toxic view, enter 400 ppm of chlorine for 10 minutes on lees-chlorine and confirm 0.441437. Then switch to pb-chlorine, give the molar mass of 70.9 g/mol, and confirm 0.309443. Write the paragraph a consequence note would carry for this exposure: which preset you used and why, the other preset's probability beside it, and the concentration at which the two sources change places in the table above.
