import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Associate m02, Velocity, Reynolds and Friction. Digest section 2, with
# the flow area from section 4, across the module's five lessons: the bore as
# an area, the Reynolds number in field units, the laminar branch, Colebrook,
# and the band between the two branches.

q(1, "A bore of 7.981000 in is handed to the engine. What does it become before any physics happens, and what does the conversion need?",
 "A flow area of 0.347410 ft2, which needs the 144 square inches in a square foot because the bore arrives in inches and the area is wanted in square feet.",
 ["A relative roughness of 0.0002255356, which needs the commercial steel roughness of 0.001800 in, since the bore reaches the chain first as a fraction of the wall height rather than as an area at all.",
  "A velocity of 2.244621 ft/s directly, which needs the barrel and the day, because the engine divides the rate by the bore and never forms an area.",
  "A hydraulic diameter in feet, which needs only a division by twelve, and the area then follows from it inside the friction term."],
 "The bore encloses 0.347410 ft2, and a bore twice as wide encloses four times the area. That square is why bore changes move a velocity further than they look as though they should."),

q(3, "The viscosity of the OGBIA crude is walked from 1.000000 cp to 120.000000 cp at the built bore. What does the velocity column do?",
 "It holds at 2.244621 ft/s on every row.",
 ["It falls steadily from 2.244621 ft/s, because a thicker fluid meets more resistance at the wall and the same pressure difference therefore pushes less of it through the same bore each second.",
  "It falls only once the flow goes laminar at 60.000000 cp, because below the branch the velocity profile changes shape and the mean velocity drops away from the value the turbulent rows carried.",
  "It rises slowly, because the friction factor climbs from 0.0185483924 to 0.0634301170 across the walk and a larger friction factor drives a larger velocity head and so a faster stream."],
 "Velocity is the rate over the area and neither of those is the viscosity. Everything downstream of the Reynolds number moves, and the Reynolds number itself falls from 121078.1307 to 1008.9844."),

q(0, "The Reynolds number takes four inputs. Which of them enters the chain at this step and nowhere earlier, and what does that make this step?",
 "The viscosity. The density, the velocity and the bore are all settled before it, so this is where the fluid's character finally reaches the calculation.",
 ["The density, since the velocity step is a rate and a geometry that would return 2.244621 ft/s for water or for crude alike, so the fluid arrives here.",
  "The bore, since the velocity was formed from the rate and the flow area rather than from the bore itself, so 7.981000 in reaches the arithmetic for the first time in this expression.",
  "The velocity, since the caller supplied a rate and 2.244621 ft/s is computed inside the Reynolds step from the rate and the area."],
 "On OGBIA the four are 54.500000 lb/ft3, 2.244621 ft/s, 7.981000 in and 2.500000 cp, giving 48431.2523. The density and the bore both entered earlier."),

q(2, "A viscosity of 2.500000 cp has to be converted before the Reynolds number can use it. What is it converted to, and what does the Reynolds number itself carry as a unit?",
 "To 6.7197000000e-4 lbm per ft per s for one centipoise, and the Reynolds number carries no unit at all, because every unit in it cancels.",
 ["To a kinematic viscosity in ft2 per s by dividing by the density of 54.500000 lb/ft3, and the Reynolds number then carries ft2 per s, which is what lets it be compared against a fixed boundary.",
  "To lbm per ft per s, and the Reynolds number carries that same unit forward, which is why the boundaries are stated for field units.",
  "To centistokes, and the Reynolds number is dimensionless only on the turbulent branch, because the laminar law divides by a numerator of 64.000000 that carries units of its own."],
 "The conversion is measured out of the engine rather than typed in. Being dimensionless is precisely what lets one Reynolds number be compared against fixed boundaries for any fluid in any pipe."),

q(1, "Below a Reynolds number of 2100 the engine uses the laminar law. What does that law contain, and what is it blind to?",
 "The Reynolds number and nothing else. No roughness appears in it, so a coated pipe and a used steel pipe of the same bore return the same friction factor.",
 ["The Reynolds number and the relative roughness, as the turbulent law does, but with the roughness term multiplied by a numerator of 64.000000 that damps the wall's contribution to almost nothing.",
  "The Reynolds number and the velocity head, and it is blind to the length, which is why a laminar friction factor can be quoted for a pipe before the length of that pipe has been decided at all.",
  "The Reynolds number and the bore, and it is blind to the density, since in layered flow only the viscous term is left."],
 "The laminar numerator is measured out of the engine as the friction factor times its own Reynolds number, giving 64.000000 from 0.064000000000 at 1000.0000. In layered flow the bumps have nothing to disturb."),

q(0, "A published case puts 150.0000 bpd through 2.067000 in over 5000.000000 ft. Why does so small a duty cost 130.867123 psi when OGBIA's 12000.000000 bpd costs 25.660631 psi?",
 "Because a narrow bore and a crawling velocity of 0.418299 ft/s put it at a Reynolds number of 15.5476, deep on the laminar branch, where the friction factor is 4.1163843599.",
 ["Because the shorter line concentrates the whole loss into 5000.000000 ft, and the friction loss is inversely proportional to the length, so a shorter pipe at the same duty always spends more.",
  "Because the small bore drives the relative roughness up, and on the laminar branch the wall term dominates the friction factor completely below about three inches.",
  "Because the low rate leaves the line only partly full, so the engine falls back on a holdup of its own and uses a reduced flow area."],
 "That case is the only one of the four published liquid cases whose friction factor is above one. Velocity and cost move together on the turbulent branch, and a line slow enough to go laminar breaks that habit."),

q(3, "Why is the turbulent friction factor described as solved rather than evaluated?",
 "Because it appears on both sides of the expression, so the engine iterates until the value stops moving.",
 ["Because the relative roughness of 0.0002255356 has to be found first by trial against the bore, and only once that fraction has settled can the friction factor itself be substituted directly.",
  "Because the Reynolds number and the friction factor are solved against each other, since the Reynolds number depends on the velocity and the velocity depends on the loss the friction factor produces.",
  "Because the engine reads it from the Moody chart, and reading a chart between two plotted roughness curves is an interpolation rather than a substitution of numbers into a formula."],
 "It is the one step in the tier that does not simply substitute. It converges to the oracle digit for digit at 0.037504518014, 0.021926421295, 0.019943465840 and 0.010859745054."),

q(2, "The absolute roughness of commercial steel is 0.001800 in. What does the correlation actually read, and what follows from that?",
 "A relative roughness of 0.0002255356, the roughness over the bore of 7.981000 in, so the same steel in a narrower bore is hydraulically rougher.",
 ["The absolute figure itself in inches, since the correlation was fitted against measured wall heights and converts to a fraction internally once the Reynolds number has selected a branch for it.",
  "The roughness over the flow area of 0.347410 ft2, which makes it dimensionless and the same steel four times rougher in half the bore.",
  "The roughness multiplied by the Colebrook divisor of 3.700000, which is the form the published correlation states, and the bore enters separately through the Reynolds number instead."],
 "The pipe reaches the friction factor as a proportion rather than as a length. The same bumps occupy more of a narrower passage, so 0.006000 in of used steel gives 0.0007517855."),

q(1, "Read the roughness table's two columns, at Reynolds 100000.0000 and at 100000000.0000, against each other. What do they say?",
 "A rough pipe stops caring about the Reynolds number and a smooth one never does. At a relative roughness of 0.050000 the two columns are 0.071780929441 and 0.071550904091, and at 0.000000 they are 0.017989773084 and 0.005940466352.",
 ["Both rows fall by about the same proportion, since raising the Reynolds number by a thousandfold lowers every friction factor in the same way whatever the wall is made of.",
  "The rough row falls furthest, because a larger relative roughness leaves more room for the Reynolds term to work on, and the smooth row is already close to the floor the correlation allows.",
  "The two columns agree on the smooth row and separate on the rough one, since a smooth pipe has no wall term at all and so nothing in it can respond to a change in the Reynolds number."],
 "That table is the vertical axis of the Moody chart. On the roughest row the wall has taken over, so the loss follows the velocity head alone, and on the smoothest the answer stays sensitive to the rate."),

q(3, "Between Reynolds 2100 and 4000 the engine reports the regime as transitional. What is it computing there?",
 "The turbulent law. The word and the arithmetic are saying different things.",
 ["A blend of the two laws weighted by where the Reynolds number sits in the band, which is why the interior rows fall smoothly from 0.048678586645 at 2100.0000 to 0.043519188769 at 3000.0000.",
  "A third correlation fitted to the transition band itself, which is what the label is announcing, and it is the reason the values in the band do not continue either neighbouring branch.",
  "The laminar law still, since the engine only leaves that branch at 4000, and the transitional label marks the stretch where the laminar answer is reported with a warning attached to it."],
 "The lower value at 2099.0000 is reported as laminar and the upper at 2100.0000 as transitional, and the upper one is computed on the turbulent branch. Reading the label as a third correlation reads something that is not there."),

q(0, "At the OGBIA relative roughness the friction factor steps across the lower boundary. What is the step, and between which two values?",
 "A jump of 60.303955 percent, from 0.0304761905 to 0.0488545386 across one unit of Reynolds number.",
 ["A jump of 60.303955 percent, from 0.030490709862 to 0.048678586645, which are the values the branch walk prints at 2099.0000 and at 2100.0000 on that same line.",
  "A fall of 60.303955 percent, from 0.0488545386 down to 0.0304761905, because the turbulent law returns the smaller figure and the laminar law the larger one at that Reynolds number.",
  "A step of about a tenth of a percent, from 0.039909964901 to 0.039907014056, which is what one unit of Reynolds number is worth anywhere along the friction curve."],
 "The pair at 0.030490709862 and 0.048678586645 belongs to a SMOOTH pipe, and the OGBIA pair at its own relative roughness of 0.0002255356 is the one that gives 60.303955 percent."),

q(2, "The upper boundary of the band runs from 3999.0000 to 4000.0000. How does the friction factor behave there, and why?",
 "It barely moves, from 0.039909964901 to 0.039907014056, because both rows were computed the same way and only the word changed.",
 ["It jumps, as it does at the lower boundary, because the engine leaves one law and starts another one there.",
  "It falls sharply, because the turbulent law carries the roughness term while the transitional label suppresses it, so crossing into turbulent is where the wall first reaches the friction factor.",
  "It cannot be read at all, since the engine reports the regime without a friction factor on that row and a caller has to compute the value itself from the Reynolds number and the relative roughness."],
 "The discontinuity sits at 2100, where the engine changes branch. At 4000 the label changes and the arithmetic does not, so the two rows agree to four decimal places."),

q(0, "Raising the OGBIA viscosity from 40.000000 cp to 60.000000 cp moves the Reynolds number from 3026.9533 to 2017.9688. What happens to the friction loss?",
 "It falls, from 51.289913 psi to 37.305974 psi, because the two rows were computed on different branches and the discontinuity between them produced it.",
 ["It rises, from 51.289913 psi to 74.611948 psi, because a thicker oil in the same pipe at the same rate always meets more friction on the way and the laminar branch is where that is steepest.",
  "It rises slightly, because the loss is continuous across the branch even though the friction factor and the reported regime are not, so nothing in the pressure records the crossing.",
  "It is refused, because a Reynolds number inside the band from 2100 to 4000 has no honest correlation behind it."],
 "A thicker oil in the same pipe at the same rate came out cheaper. That is the branch discontinuity showing up in a pressure, and it is the clearest reason to read the reported regime."),

q(3, "The two constants of the turbulent law are measured out of the engine. Where is each one isolated?",
 "The Reynolds numerator of 2.510000 on a SMOOTH pipe, where the roughness term is exactly zero, and the roughness divisor of 3.700000 in the FULLY ROUGH limit, where the Reynolds term falls away.",
 ["Both on the OGBIA line at a relative roughness of 0.0002255356, since that is the only condition for which the engine prints a friction factor to the twelve digits the measurement needs.",
  "The Reynolds numerator in the fully rough limit at a relative roughness of 0.010000, and the roughness divisor on a smooth pipe, since each constant is read where its own term is largest.",
  "Both at a Reynolds number of 100000.0000, by solving the two-unknown expression against the two friction factors 0.017989773084 and 0.037903711893 that the engine returns at that condition."],
 "2.510000 comes from 0.017989773084 at Reynolds 100000.0000 on a smooth pipe. 3.700000 comes from 0.037903711893 at a relative roughness of 0.010000 and a Reynolds number of 100000000000000.0000."),

q(2, "A line sits at a Reynolds number between the two branch boundaries and a value is wanted for it. What is the mistake to avoid?",
 "Interpolating between a laminar answer and a turbulent one, because the two are different laws and a value taken between them corresponds to nothing the method computes.",
 ["Reporting the regime beside the value, since the label says transitional while the arithmetic is turbulent and the word misleads a later reader.",
  "Using the turbulent value at all, since the engine computes it on a branch fitted for a different regime, so the only defensible answer inside the band is the laminar one at the lower boundary.",
  "Quoting the figure to the digits the engine gives, since an iterated value inside a band with no correlation carries fewer honest digits."],
 "The engine steps from one law to the other at 2100 and does not blend them. The honest response is to take the number as the turbulent law's opinion and to report the regime alongside it."),

emit(Q, '/root/fc-wip-linesizing/banks/fc2b_m02.json', expect_n=15)
finish()
