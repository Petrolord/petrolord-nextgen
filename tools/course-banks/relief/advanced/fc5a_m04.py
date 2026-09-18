import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Expert m04, The Point Source, Twice. Digest section 25.

q(3, "The solid angle in the point-source relation is not exported, and the digest recovers 12.566370614359 from one returned intensity against its own stated inputs. Which class does that figure fall into?",
 "Computed, because the oracle reaches the same figure by quadrature of the sphere area.",
 ["Typed, because the value is a published geometric constant that the engine takes as an input and names.",
  "Held for literature, because nothing here can derive it.",
  "A stated convention of this engine, pinned by the suite so that it cannot move without somebody noticing."],
 "It is one of the constants in this module that something actually checks. Measuring it out of behaviour is what made it visible at all, since the engine keeps it inside the relation.")

q(1, "The AFIESERE flare is stated as 210000.0000 lb/hr at 19400.0000 Btu/lb, and the digest derives a heat release of 1193971.5392 kW. Who owns that derivation?",
 "The caller. The engine takes a heat release in kW and knows nothing about rates or heating values.",
 ["The engine, which converts the rate and the heating value on the way into the intensity relation.",
  "The oracle, which carries the unit packaging so the engine can work in kW throughout.",
  "The digest alone, since the engine refuses a release stated in any unit other than Btu/hr."],
 "The mass rate and the heating value are the caller's arithmetic and the caller owns any error in them. Stating a release in kW is also how a capstone answer stays clear of a conversion nobody graded.")

q(2, "At 40.000000 m the intensity is 17.482435 kW/m2 and at 80.000000 m it is 4.370609 kW/m2. Which comparison does the digest invite you to make on those rows?",
 "The ratio of the two intensities against the ratio of the squared distances.",
 ["The ratio of the two intensities against the ratio of the distances themselves.",
  "The difference of the intensities against the difference of the distances.",
  "The ratio of the two intensities against the ratio of the radiated fractions behind them."],
 "The intensity falls with the square of the distance, and this is the one place in the course where you are invited to form a ratio of your own, because the relation is exact and stated. Take it on a pair of rows of your choosing and watch the two ratios meet.")

q(0, "The forward route gives 0.795774715459 kW/m2 at 10.000000 m, and the inverse hands back 10.000000000000 m for that intensity, a ratio of 1.000000000000. What has that established?",
 "That the two implementations agree.",
 ["That the point-source model is sound in both of the directions it is asked in.",
  "That the solid angle of 12.566370614359 is the correct one for a sphere.",
  "That the transmissivity is applied once rather than twice on either side."],
 "A round trip through a function and its own inverse is an identity. Exactness here is the least informative outcome available, and a suite showing only this would be showing you nothing.")

q(1, "Which of these faults would still close that round trip perfectly?",
 "A wrong solid angle, an inverse-cube law, or a transmissivity applied twice.",
 ["A radiated fraction outside its range, since both directions validate that input identically.",
  "An error in the stated flare rate, since the release is derived first.",
  "A difference in printing precision between the two routes."],
 "The same error is applied and then removed, so the trip closes whatever it was. What makes the model itself checked is the oracle deriving the sphere area by quadrature and the inverse by bisection on that same quadrature.")

q(3, "What is the difference between a second implementation of a relation and a different derivation of the same quantity?",
 "A second implementation checks a transcription; a different derivation checks the relation.",
 ["A second implementation checks the inputs; a different derivation checks the units they arrive in.",
  "A second implementation is what an oracle is; a different derivation is what a published case is.",
  "A second implementation checks the forward route; a different derivation checks only the inverse."],
 "When somebody shows you agreement, the question is how far apart the two sides were to begin with rather than how close they came. That question is the one this whole module is circling.")

q(0, "Both radiation directions refuse a radiated fraction of zero, a transmissivity above one and a negative transmissivity. Why is checking that symmetry worth the trouble?",
 "An inverse bolted on later commonly validates less than the forward route, so a value the forward one would have refused sails through it.",
 ["The inverse solves by bisection, so an unvalidated input can put its bracket the wrong way round.",
  "The two routes share their validation code, so a difference between them would be a packaging fault.",
  "An inverse that refuses more than its forward route would make the round trip fail to close."],
 "It is a cheap test with a real failure mode behind it. The audit module runs every one of those refusals, and both directions take the same four inputs.")

q(2, "The stated flare at a radiated fraction of 0.320000 and a transmissivity of 0.920000 gives 1.427138 kW/m2, and at 0.320000 and 1.000000 it gives 1.551237 kW/m2. What are those two inputs?",
 "Project figures, typed and validated as fractions, which nothing in the package derives and nothing should.",
 ["Published constants for a hydrocarbon flare, typed into the call with their reference named the way Kb and KSH both are.",
  "Held-for-literature values, taught as stated limits and deliberately kept out of everything this course puts a mark on.",
  "Computed figures, since the engine derives both from the heat release and the distance it is given."],
 "The audit column reads TYPED inputs, and the reason given is that they are project figures. That is a different status from a chart value carrying a reference and different again from a figure nothing can derive.")

q(3, "You have an intensity relation and a route that returns a distance. Why does this course compute no flare setback?",
 "The setback, the pool fire behind it and the customary allowable intensities are owned by a merged sibling course.",
 ["A setback needs a flame height, which this engine has no route for and the digest never prints.",
  "The four customary intensities are held for literature, so no distance solved against one may be reported.",
  "The point source is a screening model, and a setback has to come from a solid-flame model instead."],
 "That course computes a setback, does the pool fire and the flame height beside it, teaches the limitations of the point source, and grades a setback in its own Professional capstone. This module hands the question back by name.")

q(0, "A test asserts that the relief engine's allowable-intensity table and the spacing engine's stay equal, row by row and wording included. What does it establish?",
 "That the two copies have not drifted apart, so changing one becomes a reviewed act rather than a quiet one.",
 ["That the four values are correct, since two engines derived them separately and agree.",
  "That the wording is sourced, since a label asserted against a second copy carries that copy's reference.",
  "That either table may be read as an answer, since a pinned table cannot be wrong without the suite going red."],
 "Both tables could carry the same wrong value and the same misleading label and the test would pass forever, because it compares them to each other and to nothing else. A check compares a quantity against something derived independently of it; a pin fixes a quantity so it cannot move unnoticed.")

q(2, "The four customary intensities are 1.580000, 4.730000, 6.310000 and 9.460000 kW/m2, each with a label. Who wrote the labels, and what follows?",
 "This package wrote them, so they are an interpretation with no source attached here.",
 ["API 521 wrote them, so a distance quoted against one inherits the standard's authority.",
  "The spacing engine wrote them and this one copied them.",
  "The validation oracle wrote them, which is why a test can assert the two tables stay equal."],
 "A label carries more authority than a bare number because it sounds like a finding. Nothing graded in this course reads a row of that table, and the honest use is to cite it as customary and name it as unsourced here.")

q(1, "A distance comes back from the inverse route. What has to be recorded with it for the answer to be auditable?",
 "The allowable intensity you solved against and where it came from.",
 ["The exposure category the allowable was read from, so a reader can find the row you used.",
  "The heat release in Btu/hr, so a reader can check the conversion the engine performed.",
  "The transmissivity and the radiated fraction, because those are the two figures the equality test pins."],
 "A distance beside a stated allowable is auditable, because a reader can disagree with the allowable without reverse-engineering which row of a table you used. A distance beside a named exposure category is not.")

q(3, "The blowdown march returns eleven fields and the intensity route returns one. What is that contrast about?",
 "How much each route had to decide. The march integrates and owes an account; the point source evaluates one relation.",
 ["How much each route was validated, since the oracle checks the march in closed form and the point source by quadrature.",
  "How much each route can refuse, since the march runs four refusals and the point source only three.",
  "How much each route costs to call, since a march returns its trajectory and a relation returns a scalar."],
 "The size of a return is a statement about how much the route had to decide. Nothing in the point-source call has a step size, a stopping rule or a flow assumption for a reader to audit.")

q(0, "The published radiation and setback rows agree with the engine at relative differences around 5.116e-15 and 2.588e-15. Why is that the expected outcome here?",
 "The oracle finds the sphere area by quadrature and the inverse by bisection on it, so two different pieces of arithmetic meet at the same sphere.",
 ["Both sides evaluate the same closed form, so anything above floating-point rounding would be a packaging error.",
  "The published rows were generated from the engine, so the only difference available is the printing precision.",
  "The relation carries no iteration, so the agreement is limited only by the six decimals an intensity prints at."],
 "Those differences are at the size of floating-point rounding and on this route that is a good result. On the blowdown block the agreement is looser and the looser one is the stronger result, which is the subject of the audit module.")

q(2, "A layout decision needs the distance at which a stated allowable is met. Which two figures does the inverse route need beside that allowable?",
 "A heat release in kW, and the radiated fraction and transmissivity it is to be applied at.",
 ["A distance to start its bracket from, and the radiated fraction the bisection is to close on.",
  "A relief rate in lb/hr and a lower heating value in Btu/lb, which it converts internally.",
  "A flame height and a radiated fraction, which place the source above grade."],
 "It takes the same four inputs as the forward direction and refuses the same bad ones. What it returns is one field, the distance in m, with no note and no warning attached.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/advanced/fc5a_m04.json', label='fc5a_m04', expect_n=15)
finish()
