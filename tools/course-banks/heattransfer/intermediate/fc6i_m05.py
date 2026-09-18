import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Professional m05, the tube side film.
# Every figure is from digest Sections 12 and 13 at the rendering they print.
# NOTHING here asks a reader to tell the two published film rows at the same
# flow, bore, viscosity, Reynolds and Prandtl apart from the printed table,
# because the discriminator is a wall viscosity that table does not print. The
# wall viscosity table in this module's own lesson is where that is taught.

q(2, "The film correlation here takes two dimensionless arguments. Which two, and who owns the first as a subject?",
 "A Reynolds number and a Prandtl number, and the Reynolds number belongs to Pipeline and Line Sizing.",
 ["A Reynolds number and a Nusselt number, and the Reynolds number belongs to the Rotating Equipment module.",
  "A Prandtl number and a capacity ratio, and the capacity ratio belongs to Pipeline and Line Sizing.",
  "A Reynolds number and a Prandtl number, and the Reynolds number is derived from scratch here."],
 "This course does not re-derive a Reynolds number. It is an argument to a correlation, and it is reported on the answer so it can be checked against whatever source a reader trusts.")

q(0, "At the studio converged count of 74 tubes in 2 passes, what does the film call return?",
 "Reynolds 44051.846000, Prandtl 15.119375, turbulent, and a film coefficient of 547.762384.",
 ["Reynolds 44051.846000, Prandtl 15.119375, laminar, and an inside film coefficient of 547.762384.",
  "Reynolds 45275.508389, Prandtl 15.119375, turbulent, and an inside film coefficient of 559.901439.",
  "Reynolds 44051.846000, Prandtl 12.678930, turbulent, and a film coefficient of 994.597468."],
 "That is 37 tubes a pass. The answer carries ten keys in all, and those four are the ones a reader quotes first.")

q(1, "What happens to the Prandtl number as the tube count moves along the studio trail?",
 "Nothing, because it is a property of the fluid rather than of the bundle.",
 ["It falls with the Reynolds number, because both are formed from the velocity.",
  "It rises as the count rises, which is what holds the film up at high counts.",
  "It is recomputed at each count and reported only at the converged one."],
 "It stays at 15.119375 at every count on that trail. So everything the geometry does to the film arrives through the Reynolds number alone.")

q(3, "Read the studio trail at 2, 60, 72 and 74 tubes. Which way do the Reynolds number and the area go?",
 "The Reynolds number falls and the area rises, from 185.448625 to 229.543151 ft2.",
 ["The Reynolds number rises and the area falls, to 185.448625 ft2.",
  "Both fall, and the area ends at 185.448625 ft2 once the loop has closed.",
  "Both rise, and the area ends at 229.543151 ft2 once the loop has closed."],
 "The same flow divided among more tubes moves more slowly in each of them. The film falls with the Reynolds number, the coefficient falls with the film, and the area the coefficient asks for rises.")

q(0, "The first row of that trail is 2 tubes at a Reynolds number of 1629918.301989. What is that row?",
 "A step on the trail the iteration left behind, rather than an answer.",
 ["The answer at the seed the studio ladder starts from, which is 2 tubes.",
  "The bundle the engine recommends before the fouling allowances are applied.",
  "The count at which the film is highest, so it is the count worth designing at."],
 "Two tubes carry the whole flow, so its film coefficient of 9843.591536 belongs to a bundle nobody would build. Only the last row of the trail describes a real exchanger.")

q(2, "Three regimes, three treatments. What does the engine do in each?",
 "It warns below 2300, refuses between 2300 and 10000, and answers plainly above 10000.",
 ["It refuses below 2300, warns inside the band, and answers above 10000.",
  "It warns below 2300, answers between 2300 and 10000, and refuses above 10000.",
  "It answers below 2300, refuses between 2300 and 10000, and warns above 10000."],
 "Both band edges are declared constants of this module, so a reviewer finds them in one place rather than in a comparison buried in the arithmetic, and the refusal quotes them back in its own message.")

q(1, "The film is asked for at 6000.0000 lb an hour on the studio bundle and refused. What comes back beside the message?",
 "A Reynolds number of 3303.888450, a Prandtl number of 15.119375, and 37.000000 tubes a pass.",
 ["A Reynolds number of 3303.888450, and the film coefficient the laminar limit would have given at it.",
  "A Reynolds number of 6607.776900, a Prandtl number of 15.119375, and the whole tube count of the bundle.",
  "The two band edges and the flow that would be needed to clear the upper one."],
 "A refusal carrying only its message would leave a caller with no idea how far inside the band they were. This one hands back the numbers that produced the state it refused.")

q(3, "That refusal names three inputs to change. Which three, and why those?",
 "The tube count, the passes or the bore, because all three move the velocity inside a tube.",
 ["The flow, the duty or the fouling allowance, because all three of them move the film coefficient.",
  "The tube count, the passes or the flow, because all three move the Prandtl number.",
  "The bore, the wall conductivity or the length, because all three move the geometry."],
 "The band is a property of the velocity rather than of the duty, so the remedy is geometry. A number produced in that band would be a confident figure with nothing behind it.")

q(0, "Why does the studio walk a ladder of seeds rather than starting the loop from one guess?",
 "An intermediate count can land the film inside the band the engine refuses.",
 ["A single seed converges on a different count from the one the ladder reaches.",
  "The first seed on the ladder is the published count.",
  "A single seed cannot be checked against the trail the iteration leaves."],
 "A seed that refuses is a seed the loop cannot start from, and the ladder gives it somewhere else to begin. The first seed that evaluates is the one the loop runs from.")

q(3, "At 900.0000 lb an hour the Reynolds number is 495.583267 and the film is 5.667097. Double the flow. What is the film?",
 "5.667097, at a Reynolds number of 991.166535.",
 ["5.667097, at a Reynolds number of 1431.684995.",
  "5.667097, at a Reynolds number of 495.583267.",
  "345.692714, at a Reynolds number of 991.166535."],
 "The constant wall temperature laminar limit is a statement about the shape of the temperature profile in a fully developed flow, and the flow rate has dropped out of it. Nothing is broken and nothing has been rounded.")

q(2, "The laminar warning states three things. Which three?",
 "The film does not move with the flow, the viscosity correction is not applied, and entrance effects are ignored.",
 ["The film does not move with the flow rate, the transition band edge is nearby, and entrance effects are ignored here.",
  "The film sits below the transition band, the correlation behind it is fitted, and the tube count may yet change it.",
  "The film does not move with the bore, the viscosity correction is applied, and the answer is a limit."],
 "All three are limitations rather than results. Entrance effects are real and can matter a great deal in a short tube, and they are outside what this limit describes.")

q(1, "Why does the engine warn in the laminar range and refuse in the transition band?",
 "In the laminar range there is a limit with a clean derivation behind it, and in the band there is nothing.",
 ["In the laminar range the correlation behind the answer is a fit, and inside the band that same fit is extrapolated.",
  "In the laminar range the Reynolds number is reported, and in the band it is not.",
  "In the laminar range the flow is known, and in the band the tube count is not."],
 "So a number exists in the one case that is worth returning. The warning stops it from being read as more than it is.")

q(0, "The Sieder-Tate correction is applied on one condition. What is it, and what does it do on the studio case?",
 "A wall viscosity is given, and at 0.320000 cp the factor is 1.064473 and the film 583.078474.",
 ["The flow is turbulent, and at a wall viscosity of 0.320000 cp the factor is 1.000000 and the film 547.762384.",
  "The service is heating, and at a wall viscosity of 0.320000 cp the factor is 1.064473 and the film 547.762384.",
  "A wall viscosity is given, and at 0.320000 cp the factor is 1.209677 and the film 583.078474."],
 "The answer reports which of the two happened rather than leaving a reader to infer it from the number. With no wall viscosity given the factor is 1.000000 and the film is 547.762384.")

q(2, "What does the correlation block report for the validity band of this fit?",
 "Null, with the Reynolds and Prandtl numbers handed over beside it.",
 ["The two transition band edges, which are the band it was fitted over.",
  "The band in Reynolds only, because the Prandtl band is not established.",
  "The band the published film cases in this repository were taken across."],
 "The engine cannot tell you whether you are inside the band, so it hands over the two numbers a reader would need to find out from a source they have and it does not. Nothing here grades them.")

q(3, "A tube side declared as cooling is refused. What does the refusal say the difference is worth?",
 "About 31 percent on the inside film at a Prandtl around 15.",
 ["About 31 percent on the log mean driving force at a Prandtl around 15.",
  "About 31 percent on the inside film at any Prandtl number at all.",
  "Nothing on the inside film until the flow reaches the transition band."],
 "The studio case has a Prandtl number of 15.119375, so that is the neighbourhood the statement is about. The refusal tells the caller to type the tube-side film instead of computing it.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/intermediate/fc6i_m05.json', label='fc6i_m05', expect_n=15)
finish()
