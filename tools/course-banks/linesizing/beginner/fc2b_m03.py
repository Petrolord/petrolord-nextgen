import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Associate m03, Three Losses Kept Apart. Digest section 3, across the
# module's five lessons: the velocity head, friction along the pipe, fittings
# as a resistance sum, elevation as a static column, and the gradient.

q(2, "A resistance sum of one on the OGBIA line costs 0.029634 psi. What is that quantity built from?",
 "The density of 54.500000 lb/ft3 times the square of 2.244621 ft/s, over twice gc at 32.174000 lbm ft per lbf s2, and then over 144 to reach psi.",
 ["The friction factor of 0.0218149625 times the length over the bore, which is the group the fittings term shares with the pipe friction term and is where both of them get their pressure units.",
  "The density times the velocity over gc, with the 144 taking it to psi, so the head is proportional to the velocity itself.",
  "The velocity of 2.244621 ft/s over the flow area of 0.347410 ft2, scaled by the barrel and the day, which is the same conversion the velocity step ran and is why the two share a constant."],
 "gc reconciles the pound as a mass with the pound as a force and the 144 takes the answer to psi. Both of the pipe's pressure terms are that same square wearing different coefficients."),

q(0, "A line is resized so that it runs twice as fast at the same duty. What happens to the velocity head, and what follows from it?",
 "It is four times as large, because the velocity is squared, and both the friction loss and the fittings loss are built on it, so both follow the square.",
 ["It doubles, because the head is proportional to the velocity, and the fittings loss is a fixed cost per fitting and stays where it was.",
  "It is four times as large, and the friction loss follows it, but the fittings loss does not, because a resistance sum counts fittings.",
  "It is unchanged, because the head is a property of the fluid at its density, and the resistance sum carries whatever the velocity is doing."],
 "The friction loss is the velocity head times the friction factor times the length over the bore, and the fittings loss is the velocity head times the resistance sum. The square is what makes a fast line expensive."),

q(3, "What is a resistance sum, and what does a fitting cost before a velocity is put through it?",
 "A count of velocity heads, and nothing.",
 ["A pressure drop in psi accumulated from the fitting table, so each fitting already carries its own cost and the sum of the list is the fittings loss the line will report.",
  "An equivalent length in feet, added to the pipe length before the friction term is formed, which is why the same isometric is worth more on a short run than on a long one.",
  "A count of bends and valves on the isometric, so it is an integer, and the pressure it costs follows from the count and the bore without the velocity entering it at all."],
 "The OGBIA list comes to 4.500000 velocity heads and costs 0.133351 psi on that line. The count belongs to the shape of the fitting and the pressure belongs to the stream it is placed in."),

q(1, "On the OGBIA isometric, which single fitting contributes the most resistance, and how does it compare with the rest of the list?",
 "The swing check at 2.000000 velocity heads, which on its own is more than the four elbows contribute together at 1.200000.",
 ["The four long radius elbows, whose 1.200000 in total is the largest entry on the list because they are the most numerous, and a bend turns the whole stream through a right angle.",
  "The sudden exit at 1.000000, since the stream loses the whole of its velocity head on leaving the pipe and no other fitting on the list can cost more than one entire head.",
  "The two gate valves at 0.300000 together, because a valve stem sits permanently in the flow path."],
 "The four K totals are 1.200000, 0.300000, 2.000000 and 1.000000, summing to 4.500000. A check valve holds a disc in the path of the flow every second of the line's life."),

q(0, "The same fittings are placed on the full 26400.000000 ft line and on a 300.000000 ft manifold run at the same duty. What moved between the two cases?",
 "The pipe. It spends 25.660631 psi on the long line and 0.291598 psi on the short one, while the fittings cost 0.133351 psi in both.",
 ["The fittings. They cost 0.133351 psi on the long line and 0.313805 psi on the short one, because a shorter run puts them closer together and their disturbances no longer settle out between them.",
  "Both terms fell with the length, the pipe from 25.660631 psi to 0.291598 psi and the fittings from 0.133351 psi to 0.005170 psi.",
  "Neither term moved, and only the share changed, because the share is computed against the total rather than against the pipe friction and the total is what the shorter length altered."],
 "The share runs from 0.005170 of the total on the long line to 0.313805 on the manifold run. The rule that follows is about the length: ask what the pipe is spending before deciding whether the isometric matters."),

q(2, "The friction loss multiplies three things together. Which of them does the length sit in, and what follows?",
 "The length over bore factor, and nothing in the friction factor or the velocity head depends on how long the pipe is, so the loss follows the length directly.",
 ["The velocity head, since the head is the pressure the stream carries over the whole run of the pipe, so a longer line carries more of it.",
  "The friction factor, since Colebrook is solved over the length of the pipe and a longer line gives the iteration more wall to settle against.",
  "All three, since the length reaches the Reynolds number through the velocity as well, so doubling a line more than doubles the loss."],
 "The same duty and the same fittings over 300.000000 ft spend 0.291598 psi of pipe friction against 25.660631 psi over 26400.000000 ft. That proportionality lets a loss be scaled along a route."),

q(3, "The OGBIA line as built reports friction 25.660631 psi, fittings 0.000000 psi, elevation 0.000000 psi and a total of 25.660631 psi. What does the fittings term of zero mean?",
 "That the call carried a resistance sum of zero, which is a perfectly legal line with no fittings.",
 ["That the engine could not read the isometric, so it returned the term as zero rather than refusing, which is the one place in the liquid chain where a missing input is defaulted instead of refused.",
  "That the fittings on the isometric are present but too small to register against 25.660631 psi of pipe friction, so the term rounds to zero at the six decimals the engine prints.",
  "That the fittings term is only returned when a hill is present, because the engine forms the fittings and elevation terms together in the same step and reports them as a pair."],
 "The published liquid cases carry resistance sums of 0.000000, 4.500000 and 2.000000, and the ones at zero return a fittings loss of 0.000000 psi. The term is present as a zero rather than as an absence."),

q(1, "The OGBIA line is run level, then up 420.000000 ft, then down 420.000000 ft. Which column of the result does not move, and why?",
 "The friction column, which reads 25.660631 psi on all three rows, because the hill changed nothing about the rate, the bore, the roughness or the viscosity.",
 ["The total column, which reads 25.660631 psi on all three rows, because the engine adds the static column to the inlet pressure instead.",
  "The gradient column, which reads 0.0009719936 psi per ft on all three rows, because the gradient divides the friction term by the length and the elevation term is reported separately from it.",
  "The elevation column, which reads 158.958333 psi on all three rows, because the hill is the same 420.000000 ft in both tilted directions."],
 "The elevation term is symmetric about zero at 0.000000, 158.958333 and -158.958333 psi. A hill is added to a pressure drop rather than mixed into it."),

q(0, "A liquid line returns a total of -133.297702 psi. What is that describing?",
 "A descent where the line gains more from the fall than it spends on friction, so the fluid arrives at a higher pressure than it left.",
 ["A refusal expressed as a number, since the engine has no error channel on the total and reverses the sign instead.",
  "A line whose elevation change exceeds its own length, which is the state the engine guards against, reported as a negative total rather than as a message on this particular call.",
  "An arithmetic underflow in the elevation term, which is why only the combined figure carries the sign."],
 "The friction term inside it is still positive and still real. The published case at 800.0000 bpd dropping 60.000000 ft does the same thing: 14.550645 psi of friction against -26.000000 psi of elevation."),

q(2, "On the published case at 20000.0000 bpd through 10.020000 in over 52800.000000 ft, climbing 250.000000 ft, which of the three terms is the largest?",
 "The elevation, at 97.222222 psi, against 56.140803 psi of friction and 0.153195 psi of fittings inside a total of 153.516220 psi.",
 ["The friction, at 56.140803 psi, which is the usual situation on a long line because the friction term grows with the 52800.000000 ft while a static column depends only on the height.",
  "The fittings, at 0.153195 psi, once the resistance sum of 4.500000 is scaled by the velocity head of a line running at 2.373400 ft/s, which is faster than OGBIA and so carries a larger head.",
  "They cannot be ranked from the return, because the engine reports only the total of 153.516220 psi."],
 "That is an ordinary situation on a route with relief in it, and it is the reason the engine declines to blend the terms. The answer to a friction problem and the answer to an elevation problem are different equipment."),

q(3, "A total is dominated by its elevation term. What does buying a larger bore do about it?",
 "Very little, because a wider pipe holds a wider column of exactly the same height.",
 ["It fixes it in proportion to the square of the bore, because the static column is the density times the height times the flow area, so a wider pipe spreads the same weight over more area.",
  "It fixes it as effectively as it fixes friction, since both terms are returned in psi and both are reduced by the fall in velocity that a larger bore produces at the same duty.",
  "It makes it worse, because a larger bore slows the stream and a slower stream spends longer under the full weight of the column, which is what the elevation term is measuring."],
 "Friction is what a bigger pipe fixes: open the bore, the velocity falls, the head falls with its square and the friction collapses. Elevation is what no pipe fixes."),

q(1, "What is the gradient, and what does it do to the three terms the engine kept apart?",
 "It is the total loss divided by the length, so it divides their sum and puts back together what the engine separated.",
 ["It is the friction loss divided by the length, so it reports the pipe's own cost per foot and leaves the fittings and the elevation out of the figure entirely, which is what makes it comparable.",
  "It is the total loss divided by the length in miles, which is the unit a route is costed in, and it is the one place in the liquid chain where the engine works in miles rather than feet.",
  "It is the outlet pressure divided by the inlet pressure, expressed per foot."],
 "On the level OGBIA line the gradient is 0.0009719936 psi per ft. Nothing in a gradient on a tilted line says which of friction and elevation is doing the work."),

q(0, "The level OGBIA line reports a gradient of 0.0009719936 psi per ft and the same line up 420.000000 ft reports 0.0069931426. What is the whole of the difference?",
 "The hill. Both rows describe the same pipe carrying the same crude at the same velocity, and the friction term is identical on both.",
 ["The change in velocity, since a climbing line runs slower against the static column and a slower stream sits at a different point on the friction curve, which the gradient then averages over.",
  "The fittings, since the isometric's 4.500000 velocity heads are in the tilted total and left out of the level one.",
  "The length, since the engine measures a climbing line along the slope rather than along the ground."],
 "The level row is 25.660631 psi and the tilted row is 184.618965 psi over the same 26400.000000 ft. Every bit of the difference between the two gradients is the 158.958333 psi of static column."),

q(2, "A gradient comes back as -0.0050491554 psi per ft and is quoted as a magnitude. What has that done?",
 "It has turned a line that arrives strong into a line that arrives weak, because the negative sign says the line gains pressure along its length.",
 ["It has made no difference, since a gradient is an average over the whole length and the sign belongs to the elevation term rather than to the average, which is reported unsigned by convention.",
  "It has doubled the apparent loss, because dropping the sign adds the recovered static column to the friction instead of subtracting it.",
  "It has made the figure comparable with the level line's 0.0009719936 psi per ft, which is how a gradient is usually quoted."],
 "The downhill row totals -133.297702 psi over 26400.000000 ft. The sign is doing real work, and a gradient taken as a magnitude reverses what the line is actually doing."),

q(3, "A line climbs and then descends and one average gradient is reported for it. Which question does that single figure still settle?",
 "What the total loss over the whole route is.",
 ["What the pressure is at a point in the middle, since an average over a uniform slope describes the pipe honestly at any station along it and a line with two slopes is two uniform slopes.",
  "What the friction term is worth on its own, since the fittings and the elevation are reported separately and the gradient is formed from the friction alone before the other two are added.",
  "Which of friction and elevation is doing the work, since a gradient above the level line's 0.0009719936 psi per ft could only have been raised by a static column acting over the route."],
 "The gradient is the total divided by the length, so multiplying it back recovers what it divided. It also puts the three terms back together, and on a line that climbs and then descends the middle is a separate question."),

emit(Q, '/root/fc-wip-linesizing/banks/fc2b_m03.json', expect_n=15)
finish()
