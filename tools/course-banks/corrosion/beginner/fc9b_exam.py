import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Associate final exam, 42 questions across the six modules of this tier.
# Sources: digest sections 1, 2, 3, 4, 5, 6, 7, 19, 21, 22, 23 and 24. No
# corrosion rate the correlation produced is keyed, no band word is keyed, and
# no capstone condition and no plant name appears anywhere below.

# ---- module 1: what this screen answers and what it withdrew ----

q(2, "One door in this engine takes a rate in millimetres a year and returns a band label. What else does it return?",
 "Nothing else at all, and the label it returns rests on band edges that carry no source.",
 ["A band label with the band edges beside it, so a reader can see which edge the rate fell on.",
  "A band label and a remaining life, since the two are the only fields the summary rail reconciles.",
  "A band label and a confidence figure derived from how far the rate sits from the nearest edge."],
 "The band edges are held for literature, and the engine says in its own held list that they may be optimistic by one or two steps against the bands commonly cited for carbon steel in production service."),

q(0, "What does the door that returns the temperature at which the film multiplier leaves one need in order to answer?",
 "A carbon dioxide fugacity, and nothing besides.",
 ["A temperature and a carbon dioxide fugacity, since an onset is reported relative to the stream it belongs to.",
  "A temperature, a velocity and a line inside diameter, because the onset is reached through the series combination.",
  "A total pressure and a carbon dioxide mole fraction, from which the door forms the fugacity it needs."],
 "The onset moves with the fugacity alone, which is what makes it computed rather than quoted. At the shipped defaults the fugacity is 1.344240 bar and the onset is 80.984504 C."),

q(3, "The vendored golden says in its own words that every row in it is synthetic. What reason does it give?",
 "No published case of the correlation, no clause of either sour service standard and no rate band table exists anywhere in the repository.",
 ["The rows were generated from the engine itself, so an agreement between the two is arithmetic rather than evidence.",
  "The published cases that do exist sit above the fugacity cap, where the engine reports a convention rather than a prediction.",
  "The rows are regenerated on every rebuild, so none of them predates the behaviour it is checking."],
 "The golden adds that a number recalled from memory is not a published datum and that none is typed there. Route independence and the gate's pins carry the load instead."),

q(2, "A reader takes the single rate off this screen and plans an inspection around the worst spot on a line. What has gone wrong?",
 "The rate is a general uniform rate, so it carries no geometry, no weld, no bend and no deposit and cannot say where the first leak will be.",
 ["The rate is a localised rate, so it describes the worst spot and understates the loss spread over the rest of the wetted surface.",
  "The rate is an upper bound in every regime, so planning against it is conservative and the plan will be earlier than it needs to be.",
  "Nothing has gone wrong with the rate itself. The fault is that an inspection interval needs a design life, which this particular reader never supplied."],
 "The engine states it in its own list of absences by naming a localised attack rate as something it does not provide. The module holds no localised model to compare a uniform rate against."),

q(0, "Three Suite studios take a corrosion allowance and do not know about each other. What is the relationship between them?",
 "This one consumes an allowance to give a life, and the other two add one to a wall, so the wall this studio eats is not the wall either of those sized.",
 ["All three consume the same allowance from one shared record, which is why a change in any of them moves the remaining life reported here.",
  "This one adds an allowance to a pressure containing wall and the other two consume it, which is the reverse of what a reader usually assumes.",
  "All three add an allowance, so the three figures have to be summed before a minimum thickness can be reached."],
 "There is no link between them and no minimum thickness anywhere. That is recorded, it is stated in the studio's help, and it is deliberately not wired up, because a link between three apps is a design decision."),

q(3, "The sour door prints its threshold in both units inside its own note. Why?",
 "So nobody has to convert it, and so a reader can see which of the two numbers a comparison was made against.",
 ["So the studio can show whichever unit the user chose.",
  "So the derived figure can be compared against the exported one, which is the pin that holds the threshold in place.",
  "So a caller can tell a held threshold from a sourced one, since only a held value is ever printed in two units."],
 "The engine declares the value held through a field of its own. Its measured value is 0.003500000000 bar, which is 0.050763208303 psia, and it is bisected out of the sour flag rather than read."),

# ---- module 2: what is in the stream ----

q(1, "Two mole fractions are each inside nought to one and the engine still refuses. What has it checked?",
 "The sum of the two against the total pressure, because two fractions inside their own range can still put the partial pressures above the total.",
 ["The sum of the two against the water cut fraction, since the three together describe how the stream divides at the wall.",
  "Each fraction against the other, because the ratio between them has to fall inside the regime boundaries before a regime word can be issued.",
  "The sum of the two against the fugacity cap, because above the cap the coefficient is held and the sum can no longer be resolved."],
 "The message names the sum it formed. A sum of exactly one is accepted, and the screening runs with a partial pressure sum of 51.000427 bar against a total of 51.000427 bar."),

q(2, "At a total pressure of 100.000000 bar with the course's fixed composition, what are the three chemistry figures?",
 "A coefficient of 0.775834, a carbon dioxide partial pressure of 3.000000 bar and a fugacity of 2.327502 bar.",
 ["A coefficient of 0.775834, a partial pressure of 2.327502 bar and a fugacity of 3.000000 bar.",
  "A coefficient of 0.880814, a partial pressure of 3.000000 bar and a fugacity of 2.327502 bar.",
  "A coefficient of 0.775834, a partial pressure of 3.000000 bar and a fugacity of 3.000000 bar, the cap having been applied."],
 "At 200.000000 bar the same composition gives a coefficient of 0.601919, a partial pressure of 6.000000 bar and a fugacity of 3.611511 bar. The separation between the two quantities is a pressure effect."),

q(0, "Run a screening at a total pressure of 251.000000 bar. What does the cap flag do, and what does the coefficient do?",
 "The flag turns true and the coefficient holds at 0.530179, which is its value at the cap.",
 ["The flag stays false until the pressure is well above the cap, and the coefficient falls on through 0.530179 as it would below it.",
  "The flag turns true and the coefficient is set to one, which is the least limiting value the correction can take.",
  "The flag turns true and the screening refuses, since nothing above the cap can be reported as a rate."],
 "At 249.000000 bar the coefficient is 0.531526 and the flag is false. The cap is a reported limit rather than a silent one, and the engine returns a note saying what it is doing."),

q(3, "At a total pressure of 1.000000 bar the fugacity coefficient is 0.997465. What does that tell a reader?",
 "That the gap between a partial pressure and a fugacity is negligible near atmospheric pressure and is not negligible on a high pressure line.",
 ["That the coefficient is clamped at one below a lower cap, in the same way it is held flat above the upper one.",
  "That the correlation was fitted at atmospheric pressure, so the coefficient is exactly one there by definition.",
  "That the two quantities can be used interchangeably at any pressure at all, since the correction never leaves the sixth decimal on any stream."],
 "Here the fugacity is 0.029924 bar against a partial pressure of 0.030000 bar, and at 200.000000 bar it is 3.611511 bar against 6.000000 bar. The constants behind the coefficient are held for literature like the rest."),

q(2, "A partial pressure on the screen looks about a hundred times too large. What does the course tell a reader to check before anything else, and why there?",
 "The mole percent box, because the studio takes mol% and the division by a hundred to a mole fraction is the commonest place to lose a factor of ten.",
 ["The fugacity coefficient, because it falls with pressure and is the one step between a mole fraction and the partial pressure.",
  "The total pressure box, since the engine reads psia there and a figure typed in bar inflates every partial pressure.",
  "The hydrogen sulphide flag, since an uncorrected partial pressure reads high against a fugacity at any line pressure the engine is handed and never says so."],
 "Carbon dioxide typed as 3 mol% is a mole fraction of 0.030000, and the conversion is a division by a hundred. A partial pressure is the total pressure times that fraction with no correlation constant in it, so a factor lost at the box shows straight through to the screen."),

q(1, "Which quantity does the hydrogen sulphide screening comparison use, and how does the engine make that visible?",
 "An uncorrected partial pressure, and the engine declares it by returning a flag saying no fugacity correction was applied.",
 ["A corrected fugacity, and the engine makes it visible by reporting the coefficient it used beside the comparison.",
  "An uncorrected partial pressure, and the engine leaves it to the reader to notice that no coefficient field is returned.",
  "Whichever of the two the caller supplied, and the engine records the choice in the clamps list beside the other moved inputs."],
 "The flag reads false on every case the engine ships. At the shipped defaults the hydrogen sulphide partial pressure is 0.051000 bar, printed as 0.739699 psia."),

q(3, "A fugacity is fed into a place where a partial pressure belongs. Why is that a difficult error to catch?",
 "It gives a plausible answer rather than an obvious one, so the verdict shifts without anything on the screen looking wrong.",
 ["It gives a not a number result, which a caller testing only for an error key will read as a valid answer.",
  "It gives a partial pressure above the total pressure, which the sum guard catches and reports as a composition error.",
  "It gives a rate several times too large, which the band label beside it then reports as the step above the one the case really belongs in."],
 "The engine keeps the two apart, labels which is which in its returned fields, and the chemistry panel puts them side by side. A ratio built from mole fractions is what catches a fugacity fed where a partial pressure belongs."),

# ---- module 3: two resistances in series ----

q(0, "One stream reports a combined rate that is 0.990899 of its smaller term. What shape of stream produces a figure that close to one?",
 "One where the two terms are far apart, so the larger one adds almost nothing to the combined resistance.",
 ["One where the two terms are nearly equal, so the series combination is almost the average of the two.",
  "One where the velocity is high enough that the transport term has stopped moving with it.",
  "One where the film multiplier is exactly one, so nothing is removed from the combination after it is formed."],
 "It is the slowest of the six streams on both terms at once, and the engine puts its controlling margin at 107.879479, which is the largest of the six."),

q(2, "On the stream whose combined rate is 0.990899 of its smaller term, which inputs would a corrosion engineer reach for to move the answer?",
 "Velocity and line size, because the transport term is far below the reaction term and transport is what the engine names.",
 ["Temperature and carbon dioxide, because the reaction term is the larger of the two and a larger term is what sets the rate.",
  "The corrosion inhibitor efficiency alone, since it is the last lever.",
  "Nothing, because a controlling margin of 107.879479 is outside the reporting margin and the engine declines to name a term."],
 "Where transport controls, velocity and line size move this rate and the chemistry does not. Where the reaction controls, temperature and carbon dioxide move it and the flow does not."),

q(1, "One exponent of the transport term is described in the course as a property rather than as a typed constant. Which, and why?",
 "The fugacity exponent, measured at 1.000000000000, because the term is exactly linear in fugacity and nothing needs to be typed to make it so.",
 ["The velocity exponent, measured at 0.800000000000, because it can be reached entirely from the outside by doubling the velocity at a fixed line diameter.",
  "The diameter exponent, measured at 0.200000000000, because it enters the term the other way round from the velocity and has to be read off a halving.",
  "The coefficient in front of the term, measured at 2.450000000000, because it is read at unit velocity, unit diameter and unit fugacity."],
 "The base two log of the doubling ratio in fugacity comes out at exactly one. The other three are held for literature and pinned against a literal in a third file."),

q(3, "In the course's sweep of the transport term against velocity at four line diameters, both ratio columns are constant down the table and equal to each other. Why is that the claim being made?",
 "It is what a power law in velocity means, and it is a statement about the shape of the term that holds whatever its constants turn out to be.",
 ["It is what a linear term means, since a doubling in a term that is linear produces a fixed difference in the answer rather than a fixed ratio.",
  "It is what agreement with the vendored oracle means, since the oracle reaches exactly the same ratio through a route of its own that shares nothing.",
  "It is what the pin proves, since a constant measured at four diameters is measured four times over."],
 "The measured velocity exponent is 0.800000000000 and the diameter exponent is 0.200000000000, both pinned against a literal in a third file."),

q(2, "A screening declines to name either of the two rate terms. What has the engine done, and on what grounds?",
 "It is a reporting decision taken when two nearly equal numbers would flip on floating point noise. It is not a claim about where transport stops mattering.",
 ["It is a claim that the two mechanisms contribute equally at those conditions, and it is not a reporting decision of any kind.",
  "It is a refusal to compute the combined rate, and it is not something a reader should act on at all.",
  "It is the engine reporting that both terms sit inside the published validity band, and it is not a comparison between them."],
 "The engine puts the margin on the rail beside the word, so a reader can see how far a given case sits from that boundary before acting on the name."),

q(1, "A reported combined rate sits above one of the two terms it was built from. What can be said about that, and on what authority?",
 "That the arithmetic is wrong, and it can be said without reference to any source, because the claim needs no held constant.",
 ["That the film multiplier has been applied to the wrong one of the two terms, which is the single arrangement question this module leaves open.",
  "That the stream is in the sulphide regime, where the rate is retained only as an upper bound and may exceed either term.",
  "That the correlation has been run outside its published validity band, which the engine cannot detect and does not report."],
 "The series identity is checked on every row the course prints and held to twelve figures. Find the smaller term, and the printed combination should be near it and below it."),

# ---- module 4: the protective film ----

q(3, "At its own computed onset the film multiplier is exactly 1.000000000000 at every fugacity in the sweep. What kind of check is that?",
 "A constant free invariant, since it tests the expression at its own boundary and needs no expected number from anywhere.",
 ["A pin, since the value of one is a literal sitting in a third file and the measurement taken here is compared against that literal.",
  "An independent route, since the onset is reached by bisection and the factor by a closed form.",
  "A tolerance, since the agreement is quoted to twelve figures rather than as an exact equality and the size of the gap is what gets reported."],
 "Below the onset the engine returns exactly one and the rate passes through untouched, which is why every capstone scenario in this course is set below its own onset."),

q(0, "Hold a temperature of 60.000000 C and walk the carbon dioxide fugacity. At which of the swept fugacities is a film credited?",
 "At 20.000000 bar and at 60.000000 bar, where the factors are 0.528864 and 0.273572.",
 ["At every fugacity in the sweep, since the onset falls below 60.000000 C as soon as the fugacity leaves its lowest value.",
  "At 0.050000 bar and 0.200000 bar, where the onset is highest and the film therefore forms first.",
  "At none of them, since the shipped case runs at 60.000000 C and takes no film credit at all."],
 "The onsets fall as the fugacity rises, from 132.297731 C at 0.050000 bar to 35.853960 C at 60.000000 bar. A stream sits below its onset at one fugacity and above it at another."),

q(2, "Read the column of factors taken 20 degrees above each computed onset. What does it do across the sweep?",
 "It falls, from 0.526907 at the lowest fugacity to 0.337174 at the highest, so the same step past the onset removes more at high fugacity.",
 ["It holds at exactly one, since the multiplier is clamped and the clamp releases only well past the onset.",
  "It rises, from 0.337174 at the lowest fugacity in the sweep to 0.526907 at the highest of them, so a high pressure line keeps rather more of its rate.",
  "It is the same number at every fugacity in the sweep, which is the scale free property the whole onset table exists in order to demonstrate."],
 "At 1.000000 bar it is 0.442281, at 2.000000 bar 0.423517 and at 5.000000 bar 0.399278. The factor at the onset itself is exactly one at every row."),

q(1, "One line is screened at two operating pressures with nothing else changed. What can differ between the two answers?",
 "Whether any film credit is in the rate at all, because the onset moves with the fugacity and the printed rate alone will not say which case you have.",
 ["Whether the rate is reported at all, because the onset expression refuses above the cap and the two pressures may straddle it.",
  "Whether the wetting regime is read, because the film multiplier and the wetting factor are applied in the same step.",
  "Nothing, because the film multiplier depends on temperature alone and the temperature has not been touched."],
 "Record the computed onset beside the rate whenever you copy a screening down. It is the number that says whether the film is in the answer."),

q(0, "Why is the computed onset teachable in this course when the published turning temperature is not?",
 "It is measured out of the engine's own behaviour by bisection and cross checked against a closed form, and it is still not a sourced temperature.",
 ["It is exported by name, so a declaration and a behaviour can be compared, which is what makes a figure teachable here.",
  "It is one of the four range guards the engine enforces, so it is a limit the module can defend rather than a fit it cannot.",
  "It is graded in the capstone, which is the test a figure has to pass before a lesson may quote it."],
 "The three constants of the expression that produces it are held for literature, and so is the temperature at which the published correlation turns protective."),

q(3, "A help page states that the protective film appears at a single round temperature. What is wrong with that?",
 "It is right at one fugacity and wrong at every other, because the onset moves by 96.443771 degrees Celsius across the swept band.",
 ["It is right on any stream sitting below the fugacity cap and wrong on any stream above it, where the coefficient is held flat instead.",
  "It is right for the reaction term and wrong for the combined rate, which is precisely the arrangement question this module declines to settle.",
  "It is wrong because the engine refuses to compute an onset at all and reports only the multiplier."],
 "The panel prints the computed onset for the conditions set rather than a constant, and the figure moves as the pressure or the composition changes."),

q(2, "A screening shows a multiplier of exactly one while the temperature sits above the computed onset on the same panel. What should a reader do?",
 "Trust neither figure until they have found out why, because the two cannot both be right.",
 ["Take the multiplier, since it is the value that actually reached the rate and the onset is reported for information only.",
  "Take the onset, since it is found by bisection and cross checked against a closed form while the multiplier is read once.",
  "Take both, since a multiplier of one above the onset is what the clamp produces whenever the fugacity is below the cap."],
 "Three readings are worth telling apart. A multiplier of one below the onset means the film is not credited, a multiplier below one means the rate you are reading is lower for it, and the third combination is a contradiction."),

# ---- module 5: the pH and the water ----

q(1, "Two values a ten thousandth of a pH unit apart, 3.999900 and 4.000000, are handed to the correction. How do the two answers differ?",
 "A refusal from the first, carrying the reference of 4.000000, and a factor of exactly 1.000000000000 from the second.",
 ["A refusal from both, since the reference guard is applied at or below its own value rather than strictly below it.",
  "A factor from both, the first extrapolated from the slope and marked as outside the band the correction was fitted over.",
  "A factor of 1.000000000000 from the first, since the correction is clamped at the reference, and the same from the second."],
 "The boundary is sharp and it is meant to be. What the published correction does on the lower side of it carries no source in this repository."),

q(3, "One of the engine's worked streams runs a rate of 0.840204 mm/yr at an in situ pH of 5.500000. Where does the same stream sit at 4.500000 and at 6.000000?",
 "At 2.656960 mm/yr and 0.472482 mm/yr, so the rate falls at every step up the column.",
 ["At 0.472482 mm/yr and 2.656960 mm/yr, so the rate rises at every step up the column as the water becomes less acid.",
  "At 2.656960 mm/yr and 0.840204 mm/yr, since the correction is flat across the middle of the band.",
  "At 1.494118 mm/yr and 0.149412 mm/yr, which are the values one whole pH unit either side of the stated figure."],
 "The column is strictly falling, and at 5.000000 the same stream sits at 1.494118 mm/yr. Every step is a smaller drop than the one above it."),

q(1, "Three different things are refused at the pH door and the messages are not the same. Which description is right?",
 "A blank box asks for a finite figure, a pH of 14.500000 names the band of nought to fourteen, and a pH below 4.000000 names the reference.",
 ["A blank box and a pH of 14.500000 give back the same message as each other, and a pH below 4.000000 gives a factor with a warning attached to it.",
  "All three give the same message, since every refusal in this module names the input and the value that failed.",
  "A blank box gives a factor of one, a pH of 14.500000 is clamped to fourteen, and a pH below 4.000000 is refused."],
 "The range guard and the reference guard are separate and they say different things. The reference guard sits inside the range and refuses a chemically valid pH."),

q(0, "The pH door returns a factor and the reference it was taken against. Which parts of that correction carry no source in this repository?",
 "The slope, the reference itself, and what the correlation does below the reference.",
 ["The reference alone, since a slope measured by bisection is a behaviour rather than a fitted number.",
  "The slope alone, since the reference is enforced as a range guard and a guard the engine enforces is one it can defend.",
  "Neither, since both are exported by name and an exported constant is one the module has a source for."],
 "They are measured out of the engine's behaviour and pinned against a literal in a third file, so the module is using what it declares. No source here says whether the declared values are the published ones."),

q(3, "At the pH reference the factor is exactly 1.000000, and the course says that is by definition rather than by a clamp. What does that mean?",
 "The correction is the ratio of the water you have to the water the fit was made on, so at the fitted condition it cannot be anything else.",
 ["The engine tests the pH against the reference and substitutes one whenever the two agree, which is what a clamp at a boundary does.",
  "The factor is clamped at one from above in the same way the film multiplier is, so no correction anywhere can ever raise a rate.",
  "The reference was chosen after the fact as the pH at which the measured factor happened to come out at one."],
 "Above the reference the factor falls below one, which reduces the rate. Below the reference the engine returns no factor at all."),

# ---- module 6: one screen end to end ----

q(2, "The studio prints the engine's own warning about the corrosion inhibitor programme on its shipped case. What figure does that warning state for the metal loss?",
 "1.45 times the datasheet number, from an effective protection of 85.5 percent.",
 ["5.203611 times the datasheet number, which is the uninhibited rate on that case.",
  "1.000000 times the datasheet number, since the datasheet efficiency is what the case was run at.",
  "6.896552 times the datasheet number, which is the ratio the shear verdict produces on the same case."],
 "The datasheet efficiency is 90.000000 percent and the availability is 95.000000 percent, so the effective protection is 85.500000 percent and the shortfall is 4.500000 percentage points."),

q(0, "Why do all three capstones in this course state their conditions in the engine's units rather than in the studio's?",
 "Because one of the studio's conversion factors is truncated, so grading a learner on which rounding an app happens to carry would measure the app instead of the corrosion.",
 ["Because the engine refuses any input it did not convert itself, so a figure in field units would never reach the correlation.",
  "Because the studio's conversions are applied twice on the way out, so a figure taken through them cannot be reproduced by hand.",
  "Because the capstone grades a corrosion rate, and a rate is only reproducible when the conditions behind it are in correlation units."],
 "The studio divides a psig pressure by 14.5038 where the engine exports 14.503773800722, which sits 1.910e-9 above what the definitions of the bar and of the pound force give."),

q(1, "The shipped case reports an uninhibited rate. What is it in both units, and what does it mean?",
 "5.203611 mm/yr, which is 204.866591 mpy, and it is the same case with no corrosion inhibitor credit at all.",
 ["5.203611 mm/yr, which is 29.705656 mpy, and it is the rate the datasheet efficiency alone would give.",
  "0.754524 mm/yr, which is 204.866591 mpy, and it is the rate before the pH factor has been applied.",
  "9.253475 mm/yr, which is 204.866591 mpy, and it is the series combination of the two terms before any correction at all."],
 "The reported rate on the same screen is 0.754524 mm/yr, and the corrosion inhibitor credit of 85.500000 percent is the whole of what separates the two."),

q(3, "At 60 ft per second the engine reports two rates side by side. What are they and why are both there?",
 "13.080024 mm/yr with the credit removed and 1.896603 mm/yr with it kept, so the cost of the shear verdict is visible rather than implied.",
 ["13.080024 mm/yr as an upper bound and 1.896603 mm/yr as a best estimate, so the reader has a bracket rather than a value.",
  "13.080024 mm/yr from the correlation and 1.896603 mm/yr from the vendored oracle, so the two derivations can be compared.",
  "13.080024 mm/yr at the new velocity and 1.896603 mm/yr at the shipped one, so the reader can see what the change did."],
 "The wall shear there is 362.474888 Pa against the measured stripping threshold of 100.000000 Pa, and the film risk turns high. No new correlation was invented to do it: the credit is simply not taken."),

q(2, "At 60 ft per second the engine reports the rate with the corrosion inhibitor credit removed beside the rate with it kept. What is the ratio between the two, and what happens to the remaining life?",
 "6.896552, and the remaining life falls from 4.207953 yr to 0.242737 yr.",
 ["2.779300, and the remaining life falls to 0.242737 yr.",
  "6.896552, and the remaining life is withheld because the model no longer applies at that velocity.",
  "1.163506, and the remaining life falls from 20.000000 yr to 4.207953 yr."],
 "The binding constraint becomes the wall shear on the corrosion inhibitor film, and the engine's own sentence says that slowing the line changes this answer before anything else does."),

q(0, "Move the in situ pH of the shipped case to 4.0. What is the remaining life there?",
 "2.366306 yr, against 4.207953 yr at the shipped value.",
 ["0.242737 yr, against 4.207953 yr at the shipped value, since a lower pH removes the corrosion inhibitor credit.",
  "4.207953 yr, unchanged, since the pH factor reaches the reported rate through the wetting regime alone.",
  "20.000000 yr, since at the reference the correction is exactly one and the case meets its design life."],
 "The rate at 4.0 is 1.341754 mm/yr against 0.754524 mm/yr at 4.5, and the binding constraint stays with the corrosion allowance against the design life."),

q(1, "The studio's shipped case types a density of 56 lb/ft3 and a viscosity of 1 cp. What reaches the engine?",
 "897.036000 kg/m3 and 1.000000 mPa s.",
 ["56 kg/m3 and 1.000000 mPa s, since the density conversion is applied on the way back out rather than on the way in and never before.",
  "897.036000 kg/m3 and 0.001000 mPa s, the viscosity being divided by a thousand as well as multiplied by it.",
  "897.036000 kg/m3 and 1.000000 mPa s, both of which the engine then converts again before the wall shear is formed."],
 "Both figures feed this module's own Reynolds number, which on that case is 416686.8569. The engine works in kilograms a cubic metre and pascal seconds because that is what the correlations behind it are published in."),

# ---- cross cutting: vocabulary and scope ----

q(3, "A learner writes that this module computes the friction factor for a line. What is missing from that sentence?",
 "That it is this module's own friction factor, and that the line sizing course computes its own with a different correlation and a different transition.",
 ["That the friction factor is held for literature, which is the standing of every constant in this engine.",
  "That the friction factor is read across from the line sizing module, which is where every friction factor on this platform is computed.",
  "That the two courses agree on the same pipe whenever the branch is turbulent and part company only in the laminar branch."],
 "The two will not agree on the same pipe and the engine says so in its own docstring. Removing the duplicate is a cross module decision and the repair deliberately left it alone."),

q(0, "Why does this course insist on the words corrosion inhibitor rather than the bare word?",
 "Because the bare word already means a hydrate inhibitor in the Flow Assurance course, dosed in mass fraction of the water phase.",
 ["Because the bare word already means a scale inhibitor in the Production Chemistry course, which is dosed continuously.",
  "Because the engine's own field names use the longer form, and a bank question has to match the field name a learner will eventually read on the screen.",
  "Because the bare word would be read as the corrosion allowance, which is the other quantity the same rail carries."],
 "Here it is a filming amine on the steel with an efficiency and an availability. The two are different chemicals doing different jobs in different phases."),

q(2, "A lesson in this course needs to mention wall loss from entrained solids. What must it carry with the mention?",
 "The words mechanical erosion or erosional wall loss, and the statement that this engine has no erosional velocity criterion at all.",
 ["The name of the live course that owns the criterion, and nothing further, since naming an owner is the whole of what a scope seam requires.",
  "The wall shear this module computes, since that is the one quantity an erosional velocity limit would have to be compared against.",
  "A note that the criterion is held for literature, in the same way the film stripping threshold is held."],
 "The bare word already means a geological process in the Basin Modelling course. The Casing & Tubing Design course owns the erosional velocity criterion, and Nodal Analysis and Gas Well Deliverability cite it."),

q(1, "One live course points at this one. Which, and what does it say about corrosion?",
 "The Well Integrity and P&A course, which states in its own scope that it carries no corrosion model, no wall loss and no remaining life.",
 ["The Pipeline & Line Sizing course, which adds a corrosion allowance to a wall and leaves the rate that consumes it to this module.",
  "The Fluid Properties course, which owns fugacity and hands the partial pressure comparison over to this one.",
  "The Casing & Tubing Design course, which owns the erosional velocity criterion and defers the film question here."],
 "This course fills exactly that refusal. A barrier envelope is a pressure containment argument and a corrosion allowance is a thickness this studio divides by a rate, and no lesson may write one as the other."),

emit(Q, '/root/fc-wip-corrosion/banks/fc9b_exam.json', expect_n=42)
finish()
