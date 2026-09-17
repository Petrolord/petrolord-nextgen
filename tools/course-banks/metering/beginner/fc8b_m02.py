import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Associate m02, The discharge coefficient is not a constant.
# Digest sections 4, 5 and 6.

q(1, "The coefficient sweep reports 35 cells sitting inside the published beta range. What tree was counted, and what rule admitted a cell?",
 "The cross product of the nine betas and the five Reynolds numbers, with a cell counting when the engine returns betaInPublishedRange true for it.",
 ["The cells whose coefficient lands between the largest and the smallest figures the sweep reports, which is what defines the published band of a fitted correlation.",
  "Every cell the sweep evaluates, since the engine returns a coefficient at all of them.",
  "The cells at a beta the engine will also size a plate at, which is the same band the search bracket uses."],
 "The tree is the cross product of the betas and Reynolds numbers in the wave's own field list, and the rule reads the engine's own flag rather than comparing numbers."),

q(2, "The span of the coefficient across the published cells runs from 0.668050 to 0.595385. What do those two cells have in common, and why does that matter?",
 "Both are at beta 0.750000, so only the Reynolds number changed between them.",
 ["Both are at the highest Reynolds number the sweep evaluates, so only the beta changed and the span is a measurement of how much the plate geometry moves the coefficient.",
  "Both are at the ABOH pipe Reynolds number of 2117151.4444, so the span belongs to the run the tier reads.",
  "Neither is inside the published beta range, which is why the span is quoted as a difference rather than as a pair of usable coefficients."],
 "The difference is 0.072666 and the ratio is 1.122048, between a cell at Reynolds 5e+3 and a cell at Reynolds 5e+7 on the same beta of 0.750000."),

q(0, "Looking at the coefficient sweep, which of these statements is a writer entitled to make?",
 "That the coefficient across the published cells spans a difference of 0.072666 and a ratio of 1.122048, because that comparison was computed and printed.",
 ["That beta moves the coefficient further than the Reynolds number does, since the table has nine betas and only five Reynolds numbers.",
  "That the coefficient falls steadily along every row of the table.",
  "That the row at beta 0.800000 is the steepest in the table."],
 "The span is the one comparison the sweep computed. It names no steepest direction, ranks no rows and does not say which of the two axes moves the coefficient further."),

q(3, "The permanent loss relation will not run without a discharge coefficient. What does its refusal say, and what position is it taking?",
 "It says the loss needs the discharge coefficient of this run, and that the module exists to show the coefficient is not a constant 0.61, so it will not assume one.",
 ["It says the coefficient is missing and substitutes the value at the beta it was given, flagging the substitution on the result so a reader can see a default was used.",
  "It says the coefficient must be supplied because the loss fraction is read from a table this package does not carry, so there is no row to interpolate between and nothing to return.",
  "It says a loss calculation needs a positive differential, a density and a viscosity, which is the same guard the flow calculation carries."],
 "The message names the quantity it needs and the position it is taking. An engine that filled in a plausible coefficient would return a result indistinguishable from one where it was computed."),

q(0, "The small bore correction turns on below a pipe bore of 2.800000 in. How was that threshold established?",
 "By bisecting the engine's own smallBoreCorrectionApplied flag, so the figure is a property the engine reported about itself.",
 ["By reading the threshold out of the module source and then checking it against the coefficients the sweep prints on either side of it.",
  "By finding the bore at which the coefficient stops changing between rows.",
  "By taking the smallest bore in the sweep and the largest and halving the gap once."],
 "Nothing was read from the source and nothing was typed. A threshold found by bisecting a returned flag stays true when the engine is rebuilt and turns false loudly if the engine changes."),

q(2, "What is the only statement the digest licenses about the size of the small bore step in the coefficient?",
 "That at beta 0.500000 and Reynolds 1e+6 the coefficient is 0.603040 where the correction is applied and 0.603075 where it is not, a difference of -0.000036 and a ratio of 0.999941.",
 ["That the step is small enough at every beta and every Reynolds number to be left out of an ordinary flow calculation without any consequence for the answer.",
  "That the correction raises the coefficient, since an extra term in the equation can only add to it.",
  "That the step is smaller than the span of the coefficient across the published cells."],
 "That comparison was computed at one beta and one Reynolds number, and it is the only statement about the size of this step available."),

q(1, "The ABOH run has a pipe bore of 6.065000 in. What must the small bore flag on its result have been, and how do you know without running anything?",
 "False, because 6.065000 in sits above the bore of 2.800000 in below which the correction is applied.",
 ["True, because the correction is applied at the bores the sweep prints as true and 6.065000 in is one of the rows in that table with a coefficient of 0.603149 beside it.",
  "False, because the correction is applied only to bores the correlation treats as large, and a six inch run is well inside the ordinary range.",
  "It cannot be settled without running the case, because the flag also depends on the beta and on the Reynolds number of the run."],
 "The threshold is a bore and this run's bore is above it. The sweep row at 6.065000 in carries a correction applied of false."),

q(3, "How were the two edges of the published beta range, 0.100000 and 0.750000, established?",
 "By bisecting the engine's own betaInPublishedRange flag at each edge rather than by reading a constant.",
 ["By evaluating the correlation until the returned coefficient stopped moving, which is where a fit leaves the data it was regressed against and the curve flattens.",
  "By taking the lowest and the highest beta the coefficient sweep evaluates, since a sweep is built to cover the published band and nothing beyond it.",
  "By reading them out of the warning message, which names the band it is comparing against in its own text."],
 "Both edges come from bisecting a returned flag. The warning text quotes the same band, but the figures were measured from the engine rather than parsed out of a sentence."),

q(2, "A plate comes back at a beta above the upper edge of the published range. What does the engine do?",
 "It still returns a coefficient and carries a warning saying the number is outside the band the correlation is published for.",
 ["It refuses and returns no coefficient, on the argument that a number with no measurements underneath it is worse than no number at all when a plate is about to be ordered.",
  "It returns the coefficient at the upper edge instead, so the answer stays inside the published band.",
  "It returns a coefficient and sets the small bore flag, which is the general flag this module uses for any evaluation outside its fitted domain."],
 "Refusing would leave a user with no number and no account of what kind of number was unavailable. The result carries the coefficient and a warning naming the beta and the band."),

q(0, "The engine's warning above the upper edge reads: `beta of 0.841 is outside the 0.1 to 0.75 range the flange-tap correlation is published for: resize the plate rather than trusting this number`. What two things is that sentence doing?",
 "Naming the beta it was asked about and the band it sits outside, and saying what to do about it.",
 ["Naming the extrapolation error and bounding it, so the reader can decide whether the coefficient is still usable.",
  "Reporting the beta and refusing to return a coefficient until the plate is resized.",
  "Quoting the document the band comes from, so the reader can go and check the edge."],
 "The message is specific to the run because it carries the beta it was asked about, and it ends by telling the reader to change the plate."),

q(1, "A second warning fires inside the published range, above a beta of 0.600000. What is it telling the reader?",
 "That a legitimate run has bought something and paid for it, because the permanent pressure loss falls while the uncertainty and the straight-run requirement both rise.",
 ["That the run has left the published band, which is why the published range flag on those results comes back false and the coefficient becomes an extrapolation of the equation.",
  "That the coefficient at that beta is near the top of the span the sweep printed and is therefore more sensitive to the Reynolds number than a lower beta would be.",
  "That the small bore correction has stopped being applied, which is the other flag this module changes state on as the geometry moves."],
 "A run above the trade threshold is inside the published range and its flag comes back true. The warning records a cost on the result rather than declaring a fault."),

q(3, "Reviewing somebody's calculation on a small line, what does the small bore flag on their result let you settle immediately?",
 "Whether the correlation carried its extra term on that run.",
 ["Whether the pipe bore they entered agrees with the line they were sizing, since the flag is set by comparing the stated bore against a schedule the engine holds.",
  "Whether their beta sits inside the published range, since the small bore correction and the published band are set by the same test inside the correlation.",
  "Whether the coefficient they quoted came from the correlation or was assumed, since the flag is set only on a coefficient the engine evaluated itself."],
 "The threshold is a bore and the flag is a field of the result, so a question about which arithmetic produced a coefficient is answered in one glance."),

q(2, "The ABOH run came back with a beta of 0.482523 and a pipe Reynolds number of 2117151.4444. What does that tell you about reading a coefficient off the sweep?",
 "It sits between two rows and between two columns, which is the ordinary case and is why the coefficient is evaluated rather than looked up.",
 ["It sits on the row at beta 0.500000, so its returned coefficient of 0.602223 can be read directly off the sweep at the nearest Reynolds column to it.",
  "It sits outside the sweep altogether, because the sweep is evaluated on a pipe bore other than the one the ABOH run uses, which is stated on the sheet.",
  "It sits at a Reynolds number above the largest column in the sweep, so the coefficient had to be extrapolated along the row."],
 "A real meter almost never lands on a gridline. The returned coefficient of 0.602223 belongs to that point and to no other."),

q(1, "Walking down a column of the coefficient sweep and walking along a row are two different exercises. What is each one?",
 "Down a column you are changing the plate, which is a designer's move; along a row you are changing the flow, the density or the viscosity, which is what the process does to you.",
 ["Down a column you are changing the pipe bore, which is a piping decision; along a row you are changing the orifice bore, which is a plate decision made after the pipe is fixed.",
  "Down a column you are changing the fluid and along a row you are changing the differential, which are the two stated groups on the result sheet.",
  "Down a column you are inside the published band and along a row you are crossing it, which is why only some of the cells count."],
 "The coefficient is a value on a surface, and quoting it without saying which point on the surface you were at is quoting half a number."),

q(0, "The sweep prints coefficients at betas outside the published band, such as the row at beta 0.800000. Why are they there at all?",
 "Because the engine still returns a coefficient outside the published band and tells you what it has done, so the printed cells show what an extrapolation looks like.",
 ["Because the band moves with the Reynolds number, so a beta outside it in one column is inside it in another.",
  "Because the count of published cells is taken over the whole sweep and needs the failing cells present to be checked.",
  "Because the small bore correction extends the correlation above the upper edge on a pipe of this size."],
 "Those cells do not count as published, and the engine's warning is what accompanies them. Printing them is how the difference between the two kinds of answer is shown."),

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/beginner/fc8b_m02.json', expect_n=15)
finish()
