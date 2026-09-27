import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, advanced tier, Correlation. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(1,
 "A planner types a negative correlation to represent a project that does well when the others do badly. What does the engine run?",
 "The independent case: the correlation is clamped to 0.000000, so a hedge cannot be represented.",
 ["Nothing: the input is refused with an error, the same way a negative capex is refused before the optimizer solves.",
  "The correlation as typed, so the funded projects' spreads partly cancel and stdDev falls beneath independentStdDev.",
  "The magnitude of the correlation, since the driver weights take its square root and need a number that is not negative."],
 "rho is clamped to run from 0 to 1: the published clampBelow case uses 0.000000 and reports stdDev 60.9438, the same as correlation_0.")

q(3,
 "The published singleProject case runs at correlation 0.900000 and reports stdDev 46.8183. What would a different rho change in that stdDev?",
 "Nothing, because one project has no pair to correlate with, so the cross terms are empty at every rho.",
 ["It would shrink the stdDev as rho falls, since the shared driver's weight sqrt(rho) scales the one project's success spread.",
  "It would move the stdDev in step with rho, since a single project is correlated with the portfolio total it makes up alone.",
  "It would widen the stdDev toward the sum of the project's success spread and its mixture sd as rho approaches 1."],
 "stdDev is sqrt(sum var + rho x ((sum sd)^2 - sum var)); with one project (sum sd)^2 equals sum var, so rho multiplies zero.")

q(0,
 "A team has measured how closely two plays' successes and failures move together and types that measured figure into rho. What comes out?",
 "A portfolio whose events move together less than observed, since the events a latent rho implies correlate lower than rho, so P(loss) and P90 come out too comfortable.",
 ["A portfolio whose events move together more than observed, because the engine applies the one rho to both the success and the size drivers and so counts the dependence twice.",
  "The observed dependence exactly, because the success test normalCDF(z1) below pos passes the correlation of the drivers straight through to the events.",
  "A portfolio too pessimistic, because the correlation of yes or no events is always higher than the correlation of the drivers that produce them."],
 "rho is the correlation of the hidden drivers z1 and z2; turning a driver into a yes or a no discards how far past the threshold it fell, so the measured event figure is the smaller number.")

q(2,
 "Two projects carry the same pos. At which values of rho does the correlation between their success events equal rho itself?",
 "At 0, where the events are independent, and at 1, where every z1 is F1 itself and successes come in a fixed nested order.",
 ["At every rho when that pos is 0.500000, since a threshold at the middle of the curve cuts both drivers at the same point.",
  "At 0.500000 only, where the shared and own weights balance and the success test neither adds dependence nor removes it.",
  "At 1 only, since at 0 the thresholds still couple the events through the shared draws F1 and F2 that every project hears."],
 "Between those ends the event correlation is lower than rho, and the engine does not report the event correlation a given rho implies.")

q(0,
 "comonotoneIdentical3 has three wildcats at rho 1.000000, each pos 0.3, 300 on success and a fail cost of 50. Its exact P(loss) is 0.700000, the same as one wildcat. Why?",
 "At rho 1 the three wells hear only F1 and fail together whenever one fails, so the portfolio loses exactly when a single well would.",
 ["At rho 1 the three losses of 50.0000 are averaged rather than summed, so the portfolio is scored as one well carrying the average loss.",
  "At rho 1 the optimizer treats identical projects as duplicates and funds one well, so the risk summary is simulated for that one alone.",
  "At rho 1 the normal approximation becomes exact, and 0.700000 is the bell's reading for three perfectly correlated wells."],
 "Independent, the three fail together with chance 0.343000 and the copula case sits between at 0.469561; the low case is -150.0000 on all three rows, and only its frequency changes.")

q(1,
 "A reviewer adds the four mixture sds of OKONO's 600.0000 set, 44.3821 + 60.6850 + 121.9467 + 12.8750, and reports 239.8888 as the portfolio stdDev. What did the reviewer assume?",
 "rho 1, since standard deviations add like money only under perfect correlation; at the optimizer default of rho 0 the figure is 143.8374.",
 ["rho 0, since adding the standard deviations of independent risks is what an uncorrelated portfolio's spread is built from in closed form.",
  "Nothing about rho, since the stdDev is always the sum of the sds and rho only reaches P(loss), P90 and P10 through the simulation.",
  "rho 0.600000, the point where the formula's variance and cross terms carry equal weight and the sds sum without a square root."],
 "At rho 1 the variances cancel inside the bracket and stdDev is sqrt(57546.6428) = 239.8888; at rho 0 the cross terms vanish and it is sqrt(20689.2080) = 143.8374.")

q(3,
 "An analyst builds the spread formula for the 600.0000 set from success spreads, using OK-4's 78.0305 in place of its mixture sd of 121.9467. What happens to stdDev?",
 "It is understated at every rho, because success spreads leave out the gap between a success centred on 210.0000 and a failure costing 40.0000.",
 ["It is overstated, because success spreads are read from npv_p10 and npv_p90, which bracket a wider range than the mixture variance does.",
  "It is unchanged at rho 1, where the formula reduces to the plain sum of the sds and it no longer matters which of its two sds each project contributes.",
  "It changes only for OK-5, the one project in the set with pos 1.000000, since its two spread columns are the only ones that differ."],
 "The mixture sd is the square root of the success and failure variance taken together; only OK-5, with no fail cost, has the two columns agree, at 12.8750.")

q(3,
 "On the 600.0000 set, raising rho from 0.000000 to 0.300000 lifts stdDev from 143.8374 to 178.1753, and the step of the same size from 0.600000 to 0.900000 lifts it only from 206.8905 to 232.0795. Why the smaller step?",
 "The variance rises in a straight line with rho and stdDev is its square root, so equal steps in rho add less spread as rho grows.",
 ["The engine damps rho above 0.600000 so that the latent drivers stay standard normals, which trims the later steps of the rise.",
  "The cross terms shrink as rho rises, because each project's own weight sqrt(1 - rho) falls and takes its share of the covariance with it.",
  "The stdDev is read from the simulated values, and the simulation saturates as the shared draw comes to dominate every project."],
 "At rho 0.300000 the engine adds 0.300000 times the gap between 57546.6428 and 20689.2080 to 20689.2080 and takes the root; the bracket is never negative, so rho can only widen the spread.")

q(2,
 "At rho 0.600000 the risk summary prints stdDev 206.8905 beside P90 137.2208 for the 600.0000 set. A reader checks P90 as emv minus 1.2816 x stdDev and it does not match. Why?",
 "stdDev is the moment formula with rho on the project outcomes, while P90 comes from the simulation with rho on the latent drivers: two models that need not agree.",
 ["P90 carries the sampling noise of seed 20260829, and the mismatch is about one standard error that a longer run at 40000 iterations would close.",
  "The multiplier 1.2816 holds only at rho 0, and at rho 0.600000 the engine derives P90 from a z adjusted for the correlation it was given.",
  "P90 is the high case under the exceedance convention, so the check should add 1.2816 x stdDev to emv rather than subtract it from it."],
 "The simulated P(loss), P90 and P10 are counted and sorted from outcomes; emv minus 1.2816 x stdDev was the normal approximation's P90 and is history since EC5-0.")

q(0,
 "In one iteration at rho 0.600000 the shared draw F1 comes out far above zero. What does that do to the funded projects?",
 "It pushes every project's z1 up at once, toward failure together, since a project succeeds when normalCDF(z1) is below pos.",
 ["It pushes every project toward success at once, since a high shared draw stands for a favourable basin model that every project hears.",
  "It makes every success in that iteration larger than its npv_p50, since F1 is the shared driver that scales each success spread.",
  "It moves only the first project in array order, since F1 is consumed by the first project before the others draw their own normals."],
 "F1 stands for what makes projects fail or succeed together, and F2 for what makes successes large or small together; z1 = sqrt(rho) F1 + sqrt(1 - rho) e1.")

q(1,
 "A planner wants OK-1 and OK-4 to share a reservoir while OK-5 stands apart, and successes to correlate strongly while sizes correlate weakly. How does the engine take it?",
 "It cannot: one rho applies to every pair and to both the success and the size drivers, with no matrix and no cluster.",
 ["By listing OK-5 last in array order, so its own normals are drawn after the shared ones and it hears less of F1 and F2.",
  "By setting OK-5's pos to 1.000000, which removes it from the shared success driver while leaving OK-1 and OK-4 tied.",
  "By running the risk summary twice at two correlations, once for success and once for size, and the engine combining the two runs."],
 "z1 and z2 share the same sqrt(rho) weight, and every project hears the same F1 and F2; OK-5 still draws both normals in every iteration although its success is certain.")

q(2,
 "The optimizer default leaves rho at 0 for OKONO's 600.0000 set, OK-1 + OK-2 + OK-4 + OK-5. What does that choice claim?",
 "That infill drilling, gas compression, waterflood and workovers share no reservoir, price or operator, which is the most optimistic spread the engine can give.",
 ["That the four projects are correlated at the average the engine infers from their entered percentiles, so no choice has really been made by anyone.",
  "That the set is safe at any correlation, since the funded set was chosen at rho 0 and the optimizer would have dropped a correlated project.",
  "Nothing about dependence, since rho 0 is the engine's code for a correlation that was not entered and is treated as missing."],
 "At rho 0.000000 the set reads P(loss) 0.001800 and P90 200.3575; at rho 1.000000 it reads 0.059000 and 87.9316, so choosing rho is choosing the answer.")

q(3,
 "At rho 1.000000 the 600.0000 set's P(loss) climbs to 0.059000 and its P90 falls to 87.9316. What happens to emv and to the funded set?",
 "emv stays 402.7500 and the optimizer still funds OK-1 + OK-2 + OK-4 + OK-5, since rho reaches only the risk summary.",
 ["emv stays 402.7500, but the optimizer drops OK-4 for a smaller project to narrow the spread the correlation has widened.",
  "emv falls toward P90, since the expected value of a correlated portfolio is discounted by the downside its projects share.",
  "emv rises with P10 to 674.8353, since a shared driver lifts the good iterations of every project together in the same draw."],
 "Each project keeps its risked EMV, OK-1 89.7500, OK-2 115.0000, OK-4 160.0000 and OK-5 38.0000, summing to 402.7500; the engine never trades a unit of EMV for a narrower spread.")

q(0,
 "Why does emv read 402.7500 at every rho on the correlation table?",
 "z1 = sqrt(rho) F1 + sqrt(1 - rho) e1 is still a standard normal, so each project succeeds with chance pos at any rho and only which projects succeed together changes.",
 ["The weights sqrt(rho) and sqrt(1 - rho) add up to one at every rho, so the shared draw and the project's own draw always average back to its npv_p50.",
  "The engine re-centres the simulated values on the closed-form emv at the end of every run, so the mean is held by the construction of the output.",
  "Correlation reaches only the failures, and emv is computed from the success-case NPVs alone, which the shared driver never touches at all."],
 "The squared weights add to one, not the weights, and the average of a sum is the sum of the averages whatever the dependence. The emv printed is the closed form, with no simulated mean beside it.")

q(1,
 "As rho goes from 0.000000 to 1.000000, the 600.0000 set's P10 rises from 580.5960 to 674.8353. A reader concludes correlation made the portfolio more valuable. What is the reply?",
 "The rise is the same widening seen from the other side: a shared driver brings good iterations together as surely as bad ones, and emv stays 402.7500.",
 ["The reader is right that the high case gained, and the gain is offset exactly by the fall in P90, so the portfolio's value is unchanged.",
  "P10 is the low case under the exceedance convention, so its rise means the downside improved while the upside was left as it was.",
  "The rise is sampling noise, since P10 is read from the simulation at seed 20260829 and would fall back at another seed."],
 "P90 falls from 200.3575 to 87.9316 over the same range; both tails move outward and the mean, the one figure correlation cannot touch, holds.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/advanced/ec5a_m02.json', expect_n=15)
finish()
