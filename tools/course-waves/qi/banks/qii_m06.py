import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Professional m06, AVO at the wells.
# Sources: QI Studio's comparison at the wells (app code, keyed only on the
# lines the course prints): its inputs, the one scale, the scaled points and
# residuals, the classes at the 0.02 band, the issues it raises, and the
# Professional capstone as the course describes it.

q(2, "How does the comparison at the wells compute its one scale?",
 "scale = sum(observed x modelled) / sum(modelled^2), over every well, A and B together.",
 ["One scale per well, the well's seismic A over its modelled A, then averaged over the four wells.",
  "From the gradients alone, since B is the larger number in both the modelled and the seismic columns.",
  "From the intercepts alone, sum(observed A) over sum(modelled A)."],
 "One least-squares scale ties the seismic amplitudes to reflectivity over every well, A and B together: sum(observed x modelled) / sum(modelled^2). A scale per well would fit each well to its own model and hide the differences the comparison is for.")

q(0, "What is the one scale over the four Ekene wells, and in what units?",
 "1882.216944 trace units per unit reflection coefficient.",
 ["1882.216944 reflection coefficient per trace unit, the factor applied the other way round.",
  "309.781098 trace units, the top's off-trend distance.",
  "-4.020851, the gather 5 background slope."],
 "Over the 4 wells the one scale is 1882.216944 trace units per unit reflection coefficient, so a seismic A or B is divided by it to read as reflectivity. 309.781098 is an off-trend distance in trace units and -4.020851 a slope with no units.")

q(3, "Which two conditions does QI Studio raise from the comparison at the wells, and at what level?",
 "An issue for a class that differs, a high one for a negative scale.",
 ["A high issue for any residual above 0.088133, the Ekene-1 figure, and an issue for a well modelled over net sand.",
  "An issue for a tie whose mean windowed correlation is below 0.5, and a high one for a pick outside 8 ms.",
  "A high issue for a class that differs, none for the scale."],
 "QI Studio raises an issue for a class that differs and a high one for a negative scale, a polarity or wavelet problem. The correlation below 0.5 is its rule for a poor tie, which belongs to the issue register for ties, and no residual threshold is printed.")

q(1, "Ekene-2's top of the Ekene Sand is at 5134.514436 ft. Why is its modelled intercept and gradient read from the cap rock over its net sand?",
 "Its top lies below the oil-water contact at 5118.110236 ft, so it has no oil leg.",
 ["Its oil leg is thinner than the 65 ft cap rock, so the comparison widens the lower layer to the net sand.",
  "Every well is modelled over its net sand, so the four wells share one rock and one scale fits them all.",
  "Its bulk shift of -4.000000 ms moves the top off the oil leg in time, so the net sand is read."],
 "The modelled side is the cap rock over the oil leg, or over the net sand where a well has no oil leg; a well whose top lies below the contact at 5118.110236 ft has none, and Ekene-2's oil leg count is 0. Ekene-1 and Ekene-3 are modelled over their oil legs.")

q(0, "At Ekene-2 the checkshot time of the top is 1305.746335 ms. Where does the comparison read the seismic?",
 "At 1304.000000 ms, the top picked on the near stack trace within 8 ms of its checkshot time.",
 ["At 1305.746335 ms exactly, the checkshot time itself, with the near, mid and far stack traces read at that time.",
  "At 1292.000000 ms, the top picked on gather 5, the trace of Ekene-1.",
  "At the largest far stack amplitude within 20 ms, the bulk shift search."],
 "The seismic top is picked on the near stack trace within 8 ms of the checkshot time, and the near, mid and far traces are read at that sample: 1304.000000 ms at Ekene-2. 1292.000000 ms is Ekene-1's pick, and 20 ms is the bulk shift search.")

q(3, "How is each well's seismic A and B fitted in the comparison at the wells?",
 "Two Shuey terms at 10, 20 and 30 degrees.",
 ["Three Shuey terms at 10, 20 and 30 degrees, the curvature term kept to absorb the far stack's fall.",
  "Two Shuey terms on 9 bins of 5 degrees at their centres, the finer sampling of the gather.",
  "Two Shuey terms at the bin edges of 5, 15, 25 and 35 degrees on each angle stack trace."],
 "The near, mid and far stack traces are read at the picked sample and fitted with two Shuey terms at 10, 20 and 30 degrees. The three-term and 9 bin fits are the alternatives the Shuey lesson compared at gather 5.")

q(2, "At Ekene-1 the comparison's seismic A is 486.838592, while the two-term fit at gather 5's top gave 501.873676. Which stacks does the comparison read?",
 "The near, mid and far stack traces at the well.",
 ["The partial stacks of gather 5, the gather on the trace of Ekene-1, built from the NMO-corrected offsets.",
  "The full stack trace at the well, read at three angles from the RMS velocity table at the picked time.",
  "Gather 5's angle bins of 5 degrees."],
 "The seismic side reads the near, mid and far stack traces at the well at the picked sample, which give A 486.838592 at Ekene-1. 501.873676 is the fit to gather 5's own partial stacks, a different stack of the same rock.")

q(1, "What is a well's residual in the comparison?",
 "The distance between its scaled seismic point and its modelled point on the (A, B) crossplot.",
 ["The off-trend distance of its seismic point from the background trend fitted to the gather's pairs.",
  "The difference between its seismic and modelled intercepts, in trace units.",
  "The count of classes that differ."],
 "Each well's seismic A and B are divided by the scale, and the residual is the distance between that scaled point and the modelled one, in reflection coefficient units. The off-trend distance is a different measure, from a line fitted to seismic pairs.")

q(1, "Which Ekene well carries the largest residual against its model?",
 "Ekene-2, at 0.105803.",
 ["Ekene-1, at 0.088133, the well on which the gathers sit.",
  "Ekene-3, at 0.059452, the smallest of the four residuals.",
  "Ekene-4, at 0.077711."],
 "The residuals are 0.088133 at Ekene-1, 0.105803 at Ekene-2, 0.059452 at Ekene-3 and 0.077711 at Ekene-4, so Ekene-2 is the largest and Ekene-3 the smallest. With every class in agreement, the residual is the figure that tells the wells apart.")

q(0, "What are Ekene-1's seismic A and B after division by the one scale?",
 "A 0.258652 and B -0.569840, against modelled A 0.170742 and B -0.563558.",
 ["A 0.170742 and B -0.563558, the modelled point itself.",
  "A 486.838592 and B -1072.562182.",
  "A 0.249870 and B -0.663631, Ekene-3's scaled point."],
 "Dividing 486.838592 and -1072.562182 by 1882.216944 gives the scaled seismic point A 0.258652, B -0.569840; the modelled point is 0.170742 and -0.563558, and the residual between them is 0.088133. 0.249870 and -0.663631 belong to Ekene-3.")

q(3, "How do the modelled and seismic classes compare over the four Ekene wells?",
 "4 of 4 agree, all class I.",
 ["The oil-leg wells Ekene-1 and Ekene-3 are class III on the seismic, so 2 of 4 agree with the model.",
  "Ekene-2, the largest residual, is class II on the seismic, so 3 of 4 agree with the model there.",
  "All four are class IV on both sides, since every gradient in the comparison is negative."],
 "Every modelled and seismic point is class I, so 4 of 4 wells agree in class. Agreement in class is the easy kind here; the residuals still range from 0.059452 to 0.105803.")

q(2, "The comparison classes each point with avoClass. At what band, and is the class graded?",
 "At the stated band of 0.02, and a class is never graded.",
 ["At a band of 0.5, the threshold below which a tie's mean windowed correlation is called poor; graded.",
  "At a band of 0.8, the wavelet rule; the class agreement count is a graded figure.",
  "At 0.02, and the count of wells that agree is graded."],
 "avoClass runs at the band 0.02. The course never grades any verdict, class name or category; 0.5 and 0.8 are QI Studio's rules for a poor tie and for a wavelet unlike the others.")

q(1, "What does the Professional capstone's case file hold?",
 "One NMO-corrected CDP gather with its RMS velocity table, and modelled and seismic intercepts and gradients at four wells.",
 ["The Ekene pack's gather 5 and its RMS table, with the logs of Ekene-1 to Ekene-4 for the learner to model.",
  "The logs of four wells and their checkshots, from which the learner builds the ties and the angle stacks.",
  "Four wells' angle stack traces only, with the scale."],
 "The capstone runs on a held-out synthetic case: one NMO-corrected CDP gather with its RMS velocity table, and modelled and seismic intercepts and gradients at four wells, pasted into the prestack explorer. Every input the figures depend on is stated in the case file.")

q(3, "Why is the Professional capstone never run on the Ekene field?",
 "The members-only videos speak the Ekene answers aloud, so a graded Ekene figure could be answered by watching.",
 ["The Ekene field is synthetic, and graded figures must come from a real survey with real wells and logs.",
  "The Ekene pack's gathers carry the kit's mute beyond 40 degrees, which no capstone can work around.",
  "The pack's logs give too few live synthetic samples for a well wavelet, so the tie cannot be graded."],
 "The capstone cases are never the Ekene field because the members-only videos speak the Ekene answers aloud. The capstone cases are themselves held-out synthetic cases, so a synthetic field is no bar.")

q(0, "Which of these is one of the six figures the Professional capstone grades?",
 "The one scale over the four wells.",
 ["The largest residual among the four wells.",
  "The number of wells whose classes agree.",
  "The background trend slope m of the gather."],
 "The six graded figures are the Dix interval velocity of a stated layer, Walden's angle, the NMO stretch, the far partial stack amplitude, the two-term Shuey intercept and the one scale over the four wells. No class or count is graded, and the residual and the trend slope are not among the six.")

emit(Q, '/root/qi-wip-qi/banks/qii_m06.json', expect_n=15)
finish()
