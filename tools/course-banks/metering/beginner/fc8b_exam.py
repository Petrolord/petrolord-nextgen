import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Associate final exam. Digest sections 1 to 16, the Associate tier's own.

q(0, "A count in this course is only checkable when two things are stated beside it. Which two?",
 "The tree it was counted over and the rule that decided membership.",
 ["The engine that produced it and the date the figure was taken, since a count is a property of one build of one module.",
  "The largest and the smallest value in the set counted, which between them bound what the count can be.",
  "The section that carries it and the tier that owns that section."],
 "The exported names count states Object.keys of the imported module as its tree and every exported name with no filter as its rule."),


q(1, "The metering module exports nine functions. Which of these is one of them?",
 "straightRunDiameters, which answers the straight-run question and withholds one of its columns.",
 ["shellCourse, which returns the required thickness of one course and names which of three things governs it.",
  "liquidCriticalRatioFF, which returns the critical pressure ratio factor a liquid sizing needs.",
  "normalVenting, which combines the thermal and the movement cases and reports which direction governs."],
 "The nine are dischargeCoefficient, expansibility, orificeFlow, orificeUncertainty, permanentLoss, sizeOrifice, straightRunDiameters, transmitterUncertaintyPct and turbineVolume."),


q(0, "What is the practical consequence of the three modules in this course importing nothing from one another?",
 "Each tier starts again, because nothing a learner knows about the meter run is quietly reused on the valve or the tank.",
 ["Each module has to carry its own copy of the shared constants, which is why the same conversion appears three times and can drift between them.",
  "A result from one module can be handed straight to another, since neither has any assumption about the other to violate.",
  "The three can be run in any order on the same facility, which is what makes a single result sheet possible."],
 "No module imports another, and that independence is structural rather than a matter of style."),


q(3, "On the ABOH sheet, how many lines are stated by the engineer and how many come back from the engine?",
 "Seven stated and nine returned.",
 ["Nine stated and seven returned.",
  "Eight stated and eight returned.",
  "Six stated and ten returned."],
 "The stated lines are the two bores, the differential, the static pressure, the density, the viscosity and the specific heat ratio."),


q(1, "Which single returned line on the ABOH sheet does the rest of the result turn on?",
 "The beta of 0.482523.",
 ["The pipe Reynolds number of 2117151.4444.",
  "The mass flow of 24602.3337 lb/hr.",
  "The expansibility of 0.999181."],
 "The beta is the ratio of the two bores and it is the single number the rest of the result turns on."),


q(2, "What role does the static pressure of 815.200000 psia play on the ABOH run?",
 "It describes the gas at the plate on the day, and it is one of the inputs the expansibility factor is computed from.",
 ["It is the pressure the volume line is corrected to, which is what makes that line a volume at the flowing density.",
  "It is the pressure the inch of water conversion is taken at, so the factor of 0.0361273 belongs to this run alone.",
  "It is compared against the differential to decide whether the small bore correction applies."],
 "It is a stated line. The differential against static pressure guard in the flow function is the other place it is read."),


q(3, "A warning field comes back null on a result. What has the engine said?",
 "That it found nothing about this run worth flagging, which is a statement rather than an absence.",
 ["That the run carried no warning because the warning field is only populated when the published range flag comes back false.",
  "That the calculation completed, since a run that could not complete returns no warning field at all and a caller has to test for its absence.",
  "That the warning was suppressed by the caller, which is the only way a result carries a null in that field."],
 "A screen that prints the flow and drops the warning has removed the line that tells a reader which kind of answer they are holding."),


q(3, "Run two of the inch of water measurement was given 17.900000 in H2O. What differential in psi did the engine return for it?",
 "0.646679 psi.",
 ["2.304922 psi.",
  "0.0361273 psi.",
  "18.06 psi."],
 "Dividing 0.646679 by 17.900000 lands on the same factor as the other run, which is what makes it a constant."),

q(1, "Why does it matter which reference a water column conversion is written against?",
 "Water at different reference temperatures does not weigh the same, so a transmitter calibrated on one and an equation coded to another disagree permanently.",
 ["The reference decides whether the differential is reported in gauge or in absolute terms, which is a much larger error than the conversion itself.",
  "The reference sets the precision the factor can be quoted to, and a conversion quoted too coarsely propagates into the flow as a rounding error.",
  "The reference decides whether the small bore correction applies, since the correction is written against a column height rather than a pressure."],
 "Nothing about that is visible on a result sheet, which is why measuring the buried factor and keeping it beside the calibration sheet is the useful habit."),


q(0, "The coefficient sweep is evaluated at beta 0.500000 and Reynolds 5e+5. What does it print in that cell?",
 "0.603746",
 ["0.608174",
  "0.602287",
  "0.601691"],
 "Every cell belongs to one beta and one Reynolds number, and a coefficient quoted without both of them is half a number."),

q(0, "Two cells of the coefficient sweep bound the span the digest prints. What is the difference between them and what is their ratio?",
 "A difference of 0.072666 and a ratio of 1.122048.",
 ["A difference of 0.084375 and a ratio of 1.092173.",
  "A difference of 0.000036 and a ratio of 0.999941.",
  "A difference of 34.203954 and a ratio of 2.186003."],
 "0.668050 against 0.595385, both at beta 0.750000, which is why only the Reynolds number changed between them."),


q(3, "Which function in the metering module takes the discharge coefficient of the run as a required argument?",
 "permanentLoss",
 ["orificeFlow",
  "sizeOrifice",
  "orificeUncertainty"],
 "orificeFlow and sizeOrifice evaluate the correlation themselves, and orificeUncertainty takes a beta and never the coefficient's value. Only the loss relation asks the caller for the coefficient and says why when it is missing."),

q(0, "The small bore table prints a coefficient of 0.607340. Which bore is that, and is the correction applied there?",
 "A pipe bore of 1.049000 in, with the correction applied.",
 ["A pipe bore of 2.067000 in, with the correction applied.",
  "A pipe bore of 2.469000 in, with the correction applied.",
  "A pipe bore of 10.020000 in, with the correction not applied."],
 "Every row of that table is at the same beta and Reynolds number, so the bore is the only thing moving down it."),

q(0, "In the small bore table, at which bore does the correction applied column first come back false?",
 "At a pipe bore of 3.068000 in.",
 ["At a pipe bore of 2.800000 in.",
  "At a pipe bore of 4.026000 in.",
  "At a pipe bore of 2.469000 in."],
 "The table steps from 1.049000 in up to 10.020000 in, and the flag changes state between the fourth row and the fifth."),

q(3, "Where are the two edges of the published beta band, and what is the engine's behaviour outside them?",
 "0.100000 and 0.750000, and outside them it still returns a coefficient with a warning attached.",
 ["0.100000 and 0.800000, and outside them the returned coefficient carries no warning because the sweep still evaluates it.",
  "0.200000 and 0.750000, and outside them the engine refuses so that no extrapolation can be acted on.",
  "0.050000 and 0.750000, and outside them the small bore flag is raised in place of a warning."],
 "The edges were measured by bisecting the engine's own flag, and the warning above the upper edge names the beta and the band."),


q(1, "At what beta does the digest show the extrapolation warning firing?",
 "0.841",
 ["0.950",
  "0.800000",
  "0.750000"],
 "The message names the beta it was asked about and the 0.1 to 0.75 band it sits outside, which is what makes it specific to the run."),

q(2, "What are the two ends of the expansibility span the digest prints?",
 "0.999779 at dP/P1 0.001000 with k 1.66, and 0.915403 at dP/P1 0.250000 with k 1.1.",
 ["0.999779 at dP/P1 0.001000 with k 1.1, and 0.915403 at dP/P1 0.250000 with k 1.66, since the factor falls as the specific heat ratio rises.",
  "0.999181 at the ABOH conditions, and 0.915403 at the bottom corner of the sweep.",
  "0.999737 and 0.941507, which are the two ends of the row the ABOH specific heat ratio of 1.270000 falls between."],
 "The two cells differ in both coordinates, so the difference of 0.084375 and the ratio of 1.092173 are a span across the table."),


q(0, "The expansibility sweep is read at dP/P1 0.080000 and k 1.3. What does it print there?",
 "0.977162",
 ["0.975324",
  "0.978745",
  "0.956800"],
 "Both coordinates have to be named before a cell means anything, and this one belongs to that pressure ratio and that gas."),

q(1, "A guard fires on inputs somebody has just typed. What separates a useful refusal message from a useless one?",
 "How quickly it puts the reader in front of the right input.",
 ["How completely it describes the internal state the calculation had reached when it stopped.",
  "How closely it follows the wording of the standard the module is built on.",
  "How few inputs it names, since a message naming several leaves the reader to choose."],
 "The differential against static pressure message converts the differential into psi, names both pressures, and finishes by saying which two inputs to look at."),

q(2, "Why can the sizing problem not be solved by rearranging the orifice equation?",
 "The coefficient depends on the beta being solved for, so there is no closed form to rearrange.",
 ["The expansibility depends on the differential, which is the quantity the sizing is holding fixed, so the equation has two unknowns in it.",
  "The stock plate sizes are discrete, so the answer is a choice from a list rather than a root of an equation.",
  "The published beta range is a constraint rather than an equation, and a constrained problem has no algebraic solution."],
 "So the engine searches instead, staying inside the correlation's own published beta range while it narrows the bracket."),


q(2, "A sizing run reports a solved beta of 0.614193 and a bore of 3.725084 in. What else does the result carry that lets a reader check it?",
 "The flow that bore passes, the coefficient at that bore, and the beta bracket the search worked in.",
 ["The differential the bore would give at the target flow, so the transmitter range can be set from the result directly.",
  "The nearest stock plate below the solved bore, so the recomputation the note asks for can be started.",
  "The permanent loss at the solved beta, which is the running cost of the plate being sized."],
 "The flow comes back as 42000.0000 lb/hr, the coefficient as 0.604313 and the bracket as 0.1 to 0.75."),


q(0, "What does the permanent loss table hold constant across its rows?",
 "The differential, which is the ABOH differential on every row.",
 ["The coefficient, which is why the loss fraction can be read as a function of beta alone.",
  "The loss in inches of water, with only the fraction moving as the beta changes.",
  "The Reynolds number and the fluid, with the differential recomputed on each row from the bore."],
 "Only the beta changes down that table, and the last column is that row's share of the one differential expressed in inches of water."),


q(0, "The permanent loss table prints a loss fraction of 0.733463. At which beta?",
 "0.500000",
 ["0.600000",
  "0.350000",
  "0.670000"],
 "That row carries a loss of 46.794924 in H2O at the ABOH differential and a coefficient of 0.602677."),

q(1, "The permanent loss table gives 28.839688 in H2O at beta 0.750000. What coefficient was that row evaluated at?",
 "0.598985",
 ["0.604249",
  "0.602677",
  "0.596272"],
 "The coefficient column moves from row to row because every row carries the coefficient belonging to its own beta."),

q(2, "A transmitter is sold on an accuracy of 0.075000 percent of span. Why is that not what a flow calculation needs?",
 "A flow calculation needs the uncertainty of the reading in front of it, and a fixed band is a growing share of a falling reading.",
 ["A flow calculation needs the accuracy in the same units as the differential, and a percentage cannot be entered into the equation as it stands.",
  "A flow calculation needs the repeatability rather than the accuracy, since a systematic offset cancels between the two tappings.",
  "A flow calculation needs the accuracy at the design reading, which the datasheet quotes separately from the span figure."],
 "The datasheet figure is the one everybody has seen, and at design conditions the two are close enough that nobody notices they are different quantities."),


q(0, "The transmitter table prints 1.071429 percent of reading. At what reading?",
 "14.000000 in H2O.",
 ["12.000000 in H2O.",
  "16.000000 in H2O.",
  "18.000000 in H2O."],
 "That row carries a differential turndown of 14.285714 and a flow turndown of 3.779645, and its warning fires."),

q(2, "What comes back when a reading above the transmitter span is asked for?",
 "`the reading is above the transmitter span`",
 ["`the reading is above the transmitter span, so the flow turndown cannot be computed`",
  "A percent of reading below the percent of span, with a warning saying the instrument has saturated.",
  "A flow turndown below 1.000000, which is how the engine reports a reading outside its range."],
 "A transmitter cannot report a differential outside the range it was set up for, so there is no number to give."),


q(1, "Why is a turndown quoted with no quantity beside it ambiguous?",
 "Because the bare number carries a factor of three depending on which of the two quantities was meant.",
 ["Because it cannot be read without the span it was measured against, which nobody writes down.",
  "Because a turndown below one is meaningless and the bare number does not say which way it runs.",
  "Because the engine returns both columns and a bare number could have come from either instrument."],
 "The engine holds a flow limit of 3.000000 and a differential limit of 9.000000, and returns both columns on every call."),

q(3, "The warning column of the transmitter table changes state between two printed rows. Which two?",
 "Between a reading of 25.000000 in H2O and a reading of 18.000000 in H2O.",
 ["Between a reading of 40.000000 in H2O and a reading of 25.000000 in H2O.",
  "Between a reading of 18.000000 in H2O and a reading of 16.000000 in H2O.",
  "Between a reading of 100.000000 in H2O and a reading of 63.800000 in H2O."],
 "On this span the warning starts below a reading of 22.222222 in H2O, which falls between those two printed rows."),

q(1, "The transmitter note describes a differential turndown of 3.1 to 1 as a flow turndown of 1.77 to 1. What general statement does it end with?",
 "That the customary three-to-one flow rule is a nine-to-one differential turndown.",
 ["That a turndown quoted without its quantity should be read as a differential turndown, since that is what the instrument reports.",
  "That the flow turndown is the square of the differential turndown, which is why the two figures differ so widely.",
  "That the customary three-to-one rule is a three-to-one differential turndown, which is where the confusion starts."],
 "Flow goes as the square root of the differential, which is the reason the note gives for the two figures being different."),


q(1, "In the ABOH budget, which term carries the largest share of the variance and which is the runner up?",
 "The discharge coefficient is dominant and expansibility is the runner up.",
 ["The discharge coefficient is dominant and the differential pressure is the runner up, since the differential term is the one that moves.",
  "The orifice bore is dominant, on its sensitivity of 2.114632.",
  "The differential pressure is dominant, being the only instrument term."],
 "The engine returns both names along with a flag saying whether the lead is clear, which on this run comes back true."),


q(3, "The ABOH budget prints a contribution of 0.011463 percent. Which term is it?",
 "The pipe bore.",
 ["The orifice bore.",
  "The density.",
  "The expansibility."],
 "Its share of the variance comes back as 0.038920 percent, which is what an input the flow barely responds to leaves in the total."),

q(2, "What does the budget result say about where its differential term came from?",
 "Which of the two routes it took, either the transmitter given a reading and a span, or a typed figure.",
 ["Which of the six terms the differential term displaced.",
  "Whether the reading supplied sits inside the transmitter span.",
  "Nothing, because the route is a property of the inputs rather than of the result and a caller already knows it."],
 "A screen showing a transmitter panel above a budget computed with a default is correct in both halves and lying as a whole."),


q(1, "A call is made with neither a reading nor a span supplied. What string comes back in place of the transmitter derivation?",
 "`a typed differential uncertainty`",
 ["`a differential uncertainty read at 63.8 in H2O`",
  "`a typed differential sensitivity`",
  "`a default differential uncertainty`"],
 "The other route reports the derivation in full, naming the percent of span, the span and the reading it was read at."),

q(0, "The down the span table carries a clear column. On which two printed rows does it read false?",
 "At readings of 16.000000 in H2O and 14.000000 in H2O.",
 ["At readings of 18.000000 in H2O and 16.000000 in H2O.",
  "At readings of 14.000000 in H2O and 12.000000 in H2O.",
  "At readings of 25.000000 in H2O and 18.000000 in H2O."],
 "Those are the two rows either side of the reading where the dominant term changes name, which is 15.000000 in H2O."),

q(2, "The note the budget writes when the lead is clear ends with an instruction. What is it?",
 "Spend on it first.",
 ["Improve the runner up too.",
  "Recompute down the span.",
  "Quote the total instead."],
 "The engine states the two shares and then the instruction, so a user gets a verdict and the evidence for it in the same result."),

q(1, "The same pulses and K factor are run at a meter factor of 0.990000. What comes back?",
 "A gross volume of 3081.3487 bbl, with the warning firing.",
 ["A gross volume of 3081.3487 bbl, with the warning silent, since the screen is written against factors above unity.",
  "A gross volume of 3096.9111 bbl, with the warning firing.",
  "A gross volume of 3112.4735 bbl, since a factor below unity leaves the indicated volume unchanged."],
 "The middle of that table is quiet and both ends carry a warning, and this row sits at the low end of it."),

q(0, "Which corrections does the engine name as the ones a net standard volume would need?",
 "The API MPMS temperature and pressure corrections.",
 ["The ISO 5167 and AGA 3 straight-run tables, which the same module also says it does not carry.",
  "A base pressure and a base temperature supplied by the caller on the same call.",
  "A proving correction and a K factor correction, applied in that order."],
 "This package carries neither of them, so what comes back is a gross volume and the engine says so."),

q(2, "A proving run comes back with a meter factor of 1.040000. What does the engine say about it?",
 "That a factor that far from unity is a proving failure, a wrong K factor or a damaged rotor rather than a volume.",
 ["That the factor is outside the published proving tolerance and the volume should be recomputed at the previous factor.",
  "That the factor should be applied and the meter rechecked at the next scheduled proving.",
  "That the volume is returned as gross with the warning field left null, since the screen applies to the K factor."],
 "The message also says that this screen is this engine's stated choice, so a silent result has cleared this engine's own check and nothing more."),


q(0, "What does the straight-run function say about the provenance of the rows it does answer?",
 "That they are this engine's stated table data and are not cited to a document in this repository.",
 ["That they are computed from the fitting and the beta, so a reader can reproduce them from the geometry.",
  "That they are taken from a published table which the engine names in the note beside them.",
  "That they are the engine's own defaults and are replaced by any figure a project states."],
 "The rows are not derived from anything, so there is no formula to check them against, and a published table replaces them."),


q(2, "Why does the straight-run function withhold the two elbows in different planes column rather than printing a plausible number?",
 "Because the figures that would sit there do not rise with beta the way a published requirement does, so they cannot be right.",
 ["Because two elbows out of plane is a rare arrangement, so the column would be read by almost nobody and is not worth maintaining.",
  "Because the requirement for that arrangement depends on the spacing between the two elbows, which the function is never given.",
  "Because the column would need a flow conditioner to be assumed, and the function has no input saying whether one is fitted."],
 "A plausible number in that column would be used, a skid would be laid out against it, and nothing on the flow result would say so."),


q(2, "Asked for a straight run at a beta above the last column of the table, what does the engine do?",
 "It refuses, saying that answering there would mean reading off the last row.",
 ["It returns the last row, with a warning saying the figure has been read off the end of the table.",
  "It returns the withheld flag, since a beta outside the table is handled the same way as a fitting outside it.",
  "It interpolates upward from the last two columns, since the requirement rises with beta and the trend is known."],
 "The message names the beta it was asked about, says the table stops at 0.75, and says that is also where the flange-tap correlation stops being published."),

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/beginner/fc8b_exam.json', expect_n=42)
finish()
