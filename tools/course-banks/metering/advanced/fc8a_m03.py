import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Expert m03, Normal venting and which direction governs.
# Digest SECTION 27 only. 15 questions.

q(2, "On this tank the fill rate is 2480.0000 bbl/hr and the draw rate is 640.0000 bbl/hr. Which of the four venting terms does the fill rate set?",
 "The movement outbreathing of 13924.1667 scfh, because liquid entering pushes vapour out ahead of it.",
 ["The movement inbreathing of 3593.3333 scfh, because a tank taking liquid has to pull air in behind the pump that is filling it and the rate is what sets how fast.",
  "The thermal outbreathing of 11765.0907 scfh, because the arriving liquid warms the vapour space and the warming is what drives the thermal term outward.",
  "The total inbreathing of 23201.8178 scfh, because a filling tank is the case that governs the inward direction on a fixed-roof tank of this size."],
 "Movement inbreathing is set by the draw rate and comes back as 3593.3333 scfh, and the two movement terms are the ones an operating decision can move within the hour.")

q(0, "The thermal inbreathing of this tank is returned as 19608.4845 scfh. What is it keyed to?",
 "The nominal capacity in barrels, at a stated rate of 1.000000 scfh of air per barrel and a latitude factor of 1.000000.",
 ["The working capacity of 18845.9323 bbl, which is the volume of liquid that can actually move in and out of the tank in service.",
  "The vapour space above the liquid, taken as the cross section over the height between the design liquid level and the top of the shell.",
  "The draw rate of 640.0000 bbl/hr, converted to a rate of air at the stated thermal rate per barrel."],
 "The engine returns the rate per barrel and the latitude factor beside the answer so the basis of the inbreathing figure sits in the same result that carries it.")

q(1, "Thermal outbreathing comes back as 11765.0907 scfh for a low volatility product and 19608.4845 scfh for a high volatility one. What is the engine saying?",
 "That the low volatility case is carried at a stated fraction of the thermal rate, which is one of this engine's own choices.",
 ["That the high volatility case has been extrapolated above the stated capacity limit of 20000.0000 bbl, which is why it comes back equal to the nominal capacity in barrels.",
  "That a high volatility product raises the latitude factor above 1.000000, and the outbreathing follows that factor while the inbreathing does not.",
  "That the two figures are the outbreathing at two different fill rates, since the volatility of the product decides which of the movement terms is added in."],
 "The engine states the basis: one scfh of air per barrel of capacity for an uninsulated tank at a latitude factor of 1, with the low-volatility outbreathing at 0.6 of it.")

q(3, "At the stated rates the engine returns a total outbreathing of 25689.2574 scfh and a total inbreathing of 23201.8178 scfh. What may a writer say about the pair?",
 "That the difference is 2487.4395 scfh and the ratio is 1.107209, both quoted from the relation line the course prints.",
 ["That the outbreathing stands at twice the inbreathing, since 2.000000 is the ratio this pair is printed at on the relation line the course carries for the two directions.",
  "That the two are close enough to be treated as one figure, which is why the engine forms a single predicate rather than reporting each direction separately.",
  "That the inbreathing is the larger of the two by 2487.4395 scfh, since the relation prints the difference as the first value less the second."],
 "The relation carries the two values, their difference and their ratio, and a comparison is only ever stated where a relation line states it.")

q(2, "Why does the engine form one predicate for the governing direction rather than letting the label, the warning and the sizing step each ask the question?",
 "Because three separate questions can answer differently at the tie, which is exactly where a designer is choosing between the two cases.",
 ["Because the two totals are computed in different units, and one place in the engine holds the conversion between them.",
  "Because a predicate evaluated once can be cached, which is what keeps a sweep of the draw rate cheap enough to bisect at the resolution the crossover needs.",
  "Because the warning has to fire before the totals are known, so the predicate is formed early and the two totals are checked against it afterwards."],
 "Two expressions disagreed at the tie and the label said vacuum while the warning stayed silent, so the decision is made once and everything else reads it.")

q(0, "Down the draw rate sweep the outbreathing column sits at 25689.2574 scfh on every row. Why?",
 "The draw rate does not appear in either outbreathing term, so moving it cannot move that column.",
 ["The outbreathing has already been capped at the high volatility total.",
  "The sweep holds the fill rate at 2480.0000 bbl/hr, which fixes every term.",
  "The engine carries the outbreathing from the first row of the sweep."],
 "Movement outbreathing is set by the fill rate and thermal outbreathing by the capacity, and the inbreathing column climbs from 19608.4845 scfh to 33083.4845 scfh across the same rows.")

q(1, "Between which two rows of the draw rate sweep does the governing word change?",
 "Between 900.0000 bbl/hr and 1200.0000 bbl/hr, and the crossover is reported at 1083.0319 bbl/hr.",
 ["Between 640.0000 bbl/hr and 900.0000 bbl/hr, the stated rate and the row above it.",
  "Between 1200.0000 bbl/hr and 1600.0000 bbl/hr, where the inbreathing passes 25689.2574 scfh and the vacuum warning starts to be written on the result.",
  "Between 1600.0000 bbl/hr and 2400.0000 bbl/hr, at the top of the sweep."],
 "The engine returns pressure (outbreathing) at 900.0000 bbl/hr and vacuum (inbreathing) at 1200.0000 bbl/hr, which is what puts the crossover inside that interval.")

q(3, "What does the engine write when the vacuum direction governs?",
 "`vacuum governs. A tank is a thin-walled vessel designed for inches of water column, and an undersized vacuum vent will pull it flat during a cold rainstorm on a draining tank. This is the case that destroys tanks`",
 ["A warning that the inbreathing total has passed the outbreathing total and that a pressure vacuum valve should be resized for the larger of the two directions before the next draw.",
  "A warning that the draw rate has passed the crossover of 1083.0319 bbl/hr and that a rate above the crossover is outside the range these movement relations were fitted over.",
  "A warning that the thermal inbreathing is an extrapolation, because a tank drawn down hard is a tank whose vapour space is changing faster than the stated rate per barrel allows."],
 "The message names the mechanism and the weather together, because a cold rainstorm drives the thermal term inward while a draining tank drives the movement term inward on the same tank.")

q(2, "A crossover draw rate of 1083.0319 bbl/hr is quoted in a report on another tank of the same design. What is wrong with that?",
 "It is a property of this tank at this fill rate, so changing the fill rate alone moves it.",
 ["Nothing, provided the second tank shares the diameter and the shell height.",
  "It is quoted at the wrong precision for a movement rate in this course.",
  "It was found by bisection, so only the bracketing rows may be quoted."],
 "The outbreathing total of 25689.2574 scfh is what the inbreathing has to overtake, and that total is set by the fill rate and the thermal terms of this tank.")

q(0, "What does the course print about the thermal inbreathing of this tank with insulation applied?",
 "A relation giving 19608.4845 scfh uninsulated, 4902.1211 scfh insulated, a difference of 14706.3634 and a ratio of 4.000000.",
 ["That insulation removes the thermal term altogether, so an insulated tank breathes on its movement terms alone and the inbreathing falls to 3593.3333 scfh.",
  "That insulation is applied as a latitude factor below 1.000000, so the credit shows up in the same field the latitude factor is returned in.",
  "That the credit is read from the standard for a documented insulation system."],
 "The credit applied is 0.25 and the engine says it is its own stated choice rather than a value read from the standard.")

q(1, "The engine is asked for the venting of a tank holding 250,000 bbl. What does it do?",
 "It returns a figure and labels it an extrapolation above the 20,000 bbl at which this package stops claiming the thermal rate is proportional to capacity.",
 ["It refuses, because the published table above that capacity is not carried here and a rate the package cannot source is withheld rather than guessed at.",
  "It returns the thermal rate at the stated capacity limit of 20000.0000 bbl instead, so a large tank is held at the last capacity the proportionality was claimed over.",
  "It returns the figure with no note at all, because the proportionality is a property of the relation rather than a range the package has to defend."],
 "A study is not blocked and nobody buys a vent on the figure, because the engine says the inbreathing must be checked against API 2000 before a vent is bought.")

q(3, "Moving a product from low volatility to high volatility at the same fill rate does what to the movement outbreathing?",
 "It takes it from 13924.1667 scfh to 27848.3333 scfh, a ratio of 2.000000 on the relation line.",
 ["It leaves it at 13924.1667 scfh, because volatility enters the thermal term alone.",
  "It takes it to 19608.4845 scfh, the high volatility thermal figure.",
  "It takes it to 25689.2574 scfh, the total outbreathing on this tank."],
 "The incoming liquid also evaporates, so the vapour space has to expel the displaced volume and the new vapour together.")

q(2, "Which part of a venting result is the part a reviewer will challenge?",
 "The factors, because the rate per barrel, the latitude factor and the credits are the engine's own stated choices.",
 ["The totals, because adding a thermal term to a movement term crosses two mechanisms with different clocks and the sum is the step a reviewer can check independently.",
  "The governing word, because a label carries no basis a reviewer can go back to.",
  "The capacity, because the whole thermal side is keyed to it and an error there is multiplied through."],
 "The engine returns the rate per barrel at 1.000000 and the latitude factor at 1.000000 and says the factors are not cited to a document in this repository.")

q(1, "At the stated rates on this tank, which total would a vent be sized against?",
 "The total outbreathing of 25689.2574 scfh, because the engine returns pressure (outbreathing) as the governing case.",
 ["The total inbreathing of 23201.8178 scfh, because the inward direction has the unforgiving failure mode and a vent is always sized on the worse consequence.",
  "The sum of the two totals, because a vent has to pass whatever is happening at once.",
  "The thermal inbreathing of 19608.4845 scfh, because the weather terms run all year."],
 "The two totals are 25689.2574 scfh and 23201.8178 scfh, and the governing case the engine returns is the one a vent is sized against.")

q(0, "What would have to become true of the two totals for the engine to return vacuum on this tank?",
 "The total inbreathing would have to overtake the total outbreathing, which on the sweep happens once the draw rate is high enough.",
 ["The thermal inbreathing would have to overtake the thermal outbreathing, which is the pair the governing predicate is formed from.",
  "The movement inbreathing would have to overtake the movement outbreathing of 13924.1667 scfh, with the thermal terms left out of the comparison.",
  "The inbreathing would have to reach twice the outbreathing, which is the margin the engine applies before it changes the word it returns."],
 "At 1200.0000 bbl/hr the inbreathing is 26345.9845 scfh against an outbreathing of 25689.2574 scfh, and that is the first row on which the word is vacuum.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/advanced/fc8a_m03.json', expect_n=15)
finish()
