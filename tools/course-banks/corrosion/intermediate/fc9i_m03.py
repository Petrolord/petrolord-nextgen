import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Professional m03, the wall shear.
# Every figure is from digest Section 10 at the rendering that section prints,
# with the shipped studio case from Section 19. The two film thresholds and the
# four constants of this module's friction factor are HELD, so none of them is
# ever an answer here and no question turns on a risk word.

q(2, "This module computes a wall shear stress. What question is that number there to answer?",
 "Whether a corrosion inhibitor film survives on the steel.",
 ["Whether the velocity has passed an erosional limit for the line.",
  "Whether the flow has reached the point where mechanical erosion begins.",
  "Whether the pressure drop is within the line's allowance."],
 "This engine has no erosional-velocity criterion at all and carries no model of mechanical erosion or erosional wall loss from entrained solids or liquid impingement. The Casing and Tubing Design course at its Expert tier is where that criterion is owned on this platform.")

q(0, "Which course on this platform owns the erosional velocity criterion?",
 "The Casing and Tubing Design course, at its Expert tier.",
 ["This one, in the module that computes the wall shear.",
  "The Pipeline and Line Sizing course, at its Associate tier.",
  "The Well Integrity and P and A course, in the Drilling module."],
 "This course cites the owner and states that this engine has no erosional-velocity limit, which is a pivot between two courses rather than a derivation you can run here. The repair deliberately did not add one.")

q(3, "One of the course's streams runs at a Reynolds number of 3.3754. Which branch does this module's friction factor take there?",
 "The laminar branch.",
 ["The turbulent branch, since every production stream is turbulent.",
  "Neither, because the engine refuses a Reynolds number below the switch.",
  "Both, because the engine blends the two branches near the switch."],
 "That stream is viscous, small and slow, and it is in the course so a lesson has one laminar case. Its friction factor comes from the other expression entirely.")

q(1, "At what Reynolds number does this module's friction factor change branch, and how was that figure established?",
 "At 4000.000000, bisected on the branch NAME the engine returns.",
 ["At 2000.0000, read from the engine's own exported constant.",
  "At 4000.000000, taken from the published transition for pipe flow.",
  "It has no single switch value, the branch being chosen from the velocity."],
 "Measuring rather than reading an export is deliberate throughout this course. An export tells you what the module declares and a measurement tells you what it actually uses. The switch value is held for literature either way.")

q(0, "By what factor does the wall shear jump across this module's friction branch switch?",
 "2.189815, across two ten-thousandths of the Reynolds number.",
 ["1.000000, because the two branches are constructed to meet at the switch.",
  "4.699248, which is the factor the stripped stream's rate ratio carries.",
  "2.189815, but only once the velocity has doubled across the switch."],
 "Two ten-thousandths of the Reynolds number is a fraction of a percent of velocity. Nothing in either expression requires the two to agree at any particular value, so joining them at one produces a step wherever they stand there.")

q(2, "Why does the engine leave that step unsmoothed?",
 "Because a smoothing function would be a third correlation with no source behind it.",
 ["Because the step is too small to be visible at the precision the studio prints.",
  "Because smoothing it would break the Reynolds number the line sizing course computes.",
  "Because the two branches already agree everywhere except at one single value."],
 "Blending the branches invents a curve. Picking one branch either side and saying nothing is what a reader would assume is happening. The engine computes the branch, flags the neighbourhood and says what the step means.")

q(1, "What does the engine do when the Reynolds number sits inside ten percent of the switch?",
 "It sets a nearSwitch flag and returns a note telling the reader to read the shear as a bracket.",
 ["It refuses the shear, because the value there is not a single number.",
  "It returns the average of the two branches and marks the row as blended.",
  "It returns the laminar value and records that the turbulent one was rejected."],
 "The engine's own words on that note are that the friction factor is discontinuous there and the shear jumps by about a factor of two, and that the number should be read as a bracket. Near the switch the shear has two candidates in it, and away from it the shear is a single number.")

q(3, "Two numbers turn the wall shear into a word. What is their status in this repository?",
 "Both are held for literature, so no source for either value exists anywhere in it.",
 ["Both are published values that the engine cites in its own docstring alongside the correlation.",
  "One is published and the other was measured on the Tunu stream.",
  "Both were fitted to the vendored golden, which carries the sourcing."],
 "Measured out of the engine by bisecting the velocity at which the risk word changes, they are 100.000000 Pa and 50.000000 Pa. The engine declares both in its own held list and the studio prints that list behind a disclosure.")

q(0, "What does the film-stripping threshold drive in this engine as it ships?",
 "A coloured word, a warning paragraph and the corrosion inhibitor credit itself.",
 ["A coloured word and nothing else, the rate being computed independently of it.",
  "An inspection interval, which the screening returns alongside the remaining life.",
  "The erosional velocity limit the module compares the typed velocity against."],
 "The third of those is the one that changes the arithmetic. An unsourced number that colours a label is a presentation choice, and an unsourced number that removes a credit from a rate is part of the calculation.")

q(2, "For the Tunu stream, the velocity at which the film-stripped flag turns true was found by bisection. What is it?",
 "8.126015 m/s, and the wall shear there is 100.000000 Pa.",
 ["8.126015 m/s, and the wall shear there is 50.000000 Pa.",
  "12.000000 m/s, which is the lowest swept velocity carrying a high risk word.",
  "It has no single value, the flag turning on a range of velocities."],
 "So the threshold is a single value, reachable at a single velocity on a stated stream, and the engine will give that velocity to six decimals. The precision is honest about the arithmetic and says nothing about where a real corrosion inhibitor film actually fails.")

q(1, "This module's friction factor and this module's Reynolds number are not the platform's only ones. What should a reader do about that?",
 "Use each module's own number inside that module, since the two correlations will not agree on one pipe.",
 ["Prefer this module's pair, because the corrosion screening is the later calculation.",
  "Prefer the line sizing pair, because line hydraulics is where the pipe is sized.",
  "Average the two, because neither correlation is sourced in this repository."],
 "The Pipeline and Line Sizing course computes both with a different correlation and a different laminar to turbulent transition, and the engine says so in its own docstring. This course names the seam rather than hiding it, because removing the duplicate is a cross-module decision.")

q(3, "The density box is left blank on a whole screening. What comes back?",
 "A refusal saying the film survival check did not run, and naming the density.",
 ["A shear row left empty, with every other row computed as usual.",
  "A shear computed from a default density the engine supplies.",
  "A shear of zero, which the film-risk word is then taken against."],
 "The engine's own message says wall shear stress needs a positive density. The screening computes the shear first because the rate depends on the film verdict, so a shear that cannot be computed stops the whole screening.")

q(2, "A viscosity of zero is typed into the shear door. What does the engine return?",
 "The same refusal a blank viscosity gets, because both fail the positive test.",
 ["A Reynolds number of infinity, with the turbulent branch selected for the friction factor.",
  "A wall shear of zero, since the friction factor vanishes with the viscosity.",
  "A screening marked complete, with the viscosity row flagged as assumed."],
 "The message is that wall shear stress needs a positive viscosity. Four inputs reach this door and each of the four refusals names its own box, which is the pattern throughout this module.")

q(0, "Inside this module, which of the two quantities is a definition rather than a correlation?",
 "This module's Reynolds number, formed from a density, a velocity, a diameter and a viscosity.",
 ["This module's friction factor, read off one of the two branches.",
  "The wall shear, formed from the friction factor and the flow.",
  "Neither, because both rest on constants held for literature."],
 "That split is why this course can grade a Reynolds number and grades no friction factor and no wall shear. The held Blasius pair and the branch switch act downstream of the Reynolds number.")

q(1, "On the studio's shipped default case, what is this module's Reynolds number?",
 "416686.8569.",
 ["313781.4400, which is the figure the first of the course's streams carries.",
  "1063231.0691, the figure carried by the one stream whose film is stripped.",
  "63287.5636, which is the swept row at one metre a second."],
 "Reynolds numbers print to four decimals in this course, because a number in the hundreds of thousands carries no information in its millionths. That case is turbulent and its wall shear is 14.408065 Pa.")

emit(Q, "/root/wt-fc9-nextgen/tools/course-banks/corrosion/intermediate/fc9i_m03.json", label="fc9i_m03", expect_n=15)
finish()
