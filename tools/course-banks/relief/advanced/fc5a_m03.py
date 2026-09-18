import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Expert m03, A Step Size Is an Answer. Digest section 23.

q(0, "Halving the step seven times takes the AFIESERE time from 268.420990 s at 0.800000 s to 268.418974 s at 0.012500 s, a total movement of 0.002015907907 s. What does that movement establish?",
 "That the march converges in its own terms, with the step still visible in the sixth decimal a time prints at.",
 ["That the march is converging on the right balance to be marching, since the sequence settles down rather than wandering.",
  "That the default step of 0.100000 s is the coarsest one this vessel tolerates before the answer moves.",
  "That the remaining error in the time is 0.002015907907 s, which is the figure an answer carries as its uncertainty."],
 "It establishes convergence in the march's own terms and nothing more. The movement is 4031.815814 times half a unit in the sixth decimal, so the step shows in a printed time and is stated beside it. A march converging beautifully to a wrong answer is a thing numerical methods do very well, and the check for that is the closed-form comparison in the first module.")

q(2, "The refinement halves the step over a contiguous sequence of seven values rather than sampling a few. Why does the contiguity matter?",
 "A table with a gap in it invites a reader to assume the behaviour across the gap, which is the thing a convergence table exists to stop.",
 ["A gap would leave the step counts unable to double, so the relationship between them could not be read.",
  "The engine subdivides a step that skips a decade, so a sparse sequence returns substeps and stops comparing like with like.",
  "The ratio against the finest step is only defined where every intermediate step was also run."],
 "Contiguity is part of the method rather than a presentational choice. The whole sixty-four-fold refinement is there so the reader can watch, and a reader who has to interpolate is back to assuming.")

q(1, "A study refines a step and a comparison runs the same balance in closed form. What does each one establish that the other cannot?",
 "Refinement says whether you have walked far enough down one road; the closed form says whether it is the road you meant to be on.",
 ["Refinement checks the balance being marched and the closed form checks the arithmetic underneath it, which is why the ratio column reads one.",
  "Refinement checks the time and the closed form checks the final temperature, which is the one column that refinement is unable to move at all.",
  "Refinement checks the engine and the closed form checks the published cases, which are generated from it."],
 "The two answer different questions and a march needs both. The closed-form ratios in the first module sit within a part in a million of one, and the refinement here moves the time by 0.000007510303 of itself.")

q(3, "The final temperature column reads 340.807983 degR on all seven rows of the refinement study. What has the study told you about that figure?",
 "Nothing. Refinement cannot move it, so the study left it alone rather than validating it.",
 ["That it has converged the most tightly of the three columns, since it did not move at all.",
  "That the end state is a stronger result than the time, since it is stable under a sixty-four-fold refinement.",
  "That the step size is fine enough for the temperature even where it would be too coarse for the time."],
 "The end state is fixed by the pressure ratio across the blowdown and by the isentropic exponent, and neither is a function of the step. Reading a constant column as confirmation is reading an absence of evidence as evidence.")

q(2, "AFIESERE finishes at 145.000000000000 psia against a target of 145.000000 psia, a difference of -0.000000000000 psia. What does that show about the march?",
 "It lands on the end pressure rather than reporting the time of the step that crossed it.",
 ["It rounds the final pressure to the target once the step that crossed it has been taken.",
  "It chose a step size that divides the pressure drop into a whole number of increments.",
  "It reports the target back rather than the pressure it actually reached, at full precision."],
 "Reporting the step that crossed the target quantises the answer to one step, which on a coarse step is a real error and on any step is a needless one. Comparing the final pressure returned against the pressure asked for, at full precision, is the check on any march.")

q(0, "A small vessel through a large orifice can lose more mass in one step than it holds. What does this march do about that, and what does it tell you afterwards?",
 "It subdivides any step that would remove more than a twentieth of the inventory, and returns how many it subdivided.",
 ["It refuses the geometry and names the orifice, because an explicit march has nothing to offer there.",
  "It falls back on the closed form for the first step and rejoins the march once the inventory allows it.",
  "It shortens the run to the part of the march the step size can carry, and warns that the time is optimistic."],
 "At the stated step AFIESERE subdivided 0 of its 2685 steps, so the count is zero when the budget never bites. It is not a fault when it is non-zero: it says the geometry sits in the corner where a fixed step struggles.")

q(3, "The three hard cases, 5.000000 ft3 through 4.000000 in, 100.000000 ft3 through 17.000000 in and 500.000000 ft3 through 38.000000 in, each report 34 steps and 34 substeps. What is the substep column saying?",
 "Every step in all three runs had to be cut, which is why each reaches its end pressure with a time above zero.",
 ["34 extra steps were inserted beyond the 34 the march had planned on taking, which doubles the work on each of the three rows.",
  "34 steps were rejected and retaken at a finer step size chosen from the vessel volume.",
  "The march subdivided until the step matched the finest one in the refinement study, which took 34 passes."],
 "These are the geometries where a fixed step has the least to work with, and they are in the study on purpose. Without the budget the first step would take out more mass than the vessel holds.")

q(1, "Why do three geometries nobody would design belong in a published validation set?",
 "A typical case checks that the arithmetic runs; an extreme one checks that the method holds.",
 ["They are the cases the closed form cannot reach, so only a march can generate a published answer for them.",
  "They exercise the shortest times in the set, which is where the relative difference against the oracle is largest.",
  "They are where the choked assumption is nearest its floor, so they are the rows that carry the engine's warning."],
 "2 of the 5 published blowdown rows use an orifice of 4 in or larger and 1 sits at 10 ft3 or smaller. A set of sensible vessels through sensible orifices cannot tell a march that works from a march that stops before it starts.")

q(2, "A time step of zero and a negative time step both come back as refusals rather than as warnings. Why is a refusal the only honest handling?",
 "A march whose clock never advances can never reach its own time limit, so it would spin against a budget it cannot exhaust.",
 ["A negative step would march the pressure upward, and the engine has no branch for a vessel filling.",
  "A zero step divides the inventory budget by zero, so the first subdivision is undefined and the run aborts.",
  "The step is an accounting field, and a wrong one invalidates the answer."],
 "The message on both is `the time step must be a finite number above zero`. The third refusal in that family is the time limit itself at 7199.999985603571 s, which names the orifice as the likely cause.")

q(3, "Each row of the refinement study carries a ratio in its last column, and the digest computes nothing between rows. What follows for a reader?",
 "Any statement about how the column behaves is a reading you take rather than a figure you were handed.",
 ["The column can be read downward as a rate of convergence, since each entry is the previous one halved.",
  "The ratios may be divided into each other to recover the order of the method.",
  "The column means something only at the finest step, where the ratio reaches 1.000000000000."],
 "Each entry is that row's time over the time at the finest step. Take the reading deliberately and say you took it, which is a different act from quoting a figure the digest computed.")

q(0, "The step count runs 336 at 0.800000 s, 2685 at 0.100000 s and 21474 at 0.012500 s. What is that column recording?",
 "A fixed step on a fixed march, so the count roughly doubles each time the step is halved.",
 ["The march choosing more steps as it refines, since a finer step needs a longer run to reach the end pressure.",
  "The number of stations returned at each step size, which is what the trajectory is thinned down to.",
  "The steps plus the subdivided ones, which is why the count grows faster than the step shrinks."],
 "The substep column is 0 on every row of this study, so nothing here needed subdividing and the count is the clock divided by the step. The final temperature is identical on all seven rows for a separate reason.")

q(1, "Before quoting any march result, this module asks four questions in order. Which order is the module's?",
 "Did it get there, was the step fine enough, was anything subdivided, and is the warning field empty.",
 ["Is the warning empty, did it converge, was the oracle independent, and does the published set cover it.",
  "Was the step fine enough, did it get there, is the time inside the customary limit, and was it choked.",
  "Did it get there, was the case the governing one, was the step fine enough, and is the answer plausible."],
 "The accounting fields exist so that the first three can be answered off the return itself. A time read off a march whose warning you did not look at is a time you are guessing about.")

q(3, "The march holds a time and a final temperature, and they need different instruments. Which pairing is right?",
 "The time is an integral and refinement suits it; the temperature is algebraic and an independent statement is what checks it.",
 ["The time is algebraic and the closed form checks it; the temperature is an integral and refinement checks it.",
  "Both accumulate step by step, so refinement is the instrument for each of them and the published rows confirm it.",
  "Both are algebraic consequences of the two pressures, so neither is touched by the step and refinement checks neither."],
 "The time can be wrong by a little at every step, which is what a refinement study is for. The temperature follows from two pressures and an exponent, and what checks it is the published final temperature sitting beside the published time on every one of the 5 blowdown rows.")

q(2, "The three hard geometries differ in volume by two orders and in orifice by nearly ten times, yet all three finish at 114.700000 psia and 338.611469 degR. Why?",
 "They were given the same two pressures and the same exponent, and the end state follows from those alone.",
 ["They were all subdivided to the same step, so the three marches were effectively the same run.",
  "They each removed the same fraction of their inventory, which fixes the end state whatever the vessel holds.",
  "The end state is clamped at the choked floor, which the three share because they share a back pressure."],
 "Geometry decides the clock and the two pressures decide the cold end. The times on those rows are 0.167677 s, 0.185663 s and 0.185791 s, and they are the only column of the three that the geometry moved.")

q(0, "What does a march owe a reader that a closed form does not?",
 "An account of how it ran, because a march cannot be read the way a closed form can.",
 ["A trajectory, because an integration has intermediate states and a closed form has none to report.",
  "A warning field, because only an iterative method can reach a condition its inputs did not declare.",
  "A refusal on a bad step size, which a closed form never takes."],
 "Six of the eleven returned fields are the answer, four are the account and the eleventh is the warning slot. A march that returned a time alone would be asking you to accept its step size, its stopping rule and its flow assumption on trust.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/advanced/fc5a_m03.json', label='fc5a_m03', expect_n=15)
finish()
