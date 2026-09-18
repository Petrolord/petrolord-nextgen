import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Associate m04, Permanent loss, turbine meters and straight run.
# Digest sections 10, 15 and 16.

q(1, "The permanent loss table carries a loss fraction column beside a loss in inches of water. What is the fraction?",
 "The share of the measured differential that the meter run never gives back, with the last column being that share carried in the units the transmitter reads.",
 ["The share of the differential that is recovered downstream as the flow spreads back out to fill the pipe, which is why it falls as the bore of the plate is opened up.",
  "The ratio of the loss on this row to the loss on the row at the lowest beta in the table.",
  "The discharge coefficient expressed as a fraction of unity, which is what makes it move row by row."],
 "Every row is at the ABOH differential, so the last column is the same differential scale the transmitter works in and the fraction is what is gone."),

q(2, "What does the digest print about the permanent loss at the two ends of the published beta range?",
 "63.043643 in H2O at beta 0.100000 against 28.839688 in H2O at beta 0.750000, a difference of 34.203954 and a ratio of 2.186003.",
 ["63.043643 in H2O at beta 0.100000 against 35.079209 in H2O at beta 0.670000, which are the two ends of the range the flange-tap correlation is published over.",
  "0.988145 against 0.452033, which are the loss fractions at the two ends and are the figures a loss comparison has to be made in because the inches of water carry the differential with them.",
  "That the loss falls by about half across the range, which is the comparison the table was built to support."],
 "That RELATION is computed at the ABOH differential across the ends of the published range, and it is the comparison available on this table."),

q(0, "The coefficient column of the permanent loss table is not flat down the rows. Why not?",
 "Each row was evaluated at its own beta, so a loss calculation is quietly a coefficient calculation.",
 ["Each row was evaluated at its own Reynolds number, because the flow through the plate changes as the bore is opened up and the coefficient follows the flow.",
  "The column carries the assumed 0.610000 on some rows and the computed figure on others, so a reader can see the size of the assumption row by row.",
  "The small bore correction is applied on the lower rows of the table and not on the upper ones."],
 "The loss relation takes the coefficient of the run as a required argument, so a table of losses across beta inherits everything the coefficient sweep established."),

q(3, "The loss on the ABOH run was computed twice, once with the run's own coefficient of 0.602223 and once with an assumed 0.610000. What came out?",
 "47.865230 in H2O with the run's own coefficient against 47.689171 in H2O with the assumed one, a difference of 0.176059 and a ratio of 1.003692.",
 ["47.865230 in H2O against 46.794924 in H2O, which is the loss table row at beta 0.500000 and is what an assumed coefficient lands on.",
  "The engine refused the second calculation, so only the figure with the run's own coefficient exists and the cost of the assumption cannot be printed at all.",
  "A difference of 0.072666, which is the span of the coefficient across the published cells carried into the loss."],
 "The engine itself refuses to assume a coefficient. The digest performed the second calculation deliberately so that the cost of the assumption is printed rather than asserted."),

q(2, "Why is the size of that difference the wrong thing to take away from the comparison?",
 "It is one run at one beta and one Reynolds number, and a single assumed value is being compared against a quantity that moves across a whole surface.",
 ["Because the two figures were computed at different differentials, so the difference between them carries a change of operating point as well as a change of coefficient.",
  "Because the assumed 0.610000 sits outside the span of the coefficient sweep, so the comparison is against a value the correlation never returns anywhere.",
  "Because a permanent loss is a running cost rather than a measurement, so the difference is money rather than uncertainty and belongs in a different argument."],
 "Knowing what the assumption costs at one point on the surface tells you what it costs at that point. The only way to know it for your run is to compute the coefficient."),

q(1, "What working order does the permanent loss relation force on a user?",
 "Compute the flow, read the coefficient off that result, then compute the loss with the coefficient the flow calculation returned.",
 ["Compute the loss first at an assumed coefficient, then compute the flow, then repeat the loss with the returned coefficient until the two agree to the printed precision.",
  "Compute the loss and the flow in either order, because the loss relation will take the coefficient from the beta it is given when none is supplied.",
  "Size the plate first, because the sizing result is the only one of the three that returns a coefficient a caller can hand on."],
 "The coefficient is a required argument, and the message says the module exists to show that it is not a constant 0.61, so it will not assume one."),

q(0, "A turbine meter reports 2640000 pulses against a K factor of 848.200000 pulses per bbl and a meter factor of 1.002100. What are the two volumes and what separates them?",
 "An indicated volume of 3112.4735 bbl from the pulses and the K factor, and a gross volume of 3119.0097 bbl once the meter factor from proving is applied.",
 ["An indicated volume of 3119.0097 bbl from the pulses and the K factor, and a gross volume of 3112.4735 bbl once the meter factor has been divided back out of it.",
  "A gross volume of 3112.4735 bbl and a net volume of 3119.0097 bbl, with the temperature and pressure corrections separating them.",
  "One volume of 3112.4735 bbl, since the meter factor scales the K factor rather than the volume."],
 "Pulses divided by the K factor is what the meter itself believes. The meter factor carries the result of a physical comparison against a reference."),

q(3, "Every turbine volume this engine returns carries the same sentence. What does it claim?",
 "That the volume is at metering conditions, that a net standard volume would need the API MPMS temperature and pressure corrections, that this package carries neither, and that this is therefore not a custody transfer quantity.",
 ["That the volume is at metering conditions and has already been corrected to a base temperature and a base pressure the engine holds as defaults, so it may be used on a ticket.",
  "That the volume is gross because the meter factor has been applied to it, and that an indicated volume would have been the custody quantity instead.",
  "That the corrections exist in the package but were not applied on this call, because no base temperature and no base pressure were supplied with the inputs."],
 "The sentence prints the number and prints what the number is. The second half is the part that gets deleted when somebody builds a report."),

q(2, "What is the difference between the claim an indicated volume makes and the claim a gross volume makes?",
 "The indicated volume is what the instrument said on its own, and the gross volume carries the result of a physical test somebody performed on a particular day.",
 ["The indicated volume is the raw pulse count and the gross volume is that count after the K factor has turned it into barrels, which is the step that makes it a volume at all.",
  "The indicated volume is at metering conditions and the gross volume has been taken to standard conditions, which is what the word gross means on a ticket.",
  "The indicated volume carries the engine's own default meter factor and the gross volume carries the one from the most recent proving run."],
 "When a measurement is disputed, those are two different conversations: what the meter said, and what the meter was shown to be worth against something better."),

q(1, "The proving screen on the meter factor fires above 1.010000. How was that threshold established?",
 "By bisecting the meter factor at which the returned warning stops being null.",
 ["By reading the band out of the message, which quotes the percentage from unity that a healthy proving run is expected to land inside of.",
  "By stepping the meter factor through the table until a row came back with a warning beside it.",
  "By taking the meter factor of the ABOH turbine run and widening it until the volume moved by one percent."],
 "The table shows the middle quiet and both ends carrying a warning, and the threshold itself is a property the engine reported about itself rather than a figure read off those rows."),

q(3, "The proving screen message names three candidate causes for a far out meter factor. Which three?",
 "A proving failure, a wrong K factor or a damaged rotor.",
 ["A proving failure, a drifted transmitter span or a stale K factor carried over from the previous service.",
  "A wrong K factor, a damaged rotor or a temperature correction that was never applied to the parcel.",
  "A proving failure, a damaged rotor or a metering agreement whose acceptance band differs from this screen."],
 "The message says a factor that far out is one of those three rather than a volume, and it names the percentage from unity it is describing."),

q(0, "The proving screen message ends by saying that the screen is this engine's stated choice. Why does that sentence matter?",
 "Because a silent result has cleared this engine's own check and nothing more, and no standard or counterparty agreement is in the package.",
 ["Because the band was taken from a published proving procedure, which the engine names so a user can look the limit up and confirm it.",
  "Because the screen can be overridden by the caller, which is what a stated choice means in this package.",
  "Because the screen is applied to the gross volume rather than the indicated one, and the choice being stated is which of the two it screens."],
 "Your operating procedure, your metering agreement and your regulator may all set narrower bands. None of those documents is in this package."),

q(2, "Every answered row of the straight-run table carries a note. What does that note establish?",
 "That the rows are table values rather than a calculation, that they depend on the fitting and the beta, that a flow conditioner shortens them substantially, and that they are not cited to a document in this repository.",
 ["That the rows were computed from the beta and the fitting geometry, so a reader can reproduce them, and that a flow conditioner is outside the scope of the calculation.",
  "That the rows come from a published table the engine names, so a reader can check them, and that the engine will interpolate between the printed betas on request.",
  "That the rows are the engine's own defaults and can be replaced by a project's stated figures, which is how a certified vendor figure is handled elsewhere in this course."],
 "The engine's own words are `these are table values, not a calculation: they depend on the fitting and the beta, and a flow conditioner shortens them substantially`."),

q(1, "The straight-run function reports one upstream fitting it refuses to answer for. What tree was that counted over and what rule decided it?",
 "The five fitting names in the wave's field list, each asked at all six betas, with a fitting counting as refused when the engine returns withheld true at every beta asked.",
 ["The six betas the table carries, with a beta counting as refused when any fitting comes back withheld at it, which is what makes the count a count of columns.",
  "The rows of the table that carry no figure on a screen, whether the engine withheld them or simply had no value to print at that beta.",
  "The fittings the engine has no published table for, counted from the module's exported list of withheld fittings."],
 "The count is 1, and the rule reads the engine's own withheld flag at every beta rather than inspecting the printed table for blanks."),

q(3, "The two elbows in different planes column is withheld. What does the engine give a user instead, and what does it tell them to do?",
 "An account of why the column cannot be right, and an instruction to take the requirement from the standard or fit a flow conditioner.",
 ["The same plane figures for the same beta, with a note saying they are the nearest arrangement the table carries and should be treated as a floor rather than a requirement.",
  "The figure at the next beta up, on the argument that a published requirement rises with beta so the next row is conservative for this one.",
  "A blank, since the module exports a list of withheld fittings and a screen is expected to read that list and print nothing in the cell."],
 "The message says the column that used to be here fell by 15 diameters between beta 0.5 and 0.6 and then rose by 20, and that repairing it needs a table this package does not carry."),

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/beginner/fc8b_m04.json', expect_n=15)
finish()
