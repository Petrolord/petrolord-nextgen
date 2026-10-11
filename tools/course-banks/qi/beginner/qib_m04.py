import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Associate m04, Elastic logs at the wells.
# Sources: what Rock Physics hands to QI and the stated selections, measured
# shear against Greenberg-Castagna, the local shear trend and its prediction
# interval, the elastic set at Ekene-1, and the m04 refusals and NaN result.

q(2, "The feasibility explorer passes elasticPoint a sample whose Vs is above its Vp. What comes back?",
 "A result with every field NaN, AI and Vp/Vs included, and the panel shows the gap.",
 ["A refusal in the engine's own words, \"Upper halfspace has vs >= vp.\", which stops the whole layer.",
  "A refusal in the engine's own words, \"vp, vs and rho must be positive.\", as Gassmann's check on its inputs.",
  "A result with Vs clamped to the sample's Vp, so AI is finite and Vp/Vs reads exactly one."],
 "elasticPoint with Vs above Vp does not throw: it returns every field as NaN, a result with empty fields that a study reads as a data problem at that sample. The halfspace message belongs to zoeppritzRpp and the positivity message to substituteVels; no engine clamps Vs to Vp.")

q(0, "A learner fits the local shear trend, linear, on only three measured Vp and Vs pairs. What does fitVsRegression do?",
 "It refuses, in the engine's own words: \"Need at least 5 samples with measured Vp and Vs (got 3).\"",
 ["It refuses, in the engine's own words: \"The regression is singular (Vp has no spread).\"",
  "It returns a line through the three pairs with a residual standard error of zero and an R squared of one.",
  "It returns NaN coefficients, the way elasticPoint returns NaN fields when its input has no physical answer."],
 "Three pairs are too few for a linear fit with its two coefficients and degrees of freedom left over, so the engine refuses with the message about five samples. The singular message comes from six pairs all at Vp 3000 m/s, and a NaN result is elasticPoint's behaviour, which the fit does not share.")

q(3, "In the feasibility explorer the net sand Vsh cut-off is moved up and down from 0.350000 at Ekene-1. Which layer's sample count stays at its Ekene figure, and why?",
 "The cap rock's 130 samples, because it is the 65 ft of log above the top of the Ekene Sand and has no Vsh rule.",
 ["The oil leg's 65 samples, because the oil-water contact at 5118.110236 ft fixes the leg whatever the cut-off.",
  "The water leg's 103 samples, because every sample below the contact is counted whatever its shale volume reads.",
  "The net sand's 168 samples, because the cut-off is applied after the count and only reweights the layer means."],
 "Net sand is Vsh at or below the stated cut-off, and the oil leg (65) and water leg (103) are net sand above and below the contact, so both move with it. The cap rock is a stated thickness of log, the 65 ft above the top, 130 samples, and moves only with its own control.")

q(1, "Over the 103 water-leg net sand samples of Ekene-1, what is the mean of measured Vs over the Greenberg-Castagna Vs?",
 "1.036576, so on average the measured shear sits above what the published regression predicts.",
 ["1.151143, the mean over the oil-leg samples, where the oil has softened the Vp the regression is given.",
  "0.925483, the R squared of the local shear trend fitted to the same 103 water-leg samples by least squares.",
  "1.062182, the ratio at 5144.000000 ft, the largest of the six tabled samples, read as the mean of the leg."],
 "The mean of measured over Greenberg-Castagna over the 103 water-leg samples is 1.036576, above one, so the regression gives too little shear for this sand. 1.151143 is the oil leg, 0.925483 is a fit statistic of the local trend, and 1.062182 is one sample.")

q(1, "Measured over Greenberg-Castagna Vs is 1.036576 in the Ekene-1 water leg. What is it over the 65 oil-leg samples, and what does the course say drives it?",
 "1.151143, because the oil softens Vp and leaves the shear modulus alone.",
 ["1.036576 again, because the published coefficients describe the same sandstone in both legs of the Ekene Sand.",
  "0.925483, because the oil stiffens the shear modulus and pulls the measured shear below the regression.",
  "1.151143, because the oil leg is cleaner sand, so the engine applies the shale coefficients 0.769690 and -0.867350."],
 "Over the 65 oil-leg samples the ratio is 1.151143: the oil softens Vp and leaves the shear modulus alone, so a regression fed that lower Vp predicts less shear than the rock carries. The oil leg is the shalier leg (Vsh 0.178134 against 0.117854), and the engine mixes the two lithologies on Vsh.")

q(3, "How does gcSandShaleVs predict shear for an Ekene sample with some shale in it?",
 "From the sandstone (a1 0.804160, a0 -0.855880) and shale (a1 0.769690, a0 -0.867350) regressions in km/s, mixed on Vsh as the average of their arithmetic and harmonic means.",
 ["From the sandstone regression alone (a1 0.804160, a0 -0.855880) whenever the sample's Vsh is at or below the 0.350000 net sand cut-off.",
  "From the local trend fitted at the well (c0 -970.382459, c1 855.280029), which the engine substitutes for the published coefficients once a shear log exists.",
  "From the shale regression alone (a1 0.769690, a0 -0.867350) in m/s, because any clay in the sample lowers its shear toward the shale line."],
 "Greenberg-Castagna is a published regression per lithology, Vs = a2 Vp^2 + a1 Vp + a0 in km/s, and a mixed sample is weighted on Vsh as the average of the arithmetic and harmonic means of the two predictions. The local trend is a separate fit, fitVsRegression, and the net sand cut-off picks samples; it does not pick coefficients.")

q(0, "What slope does the linear local shear trend return on the 103 water-leg net sand samples of Ekene-1?",
 "855.280029 m/s of Vs per km/s of Vp.",
 ["872.045751, the four-well slope.",
  "3017.560894, the quadratic c1.",
  "0.804160, the sandstone a1."],
 "The linear fit on Ekene-1's water leg gives c1 855.280029 m/s per km/s with c0 -970.382459 m/s. Fitting all four wells (465 samples) moves the slope to 872.045751, the quadratic's c1 3017.560894 belongs to a different form with a c2 term, and 0.804160 is the published sandstone regression.")

q(2, "At the 0.900000 level, predictVs is asked for Vs at Vp 3700 m/s on the Ekene-1 water-leg trend. What does it return?",
 "Vs 2194.153650 m/s, sigma 43.298759 m/s, flagged as extrapolated because 3700 m/s lies above the highest calibrated Vp of 3481.638000 m/s.",
 ["A refusal, because a Vp outside the calibration range of 2670.381000 to 3481.638000 m/s has no prediction interval the engine can compute.",
  "Vs 1852.041638 m/s, the prediction at the highest Vp the engine will use, since it holds every Vp above the range at the last calibrated value.",
  "Vs 2194.153650 m/s with sigma 41.009437 m/s, unflagged, because an R squared of 0.925483 keeps the line trusted beyond its samples."],
 "A Vp outside the calibration range still gets a prediction, but it is flagged as extrapolated and its sigma grows, here to 43.298759 m/s: the line is being trusted where no sample supports it. The engine neither refuses nor clamps, and sigma is s sqrt(1 + leverage), so it never equals s alone.")

q(3, "The prediction interval at Vp 3100 m/s is 1612.548122 to 1749.423143 m/s at the 0.900000 level. What does the engine return at the 0.8 level?",
 "1627.805269 to 1734.165996 m/s, a narrower interval.",
 ["1612.548122 to 1749.423143 m/s, unchanged.",
  "1615.915396 to 1746.630980 m/s.",
  "A wider interval than at 0.900000, because a lower level loosens the fit and so raises the residual standard error."],
 "The level is a stated choice. At 0.8 the interval at 3100 m/s is 1627.805269 to 1734.165996 m/s, narrower than at 0.900000, and a narrower band is a weaker promise. 1615.915396 to 1746.630980 m/s is the four-well fit at 0.900000, and the level does not touch s.")

q(0, "A learner passes fitVsRegression six measured pairs, every one at Vp 3000 m/s. What happens?",
 "The engine refuses: \"The regression is singular (Vp has no spread).\"",
 ["The engine refuses: \"Need at least 5 samples with measured Vp and Vs (got 3).\", the count check every fit runs first.",
  "It drops the repeats and fits one pair.",
  "It returns every coefficient as NaN."],
 "Six pairs pass the count check, but with no spread in Vp the least squares system is singular and the engine refuses with that message. The count message needs fewer than five pairs, and the fit returns no NaN result in place of a refusal.")

q(2, "The local shear trend at Ekene-1 is refitted in the quadratic form on the same 103 samples. What changes?",
 "s falls from 41.009437 to 39.004155 m/s, and the prediction at Vp 3100 m/s becomes 1690.797241 m/s.",
 ["s falls to 39.612304 m/s and the prediction at 3100 m/s becomes 1681.273188 m/s, as the extra coefficient takes up curvature.",
  "s rises above 41.009437 m/s with the extra term.",
  "Nothing: 1680.985632 m/s at 3100 m/s."],
 "The form is a stated choice. The quadratic gives c0 -4335.156360, c1 3017.560894, c2 -346.356417, s 39.004155 m/s and 1690.797241 m/s at 3100 m/s; the extra coefficient buys a smaller s. 39.612304 and 1681.273188 are the four-well linear fit.")

q(1, "Which sigma comes back beside the Vs predicted for 3100 m/s from the Ekene-1 water-leg fit?",
 "41.225414 m/s, s times sqrt(1 + leverage).",
 ["41.009437 m/s, the fit's s alone.",
  "43.298759 m/s, the 3700 sigma.",
  "39.612304 m/s, the four-well s."],
 "Sigma is s sqrt(1 + leverage), so it sits above the fit's scatter s of 41.009437 m/s: 41.225414 at 3100 m/s, 41.646413 at 2900 and 43.298759 at the extrapolated 3700. The level enters through t in the interval, and 39.612304 belongs to a different fit.")

q(0, "What AI (acoustic impedance) does elasticPoint return for the Ekene-1 oil leg, run on the layer's mean Vp, Vs and density?",
 "6639018.603084 kg/(m2 s).",
 ["7358819.677147 kg/(m2 s), the water leg's AI, which elasticPoint returns for the whole net sand of the Ekene Sand.",
  "3795337.170439, its SI.",
  "4697628.723902, cap rock."],
 "AI is Vp times density, and on the oil leg's means (2865.750738 m/s and 2316.676923 kg/m3) elasticPoint returns 6639018.603084 kg/(m2 s). 3795337.170439 is the oil leg's SI, Vs times density; 7358819.677147 is the water leg and 4697628.723902 the cap rock.")

q(3, "At Ekene-1 the cap rock's AI (acoustic impedance) is 4697628.723902 kg/(m2 s) and both legs read higher. On the kit's SEG normal polarity, what is the top of the Ekene Sand?",
 "A peak, an increase in impedance downwards.",
 ["A trough, because the shale's Vp/Vs of 2.916045 stands far above both legs and the reflection follows Vp/Vs.",
  "A trough, set by density.",
  "No reflection, because the shale's lambda-rho of 16.877337 sits between the oil leg's and the water leg's lambda-rho."],
 "On SEG normal polarity an increase in acoustic impedance downwards is a peak, and the Ekene Sand is harder than the Ogbia Shale at Ekene-1 (AI 6639018.603084 and 7358819.677147 against 4697628.723902). The sign follows AI; Vp/Vs, density alone and lambda-rho do not set it.")

q(2, "At Ekene-1 the oil leg is softer than the water leg in AI (acoustic impedance) and Vp/Vs. What does the course say that gap is made of?",
 "Part fluid and part rock: the oil leg has porosity 0.203626 and Vsh 0.178134, the water leg 0.197677 and 0.117854.",
 ["Fluid alone, because both legs are net sand under the same 0.350000 cut-off and so share one rock frame throughout.",
  "Rock alone, because mu-rho differs between the legs (14.404584 against 16.213500) and a pore fluid leaves mu-rho unchanged.",
  "Fluid alone, because the water leg is the shalier sand and its clay and the brine in it cancel each other out."],
 "The legs are different net sand: the oil leg's porosity and Vsh are 0.203626 and 0.178134, the water leg's 0.197677 and 0.117854, so comparing them mixes fluid and rock. The water leg is the cleaner leg, a shared cut-off does not make one rock, and substituting brine into the same oil-leg rock is how the next module separates the two.")

emit(Q, '/root/qi-wip-qi/banks/qib_m04.json', expect_n=15)
finish()
