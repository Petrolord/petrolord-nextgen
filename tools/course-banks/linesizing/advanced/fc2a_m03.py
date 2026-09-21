import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Expert m03, Where the Correlations Stop. Digest section 15.

q(1, "On the OGBIA pipe the friction factor reads 0.0304761905 at a Reynolds number of 2099.9999999 and 0.0488545386 at 2100.0000. How large is that step, and what produced it?",
 "A ratio of 1.603040, and it is the engine leaving the laminar law and starting the turbulent one at the boundary it draws.",
 ["A ratio of 1.603040, and it is the pipe's roughness entering the calculation for the first time, since the laminar branch below the boundary carries no roughness term at all and the turbulent branch above it does.",
  "A ratio of 1.603040, and it is the transition itself, which is a real physical change in the flow that both of the branches are written to reproduce on their own side of the boundary.",
  "A ratio of 1.603040, and it is the fixed point in the friction solve failing to settle so close to the boundary, which is why the two figures either side of it disagree so widely."],
 "Nothing physical happens across that interval. The engine leaves the laminar law and starts the turbulent one, and the discontinuity is the price of having no correlation for the band between the two branches.")

q(3, "Between a Reynolds number of 2099.9999999 and one of 2100.0000 the friction factor moves by a ratio of 1.603040. What changed in the line over that interval?",
 "Nothing did. The fluid, the pipe and the duty are identical, and only the correlation being applied to them is different.",
 ["The flow crossed from a laminar profile into a turbulent one, which is the step being reported.",
  "The relative roughness became significant, because a laminar flow cannot feel a wall that a turbulent flow can, so the pipe started behaving as a rough pipe over that interval.",
  "The Reynolds number crossed the value at which the engine begins to call the flow turbulent, which is 2100 for the label and 4000 for the arithmetic, so both changed at once."],
 "A physical transition is gradual and messy. This one is a switch placed where the engine draws its boundary, and the size of the step is a property of the two correlations meeting there.")

q(0, "Inside the band from a Reynolds number of 2100 to one of 4000 the engine returns a regime word and a friction factor together. What is the relationship between those two fields there?",
 "They come from different assumptions: the word says transitional and the number was computed on the turbulent branch, and nothing in the object marks the disagreement.",
 ["They agree, since the engine computes a transitional friction factor from a correlation written for the band and reports the matching word beside it in the same object.",
  "They contradict each other outright, because a value computed on the laminar branch is reported under a turbulent label, which is the direction that makes the band permissive.",
  "They are independent, because the regime word is set from the pipe's relative roughness while the friction factor is set from the Reynolds number alone."],
 "The regime word is not wrong and the friction factor is not a fabrication. They are two answers from different assumptions returned together, which is why the band from 2100 to 4000 is held.")

q(2, "The band between the two branches is held for the literature rather than smoothed over with an interpolation. Why is holding it the better treatment?",
 "An interpolation would hand back a curve that looks like every other answer, and holding it keeps the missing correlation visible as a limit.",
 ["Interpolating across the band would break the round trip, since a friction factor read back through the Reynolds number would no longer return the value it was computed from.",
  "The engine cannot interpolate, because the two branches live in different modules.",
  "An interpolation would move the boundary from 2100 to 4000, and a moving guard cannot be read on both sides."],
 "Nothing physical happens between a Reynolds number of 2099.9999999 and one of 2100.0000. The friction factor moves from 0.0304761905 to 0.0488545386 because the engine changes laws there, which is a fact about the engine rather than about the flow.")

q(3, "Colebrook was published for a relative roughness reaching about 0.05. Which of the five rows the course walks at a Reynolds number of 1000000.0000 sit outside that range?",
 "The rows at 0.100000, 0.200000 and 0.500000, returning 0.1016731332, 0.1557055485 and 0.3308894263.",
 ["Only the row at 0.500000, returning 0.3308894263, since a relative roughness of 0.200000 is still inside the range the correlation was fitted over and the engine flags it for that reason.",
  "None of them, because the engine answers all five and raises nothing, and a correlation that is being asked outside its range is refused by this engine in the ordinary way.",
  "The rows at 0.050000 and above, returning 0.0715737539 upward, since the published limit is where the fit stops being trustworthy rather than where it stops being defined."],
 "The engine answers all five and flags none of them. The last row describes a pipe whose wall roughness is half its own bore, which is a geometry the word roughness stops covering.")

q(1, "A friction factor of 0.3308894263 comes back from a relative roughness of 0.500000. Why is nothing about that return a warning to the caller?",
 "It arrives in the same field, in the same shape and at the same precision as a friction factor from the middle of the fit, and the curve stays smooth across the whole table.",
 ["It is accompanied by the regime word invalid, which a caller who is reading only the friction factor will miss, so the warning is present and is simply in the field beside the one being read.",
  "The engine rounds an extrapolated friction factor to fewer digits than a fitted one, so the warning is in the precision and it is easy to overlook on a single row.",
  "The value is large enough to be obviously wrong, so the engine leaves it to the caller to notice, which is the same treatment it gives a Reynolds number in the transitional band."],
 "A correlation outside its range does not usually produce nonsense. It produces a plausible number, which is worse, because nonsense gets caught.")

q(2, "Roughness carries a guard and a relative roughness of 0.500000 passes straight through it. What is that guard actually protecting?",
 "Meaning rather than validity: a length cannot be negative, so a negative roughness is refused, while a roughness outside anybody's fit is a perfectly meaningful quantity.",
 ["The published range of the correlation, which the engine enforces at the boundary of about 0.05, so a relative roughness of 0.500000 passes only because it was supplied as an absolute roughness instead.",
  "The convergence of the friction solve, since a negative roughness is the one input that stops the fixed point settling.",
  "The flow area, since a roughness approaching the bore would leave nothing for the flow to move through."],
 "A negative roughness returns the message that absolute roughness is a length and cannot be negative. The presence of one guard invites the assumption that the other exists too.")

q(0, "Weymouth takes no friction factor and no roughness. How does the course recover the friction Weymouth is assuming?",
 "By asking General Flow what friction factor would make its own rate match the Weymouth rate, using the fact that a General Flow rate goes as one over the square root of the friction factor.",
 ["By reading the Weymouth coefficient out of the published form directly, since the fully rough friction law is stated inside it and only has to be rearranged to be seen.",
  "By comparing the Weymouth rate against the Panhandle A and Panhandle B rates on the same line, since the three published forms bracket the friction factor between them.",
  "By running the same line at a very low duty, where the friction term falls away and what remains of the Weymouth rate is the friction law it was carrying."],
 "On the 7.981000 in bore General Flow settles on 0.0121761733 and the figure that would make it match Weymouth is 0.0160098631. The measurement is derived from the two engine rates and the engine friction factor on each row.")

q(3, "Across bores of 6.065000 in, 7.981000 in, 11.938000 in and 15.000000 in the friction factor implied by Weymouth falls from 0.0175440472 to 0.0129730762. What does that direction tell a reader?",
 "That Weymouth's friction law depends on the diameter rather than on the Reynolds number, which is the signature of a fully rough law.",
 ["That Weymouth parts further from General Flow as the bore grows, since the settled figure of 0.0107219615 and the implied figure of 0.0129730762 are the furthest apart of the four rows.",
  "That the implied figure is tracking the relative roughness, which falls as the bore grows on a pipe of fixed absolute roughness, so Weymouth is carrying a Colebrook friction law after all.",
  "That the implied figure is following the Reynolds number rather than the diameter, which is what a smooth turbulent law does."],
 "The implied figure is above the computed one on every row, which is why Weymouth reads lower than General Flow on all four bores. Weymouth is assuming a rougher pipe than Colebrook computes here.")

q(0, "A line is internally coated and an identical line is used steel. What do the four transmission forms make of that difference?",
 "Only General Flow can be told about it, because it is the one form that takes a roughness and reports the friction factor it reached.",
 ["All four can be told about it through the transmission efficiency, which is the input the published forms provide for exactly this purpose and which is bounded above by 1.000000.",
  "Weymouth handles it through its fully rough law, which adjusts to the wall condition.",
  "None of them, since General Flow discards the roughness before the rate is formed."],
 "Weymouth has no roughness input at all, so a coated line and a line of used steel hand it the same inputs and receive the same rate. Its friction is not a pipe property anybody entered.")

q(1, "On a nearly dead trunk Weymouth gives 10466013.4729 scfd against General Flow's 11016984.8816 scfd, a ratio of 0.949989. On the same pipe at full duty the ratio is 0.894987. What does the pair establish?",
 "That the distance between two forms moves with the duty on one unchanged pipe, 0.050011 against 0.105013, and neither form reports which state it was handed.",
 ["That the nearly dead case is outside the range of both forms, which is why they disagree there by 0.050011 while the full duty case is inside it and disagrees by only a fraction of that.",
  "That General Flow reads high whenever the friction factor it settles on is below 0.0126337788.",
  "That the two forms converge as the duty rises, since 0.894987 is the closer of the two to unity."],
 "The two forms are closer together when the line is barely flowing than when it is working. Agreement between two forms on one duty is a fact about those forms at that duty.")

q(2, "A gas transmission form returns a rate to four decimals on a line with five psi across the whole of it. What has that rate established?",
 "The arithmetic, done correctly, and nothing at all about whether the form applies to a line in that state.",
 ["That the line is inside the developed turbulent region the published forms assume, since a form that had been handed a state outside its assumptions would have returned an error object instead.",
  "That the rate is the one the line will actually carry, since the four forms differ only in their exponents and all four are fitted to the same measured transmission data.",
  "That the flow is steady, because an unsteady line cannot produce a single rate and the engine would have returned the last iterate of its solve with no flag beside it."],
 "A gas transmission form assumes a flow well into the turbulent region, developed and steady. None of the four asks whether the line it was handed is that kind of line.")

q(0, "Of the four transmission forms, only one reports anything about the pipe beyond a rate. Which, and why does that matter?",
 "General Flow, which returns the friction factor it settled on, and that single field is the only place a reader can see an assumption being made and test it.",
 ["Weymouth, which returns the fully rough friction law it applied, so a reader can compare it against a computed Colebrook figure on the same line.",
  "Panhandle B, which reports the efficiency it was run at, so a reader can see how much of the rate came from the multiplier rather than from the line.",
  "General Flow, which returns the Reynolds number it reached, so a reader can check the flow was turbulent before accepting the rate the form produced."],
 "Weymouth, Panhandle A and Panhandle B report a rate and nothing else. The form with the most visible assumption is also the only one that can be argued with.")

q(3, "Two answers in this module come out of loops. What is missing from both returns, and how far does the course go in describing it?",
 "There is no converged field, no iteration count and no residual, and the course records that both loops converge everywhere it looked.",
 ["There is no converged field, and the course records that the General Flow solve was found not to settle on the largest of the four bores, which is why that row carries an implied friction factor.",
  "There is no iteration count, and the course records that the friction solve is the only one of the two that iterates, since the General Flow rate is formed in a single pass once the friction factor is known.",
  "There is no residual reported, and the course records that the two loops disagree by 0.0126337788 on the nearly dead trunk, which is the size of the convergence gap between them."],
 "The friction factor solve runs a fixed point and the General Flow solve runs a rate and a friction factor against each other. No wrong number has been produced by either, and what is absent is the evidence.")

q(2, "A cautious reader runs the same General Flow case twice to see whether the answer is stable. What does the second run tell them?",
 "Nothing at all, because nothing in this engine reads a clock or a random number, so the same case returns the same figure whether or not the loop settled.",
 ["That the loop converged, if the two runs agree, since a loop that stopped while still moving would leave its last iterate at a different value on a second pass through the same inputs.",
  "That the friction factor is stable and the rate may not be, since only one of them is carried over.",
  "That the answer is reproducible only as far as the four decimals a gas rate is printed at, since a finer drift between two runs would not be visible in the print."],
 "Determinism is a virtue here and it removes the one check a caller might have improvised. The outlet-pressure solve is the contrast, since it refuses in words rather than returning its last guess.")

emit(Q, '/root/fc-wip-linesizing/banks/fc2a_m03.json', expect_n=15)
finish()
