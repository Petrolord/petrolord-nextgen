import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Associate m02, Two Curves and Why Neither Has an Operating Point.
# Digest Section 2 only.

q(1, "The OKONO catalogue reads 540.000000 ft at zero flow and the fit returns a shutoff head of 540.203016 ft. What is that gap?",
 "The fit sitting closest to all four readings at once rather than passing through any one of them.",
 ["A rounding introduced when the engine normalises the flow by the scale.",
  "The catalogue reading being a measured point and the fitted value being that same point corrected for the conditioning of the solve.",
  "The quadratic being extrapolated below the lowest flow it was given, since a shutoff reading sits outside the range the other three points cover."],
 "A quadratic has three coefficients and there are four points, so no quadratic hits all four. The difference is 0.203016 ft and every one of the four residuals is non-zero."),

q(3, "Why is the OKONO fit written in the variable q over the scale rather than in raw gallons per minute?",
 "It keeps the three coefficients within a few orders of magnitude of each other, which is what the arithmetic behind the fit is sensitive to.",
 ["It makes the shutoff head fall out as c0, which a fit in raw flow could not deliver without a separate evaluation at zero.",
  "It lets one fitted curve be reused on a pump of a different size by rescaling, since the normalised curve is dimensionless.",
  "It removes the need for the least-squares step, because three normalised points determine a quadratic exactly."],
 "The scale is the largest flow in the point set, 1900.000000 gpm here. Raw flows to nineteen hundred have squares running to several million, spread over many orders of magnitude before the normal equations square anything."),

q(0, "Which figure does the OKONO fit report as its shutoff head, and where does it come from?",
 "540.203016 ft, which is c0, the fitted head at zero flow.",
 ["540.000000 ft, which is the first catalogue reading, copied through because a shutoff is a measurement rather than a fitted quantity.",
  "0.738126 ft, which is c1, the linear coefficient.",
  "291.101770 ft, which is the magnitude of c2 and the head the curve loses across the full normalised range."],
 "The shutoff head is simply the fitted head at zero flow. Every term in q over the scale vanishes there and c0 is what is left."),

q(2, "An R squared of 0.999985896 comes back on the OKONO fit. What exactly is that the share of?",
 "The variance in the readings that the fitted curve explains.",
 ["The catalogue range over which the fitted curve stays inside its own conditioning bound.",
  "The four residuals expressed against the largest head in the point set, summed and subtracted from one.",
  "The flows where the fit and the catalogue agree."],
 "A value near one means the points sit close to the curve. That is the entire claim it makes."),

q(3, "A point set whose head climbs with flow is fitted and comes back with an R squared of 1.000000000. What has that perfect score failed to notice?",
 "That the curve is the wrong shape to be a centrifugal head curve, which the same return says in a droops flag of false and in prose.",
 ["That the conditioning of the solve was worse than on any drooping set in this course, which is where a rising point set actually shows itself.",
  "That the fitted c2 came back as zero, so the quadratic collapsed to a straight line through the three readings.",
  "That only three readings were supplied, which is below the minimum the fit refuses under."],
 "Three points and three coefficients leave nothing for the curve to miss, so the score is perfect. R squared grades the fit against the points and nothing more."),

q(1, "Three readings that all carry the same head are fitted. What does the engine return for R squared, and why?",
 "Null, because the total sum of squares is zero and the share of a variance that does not exist is undefined.",
 ["1.000000000, because a horizontal line passes exactly through three points that all sit at the same height.",
  "0.000000, because a flat curve explains none of the behaviour the readings were taken to capture.",
  "The same value as the previous fit, because the engine carries the last finite score forward when the current one cannot be formed."],
 "The engine could have returned 1 or 0 and either would be a number where there is no number. Null is what nothing to explain looks like in a return."),

q(2, "What does the condition number of the normal-equation matrix answer that R squared does not?",
 "Whether the linear system behind the curve could be solved at all, which is a separate question from how well the curve describes the points.",
 ["Whether the point set contains enough distinct flows for a quadratic, which R squared cannot see because it is formed after the solve.",
  "How far the fitted shutoff sits from the first catalogue reading, expressed as a bound rather than as a residual.",
  "Whether the fitted curve falls with flow, which is the property the duty solve further down the module requires."],
 "A fit can score well on one and badly on the other. The engine reports both because they are two different questions about the same call."),

q(0, "Across the seven point sets this course fits successfully, what range does the reported condition number take?",
 "304.750000 to 366.680892, and the OKONO figure of 334.938111 sits inside it.",
 ["308.014664 to 360.837617, taken from the rising set at the low end and from the last published curve golden at the high end.",
  "0.999754151 to 1.000000000, the same scale as the fit quality.",
  "There is no range. OKONO alone carries one."],
 "The smallest and the largest of the seven reported figures. A few hundred is simply what this kind of fit costs."),

q(1, "Which step in the solve is responsible for the condition number being a few hundred rather than a few tens?",
 "Forming the normal equations, which squares the condition number of the design matrix underneath them.",
 ["Normalising the flow by the scale, which compresses the matrix entries and multiplies the ratio between the largest and smallest of them.",
  "The partial pivoting, which reorders the rows and inflates the 1-norm.",
  "Evaluating the fitted curve back at each catalogue flow, which accumulates the four residuals into the reported figure."],
 "That squaring is the price of solving a least-squares problem this way, and the engine pays it in the normalised variable rather than in raw gpm."),

q(3, "What does a condition number of this size cost the fitted coefficients?",
 "Two or three of the sixteen decimal digits double precision carries, which is why they are quoted to six decimals.",
 ["Nothing measurable. A figure in the hundreds sits far inside the range where double precision is exact and the report is kept for completeness.",
  "The whole of the fractional part, which is why the coefficients are reported as the engine returns them rather than rounded.",
  "One digit for each point beyond the three a quadratic needs, so a four-point catalogue costs exactly one."],
 "It is also why the figure is reported rather than hidden. A reader who knows the fit cost three digits knows not to argue about the fourth."),

q(2, "The rising point set fits at a condition number of 308.014664 and the three-identical-heads set at 304.750000. What does that pair show?",
 "That conditioning is a statement about the arithmetic and is untroubled by two point sets that are both unusable as pump curves.",
 ["That an unusable point set always conditions better than a usable one, so a low figure is itself a warning worth reading.",
  "That the two figures are close because both sets carry three points, and the conditioning is determined by the point count alone.",
  "That the engine suppresses the conditioning report when the droops flag is false and substitutes the nearest valid figure."],
 "Neither of those point sets is a usable pump curve. Usability is a statement about the physics and the droops column is where that one is answered."),

q(0, "Fit the rising set and the engine returns c2 = 94.577778. What does the sign of that coefficient say?",
 "The parabola opens upward and the head climbs away with flow, so nothing about the curve describes a centrifugal machine.",
 ["The rows were reordered by the pivoting, which flips the sign of the quadratic term.",
  "The curve falls more steeply than OKONO, whose c2 of -291.101770 is smaller in magnitude.",
  "The coefficient is expressed in raw gpm rather than in the normalised variable."],
 "A drooping curve has a negative c2 and OKONO's is -291.101770. This one is positive."),

q(1, "The engine reports a rising curve in prose and again in a boolean. Why does it do both rather than either one?",
 "A string can carry advice and cannot be tested, and a boolean can be tested and cannot explain itself.",
 ["The string is for the studio and the boolean for the gate suite, so the two audiences never read the same field and neither can be dropped.",
  "The boolean is formed from the sign of c2 and the string from the residuals, so the two are independent findings that happen to agree here.",
  "The string is emitted only when the caller asks for it, so the boolean is the field that is always present and the string is the optional half."],
 "Writing one without the other leaves either a machine that cannot act on the finding or a human who cannot understand it."),

q(3, "Which function further down the module reads the droops flag, and what does it do with it?",
 "The duty solve, which refuses to return a crossing for a curve the flag has already disowned.",
 ["The power call, which declines to convert a head off a curve that does not fall.",
  "The operating region check, which cannot judge a curve of the wrong shape.",
  "The fit itself, which re-solves with the points reordered."],
 "The fit does not refuse the rising points, because fitting them is a well defined operation and it succeeded. It records what it found and hands the decision on."),

q(2, "The OKONO system is stated as a static head of 210.000000 ft and a friction head of 165.000000 ft at 1100.000000 gpm. Why is it stated that way?",
 "A friction head at a stated flow is something an engineer measures, and the coefficient it implies is not.",
 ["The engine cannot form a coefficient from a single pair, so the flow is supplied as a second independent reading of the same curve.",
  "Stating a coefficient directly would leave the static head with no flow to be read back at, and the return prints it at the stated flow.",
  "The two heads have to be given at the same flow so that the solve can subtract them before the crossing is searched for."],
 "The engine takes the measurable pair and works out the coefficient it implies, which here is k = 0.000136363636 ft per gpm squared."),

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/beginner/fc3b_m02.json', expect_n=15)
finish()
