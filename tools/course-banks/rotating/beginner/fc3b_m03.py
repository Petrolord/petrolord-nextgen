import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Associate m03, The Duty Point Solved. Digest Section 3 only.

q(0, "Read down the pump-less-system column of the OKONO table and it runs 330.203016, 310.789450, 252.315660, 154.781645, 18.187407, -157.467056, -372.181743. What does that sequence establish before anything is solved?",
 "That the crossing lies between 1200.000000 gpm and 1500.000000 gpm, because the column changes sign exactly once in that interval.",
 ["That the crossing lies below 1200.000000 gpm, since the column has already fallen to within twenty feet of zero by that flow.",
  "That the two curves are parallel over the upper half of the range, since the column falls by a steady amount on each of the last three rows.",
  "That there are two crossings in the range, one either side of 900.000000 gpm, because the column changes by more between rows there than anywhere else."],
 "It starts positive and ends negative. The flow where it is zero is the duty point, and 18.187407 ft at 1200.000000 gpm with -157.467056 ft at 1500.000000 gpm brackets it."),

q(3, "At the solved OKONO duty the pump makes 417.801018 ft and the system demands 417.801018 ft. What is the difference between them?",
 "0 ft, which is what solved means here.",
 ["0.203016 ft, the same gap the fit carries at the shutoff reading.",
  "18.187407 ft, the head difference read off the row nearest the crossing.",
  "2.2737367544323206e-13 ft, the width the search finished on expressed in feet."],
 "Both figures come off the engine, the second read back off the return. The duty is the one flow at which both descriptions hold at once."),

q(1, "Why can the engine go looking for a single answer rather than a set of them?",
 "The pump head falls away from shutoff while the system head climbs from static, so their difference changes sign exactly once.",
 ["A quadratic and a quadratic cross at two flows at most, and the module discards whichever root falls outside the published catalogue range.",
  "The bisection is capped at 200 halvings, so it returns the first crossing it meets and never has the budget to look for a second.",
  "The system curve is linear in flow and a line crosses a parabola once, which is the property the solve is built on."],
 "One sign change is all a bisection needs. That shape is also why a system demanding more head at zero flow than the pump makes at shutoff has nothing to find."),

q(2, "What are the four pieces of evidence the OKONO duty return carries about the search that produced it?",
 "The halvings taken, the bracket it stopped on, the head difference at the flow it returned, and a convergence flag.",
 ["The starting bracket, the number of sign changes seen, the largest step taken and the final midpoint.",
  "The condition number of the solve, the residual, the iteration cap and the warning string.",
  "The pump head, the system head, their difference and the flow the difference was evaluated at."],
 "55 halvings out of a cap of 200, a bracket of 2.2737367544323206e-13 gpm, a head difference of 0 ft, and converged true with a warning of null."),

q(0, "A colleague proposes building the convergence flag from the bracket width alone. What is wrong with that?",
 "On a bracketed sign change bisection always collapses, so the flag could never come back false and would validate nothing.",
 ["The bracket is reported in gallons per minute, so a flag built from it would pass or fail differently on a station stated in cubic metres.",
  "The bracket halves only when the sign changes, so a search that never sees a sign change would leave the flag undefined rather than false.",
  "The bracket is smaller than the resolution of the flow itself."],
 "The bracket halves every iteration whatever the function is doing inside it, so a width of nothing is guaranteed rather than earned."),

q(3, "Which input makes the OKONO convergence flag come back false?",
 "A curve that returns a non-finite head over part of the range, which sends the comparison false at every step there.",
 ["A system curve whose static head exceeds the pump shutoff head, which leaves the search with no sign change to bracket.",
  "A search limit set below the crossing, which stops the halvings before the midpoint has settled.",
  "A point set that rises with flow, whose crossing the solve reports with the flag cleared."],
 "The search is told at every step inside that region that the sign went the same way, so it marches quietly to the bottom of it. The other three come back as refusals rather than as an unconverged answer."),

q(2, "The negative control returns 900.000000 gpm on curves that really cross at 1234.452969 gpm. How far off is that, and which half of the flag caught it?",
 "334.452969 gpm off, caught by the residual, which asked whether the curves agree at the flow being returned.",
 ["334.938111 gpm off, caught by the bracket, which finished far wider than it does on a healthy solve.",
  "334.452969 gpm off, caught by the halving count, which ran to 56 against the 55 a healthy solve takes.",
  "154.781645 gpm off, caught by the warning string, which the return carries alongside the flag."],
 "The bracket finished at 1.1368683772161603e-13 gpm, which is at the resolution of the numbers themselves, so the bracket half would have called it converged."),

q(1, "What is the residual at the flow the negative control returns?",
 "154.7816454151096 ft.",
 ["0 ft, the same as on the healthy solve, which is why the bracket had to be consulted instead.",
  "334.452969 ft, which is the same figure as the flow error because the two curves cross at unit slope.",
  "1.1368683772161603e-13 ft, at the resolution of the numbers themselves."],
 "Not a small disagreement in feet of head by any standard this course has used. That is a check which can fail sitting beside one that cannot."),

q(0, "The engine did not throw and did not refuse on the negative control. Why is a flow, a head and a cleared flag the right shape for that failure?",
 "The caller may want to see how far off the search went, and every field prints normally so the flag is the one that carries the verdict.",
 ["A throw would have been caught by the studio and turned into a blank panel, which hides a result the reader is entitled to inspect.",
  "A refusal object carries no numbers, and the module guarantees that every return carries the flow it was asked for.",
  "The search did converge in the sense the module defines, so a refusal would have contradicted the bracket the return reports."],
 "The one field that says the number is wrong is the one field a hurried caller skips, which is the mistake the lesson names."),

q(3, "A blind loop taking a fixed 200 halvings with no stopping test is run on the same pair of curves. What does it return?",
 "1234.452969 gpm, a difference of 0 gpm from what the engine gives.",
 ["A flow 334.452969 gpm away, as the non-finite curve gives.",
  "A flow it cannot report, because with no stopping test the bracket underflows and the midpoint is no longer representable.",
  "A flow differing in the sixth decimal, which is the accuracy the stopping test buys back."],
 "Nothing moved when the report was added. The loop breaks exactly where the blind one was already standing still, so the reporting costs no accuracy and buys a flag, a bracket and a residual."),

q(2, "Raise the OKONO station static head to 700.000000 ft and ask for the duty. What comes back, and what evidence travels with it?",
 "A refusal saying this pump cannot start this system, with a shutoff head of 540.203016 ft against a static head of 700.000000 ft.",
 ["A duty at the lowest flow in the search window, carrying a cleared convergence flag and a residual of 159.796984 ft of head to go with it.",
  "A refusal saying the curves do not cross below the search limit, with the limit quoted back.",
  "A duty of 804.694816 gpm, since a higher static head moves the crossing left along the pump curve."],
 "The gap is 159.796984 ft. Read the evidence and you know both that the selection fails and by how much."),

q(1, "\"the curves do not cross below 200 gpm: raise the search limit or check the system curve\". How does this refusal differ in kind from the other two?",
 "It is a statement about how the question was asked rather than about the machine or the station.",
 ["It is a warning rather than an error, so the return also carries the flow the search reached before stopping.",
  "It names two possible causes rather than one, which is what makes it the only refusal in the module that cannot be acted on directly.",
  "It is raised by the fit rather than by the duty solve, so it arrives before either curve has been evaluated."],
 "Nothing is wrong with the pump and nothing is wrong with the station. A caller that treats all refusals alike will go looking for a bigger pump when the fix was a search limit."),

q(0, "Hold the OKONO machine and its friction statement and move only the static head. What does the duty do?",
 "It moves along the pump curve: 1488.478813 gpm at a static head of 60.000000 ft and 804.694816 gpm at 400.000000 ft.",
 ["It holds the flow it had and raises the head to match, since the machine is unchanged and only the lift above it has moved.",
  "It falls in head and rises in flow, because a higher lift leaves less of the pump head available for friction to absorb.",
  "It stays where it was until the static head passes the shutoff head, at which point the solve refuses."],
 "Every duty on that table came out of the same four catalogue readings. What moved was the thing the pump was connected to."),

q(3, "A second station takes the same machine at a static head of 60.000000 ft with a friction head of 380.000000 ft at 1100.000000 gpm. What is the duty and how does the head split?",
 "1103.518695 gpm at 442.434987 ft, of which 60.000000 ft is static and 382.434987 ft is friction.",
 ["1488.478813 gpm at 362.123069 ft, with 60.000000 ft of that as friction.",
  "1234.452969 gpm at 417.801018 ft, as on the OKONO station.",
  "1103.518695 gpm at 442.434987 ft, with 380.000000 ft of it static."],
 "Its implied coefficient is k = 0.000314049587 ft per gpm squared, against 0.000136363636 on the OKONO station, so this is a far more restrictive piece of piping."),

q(2, "What claim is being made when a datasheet quotes the OKONO pump at 1234.452969 gpm with no station named?",
 "None that survives. The same machine gives 804.694816 gpm into one station and 1103.518695 gpm into another.",
 ["That the figure is the pump's rated flow, which is a property of the catalogue and travels with the machine.",
  "That the figure came off a converged solve, which is the only claim a duty flow ever carries.",
  "That the figure is the flow at which the fitted curve and the catalogue readings agree most closely."],
 "A duty point is a property of a pump and a station together. Change the piping, the static head or the friction and it moves, which is why a catalogue can never print it."),

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/beginner/fc3b_m03.json', expect_n=15)
finish()
