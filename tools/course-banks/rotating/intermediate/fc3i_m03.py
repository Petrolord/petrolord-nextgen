import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Professional m03, a speed change and a trim. Digest Section 8 only.
# THE PD3 SEAM: the ESP course owns the affinity laws, the best efficiency
# point and the operating range. Nothing here is keyed on a law PD3 owns; the
# keys are on what this engine RETURNS and on the seam, which is that a speed
# change follows the laws exactly and a trim does not.

q(2, "The speed-change table prints two columns headed \"less the ratio squared\" and \"less the ratio cubed\". What are those columns for?",
 "They subtract the law from the engine's own answer, which is how a claim of exactness is stated rather than asserted.",
 ["They record the correction the engine applies after scaling, which is what separates the result from a bare proportionality.",
  "They record how far the ratio sits from the ends of the band the engine will report without comment.",
  "They record the residual left by the solve that found the scaled duty, so a reader can see the crossing converged."],
 "The quotient columns say what happened. The difference columns say how close it is to what the law claims. The laws themselves belong to the ESP course, which this one cites.")

q(0, "Across the five speed rows the two difference columns print ten figures, of which eight are zero. What are the other two, and what do they mean?",
 "5.551115123125783e-17 and 1.1102230246251565e-16, which are what exactness comes to in double-precision arithmetic.",
 ["5.551115123125783e-17 and 1.1102230246251565e-16, the residual left by scaling a duty.",
  "0.490000000 and 0.810000000, the head quotients on two rows the law missed.",
  "0.343000000 and 0.729000000, the power quotients where the cube left a remainder."],
 "The two sit at a speed ratio of 0.700000 on the head leg and 0.900000 on the power leg. A lesson that asserts the laws hold and shows a quotient column is asking to be believed.")

q(3, "At a speed ratio of 1.100000 the engine returns 1357.898266 gpm, 505.539232 ft and 243.628747 brake hp, with a power quotient of 1.331000000 and a difference from the ratio cubed of 0. Which figure on that row is the one that gets bought?",
 "The 243.628747 brake hp, because the driver has to be able to deliver it.",
 ["The 1357.898266 gpm, because a station is bought on the flow it delivers and the rest of the row follows from it.",
  "The 505.539232 ft, because the head is what the vendor quotes a machine against and the power is derived from it downstream.",
  "The 1.331000000 power quotient, which survives a change of units."],
 "A flow of 1357.898266 gpm sounds modest beside a base of 1234.452969 gpm. The power went to 1.331000000 of what it was.")

q(1, "The warned column is false on all five rows of the speed table. What does that establish?",
 "That the engine declined to interrupt over changes of that size, and nothing more.",
 ["That the engine has endorsed the affinity laws at those five ratios, which is what the column exists to record.",
  "That all five ratios fall inside the band, which is a published correlation limit the engine enforces by refusing outside it.",
  "That the difference columns came back at or near zero on every row, since the warning is raised off those differences."],
 "A false in that column is the absence of a comment. The band it is measured against is a sanity bound.")

q(0, "Both ends of the band the engine reports a speed ratio over without comment were measured rather than read out of a constant. How?",
 "By walking the ratio up from 0.010000 and down from 5.000000 until the warning changes state, which gives 0.500000000000 and 1.500000000000.",
 ["By reading the ratios at which the two difference columns stop coming back as zero, which gives 0.500000000000 and 1.500000000000.",
  "By halving the ratio until the returned brake power leaves the ideal cube, which is the leg the warning names.",
  "By comparing the scaled duty against a re-solved one until the two part company by more than the engine tolerates."],
 "Each end is the ratio at which the engine's own behaviour changes. Neither was taken from a declared constant.")

q(2, "At a speed ratio of 100.000000 the engine returns 123445.296915 gpm, 4178010.181407 ft and 183041883.582474 brake hp. What has it done with the laws?",
 "Applied them, and said out loud that no real machine should be expected to behave this way.",
 ["Refused them, and returned the three figures as a diagnostic rather than as an answer a caller may use.",
  "Applied them and clamped the power leg, since the cube is the leg the warning names as the dangerous one.",
  "Applied them and dropped the warning, since a ratio that far out is absurd on its face."],
 "Its warning says \"a speed ratio of 100 is far outside the range over which the affinity laws describe a real machine: the power leg goes as the cube, so this is an extrapolation on the number that sizes the driver\".")

q(1, "What kind of limit are the two ends of that band?",
 "A sanity bound, since no publication in this repository says where the affinity laws stop describing a real machine.",
 ["A correlation limit, since the band was measured out of the engine and both ends came back to twelve decimal places.",
  "A validity range, since a ratio inside it is certified by the engine and a ratio outside it is refused by it.",
  "A vendor limit, since it is the same kind of figure as the casing limit the trim warning names."],
 "It is warned on and never used to refuse, and nothing computed from it decides a value. No graded answer in this course sits on it.")

q(3, "On the trim table the ideal and the real columns agree on the first three rows and part company from a trim percent of 8.000000 onward. Why?",
 "The shortfall model is zero at or under five percent of trim, so the first three rows have nothing de-rated on them.",
 ["The first three rows sit inside the band the engine reports without comment, and the de-rating begins where that band ends.",
  "The ideal columns are computed only where the real ones differ, so the first three rows repeat the real figures for readability.",
  "A trim of five percent or less is within the machining tolerance of a casing, so the engine reports the catalogue duty unchanged."],
 "At a trim ratio of 0.950000 the ideal and real flows are both 1172.730321 gpm. At 0.920000 they are 1135.696732 gpm and 1125.475461 gpm.")

q(1, "The shortfall model is zero at or under five percent, then 0.006 per further percent, capped at 0.12, applied whole to the head and half to the flow. What does the course do with it?",
 "Teaches it and grades nothing on it, because the engine's comment calls it \"the published shortfall\" and names no publication.",
 ["Teaches it and grades it, because the model is stated in full and every figure it produces is reproducible from the engine.",
  "Declines to teach it, because a model with no publication behind it cannot be put in front of a reader as engine behaviour.",
  "Teaches it as the affinity law for a diameter change, which is the form the laws take when the speed is held and the impeller is cut."],
 "No graded value in this course is a trimmed flow, head or shortfall. The speed law beside it is on a different footing and is exact.")

q(3, "At a trim ratio of 0.799900 the engine warns about a 20.0 percent trim, and at a trim ratio of 0.800000, a trim percent of 20.000000, the warning is null. What is going on?",
 "The threshold is exclusive, so the vendor limit itself does not warn.",
 ["The 0.800000 row falls inside the shortfall model's cap of 0.12, and a capped row is reported without a comment.",
  "The 0.799900 row is a deeper trim than the 0.800000 row by enough to cross the casing limit the message names.",
  "The engine warns on the trim ratio rather than the trim percent, and a ratio of 0.800000 sits at the bottom of the range the shortfall model covers."],
 "The message at 0.799900 reads \"a 20.0 percent trim is beyond what most casings tolerate: efficiency falls away and the vendor limit usually sits near 20 percent\".")

q(0, "A speed ratio of 0.800000 gives 987.562375 gpm and a trim ratio of 0.800000 gives a real flow of 943.122068 gpm. What separates them?",
 "They are different changes to different hardware, and only one of the two is described by a law that holds exactly.",
 ["A trim is a speed change with the shortfall applied twice, once to the head and once to the flow, which is where the difference comes from.",
  "The trim figure is a re-solved duty and the speed figure is a scaled one, so the two answer different questions about the same change.",
  "The 987.562375 gpm is the trim's ideal flow and the 943.122068 gpm its real flow, so both belong to the trim."],
 "The trim's ideal flow at 0.800000 is also 987.562375 gpm, which is exactly why the two get confused. The real flow is 943.122068 gpm.")

q(2, "At a trim ratio of 0.750000 the flow comes out at 0.940000000 of ideal and the head at 0.880000000 of ideal, while the brake power is 1.000000000 of the ideal cube. What does the engine report on that row, and how closely?",
 "An implied efficiency ratio of 0.827200000, against the 0.827200000 the two legs give, a difference of -1.1102230246251565e-16.",
 ["An implied efficiency ratio of 0.827200000, which a reader has to reach by multiplying the two legs because the field is not on the return.",
  "An efficiency of 0.827200000, measured on a trimmed impeller and carried through to the brake power on that row.",
  "A shortfall percent of 12 and nothing else, since the efficiency the return implies is left for a caller to work out."],
 "The field is the arithmetic the return already contains, stated as a number. A hand division at fewer decimals disagrees with it for no defensible reason.")

q(3, "Why is the power leg of a trim left as the ideal cube while the head and flow legs are de-rated?",
 "De-rating it would mean inventing a second unsourced model on top of the first.",
 ["The power leg is the one the affinity laws describe exactly, so it is the only leg of a trim that can be scaled without a correction.",
  "A cut impeller draws the same power as an uncut one at the same speed.",
  "The shortfall applies whole to the head and half to the flow, which between them account for the whole of the power and leave nothing for a third leg."],
 "The only correction available is the shortfall model, which has no publication in this repository. What the engine owes a reader is the arithmetic it actually did.")

q(1, "A trim ratio of 0.950000 is meant to be exactly five percent and the rule says five percent carries no shortfall. The engine returns a trim percent of 5.000000000000004 and a shortfall percent of 0. What has happened?",
 "The comparison is carrying a slack, because the subtraction puts the trim percent above five by 4.440892098500626e-15.",
 ["The engine rounded the trim percent back to five before comparing it, which is why the returned figure and the compared figure differ.",
  "The shortfall is zero because 0.006 per further percent of 4.440892098500626e-15 rounds away, so no slack is needed.",
  "The rule is written as at or under five percent and 5.000000000000004 is under five once the trailing figures are discarded."],
 "A bare test against five would have put that row on the wrong side and produced a shortfall where the rule says none belongs.")

q(0, "How large is that slack, and how was it found?",
 "By halving the trim ratio until the shortfall leaves zero: 5.000000000999993 with none and 5.0000000010000045 with one, so the boundary sits 1.0000045236324695e-9 above five percent.",
 ["By reading it off the trim percent of 5.000000000000004, which is the gap the comparison has to span and is 4.440892098500626e-15 wide.",
  "By walking the trim ratio until the warning changes state, the same route that gave the two ends of the speed band.",
  "By comparing the shortfall percent of 0.006000000000002004 at a trim ratio of 0.949900 against the 0 at 0.950000."],
 "The rule is written in whole percent and the value it is compared against is not one. The warning boundary carries the same slack, and a trim percent of 19.999999999999996 still returns null.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/intermediate/fc3i_m03.json', expect_n=15)
finish()
