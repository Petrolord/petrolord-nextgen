import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Professional tier exam, 42 questions across the six modules of the tier.
# Digest sections 1, 2 and 12 to 20, at the rendering those sections print.
# Nothing here reaches the blowdown march, the point source or the audit, which
# are the tier above. Several questions need two modules at once on purpose,
# because an exam is a sample of what the tier taught rather than a recap of it.

# --- m01, where the relief load comes from ----------------------------------

q(1, "Which sentence describes what this engine does with a relieving scenario?",
 "It sizes against whatever load it is handed and never decides which scenario governs.",
 ["It compares the scenarios it is able to compute for itself and sizes against the largest of them.",
  "It refuses any load that does not match the vessel geometry it was given alongside that load.",
  "It sizes against the load and records the scenario name alongside it."],
 "Every sizing route takes a load as an input. The one route that works out a load of its own starts from geometry rather than from a process description.")

q(3, "A relief load is filed without the scenario it was worked out for. What has been lost?",
 "The only thing that would say whether it was a fire rate, a blocked-in rate or a control valve rate.",
 ["The relieving conditions it belongs to, which cannot be recovered from a bare rate afterwards.",
  "The orifice letter it was found to need, which has to be worked out again from the beginning.",
  "Nothing that matters, since the sizing routes take a rate and no route anywhere takes a scenario."],
 "Six months on, the only way to find out which case the figure came from is to do the work again. Nothing on the screen tells one pounds an hour figure from another.")

q(0, "Where in this tier does a standard rate have to become an actual one, and who does it?",
 "Before the drum route is called, and the caller does it.",
 ["Inside the drum route, from the header pressure it is given.",
  "Before the settling route is called, and the caller does it.",
  "Inside the settling route, from the vapour density it derives."],
 "The route is handed a rate at drum conditions and is never told what pressure the header runs at, so it could not convert anything even if it wanted to.")

q(2, "Six facts are stated about the teaching drum. How many of them arrive in a unit the drum route reads?",
 "None, which is why two derivations sit between the statement and the call.",
 ["One, the gas rate of 44.000000 MMscfd, which that route reads directly.",
  "Two, the pressure of 42.000000 psia and the temperature of 160.000000 degF.",
  "Three, the gas gravity, the liquid density and the vapour viscosity of 0.013500 cp."],
 "The route wants a volumetric rate at drum conditions, a settling velocity, a diameter and a level fraction. The vapour density of 0.124385 lb/ft3 and the rate of 212.481739 acfs are worked out on the way.")

q(1, "Why does this course tell a reader not to form a ratio between 44.000000 MMscfd and 212.481739 ft3/s?",
 "Because such a figure would carry a day, a second, a pressure and a temperature at once, and nothing stands behind it.",
 ["Because the two figures are quoted at different precisions, so their quotient could only ever be as good as the coarser of them.",
  "Because the conversion is not linear, so no single ratio describes it.",
  "Because the engine prints that ratio itself and a hand-formed one would disagree with it."],
 "A day and a second, a standard base and a header pressure are all folded into any quotient of those two. Ask whether a quantity is entitled to be compared before comparing it.")

q(3, "Four things in this tier are left to the caller. Which of these is one of them?",
 "The liquid density and the vapour viscosity at drum conditions.",
 ["The segment area fraction behind a stated holdup.",
  "The branch the gas route takes at the relieving pressure.",
  "The margin between a required area and the orifice selected for it."],
 "This module holds no property tables. The other three are figures the engine works out and returns.")

# --- m02, the wetted area ---------------------------------------------------

q(0, "Why does this tier start at the geometry rather than at the duty?",
 "Because the geometry is the one link in the fire chain that carries nothing published.",
 ["Because the geometry is the only link the validation oracle can reach.",
  "Because the duty cannot be computed until a latent heat has been looked up.",
  "Because the geometry is the only link that a level trimmed after the call can still correct."],
 "The duty carries two constants and an exponent, the load carries a latent heat, and the area carries a discharge coefficient. Only the first link can be right beyond argument.")

q(2, "A level of 4.200000 ft on a vessel 12.000000 ft across is 0.350000 of its diameter. What are the two readings at that level?",
 "683.6960 ft2 and 158.3363 ft2, at a ratio of 4.317999814064.",
 ["683.6960 ft2 and 226.1947 ft2, at a printed ratio of 3.750000.",
  "500.7394 ft2 and 90.4779 ft2, at a printed ratio of 5.534386.",
  "1012.7640 ft2 and 294.0531 ft2, at a printed ratio of 3.444154."],
 "The other rows quoted here are real rows of the same sweep at other levels. Reading the wrong row is this tier's commonest way of producing a correct number that answers nothing.")

q(1, "A horizontal vessel is handed a level of ten diameters by mistake. What comes back?",
 "The area at one diameter, because the level is clamped there.",
 ["A refusal, because a level above the diameter cannot be wetted.",
  "An area ten times the area at one diameter.",
  "The area at one diameter, with a note saying the level was clipped."],
 "That clamp is convenient and it is also a hazard. A units slip that inflated the level by a factor of anything at all is invisible in the answer.")

q(3, "Where in the workflow does a level have to be trimmed for the height limit, and why there?",
 "Before the call, because the duty route takes only an area and there is no second chance downstream.",
 ["After the call, by scaling the area down in the ratio of the two heights involved.",
  "Inside the wetted area route, which applies the limit once grade has been stated to it.",
  "At the load step, by scaling the relief load down before the valve is sized against it."],
 "Establish where grade is, work out what liquid height sits below the reachable limit, type that height, then read the area. Whatever level goes in is the level the whole fire case is built on.")

q(2, "The horizontal over vertical ratio column reads 3.750000 at a level fraction of 0.500000 and 3.750000 again at 1.000000. What does the column do between them?",
 "It falls below 3.750000 and then turns and rises back to it.",
 ["It holds at 3.750000 the whole way, since both readings are linear there.",
  "It rises above 3.750000 and then falls back to it.",
  "It falls steadily to 3.303904 and stays there."],
 "The turn is visible in the printed column. Two equal values at the ends of a range say nothing about what happens inside it.")

q(0, "Three of the seven published wetted-area rows are vertical, and each is chosen rather than sampled. What are the three?",
 "A tower wetted above its own diameter, one wetted to the height limit, and an empty vessel.",
 ["A tower wetted to half of its own height, one wetted to the height limit, and an empty vessel.",
  "A tower wetted above its own diameter, one wetted to half of its height, and a full one beside them.",
  "A tower at each of the three diameters the horizontal rows of the same published set use."],
 "Each is an edge some plausible implementation gets wrong, which is a different thing from three points spread across a range.")

q(1, "The oracle behind the wetted-area rows does not evaluate the arc expression the engine uses. What does it do instead?",
 "It sums a polyline round the real circle and extrapolates.",
 ["It integrates the segment area by Simpson quadrature in SI.",
  "It bisects on the force residual until the areas agree.",
  "It evaluates the same arc expression in higher precision."],
 "An oracle restating the engine's own algebra proves the arithmetic and nothing about the geometry. The Simpson quadrature belongs to the drum's vapour area.")

# --- m03, the pool fire duty -------------------------------------------------

q(3, "Which two inputs to the pool fire duty are credits, and how do they differ in kind?",
 "The drainage answer, which is a boolean switching the constant, and the environment factor, which multiplies the duty.",
 ["The drainage answer and the latent heat, one a boolean and the other a property.",
  "The environment factor and the exponent, one typed by the caller and the other published.",
  "The drainage answer and the wetted area, one a boolean and the other geometry."],
 "Both are credits for a plant provision that makes the fire less severe, and claiming both where neither has been confirmed compounds two optimistic judgments into one duty.")

q(2, "What would a set of published fire rows at a single drainage answer fail to catch?",
 "A module that used the wrong constant on the branch the set never exercises.",
 ["A module whose exponent was wrong, since the exponent only shows across two drainage answers.",
  "A module that applied the environment factor to the load rather than to the duty.",
  "A module whose duty was right and whose unit packaging was wrong."],
 "The two rows at 628.3000 ft2 differ only in that answer, which is what makes the pair able to fail.")

q(0, "The duty per ft2 at 100.0000 ft2 is 9166.8325 Btu/hr and at 1000.0000 ft2 it is 6056.4662 Btu/hr. What produced that fall?",
 "The exponent of 0.820000000000 sitting below one.",
 ["The drainage constant switching between the two rows of the sweep.",
  "The environment factor falling as the area rises through the sweep.",
  "The wetted height limit truncating the larger of the two areas."],
 "Those two areas are also the pair the exponent was measured from, by the log ratio of their duties over the log ratio of the areas.")

q(1, "A reader concludes from the duty sweep that one very large vessel and several small ones with the same total shell are the same fire problem. What is wrong with that?",
 "Duty per square foot falls with size, so the large vessel absorbs less per square foot than the small ones do.",
 ["Nothing, since the relation is a function of total wetted area alone.",
  "Duty per square foot rises with size, so the large vessel absorbs more per square foot.",
  "The relation cannot be applied to more than one vessel at a time, so neither of the two figures being compared exists at all."],
 "The per-square-foot column is printed for exactly this reading. The exponent packages a fire's geometry into one number and that is the consequence of it.")

q(3, "Somebody claims the oracle behind the pool fire duty validates the pool fire model. What is the honest correction?",
 "It checks the unit packaging between the published USC pair and the published SI pair, and never leaves that pair.",
 ["It checks the duty against an independent radiation model derived in SI.",
  "It checks the exponent by fitting the duty sweep, which is a genuinely separate derivation.",
  "It checks nothing at all, which is why the constants are held for literature."],
 "A check that cannot reach the model has to say so. This one does, and the practical consequence is that nothing graded in this course reads a fire duty or a fire relief load.")

q(0, "Which figures move and which stay still when the latent heat is walked at a fixed duty?",
 "The load moves and the duty does not, because the latent heat enters after the duty is finished.",
 ["Both move, because the latent heat is an input to the duty and to the load.",
  "The duty moves and the load does not, because the load is fixed by the wetted area the chain started from.",
  "Neither of them moves until the latent heat crosses 50.000000000000 Btu/lb, which is where the warning fires."],
 "A smaller latent heat gives a larger load, and the growth accelerates as the divisor shrinks. At 300.000000 Btu/lb the load is 14780.3842 lb/hr and at 30.000000 Btu/lb it is 147803.8420 lb/hr.")

q(2, "Why does the engine warn rather than refuse below a latent heat of 50.000000000000 Btu/lb?",
 "Because the load is still the best available screening estimate and near-critical relief has to be sized somehow.",
 ["Because the warning fires on a bisected edge and a refusal would need an exact one.",
  "Because the load is still exact there and only the duty has become questionable.",
  "Because a refusal would leave the fire chain with no load, and the chain has no other source."],
 "Near-critical relief has to be sized somehow, and the standards acknowledge the method is breaking down there rather than forbidding it. What the warning adds is that the relation is outside the range where it can be trusted alone.")

# --- m04, the fire case end to end -------------------------------------------

q(1, "Thirteen figures are stated for the teaching fire case. What does that count say about the calculation?",
 "That a fire case is thirteen decisions followed by arithmetic.",
 ["That a fire case needs more inputs than any other route in the module.",
  "That four of the thirteen describe steel and the rest are properties.",
  "That thirteen is the number of fields the studio refuses to default."],
 "Four describe steel, two are credits, one is a property, and six describe the valve's pressures and the relieving gas. Everything after them is arithmetic the engine does for itself.")

q(3, "The relieving pressure of 347.450000 psia is built from three things. Which three?",
 "The set pressure of 275.000000 psig, the overpressure of 21.000000 percent, and the measured atmospheric constant.",
 ["The set pressure of 275.000000 psig, the overpressure of 21.000000 percent, and the back pressure at the valve outlet.",
  "The set pressure of 275.000000 psig, the relief load of 34641.5255 lb/hr, and the measured atmospheric constant.",
  "The set pressure of 275.000000 psig, the overpressure of 10.000000 percent, and the measured atmospheric constant."],
 "The same three questions recover that atmospheric constant three different ways, which is how this course knows the whole module shares one atmosphere.")

q(0, "A fire allowance is typed into a process case by mistake. Which way is the valve wrong?",
 "Too small, because the higher relieving pressure needs less flow area.",
 ["Too large, because the higher relieving pressure needs more flow area.",
  "Too small, because the allowance is applied to the relief load as well.",
  "Neither, because the allowance and the load cancel in the area expression."],
 "The number looks entirely ordinary on the screen. A bigger allowance sounds like a concession that ought to cost something and in the sizing arithmetic it buys area back.")

q(2, "Which of these changes leaves the wetted area of the teaching case exactly where it was?",
 "Answering the drainage question false.",
 ["Trimming the liquid level to 2.0 ft before the call.",
  "Reading the same vessel standing up instead.",
  "Raising the liquid level to 8.0 ft instead."],
 "The drainage answer, the environment factor and the latent heat all leave the wetted area at 683.6960 ft2, because none of them is geometry. An input moves only the steps below where it enters.")

q(1, "Two changes in the one-input sweep land the case on orifice G. Which two?",
 "An environment factor of 0.3, and reading the vessel standing up.",
 ["An environment factor of 0.3, and trimming the level to 2.0 ft.",
  "Reading the vessel standing up, and a latent heat of 90 Btu/lb.",
  "Trimming the level to 2.0 ft, and answering the drainage question false."],
 "They reach it by different routes. One leaves the wetted area at 683.6960 ft2 and cuts the duty, and the other cuts the wetted area to 158.3363 ft2 and lets the chain follow.")

q(3, "The stated case and the case at a latent heat of 90 Btu/lb both come back without a warning. Why is that worth saying?",
 "Because most of the risk on that input sits far above the edge, where nothing fires at all.",
 ["Because a warning on the relief load route only fires when the duty beside it is also out of range.",
  "Because the warning for that case was already spent on the drainage answer further up the chain.",
  "Because both of those latent heats sit below the edge, which is where the engine stops warning at all."],
 "A latent heat looked up at the wrong pressure is the commonest way that step goes wrong, and nothing in the return can detect it.")

q(0, "At 21.000000 percent the teaching case needs 1.578271 in2 and at 10.000000 percent it needs 1.728783 in2, and both buy the same valve. What does that show?",
 "That a movement in the required area is invisible in the answer until it crosses a boundary.",
 ["That the selection rounds a required area to the nearest listed area rather than the next one up.",
  "That the overpressure allowance is applied after the letter has already been chosen.",
  "That the two areas fall inside the margin the selection allows before it moves a letter."],
 "Judging how robust a selection is means knowing where the required area sits inside its letter, and the figure that says so is printed beside it.")

# --- m05, the knockout drum --------------------------------------------------

q(2, "A drum is sized by typing an area fraction into the field that wants a level fraction. What does the answer look like?",
 "Entirely normal, because both are fractions between zero and one and the route cannot tell them apart.",
 ["It refuses, because the two conventions disagree above half depth.",
  "It carries a note, because the route returns the segment area fraction it derived.",
  "It is unchanged, because the route converts one convention into the other."],
 "At a fraction of 0.100000 the level reading gives 10.481166 ft and the area reading gives 10.346904 ft. Neither is flagged and only one answers the question asked.")

q(0, "What does the drum route do with the dropout velocity, and why does this course state one rather than compute it?",
 "It takes one as an input, and a computed one would rest on a fit no published case can check.",
 ["It takes one as an input, and a computed one would need a droplet size the exercise does not give.",
  "It computes one from the droplet size, and the course states one only to save arithmetic.",
  "It computes one from the vapour density, and the course states one to keep the units consistent."],
 "A computed velocity would silently inherit an empirical fit that the validation oracle shares with the engine on purpose. A stated one rests on a number a reader can see and defend.")

q(3, "Two engineers size one drum, make no arithmetic error, and produce different lengths. What is the likeliest reason?",
 "They chose different design droplets, and the settling velocity is sensitive to that choice.",
 ["They used different standard bases for the vapour rate, which the drum route has no way of detecting.",
  "One of them read the L over D note the engine returned and went wider on the strength of it.",
  "They used different drag correlations, since the empirical fit arrives as an input to the settling route."],
 "The droplet size is a design decision rather than a measurement, and a flare drum is usually sized in the part of the curve where the drag coefficient moves fastest. The choice belongs in the case record beside the answer.")

q(1, "Why does the loop converge in 3 passes at 5.000000 micron and take 44 at 60.000000 micron?",
 "Because the smaller droplet sits inside the drag cap, where the coefficient is a constant and the balance is explicit.",
 ["Because the smaller droplet has a lower Reynolds number, and the loop converges faster at low Reynolds numbers generally.",
  "Because the larger droplet has not converged, which is what a high pass count reports.",
  "Because the smaller droplet is below the size the correlation covers, so the loop exits at once."],
 "Every row in that sweep converged, including the slowest. A slow convergence is a signal about where on the curve the case sits rather than a sign of trouble.")

q(2, "The drag cap is measured at 240.000000000000 and the Reynolds number just inside it at 0.104182271364. Which figure answers which question?",
 "The first is where the coefficient stops moving, and the second is the Reynolds number at that edge.",
 ["The first is the largest Reynolds number in the sweep, and the second is the coefficient there.",
  "The first is where the coefficient stops moving, and the second is the residual the loop stops at.",
  "The first is the coefficient at the smallest droplet, and the second is the velocity it gives."],
 "Both were measured out of the engine's own behaviour. Below that edge the fit would keep climbing and the cap holds it.")

q(0, "Walking the diameter and walking the holdup behave differently. How?",
 "The diameter is a clean lever and the holdup is not, because the length turns inside the holdup range.",
 ["The holdup is a clean lever and the diameter is not, because the length turns inside the diameter range.",
  "Both are clean levers, since both columns fall the whole way down their sweeps.",
  "Neither is a lever, since the required length is set by the dropout velocity alone."],
 "Push the diameter one way and both the vapour velocity and the required length follow. Fill the drum and two effects move against each other.")

q(3, "Across the whole holdup range the required length runs from 6.997154 ft to 44.344927 ft. What is the spread, and what does printing it do?",
 "37.347773 ft, and printing it means the reader does not have to form a comparison the engine never made.",
 ["37.347773 ft, and printing it licenses any other quotient a reader wants from the same table.",
  "6.997154 ft, since the spread of a non-monotonic column is its smallest value.",
  "44.344927 ft, since the spread is measured from an empty drum."],
 "The spread is computed for the reader, so nobody has to divide one row by another to learn what the input is worth. A quotient assembled off the page is a figure this engine never produced.")

q(1, "The stated teaching drum carries the note about a smaller drum. What does that mean about it?",
 "It works, and a narrower drum would also work for less steel.",
 ["It does not work, and a narrower drum is needed to meet the criterion.",
  "It works, and the note is a refusal the caller is allowed to overrule.",
  "It cannot be judged, since the note fires at both edges of the band."],
 "Its L over D of 0.780770 sits below the lower edge of 2.000000000000. Outside the band the engine offers a judgment rather than a refusal, because a long thin drum or a wide flat one can be exactly what a plot allows.")

# --- m06, the reading, and the cross-module questions ------------------------

q(2, "A required area of 1.578271 in2 and a required length of 7.026927 ft appear on one screen. What is the relation between them?",
 "None, because they answer two unrelated questions about two pieces of equipment.",
 ["The length is the drum the valve of that area discharges into.",
  "The area sizes the valve and the length sizes the drum that passes the same vapour.",
  "The length follows from the area through the vapour rate at header conditions."],
 "Both are required, both are in the answer, and nothing on the screen groups them. Labelling every figure with the half it belongs to is what stops them being mixed.")

q(0, "The exact circular segment turns up twice in this tier. Where, and what does it decide each time?",
 "In the wetted area, where it sets what the fire reaches, and in the drum, where it sets the vapour space and the fall distance.",
 ["In the wetted area, where it sets what the fire reaches, and in the settling balance, where it sets the drag coefficient.",
  "In the drum, where it sets the vapour space, and in the orifice ladder, where it sets the selection boundary.",
  "In the wetted area and in the pool fire duty, which is why the exponent applies to a segment area."],
 "One geometry, two questions. In the drum the same segment decides both how much vapour space there is and how far a droplet has to fall.")

q(3, "Half full on a vessel and half depth in a drum have something in common. What?",
 "Both are the one point where two different expressions agree, so a check made only there proves nothing.",
 ["Both are the level at which the engine switches between two branches.",
  "Both are the only levels the published sets exercise.",
  "Both are levels at which the engine attaches a note to its answer."],
 "At 6.000000 ft the segment area and half the lateral surface agree to a ratio of 1.000000000000. At a fraction of 0.500000 the level and area conventions give 11.039649 ft either way.")

q(1, "One word changes the letter in the fire chain and one convention changes the length in the drum. Which pair is it?",
 "The orientation of the vessel, and whether a stated fraction is a level or an area.",
 ["The drainage answer, and whether a stated velocity is a dropout or a vapour velocity.",
  "The orientation of the vessel, and whether a stated rate is standard or actual.",
  "The environment factor, and whether a stated fraction is a level or an area."],
 "Both are a description that arrives as a number and leaves no trace in the answer. Neither is a calculation error and both produce a figure that is correct for something else.")

q(0, "Two of this tier's boundaries are places where the engine is missing one piece of information. Which two, and what is missing?",
 "The height truncation, which needs the plot elevation, and the rate conversion, which needs the header conditions.",
 ["The height truncation, which needs the latent heat, and the rate conversion, which needs the droplet size.",
  "The governing case, which needs the process description, and the height truncation, which needs the orientation.",
  "The rate conversion, which needs the standard base, and the fluid properties, which need the relieving pressure."],
 "A vessel on a plinth and one in a bunded pit present different amounts of shell within reach, and a header at one pressure carries a different volume from the same standard rate. The module states both gaps.")

q(1, "What does this tier say a learner should be able to do at the end of it?",
 "Say what a stated fraction is a fraction of.",
 ["Say which of the two gas branches a case will take before calling the route.",
  "Say which relieving scenario governs a given vessel.",
  "Say how a required area changes as a step size is refined."],
 "A holdup is a fraction of a diameter, an area fraction is a fraction of a circle, and a level is a fraction of nothing at all until somebody says where grade is.")

q(2, "A relief load in lb/hr and a vapour rate in acfs are the two rates in this tier. What is the relation between them?",
 "There is none here, since the engine is handed the drum rate rather than deriving it from any relief case.",
 ["The load converts to the rate through the vapour density the drum route derives.",
  "The load converts to the rate through the relieving pressure and the molecular weight.",
  "They are the same quantity in two unit systems, which is why only one of them is stated."],
 "Connecting the two on a real plant means a composition and a temperature at header conditions that nothing has given this engine.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/intermediate/fc5i_exam.json', label='fc5i_exam', expect_n=42)
finish()
