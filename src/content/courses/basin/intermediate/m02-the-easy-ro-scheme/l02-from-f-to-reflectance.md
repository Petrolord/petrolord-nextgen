# From F to reflectance

The kinetic state produces F, a reacted weight between 0 and 0.85. A microscope produces Ro, a measured reflectance in percent. Easy%Ro connects them with one line, and this lesson is about that line and the two exact anchors it hangs from.

## The formula

$$R_o = e^{-1.6 + 3.7 F}$$

That is the entire read-out. No lookup tables, no branches. F enters linearly in the exponent, so equal increments of reacted weight multiply the reflectance by equal factors: every 0.1 of F is a factor of $e^{0.37} = 1.4477$ on Ro. Reflectance is a logarithmic ruler laid along the reaction's progress, which is why the panel draws it on a log axis and why the curve there looks so orderly.

## The two anchors

Set F = 0 and the formula gives $e^{-1.6} = 0.20189651799465538$. That is the reflectance the scheme assigns to completely unreacted vitrinite, and it is your first graded value. It is a closed form: you can reproduce it on any calculator from the two published constants alone.

Set F to its maximum, 0.85, and the formula gives $e^{-1.6 + 3.7 \times 0.85} = e^{1.545} = 4.687971627022013$ by direct hand evaluation. The engine reports 4.687971627022019 for the same quantity, your second graded value. The two differ in the fifteenth digit because the engine obtains 0.85 by summing the twenty weights in floating point, which lands on 0.8500000000000003 rather than 0.85 exactly. Both values sit inside the 0.005 grading tolerance by twelve orders of magnitude. The discrepancy is worth a sentence because it teaches the right habit: when a graded number and your hand arithmetic differ in the fifteenth digit, you are looking at the arithmetic of summation order, not at an error.

So the published range of the scheme, roughly 0.2 to 4.7 percent, is not folklore. It is these two closed forms, and you now own both.

## What the calibration means

The constants -1.6 and 3.7 were fitted by Sweeney and Burnham so that the twenty-bin model, run over laboratory and geological heating histories, reproduces measured vitrinite reflectances across that whole span. The fit is the bridge between a state variable nobody can see, F, and an observable that a laboratory reports from polished sample under oil immersion.

Notice the division of labour inside the scheme. All the physics of time and temperature lives in the bins; the formula is a static map applied afterwards. Two histories that produce the same F produce the same Ro, full stop. Anything you want to understand about rates, ramps or stalls, you investigate in the state, not in the read-out.

## Reading the map both ways

Because the map is monotonic it inverts cleanly: $F = (\ln R_o + 1.6)/3.7$. A reported Ro of 1.0 corresponds to F = 0.4324, so a rock at the classic top of the oil window has reacted about half of its vitrinite weight. On the capstone ramp, the engine's F at 150 degC is 0.4289345833269452, giving Ro 0.9871413464062039, just short of 1. The inverse map is how you turn a measured reflectance from a well back into model space when calibrating, and the exam will expect you to move in either direction.

## Worked example

A history leaves F = 0.14, the value from the previous lesson's four drained bins. What reflectance does the scheme assign?

$R_o = e^{-1.6 + 3.7 \times 0.14} = e^{-1.082} = 0.33891$. Check the direction against the anchors: 0.14 of a maximum 0.85 is modest progress, and 0.339 sits correspondingly low between 0.2019 and 4.688. For the reverse direction: what F gives Ro = 2.0? $F = (\ln 2 + 1.6)/3.7 = 0.61984$, about 73 percent of the way to full reaction.

## Exercise

Compute Ro for F = 0.3 and F = 0.6, and state the ratio between them. Then explain in one sentence why the ratio is the same as between F = 0.0 and F = 0.3.

As a self check: $e^{-1.6+1.11} = 0.61263$ and $e^{-1.6+2.22} = 1.85931$, and the ratio is $e^{1.11} = 3.0344$. It matches the ratio for any other 0.3-wide interval of F, including 0.0 to 0.3, because F sits linearly in the exponent, so equal steps of reacted weight always multiply reflectance by the same factor.
