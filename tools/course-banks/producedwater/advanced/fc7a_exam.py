import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Expert tier exam, 42 questions across all six modules. Seven per module,
# each asked from an angle its own module bank does not use.

# --- the coupling (m01), digest section 14 ---

q(0, "One of the three published train cases is described as three identical devices, to show the coupling. Why put a case like that in a golden file at all?",
 "Because the coupling is what a fixed efficiency table throws away, so it needs a published case of its own, checked by a route with no bins in it.",
 ["Because three identical devices are the only arrangement in which the order identity can be asserted at all.",
  "Because a train of identical devices is the one case where the engine and the particle tracking agree exactly.",
  "Because the Suite's own shipped default train has three stages in it, so this published case is simply that same train with all three of its devices equalised."],
 "The golden there is 21.720064 ppm against the engine's 21.685537, with outlet medians of 8.385841 and 8.400899 micron, all of it written by particle tracking over 400000 droplets.")

q(2, "In the five identical device sweep the last column reads 1.000000, 0.486641, 0.313934, 0.233950 and 0.187835. What is each of those a ratio of?",
 "That stage's own removal over the first stage's removal.",
 ["That stage's outlet concentration over the concentration entering the train.",
  "That stage's cut size over the outlet droplet median arriving at it.",
  "The volume surviving that stage over the volume that survived the stage before it."],
 "It is derived, each stage removal over the first stage's. The fifth identical device removes 12.284239 percent where the first removed 65.398946.")

q(3, "Running the OGBOTOBO devices in reverse, the API 421 basin reports 0.006985 percent. Where in that train is the basin, and what is the figure telling you?",
 "Last, and it is telling you what the three finer devices ahead of it had already taken out of the water.",
 ["First, and it is telling you that a coarse device standing on raw water removes almost nothing that is worth having.",
  "Last, and it is telling you that the basin has been sized below the cut size the water needs.",
  "Second, and it is telling you that the reversal has put two interception devices ahead of it."],
 "As designed, at the head of the train, the same basin reports 3.237437 percent. Nothing about the vessel changed between the two runs.")

q(1, "A stage removal means nothing without knowing what reached that stage. Which figure on a train return tells you what reached it?",
 "The outlet droplet median of the stage before it.",
 ["The cut size of the stage itself, which the engine sizes against the water arriving at it.",
  "The overall removal, which carries the state of the water at every position in the plant.",
  "The truncated tail, which says how much of the arriving distribution the bins did not cover."],
 "Down the OGBOTOBO train those medians run 13.476136, then 3.972384, then 3.415699 micron, so the last two devices work on water whose median sits below every cut size in the plant.")

q(2, "After the fifth of five identical 9 micron devices the outlet droplet median is 3.670618 micron. What does that figure say about the water arriving at that last vessel?",
 "Its typical droplet is well under the cut size of the device it is being handed to.",
 ["Its typical droplet is just above the cut size, which is why the stage still removes 12.284239 percent.",
  "It is numerical dust, so no further device in this module can be applied to it at all.",
  "It is finer than the dissolved and soluble oil floor this module carries for such waters."],
 "A device placed where the water is already fine is being asked for its worst performance, and the number it returns will say so.")

q(0, "Two competing trains are quoted at you, each with its four stage removals. What must you compare, and why?",
 "Their outlets, because the stage numbers are functions of the arrangement and will differ for reasons that have nothing to do with performance.",
 ["Their stage removals in order, because the arrangement is what the two designs actually differ in.",
  "Their largest stage removals, because the device doing most of the work decides the train.",
  "Their overall removal percentages alone, because an outlet concentration depends on the inlet it started from and the two inlets quoted at you may well differ."],
 "Reordering four devices moved the per stage figures by as much as 57.344778 percentage points and left the outlet at 160.391597 ppm.")

q(3, "A vendor quotes a removal percentage for a device. What has to arrive with it before the figure can be carried to another plant?",
 "The water it was measured on, because a removal is a property of a device and a water together.",
 ["The cut size, since two devices with the same cut size remove the same fraction of any oil.",
  "The sharpness of the grade curve, since 2 and 3 are worth real percentage points of removal.",
  "The position in the train, since a removal quoted at one position transfers to the same position elsewhere."],
 "The same walnut shell filter honestly reports 14.382082 percent in one position and 60.582215 percent in another.")

# --- the medians and the grid (m02), digest section 15 ---

q(1, "The published bin grid group carries one row at d50 12 and sigma 0.9 among rows at d50 30 and sigma 0.7. What does that row add?",
 "It shows the median identity holding at another median and another spread, rather than only at the one the rest of the group uses.",
 ["It shows the truncated tail moving with the sigma of the distribution, which the rows carrying a sigma of 0.7 cannot show on their own.",
  "It shows the grid refusing a distribution too narrow to describe on 60 bins.",
  "It shows the interpolation working where the median falls inside the coarsest bin."],
 "The median column reproduces the stated d50 on every row of the group: 30.000000, 30.000000, 12.000000, 30.000000 and 30.000000.")

q(2, "At the tightest row of the cut sweep the module reports 43.150877 ppm and an outlet median of 2.179329 micron. What are those two figures doing together?",
 "Falling together, which is the property the whole sweep is asserted on and the one a quantised median cannot have.",
 ["Disagreeing, since the concentration has fallen much further than the median, which is the binning error.",
  "Converging, since at a tight enough cut both columns approach the floor the module reports for dust.",
  "Crossing, since below a cut of 3 micron the median stops tracking the cut size and the outlet concentration carries the whole answer alone."],
 "The medians fall monotonically as the cut tightens, and a jest test asserts it.")

q(0, "Which of the module's identities is the one a bin set has to satisfy before anything measured on it can be trusted?",
 "The volume median of a log-normal bin set equals its own d50.",
 ["The grade efficiency at the cut size is exactly one, since a cut size removes everything above it.",
  "The flotation cell count moves the cut size in proportion to the total gas fed to the unit.",
  "A plate pack cut is proportional to the channel height the pack is sliced into."],
 "On the UZERE inlet it returns 26.000000 micron against a typed 26, on every grid in the digest.")

q(1, "Two rows of the published grid group differ in nothing but their bin count, one at 60 and one at 30. What is identical across them, and what does that pin?",
 "Both the median at 30.000000 micron and the truncated tail at 0.000063342484, which pins the bin count as moving neither of them.",
 ["Only the median, the tail being the quantity the bin count is there to move.",
  "Only the tail, the median being interpolated and so free to move with the bin edges.",
  "Neither, since halving the bin count halves the resolution and both figures respond to it."],
 "Resolution decides how finely volume is apportioned inside the covered range. It does nothing about what lies outside it.")

q(3, "A jest test is pointed at the outlet median column of the cut size sweep. What exactly does it assert?",
 "That the figures fall monotonically as the cut tightens.",
 ["That each figure sits inside one bin of the one before it, which is the resolution the grid was asked for.",
  "That the first figure reproduces the typed d50 of the inlet distribution to within the print precision.",
  "That the column and the outlet concentration column fall in the same proportion at every row."],
 "A quantised median shows up as a flat run in a column that should be strictly falling, which is a defect no spot check at one condition can see.")

q(2, "Two of this module's declared constants are floors on the droplet grid. What are they?",
 "minNBins at 10, the fewest bins the distribution will be described on, and minSpanSigma at 3, the fewest sigma either side of the median the grid must span.",
 ["defaultNBins at 60 and defaultSpanSigma at 4, which are the floors as well as the defaults.",
  "minNBins at 30, which is the smallest bin count in the published grid group, and minSpanSigma at 4.",
  "sigmaMax at 2 and tdsMaxPpm at 300000, the two figures that bound a distribution this module will describe."],
 "Both sit in the frozen constants object with the rest of this module's choices, so a reader can find the figure the grid is held to rather than infer it.")

q(0, "The reported truncated tail is taken over twice the module's own cdf at the lower span edge. What must that ratio come out at?",
 "One.",
 ["Zero, since the normalisation has already absorbed the tail out of the bins.",
  "The truncated tail itself, since the cdf below the span edge is one half of it.",
  "The bin count, since the tail is apportioned across the bins the grid carries."],
 "It comes out at that value on every bin count swept, so what the bins failed to cover and what the analytic distribution puts beyond the span edges are the same quantity.")

# --- not answering (m03), digest section 16 ---

q(1, "How many names does this module export, how many are callable, and what are the rest?",
 "20 exported names, 16 of them callable, and 4 frozen objects or strings.",
 ["16 exported names, 13 of them callable, and 3 leaves that answer with a bare number.",
  "20 exported names, all of them callable, and 4 that carry no error contract.",
  "13 exported names carrying the error contract, plus 3 leaves and 4 frozen objects."],
 "Of the callable ones, 13 carry the error contract and 3 are LEAVES that answer with a bare number and say they have no answer with a bare NaN.")

q(3, "A plate pack is called with no water viscosity at all. What comes back?",
 "A refusal saying a plate pack needs the water viscosity in Pa.s to size its cut, and this is undefined.",
 ["A cut size computed at the module's own default water viscosity, carrying a warning that names the substitution it made.",
  "A bare NaN, since the viscosity enters through a leaf and a leaf has nowhere to put an error.",
  "A withheld verdict, since a stage that cannot be sized has not run and there is then no whole train left to give a judgement on."],
 "A plate pack needs the viscosity to size its cut, so the module names the input it wanted and the unit it wanted it in.")

q(2, "An API gravity of -131.5 is passed in, which is the value where the specific gravity denominator goes to zero. What does the module say?",
 "That it holds API gravity to 5 to 100 degrees and this is -131.5.",
 ["That the specific gravity denominator is zero at this value, so the crude density has no answer.",
  "That the oil must be lighter than the water for it to rise, which it cannot be at this gravity.",
  "That the crude density fit is stated from 0 to 100 C and this call falls outside it."],
 "It refuses on its stated band rather than on the arithmetic, and it names the value it was given. 100.1 API is refused by the same sentence from the other end.")

q(0, "The train with the plate area box cleared still reports 707.618822 ppm and 60.687843 percent. What are those two figures taken over?",
 "The 2 of 3 stages that actually ran.",
 ["The whole three stage train, with the plate pack contributing nothing to either figure.",
  "The stage that did not run, which is why they are reported beside its name and its cause.",
  "The two stages that ran, with the verdict then taken over the same two."],
 "The train is reported as complete no, with the skipped stage named in its own list, so the two figures can be read for what they are.")

q(1, "Every warning in this module names a quantity and a threshold. What does that let a reader do?",
 "Disagree with it, because the figure the module judged against is on the screen beside the answer.",
 ["Recompute the answer without the warning, since the threshold is what the figure was scaled by.",
  "Decide whether the run should be reported at all, since a warned figure is provisional.",
  "Locate the case in the golden file, since every threshold in the module is straddled by published rows."],
 "A threshold a reader cannot find is a threshold nobody reviews, which is why the module puts the figure it judged against into the sentence.")

q(2, "Nothing is typed into the specification box, and the train itself runs all the way through. What comes back?",
 "Every concentration it computed, with meetsSpec null and the reason that no discharge specification was given.",
 ["Every concentration it computed, with meetsSpec no, since an unmet specification and an absent one are the same case.",
  "A refusal, since a verdict was asked for and the input needed to give one is missing.",
  "Every concentration it computed, with meetsSpec true, since nothing has been failed."],
 "This module states no discharge limit of its own and has none to fall back on. The specification is the caller's, out of the caller's own permit or regulation.")

q(3, "A leaf could return a plausible number instead of a NaN when it has no answer. Why is that the dangerous option?",
 "A plausible number propagates silently through everything downstream and arrives at a reader looking exactly like a result.",
 ["A plausible number is a great deal harder to test for than a NaN is, so every one of the callers above it would need more code.",
  "A plausible number would make the leaf disagree with the device sitting above it, and the two halves of any one module have to agree.",
  "A plausible number cannot be distinguished from the module's own defaults, which are also plausible."],
 "A leaf has two honest options and one dishonest one. It can give the right answer, it can say it has none, or it can return something that looks like one.")

# --- the band and the balance (m04), digest sections 5, 18 and 19 ---

q(0, "The creeping flow band is not checked once for the water. What does every device in this module report and warn on?",
 "The Reynolds number of its OWN cut droplet, so a cut size that has landed outside creeping flow says so on the same return that carries it.",
 ["The Reynolds number of the median droplet in its inlet distribution, which is the droplet the grid is built around.",
  "The ratio of its Stokes velocity to its full drag balance velocity, which is the gap the band is stated on.",
  "The Reynolds number of the coarsest droplet on its grid, which is the first one to leave the band."],
 "A coarse basin on a light oil is exactly where this bites. The cut droplet is large, its Reynolds number climbs, and the number on the screen is the one the warning is about.")

q(1, "What does the golden file's rise group pin, across its 5 rows?",
 "Stokes, its Reynolds number, and the measured gap to the real drag balance.",
 ["The full drag balance at bubble Reynolds numbers below one, where Stokes and the balance agree.",
  "The basin cut sizes, with the velocity warning expected true on every row that carries it.",
  "The binned quadrature against a finer quadrature."],
 "One published row across the basin, plate and rise groups sits OUTSIDE the creeping flow band on purpose, because a gate that only ever sees cases inside a band cannot tell that the band is being policed.")

q(2, "The golden's cdf group runs 7 rows. What is it checked against, and on what tolerance?",
 "The C library's own erf, on an absolute tolerance that is the series own published accuracy.",
 ["The module's own log-normal bin set, taken on the tolerance that the median identity is asserted to.",
  "A Monte Carlo of the same series, on a tolerance the sample count is chosen to reach.",
  "The truncated tail at each of the spans, taken on the tolerance that the tail identity is asserted to."],
 "A tolerance chosen after the fact is not a test. This one is the accuracy the series itself is published to.")

q(3, "How large is the golden file this course prints from?",
 "14 groups and 77 rows.",
 ["14 groups and 60 rows, one row for every bin on the module's own default droplet grid.",
  "14 groups and 78 rows, one row for each test in the vendored jest suite.",
  "6 groups and 77 rows, one group for each family the measured gap table reports."],
 "Every one of those groups pins something different, from the error function series against the C library to the whole train by particle tracking.")

q(0, "At least one row per device in that file states NONE of that device's own defaults. Why is that a rule rather than an accident?",
 "Because a suite whose every case runs at the defaults cannot tell a default from a derivation.",
 ["Because a row at the defaults would duplicate the row the digest already prints for that device.",
  "Because the defaults are pinned by literal in the jest suite, so a case running at them checks nothing new.",
  "Because a golden row has to straddle a threshold, and no default sits on a threshold."],
 "A golden file has to be built to that rule. A case that runs at the defaults lets the code recall rather than compute.")

q(1, "Every row of the mediaFilterFloor group, refused and answering alike, carries an areaAtFloorM2 of 3.600000 m2. What is that number?",
 "The bed that would run that flow at the floor, so a reader who wanted an answer below it is told what to change and by how much.",
 ["The smallest bed in the group, which is the one row where the module still answers.",
  "The area at which the filter coefficient equals the value declared at 10 m/hr.",
  "The bed area the golden expects, against which the engine's own area is compared."],
 "The refusal names four things and each is doing work: the loading it was given, the floor it is under, the reference loading the coefficient is declared at, and the bed that would reach the floor.")

q(2, "How does the oracle reach the filter cut size, and why is that not a restatement of what the engine does?",
 "It marches the bed layer by layer and bisects out the droplet whose marched removal is exactly one half, where the engine inverts the penetration law in closed form.",
 ["It integrates the grade curve over the droplet distribution and reads the cut off the removal.",
  "It re-derives the filter coefficient from the reference triple and compares the two coefficients.",
  "It tracks 400000 droplets through the bed and counts the half that fails to come out."],
 "The cut size the train reads is an inversion of the depth filtration the oracle marches layer by layer.")

# --- what a gate can catch (m05), digest sections 18, 19 and 22 ---

q(3, "Six of the eight defects planted in the engine and the oracle at once are caught by an explicit pin and by nothing else. What is that a statement about?",
 "How much of this module a pin is carrying, given that a pin records only that a chosen value has not moved.",
 ["How well the identities cover the module, since they catch the other two of the eight.",
  "How independent of the engine the oracle really is, given that a pin is the strongest check a golden file can carry.",
  "How many of the declared constants turn up in the published cases at all, which is the one place where a pin is able to fail."],
 "A pin cannot fail for being wrong, only for having changed. Both the code and the test say so.")

q(0, "How does the oracle reach the hydrocyclone cut, and what does it add on top of that route?",
 "It marches the radial migration with the field re-derived through the TANGENTIAL VELOCITY rather than the flow ratio, and adds a Monte Carlo over starting radii uniform by area.",
 ["It marches the radial migration using the same turndown the engine uses, and adds a sweep of the liner count.",
  "It bisects on the droplet that just reaches the wall in the residence time, and adds a check of the shear penalty.",
  "It integrates the grade curve at the reported cut size, and adds the captured fraction at twice the cut."],
 "The engine computes the field from the flow through one liner over its design flow. The oracle gets there another way, which is what makes the agreement mean anything.")

q(1, "The plate route in the oracle marches two different channel heights and asserts something about the two answers. What, and why does it matter?",
 "That a plate pack cut does not depend on how the pack is sliced into channels, which is a property of the pack rather than of how it was drawn.",
 ["That the two heights bracket the true cut size, so the answer can be bisected between them.",
  "That the cut size scales with the channel height, which is how the plate count enters the answer.",
  "That the pack efficiency factor of 0.7 is recovered from the ratio of the two answers."],
 "The golden carries it as `channelHeightIndependence`, a column on the plate rows rather than a sentence about them. That column is the proof rather than the claim.")

q(2, "A gate that restates the formula the engine uses validates nothing. What has to be true of an oracle instead?",
 "It has to reach every answer BY A DIFFERENT METHOD, so that the difference between the routes is what the agreement is worth.",
 ["It has to be written by somebody other than the author of the engine.",
  "It has to be run at a very much tighter tolerance than the engine is, so that any disagreement between the two is the engine's own.",
  "It has to cover every one of the published cases in the golden file, so that no answer the engine gives goes unchecked."],
 "The engine inverts a balance and the oracle marches a droplet and asks when it arrives. The two share the geometry and the fluid properties and nothing else.")

q(0, "Digest Section 22 is history. What does it say about where repair history belongs in this course?",
 "In that section, framed, or nowhere, because a number from the old model meets a reader without the frame and simply tells them something false about how this engine works.",
 ["In any lesson that teaches the repaired behaviour, so that a reader can see the before and the after together.",
  "In the panels, where a reader can drive the old model and the new one side by side.",
  "In the golden file, which carries the old answers as expectation fields the suite asserts against."],
 "Every figure in every section above that one is the repaired engine's own answer at the inputs named beside it.")

q(3, "Section 22 records what the studio's own shipped default did before the first repair. What was it?",
 "It ran its liners at 7.7 times their design flow.",
 ["It ran its bed at 7.7 times the loading rate the filter coefficient is declared at.",
  "It ran a cell at 7.7 times the gas to water ratio the module now holds a cell to.",
  "It ran a basin at 7.7 times the horizontal velocity the API 421 check allows."],
 "That is the state a studio was shipped in, and it is why Section 22 exists as framed history rather than as an anecdote.")

q(1, "Why do the identities survive a compromised oracle where the published comparisons do not?",
 "An identity is checked against the definition rather than against another program, so it does not care what the oracle says.",
 ["An identity is asserted at a tighter tolerance, so a bend big enough to matter cannot hide inside it.",
  "An identity is checked on the engine and the oracle separately, so a bend in one shows as a disagreement.",
  "An identity is regenerated with the golden, so a bent oracle writes an identity that fails on its own terms."],
 "If somebody bends the engine and bends the oracle to match, the golden regenerates and agrees perfectly. The identity does not move.")

# --- where the method stops (m06), digest sections 17 and 2 ---

q(2, "Of the six things held for literature, one is also something else. Which, and what else is it?",
 "The attachment efficiency, which is held AND is the one calibration in this module.",
 ["The dissolved oil floor, which is held and is also reported on every train return as a value.",
  "The filter grain exponent, which is held and is also the one exponent this module exports as a declared constant.",
  "The second half of the API 421 velocity rule, which is held and is also declared as a limit."],
 "Its value was chosen so that a cell at the module's own defaults cuts in the range induced gas flotation is customarily credited with, and nothing here presents it as published.")

q(0, "What does this module do in place of guessing a value it has no publication for?",
 "It states the ABSENCE, which is the honest form and is also the harder one to write.",
 ["It carries the customary value and marks it as unvalidated in the frozen constants object.",
  "It refuses every call that would have needed the number.",
  "It reports the answer with the missing number set to one, so the reader can scale it themselves."],
 "Held means the repository carries no publication for the number, and no gate pretends to validate it.")

q(1, "plateEfficiencyFactor is 0.7. What is it, and what kind of number is it?",
 "The fraction of a plate pack's projected area that actually settles, and it is DECLARED with no source in this repository.",
 ["The fraction of the plate count that is effective at the pack's own design rate, and it is a figure derived from the geometry of the pack.",
  "The efficiency of the pack at its own cut size, and it is an identity, since a cut size removes half the volume.",
  "The share of the plan area that the plates project onto, and it is a figure calibrated against the published plate pack cases."],
 "It is one of the shape and scale constants held for literature, pinned by literal in the jest suite rather than validated.")

q(3, "Standard gravity comes out of this module at 9.806650 m/s2. How was that figure obtained?",
 "It was MEASURED out of the engine: eighteen times the viscosity times the rise velocity, over the diameter squared times the density difference.",
 ["It was read off the frozen constants object, where it is declared with the rest of the fit coefficients.",
  "It was taken from the oracle, which types it out in full as part of the force balance it solves.",
  "It was fitted from the published rise rows, which straddle the creeping flow band on both sides."],
 "It is a property of the planet rather than a choice this module made, and the arithmetic that recovers it is stated beside the figure.")

q(2, "The half-area radius of a round liner comes out at 0.707106781187 of the radius. What is it, and why does the module treat it as a criterion?",
 "It is one over the root of two, the radius at which half the flow area lies inside, so it is where the MEDIAN droplet enters, and the module refuses an oil core wider than it.",
 ["It is the radius at which the centrifugal field equals the field at the wall, so it sets the travel.",
  "It is a declared constant, chosen so that the median droplet has a stated distance to cross.",
  "It is the fraction of the bore the oil core occupies, which is a declared choice in this module."],
 "Past one over the root of two the core is OUTSIDE the half-area radius, so the median droplet starts inside the core and there is nothing for it to cross.")

q(0, "The filter coefficient at the reported cut size, times the bed depth, comes to 0.693147180560. What does that say about how a cut size is defined here?",
 "Both interception devices define the cut as the droplet where HALF the volume goes, and half survives an exponential at the log of two.",
 ["Both interception devices define the cut at the reference droplet of 20 micron, where the coefficient is declared.",
  "The bed defines its cut by the depth at which the penetration reaches the declared coefficient of 3.5 per m.",
  "The bed defines its cut as the droplet whose filter coefficient equals the log of two, whatever the depth."],
 "It is measured out of the bed rather than typed: the three reported quantities multiplied. A cut size is where half the volume goes.")

q(1, "What does this module say about a discharge limit of its own?",
 "That it states none, and a test asserts that its declared constants carry no specification-like key at all.",
 ["That it carries one for a complete train and withholds it for a partial one.",
  "That it holds one inside the frozen constants object and then applies it only when a caller has asked for a verdict.",
  "That it takes the customary figure for the industry and reports the margin against it on every train return."],
 "A specification is the caller's own, out of the caller's own permit or regulation. Anyone quoting a figure from the verdict block as a limit has quoted an example.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/advanced/fc7a_exam.json', expect_n=42)
finish()
