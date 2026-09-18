import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Professional tier exam, 42 questions over digest Sections 8 to 14 and 21.
# Written so that no question restates a module bank question: the angles are
# new even where the table is the same one. No discharge limit is asserted
# anywhere, and no held or calibrated figure is graded.

# --- Section 8, grade efficiency ---

q(0, "Applying a device to a water produces two separate results in this module. What are they?",
 "The removal, which is the grade curve integrated against the inlet distribution, and the outlet distribution, which is what survived it renormalised.",
 ["The cut size, which the geometry produces, and the removal, which the grade curve produces from it.",
  "The removal and the Reynolds number of the cut droplet, which together say whether the answer is honest.",
  "The outlet concentration and the outlet median, which the module reports in place of any removal at all."],
 "The second one is the one a reader forgets, and it is what makes a train behave the way a train behaves. Without it a device could not be put in front of another device at all.")

q(2, "At a reduced size of 0.5 the sharpness of 2 gives 0.200000000000 and the sharpness of 3 gives 0.111111111111. What has happened between the two columns?",
 "The sharper curve has fallen further below the half point, because it separates more decisively either side of the cut.",
 ["The sharper curve has moved its half point above a reduced size of one, which is what sharpening means.",
  "The two curves have crossed, which they do once on each side of the cut size in this family.",
  "The sharper curve has lost removal it makes up nowhere, since both curves pass through the same points."],
 "Half of the cut size is below the cut, so this is the fine side. The same pair of columns at twice the cut size runs the other way, 0.888888888889 against 0.800000000000.")

q(1, "A device on this water reports a removal of 44.236922 percent. Which cut size was it given?",
 "30 micron, and the outlet median on that row is 16.943389 micron.",
 ["20 micron, and the outlet median on that row is 14.126621 micron.",
  "6 micron, and the outlet median on that row is 7.691060 micron.",
  "30 micron, and the outlet median stays at the inlet median because so little was removed."],
 "It is the coarsest cut in that sweep and the smallest removal in it. Even there the outlet median has moved, because the device took coarse oil preferentially however little of it there was.")

q(3, "Place the sharpness of 2 in the four kinds of number this module deals in.",
 "DERIVED, because it follows from interception capture and there is nothing left to check once that is said.",
 ["DECLARED, because it sits in the same frozen object as the sharpness of 3 and was chosen the same way.",
  "A CALIBRATION, because it was set so that a bed and a cell cut where such devices are customarily credited.",
  "HELD FOR LITERATURE, because no published grade curve for a flotation cell exists in this repository."],
 "A reader who can place a figure in the right one of the four kinds has the most useful thing this course teaches. The sharpness of 3 beside it in the same column of the same table is DECLARED.")

q(2, "A device return carries `outletNormalised` as no. What does that tell a reader?",
 "That the surviving volume was too small to describe as a distribution, so no outlet droplet median comes back.",
 ["That the caller supplied bins without edges, so the module could not place a median inside them.",
  "That the outlet is reported on the inlet grid rather than on a grid renormalised to the survivors.",
  "That the device removed nothing measurable, so the outlet and the inlet distributions are the same."],
 "The concentration still comes back. The shape of what is left does not, because renormalising a volume of the order of 9.618e-13 produces a median with a confident look and no content.")

q(0, "The published train rows are written by an oracle that fires 400000 droplets through every stage with no binning anywhere. Why does that matter to this tier?",
 "Because it checks the binned quadrature under every removal figure by a route that has no bins in it.",
 ["Because it produces the cut sizes the engine reports, so the engine is a lookup over the oracle's results.",
  "Because it is the only route by which the outlet droplet median can be computed at all.",
  "Because it fixes the bin count and the span the module then reports back on every return."],
 "Each droplet carries its own surviving weight through every stage. An agreement between two routes that share no arithmetic is worth something, where an agreement between two copies of one routine is worth nothing.")

# --- Section 9, the hydrocyclone ---

q(1, "Which liner inputs reach the FIELD, and which reach the TRAVEL?",
 "The field is reached by the turndown alone, and the travel by the bore and the declared core position.",
 ["The field is reached by the bore and the turndown, and the travel by the core position alone.",
  "The field is reached by the bore and the length of the liner, and the travel by the turndown together with the core position.",
  "Both are reached by all four, which is why a liner count moves every term in the answer at once."],
 "Separating the two is what makes the bore sweep readable. Nothing about the shape of the tube enters the field, so widening it is a race between the residence time and the distance and nothing else.")

q(3, "The KOKORI liner residence of 0.975987 s is a ratio of which two quantities?",
 "The liner volume and the flow through that one liner.",
 ["The liner length and the axial velocity down the tube.",
  "The travel to the core and the migration velocity at the cut.",
  "The bank volume and the flow arriving at the whole vessel."],
 "It is the simplest quantity in the module and nothing else enters it. The travel over the migration velocity happens to give the same number, and that identity is how the cut was found rather than how the residence was.")

q(2, "Two liners differ only in bore, one at 0.02 m and one at 0.06 m, at the same length and the same flow each. Which cuts finer?",
 "The 0.06 m bore, at 3.383995 micron against 5.861251 micron.",
 ["The 0.02 m bore, at 3.383995 micron, because the droplet has less distance to cross.",
  "Neither, because the bore reaches the answer only through the field and the field has not moved.",
  "The 0.02 m bore, because the travel falls linearly while the residence falls only as a square root."],
 "Count the powers rather than arguing from the picture. Volume goes with the square of a diameter and a radial gap goes with the first power, so the wider tube is ahead by one and the answer is settled at every bore rather than only at these two.")

q(0, "What does the constant 0.828906 column beside the bore sweep establish?",
 "That the exponent relating the cut to the bore is exactly one half, so the direction can never turn over.",
 ["That the five rows of the sweep were all computed at one single turndown, which is what holds the field column still across them.",
  "That the module's declared bore of 0.035 m is the optimum, since the column is normalised there.",
  "That the cut and the bore are inversely proportional to one another, so that doubling the bore of a liner would halve the cut size it reports."],
 "An exact exponent is a much stronger thing to know than a trend across five sampled points. It rules out every bore the sweep did not visit, which no amount of extra rows could do on its own.")

q(3, "Why does no bore in that sweep change the reported field of 1322.687929 g?",
 "Because the field follows the turndown, which is a flow divided by a flow and carries no length at all.",
 ["Because the sweep was run at the ceiling, where the field is held whatever else moves.",
  "Because the bore enters the tangential velocity and enters the radius as well, in a way that cancels the two contributions exactly.",
  "Because the field is DECLARED at exactly that value for the KOKORI bank, and the module does not recompute it from row to row of a sweep."],
 "That is what makes the bore sweep a clean experiment. One column is held by construction rather than by coincidence, so the movement in the cut column has only two possible sources.")

q(1, "Which end of the cut droplet's radial journey is a DECLARED choice with no published source here, and what does typing 0.2 there do?",
 "The oil core position, and at 0.2 the travel becomes 0.008874368671 m and the cut becomes 6.933042 micron.",
 ["The half-area radius, and at 0.2 the travel becomes 0.008874368671 m and the cut becomes 2.326580 micron.",
  "The oil core position, and at 0.2 the module refuses, because the core must lie inside the half-area radius.",
  "The half-area radius, and at 0.2 nothing moves at all, since that radius is derived rather than stored."],
 "Pulling the core in towards the axis lengthens the gap the median droplet has to make in the same residence time, so the liner appears to catch coarser oil. A reader moving that input is moving a modelling assumption about where oil gathers in a spinning tube.")

q(2, "The half-area radius is described as a criterion rather than a constant. What is the difference?",
 "It is where the median droplet is by construction, so the module derives it rather than storing it as a choice.",
 ["It is checked against the published rows rather than declared, which is what makes it a criterion.",
  "It is the value a caller may override, where a constant is frozen in the exported object.",
  "It is stated to a band rather than to a value, which is why the refusal quotes 0.7071 rather than an exact figure."],
 "Equal areas of the inlet carry equal volumes of water and so equal volumes of oil. That fixes the starting radius of the median droplet at one over the root of two whatever else about the liner changes.")

# --- Section 10, the envelope ---

q(0, "The KOKORI bank of 200 liners runs at a turndown of 1.150082. Where in the operating envelope does that sit?",
 "Above the design point and below the top of the envelope, so no penalty and no warning apply.",
 ["Above the top of the operating envelope, which is why the reported field has already reached its ceiling there.",
  "Below the starved edge of the envelope, which is why the module advises shutting liners in on a bank like that one.",
  "Exactly at the design point, which is what a turndown a hair above one is defined to mean for a bank of this kind."],
 "The declared edges are 0.5 at the bottom, 1.3 at the top and 2 past which the module stops answering. Inside that band the field rises as the square of the turndown and the reported cut is the ideal cut.")

q(2, "Going from 230 liners to 177 on the KOKORI flow, what does the field column do?",
 "It rises from 1000.142101 g to 1688.771335 g, still under the ceiling.",
 ["It rises from 1000.142101 g to 1690.000000 g, which is where the ceiling caught it.",
  "It falls from 1688.771335 g to 1000.142101 g, because fewer liners is less total energy into the swirl.",
  "It holds, because the field is fixed by the declared 1000 g at the design flow of one liner."],
 "Fewer liners means each one carries more flow, and the field goes as the square of that. The 177 liner row is the last one under the ceiling and it carries the finest cut in the sweep.")

q(1, "At 150 liners the module reports a shear penalty of 1.086081, an ideal cut of 4.526119 micron and a reported cut of 4.915730 micron. Why are the two cuts kept as separate fields?",
 "So a reader can see how much of the answer is physics and how much is the price of running the bank too hard.",
 ["So that the caller can choose which of the two figures to use, since the module states no preference at all between them.",
  "So the golden file can pin both, which is what lets the jest suite catch a change to either one.",
  "So the ideal cut can be compared against the oracle, which marches its droplets without any inlet shear in the model at all."],
 "The module did not quietly cap a number and carry on. It kept both figures with the multiplier between them, and the multiplier is the root of the overload because inlet shear breaks droplets finer than they arrived.")

q(3, "A designer reads the CUT MICRON column of the sweep upward from the smallest bank. What do they see?",
 "It improves as liners are added up to 177 and then begins to worsen again towards the starved end.",
 ["It improves without any limit at all as more liners are added, which is the reason the printed table has to stop somewhere.",
  "It worsens the whole way, which is the argument for buying the smallest bank that answers.",
  "It improves to the design point at 230 liners and holds flat above it."],
 "Everything above the turning row is the square law on the field. Everything below it is the ceiling together with the inlet shear penalty. A designer who stopped at any one row would have met only one of those two regimes.")

q(0, "Which of these does the 115 liner refusal NOT put in its sentence?",
 "The cut size the bank would have reported if the module had been willing to answer.",
 ["The flow each of those liners is carrying and the multiple of design flow it represents.",
  "The declared design flow per liner that the figure was judged against.",
  "The liner count that would run this flow at its design point."],
 "It also says why the limit is there: past twice design the pressure drop and the inlet shear decide the answer and this model does not carry them. A refusal that names what to change is worth more than a bare error.")

q(2, "Why does 0.500455 appear on every row of the published cyclone group rather than a different figure per row?",
 "Because each row is marched at its OWN reported cut size, and a cut size is defined as the droplet half of which is captured.",
 ["Because the oracle was run once at the declared bore and its result was recorded onto every row of the group.",
  "Because the golden file stores the engine's own capture fraction, which the module holds fixed by construction.",
  "Because every row in that group happens to sit at the same turndown, so the capture works out the same way."],
 "The oracle fires droplets of that diameter from starting radii spread by area, marches each one and counts how many reach the core. The same figure recurring is the definition holding across five different banks rather than one number copied.")

q(1, "What general habit does this module's sweep teach about any model?",
 "Push the input a user is most tempted to change and check whether the answer has a limit in it.",
 ["Check the declared constants first, because a model with no declared constants has nothing to argue with.",
  "Run the published cases first, since a model that reproduces its goldens has no room left for a defect.",
  "Trust an optimum a model reports whenever the rows either side of it carry warnings."],
 "The habit is portable and needs neither produced water nor this engine. Hand it any model with a result and an input a user will reach for, push that input across the range somebody could plausibly type, and watch the direction.")

# --- Section 11, flotation ---

q(3, "What is the superficial gas velocity of a flotation cell, and over which area is it taken?",
 "The gas rate fed to that cell divided by its plan area, which is the cell volume over the cell depth.",
 ["The total gas fed to the bank divided by the plan area of the whole bank of cells.",
  "The gas rate fed to that cell divided by the cross section a single rising bubble presents to the water around it.",
  "The bubble rise velocity multiplied by the gas holdup of the swarm, which is the flux that swarm carries upward."],
 "On the KOKORI cell the gas per cell is 0.034502451156 m3/s and the plan area is 4.285714 m2, which gives 0.008050571936 m/s. That flux is what the rest of the chain runs on.")

q(0, "A 40 micron bubble in this water reports a holdup of 5.099128681105. What does the module do with a figure like that?",
 "It reports the cut size and warns, because the holdup is far past the declared swarm limit.",
 ["It refuses, because a holdup above one describes a cell with more gas in it than volume.",
  "It clamps the holdup at the declared 0.2 and reports the cut that the clamped value gives.",
  "It reports the cut with no comment, because the swarm limit applies to the gas ratio rather than the holdup."],
 "Every number in this chain assumes bubbles that rise on their own, sweep their own volume of water and carry their own interception efficiency. Pack enough gas in and they merge, they rise faster and they sweep differently.")

q(2, "The cut at a 150 micron bubble is 5.450349 micron and at 300 micron it is 15.415916. What is the ratio of 0.353553 between them?",
 "One over two to the three halves, which is the law the cut follows in the bubble diameter.",
 ["One over two squared, which is how the interception efficiency carries the bubble diameter.",
  "The square root of the holdup ratio between the two rows, which is what the cut is proportional to.",
  "The ratio of the two superficial gas velocities, which the bubble size does not change."],
 "Take the cube out of the rate, take a square root because the cut is one, and the exponent left over is three halves. The 1200 micron row against the 300 micron row is the same statement at a factor of four, where the column reads 8.000000.")

q(1, "The 40 micron bubble rises at a Reynolds number of 0.118487. What does that say about the settling law for it?",
 "That this bubble is inside the creeping flow band the module states Stokes to, unlike the 300 micron induced gas bubble.",
 ["That this bubble is outside the band, since the module states the law to a Reynolds number of 0.1.",
  "That the module will report no rise velocity for it, because it is below the bubble diameter band.",
  "That the full drag balance and Stokes disagree most sharply here, which is why the band is policed."],
 "The Reynolds number climbs much faster than the bubble diameter does, because it carries both the size and the velocity the size produced. The induced gas preset bubble of 300 micron sits at 22.678201, far outside that band.")

q(0, "The published pair straddling the residence threshold is run at one flow, one depth, one gas ratio and one bubble size. What is the ONLY thing that differs between the two rows?",
 "The cell volume, 6.1 m3 against 5.9 m3.",
 ["The cell depth, which is what turns the volume into the plan area the gas rises through.",
  "The gas holdup, 0.063497860502 against 0.065650330350, which is what the warning is judged on.",
  "The residence, which is an input to the cell in this module and not a computed quantity."],
 "The holdups on the two rows do differ, but as a consequence of the volume rather than as a separate input, and both sit under the swarm limit so the residence warning is shown on its own.")

q(3, "Both of those rows report a cut of 74.465948 micron. What would a reader be wrong to conclude?",
 "That the residence warning can be ignored, since the cut size beside it did not move.",
 ["That the cell volume cancels out of the product the cut size is defined by.",
  "That a smaller cell is a shorter residence and a higher gas flux at the same time.",
  "That the warning is a statement about the cell rather than about the cut size beside it."],
 "The warning says the attachment process is being given too little time in a cell too small for the flow. That the cut size does not show it is the reason the warning has to exist as its own field.")

q(1, "What standing does `attachmentEfficiency` have in this module?",
 "It is the one CALIBRATION here, a number with no derivation at all, and it is an input a caller can move.",
 ["It is DECLARED, in the same frozen object as the interception coefficient and the bubble default.",
  "It is DERIVED, because the probability a collision sticks follows from the interception geometry.",
  "It is HELD FOR LITERATURE, so the module states its absence and asks the caller to supply one."],
 "Nothing in this course presents it as published, and no graded answer anywhere in this wave depends on it. A caller with a vendor curve has every right to type their own.")

q(2, "A caller asks for a 5 micron bubble and the module refuses. What band does the refusal name?",
 "20 to 2000 micron, which is the range this attachment model is stated for.",
 ["40 to 1200 micron, which is the span of the bubble sweep the module publishes.",
  "80 to 300 micron, which is the range the two cell presets lie between.",
  "It names no band, because the refusal quotes only the value it was given."],
 "A gas to water ratio of 4 is refused the same way, against a ratio the module holds to 3. Each refusal names the input it was handed and the limit it was judged against.")

# --- Section 13, the bed ---

q(3, "The KOKORI bed runs at a loading of 24.841765 m/hr. What does the module say about that rate?",
 "Nothing, because it is under the 25 m/hr breakthrough loading the module warns above.",
 ["It warns, because the rate is above the 10 m/hr the filter coefficient is declared at.",
  "It warns about breakthrough, because 24.841765 m/hr is inside the band the warning covers.",
  "It refuses, because the loading is more than twice the rate the coefficient has a calibration for."],
 "The declared loading rate and the declared breakthrough loading are two different figures doing two different jobs. The first is where the coefficient is quoted and the second is where the module starts warning.")

q(0, "Quadrupling a bed depth at a fixed area and media moves the cut by what factor, and in which direction?",
 "It gets finer, from 12.939258 micron to 6.469629 micron, which is a factor of two on a factor of four in depth.",
 ["It gets finer by a factor of four, matching the factor of four in the depth exactly.",
  "It gets coarser, because a deeper bed at the same area is a longer contact time and a lower coefficient.",
  "It does not move, because depth enters the penetration and the module reports the cut at the reference depth."],
 "The derived column that holds still across that sweep is what says the exponent is a half. Nothing about the filter coefficient changes, because depth is not one of the three quantities it depends on.")

q(1, "At 1200 micron media the filter coefficient is 0.657965381590 per m and the derived column reads 0.296296. What is that column?",
 "Each coefficient over the one at the module's own 800 micron reference grain.",
 ["Each coefficient over the 3.5 per m the reference triple declares.",
  "Each cut size over the cut size at the reference grain, which runs the other way.",
  "Each coefficient over the one at the finest grain in the sweep, which is where the column is pinned."],
 "It is the CUBE of the grain ratio, which the 8.000000 row and the 0.125000 row show most plainly. Both the number of collectors per unit volume and the interception efficiency of each one depend on the grain.")

q(2, "What is the standing of the reference triple, 3.5 per m at a 20 micron droplet, 800 micron media and 10 m/hr?",
 "It is DECLARED, kept in the frozen constants with no published source in this repository.",
 ["It is DERIVED, because the three reference values follow from the interception law itself.",
  "It is HELD FOR LITERATURE, which is why the module refuses to answer below the loading floor.",
  "It is the one CALIBRATION in this module, which is why no publication stands behind it."],
 "Everything in the loading column is that declared value scaled to a different rate. The one calibration in this module is the attachment efficiency, and a reader arguing with a bed cut size should start with the triple.")

q(0, "Of the beds the section walks down towards the loading floor, which is the widest that still gets an answer, and what does it report?",
 "490 m2, at a loading of 1.013950 m/hr and a cut of 4.112471 micron.",
 ["400 m2, at a loading of 1.242088 m/hr and a cut of 4.326502 micron, with the wider beds all refused.",
  "600 m2, at a loading of 0.828 m/hr and a cut of 4.112471 micron, which is the last row before the floor.",
  "496.835297 m2, which is the bed the refusals name, reported at a loading of 1.013950 m/hr."],
 "The three answering beds are 200, 400 and 490 m2, cutting at 5.145107, 4.326502 and 4.112471 micron. The floor under them is a refusal rather than a warning, because what a bed does far below its design rate is HELD FOR LITERATURE.")

q(3, "A 2000 m2 bed on the same flow is refused. What loading does the refusal quote?",
 "0.248 m/hr, below the 1 m/hr floor, which this module answers at and above.",
 ["0.828 m/hr, which is the loading the 600 m2 bed was refused at.",
  "1.013950 m/hr, which is the loading of the last bed that answers.",
  "2.484176 m/hr, which is the loading a 200 m2 bed would be refused at."],
 "Both refusals carry the same four things: the loading given, the floor, the reference loading the coefficient is declared at, and the bed area that would reach the floor on this flow.")

q(1, "The loading floor refusal says the declared law is already claiming 3.162 times something at the floor. Times what?",
 "The one filter coefficient this module has any calibration for, which is declared at 10 m/hr.",
 ["The cut size the bed would report at its own reference loading of 10 m/hr.",
  "The breakthrough loading of 25 m/hr, which the floor is stated as a fraction of.",
  "The penetration at the reference droplet, which is what the exponential is taken over."],
 "The loading exponent of 0.5 is the only velocity dependence in this model, so dropping from 10 m/hr to 1 m/hr multiplies the coefficient by the root of ten. Extending a one point calibration that far and reporting the result as a cut size is what the module declines to do.")

q(2, "The bed area moves one column of this device and no other. Why is that?",
 "Because the area appears nowhere in the exponential, nowhere in the depth and nowhere in the grain term.",
 ["Because the module computes the loading rate first and then discards the area it came from.",
  "Because the area and the depth enter as a product, which the module reports as the bed volume.",
  "Because the loading rate is the only quantity in the device that the published rows carry."],
 "So the whole effect of buying a wider vessel arrives through one column, which makes this the cleanest input in the device to reason about and the only one with both a warning and a refusal on it.")

# --- Sections 12, 14 and 21, the reading ---

q(0, "The KOKORI water is 0.000531486500 Pa.s and 997.174641 kg/m3 against 857.655928 kg/m3 of oil. What is the quantity every cut size in that train stands on?",
 "The density difference of 139.518714 kg/m3, taken with that viscosity.",
 ["The brine density of 997.174641 kg/m3, which is what the buoyancy is taken against.",
  "The oil density of 857.655928 kg/m3, which is what fixes the droplet rise in every device.",
  "The viscosity alone, since the density difference cancels out of a cut size defined at one half."],
 "The figure is derived, the two densities subtracted. That difference and that viscosity are the Associate tier's half of this course doing its work under every device in the Professional half.")

q(3, "The hydrocyclone stage of the KOKORI train removes 94.903339 percent and leaves 45.869949 ppm. What does it do to the droplet median?",
 "It brings it down from 20.000000 micron to 6.843000 micron, which is the water the next stage sees.",
 ["It leaves it at 20.000000 micron, because a removal is a fraction of the oil and does not reshape it.",
  "It brings it down to 5.557324 micron, which is the median the train reports at its outlet.",
  "It brings it down to 4.430689 micron, because a stage leaves the water at its own cut size."],
 "Read the outlet concentration column and the outlet median column together down that table. The concentration is what a downstream process cares about and the median is what the next device cares about.")

q(2, "The KOKORI train table prints a sharpness of 3 on one row and 2 on the other two. What is the difference in standing between them?",
 "The 3 is DECLARED for the centrifugal device and the 2 is DERIVED for the two interception devices.",
 ["The 3 is DERIVED from the settling balance and the 2 is DECLARED for flotation and filtration.",
  "The 3 is validated against the published cyclone rows and the 2 has no published row anywhere to check it against.",
  "Both are DECLARED, and the module keeps two values only so that the devices can be told apart."],
 "They sit in the same column and they have completely different standing. One came from a frozen constant somebody chose and pinned, and the other came from the interception law.")

q(3, "The invariance across one, two, four and twelve cells is stated at equal total volume and equal total gas. Why must BOTH be held?",
 "Because the volume sets the residence and the gas sets the flux, and moving either would make the comparison a different question.",
 ["Because the module refuses any arrangement in which the two are not held together.",
  "Because the residence time is computed from the gas rate as well as from the volume.",
  "Because the cell count enters the plan area, which carries the volume and the gas equally."],
 "The gas ratio here is applied per cell, so it has to be scaled by the count to keep the total fixed. Hold the ratio instead and the count moves the answer, and it should.")

q(0, "Five identical devices in series report stage removals whose third row is 20.530945 percent and whose derived column reads 0.313934 there. What is that column?",
 "Each stage removal over the first stage's removal.",
 ["Each stage removal over the removal the whole train reports.",
  "Each stage outlet over the inlet concentration the train was given.",
  "Each stage removal over the removal a fixed efficiency device would have given."],
 "The column is derived, each row divided by the topmost one, and by the last row it reads 0.187835. Normalising against the first stage is what turns five raw percentages into a picture of how fast a train runs out of easy oil.")

q(2, "The OGBOTOBO train is run as designed and then reversed. What does the outlet droplet median do?",
 "It is 3.185598 micron both ways, because the survivals in each size bin multiply and a product has no order.",
 ["It moves with the stage order, because the medians are computed stage by stage down the train.",
  "It is 3.185598 micron as designed and finer reversed, because the coarse device then runs last.",
  "It cannot be compared, because the reversed train reports its medians against a different grid."],
 "The outlet concentration is 160.391597 ppm both ways as well, agreeing to 7.09e-16 relative. What does move is every per stage removal, by as much as 57.344778 percentage points.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/intermediate/fc7i_exam.json', label='fc7i_exam', expect_n=42)
finish()
