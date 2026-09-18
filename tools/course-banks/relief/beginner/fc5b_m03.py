import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Associate m03, Liquid. Written from digest.txt Sections 6 and 7, which
# are the five lessons of this module: the certified valve equation, the
# viscosity correction, the Reynolds number that needs the answer, the loop
# that closes on itself, and the band each term of the fit is worth anything in.

q(0, "Where does viscosity enter the liquid sizing route?",
 "In a correction applied to the area equation, written Kv, which is a function of one Reynolds number.",
 ["In the area equation itself, as a term beside the specific gravity and the differential across the valve.",
  "In the certified discharge coefficient Kd, which the manufacturer measures on the service the valve will see.",
  "In the leading constant of 38.000000000000, which carries the unit packaging of the whole equation."],
 "The sizing equation has no viscosity in it. Kv sits in front of that equation and depends on a Reynolds number and nothing else, and Kd is a certified figure belonging to the hardware."),

q(2, "AKASO returns an area of 1.839323 in2 with the viscosity left out and 1.867758 in2 with 85.000000 cp stated. What else does the viscous call report?",
 "A Kv of 0.984776, a Reynolds number of 17412.317969, six passes, converged true and a residual of 0.000000000000.",
 ["A Kv of 1.015459516779, a Reynolds number of 17412.317969, six passes, converged true and a residual of 0.000000000000.",
  "A Kv of 0.984776, a Reynolds number of 17546.394776, one pass, converged true and a residual of 0.000000000000.",
  "A Kv of 0.984776, a Reynolds number of 17412.317969, six passes, converged false and a residual it names."],
 "The correction sits below one and the loop reports itself converged in six passes. The 1.015459516779 is the ratio of the two areas and 17546.394776 is the Reynolds number a single pass would have used."),

q(1, "The digest prints 1.015459516779 for AKASO. What is that figure?",
 "The ratio of the viscous area to the inviscid one.",
 ["The ratio of the inviscid area to the viscous one.",
  "The ratio of the converged area to the one pass area.",
  "The reciprocal of the correction the loop settled on."],
 "It is the viscous area over the inviscid one, and it is quoted only because the digest computes and prints it. The converged area over the one pass area is a separate printed ratio of 1.000083905751."),

q(3, "A single pass through the liquid loop gives 1.867601 in2 at a Kv of 0.984858. What does the converged answer of 1.867758 in2 say about the shortcut?",
 "On this case the loop moves the area by about one part in ten thousand, and the single pass remains an approximation to the correct construction.",
 ["On this case the loop moves the area by about one part in a hundred, which is enough to change the orifice letter the case selects.",
  "On this case the loop and the single pass agree exactly, so the iteration exists only for viscosities far above the one stated.",
  "On this case the single pass gives the larger area, so a hand calculation done that way is conservative for any liquid."],
 "The digest prints the ratio of the converged area to the one pass area as 1.000083905751. The single pass answer is the smaller of the two, and knowing the size of an approximation is not the same as being allowed to ignore it."),

q(0, "At 1.000000 cp and at 5.000000 cp the engine returns the inviscid area of 1.839323 in2, although a Reynolds number was computed on both rows. Why?",
 "Both rows sit above the Reynolds number of 196282.561354814417 at which the correction is held at one.",
 ["Both rows sit below the Reynolds number of 196282.561354814417 at which the correction is held at one.",
  "Both viscosities are below the 50.000000 at which the engine stops evaluating the fit and returns the uncorrected area.",
  "Both rows converged on the first pass, and the engine returns the starting area whenever the loop takes a single pass."],
 "Those two Reynolds numbers are 1491443.555990 and 298288.711198, both above the clamp. A stated viscosity that changes nothing there is the clamp doing its declared job."),

q(1, "The unclamped fit is exported beside the clamped one. What does it show, and why does that matter?",
 "It rises through one and asymptotes to 1.006542523506, so a correction for viscous drag would add capacity if nothing held it.",
 ["It falls away from one and asymptotes to 0.993500000000, so a correction for viscous drag would remove capacity without limit.",
  "It reproduces the clamped fit exactly at every Reynolds number, so the clamp is a statement about the inputs rather than the output.",
  "It rises through one only below the clamp, so the two exports part company at the low Reynolds end of the range."],
 "The asymptote is what the clamp is protecting against, and it stays inspectable because the raw fit is exported. The 0.993500000000 is the intercept term of the fit rather than an asymptote."),

q(2, "Which of these is true of the three coefficients of the Kv fit?",
 "Nothing in the package derives them, and the validation oracle shares the same three on purpose.",
 ["The oracle derives all three of them from the definition of a Reynolds number in absolute SI units.",
  "They are pinned by the published liquid cases, one of which sits low enough on the range to check each one.",
  "They are computed together from the leading constant of 38.000000000000 and the Reynolds constant of 2800."],
 "The fit is held for literature. What the oracle does check on this route is the Reynolds constant, derived from rho u D over mu in SI, and the leading constant of the area equation against the published SI form."),

q(0, "At a Reynolds number of 10.000000 the steepest term of the fit is 0.850608 of the sum, and by 3000.000000 it is 0.001990. What does that table settle?",
 "That the fit has a band it does real work in, and that outside that band its steepest coefficient could move a long way without changing an answer.",
 ["That the fit is wrong outside that band, which is why the correction is clamped at one above a Reynolds number of 196282.561354814417.",
  "That the intercept term is the one worth checking, since it is the only term that changes with the Reynolds number at all.",
  "That a published case anywhere in the range exercises all three terms, since the three of them always sum to one divided by Kv."],
 "The intercept sits at 0.993500 on every row, so it is the term that does not move. The clamp is a stated convention about the output rather than a statement that the fit is wrong, and a case at a high Reynolds number exercises the steepest term hardly at all."),

q(3, "Why does the published liquid set include a row at a Reynolds number of 92.428866?",
 "So that the steepest term of the fit is worth something on at least one published case.",
 ["So that the clamp at one is exercised by at least one published case.",
  "So that the envelope warning below a Kv of 0.500000000000 is reached at least once.",
  "So that the Reynolds constant of 2800.000000000000 can be measured from a published row."],
 "Read the term table at that end of the range and compare the fraction there with the fraction at the other rows. That row carries a Kv of 0.595745, which is above the warning edge, and the clamp acts at the opposite end of the range."),

q(1, "Where does the liquid Reynolds constant of 2800.000000000000 come from, and what checks it?",
 "It is recovered from the engine own returned Reynolds number rearranged against the area it belongs to, and the oracle derives it from rho u D over mu in SI.",
 ["It is recovered from one inviscid area at unit coefficients, and the oracle checks it against the published SI form of the area equation.",
  "It is read from the module source, and the oracle pins it as behaviour because no independent derivation of it exists.",
  "It is recovered from three readings of the unclamped correction, and the oracle shares it with the engine on purpose."],
 "The oracle takes the diameter as the square root of four times the area divided by pi, which arrives at the constant from the definition of a Reynolds number. The inviscid rearrangement is how the leading constant of 38.000000000000 was measured instead."),

q(2, "The pass count runs 0 with no viscosity, 1 at 1.000000 cp and at 5.000000 cp, and 12 at 5000.000000 cp. What does a high pass count tell a reader?",
 "That the correction is doing real work on that case, so a hand calculation stopped after one pass is furthest from the converged answer.",
 ["That the loop is struggling to converge on that case, so the returned area should be read with the convergence flag against it.",
  "That the case sits outside the certified envelope, so the engine has attached its off envelope notice to the answer.",
  "That the area is changing between passes by more than the residual the loop reports, so the residual understates the movement."],
 "Every row in that sweep is reported converged, so a high count is work rather than difficulty. The envelope notice is a separate warning that fires on the correction rather than on the pass count."),

q(3, "Below what value of the correction does the engine attach its off envelope notice, and what does the notice change?",
 "Below 0.500000000000, and it changes nothing about the area, which the engine returns as usual.",
 ["Below 0.500000000000, and it refuses the case rather than returning an area at all.",
  "Below 0.801154, the lowest correction the viscosity sweep reaches, and it changes nothing about the area.",
  "Below 0.993500000000, the intercept of the fit, and it holds the area at its value on the previous pass."],
 "The edge was found by walking the engine until the notice appeared. It is a notice rather than a refusal, and the 0.993500000000 is the intercept term of the fit rather than an edge of any kind."),

q(0, "The viscosity is walked from 0.000000 to 5000.000000 cp on one liquid case. Which set of directions does that sweep show?",
 "A lower Kv, a larger area, a lower Reynolds number and more passes as the liquid thickens.",
 ["A lower Kv, a smaller area, a lower Reynolds number and more passes as the liquid thickens.",
  "A lower Kv, a larger area, a higher Reynolds number and fewer passes as the liquid thickens.",
  "A higher Kv, a larger area, a lower Reynolds number and more passes as the liquid thickens."],
 "Not one of the four ever reverses across the sweep, and two rows leave three of them standing still where the clamp holds the correction at one. A viscous liquid is harder to push through an orifice, so the valve has to be larger to pass the same rate."),

q(2, "With no viscosity stated at all, what does the liquid route return for the Reynolds number?",
 "A null, because with no viscosity there is no Reynolds number to report.",
 ["A zero, which is the figure the loop starts from before it takes its first pass.",
  "A very large number standing in for the inviscid limit of the fit.",
  "The value the clamp acts at, since the correction comes back at one."],
 "The digest prints that field as absent on the inviscid row rather than as a figure. A caller doing arithmetic on it gets zero, which is a perfectly plausible looking Reynolds number, so the absence has to be handled as an absence."),

q(1, "AKASO states a Kd of 0.650000 while the gas and steam streams state 0.975000. What kind of figure is that?",
 "The valve manufacturer own certified discharge coefficient, validated on the way in as a fraction of an ideal.",
 ["A published chart factor, read off its chart against the liquid service condition and then typed in by the caller.",
  "A closed form the engine evaluates from the specific gravity and the differential.",
  "A published table entry that the oracle checks against its own SI statement."],
 "A certified coefficient is measured on a real device on a test stand, and every coefficient is validated on the way in as above zero and no more than one. A liquid service figure and a vapour one are different quantities."),

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/beginner/fc5b_m03.json', label='fc5b_m03', expect_n=15)
finish()
