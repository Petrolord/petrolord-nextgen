import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Associate m01, What This Engine Answers. Written from digest.txt Sections
# 1 and 2, which are the four lessons of this module: the one question the
# module answers, the doctrine that oil in water is a distribution, the four
# kinds of number, and the three ways this engine declines to answer.

q(2, "This engine answers a single question and dresses it several ways. Which question is it?",
 "Given this water, this oil and this equipment, what fraction of the dispersed oil comes out, and what is left in the water afterwards.",
 ["Given a required outlet concentration, which arrangement of devices reaches it for the least money spent.",
  "Given a measured inlet and outlet concentration, what efficiency to credit each device standing between them.",
  "Given this water and this oil, how much of the inlet oil is dissolved and how much of it is dispersed."],
 "Every table in this course is that one question with a single input moved. The module carries no cost of any kind, it fits nothing back out of measured concentrations, and it has no dissolved oil model, so the split at the inlet is not a question it can be asked."),

q(0, "Why will this module not size anything from a concentration alone?",
 "A concentration says how much oil is there and the distribution says how hard that oil is to remove, and every device here is characterised by the droplet size it removes half of.",
 ["A concentration cannot be turned into an oil mass flow without the droplet population standing beside it, so this module wants both figures before it will close any balance at all over a stage.",
  "The median and the spread are what set the bin count and the span, so without them there is no grid to integrate over.",
  "A concentration is measured in a bottle and a distribution in the line, so the module keeps the treating figure."],
 "The bin count and the span are declared defaults and arrive with the grid rather than with the water. The doctrine is about what a number can say: one water at one concentration can be easy or hard to treat, and only the droplet sizes say which."),

q(3, "What does the cut size d50c of a device mean in this module?",
 "The droplet size the device removes half of, computed from that equipment's own geometry and the fluid properties.",
 ["The smallest droplet the device removes at all, below which its grade efficiency falls to zero and the oil passes untouched.",
  "The median droplet size of the water leaving the device, which is the figure the next stage in a train inherits as its inlet.",
  "The droplet size at which a vendor measured that device's published curve, carried across to this water."],
 "Half removed and half surviving is the definition, which is why the grade efficiency at the cut size is exactly one half. A device still removes a little below its cut size and a great deal above it, and the outlet median is a separate reported figure."),

q(1, "What is the whole difference between this engine and a table of fixed removal efficiencies?",
 "Every cut size is computed from the equipment and the fluids, so the same device on finer water performs worse, which is what actually happens.",
 ["The engine interpolates between the published efficiencies rather than rounding to the nearest entry, so a removal moves smoothly as the droplets change.",
  "The engine holds a separate efficiency table for each family of device and picks the entry matching the water it was given, so the lookup is done for the reader.",
  "The engine averages the published efficiencies of the devices in a train, so a stage that removes little pulls the overall figure down with it."],
 "Nothing in this module is a fixed removal efficiency, interpolated or otherwise. A cut size falls out of geometry and fluid properties, and the removal follows from that cut size against the droplets actually present."),

q(2, "Which of these does this module actually compute?",
 "The droplet distribution leaving each stage, which the stage after it takes as its inlet.",
 ["The oil carried away in a hydrocyclone reject stream, balanced against the oil left in the treated water leaving the bank.",
  "The rate at which a media bed fouls over a run, and the backwash cycle that has to be scheduled to clear it.",
  "The droplets a chemical demulsifier coalesces upstream, which is how the water reaching the first device is made easier to treat."],
 "No reject stream or oil recovery balance, no fouling over time, no backwash cycle and no chemical demulsifier or coalescer media is in this module. The outlet distribution carried forward is the coupling a train is built on."),

q(1, "This module exports 20 names. How do they divide?",
 "16 are callable and 4 are frozen objects or strings, and of the callable ones 13 carry the error contract while 3 are leaves.",
 ["13 are callable devices and 7 are frozen objects, strings or helpers, and all 13 carry the error contract.",
  "16 are callable and 4 frozen, and all 16 carry the error contract, since a leaf reports through its caller.",
  "All 20 are callable and none frozen, because the constants are reached through a call returning a copy."],
 "A leaf answers with a bare number and has nowhere to put an error key, which is why 3 of the 16 callable names sit outside the error contract rather than inside it."),

q(3, "One of the three leaves is handed a state it has no answer for. What comes back, and what happens to it?",
 "A bare NaN, which is how a leaf says it has no answer, and the caller that wrapped it turns that silence into a named refusal.",
 ["A zero, which the caller reads as a device that removed nothing and reports as a stage that ran and did no useful work.",
  "A thrown error, which the caller catches and raises again carrying the name of the input that caused the trouble.",
  "An object with a named error key, exactly as every other export in the module answers, because one contract covers all of them."],
 "This module throws nothing at all. A leaf is a helper with nowhere to put an error key, so it returns a bare NaN rather than a number that could pass for an answer, and that is a documented contract rather than an oversight."),

q(0, "The fraction of a plate pack projected area credited as settling area is 0.7. Which of the four kinds of number is that?",
 "Declared: chosen or customary, with no publication in this repository to check it against.",
 ["Derived: it follows from the projected area of one plate and the angle the pack is set at, so there is nothing left to check.",
  "Calibrated: it was chosen so that a pack at the module's own default conditions lands where plate interceptors are customarily credited.",
  "Held for literature: the module states the absence and asks a caller to supply it."],
 "It sits in the frozen declared object with the rest of the chosen numbers, and it is worth a large part of the plate pack answer. There is exactly one calibration in this module and it is not this."),

q(2, "A device cuts at ten micron. What is its grade efficiency at ten micron, and why is there nothing to validate in that?",
 "Exactly one half, 0.500000000000, because that is what a cut size means, and it holds at every sharpness this module uses.",
 ["One half at the declared sharpness of 3 and somewhat less at the derived sharpness of 2, because a sharper curve carries more of its removal near the cut size itself.",
  "It depends on the droplet distribution the device works on, since the curve is integrated against the bins first.",
  "Close to one half, with the departure set by where the bin holding the cut size falls."],
 "The reduced-efficiency form is r over one plus r, so every curve in this module passes through one half at a ratio of one. A derived number follows from something else on the page and leaves nothing to argue about."),

q(1, "Standard gravity comes back out of this engine at 9.806650 m/s2 when the arithmetic is run on a rise velocity the engine reported. What does that establish?",
 "That the arithmetic which produced the answer used that figure, which is a different claim from somebody having typed it into the source.",
 ["That the rise velocity has been checked against a published measurement, since a constant can only be recovered from an answer that is already known to be right.",
  "That gravity is one of the declared constants of this module, exported in the same frozen object as every other chosen value in it.",
  "That the closed form and the full drag balance agree with each other, because only the two of them together can leave a clean constant behind."],
 "Reading a constant out of source code proves that somebody typed it. Recovering it from a return value proves the answer was built with it, and only the second claim survives a rewrite of the implementation."),

q(3, "Which figure in this module has no derivation behind it at all, and what does the module say about it?",
 "The attachment efficiency of 0.01, chosen so a cell at the module's own defaults lands where flotation is customarily credited, and it is an input a caller can move.",
 ["The short-circuit allowance of 1.5, chosen so that a basin of customary proportions reproduces the cut size API 421 credits such a basin with.",
  "The sharpness of 3, fitted so that the gravity devices reproduce the removals published for them, and fixed in the module rather than open to a caller.",
  "The reference loading of 10 m per hour, which was fitted to the bed data this repository carries and is the one number in the module with a measurement behind it."],
 "The allowance of 1.5 and the sharpness of 3 are declared, which is a different status: customary or chosen, with nothing here to check them against. No bed data of any kind is in this repository."),

q(0, "What does this module do about the value of the dissolved and soluble oil floor?",
 "It states on every train return that a floor exists, reports no value for it, and applies one only where a caller supplies it.",
 ["It carries a default floor among its declared constants and warns whenever a train reports an outlet concentration below that figure.",
  "It removes dissolved oil in the last stage of any train that has one and reports the remainder separately from the dispersed oil.",
  "It refuses to report an outlet concentration at all until a caller supplies the floor, on the grounds that an outlet below it would be meaningless."],
 "No device here removes dissolved oil, so a floor under every outlet is real and its value is the caller's. Held for literature means the module states the absence rather than guessing, and the train answers in full without one."),

q(2, "The jest suite pins the declared constants of this module by literal. What does a pin buy, and what does it not?",
 "It makes moving one a reviewed act instead of a silent one, and it says nothing whatever about whether the value is right.",
 ["It traces each constant to the publication the module cites for it, so a reviewer can follow any chosen number of them back to its own source.",
  "It fixes the value for callers, so a pinned constant can no longer be moved by an input.",
  "It proves the constant reaches every line that needs it, since a second copy fails the pin."],
 "The pin is an exact key-set match, so adding or removing a constant fails until the pin is updated. Both the module and its test say in as many words that pinning is all a gate can do here."),

q(1, "A studio screen shows a train that ran, every concentration printed, and a verdict field holding null. Which of the three acts is that?",
 "A withheld verdict: the computation ran in full and the pass or fail was declined, with a reason given for declining it.",
 ["A refusal, since a null is what this module hands back whenever it has no answer for the state it was given.",
  "A warning, because the figures all arrived and the module has attached a note to them.",
  "A failure, since a train whose result cannot be judged against a specification has not produced anything a designer can use."],
 "A refusal comes back as an object carrying a named error and nothing that could pass for an answer, and a warning withholds nothing at all. Here the concentrations are real and only the judgement is missing."),

q(3, "Every number in this module that is a choice rather than a derivation sits in one frozen object of 55 keys. What is the argument for that?",
 "A chosen number written into the line that consumes it is a number nobody will find again, so one place is what makes moving any of them visible.",
 ["A frozen object can be checked as a whole against the golden file, which is impossible for a value written into the middle of a formula.",
  "Reading each value at the time of the call is what lets a caller override any of them, which a literal written into a line would not allow.",
  "It keeps the derived numbers apart from the declared ones, so that the derivations can be printed in one table and checked together."],
 "The engine reads each one from that object rather than inlining it, and the object is what a reviewer opens. Whether a caller can override a particular value is a separate question from where the default is kept."),

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/beginner/fc7b_m01.json', label='fc7b_m01', expect_n=15)
finish()
