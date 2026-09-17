import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Expert m06, Where the method stops. Digest sections 17 and 2.

q(1, "This module sorts every number it stands on into four kinds. What are they, and how many numbers sit in the calibrated kind?",
 "Derived, declared, calibrated and held for literature, with exactly one number in the calibrated kind.",
 ["Derived, declared, validated and held for literature, with exactly one number in the validated kind of the four.",
  "Derived, declared, calibrated and held, with six numbers in the calibrated kind.",
  "Measured, declared, pinned and held, with exactly one number pinned rather than measured."],
 "A reader who can place a number in the right kind has learned the main thing this module teaches.")

q(3, "Sharpness 2 and sharpness 3 both appear on one train return. Which kind of number is each of them?",
 "Two is DERIVED for the interception devices, because their capture rate goes as the square of the droplet diameter, and three is DECLARED for the gravity and centrifugal devices.",
 ["Both of them are declared values, and the two figures taken together are the customary band into which this module holds the grade curve of any one of its own devices to have to fall.",
  "Three is derived out of the reduced-efficiency form and two is declared for the two interception devices.",
  "Two is calibrated, so that a flotation cell lands in its customary range, and three is derived from the form."],
 "An exponential in the square of the reduced size has the same half point and the same leading power as the reduced-efficiency family at m equal to two. It was not chosen.")

q(0, "The grade efficiency AT the cut size is 0.500000000000 at ten micron against a ten micron cut. Which kind of number is that, and where does it hold?",
 "Derived, and at every sharpness, because the reduced-efficiency form is r over one plus r.",
 ["Declared, and only at the sharpness of 3 that the gravity and centrifugal devices are given here.",
  "Derived, and only at the sharpness of 2 the interception devices use, the exponential having its half point there.",
  "A calibration, chosen so that a cut size in this module means what the literature takes a cut size to mean."],
 "That is what a cut size MEANS, and there is nothing to check because it follows from something else on the page.")

q(2, "What does this module state about the dissolved and soluble oil floor?",
 "That there is one under any outlet a train can reach, and that no value for it is stated here, so the value is the caller's own.",
 ["That it is the outlet concentration below which no device in this module removes anything at all, and that it is reported back on the return as the truncated tail.",
  "That it is declared in the frozen constants object and applied to every train return without being asked for.",
  "That it exists, and that it customarily falls between the two figures the verdict block of the digest prints."],
 "The existence is stated on every train return. The floor only matters where a train's DISPERSED prediction falls below it.")

q(3, "Every API 421 return that carries the horizontal velocity check also carries velocityRuleComplete false. What is missing?",
 "The second half of the rule. The standard also limits the horizontal velocity to a multiple of the design droplet rise velocity, and that half is not in this repository.",
 ["The short-circuit allowance F, which the standard states and which this module defaults to 1.5.",
  "The depth of the basin, which does not enter the cut size and so is not checked against the rule.",
  "The published limit itself, which this module holds at 0.015000 m/s while a source is awaited."],
 "A basin that passes this check has passed HALF A RULE. The OGBOTOBO basin runs at 0.013591874698 m/s against the 0.015000 m/s fixed limit with its warning absent.")

q(0, "The filter coefficient column falls as the CUBE of the grain size ratio. What is the status of that exponent?",
 "Held for literature. The interception derivation gives the inverse cube, and no bed data in this repository can check it.",
 ["Derived, and validated by the published bed cases in the golden file, three of which state a grain size some way away from the module's own reference.",
  "Declared, since it is one of the constants that the jest suite pins by literal with an exact key set match over the whole frozen object.",
  "Calibrated, since the reference grain of 800 micron was chosen to put the coefficient ratio at exactly one."],
 "It is a strong dependence and the input moves the answer by a large factor. A reader should treat the grain column as the model's statement rather than as a measurement.")

q(1, "What makes attachmentEfficiency different from every other number in this module?",
 "It is the one number with no derivation at all, chosen so a cell at the module's own default conditions cuts in the range induced gas flotation is customarily credited with.",
 ["It is the one number that is not exported at all, so that a caller has no way of moving it.",
  "It is the one number this module refuses to accept from a caller, because moving a calibration would invalidate the cut.",
  "It is the one number that enters the answer linearly, so that an error in it passes through whole."],
 "It is an input, so a caller with a vendor curve can move it. Nothing in this course presents it as published.")

q(2, "Moving the attachment efficiency moves a flotation cut size with its own square root. Why is the square root the reassuring part?",
 "An error in the number you know least about is damped on its way to the answer rather than passed through whole.",
 ["Because the cut then depends on the square of the efficiency, so a factor of two in it is a factor of four in the answer.",
  "Because the efficiency cancels out of the ratio column entirely.",
  "Because the root is taken against the bubble diameter as well, so that the two uncertainties cancel each other out."],
 "Work out the power a calibration enters at, because the power tells you how much of your uncertainty survives the calculation.")

q(0, "No graded answer in this course depends on the attachment efficiency. What is the reason given?",
 "Grading an answer that rests on a calibration would be grading the calibration.",
 ["The value is not exported, so a learner reading the module would have no way of finding it.",
  "Flotation is taught at Professional level, and graded fields are drawn from the Expert tier alone.",
  "The cut size it produces falls outside the band this module states its rise velocities to."],
 "It is the ONE number in this module with no derivation at all, and it is an input so that a caller with real data can move it.")

q(1, "The frozen constants object carries 55 keys, and 16 of them are not in the digest's table of declared constants. Where are those 16?",
 "They are band edges and customary limits, printed where they bite rather than gathered into one list.",
 ["They are derived quantities the module caches in the same object, so they are not declared values at all.",
  "They are the held numbers, kept in the object with no value at all.",
  "They are the golden file's expectation fields, carried so the suite reads them."],
 "They are printed in the sections where they decide something, which on this module is Sections 4, 10, 12, 13 and 16.")

q(2, "How does the jest suite treat the declared constants, and what does that guarantee?",
 "It pins them by literal with an exact key set match, so adding or removing one fails until the pin is updated, which makes moving one a reviewed act rather than a silent one.",
 ["It checks every one of them against the golden file, so that any constant which moves then goes on to fail each and every one of the published cases that happen to touch that key.",
  "It asserts that each one of them lies inside its own customary band, which then leaves any one of these constants entirely free to move about inside the whole of that band unremarked.",
  "It recomputes each of them from the published cases, so a constant that no case reaches is left unpinned in the suite."],
 "The module's own comment says pinning is all any gate can do with these, and the test says in as many words that a pin is not a validation.")

q(3, "A designer asks this module what the hydrocyclone's reject stream will hand to the downstream oil handling. What does it carry?",
 "Nothing. There is no reject stream or oil recovery balance in this engine, which returns what a device removes from the water and says nothing about where it goes.",
 ["The reject split, which is one part of the ideal capture statement that the hydrocyclone bank carries on each one of its own returns alongside the reported cut size itself.",
  "The reject rate, derived from the turndown of the liner bank and from the field it develops, with the oil recovery read off the train as that one stage's own removal.",
  "The oil recovery balance alone, which is the quantity the stage removal percentage already reports."],
 "How much water leaves with the oil is a real design quantity that decides what the downstream oil handling has to accept, and it is absent here.")

q(0, "How close does this module come to describing a bed fouling over time?",
 "It warns above the loading rate at which beds lose depth capture, and it carries no time axis at all.",
 ["It refuses above the breakthrough loading and warns below the floor, which between them bound the life of a bed.",
  "It reports a backwash cycle length, taken from the loading rate and the removal at the reference droplet size.",
  "It carries a fouling factor among its declared constants, which is applied to the filter coefficient of the bed."],
 "An approximation is a number that is a bit wrong and that you can bound. An absence is a mechanism that is missing.")

q(2, "What does this engine say beside every hydrocyclone cut size, and what kind of statement is it?",
 "That the capture is an IDEAL, with re-entrainment, the reject split and the shear the liner itself applies left out, and that field de-oilers are customarily credited with a coarser cut than this, which is a statement about what the model leaves out rather than a number.",
 ["That the cut size is a calibrated figure, landed in the range de-oilers are customarily credited with.",
  "That the cut size carries a vendor performance curve from this repository, applied to it as a shear penalty.",
  "That the capture is an ideal and that a field de-oiler is customarily finer, so the figure is a conservative one."],
 "No vendor performance curve exists in this repository to calibrate against, and that statement belongs beside every cyclone cut size this course prints.")

q(1, "Why does the order identity sit so comfortably beside the list of absences?",
 "The model does not care about order because it does not carry the mechanisms that make order matter, which are fouling, plugging and how much oil each device can take in its reject.",
 ["The absences all sit downstream of the last stage, which is where the order of the plant has stopped mattering.",
  "The identity is asserted on the outlet alone, and every absent mechanism moves a stage removal instead of it.",
  "The absent mechanisms are held for literature, so the identity is what this module offers a designer in their place."],
 "The invariance and the absence are the same fact seen twice.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/advanced/fc7a_m06.json', expect_n=15)
finish()
