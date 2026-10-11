# Phase and correlation

The statistical wavelet's phase is an assumption, so the tie tests it. A constant-phase rotation turns the synthetic through a stated angle; a phase match finds the angle that best fits the trace. At Ekene-1 the assumption costs little, and a designed case shows how large the cost can be.

## The rotation

`rotateConstantPhase` returns s cos(phi) + H(s) sin(phi), with s the trace and H its Hilbert transform. At 90 degrees it becomes its Hilbert transform. At 180 degrees it becomes -s, the same trace with reversed polarity.

## The best phase

`estimatePhaseRotation` takes a synthetic s and a recorded trace r and returns phi = atan2(<H(s), r>, <s, r>), the angle of best fit, over the samples both traces carry. It reports the correlation before rotation and after. The Hilbert transform cannot cross a gap, so the match runs on the synthetic's live span, the 26 samples of Ekene-1's synthetic.

## Ekene-1

| quantity | value |
| --- | --- |
| best phase, degrees | -6.135261 |
| correlation before rotation | 0.983438 |
| correlation after rotation | 0.989111 |

The angle found is -6.135261 degrees and the correlation rises by less than a hundredth. The course's ties use the statistical wavelet as it is extracted, at zero phase.

## A designed case

The same synthetic is first rotated by a stated phase, then matched to the trace again:

| phase added, degrees | best phase found, degrees | correlation before | correlation after |
| --- | --- | --- | --- |
| 30 | -36.092689 | 0.799189 | 0.989219 |
| 60 | -66.081556 | 0.400777 | 0.988816 |
| 90 | -96.113046 | -0.105222 | 0.988309 |

## Reading the case

The match finds the rotation back. Each best phase lands a few degrees beyond the negative of the phase added, on the same side as Ekene-1's own best phase of -6.135261 degrees.

The correlation before matching falls quickly as the planted phase grows: 0.799189 at 30 degrees, 0.400777 at 60 and -0.105222 at 90. After matching, every row returns close to Ekene-1's 0.989111. A low correlation at zero shift can therefore be a phase problem that one rotation removes, and a tie that reports only the correlation before rotation hides that.

## What phase means for the two questions

For data quality, phase is a per-well figure. QI Studio's issue register flags wavelet phases across wells that span more than 30 degrees. For the fluid question, the AVO steps read the stacks at a picked sample, which assumes the event and its wavelet are where the tie says they are.

A tie therefore states its phase: assumed zero with a statistical wavelet, or the measured phase with its correlation before and after.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Wavelets and phase", with Well at Ekene-1 and the trace window at 1100 to 1500 ms. Read Best constant phase, Correlation before rotation and Correlation after rotation against the Ekene-1 table. Read the same three tiles at the other three wells, and say whether the four best phases span more than the 30 degrees QI Studio flags. The explorer adds no phase to the synthetic, so extend the designed case to 180 degrees from the rotation formula: predict the sign of the correlation before rotation and the size of the correlation after.
