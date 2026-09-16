import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Associate m05, Where the Duty Landed. Digest Section 5 only.
# SECTION 5 IS HELD FOR LITERATURE ON ITS BANDS: "no graded value in this
# course is a region, a percentage of best efficiency flow or a preferred
# flag." So no key below is a region label, a percentage of best efficiency
# flow or a preferred flag. The keys are the engine's refusal, the shape of
# the return, the physical content of the notes and the limitation the high
# note names about the module it lives in.

q(2, "Where does the best efficiency flow come from when the operating region is judged?",
 "It is stated to the engine. The module does not derive it and the fit cannot recover it.",
 ["It is read off the fitted curve at the flow where the quadratic turns over, which is the closest the catalogue points come to naming it.",
  "It is taken as the largest flow in the point set.",
  "It is solved alongside the duty, since the crossing and the best efficiency flow both come out of the same pair of curves."],
 "The four catalogue readings are heads and the best efficiency flow is a statement about efficiency. It comes off the vendor curve and somebody has to type it in."),

q(0, "Ask for the operating region with no best efficiency flow, and ask again at a negative one. What comes back?",
 "The same refusal both times: { error: \"a BEP flow is needed to judge the operating region\" }.",
 ["A refusal for the missing figure and a judged return for the negative one, whose sign is dropped before the comparison.",
  "A judged return both times, built on the largest catalogue flow, with a note saying the figure was assumed.",
  "A refusal for the negative figure and a judged return for the missing one, which falls back to the module default."],
 "There is no default here. A guessed best efficiency flow would produce a confident verdict about a pump nobody described."),

q(3, "The OKONO region return carries four fields. What kinds of thing are they?",
 "A measurement, a label, the machine-readable form of that label, and prose.",
 ["Four measurements taken at the duty flow, differing only in the units each one is expressed in.",
  "Two inputs echoed back and two results.",
  "A measurement, its uncertainty and a label."],
 "The percentage is a measurement, the region is a label, the preferred flag is the machine-readable form of that label, and the note is prose."),

q(1, "Why does the return carry both a measurement and a label rather than either one?",
 "A measurement alone leaves every reader to apply their own bands, and a label alone throws away how close the duty is to an edge.",
 ["A measurement alone cannot be shown on screen, and a label alone cannot be tested by the function further down the chain.",
  "A measurement alone would have to be recomputed by every caller, and a label alone would have to be translated before it could be printed.",
  "A measurement alone is held for literature, and a label alone carries no note to explain what it costs."],
 "Two engineers reading the same duty would otherwise read it differently, and a selection sitting at the edge of its band would look the same as one sitting in the middle."),

q(2, "A caller tests the label, a second caller tests the flag and a third tests for the presence of a note. What do the three get?",
 "The same verdict, because the return is built so that no two of them can disagree on any row.",
 ["Three readings that agree in the middle of a band and part company at its edges, which is why the boundary walk exists.",
  "Three readings that agree except where the note is absent, since a missing note is not the same claim as a cleared flag.",
  "Three readings that cannot be compared at all."],
 "The flag is true on exactly the rows carrying the label it stands for, and a note is present on exactly the rows where the flag is cleared."),

q(0, "Why is a band table asked on both sides of every boundary rather than in the middle of each band?",
 "A comparison written with the wrong kind of inequality misclassifies exactly one value, the boundary value itself, and behaves perfectly at every other flow.",
 ["A band table asked in the middle of each band cannot show that the bands are adjacent, which is the property the boundaries are there to establish.",
  "The middle of a band is where the classifier is slowest, so a table asked there measures the cost of the call rather than its correctness.",
  "A duty almost never lands in the middle of a band, so a table asked there is testing a case the module will not meet in service."],
 "That is a defect which hides everywhere except at the edge. The middle is where every implementation agrees."),

q(1, "The boundary walk assigns fifteen flows to fifteen labels and every pair behaves consistently. What has it NOT established?",
 "Whether the boundaries are in the right places at all, which is the question held for literature.",
 ["Whether the classifier is stable when the same flow is asked twice, which needs a repeated call rather than a walk.",
  "Whether the duty those flows were taken from came off a converged solve, which the region call cannot see.",
  "Whether the module would classify a flow above the largest one on the table, which sits outside the walk."],
 "A correct implementation of a convention is still an implementation of a convention. The repository holds no publication for the boundaries."),

q(3, "The engine note for a duty well below best efficiency flow names a mechanism. What is it?",
 "Suction and discharge recirculation, with bearing and seal life shortening.",
 ["Cavitation at the eye, with the driver overloading.",
  "A steep climb in the required NPSH.",
  "Throttling across a control valve, the head lost as heat."],
 "Too little flow through an impeller designed for more leaves the passages partly stalled and fluid turns back on itself at the eye and at the periphery."),

q(2, "Why do bearings and seals come into a note about low flow at all?",
 "Recirculation is unsteady, so it loads the shaft in a direction that changes.",
 ["The shaft turns more slowly at low flow, so the bearings spend longer below the speed at which their film forms.",
  "A throttled discharge raises the pressure the seal holds.",
  "The fluid warms as it recirculates, and the bearings and the seal are the two parts whose life is set by temperature."],
 "That sentence is also the one place in the whole package that says anything at all about seals and bearings, and it says it in prose."),

q(0, "Only one of these four returned notes prescribes a remedy rather than describing a consequence. What does it offer?",
 "It prescribes, offering a smaller pump, a trim or a variable speed drive as three ways of making the machine smaller.",
 ["It quotes a figure back, naming the flow at which the duty would return to the band it fell out of.",
  "It refuses, returning an error string in place of the label the other bands carry.",
  "It names two failure modes rather than one, arriving from opposite ends of the machine."],
 "A duty that far down the curve usually means a control valve is absorbing the difference between what the pump makes and what the station needs, and that difference is paid for in electricity."),

q(1, "The note for a duty far above best efficiency flow warns about two things. Which two, and from where on the machine?",
 "Running out of NPSH and cavitating, from the suction side, and the driver overloading, from the drive end.",
 ["Recirculation at the impeller eye, from the suction side, and shortened seal life, from the discharge end of the machine.",
  "A steep climb in the required NPSH, from the suction side, and a fall in the delivered head, from the discharge end.",
  "Wasted power across the control valve, from the discharge side, and damage to the machine, from the impeller."],
 "Two failures in one sentence, arriving from opposite ends. A duty that far to the right threatens both at once."),

q(3, "One of the four notes has three clauses and the middle one is a confession. What does it confess?",
 "That this module carries NPSHr as a single number rather than as a curve.",
 ["That the band it fires in has no publication behind it anywhere in this repository.",
  "That the duty may have come off a cleared flag.",
  "That the required NPSH was read at the wrong flow."],
 "The engine's own words are that the module carries NPSHr as a single number rather than a curve, so the vendor curve has to be read at THIS flow before the suction margin means anything."),

q(2, "What form does the required NPSH of a real pump take, and what form does this module carry it in?",
 "A curve against flow that rises steeply at the right-hand end, carried here as a scalar the caller types in.",
 ["A single figure quoted at best efficiency flow, carried here as a curve the module fits from the catalogue points.",
  "A curve against speed rather than against flow, carried here as a scalar taken at the rated speed.",
  "A band with a low and a high value, carried here as the midpoint of the two."],
 "There is no required-NPSH-against-flow curve anywhere in these two engine modules, which is one of the four absences the course names."),

q(0, "A required NPSH is read off the vendor curve at best efficiency flow and the duty then solves out well above it. What does the suction check return?",
 "A margin, a verdict and a severity, all of them computed correctly from a number that does not apply at the flow in question.",
 ["A refusal, because the module detects that the required figure was quoted at a different flow from the duty.",
  "A margin carrying a warning, since the check compares the duty flow against the flow the required figure was quoted at.",
  "Nothing at all, because the check is suppressed whenever the duty lands outside the preferred band."],
 "The consequence is exact. The check will be run against a required NPSH that is too low."),

q(1, "The engine met a hazard it could not assess properly. What did it do about it?",
 "It ran the calculation it was asked for and marked the assumption that calculation rests on.",
 ["It invented a required-NPSH curve from the duty and the stated scalar, and said so in the note.",
  "It suppressed the suction check for that duty and returned the note in place of a margin.",
  "It refused the whole region call, on the ground that a verdict it cannot stand behind is worse than none."],
 "A warning that names the specific limitation of the code producing it and states the action that closes the gap is something a reader can act on today."),

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/beginner/fc3b_m05.json', expect_n=15)
finish()
