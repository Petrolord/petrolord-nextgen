import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Expert m03, Not answering. Digest section 16.

q(1, "A return carries real concentrations, a null meetsSpec, a null marginPpm and a reason string. Which of this module's three acts is that?",
 "A withheld verdict. The train ran, and the pass or fail is the only thing missing from it.",
 ["A refusal, since a null field is how this module reports that it has no answer for the question it was asked.",
  "A warning, since the answer is reported in full and the reason string is the note that sits beside it.",
  "A failing train, since a verdict that is not reported is the module declining to say the train passed."],
 "Withholding a verdict costs the reader nothing except the one thing the module has no basis for. The concentrations are still on the return.")

q(0, "What does a refusal return in this module, and what does the module do about exceptions?",
 "An object carrying a named error and nothing that could pass for an answer, and it throws nothing at all.",
 ["An object carrying a named error beside whatever fields it could still compute, so a caller can use the partial result.",
  "A thrown exception naming the input, which is how a refusal is told apart from a withheld verdict on a train.",
  "A bare NaN, which the caller turns into a message, since only the leaves of this module carry error strings."],
 "A thrown exception is a control flow event a caller can swallow. A returned object with an error key is data, and data survives being logged and displayed.")

q(2, "One fluid whose oil is heavier than its water is put through this module. How many doors refuse it, and which are they?",
 "Five, four of them devices: the rise velocity function, and then the gravity separator, the plate pack, the hydrocyclone and the flotation cell.",
 ["Four, all of them devices, since the property functions accept any fluid and leave the check to the equipment.",
  "One, the rise velocity function, and the four devices then carry its error forward on their own returns.",
  "Five, one of them a device: four property functions refuse the fluid and the gravity separator refuses the cut."],
 "Each refuses in its own words rather than through one shared sentence. A module where one export refuses a condition and another accepts it is holding two opinions about the same physics.")

q(3, "logNormalCdf, gradeEfficiency and medianOfBins are called LEAVES. What do they do when they have no answer, and why that shape?",
 "They return a bare NaN, because each answers with a bare number and there is nowhere in the return to put an error key.",
 ["They return zero, which the callers above them test for and convert into a named refusal.",
  "They throw, because a helper with no error field has no other way of reporting an absence to its caller.",
  "They return an object with a named error, exactly like the other exports, which is why the census counts sixteen of them."],
 "NaN poisons every arithmetic operation it touches and compares false against everything including itself, so it cannot be mistaken for a measurement.")

q(0, "A device is applied at a cut size of zero, and the leaf underneath it produces a NaN. What reaches the caller?",
 "An object with an error saying a device cannot be applied without a positive cut size and this one reports 0.",
 ["The bare NaN, since the leaf detected the condition and the layer above it does not inspect the value it was handed.",
  "A cut size of zero carrying a warning that the grade efficiency is undefined at that cut.",
  "A removal of 100 percent, since every droplet in the distribution sits above a cut size of zero."],
 "The leaf reports an absence in the only way it can, and the layer above it, which has somewhere to put a sentence, supplies the sentence.")

q(1, "The error contract table in this course was not read off the source. How was it produced?",
 "By calling every export twice, once with a question it can answer and once with a question it cannot, and recording both shapes.",
 ["By listing the exports that carry an error key inside the module's own frozen constants object.",
  "By running the jest suite and recording which of its assertions name an error string.",
  "By counting the refusals printed in the golden file, which carries one row for each refusing export."],
 "Sixteen exports are callable. Thirteen carry the object contract and three are leaves.")

q(2, "A three stage train is run with the plate area box cleared. What comes back?",
 "2 of 3 stages ran, complete no, skipped CPI plate pack, with 707.618822 ppm and 60.687843 percent still reported and no verdict at all.",
 ["A refusal naming the plate area and no concentrations at all, on the ground that a train is only ever as complete as the stages a caller managed to size.",
  "3 of 3 stages ran, with the plate pack contributing no removal and the verdict taken over the whole train.",
  "2 of 3 stages ran, with the verdict taken over the two that ran and a warning naming the third."],
 "The reason is on the return in the engine's own words: one stage did not run, so there is no train here to give a verdict on, and the concentrations are what the stages that DID run would leave.")

q(3, "What does a stage that did not run carry on the return?",
 "Its name and its cause and nothing else, so a stage that is not there cannot show a confident process warning beside its own failure.",
 ["Its name, its cut size and a removal of zero, so that the list of stages keeps exactly the same shape on every single row a reader scans down.",
  "Its name and the concentrations that reached it, so a reader can see where in the plant the train stopped.",
  "Nothing. The stage is dropped from the list and the count of stages that ran is the only trace of it."],
 "The skipped stage comes back as a name, a ran flag of false, and the error saying a plate pack needs a positive projected plate area in m2.")

q(0, "A complete train is given a discharge specification of zero. What does the module report, and what distinction is it drawing?",
 "meetsSpec null, with the reason that a specification must be a positive concentration and this is 0, which says the input is missing rather than the train failing.",
 ["meetsSpec no, with a margin equal to the outlet, since no train at all can meet a specification of zero.",
  "meetsSpec null, with the reason that no discharge specification was given, which is the same branch as an empty box.",
  "A refusal naming the specification, since a figure that is not positive is an input this method cannot use."],
 "A reader left with a blank reads it as a failing train. The module says which of the two it is instead.")

q(1, "A run at sigma 1.5 reports a removal of 68.402514 percent, an outlet median of 5.944722 micron, and a warning that sigma is outside the customary band. What has the warning done to the answer?",
 "Nothing. Both figures are the engine's real answer at that input, and the warning is about the input.",
 ["It has suppressed the outlet median, so the figure printed beside the removal is the inlet one.",
  "It has widened the grid to cover the extra spread, which is why the removal is lower than it is at sigma 1.",
  "It has withheld the verdict, since a run carrying a warning cannot be compared against a specification."],
 "A warning names a quantity and a threshold, sits beside the answer and never changes what was returned. This one leaves you to decide whether your water is the exception.")

q(2, "A liner bank past twice its design flow is refused. What is the module saying about that design?",
 "Nothing about the design. It is saying the question is outside what this method can answer, because the pressure drop and the inlet shear decide the answer there and this model does not carry them.",
 ["That the bank is undersized and will miss its cut size, which is why the refusal names the liner count it wants.",
  "That the field has reached its ceiling, so the cut size would be the same figure at any higher flow.",
  "That the shear penalty cannot be formed above twice design, so only the ideal cut is reported."],
 "A refusal is not the engine saying the design is bad. The bank might be fine. The MODEL is not.")

q(3, "Read the band edge refusals as a set: 200.5 C, 300001 ppm TDS, 100.1 API, and a brine density asked for at 100.5 C. What does each message carry?",
 "The quantity, the band it is stated to, and the value that fell outside it, so a reader knows which box to change.",
 ["The quantity and the nearest value inside the band, which the caller is then free to resubmit unchanged and unexamined.",
  "The quantity alone, the bands themselves being documented in the frozen constants object rather than repeated on each message.",
  "The quantity and the fitted correlation the band came from, so that a caller can extend it themselves."],
 "Some of them add the reason as well. Past saturation a linear salinity correction has nothing behind it, and the refusal says so.")

q(0, "A studio shows an empty verdict box beside real concentrations. What has it got wrong?",
 "A reader reads a blank as a fail, so the screen has to show the REASON, and the three reasons say different things.",
 ["Nothing at all, provided the concentrations printed beside it are right, since a blank is how the engine itself reports a withheld verdict.",
  "It should print the margin figure in place of the verdict, that field being null for a different reason from the verdict itself.",
  "It should fall back to the verdict from the last complete run, so that the box is never left empty."],
 "A stage that did not run is a data entry problem, a missing specification is a question the user answers from their own permit, and a specification of zero is an input error.")

q(1, "A train is handed null where an array of devices belongs. Which of the three acts is that, and what comes back?",
 "A refusal: an object with an error saying the train needs an array of devices and it was given null.",
 ["A withheld verdict, since a train with no devices ran no stages and so has nothing to give a verdict on.",
  "A warning beside an outlet equal to the inlet, since a train of no devices removes nothing from the water.",
  "A bare NaN, since the train is the caller that turns a leaf NaN into a name and no leaf ran here."],
 "The input is one this method cannot use, so the return carries a named error and nothing that could pass for an answer.")

q(2, "Before reading any number off a return, what should a reader sort it into?",
 "One of the three acts: an error string, a null verdict with a reason, or a full answer with a note beside it.",
 ["One of the two shapes this module returns: an object of results, or else a bare NaN from whichever leaf was reached.",
  "One of the four kinds of return: a derived figure, a declared one, a calibrated one, or one held for literature.",
  "One of the three warnings: the band edge one, the threshold one, or the one naming a quantity the caller supplied."],
 "Each calls for a different sentence in a report, and only one of the three is a number that can be quoted at all.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/advanced/fc7a_m03.json', expect_n=15)
finish()
