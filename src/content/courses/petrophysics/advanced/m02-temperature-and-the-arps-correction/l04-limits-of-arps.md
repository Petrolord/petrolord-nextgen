# The limits of Arps

The Arps correction is compact, salinity-free and reversible, and it just produced a capstone-grade number in three lines of arithmetic. It is also easy to over-trust. This lesson draws the boundary around what the formula actually does, because the Expert workflow's whole architecture (three independent Rw routes instead of one) exists to defend against the failure modes listed here.

## Calibrated for NaCl

The 6.77 offset was fitted to sodium chloride solutions. Most formation brines are NaCl-dominated and the formula serves them well, but brines rich in other salts behave differently: calcium and magnesium chlorides, sulfates and bicarbonates each shift the conductivity-temperature relationship. For such waters the simple offset-ratio correction is an approximation of unquantified quality. The practical posture: treat Arps as reliable for typical basinal NaCl brines, and treat any water analysis showing unusual ionic composition as a flag to lean harder on the other two routes.

## Temperature only, never composition

Read the formula again:

$$R_{w2} = R_{w1}\,\frac{T_1 + 6.77}{T_2 + 6.77}$$

Its only inputs are two temperatures and a starting resistivity. It moves a given water along the temperature axis. It cannot repair a starting resistivity that describes the wrong water. If the sample was diluted by mud filtrate on its way into the sample chamber, or the flushing period was too short and the "formation water" is partly yesterday's drilling fluid, then $R_{w1}$ itself is wrong, and Arps will faithfully convert that wrong number to formation temperature. A contaminated sample stays contaminated at every temperature.

Worked example of the trap: suppose filtrate dilution made a sample read 0.20 ohm.m at 75 degF instead of the true 0.114. Arps to 180 degF gives $0.20 \times 81.77/186.77 = 0.0876$ ohm.m, a number that looks every bit as authoritative as the correct 0.0499. Nothing in the arithmetic warns you. Only a cross-check against an independent route can.

## Fresh waters and unusual brines

At very low salinities the conductivity of water stops being dominated by simple NaCl transport, and the offset-scale behaviour degrades. Very fresh formation waters (a few hundred ppm) and exotic brines both call for proper salinity-based work: convert the measurement to an equivalent NaCl salinity, apply published temperature-salinity charts, and document the extra assumptions. The typewell brine, at 0.114 ohm.m bench resistivity, is comfortably in the saline range where Arps behaves.

## Chain of custody

The lab value is only as good as the sample's history: which interval it came from, whether the well had cleaned up, how the sample was preserved, and whether the bench measurement was made at the temperature the report claims. A pristine formula applied to a doubtful sample yields a doubtful answer with clean-looking decimals. In a report, the Arps leg should carry its provenance: sample source, sampling conditions, lab temperature, and the correction applied. That paragraph costs five minutes and is the difference between a defensible number and a rumour.

## Why the workflow triangulates

Each failure mode above corrupts the lab route specifically. Contamination does not touch the SP log, which responds to the water actually in the formation. Neither affects the Pickett fit, which reads Rw from the formation's own resistivity-porosity behaviour in a proven water leg. That independence is the point of the Expert design: the corrected sample (0.0499), the SP quicklook (0.0498) and the Pickett fit (0.0500) rest on different physics, different measurements and different assumptions. When all three land within a fraction of a percent of each other, as they do on the typewell, the agreement is powerful evidence that none of the individual failure modes is active. When they disagree, the pattern of disagreement points at the culprit, which is module 4's subject.

## Exercise

A sample from an offset well reads 0.35 ohm.m at 75 degF, far above the 0.114 of the typewell sample from the same aquifer. Apply Arps to 180 degF as practice: $0.35 \times 81.77/186.77 = 0.1532$ ohm.m. Now answer in a sentence each: name two sample-side explanations for the discrepancy that Arps cannot correct; state which of the three Rw routes you would trust while the discrepancy is unresolved; and explain why "the offset well's water is simply fresher" is a hypothesis you can test with that well's own SP log.
