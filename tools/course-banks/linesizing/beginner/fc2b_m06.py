import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Associate m06, The Associate Reading. Digest section 6, the tier read end
# to end, the capstone method, and what the next tier changes.

q(1, "The Associate tier is built on six numbers about one line. What are they?",
 "A velocity, a Reynolds number, a friction factor, a friction loss, a total loss and an erosional ceiling.",
 ["A flow area, a velocity, a Reynolds number, a relative roughness, a friction factor and a pressure gradient, which is the chain in the order the engine runs it from the bore to the answer.",
  "A rate, a bore, a length, a density, a viscosity and a roughness, which are the six inputs a liquid line call takes and the six the refusal message names when any of them is missing.",
  "A velocity, a velocity head, a friction loss, a fittings loss, an elevation loss and a total, which is the pressure side of the chain with the three terms the engine keeps apart."],
 "On OGBIA they are 2.244621 ft/s, 48431.2523, 0.0218149625, 25.660631 psi, a total of 25.660631 psi at zero rise, and 13.545709 ft/s at the continuous-service c factor."),

q(3, "In the chain the engine runs, what does the friction factor consume and what does it feed?",
 "It consumes the Reynolds number and the relative roughness, and it feeds the loss along with the length.",
 ["It consumes the velocity and the relative roughness, and it feeds the Reynolds number, which is then compared against the two branch boundaries to settle which regime the line is in.",
  "It consumes the Reynolds number alone, and it feeds both the friction loss and the erosional ceiling, which is why a change of bore moves the ratio as well as the pressure drop.",
  "It consumes the velocity head and the length over the bore, and it feeds the gradient, which is the form the engine reports a loss in before the total is assembled from the three terms."],
 "A bore gives an area, the area and the rate give a velocity, the velocity gives a Reynolds number, the Reynolds number and the relative roughness give a friction factor, and that and the length give the loss."),

q(2, "A larger bore is bought for a line whose total carries all three terms. Which of the three does it change?",
 "The friction and the fittings, both of which are built on a velocity head that falls with the square of the velocity, and not the elevation.",
 ["All three, since every term in the return is formed from the velocity that opening the bore lowers.",
  "The friction alone, since the fittings term is a count taken from the isometric and a count does not change.",
  "The elevation and the friction, since a wider pipe holds a shorter column for the same volume of liquid, and the fittings term is the one that is fixed by the drawing rather than by the pipe."],
 "Friction is what a bigger pipe fixes. Elevation is what no pipe fixes: the static column is the density times the height, and a wider pipe holds a wider column of exactly the same height."),

q(0, "What does the erosional ceiling depend on, and what is it blind to?",
 "The density and the c factor. It is blind to the bore, which is why it reads 13.545709 ft/s on every row of the twelve-bore sweep.",
 ["The density, the c factor and the bore, since the check compares a velocity against a ceiling and both halves of that comparison change when a different row of the schedule is evaluated.",
  "The velocity and the c factor, since the ratio of 0.165707 is what the check actually returns and a ratio needs both a line velocity and a service condition before it means anything.",
  "The density and the bore, since the ceiling is really a rate limit expressed as a velocity."],
 "What changes down the sweep is the velocity that has to sit under the ceiling, running from 38.027872 ft/s to 0.635441 ft/s while the ceiling sits still."),

q(1, "Why is this tier described as closed form from end to end?",
 "Because nothing in the chain waits on anything except the friction factor, which iterates and then hands back a settled number the rest of the chain uses as an input.",
 ["Because every step in it can be written as a single expression, the friction factor included, and evaluated in one pass.",
  "Because the three losses are returned separately, so no term has to be solved against another one at all.",
  "Because the fluid is incompressible, which is the only property a closed form needs anywhere in this chain."],
 "The area is arithmetic, the velocity is a division and the Reynolds number is a product of four settled figures. Both of the tier's defining properties change in the next tier."),

q(3, "Nothing in the OGBIA line compresses, so a barrel entering it is a barrel leaving it. What would change if it did compress?",
 "The density would depend on the pressure, which is the quantity being solved for.",
 ["The engine would refuse the line, since a density that varies along the run is one of the eighteen states Section 1 lists as having no answer at all in this method.",
  "Only the erosional ceiling would move, since it is the one figure in the tier built from the density, and the friction chain reads the density solely through the Reynolds number.",
  "Nothing in the reported numbers, since the density is taken at the inlet and the loss is reported over the whole line, so compressibility would reach the answer only through the gradient."],
 "The velocity of 2.244621 ft/s stands at both ends because the density of 54.500000 lb/ft3 does. Let the fluid compress and the whole method changes shape."),

q(0, "A graded question hands over a line and asks for a friction factor. What has to be read before the figure is used?",
 "The regime the engine reports, because the two branches are different laws and the band between them is labelled rather than correlated.",
 ["The relative roughness, because it is formed from the roughness and the bore and a question that states an absolute roughness has not yet stated the quantity the correlation actually reads.",
  "The c factor, because a graded question always states one and both are reported on every row of the sweep.",
  "The length, because the friction factor is solved over the length of the pipe it belongs to."],
 "On OGBIA the Reynolds number of 48431.2523 is reported turbulent and the friction factor is 0.0218149625. Inside the band from 2100 to 4000 the label and the arithmetic disagree."),

q(2, "Which input's unit is worth checking before any arithmetic, and why that one?",
 "The length, because liquid work here is in feet while gas work is in miles, and the loss scales directly with the length.",
 ["The viscosity, because the Reynolds number is dimensionless and so carries no unit that could look wrong, and a centipoise mistaken for another unit still selects a branch and still prints.",
  "The bore, because a nominal size and a bore are both quoted in inches and both print as ordinary numbers.",
  "The density, because it enters twice, once in the Reynolds number and once in the velocity head, so a unit error in it moves the friction factor and the loss in the same direction at once."],
 "The engine accepts 5280.000000000 ft as a rise on a line 1.000000 mile long, so it knows the difference exactly. Both feet and miles are ordinary numbers and the answer comes back wrong by whatever the confusion was worth."),

q(3, "Why does a graded erosional question in this course always state its own c factor?",
 "Because the three published rows are held for the literature and are never graded.",
 ["Because the three rows at 100.000000, 125.000000 and 175.000000 are overridable, so a question has to say which of them the engine was called with before the answer can be reproduced at all.",
  "Because the recommended practice gives different c factors for liquid and for gas service, so a question about a crude line has to name which of the two families of figures it intends.",
  "Because the c factor is the only input to the erosional velocity that the engine does not default, so a question that omitted it would receive a refusal rather than a number from the check."],
 "The recommended practice describes its own figures as conservative and the third row is operator practice with no publication behind it. An answer computed at a remembered c factor is a correct calculation of something nobody asked for."),

q(1, "A velocity comes back from a hand calculation wildly larger than anything the sweep reports. What is the likely cause?",
 "One of the barrel, the day or the 144 went missing on the way from a rate in bpd to a velocity in ft/s.",
 ["The regime was read as turbulent when the line is laminar, since the two branches give friction factors an order apart and the velocity is formed from the friction factor and the loss.",
  "The erosional ceiling was used in place of the line velocity, since both are reported in ft/s and the ceiling of 13.545709 ft/s is several times the velocity of any sensible export line.",
  "The bore was read from the nominal size rather than from the schedule row."],
 "The chain from 12000.000000 bpd to 2.244621 ft/s runs through a flow area of 0.347410 ft2, the barrel of 5.6145833333333 cubic feet and the 86400.000000 seconds in a day."),

q(0, "A friction factor comes back above one. What does that say about the line?",
 "That it is laminar, so the regime is worth re-reading. The published case at 150.0000 bpd returns 4.1163843599 at a Reynolds number of 15.5476.",
 ["That the relative roughness was entered as an absolute roughness in inches, since a value of 0.001800 in used directly as a fraction of the bore drives the wall term far past anything physical.",
  "That the iteration failed to converge, since the turbulent law is solved by repeated substitution.",
  "That the velocity head was included twice, since a friction factor is dimensionless to begin with."],
 "The turbulent rows of the published cases sit at 0.0260878890, 0.0260794714 and 0.0249265571. The laminar branch puts the factor an order above those, and it is the only one of the four above one."),

q(2, "A question asks for the friction loss and another asks for the total. When are those different questions?",
 "Whenever a hill or a fitting list is in play. The second published case spends 56.140803 psi of friction inside a total of 153.516220 psi.",
 ["Whenever the line is laminar, since the engine reports the fittings term against the turbulent velocity head.",
  "Whenever the resistance sum is zero, since the engine then reports the fittings term as absent altogether.",
  "Never, on a liquid line, since the engine keeps the three terms apart in the return and the total is reported for convenience rather than as a separate answer to a separate question."],
 "On the level OGBIA line with no fittings the two are the same 25.660631 psi. Report the total and the terms behind it, because the question will have stated the hill or the list."),

q(3, "What does this tier hold for the literature, and what does it say about it?",
 "The three c factors, because the recommended practice calls its own figures conservative and the third row is operator practice.",
 ["The pipe schedule and the roughness catalogue, since both are vendored tables the engine reads rather than computes, and nothing in this course stands behind the twelve bores or the four wall conditions.",
  "The band between 2100 and 4000, since the engine computes it on the turbulent branch while labelling it transitional, and a figure computed on the wrong branch cannot be graded in any tier.",
  "The published liquid cases, since they come from an oracle rather than from a measured pipeline."],
 "Every graded erosional value in this course therefore states its own c factor. The discipline is to say what the method is and not to rest a conclusion on the part of it that nothing stands behind."),

q(0, "Seven bores pass both criteria and two of them have a claim to being the recommendation. What is the disagreement actually about?",
 "What the word smallest was taken to mean. The first in table order is 6 in schedule 40 at 6.065000 in and the smallest bore is 6 in schedule 80 at 5.761000 in.",
 ["Which criterion ranks first, since the erosional limit applied before the 6.000000 ft/s ceiling leaves other survivors.",
  "Whether the schedule 80 row is affordable, since a heavier wall is dearer and the sweep carries no price at all.",
  "Which of the two bores the built line used, since the 8 in schedule 40 row at 7.981000 in is neither of them."],
 "The first is the smallest nominal size that works, which is what a buyer wants, and the second is the tightest bore that works. A recommendation that does not say which it ranked has not said much."),

q(2, "What is the one habit this tier warns against carrying forward?",
 "Carrying a number to another line. Every figure belongs to a complete row, and the method travels where the numbers do not.",
 ["Reading a refusal as a failure of the run, since an object carrying an error is the method reporting honestly on a state it has no answer for and other rows of a sweep still return numbers.",
  "Quoting a friction factor without the Reynolds number and the relative roughness behind it, since neither of those survives a change of bore and the bore sits inside both of them.",
  "Reporting the friction loss as the pressure drop, since it is one of three terms kept apart."],
 "25.660631 psi belongs to that rate through that bore over that length on that roughness. The same duty through 6.065000 in spends 97.306913 psi."),

emit(Q, '/root/fc-wip-linesizing/banks/fc2b_m06.json', expect_n=15)
finish()
