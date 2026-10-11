import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Expert m04, Properties from impedance.
# Sources: the linear transform and its interval at log scale, the left-out
# wells and the widened band at seismic scale, Bayesian facies on AI with
# sample and equal priors, two attributes, the confusion matrix on its own
# samples, and the fluid hypothesis label.

q(1, "fitLinearTransform is run on the 644 net sand samples of the Ekene Sand at the four pack wells, both legs, AI (acoustic impedance) against the kit's PHIT. What does it return?",
 "a 0.363690, b -0.022834 per 10^6 kg/(m2 s), s 0.017980 and R squared 0.323708.",
 ["a 0.302982, b -0.017033 per 10^6 kg/(m2 s) and s 0.007175, the same fit on the 644 log samples.",
  "a 0.363690 with a positive slope b per 10^6 kg/(m2 s), because harder sand carries more porosity.",
  "a 0.363690, b -0.022834 per 10^6 kg/(m2 s), with s 0.024072, the pooled scatter of the four wells about the line."],
 "At log scale on 644 samples the fit is a 0.363690, b -0.022834 per 10^6 kg/(m2 s), s 0.017980, R squared 0.323708. The figures 0.302982, -0.017033 and 0.007175 belong to the seismic-scale fit on 20 upscaled samples, 0.024072 is the pooled left-out RMS, and the slope is negative.")

q(3, "At AI 7000000 kg/(m2 s), what is Q90 of the log-scale porosity transform at the 80 percent level?",
 "0.226936, the high end of the 80 percent interval about 0.203850.",
 ["0.203850, the predicted porosity, which is the middle of the band and its Q50.",
  "0.233493, the high end of the interval at the same AI with the level stated at 90 percent.",
  "0.238378, the high end of the 80 percent interval read on the row of AI 6500000 kg/(m2 s)."],
 "At AI 7000000 the prediction is 0.203850 and the 80 percent interval runs from 0.180764 (Q10, the low end) to 0.226936 (Q90, the high end). 0.233493 is the 90 percent high end, and 0.238378 is Q90 at AI 6500000.")

q(0, "The interval level is raised from 80 to 90 percent at AI 7000000 kg/(m2 s), every other input unchanged. What does predictWithInterval return?",
 "A wider interval, 0.174207 to 0.233493, about the same prediction.",
 ["The same interval, 0.180764 to 0.226936, since the width of the band is set by s and n alone and the level only relabels its ends.",
  "A narrower interval inside 0.180764 to 0.226936, because a higher level asks for more confidence and so a tighter band about the line.",
  "A prediction moved up to 0.215267 with the 80 percent width kept, since the level shifts the line toward the upper quantile."],
 "The level enters through Student's t, so the 90 percent interval at AI 7000000 is 0.174207 to 0.233493, wider than the 80 percent 0.180764 to 0.226936. The prediction stays 0.203850; 0.215267 is the prediction at AI 6500000.")

q(2, "predictWithInterval is called at 8500000, beyond the highest of the AI values the fit was built on, 8402495.750400. What comes back?",
 "It still answers, 0.169599 within 0.146406 to 0.192792, its interval widened only by the distance term.",
 ["It refuses, with a message that the AI lies outside the calibration range of the transform it was given.",
  "It returns NaN for the prediction and both ends, the way a result with a gap is shown in a panel.",
  "It answers 0.169599 and adds an out-of-range penalty to the interval on top of the distance term."],
 "The calibration AI runs from 5693260.530000 to 8402495.750400; at 8500000 the engine still answers, 0.169599 with Q10 0.146406 and Q90 0.192792, and the interval widens only by the distance term. Nothing in the band tests whether the straight line holds out there, so a study flags the prediction itself.")

q(1, "The seismic-scale check gives s 0.007175 log against log and a pooled left-out RMS of 0.024072. What widening s_extra does calibrateProperty return?",
 "0.022977, the square root of the RMS squared less s squared.",
 ["0.024072, the pooled left-out RMS added outright.",
  "0.007175, the log-against-log error, which already carries the error of the inversion.",
  "0.017980, the residual standard error of the log-scale fit on the 644 samples of both legs."],
 "s_extra = sqrt(RMS^2 - s^2) when the RMS exceeds s, so 0.024072 and 0.007175 give 0.022977. The RMS is the input, s the log scatter it is set against, and 0.017980 belongs to the log-scale fit.")

q(3, "Why does the left-out check widen the porosity band at all?",
 "The left-out residuals carry the inversion's error, which a log-against-log fit cannot see.",
 ["On 20 upscaled samples Student's t alone widens it, and s_extra is that rise.",
  "Each left-out well lies beyond the calibration AI, so s_extra is the distance term.",
  "The 50 Hz low-pass adds smoothing error to the logs, so s_extra measures the scatter the high cut leaves between the logs."],
 "Porosity at each left-out well is predicted from the blind inverted AI there; those residuals carry the inversion's error, and their pooled RMS of 0.024072 widens the band by 0.022977. s_extra is set from the RMS and s, so neither t nor the distance term nor the high cut is what it measures.")

q(0, "How is each well's share inside the widened 80 percent band tested, and what does Ekene-1 return?",
 "With the other wells' residuals only; Ekene-1 returns 0.600000 on 5 samples.",
 ["With every well's residuals pooled, its own included; Ekene-1 returns 1.000000 on 5 samples.",
  "With the other wells' residuals; Ekene-1 returns 0.833333.",
  "With the log-against-log s alone, 0.007175; Ekene-1 returns 0.600000, so the narrow band already covers it."],
 "Each well's coverage is tested with the other wells' residuals only, and Ekene-1 returns 0.600000 on 5 samples. 0.833333 on 6 samples is Ekene-2, and 1.000000 is Ekene-3 and Ekene-4. On so few samples a share moves in large steps.")

q(2, "In the left-out table, Ekene-4 returns its correlation as NaN on 4 samples. What is that?",
 "A result: the code returns NaN when either series has no spread over the well's samples.",
 ["A refusal: calibrateProperty stops on a well with fewer than 5 samples and names it in its message.",
  "A correlation of 0.000000 written as NaN: the two are unrelated.",
  "The bias, -0.009593, entered in the wrong column when the prediction at the well has no shape to score."],
 "A NaN correlation is the result the code returns when either series has no spread over the well's samples. It is no refusal: Ekene-4 still returns an RMS of 0.012741, a bias of -0.009593 and a share of 1.000000, and the NaN is reported as a gap.")

q(1, "What do the four left-out biases in the seismic-scale check show?",
 "Every one is negative, from -0.024560 at Ekene-1 to -0.009593 at Ekene-4.",
 ["They change sign between wells, so they cancel and leave the pooled RMS of 0.024072 to describe the scatter alone.",
  "Every one is positive, an overprediction at each well.",
  "Every one is smaller in size than s, 0.007175."],
 "The printed biases are -0.024560, -0.021598, -0.020246 and -0.009593: one sign at every well, the predictions sitting off the log in one direction. Each is larger in size than s, 0.007175, so a study reports the offset beside the RMS.")

q(3, "fitFaciesModel is fitted on AI alone with priors from the samples' proportions. At AI 6600000 kg/(m2 s), what does faciesPosterior return?",
 "Brine sand most likely, 0.557911 against oil sand 0.442088.",
 ["Oil sand most likely, 0.673039 to 0.326961.",
  "Oil sand most likely, 0.672121 to 0.280694.",
  "Shale most likely, at its prior of 0.796396."],
 "With the sample-proportion priors at AI 6600000, P(oil sand) is 0.442088 and P(brine sand) 0.557911, so brine sand is called. 0.673039 is oil sand under equal priors, 0.672121 is oil sand at AI 6000000, and 0.796396 is the shale prior, whose posterior here is 0.000000.")

q(0, "The same one-attribute model is rerun at AI 6600000 kg/(m2 s) with equal priors. What changes, and why?",
 "Oil sand becomes most likely, 0.673039; only the stated prior changed.",
 ["Nothing: the posteriors stay 0.442088 and 0.557911.",
  "Brine sand firms to 0.883173 from its 0.147012 prior.",
  "Shale is called, its 0.796396 prior set aside."],
 "With equal priors at AI 6600000 the posteriors are P(shale) 0.000000, P(oil sand) 0.673039, P(brine sand) 0.326961: the call flips from brine sand to oil sand. The prior is a stated choice and it moves the answer; 0.883173 is brine sand at AI 7800000.")

q(2, "A second attribute, Vp/Vs, is added to the facies model. At AI 6600000 kg/(m2 s), what does the two-attribute model return at Vp/Vs 1.750000 and at 2.000000?",
 "Oil sand 0.997373 at 1.750000; brine sand 1.000000 at 2.000000.",
 ["Brine sand 0.557911 at both ratios.",
  "Oil sand 0.673039; brine sand 0.326961.",
  "Brine sand 0.997373; oil sand 1.000000."],
 "At AI 6600000 the two-attribute posteriors are oil sand 0.997373 at Vp/Vs 1.750000 and brine sand 1.000000 at 2.000000, where AI alone split 0.442088 to 0.557911. The second attribute decides a point the first could not.")

q(3, "The confusion matrix of the AI-only facies model has the oil-sand row 3, 49, 127 (shale, oil sand, brine sand). What does it show, beside a share correct of 0.934872?",
 "Most of the 179 oil-sand samples, 127, are called brine sand.",
 ["160 of the 179 are called oil sand.",
  "Most of the 179 are called shale.",
  "About 0.934872 of the 179 are called oil sand."],
 "On AI alone 49 of 179 oil-sand samples are called oil sand and 127 brine sand. The share correct reads 0.934872 because shale, 2469 of 2519 correct, fills most of the matrix. 160 of 179 is the two-attribute row.")

q(1, "Adding Vp/Vs raises the share correct from 0.934872 to 0.973443. What happens to the shale row of the confusion matrix?",
 "It worsens: 2464 correct from 2469, with 36 called brine sand from 5.",
 ["It improves: 2519 of 2519 are called shale.",
  "It is unchanged at 2469 correct, since AI alone already separates shale and Vp/Vs only moves the two sands.",
  "It worsens: 45 called oil sand, from 19."],
 "Shale is called shale 2469 times on AI alone and 2464 times with Vp/Vs, and shale called brine sand rises from 5 to 36. A second attribute is no free gain in every row, so the matrix is read row by row. 45 and 19 run the other way: AI alone called 45 shale samples oil sand, the two attributes 19.")

q(0, "What kind of test are the two confusion matrices, and how does QI Studio label the classes oil sand and brine sand?",
 "Each is on the model's own samples; a class named for a fluid is labelled fluid_hypothesis.",
 ["Each is a blind test on left-out wells; oil sand and brine sand are labelled calibrated_prediction.",
  "Each is on the model's own samples; every class, shale included, is labelled fluid_hypothesis.",
  "Each is at seismic scale on blind inverted AI; oil sand is a measured fluid."],
 "Both matrices are of each model on its own samples, at log scale. A facies named for a fluid is a hypothesis about the pore fluid: QI Studio labels such a class fluid_hypothesis and every other class, shale here, calibrated_prediction.")

emit(Q, '/root/qi-wip-qi/banks/qia_m04.json', expect_n=15)
finish()
