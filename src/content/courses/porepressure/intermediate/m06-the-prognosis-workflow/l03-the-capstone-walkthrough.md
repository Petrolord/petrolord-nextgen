# The capstone walkthrough

The capstone asks you to run the full pipeline over the well's sonic and density logs with Eaton n = 3 on the well's own NCT, and to report six values. This lesson walks the exam itself: each field, its exact expected value, its tolerance, the route to it, and the slip that most often loses it.

## The six fields

Overpressure onset depth, in metres below mudline, expected 2520, tolerance 0. NCT transit time at TD, in us/m, expected 259.5530276341839, tolerance 0.5. Pore pressure at 3000 m, in MPa, expected 33.307730125, tolerance 0.01. Pore pressure at TD, expected 47.408579625, tolerance 0.01. Overpressure at TD, expected 6, tolerance 0.01. Fracture pressure at TD, expected 76.55157117548856, tolerance 0.01.

## Field by field

The onset, tolerance zero. The rule is stated in the capstone: first sample more than 0.05 MPa above hydrostatic. Module 3's walk gives 2520 m: 0.04 MPa at 2510 misses the threshold, 0.08 at 2520 clears it. The slip that loses this field is answering 2500, the ramp top, which is the right answer to a different question. Zero tolerance means the graders want the rule's output, not the geology's.

The trend at TD. One evaluation: $220 + 436\,e^{-2.4} = 259.5530276341839$ us/m. The slips: quoting the LOG at TD, 270.92263512383806, which is the number beside it in your working; or using the fitted trend's 246.148, which fails by 13 despite the generous 0.5 tolerance. The capstone says the well's own NCT; module 4 is why it says so.

Pore pressure at 3000 m. The five-step chain of module 2's worked lesson: budget 35.523412418439044, ratio 0.9808693876607879, cube, fraction, hydrostatic plus 2.0. The slip: rounding the exponential or the cube mid-chain, which module 2 showed drifts the last digits; carry full precision, round at the end, and report three decimals, 33.308.

Pore pressure at TD. Same chain at 4000 m: 41.408579625 plus exactly 6. Slip: gravity. Both rounded values of g fail the hydrostatic underneath this field by more than the 0.01 tolerance, an Associate-tier lesson that stays load-bearing here.

Overpressure at TD. If you have the previous field, this is one subtraction, and the identity check runs the other way: pp_td minus op_td must be 41.408579625. Reporting 6.0 exactly is correct and expected; the encoded ramp is exact.

Fracture pressure at TD. One line: two thirds of the effective stress plus the pore pressure, $\tfrac{2}{3}(91.12306695073282 - 47.408579625) + 47.408579625$. Slips: using nu 0.4 directly as K instead of nu over one minus nu, which gives $0.4 \times 43.714 + 47.409 = 64.894$, wrong by 11.7; or mixing with the hydrostatic instead of the pore pressure, 76.552 versus the wrong 74.552. The mixture identity, two thirds overburden plus one third pore pressure, catches both.

## The exam beneath the exam

Notice what the six fields jointly certify. The onset certifies you know what a detection rule is. The trend value certifies you can evaluate the trend you were told to use. The two pore pressures certify the chain at two depths, one mid-ramp, one at the boundary. The overpressure certifies the decomposition. The fracture pressure certifies the ceiling formula with the correct K. There is no field for the fitted trend, the exponent table, or the QC list, because those are certified by the final exam's questions instead; the capstone is the arithmetic spine, and the module quizzes are its context.

Order your working the way the workflow lesson ordered the steps, and the six fields fall out in sequence with every intermediate value shared between them: one frame, one trend, one chain run twice, one subtraction, one mixture. Fifteen minutes of careful arithmetic; the tier was the six modules that made it careful.

## Worked example

The complete submission, as six lines of working. Onset: ramp overpressures 0.04, 0.08 at 2510, 2520; rule fires at 2520. Trend: $e^{-2.4} = 0.09071795328941251$; $220 + 436 \times 0.09071795328941251 = 259.5530276341839$. PP 3000: $31.307730125 + 35.523412418439044 \times (1 - 0.9808693876607879^3) = 33.307730125$. PP TD: $41.408579625 + 49.714487325732826 \times (1 - 0.9580337483265022^3) = 47.408579625$. OP TD: $47.408579625 - 41.408579625 = 6$. FP TD: $\tfrac{2}{3} \times 43.714487325732826 + 47.408579625 = 76.55157117548856$. Six lines, four significant intermediate constants, all previously derived in this course.

## Exercise

Close the book and write the six values from structure rather than memory: which are exact by construction, which are evaluations, and which are chains? Then check yourself against the list above.

Self check: exact by construction are the onset, 2520 by the rule, and the overpressure, 6 by the ramp. Pure evaluations are the trend at TD, one exponential, and the fracture pressure, one mixture once the pore pressure exists. Chains are the two pore pressures, the same five steps at two depths. Knowing which kind each field is tells you where a wrong answer can hide: nowhere in the exact ones, in one line for the evaluations, in five for the chains, so the chains get the checking time.
