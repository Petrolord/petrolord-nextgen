import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Associate m06, The Associate Reading. Digest Section 17 read again, and
# the chain of Sections 1 to 5 assembled. This module introduces no number of
# its own, so it is written to ask about the SHAPE of the chain, the order the
# capstone is worked in and the dependencies between its six graded answers,
# rather than re-asking the facts m01 to m05 already carry.
# Sections 16 and 17 are SHARED by the three tier readings, so their figures
# are in range here; the held items are still named rather than graded.

q(1, "Put the OKONO chain in the order the engine runs it.",
 "Fit the catalogue points, build the system curve, solve the crossing, then ask the power, the pressure and the region there.",
 ["Build the system curve, solve the crossing, fit the catalogue points to the solved flow, then ask the power and the pressure.",
  "Fit the points, ask the power and the region on the fitted curve, then solve the crossing.",
  "Solve the crossing from the static head, then fit the points to check it."],
 "Each step consumes what the step before it produced. Nothing downstream of the crossing can be asked until the crossing itself exists."),

q(3, "Which step in that chain consumes the shutoff head, and what does it do with it?",
 "The duty solve, which compares it against the system head at zero flow.",
 ["The power call, which uses it to bound the head before the specific gravity is applied.",
  "The region judgement, which expresses the duty head against it as a fraction.",
  "The system curve, which subtracts it from the static head to form the coefficient."],
 "If the station demands more head at zero flow than the pump makes at shutoff, the gap never starts positive and there is nothing to find."),

q(0, "Three ideas run through this tier. Which set is it?",
 "A machine has no operating point until it is connected; a return is more than an answer; a flag is worth what its false case is worth.",
 ["A curve is a measurement; a fit is an approximation; a residual is the difference between the two.",
  "Head belongs to the machine; pressure belongs to the fluid; power belongs to the driver.",
  "Every constant is measured; every band is held; every refusal is returned."],
 "Everything after the duty in the chain is a consequence of where the duty landed, so everything after it moves when the station moves."),

q(2, "Two flags in this tier judge a calculation rather than label a result. Name them and the input that clears each.",
 "Converged, made false by a curve returning a non-finite head over part of its range, and droops, made false by a point set that rises with flow.",
 ["Converged, made false by a search limit below the crossing, and droops, made false by a negative head among the catalogue points.",
  "Preferred, made false by a duty outside its band, and converged, made false by a fixed halving count with no stopping test.",
  "Droops, made false by three identical heads, and preferred, made false by a best efficiency flow the caller did not supply."],
 "A judging flag with no reachable false case is decoration. The tier ran the input that clears each of these two rather than describing it. The preferred flag is a label rather than a judgement, so it is not one of the two."),

q(1, "What did this tier deliberately not do?",
 "It did not go near the suction side, did not change the machine by speed or by trim, did not put a second one beside it, and did not touch a compressor.",
 ["It did not fit a curve to fewer than four catalogue points, did not solve a crossing outside the published range, and did not state a motor efficiency.",
  "It did not measure any packaging, did not read any golden case, and did not quote any refusal message in the engine's own words.",
  "It did not convert a head into a pressure, did not judge where a duty landed, and did not report on the conditioning of a fit."],
 "The suction side is where selections actually fail, and it is the opening of the next tier."),

q(3, "The Associate capstone grades six answers. Which six?",
 "The duty flow, the duty head, the hydraulic power, the brake power, the motor input in kilowatts and the discharge pressure.",
 ["The fitted shutoff head, the condition number, the R squared, the duty flow, the duty head and the brake power.",
  "The duty flow, the duty head, the percentage of best efficiency flow, the region, the brake power and the discharge pressure.",
  "The system coefficient, the duty flow, the duty head, the hydraulic power, the pump loss and the motor loss."],
 "The first two are one answer solved once. The last four are all asked at that answer."),

q(0, "What is the shape of the dependency between those six?",
 "Get the duty wrong and all six are wrong, and the four downstream ones will be wrong in a way that looks entirely plausible.",
 ["The six are independent, since each one is a separate export called with its own inputs from the prompt.",
  "The four downstream answers constrain the duty, so an error in the duty shows up as an inconsistency between the four of them.",
  "Only the pressure depends on the duty. The three powers are properties of the machine and the fluid alone."],
 "Each of the four is a correct calculation on an incorrect flow, which is why none of them can be checked independently of the duty."),

q(2, "What should be read off the fit before the fitted curve is used at all?",
 "The droop flag, because a cleared one means the crossing about to be solved for is not a duty point.",
 ["The condition number, because a figure outside the range this course reports means the coefficients cannot be trusted.",
  "The shutoff head, because it has to be compared against the catalogue reading before the fit is accepted.",
  "The scale, because the curve is written in the normalised variable."],
 "There is no sense computing anything past a cleared droop flag. An R squared of null is a statement about the points rather than about the fit."),

q(1, "What should be read before the solved flow is read?",
 "The convergence flag, because a flow off an unconverged bisection is a number rather than an answer.",
 ["The bracket, because a width above the resolution of the flow means the search was stopped early.",
  "The halving count, because a count at the cap means the search ran out of budget before it settled.",
  "The warning string, because it is the only field that names which of the two halves of the flag failed."],
 "The tier has already shown a case where the flow prints normally and is wrong by more than three hundred gallons per minute."),

q(3, "In what order do the two efficiencies go, and why does the order matter?",
 "Pump efficiency turns hydraulic power into brake power, then motor efficiency turns brake power into motor input.",
 ["Motor efficiency turns hydraulic power into motor input, then pump efficiency reduces it to the brake power at the shaft.",
  "Either order reaches the same three figures, since the two efficiencies multiply and multiplication commutes.",
  "Pump efficiency turns brake power into motor input, then motor efficiency turns motor input into the supply figure."],
 "Keeping them in that order keeps the shaft figure separate from the supply figure, and the shaft figure is the one the coupling has to survive."),

q(2, "Which figure does the capstone's kilowatt answer come from?",
 "The motor input, converted.",
 ["The brake power, converted, since the kilowatt is the shaft figure expressed in electrical units.",
  "The hydraulic power, converted, since the kilowatt answers what the duty is worth rather than what the supply delivers.",
  "The motor input, converted at the default motor efficiency rather than at the one the prompt states."],
 "Converting the brake power instead leaves out the whole of the motor's own loss."),

q(0, "Why is working the six graded answers in the order they are listed a mistake?",
 "The list is an order of presentation, and the order of computation is fit, system, duty, then everything else.",
 ["The list is ordered by how heavily each answer is weighted, which is unrelated to what each one depends on.",
  "The list interleaves the two efficiencies, so working down it applies the motor efficiency before the pump efficiency.",
  "The list omits the fit and the system curve, so working down it produces six answers and no evidence for any of them."],
 "The four downstream answers cannot be checked independently of the duty they were asked at."),

q(1, "A duty point that works on paper fails in three ways, and the next tier is all three. Which three?",
 "On suction, on change and on the fluid.",
 ["On conditioning, on convergence and on the shape of the curve, which are the three reports the fit and the solve carry.",
  "On the driver, on the seal and on the bearings, which are the three parts a duty in the wrong band shortens the life of.",
  "On the stage count, on the interstage cooling and on the fuel, which are the three the compressor half of the course adds."],
 "Available NPSH built from the real suction survey, a speed change against an impeller trim, and a catalogue curve that is a water curve."),

q(3, "What does holding an item for literature mean for the way this course uses it?",
 "It is used, it is printed and it never decides a graded answer anywhere in the course.",
 ["It is printed with a warning and may still decide a graded answer.",
  "It is excluded from the engine entirely.",
  "It is graded only in the tier that teaches it."],
 "Eight things are held on that footing, each because this repository holds no publication behind it."),

q(2, "Which of these is held for literature in this course?",
 "The impeller trim shortfall model, whose engine comment calls it a published shortfall and names no publication.",
 ["The affinity speed law, which the engine applies exactly and which the Professional tier of this course grades.",
  "The conversion between feet of head and psi, whose packaging the engine defines and this very tier measures out of it.",
  "The convergence flag on the duty solve, which is reported rather than derived from any published criterion."],
 "The eight held items are the viscosity correction, the trim shortfall, the operating-region bands, the NPSH margin rule, the machine-screening thresholds, the default discharge limit, what the implied water density is away from real water, and every published golden case."),

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/beginner/fc3b_m06.json', expect_n=15)
finish()
