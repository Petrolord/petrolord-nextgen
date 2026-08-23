# Reporting Rw sensitivity

The work is done: Rw triangulated, SAND_A booked both ways, the mechanics understood. What remains is the deliverable. This lesson sets out how an Expert reports Rw sensitivity so that a reader who was not in the room can trust the booking, stress it, and know exactly when it must be redone.

## The adopted parameter and its provenance

The report's parameter section states the adopted value and how it was earned, in one self-contained block: $R_w = 0.049910$ ohm.m at the formation temperature of 180 degF, from a lab sample of 0.114 ohm.m at 75 degF corrected with Arps, agreeing with the SP quicklook at 0.0498 ohm.m and the Pickett water-line product $aR_w$ of 0.0500 ohm.m, and validated by a water-leg mean Archie saturation of 0.9991 over 2075 to 2078 m. Three routes and a closure check, four numbers, two lines of text. Provenance written this way is falsifiable: a reviewer can rerun any leg of it from the report alone.

## The side-by-side table

Sensitivity is reported as bookings side by side, never as prose adjustments:

| Quantity | Adopted Rw 0.049910 | Raw sample 0.114 |
| --- | --- | --- |
| Net pay | 18.0 m | 16.5 m |
| Net to gross | 0.878 | 0.805 |
| Pay-average porosity | 0.2081 | 0.2099 |
| Pay-average Sw | 0.3609 | 0.5303 |

The right-hand column is labelled for what it is: the booking under the most plausible wrong value of the parameter, namely the uncorrected lab reading. A sensitivity case built from an arbitrary perturbation ("Rw plus 50 percent") is weaker than one built from a mistake someone could actually make; the raw sample is exactly such a mistake.

## Stating the delta in barrels-relevant terms

Net pay alone understates the swing, because saturation moved too. The quantity that survives into volumetrics is hydrocarbon pore thickness, the product of net, pay-average porosity and hydrocarbon saturation:

$$h_{hc} = h_{net} \times \bar{\phi} \times (1 - \bar{S_w})$$

For the adopted booking: $18.0 \times 0.2081 \times (1 - 0.3609) = 2.393$ hydrocarbon-metres. For the raw booking: $16.5 \times 0.2099 \times (1 - 0.5303) = 1.626$ hydrocarbon-metres. The uncorrected parameter destroys 32 percent of the apparent hydrocarbon column, a factor invisible in the net-pay line alone, where the drop looks like 8 percent. Reporting the delta in hydrocarbon-metres is what lets the reservoir engineer and the economist read the sensitivity without redoing the petrophysics.

## The standing QC

The report carries the water-leg check as a permanent quality control, not a one-time anecdote: with the adopted Rw, the water leg reads $S_w = 0.9991$; with the raw sample it would read 1.51, an impossibility. Any future revision of logs, zones or parameters should rerun this check first, because it is the cheapest test that catches a broken Rw. A saturation model whose known water reads unity is not proven right, but one whose known water reads 1.5 is proven wrong, and asymmetric tests this cheap belong in every rerun.

## Re-book, never edit

Finally, the governing rule for the document's life after issue: any future Rw revision triggers a re-book, never an edit. The temptation, when a better Rw arrives, is to scale the saturations by the square-root factor and adjust the summary lines. The previous lessons showed why that fails: the cutoff re-flags samples, the net changes, and every conditional average moves with its new sample set. Scaling the old averages produces numbers that correspond to no booking at all. The recipe is deterministic and cheap to rerun; rerun it, version the report, and keep the superseded booking in an appendix so the audit trail shows what changed and why.

Close the module with its one-sentence summary: sensitivity is not decoration; it is the Expert's evidence that the answer is robust, and the report is where that evidence is filed.

## Exercise

Write the two-line parameter provenance block for a hypothetical well where the lab sample read 0.180 ohm.m at 70 degF, formation temperature is 150 degF, and no SP or water leg is available. Compute the Arps value for the block. Self-check: $0.180 \times (70 + 6.77)/(150 + 6.77) = 0.180 \times 76.77/156.77 = 0.0881$ ohm.m; and because only one route exists, the block must say so explicitly and flag the missing corroboration as an open risk, since a single-route Rw is an assumption with arithmetic, not a triangulation.
