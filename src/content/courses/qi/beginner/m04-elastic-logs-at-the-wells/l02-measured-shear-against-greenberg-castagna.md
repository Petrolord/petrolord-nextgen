# Measured shear against Greenberg-Castagna

Every QI question that touches Vp/Vs or a gradient needs shear velocity. A well without a shear log gets one from a published regression; a well with one can test that regression first. Ekene-1 has a measured DTS log, so the course compares its water-leg shear with Greenberg-Castagna sample by sample.

## The regression, recapped

Greenberg and Castagna (1992) predict Vs from Vp by one regression for each lithology, Vs = a2 Vp^2 + a1 Vp + a0 with velocities in km/s. The engine, `gcSandShaleVs`, uses the published sandstone and shale coefficients:

| lithology | a1 | a0 |
| --- | --- | --- |
| sandstone | 0.804160 | -0.855880 |
| shale | 0.769690 | -0.867350 |

A sample with some shale gets a mixed answer. The engine weights the two lithology predictions on the sample's Vsh and takes the average of their arithmetic and harmonic means. The Rock Physics course derives the regression and its coefficients in full.

## Ekene-1, water leg

The comparison reads the 103 water-leg net sand samples of Ekene-1, the samples below the oil-water contact with Vsh at or below 0.350000. Six of them:

| depth ft | Vp m/s | measured Vs m/s | Vsh | Greenberg-Castagna Vs m/s | measured / GC |
| --- | --- | --- | --- | --- | --- |
| 5118.500000 | 3349.377000 | 1912.147000 | 0.077300 | 1827.409932 | 1.046370 |
| 5127.000000 | 3280.629000 | 1814.383000 | 0.081000 | 1771.835594 | 1.024013 |
| 5135.500000 | 3250.403000 | 1784.073000 | 0.077600 | 1748.047504 | 1.020609 |
| 5144.000000 | 3325.732000 | 1920.581000 | 0.079700 | 1808.147261 | 1.062182 |
| 5163.000000 | 3099.987000 | 1681.702000 | 0.073600 | 1627.984203 | 1.032997 |
| 5171.500000 | 3063.255000 | 1666.658000 | 0.062800 | 1599.846507 | 1.041761 |

Over all 103 samples the mean of measured over predicted is 1.036576. The measured shear sits above the regression at every row shown, so in this sand Greenberg-Castagna gives too little shear for the Vp it is given. A Vp/Vs built on the regression would read higher than the logs.

## The oil leg is a warning

Over the 65 oil-leg samples the same mean is 1.151143, much further from one. The oil softens Vp and leaves the shear modulus alone, so the regression reads a lower Vp and predicts a lower Vs than the rock carries. A regression fed Vp from a hydrocarbon zone carries the fluid effect into its shear, and the fluid effect is what a QI study sets out to measure.

## Why a study checks this first

A published regression describes somebody else's rock, and the Ekene Sand need not sit on it. Where a measured shear log exists, it calibrates the field's own relation, and the size of the misfit tells the study how much a regression-only well would be in error. Where no shear log exists, the study states that its shear is a regression and carries that as a limit in the verdict.

For the two questions, the misfit feeds the second. Vp/Vs and the AVO gradient both depend on shear, so every later figure in this tier inherits the shear source a study chose, and the verdict names it.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "Shear and the local trend" and Data to "Ekene pack: Ekene-1". Scroll to "Measured shear against Greenberg-Castagna" and check the six rows above against the table, then read the "Mean of measured / Greenberg-Castagna" tile. Switch Data to each of Ekene-2, Ekene-3 and Ekene-4 and record whether the measured shear sits above or below the regression on each. Then lower "Net sand Vsh cut-off (stated)" and see whether the mean ratio moves as the shalier samples drop out. Restore 0.350000.
