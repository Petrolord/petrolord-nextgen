import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Professional m04, an affinity law applied to a duty point is not a new
# duty point. Digest Section 9 only. PD3 owns the laws; this module owns the
# composition, which is the crossing against the affinity map.

q(3, "A trim ratio of 0.950000 gives a re-solved duty of 1131.756344 gpm and a one-point answer of 1172.730321 gpm, a flow quotient of 1.036203885. Why is that row the cleanest evidence in the section?",
 "Its shortfall percent is 0, so the model that would be the obvious suspect contributed nothing and the gap is still there.",
 ["Its shortfall percent is 0, so the two answers agree everywhere except on the flow, which is the leg the model reaches first.",
  "It is the only row where the scaled curve and the system curve cross twice, so the gap is the distance between the two crossings.",
  "It is the row where the two ratios are closest to one, so the quotient of 1.036203885 is the smallest error the composition can produce."],
 "The gap is that the system curve did not move when the machine changed, so the machine meets it somewhere else.")

q(1, "Why can an affinity law applied to an old duty point not know where the pump will now run?",
 "The laws are a statement about the machine alone, and nothing in them refers to a static head or a friction head.",
 ["The laws are stated for a change of speed, so applying them to a trim carries an error that grows with the depth of the cut.",
  "The laws scale a curve rather than a point, so applying them to a single coordinate pair loses the shape of the curve around it.",
  "The laws hold only inside the band the engine reports without comment, and a re-solved duty can land outside it."],
 "A duty point is a property of the machine and the system together, and it exists only because the two curves meet.")

q(2, "The Pump Station Designer draws its duty headline one way and shows a second figure in a card headed \"What a change would buy\". What is that card?",
 "The affinity map, which says where the machine you had ends up on the machine you now have.",
 ["A cross-check on the headline, so a reader can see the two routes agree before trusting the duty printed above.",
  "The duty the station would reach if the system curve were re-rated for the change as well as the machine.",
  "A sensitivity band around the headline duty, drawn from the ends of the speed ratio band."],
 "The crossing is the operating point. The two are different questions and the studio labels them as two.")

q(0, "Asked at a unit duty, a pure speed ratio of 1.100000 returns a flow factor of 1.100000000 and a head factor of 1.210000000, while a pure trim ratio of 0.800000 returns 0.764000000 and 0.582400000. Why do the trim factors not read as a clean ratio and its square?",
 "The shortfall model is inside those factors, so a trim of 0.800000 does not scale flow by 0.800000000.",
 ["The trim factors are quoted at the best efficiency point and the speed factors at the duty, so the two are read against different references.",
  "The trim factors carry the implied efficiency ratio as well, which is why both of them fall below the plain ratio and its square.",
  "The engine applies the cube to a trim and the square to a speed change, so the head factor of 0.582400000 is a cubed quantity."],
 "A trim ratio of 0.950000 returns a flow factor of 0.950000000, because that is a trim the model leaves alone.")

q(1, "What is gained by reading the scaling factors out of the engine rather than restating them in whatever draws the chart?",
 "The curve and the point are scaled by the same numbers, so they cannot drift apart when the engine moves.",
 ["The factors then carry the shortfall model, which a chart drawn from restated affinity laws would have to apply separately.",
  "The engine returns the factors to more decimal places than a restatement would carry, so the chart is drawn more precisely.",
  "The factors are validated against the published cases on the way out, which a local copy of the laws would not be."],
 "Two implementations of one rule agree until one of them changes. At a trim of 0.800000 a hand-coded factor of 0.800000000 disagrees with the engine's 0.764000000.")

q(3, "The combined row, a speed ratio of 1.100000 with a trim ratio of 0.900000, returns a flow factor of 0.975150000 and a head factor of 0.950697000. What is that row for?",
 "It shows the factors for both changes at once, which is the case a studio has to scale a curve for.",
 ["It shows that the two changes cancel, since both factors come back close to one.",
  "It shows the factors at the boundary of the band the engine reports without comment.",
  "It shows the largest disagreement between the crossing and the affinity map in the section."],
 "The pure speed rows and the pure trim rows are the other two shapes. Nothing in the table is restated: each figure is what the engine does to a duty of one.")

q(0, "At a trim ratio of 0.950000 the one-point answer is 1172.730321 gpm at 377.065419 ft, and the scaled curve read at that flow gives 377.065419 ft, a difference of 0 ft. What does that settle?",
 "That the affinity map is a real point on the new machine's curve rather than an approximation the re-solve corrects.",
 ["That the affinity map and the crossing are the same point once the curve has been scaled, and the quotient of 1.036203885 is a reporting artefact.",
  "That the scaled curve was built from the one-point answer, so reading it back there cannot disagree.",
  "That the system curve passes through the one-point answer as well, which is what makes it a duty."],
 "It is a point on the machine you now have. It is simply not where that machine will run.")

q(2, "A power figure is wanted after a trim to 0.800000. The re-solved duty is 695.297235 gpm at 275.923397 ft and the one-point answer is 943.122068 gpm at 243.327313 ft. Which should the power be built on?",
 "The re-solved duty, because that is where the pump will run and everything downstream hangs off it.",
 ["The one-point answer, because it is the point the affinity laws place the machine at and the laws are exact for a scaling.",
  "Either, because a power figure is a product of flow and head and the two answers bracket the same product.",
  "The one-point answer, because the re-solved duty belongs to the system rather than to the machine whose power is wanted."],
 "A power built on a one-point flow is a power for a flow the pump will not deliver, and no unit check will catch it.")

q(0, "At a speed ratio of 0.700000 the two answers are 502.692592 gpm at 244.459069 ft and 864.117078 gpm at 204.722499 ft, with quotients of 1.718977148 and 0.837451028. What does the flow quotient measure?",
 "The distance between two correct answers to two different questions.",
 ["The error the re-solve corrects, a factor of 1.718977148.",
  "The share of the change that the system curve absorbed rather than the machine, which rises as the change deepens.",
  "The two flows the machine makes at one head."],
 "Nothing on that row is wrong by that factor. Both figures are the engine's and both are right about their own question.")

q(2, "At a speed ratio of 1.100000 the flow quotient is 0.949032669 and the head quotient is 1.033460604. How does that sit beside the row at 0.700000, where they are 1.718977148 and 0.837451028?",
 "The arrangement is reversed, so the direction of the gap is a property of the change rather than of the composition.",
 ["The arrangement is the same, since both rows put the flow quotient above one and the head quotient below it.",
  "The arrangement is reversed because the row at 1.100000 is outside the band the engine reports without comment.",
  "The arrangement is reversed because a speed increase re-solves on the static part of the system curve rather than the friction part."],
 "A machine scaled down meets the fixed system at one flow and a machine scaled up meets it at another. Assuming the two quotients move together is the mistake.")

q(3, "Both tables carry a row at a ratio of 1.000000 where every quotient reads 1.000000000. Why?",
 "On that row the machine was not changed, so the two questions collapse into one.",
 ["On that row both scaling factors are 1.000000000.",
  "On that row the base duty of 1234.452969 gpm at 417.801018 ft is the published case, and the published case is where the two methods are reconciled.",
  "On that row the two curves are tangent."],
 "The two answers agree there because nothing happened. Reading that agreement as evidence the distinction is academic is the third mistake in the lesson.")

q(1, "Reading down the trim rows, the flow quotient goes 1.000000000, 1.036203885, 1.099939243, 1.195804570, 1.356430057, 1.688794663. What should a reader take from the shape?",
 "Small changes put the two answers close together and large ones put them far apart, and the interesting proposals are the large ones.",
 ["The quotient grows without bound as the trim deepens, so below a trim ratio of 0.750000 the two methods carry no relation at all.",
  "The quotient grows because the shortfall model grows with the trim, so it is the model rather than the system that opens the gap.",
  "The quotient grows in proportion to the trim percent, so a reader can interpolate the gap for any trim from two rows."],
 "A reader who checks the two methods at a trim ratio of 0.950000 and decides 1.036203885 does not matter will carry that to 0.750000, where it is 1.688794663.")

q(2, "At a trim ratio of 0.750000 the flow quotient is 1.688794663 and the head quotient is 0.839967688. What does that pair rule out?",
 "That the two quotients move together, which the speed row at 1.100000 rules out again in the other direction.",
 ["That the head quotient can ever exceed one, since a trimmed machine makes less head than it did.",
  "That the re-solved head can exceed the one-point head, since 246.213642 ft and 206.811504 ft show the opposite.",
  "That the shortfall model is inside the re-solve, since a model applied to both answers would cancel from the quotients."],
 "At a speed ratio of 1.100000 the pair is 0.949032669 and 1.033460604, which is the opposite arrangement.")

q(0, "What makes the crossing and the affinity map different paths rather than two estimates of one path?",
 "The new crossing slides along a system curve that never moved, and the map slides along the machine's own law.",
 ["The crossing is solved and the map is scaled, so the crossing carries a residual the map does not and the two differ by it.",
  "The map uses a trim's ideal columns and the crossing its real ones.",
  "The crossing is taken at the best efficiency flow and the map at the old duty flow, so the two start from different points."],
 "The two paths start at the same point, at a ratio of 1.000000, and they are different paths, so the further a change goes the further apart they land.")

q(1, "A report gives the duty after a speed change to 0.800000 as 987.562375 gpm. What has it reported?",
 "A point on the new curve, when the pump will run at 791.589335 gpm.",
 ["The re-solved duty, the figure a headline carries.",
  "The ideal flow of a trim to 0.800000.",
  "A flow the engine never returns at 0.800000."],
 "The re-solved answer on that row is 791.589335 gpm at 295.447319 ft, and the one-point answer is 987.562375 gpm at 267.392652 ft.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/intermediate/fc3i_m04.json', expect_n=15)
finish()
