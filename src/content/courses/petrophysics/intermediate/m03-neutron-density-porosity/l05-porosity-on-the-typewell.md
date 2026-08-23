# Porosity on the typewell

This lesson closes the porosity story by putting every method you now own side by side on the typewell zones, booking one of them, and defending the choice. The number this lesson books is one of the six the capstone grades.

## Four porosities, two zones

Run all four methods over SAND_A (2010 to 2030 m) and take zone means:

| Method | SAND_A mean |
| --- | --- |
| Neutron-density average, $\phi_{ND}$ | 0.1762 |
| Density only, $\phi_D$ | 0.2022 |
| Wyllie sonic | 0.2069 |
| Raymer-Hunt-Gardner sonic | 0.2344 |

Four defensible calculations, spanning 0.1762 to 0.2344. That spread of nearly six porosity units is not noise and not error in any tool; every input curve is clean. It is model choice, and nothing else. The same spread appears at the single clean sample at 2020 m, where the individual methods read 0.1700 ($\phi_{ND}$), 0.2100 ($\phi_D$ and Wyllie), and 0.2369 (RHG). Whoever signs the interpretation must pick one number from that range and say why.

For SAND_B (2050 to 2080 m) the picture compresses: the mean $\phi_{ND}$ is 0.1220 and the Wyllie sonic mean is 0.1200. In the tighter, wetter sand the methods converge, which is typical; method choice matters most exactly where the reservoir is best.

## What the course books, and why

The intermediate course books $\phi_{ND}$, the neutron-density average, as its porosity. The SAND_A mean of 0.1762 is a capstone number, graded to a tolerance of 0.005.

The reasoning, in the order that matters:

1. Two independent physics beat one. The average tempers the density log's optimism in this sand with the neutron's lower reading, and no single-tool calibration artefact carries straight through into the booked number.
2. Robustness against the two classic disturbers. Shale pushes the inputs in opposite directions, and so does gas; the average is the combination that degrades most gracefully when either appears, and the crossplot has already shown where they do.
3. It is the app's convention. The engine computes $\phi_{ND}$ with the plain average, the capstone grades it, and a team that all books the same convention can compare wells without translation.

The sonic is retained as the bad-hole backup, not discarded. Its great virtue, inherited from module m02, is indifference to hole enlargement that corrupts the pad-based density tool. On the typewell the hole is good and the backup is never called on, but the professional habit is to carry it computed and ready, and the Wyllie SAND_A mean of 0.2069 is itself a second capstone number, graded to the same 0.005 tolerance.

Density-only porosity, the beginner course's booking, is neither wrong nor abandoned; it is simply outvoted. Moving from $\phi_D$ to $\phi_{ND}$ shifts the SAND_A mean from 0.2022 to 0.1762, a conservative revision of 2.6 porosity units that flows into every saturation and every barrel counted downstream. Knowing that sensitivity is part of the booking decision, and module m06 returns to it.

## Worked example

Reproduce the booked SAND_A mean in miniature. The zone mean is the average of $\phi_{ND}$ over all samples from 2010 to 2030 m, but the mechanics show at any one depth. At 2020 m:

1. $\phi_D = (2.65 - 2.3035)/1.65 = 0.2100$.
2. $\phi_N = 0.13$.
3. $\phi_{ND} = (0.2100 + 0.13)/2 = 0.1700$.

Repeat at every sample in the zone and average, and the engine reports 0.1762. The single 2020 m sample sits 0.0062 below the zone mean, a reminder that a zone mean is a property of the whole interval and no single depth is obliged to match it. When the capstone asks for the SAND_A mean, run the zone statistics in the app; do not read one depth and hope.

## Feed-forward

From here on, $\phi_{ND}$ is the porosity, full stop. The Pickett fit in module m04 plots RT against $\phi_{ND}$ in the water leg and expects the fit to return a·Rw = 0.0500 and m = 2.000 precisely because it is fed the same porosity curve the rest of the interpretation uses. Both shaly-sand saturation models in module m05, Simandoux and Indonesia, take $\phi_{ND}$ as their porosity input, and their SAND_A means (0.4335 and 0.4280) are the remaining capstone numbers. Booking a different porosity would silently move every one of those results, which is exactly why the booking is stated once, here, and never revisited mid-workflow.

## Exercise

Compute all four porosities at the water-leg sample, 2076 m, where RHOB = 2.4883, NPHI = 0.098, and DT = 228.452 us/m, using the typewell parameters (density: 2.65 and 1.0; Wyllie: 182 and 656 us/m). As a self-check: $\phi_D = 0.0980$, $\phi_{ND} = (0.0980 + 0.098)/2 = 0.0980$, Wyllie $= (228.452 - 182)/(656 - 182) = 0.0980$, and RHG $= 0.67 \times (228.452 - 182)/228.452 = 0.1362$. Three of the four agree to four decimals in this clean wet sand. State in one sentence which method is the outlier here and whether that changes the booking argument.
