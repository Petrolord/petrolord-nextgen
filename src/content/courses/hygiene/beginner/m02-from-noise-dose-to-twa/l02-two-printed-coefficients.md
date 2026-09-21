# Two printed coefficients

{{panel:hy-noise-dosimeter}}

OSHA prints the TWA coefficient as 16.61 and NIOSH prints it as 10.0. The exact values, the decibel exchange rate over log10 2, are 16.609640474437 for 5 dB and 9.965784284662 for 3 dB. The printed OSHA coefficient sits 0.000359525563 dB above its exact one. The printed NIOSH coefficient sits 0.034215715338 dB above its exact one, a gap large enough to show in a published table.

The engine measures the coefficient each preset carries by asking for the TWA of a 1000 percent noise dose and subtracting the criterion level. The OSHA PEL and the OSHA action level both return 16.610000000000, and the NIOSH noise REL returns 10.000000000000, each matching the literal typed in the digest generator.

## Judgement J1

The sources leave a choice open, and the engine makes it by name. Judgement J1 is that **each preset uses the coefficient its source prints**, 16.61 for OSHA and 10.0 for NIOSH, while a criterion typed by hand defaults to the exact decibel exchange rate over log10 2.

| criterion | printed coefficient | exact coefficient | printed minus exact, dB |
| --- | --- | --- | --- |
| OSHA | 16.610000000000 | 16.609640474437 | 0.000359525563 |
| NIOSH | 10.000000000000 | 9.965784284662 | 0.034215715338 |

The print is what the source publishes, and the next lesson shows how far each table can confirm it.

## What fixes 16.61 for OSHA

For OSHA the table cannot settle the question, and the text does. The mandatory Appendix A of 29 CFR 1910.95 writes TWA = 16.61 log10(D/100) + 90. The engine uses the coefficient the regulation writes. That is a decision grounded in the regulation's own text, and the course records it as a decision rather than as something a table proved.

The two coefficients differ so little on OSHA that you will rarely see it. A noise dose of 50.000000 percent gives 84.999892 dBA with 16.61 and 85.000000 dBA with the exact coefficient. The difference is far smaller than the one decimal OSHA's own table prints.

## The cost of the choice on NIOSH

On NIOSH the gap is visible. Eight hours at a constant 100 dBA on the NIOSH preset gives a TWA of 100.051500 dBA, although the level itself is 100. On a criterion typed by hand with the exact coefficient the same record gives 100.000000 dBA.

That small excess is the price of reproducing what NIOSH publishes. A constant level ought to return itself as its own TWA, and with the exact coefficient it does. With the printed one it lands a little above 100. Both answers come from a correct engine; they differ because they follow different coefficients, and a report should say which it used.

## Why this matters to a reader

A hand check of a NIOSH TWA with the exact coefficient will disagree with the engine in the second decimal. Neither is broken, and knowing J1 by name lets you say why in one sentence.

## Exercise

Take the NIOSH record of eight hours at a constant 100 dBA. Its TWA is 100.051500 dBA on the preset and 100.000000 dBA with the exact coefficient. Subtract one from the other and compare the difference with the printed minus exact figure of 0.034215715338 dB in the table above. Then say what the logarithm term must be for that record, and why the gap between the two TWAs is larger than the gap between the two coefficients.
