import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Expert m05, What a Refusal Is and Where Each Guard Turns Over.
# Digest section 15, with the held items of section 17.

q(1, "A caller hands one of these two modules an input it cannot work with. What shape does the answer take?",
 "An ordinary returned object carrying an error string that names the input that is actually wrong.",
 ["A thrown exception carrying the name of the input, which the caller is expected to catch.",
  "A returned object whose numeric fields are set to NaN, with the error text in a warning field.",
  "A returned object with the offending field removed, so a caller reading it finds nothing there."],
 "Neither module throws. A caller checks a property rather than catching, which is a deliberate shape and it has a consequence the next question is about.")

q(3, "The property check is the only check most callers ever make. What follows from that?",
 "A non-finite value slipped past it is worse than having no guard at all.",
 ["A guard can be omitted where the value is always finite, since the check would never fire.",
  "Errors have to be raised at construction rather than at the call, because a call has no return to carry them.",
  "The error string has to be generic, because a caller comparing strings cannot rely on a specific wording."],
 "A caller that sees no error believes it has a number. That is why both modules were worked through input by input, and why the faults in this module came back as a number before they came back as a refusal.")

q(0, "A motor efficiency above one, a negative motor efficiency and a motor efficiency of zero all come back with the same sentence. Is that a defect?",
 "No. Those are three typing mistakes against one rule, and the message states the rule.",
 ["Yes. Three distinct faults should carry three distinct messages, as the compression module now does.",
  "No, because the pump module prints the typed value beside each sentence.",
  "Yes, a negative and an above-one efficiency need opposite fixes."],
 "The refusal reads that motor efficiency must be greater than 0 and at most 1. Where two typed values reach one guard from opposite directions and the correction differs, the compression module does carry the value.")

q(2, "A system curve built with no static head is refused at construction. Why is the guard finiteness rather than positivity?",
 "A static head may legitimately be negative, because the destination can sit below the pump.",
 ["Because a positivity test would also refuse a static head of zero.",
  "Because the curve object cannot be inspected until it is called, so only finiteness is available at construction.",
  "Because the friction head at a stated flow already carries the sign, so the static head is taken as a magnitude."],
 "That one is the sharpest of the set: a curve object can look healthy and carry a correct coefficient while the function hanging off it is unusable. The message says the head may be negative but it cannot be missing.")

q(1, "A speed ratio of one hundred is handed to the affinity laws. What comes back?",
 "A full result of 100000 gpm, 3000000 ft and 100000000 brake hp, with a warning attached.",
 ["A refusal naming the speed ratio, because the affinity laws stop describing a real machine there.",
  "A result with the flow and head filled in and the brake power returned as NaN, since the power leg is the cube.",
  "A result with every field set to the value at the present speed, and a warning that the change was declined."],
 "The warning says the power leg goes as the cube, so this is an extrapolation on the number that sizes the driver. It is a warning rather than an error, and the numbers do come back.")

q(0, "A log of one of these returns shows null where a number belongs. What has it failed to tell you?",
 "Which of a NaN and an Infinity came back, because neither has a spelling in JSON.",
 ["Whether the field was computed at all, since a refused field is removed rather than nulled.",
  "Which input the refusal named, because the error string is dropped by an ordinary serialiser.",
  "Whether the value was refused or rounded to zero by the printer."],
 "The two mean different things. A NaN says an input could not be read and an Infinity says something was divided by zero, so probing these modules needs a serialiser that prints what was really returned.")

q(3, "Five exports in these two modules return a plain number. Which five?",
 "pumps.headFtToPsi, pumps.psiToHeadFt, compression.polytropicExponentRatio, compression.dischargeTempR and compression.actualInletCfm.",
 ["pumps.headFtToPsi, pumps.psiToHeadFt, compression.polytropicExponentRatio, compression.compressorTrain and compression.actualInletCfm.",
  "pumps.headFtToPsi, pumps.psiToHeadFt, compression.stageCount, compression.dischargeTempR and compression.actualInletCfm.",
  "pumps.psiToHeadFt, compression.polytropicExponentRatio, compression.dischargeTempR, compression.actualInletCfm and compression.stageCount."],
 "Each is a small conversion and each returns a scalar. A plain number has nowhere to put an error key, so those five hold a written contract instead.")

q(2, "What are the three clauses of the contract those five hold?",
 "NaN when the inputs cannot be read, never an Infinity, and never a plausible number.",
 ["Zero when the inputs cannot be read, never a NaN, and never a negative number.",
  "NaN when the inputs cannot be read, an Infinity on a division by zero, and never a negative number.",
  "NaN when the inputs cannot be read, a documented default otherwise, and never a value outside its own range."],
 "NaN propagates through arithmetic rather than hiding. An Infinity looks like a very large answer and survives a finiteness test in the wrong direction, and a plausible number is the one failure a reader cannot catch.")

q(0, "The bare-number table carries two rows marked as controls, one returning 271.7647058823529 and one returning 1069.0552909632156. What are they for?",
 "They show the same functions returning a real number when they can, which is what makes the refusing rows mean anything.",
 ["They fix the two scales the contract is stated at, so a reader can tell a NaN from a rounded zero.",
  "They are the values the two functions return in place of a NaN when a caller supplies a default.",
  "They are the published golden cases for those two functions, which is why they are the only rows with numbers."],
 "A contract that says NaN is worth nothing on its own, because a function returning NaN for every input would satisfy it perfectly and compute nothing. It is the same discipline as a negative control on a gate.")

q(1, "compression.actualInletCfm appears on three rows of that table. What do the three show together?",
 "Two distinct reasons to decline and one reason to answer, all demonstrated rather than asserted.",
 ["One reason to decline and two readable states, which bracket the window the function works inside.",
  "Three reasons to decline, since the control row is a state the function also refuses.",
  "Two reasons to decline and one warning, since a low reduced pressure is noted rather than refused."],
 "It refuses a suction below absolute zero, refuses a state outside the compressibility window, and returns 1069.0552909632156 on a readable state.")

q(2, "Two of the four compression refusals quote the value the caller typed. Which two, and why those?",
 "The polytropic efficiency messages, because a 0 and a 1.5 reach one guard from opposite directions.",
 ["The two temperature messages, because a reader cannot tell degF from degR without the value.",
  "The efficiency message and the suction temperature message, because both are read from the same input object.",
  "The ratio limit messages, because the same fault arrives through two different functions."],
 "A 0 is probably an empty field or a missing default and a 1.5 is probably a percentage typed where a fraction belonged. A reader told only the rule has to work out which of them they made.")

q(3, "A stated discharge limit sits at or below the suction temperature. The refusal says compression raises the temperature of a gas, so no stage count can meet this limit. What does that clause do?",
 "It forecloses adding stages, which is the obvious fix and can never work here.",
 ["It names the twelve-stage cap as the reason, which is the guard the call would otherwise have reached.",
  "It reports the inlet the count was tested at, so the approach can be fixed.",
  "It converts the limit to Rankine, the only form the comparison holds in."],
 "Even a stage of vanishing ratio leaves the gas at least as hot as it arrived. The message saves the afternoon that would have gone on intercooling harder.")

q(1, "A per-stage ratio limit of one is asked through the stage-count function and again through the whole-train function. What comes back?",
 "The same refusal, naming the ratio limit, from both entry points.",
 ["A refusal from the stage-count function and a train of one stage from the train function.",
  "Two refusals with the same meaning in different words, one per function.",
  "A refusal naming the rate and the suction pressure, which are the inputs the train function reads first."],
 "The rate, the suction pressure, the gas gravity and k in that call are all good. A user cannot be told two different stories about one input depending on which tab they were on.")

q(0, "Three suction states are probed against the compressibility window and the solver reports converged on all three. What does that flag establish?",
 "Nothing about validity, because a solver converges on the correlation it was given wherever it is asked.",
 ["That the two refused states were refused on their reduced coordinates rather than on the arithmetic.",
  "That the control row at 600.000000 psia is the only one whose z of 0.919606033 can be trusted.",
  "That the window of 1.0 to 3.0 and 30 was applied after the solve rather than before it."],
 "It cannot know the fit was never fitted to data out there. Convergence is about the arithmetic and validity is about the data behind it, and reading that flag would have caught neither probe.")

q(2, "Eight things in this course are held for literature. Which is the load-bearing one, and what does the engine do instead of modelling it?",
 "The impeller trim shortfall model, whose power leg is left as the ideal cube while the engine returns the efficiency its own answer implies.",
 ["The compressibility window, which the engine reports rather than enforces, leaving the caller to judge it.",
  "The published golden cases, which the engine recomputes at fifty digits rather than comparing against.",
  "The 300 degF default discharge limit, which the engine replaces with the hottest stage it measured."],
 "That model has no publication in this repository, so a second unsourced model was not invented to sit beside it. Each held item is used, each is printed, and none decides a graded answer.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/advanced/fc3a_m05.json', expect_n=15)
finish()
