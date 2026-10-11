import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Associate final exam: 42 questions across the six modules.

# ---------------- m01 what a QI study asks ----------------

# X m01+m03
q(2, "A learner hunts for the Ekene-1 top on the seismic at 644.398189 ms and finds it above the window the band and signal figures were measured in. What has gone wrong?",
 "The checkshot gives one-way time; doubled, the top sits at TWT 1288.796378 ms, inside the 800 to 1600 ms window of those figures.",
 ["Nothing: the band and signal windows were chosen too deep, and the study should remeasure them from a shallower start.",
  "The learner read the top in metres, 1548.000000, where the course works in feet, and a feet figure lands lower on the trace.",
  "The top really is above the window, because the Ekene Sand is shallower than the 800 ms start of the spread traces."],
 "The spread traces run 800 to 2400 ms, and the -6 dB band of 14.425434 to 34.787627 Hz and the median 361.155122 are read in 800 to 1600 ms, the window holding the sand; the RMS slice spans 1250 to 1350 ms.")

# X m01+m06
q(0, "At 0 degrees the modelled Ekene-1 top has an exact coefficient of 0.171249 with oil and 0.206058 with brine. On the kit's seismic, what sign does the event carry in each case?",
 "Positive in both, a peak whose strength the oil reduces.",
 ["Negative with oil and positive with brine, since oil turns the sand softer than the Ogbia Shale above it.",
  "Negative in both, because SEG normal polarity prints an increase in impedance downwards as a trough on the trace.",
  "Positive with oil and negative with brine."],
 "SEG normal polarity prints an impedance increase downwards as a positive number. Both coefficients are positive; the oil lowers the peak by 0.034809 without changing its sign.")

q(3, "The Ekene-1 oil leg's mu-rho is printed as 14.404584. In what unit, and from what is it built?",
 "In 10^12 kg^2/(m4 s2), which is (GPa)(g/cc); it is SI squared, SI being Vs times density.",
 ["In GPa alone, as the shear modulus mu = rho Vs^2 read straight from the logs without any density factor.",
  "In kg/(m2 s), since mu-rho is the shear impedance, Vs times density, printed in the units of AI.",
  "In units of 10^6 kg/(m2 s), as AI squared less twice SI squared, the Goodway, Chen and Downton lambda term."],
 "After Goodway, Chen and Downton, mu-rho = SI^2 and lambda-rho = AI^2 - 2 SI^2. The oil-leg SI is 3795337.170439 kg/(m2 s), and its lambda-rho prints as 15.267400.")

q(1, "A depth of 1548.000000 turns up in a table of the top of the Ekene Sand at Ekene-1. What has happened?",
 "It is the kit's figure in metres; the course prints the same top as 5078.740157 ft, feet being metres / 0.3048.",
 ["It is a two-way time in milliseconds that was pasted into the depth column of the table by mistake.",
  "It is the true vertical depth of a deviated well, which reads shallower than the measured depth of the same top.",
  "It is the depth below sea level, the measured depth less the KB elevation of 82.020997 ft."],
 "The kit writes metres and the course converts: 1548.000000 m is 5078.740157 ft. The pack wells are vertical, so no deviation correction applies.")

# X m01+m06
q(2, "The same defect, a Vs above Vp, reaches elasticPoint in one layer and zoeppritzRpp as the upper layer of a model. What do the two engines do?",
 "elasticPoint hands back a row of NaN fields without throwing; zoeppritzRpp throws a refusal naming the upper half-space.",
 ["Both throw, because every Associate engine checks that Vs sits below Vp before it computes anything at all.",
  "Both return NaN fields, so the panel shows a gap in the elastic set and a matching gap in the angle table.",
  "elasticPoint throws, and zoeppritzRpp returns zero."],
 "A result with NaN fields is a result and no refusal: AI and Vp/Vs come back as NaN and the panel shows the gap. zoeppritzRpp is among the 21 refusals across 14 functions.")

# X m01+m02
q(0, "Why does no capstone of this course use the Ekene field as its case?",
 "The members-only videos speak the Ekene answers aloud, so a graded Ekene figure could be answered by watching a video.",
 ["The feasibility explorer runs the engines only on a pasted case, so the Ekene pack never reaches the panel that is graded.",
  "The Ekene pack is too small for the engines to run on, so each capstone ships a larger case built for the panel.",
  "The Ekene figures change with every release of the kit, so a graded answer would drift between cohorts."],
 "Each tier grades six numeric fields, each a return value of an engine on a held-out synthetic case the learner pastes into the panel. Ekene is synthetic too, cut from release ekene-demo-v3.")

# X m01+m05
q(3, "A learner types a pressure of 0 into the fluids view. The stated Ekene pressure is 3200 psia. What does the brine engine do with each?",
 "It refuses 0, since it needs a positive pressure, and runs 3200 psia as 22.063223 MPa.",
 ["It accepts 0 and returns the brine at surface conditions, and it reads the stated 3200 as MPa without any conversion.",
  "It refuses both, since Batzle-Wang takes pressure in psia and the panel passes the typed figure straight through.",
  "It clamps 0 to the lowest pressure it accepts and returns brine at 1005.203569 kg/m3 for both entries."],
 "The engines work in SI, so the panel converts psia to MPa at 145.037738 psi to the MPa. At the stated conditions the brine reads 1005.203569 kg/m3 and 2.662550 GPa.")

# ---------------- m02 the data inventory ----------------

# X m02+m04
q(1, "Ekene-9 carries a sonic, a shear sonic and 24 checkshot levels, yet its usability cell is missing. Why?",
 "Density is a required item and it is absent, and a cell takes the worst of its items; AI is Vp times density, so no impedance can be formed there.",
 ["Its deviation survey is absent, and an absent survey is missing because a deviated well cannot be placed in depth without one.",
  "Its shear item is missing, because a deviated well's shear sonic is never accepted in place of a Greenberg-Castagna estimate.",
  "Its checkshots are too few."],
 "Sonic and density are required; Ekene-9's curves are CALI, GR, DT, DTS and RT, and its density item reads \"No density over the zone.\" Its survey and checkshots grade good.")

q(3, "The headers cover 12 wells but the usability matrix has only 10 cells. Which wells are left out, and why?",
 "Ekene-11, which is planned, and Ekene-12, a survey location; neither has logs.",
 ["Ekene-8 and Ekene-9, because a deviated well is graded only after its deviation survey has been checked by hand.",
  "Ekene-9 and Ekene-10, the two wells whose curve lists differ from the 11 curves the other logged wells carry.",
  "Ekene-1 and Ekene-4, the wells whose curves the pack replaces with the kit's own PHIT, VSH and SW."],
 "10 of 12 wells have logs. Ekene-11 is planned and Ekene-12 is survey only, with no curves and 0 checkshot levels, so there is nothing to grade over the zone.")

q(0, "Suppose the pack's PHIT, VSH and SW for Ekene-1 were read into the usability matrix as its porosity, shale volume and saturation curves. How would its cell then read?",
 "Good, because every other item at Ekene-1 already grades good and a cell takes the worst of its items.",
 ["Still limited, because the pack curves are the kit's interpretation and the matrix grades an interpretation below a log.",
  "Missing, since curves brought in from outside the LAS files are read by the matrix as absent over the zone.",
  "Limited until the issue register's 31 lines are each kept, edited or dismissed by the user."],
 "Ekene-1 grades good on sonic, density, shear, checkshots, datum and survey, and limited only on porosity, vsh and sw. The 25 checkshot levels are well above the two the rule needs.")

q(2, "A new well arrives with sonic, density, porosity, shale volume, saturation, checkshots, a set elevation and a survey, but no shear sonic. What would the issue register suggest for it?",
 "One medium issue, for shear: an absent shear is limited, and a limited item is a medium issue.",
 ["One high issue, for shear, because every shear-dependent result at the well would then rest on an estimate.",
  "No issue at all, since Greenberg-Castagna supplies shear from Vp and the cell grades good with the estimate in place.",
  "Two medium issues, one for shear and one for the Vp/Vs that a missing shear sonic leaves without a measurement."],
 "Shear, porosity, shale volume and saturation are limited when absent, because the study can go on with an estimate. A missing item is a high issue and a limited one medium, one issue per well and item kind.")

q(1, "A well has every curve but only one checkshot level and an unset elevation. How does its usability cell read?",
 "Missing, because an unset elevation is missing and the cell takes the worst of its items.",
 ["Limited, because both shortfalls can be worked around with an estimate and neither stops the rock physics from running.",
  "Good, since sonic and density are present and those are the only two items the matrix treats as required.",
  "Limited for the checkshots, with the elevation ignored because the matrix reads datum only for a deviated well."],
 "Fewer than two checkshot levels is limited, and an unset elevation is missing. One missing item makes the cell missing however good the rest.")

# X m02+m05
q(2, "Could the course's oil-to-brine substitution run on the logs of Ekene-5 to Ekene-10 as the headers stand?",
 "Not until porosity, shale volume and saturation curves are brought in: substitution reads each sample's PHIT, Vsh and Sw, and the pack carries those for Ekene-1 to Ekene-4 alone.",
 ["Yes, at every one of them, because the substitution reads only Vp, Vs and density, and those come from DT, DTS and RHOB.",
  "Yes, but only at the deviated wells, since a deviation survey is what lets the engine place each sample in the oil leg.",
  "No, because the usability cells of those wells are missing."],
 "The method mixes minerals on the sample's Vsh, mixes the in situ fluid by Wood at its Sw, and runs Gassmann with its PHIT. Those three curves read as absent in every LAS file, so the cells are limited, and the pack adds them for four wells only.")

# X m01+m02
q(0, "Why do the measured depths of Ekene-1 to Ekene-4 read straight down, when Ekene-8 to Ekene-10 need their surveys?",
 "The four pack wells are vertical; Ekene-8, Ekene-9 and Ekene-10 are deviated.",
 ["The four pack wells have no deviation survey at all, so the matrix grades their survey item limited and assumes vertical.",
  "Measured depth below the kelly bushing is defined as vertical depth for every well, so no survey ever changes it.",
  "The kit writes the pack wells in feet and the deviated wells in metres, and a metre depth needs a survey to convert."],
 "Depths are measured depth below the kelly bushing in feet, and the pack wells are vertical. The inventory lists Ekene-8 to Ekene-10 as deviated, and their survey items grade good.")

# ---------------- m03 seismic QC ----------------

# X m03+m06
q(3, "The Ekene full stack is measured in a shallow window and a deep one. Which figures does the feasibility verdict quote for the band and the signal?",
 "The 800 to 1600 ms figures, the window that holds the Ekene Sand: -6 dB 14.425434 to 34.787627 Hz and a median of 361.155122.",
 ["The 1600 to 2400 ms figures, a peak of 21.761176 Hz and a median of 77.008444, because the deepest window is the hardest test.",
  "The 800 to 2400 ms figures, a -6 dB band of 15.790410 to 34.601268 Hz, because the longest window gives the steadiest spectrum.",
  "The single Ekene-1 trace, -6 dB 30.556053 to 32.127840 Hz, because the verdict is written for the well where the sand is logged."],
 "The spectrum window 800 to 1600 ms holds the Ekene Sand, and the verdict's band and signal rows read that window: 14.425434 to 34.787627 Hz, peak 31.374887 Hz, and 361.155122 (25.576938 dB).")

# X m03+m06
q(1, "A draft verdict says the band at the target is 30.556053 to 32.127840 Hz at -6 dB. What did its writer measure?",
 "The spectrum of the single trace at Ekene-1, whose -6 dB band is a sliver around its peak.",
 ["The mean spectrum of the 120 spread traces with no taper, which narrows the band by leaving the trace ends sharp.",
  "The -20 dB edges of the mean spectrum, read at 10^(-20/20) of the peak amplitude in place of 10^(-6/20).",
  "The deep window of 1600 to 2400 ms, where absorption has narrowed the band of the full stack."],
 "That trace's peak of 31.418177 Hz and centroid of 26.664566 Hz land near the mean's 31.374887 and 26.656573 Hz; only its band collapses. The verdict's band row needs the mean of stated traces.")

q(0, "The Ekene mean spectrum's peak amplitude is 3269.099145, above every tabled amplitude, the largest of which is 2691.535156 at 24.902344 Hz. Why?",
 "The peak is refined between frequency steps by a parabola through the three highest values.",
 ["The peak is read from a single trace at Ekene-1, whose spiky spectrum stands above the mean of the 120 spread traces.",
  "The table is printed after the taper of 0.100000 and the peak before it, so the two amplitudes come from different traces.",
  "averageSpectrum sums the amplitude of the traces at the peak and averages it elsewhere, which lifts the peak alone."],
 "The frequency step is 0.488281 Hz and the peak falls between steps at 31.374887 Hz; the parabola through the highest three values places it there and can sit above any tabled amplitude.")

q(2, "The coherency method turns the correlation c of two neighbouring traces into a power ratio c / (1 - c). What does it assume about the two traces?",
 "They carry the same signal and independent noise of equal power.",
 ["They carry independent signal and the same noise, so their correlation measures how much noise the pair shares.",
  "They are separated by exactly one bin, with no dip between them, so the lag search is never needed.",
  "Both are tapered at 0.100000 first."],
 "This is Hatton, Worthington and Makin's form. On the 20 pairs along inline 1027, 800 to 1600 ms, the median is 361.155122, which is 25.576938 dB as 10 log10 of a power ratio.")

q(1, "A neighbouring pair on some other survey returns a signal to noise of 999998.999971. How should a study read it?",
 "Only as nearly identical traces: the correlation has hit the engine's cap and this is that cap's ratio.",
 ["As an exceptionally clean dataset, far cleaner than the Ekene shallow window's median of 361.155122 and ready for any attribute.",
  "As a refusal, since the engine's own words for neighbouring traces of nulls are \"No neighbouring pair had samples to correlate.\"",
  "As an amplitude ratio, to be put in decibels with 20 log10."],
 "With c / (1 - c), a correlation near 1 sends the power ratio up without bound; capped at 0.999999 it stops at 999998.999971. QI Studio prints 10,000 or more as over 10,000 (over 40 dB).")

q(3, "The Ekene crossline stripe reports 8.500000 cycles at a period of 15.058824 lines. How is that cycles figure obtained, and does it satisfy its part of the rule?",
 "Lines in the slice over the period, 128 over 15.058824; it clears the five repeats the rule asks for.",
 ["Repeats counted along the inline axis, 128 over 13.473684; it falls short of the ten cycles the rule asks for.",
  "The prominence over the share, 27.724874 over 0.015148, which the rule needs to be at least five before a stripe is called.",
  "The period divided by the shortest period searched, 15.058824 over 2, which clears the rule's minimum of three."],
 "Cycles count how often the period repeats across the 128 crosslines of the slice. That test and the prominence test are met here; it is the share, 0.015148 against the 0.3 needed, that stops the call.")

q(0, "The designed teaching stripe multiplies every sixth crossline by 1.2. What does the search along the inlines return on that slice?",
 "A period of 13.473684 lines, share 0.014803 and no footprint: the axis the stripe was not added to does not move.",
 ["A period of 5.953488 lines with share 0.490123, because a gain stripe on one axis shows equally on the other.",
  "A refusal, since a slice with a stripe added by hand falls short of the engine's minimum of 4 by 4.",
  "A period of six lines exactly, share above 0.3, called a footprint on both axes by the rule."],
 "Along the crosslines the designed stripe is found at 5.953488 lines with share 0.490123 and prominence 467.977933. Along the inlines the slice still reads 13.473684 lines and a share of a few hundredths.")

# ---------------- m04 elastic logs at the wells ----------------

q(2, "A well in the Ekene Sand water leg has no shear log and is filled with Greenberg-Castagna. Judged on Ekene-1, which way is that estimate biased?",
 "Low: the regression gives less shear than this rock carries.",
 ["High: a Vp/Vs on it would read too low.",
  "Not at all: the coefficients fit rock like this.",
  "Low in the shale and high in the sand, because gcSandShaleVs mixes the two on Vsh and the sand term overshoots."],
 "Over the 103 water-leg samples measured over predicted averages 1.036576, and every tabled row is above 1, from 1.020609 to 1.062182.")

# X m04+m05
q(1, "Over the oil-leg samples measured / Greenberg-Castagna reads 1.151143, and substitution to brine moves Vs only a little. What one fact about the rock ties the two together?",
 "The pore fluid leaves the shear modulus alone: the oil softens Vp without touching shear, and substitution keeps the shear modulus fixed.",
 ["Oil stiffens the shear modulus of the frame, so measured Vs rises in the oil leg and substitution to brine raises it again.",
  "The oil leg holds more samples than the water leg, so its mean ratio is less affected by the noise of single samples.",
  "Greenberg-Castagna predicts shear from density alone."],
 "In the oil leg the regression reads a softened Vp and predicts too little shear. Substitution keeps the shear modulus and swaps the density, so Vs at 5082.000000 ft moves only from 1358.537000 to 1349.137957 m/s.")

q(3, "At Ekene-1 the cap rock reads Vp/Vs 2.916045 and Poisson's ratio 0.433363. How do the two legs compare?",
 "Both legs sit well below it: the oil leg at 1.749257 and 0.257270, the water leg at 1.827552 and 0.286320.",
 ["Both legs sit above the cap rock, since a sand that carries hydrocarbon raises its Vp/Vs and its Poisson's ratio together.",
  "The oil leg sits above the cap rock and the water leg below it, because the oil lowers Vs further than it lowers Vp.",
  "All three layers read close together, since each mean is taken with the same Vsh cut-off of 0.350000."],
 "The elastic set on the layer means puts the Ogbia Shale cap rock far above either leg in Vp/Vs and Poisson's ratio. The cap rock is a stated 65 ft of log, with no cut-off applied to it.")

q(0, "A study pools Ekene-1 to Ekene-4 to calibrate its Vs from Vp relation on their brine-bearing clean sand. How does the pooled fit compare with Ekene-1 alone?",
 "465 samples give slope 872.045751 and s 39.612304 m/s, against 855.280029 and 41.009437 m/s at Ekene-1.",
 ["It returns the same slope of 855.280029, since every pack well sits on the same Ekene earth model and the fit is linear.",
  "It refuses, because the four wells' water legs span different depths and the engine fits one well at a time.",
  "The slope settles onto the Greenberg-Castagna sandstone a1 of 0.804160."],
 "More wells move the slope, so a study states which wells it fitted. At 3100 m/s the pooled fit predicts 1681.273188 m/s against 1680.985632 at Ekene-1.")

# X m04+m06
q(2, "The capstone grades the slope of the local shear trend. In what unit is it read, and on which samples is it fitted?",
 "c1 in m/s of Vs per km/s of Vp, fitted on the case's water-leg net sand in the form the case states.",
 ["The slope in m/s per m/s, a dimensionless ratio, fitted on every net sand sample of the case well, both legs together.",
  "The ratio of measured over Greenberg-Castagna Vs, fitted on the case's oil leg where the fluid effect is largest.",
  "c0 in m/s, fitted on the cap rock, because the intercept is the term the shale fixes."],
 "fitVsRegression regresses Vs in m/s on Vp in km/s, so the slope c1 is in m/s per km/s; at Ekene-1 it is 855.280029. The capstone fits the case's water-leg net sand.")

# X m04+m05
q(1, "Which comparison at Ekene-1 isolates what the oil alone does to AI (acoustic impedance)?",
 "The oil leg against the same samples taken to brine: the mean AI rises 7.456776 percent, 6641244.924742 to 7136467.682134 kg/(m2 s).",
 ["The oil leg against the measured water leg, 6639018.603084 against 7358819.677147 kg/(m2 s), since both legs sit in one sand.",
  "The cap rock against the oil leg, 4697628.723902 against 6639018.603084 kg/(m2 s), the contrast at the top of the sand.",
  "The live oil against the brine, 0.852881 against 2.662550 GPa."],
 "Substitution keeps each sample's porosity and clay and swaps only the pore fluid. The legs are different rock, oil leg porosity 0.203626 and Vsh 0.178134 against 0.197677 and 0.117854.")

q(3, "Calibrated at Ekene-1, fitVsRegression reports 101 degrees of freedom beside its coefficients. How is that figure reached?",
 "n less the number of coefficients: 103 samples less the two of a linear fit, c0 and c1.",
 ["103 less the two samples at the ends of the Vp range, 2670.381000 and 3481.638000 m/s, which fix the calibration limits.",
  "The 103 samples less the two that sit nearest the oil-water contact, which the fit sets aside as mixed fluid.",
  "The samples left after the two refusal checks remove any pair with no measured Vs, so it depends on the log."],
 "fitVsRegression returns n, the degrees of freedom, the residual standard error s of 41.009437 m/s and R squared 0.925483. A quadratic fit adds c2, a third coefficient.")

# ---------------- m05 will the fluid show ----------------

q(2, "At the oil-leg mean Sw of 0.574254, the Wood mix gives a pore-fluid modulus of 1.398867 GPa. Where does that sit between the two phases?",
 "Near the softer phase: live oil is 0.852881 GPa and brine 2.662550 GPa, and the Wood average stays near the softer one until the brine fraction is high.",
 ["Midway, because Wood's average is the volume-weighted mean of the two moduli and the saturation is close to one half.",
  "Near the brine, since water is the wetting phase and a mix of more than half brine behaves as brine.",
  "Above both phases, because mixing two fluids stiffens the mixture past either one alone."],
 "Wood's mix is the uniform (Reuss) mix. At Sw 0.500000 it reads 1.291926 GPa and at 0.800000 only 1.869288 GPa, so the modulus climbs fastest near full brine.")

q(1, "At 180 degF and 3200 psia, how do brine and live oil compare in bulk modulus, the property substitution turns on?",
 "Brine reads 2.662550 GPa and the live oil 0.852881 GPa.",
 ["The oil is the stiffer of the two, since an oil of 32 API carrying gas at 400 scf/stb is denser than brine at a salinity of 0.035000.",
  "They read the same once both are converted to SI, because Batzle-Wang returns one modulus for every pore fluid at a given pressure.",
  "Brine reads 1.398867 GPa and the oil 0.987056 GPa, the two moduli the Wood mix returns at reservoir conditions."],
 "Batzle and Wang at the stated conditions give brine 1005.203569 kg/m3 and 1627.503313 m/s, live oil 754.214377 kg/m3 and 1063.400328 m/s: the brine is denser and far stiffer.")

q(3, "Among the tabled Ekene-1 oil-leg samples, where does substitution to brine raise Vp the most and where the least?",
 "Most at 5082.000000 ft, Sw 0.416600, from 2474.227000 to 2733.411573 m/s; least at 5114.000000 ft, Sw 0.786200, from 3129.781000 to 3248.090773 m/s.",
 ["Most at 5114.000000 ft, where a high Sw of 0.786200 is read as the most oil left to replace, and least at the shallow sample of 5082.000000 ft with its Sw of 0.416600.",
  "Equally at every sample, since Gassmann raises Vp by the same fraction wherever the frame and the porosity are held fixed.",
  "Most where the mineral modulus is highest, 35.087723 GPa at 5114.000000 ft, as a stiffer mineral carries the fluid further."],
 "The deep sample already holds mostly brine: its in situ fluid modulus is 1.831634 GPa against 1.189766 GPa at 5082.000000 ft, so there is less to substitute.")

# X m01+m05
q(0, "Substitution to brine raises the density of the 5082.000000 ft sample from 2311.300000 to 2343.616460 kg/m3. What sets the size of that rise?",
 "The porosity times the gap between the brine density and the in situ fluid density.",
 ["The rise in the dry-rock modulus, since Gassmann stiffens the frame when brine enters the pores and packs the grains.",
  "The mineral modulus of 30.444339 GPa, raised by the brine.",
  "The shear modulus, which grows with the fluid density."],
 "The shear modulus does not change, and the density swaps the pore fluid: rho_new = rho + phi (rho_brine - rho_fluid). Brine is 1005.203569 kg/m3 and live oil 754.214377 at the stated conditions.")

q(2, "One interpreter reads the Ekene-1 brine top's distance from the trend fitted to the well's substituted boundaries; another reads it from Castagna, Swan and Foster. They get -0.004519 and -0.363599. Who is wrong?",
 "Neither: the two lines differ, and which one a distance is read from is a stated choice.",
 ["The second: the published slope needs a Gardner exponent the logs lack.",
  "The first, since a line fitted on one well's boundaries cannot be checked and the published line is the reference.",
  "Both, since a brine top must read zero from any wet trend."],
 "The fitted slope at 16 ft blocks is -2.257963 and the published one at Vs/Vp 0.408987 is -0.404345. A lesson names which line it means, and a verdict states it.")

q(1, "Three block lengths, 8, 16 and 24 ft, are tried on the Ekene-1 wet trend. Which statement about its interfaces and slopes holds?",
 "Interfaces fall from 49 to 24 to 16, and the slope moves from -2.565814 to -2.257963 to -2.254272.",
 ["Interfaces stay at 24 and only the slope moves, because blocking changes the means and leaves the boundaries where they are.",
  "Interfaces rise with the block length, since a longer block holds more samples and so more boundaries between them.",
  "Nothing changes: block length is a display setting and the line is fitted on the raw samples."],
 "Blocks carry their mean Vp, Vs and density, and each boundary between two blocks gives one (A, B) point. The rms distance reads 0.006424, 0.006806 and 0.005925 across the three.")

q(3, "Before the Ekene-1 wet trend is fitted over the whole pack window, which samples are taken to brine?",
 "Every sample with oil in it, Sw below 1: 79 of the 800.",
 ["Only the 65 oil-leg net sand samples, since the cap rock and the shale above carry no saturation curve to substitute.",
  "All 800 samples, because a wet trend is defined on brine and every sample has its fluid replaced whatever its Sw.",
  "The 103 water-leg samples alone."],
 "The logs are then blocked at 16 ft, 32 samples a block, giving 25 blocks and 24 interfaces, and each interface gives an intercept and a gradient by Shuey.")

# ---------------- m06 the feasibility verdict ----------------

# X m05+m06
q(0, "At the top of the Ekene Sand, which measure separates the oil from the brine case and which does not?",
 "The distance from the fitted wet trend does, -0.072091 against -0.004519; the class does not, class I both ways.",
 ["The class does, class III in situ against class I with brine; the distance does not, since both points sit on the trend.",
  "Neither does: the intercepts of 0.170742 and 0.205564 lie inside the 0.02 band, so both cases read the same.",
  "Both do, since the class changes from I to II exactly where the distance crosses zero."],
 "Against the fitted line the in situ interface lies 0.067572 further to the hydrocarbon side than the same rock with brine. Both intercepts are well above 0.02, so both are class I.")

q(1, "On the Ekene-1 wet trend, the boundary whose lower block sits at 5059.500000 ft gives A 0.000627 and B -0.001871. How would avoClass name it?",
 "Class II, because A lies within 0.02 of zero.",
 ["Class III, because B is at or below zero and that is the condition for class III whatever the intercept.",
  "Class I, since its intercept is positive.",
  "Class IV, as a small positive A with a falling gradient is the class IV pattern of Rutherford and Williams."],
 "The band is 0.02 either side of zero and 0.000627 lies inside it, so the sign of B does not enter. The Ekene top's A of 0.170742 sits above the band and reads class I.")

q(3, "The modelled Ekene-1 top is dimmer with oil at every angle. How does the gap between the in situ and brine coefficients change from near to far?",
 "It widens: 0.034809 at normal incidence and 0.066214 at 30 degrees, and the far means read 0.073416 against 0.144237.",
 ["It narrows, from 0.066214 near the normal to 0.034809 at 30 degrees, so the near stack separates the two cases best.",
  "It stays at 0.034809 at every angle, because both cases share one cap rock above the interface and its contrast is fixed.",
  "It reverses, the in situ coefficient rising above the brine one beyond 25 degrees as the oil curve turns back up."],
 "The near means read 0.156172 against 0.192995 and the far 0.073416 against 0.144237: the in situ coefficient is below the brine one throughout, and further below at the far angles.")

q(2, "Shuey's intercept for the in situ top is 0.170742. How does it compare with the exact Zoeppritz coefficient at 0 degrees?",
 "It sits close, at 0.170742 against an exact 0.171249.",
 ["It is twice the exact figure, since Shuey's A is the sum of the impedance and the shear contrasts at normal incidence.",
  "It equals the near mean, 0.156172.",
  "It is the exact coefficient at 30 degrees, 0.070998, since Shuey's terms are read at the far end of the stated range."],
 "With brine the pair reads 0.205564 against 0.206058. The intercept is Shuey's normal-incidence term, and the exact plane-wave coefficient at 0 degrees lands near it in both cases.")

# X m01+m06
q(0, "Which of these belongs to the interpreter and to no engine in a feasibility study of the Ekene Sand?",
 "Writing the verdict on whether the study should go ahead, with the choices behind each number stated beside it.",
 ["Computing the -6 dB edges of the mean spectrum of the stated traces.",
  "Naming the class of the top interface from its intercept and gradient, which avoClass returns.",
  "Fitting the fluid line through the origin to the brine-substituted interfaces by total least squares, which fitFluidLine returns."],
 "Each of the other three is a function's output: spectrumStats gives the edges, avoClass the class and fitFluidLine the line. Which samples are net sand or legs is also picked before any function runs.")

q(1, "Between 30 and 35 degrees, what do the exact coefficients of the modelled Ekene-1 top do with oil and with brine?",
 "The brine coefficient turns up, 0.137212 to 0.166006, while the in situ one keeps falling, 0.070998 to 0.060228.",
 ["Both turn up together, since the critical angle of the cap rock is reached at 30 degrees in either case.",
  "Both keep falling at the same rate, so the gap between them stays at 0.066214 out to 35 degrees.",
  "The in situ coefficient turns up and crosses above the brine one, as oil brightens the top at the far angles."],
 "From 25 to 30 degrees both still fall, 0.094393 to 0.070998 in situ and 0.145543 to 0.137212 with brine; only the brine curve turns by 35 degrees.")

# X m05+m06
q(3, "Which of these is one of the six figures the Associate capstone grades?",
 "The AI and the Vp/Vs of the stated sample after substitution to brine.",
 ["The median signal to noise of the case traces.",
  "The class of the case's top interface.",
  "The usability grade of the case well, read from the matrix after the case file has been pasted into the panel."],
 "The six are the -6 dB low edge and the centroid of the case traces' mean spectrum, the slope of the local shear trend, the substituted AI and Vp/Vs of the stated sample, and the distance from the case's own fitted wet trend.")

emit(Q, '/root/qi-wip-qi/banks/qib_exam.json', expect_n=42)
finish()
