import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Professional m02, cavitation and flashing.
# Every figure is from digest SECTION 18 and SECTION 19 at the rendering those
# sections print. No regime word and neither exported sigma threshold is a keyed
# answer anywhere in this bank, because the engine states both thresholds as its
# own screen and this course grades neither.

q(2, "Every cavitation index this engine returns carries a basis line with it. What does that line say the index was computed on?",
 "The pressure drop the valve uses, which is the allowable drop once the service is choked.",
 ["The stated pressure drop handed to the engine, taken before any cap is applied.",
  "The difference between the inlet pressure and the vapour pressure of the liquid.",
  "The allowable drop on every row, whether or not the service is choked there."],
 "The engine returns the basis rather than leaving a reader to work it out. Two pressure drops are available on a choked service and only one of the two answers means anything.")

q(0, "What is wrong with a cavitation index computed on the stated drop of a choked service?",
 "The denominator is a pressure drop the valve is incapable of taking, so the index that comes out belongs to a machine that does not exist.",
 ["The denominator is correct and the numerator is wrong, because the inlet pressure has to be replaced by the pressure at the vena contracta.",
  "The index comes out negative, because the stated drop on a choked service exceeds the difference between the inlet and the vapour pressure.",
  "Nothing is wrong with it, because the two drops agree to within the tolerance the engine grades the index at."],
 "The cavitation index is the pressure available to suppress vaporisation divided by the pressure drop being taken.")

q(3, "Down the march the cavitation index reads 4.651599, then 2.885714, 2.040786, 1.593572 and 1.307130, and then holds one figure on the last four rows. Why has it stopped moving?",
 "It is computed on the drop used, and the drop used has been capped at the allowable drop.",
 ["The engine rounds the index to six decimals and the remaining change falls below the last place.",
  "The engine stops recomputing the index once the regime word has reached its last rung.",
  "The index has reached the exported cavitating threshold and the engine clamps it there."],
 "Both the coefficient and the index stopped in the same place and for the same reason. A reader who expects the index to keep falling is expecting a number computed on the stated drop.")

q(1, "The vapour pressure box is left empty on a liquid sizing. What does that do to the cavitation screen?",
 "The index is infinite, the last rung of the ladder is taken, and every liquid service at every pressure drop reads as stable.",
 ["The index is zero, the first rung of the ladder is taken, and every liquid service at every pressure drop reads as choked.",
  "The index is returned as a non-finite value and the screen renders an empty cell that a reader can see is empty.",
  "The index is computed from the critical pressure instead, so the screen runs and reports a regime that is too pessimistic."],
 "The screen renders green and the screen has not run. That is why the repaired engine refuses the call rather than answering it.")

q(0, "How does the engine's refusal on a missing vapour pressure end?",
 "`Every liquid has a vapour pressure at its flowing temperature, so state it`",
 ["`Supply a vapour pressure or accept the default for the fluid family named`",
  "`No vapour pressure was given, so the cavitation index has been suppressed`",
  "`State a vapour pressure or a critical pressure, and the engine will derive the other`"],
 "The last clause is the one to argue with a datasheet over. An empty box is a missing input rather than a property the fluid lacks.")

q(2, "On the row at an outlet pressure of 110.000000 psia the regime word is cavitating and the choked flag is false. What is happening to the valve there?",
 "It is being damaged by bubble collapse while the sizing equation is still behaving perfectly.",
 ["It is choking at the vena contracta while the flag lags a row behind the regime word.",
  "It is passing less flow than the coefficient implies, because the regime word carries a derate.",
  "It is operating normally, because the engine reserves the word for a condition it has not yet reached."],
 "A valve chosen for a service in that range passes every check a sizing calculation makes, and the failure that follows shows up as a leaking valve and a thinned pipe rather than as a control problem.")

q(3, "What would a review that read only the choked flag have concluded about the rows above the crossing?",
 "That every one of them is acceptable, including the rows the engine itself labels with a cavitation word.",
 ["That every one of them is unacceptable, because a false flag is reported only where the sizing has been capped.",
  "That the rows cannot be judged, because the flag is withheld where a cavitation word appears.",
  "That the rows either side of the crossing carry the same coefficient."],
 "That is the reason the regime word and the choked flag are separate returns. A tool reporting only the flag calls five of the nine rows of this march acceptable.")

q(1, "How were the outlet pressures at which the regime word changes established?",
 "By bisecting the word the engine returns until each boundary was located.",
 ["By solving the index for the sigma at which each rung sits and inverting it for the outlet pressure.",
  "By reading them off the marched rows where the word changes.",
  "By taking the exported thresholds and scaling them on the allowable drop of the valve."],
 "Stable gives way to incipient cavitation at an outlet pressure of 174.180000 psia and incipient gives way to cavitating at an outlet pressure of 137.820000 psia.")

q(2, "The engine exports the two sigma values its regime ladder turns on. What does the digest say about where those two values come from?",
 "Both belong to this engine, which exports them so that a reader can see what decided the word.",
 ["They are read from the published source the recovery factors come from.",
  "They are derived from the critical pressure ratio factor of the fluid.",
  "They are fitted to the marched valve and so belong to that service rather than to the engine."],
 "The engine exports them so that a reader can see exactly what decided the word on the screen, and this course grades no regime word as a result.")

q(0, "What does the fact that the two ladder thresholds are exported allow an organisation to do?",
 "Read them, replace them with its own cavitation criteria, and say what the word on the screen would have been under its own screen.",
 ["Grade a learner on the regime word, since an exported threshold is a defensible figure.",
  "Cite the thresholds to a standard, since exporting a value is what publication means.",
  "Recover the allowable drop of any valve, since the thresholds and the index together fix it."],
 "Because they can be read, they can be replaced, and an organisation can say what its own screen would have returned instead of arguing about a black box.")

q(1, "Which of the three rungs of the ladder is different in kind from the other two?",
 "The choking rung, because choking is a hydraulic fact about the valve and the fluid.",
 ["The stable to incipient rung, because it is the only one the engine does not export.",
  "The incipient to cavitating rung, because it is the only one that moves with the fluid.",
  "None of them, because all three are hydraulic facts rather than screens."],
 "The first two rungs are a judgement about when damage starts to matter, and different organisations draw them in different places.")

q(3, "An outlet pressure of 26.740000 psia sits against a vapour pressure of 28.740000 psia. What does the engine return?",
 "Flashing true, the regime word flashing, and a coefficient.",
 ["Flashing true, the regime word cavitating, and a refusal in place of the coefficient.",
  "Flashing false, because the flag turns on only below the vapour pressure rather than at it.",
  "Flashing true, with the coefficient recomputed on a two-phase density the engine derives."],
 "When the outlet is at or below the vapour pressure the liquid is flashing rather than cavitating, and the engine separates the two and says which one it has.")

q(2, "What does the digest print about the outlet pressure at which the flashing flag turns on, set against the stated vapour pressure?",
 "A difference, the first less the second, of 0.000000 and a ratio, the first over the second, of 1.000000.",
 ["A difference of 2.000000 and a ratio of 1.074452, which is the margin the engine leaves before the flag turns on.",
  "A difference of 0.000000 and a ratio of 0.892161, the fluid's own critical pressure ratio factor.",
  "No comparison at all, because the engine reports the flag rather than the pressure at which it turned over."],
 "That is as clean a boundary as this course carries. The engine turns the flag on at exactly the vapour pressure, which makes the test the physical statement it appears to be.")

q(1, "What does an anti-cavitation trim do for a flashing service?",
 "Nothing, because there is no bubble collapse for it to suppress.",
 ["It moves the collapse away from the metal, which is the same thing it does on a cavitating service.",
  "It restores the coefficient the engine capped, by staging the letdown across several passages.",
  "It raises the outlet pressure back above the vapour pressure by recovering part of the drop."],
 "In flashing the stream leaves the valve as a two-phase mixture and stays that way, so what is left is an erosion problem in the valve outlet and the downstream pipe.")

q(0, "The engine's flashing message carries three separate instructions. What are they?",
 "Size for two-phase flow, use hardened trim, and expand the outlet.",
 ["Size for two-phase flow, fit a multistage trim, and raise the downstream pressure.",
  "Derate the coefficient, fit hardened trim, and recheck the service at the turndown case.",
  "Size on the allowable drop, fit an anti-cavitation trim, and expand the outlet."],
 "The engine's own words are `the outlet is at or below the vapour pressure: this service is FLASHING, and an anti-cavitation trim will not help a flashing service. Size for two-phase flow and use hardened trim with an expanded outlet`.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/intermediate/fc8i_m02.json', label='fc8i_m02', expect_n=15)
finish()
