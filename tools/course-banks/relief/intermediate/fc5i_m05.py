import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Professional m05, the knockout drum and the settling behind it.
# Digest sections 17, 18 and 19, at the rendering those sections print.
# The held drag correlation is taught as a limit and never as an answer.

q(2, "What does a horizontal knockout drum have to satisfy, in one sentence?",
 "The vapour takes longer to cross the drum than a droplet takes to fall out of it.",
 ["The vapour velocity stays below the settling velocity of the design droplet.",
  "The vapour space holds at least as much volume as the liquid the header can deliver.",
  "The droplet falls further than the drum diameter over the length of the drum."],
 "Two times are compared: a transit time along the length and a fall time down through the vapour space. At a candidate diameter the engine returns the length that comparison demands.")

q(0, "What is the holdup input to the drum route a fraction of?",
 "The diameter, since it is the liquid level as a level instrument reads it.",
 ["The circular cross-section, since it is the liquid area fraction of the drum.",
  "The drum volume, since it is the inventory the drum is allowed to keep.",
  "The vapour depth, since it is what the droplet has to fall through."],
 "Everything else follows from that convention. The vapour cross-section is the exact circular segment above the level, and the distance a droplet falls is the vapour depth.")

q(3, "Which four of the returned fields exist so a reader can see what the fraction they typed was taken to mean?",
 "The liquid depth, the segment area fraction, the vapour area and the fall distance.",
 ["The vapour velocity, the required length, the L over D and the note, which are the four that restate the level fraction.",
  "The liquid depth, the vapour area, the required length and the L over D.",
  "The segment area fraction, the vapour velocity, the fall distance and the note."],
 "Those four say what the route did with the level fraction before it reached a length. The convention is visible rather than inferred.")

q(1, "A circle is filled to a depth fraction of 0.100000. What fraction of its area is liquid?",
 "0.052044, so the area fraction sits well below the depth fraction there.",
 ["0.100000, since the two agree wherever the segment is small.",
  "0.947956, which is the vapour area fraction at that depth.",
  "0.195501, which is the area fraction at a depth fraction of 0.250000."],
 "Read the table at 0.750000 as well, where the liquid area fraction is 0.804499. The two readings get a long way apart in both directions.")

q(2, "Between an empty circle and a full one, at what depth fraction does the area fraction equal the depth fraction?",
 "At 0.500000, where the area fraction is 0.500000000000.",
 ["At 0.250000 and again at 0.750000, where the two tables cross.",
  "At every depth, since the area fraction is the depth fraction of a circle.",
  "At 0.100000, where the area fraction is 0.052044."],
 "The segment area fraction at half depth is 0.500000000000. A drum sized by typing an area fraction into a level fraction field is sized for the wrong vapour space, and the answer comes back looking entirely normal.")

q(0, "This academy answers the settling question three times. Which answer does this course own?",
 "The API 521 drag-coefficient method, iterated against the Reynolds number.",
 ["The Souders-Brown allowable velocity, with its K value.",
  "The Turner and Coleman criteria for a droplet in a rising gas.",
  "The transit time against the fall time in a horizontal drum."],
 "Gas well loading owns drag against weight with Turner and Coleman, and Separation and Slug Catching owns Souders-Brown and the critique of borrowing it. This course re-derives neither.")

q(1, "The settling group comes back as 0.000140743657 at 100 micron, at 200 micron, and again at 0.02 cp. What do those three equalities establish?",
 "That the group carries neither the droplet size nor the viscosity, so what is left is the coefficient, gravity and the unit conversion.",
 ["That the settling velocity is independent of the droplet size and of the viscosity.",
  "That the drag coefficient is constant across that range, which is why the group does not move.",
  "That the group is the balance itself, so any input reproduces it and the equality proves nothing."],
 "The velocity itself moves a great deal across those cases. It is the group formed from the returned pair that does not, which is what separates the size conversion from the rest of the balance.")

q(3, "Divide that group by standard gravity in ft/s2 and 1.333333333333 is left. What is that figure?",
 "The coefficient of the balance squared, times the foot per micron.",
 ["The coefficient of the balance, times the foot per micron.",
  "The drag coefficient at the droplet size the group was measured at.",
  "The ratio of the group at 100 micron to the group at 200 micron."],
 "The balance is a coefficient times the square root of a group, so squaring the velocity squares the coefficient. What remains after gravity is taken out is that square and the unit conversion.")

q(0, "The first two rows of the droplet sweep both return a drag coefficient of 240.000000. What is that?",
 "The low-Reynolds cap of the correlation, measured at 240.000000000000.",
 ["The drag coefficient of a sphere in creeping flow at those Reynolds numbers.",
  "The largest drag coefficient the iteration is allowed to try before it gives up.",
  "The value the correlation returns wherever it has not converged."],
 "The Reynolds number just inside that cap is 0.104182271364. Below there the fit would keep climbing and the cap holds it, so the balance becomes an explicit expression and the loop finishes quickly.")

q(2, "The dropout route returns a velocity of 4.005010 ft/s together with a drag coefficient of 1.026414. Why are the two returned as a pair?",
 "Because the engine recomputes the velocity from the coefficient it is about to return, so the pair can be put back into the balance.",
 ["Because the drag coefficient is the input the caller has to supply on the next call.",
  "Because the velocity alone cannot be converted out of SI without the coefficient beside it.",
  "Because the pair is what the published rows carry, so quoting both is what lets a reader match a row."],
 "Quote one without the other and you have quoted half of a solution. That call converged in 19 passes on a residual of 0.000000000000.")

q(3, "Read the pass count down the droplet sweep. Where is it smallest and where largest?",
 "Smallest at 5.000000 micron with 3 passes, largest at 60.000000 micron with 44.",
 ["Smallest at 6000.000000 micron with 9 passes, largest at 5.000000 micron with 3.",
  "Smallest at 5.000000 micron with 3 passes, largest at 6000.000000 micron with 9.",
  "Smallest at 400.000000 micron with 19 passes, largest at 60.000000 micron with 44."],
 "Inside the cap the coefficient is a constant and the loop finishes in three or four passes. Just outside it the fit is steepest in the Reynolds number, so the loop takes many small steps to settle.")

q(1, "Walk the diameter from 5.000000 ft to 14.000000 ft at the same duty. What happens to the required length?",
 "It falls from 12.648469 ft to 4.517310 ft, as the vapour velocity falls with it.",
 ["It falls from 12.648469 ft to 4.517310 ft, while the vapour velocity rises to fill the wider drum.",
  "It rises from 4.517310 ft to 12.648469 ft, because a wider drum needs a longer settling path.",
  "It falls from 12.648469 ft to 4.517310 ft, and the L over D holds at 2.529694 throughout."],
 "A wider drum gives more vapour cross-section, so the vapour crosses it more slowly and less length is needed to give a droplet time to fall. Both columns fall the whole way down.")

q(0, "The required length is not monotonic in the holdup. What two effects are fighting?",
 "Filling the drum speeds the vapour up, which needs more length, and shortens the fall, which needs less.",
 ["Filling the drum slows the vapour down, which needs less length, and lengthens the fall, which needs more.",
  "Filling the drum raises the liquid area fraction, which needs more length, and lowers the depth fraction, which needs less.",
  "Filling the drum raises the dropout velocity, which needs less length, and raises the vapour velocity, which needs more."],
 "Across the whole sweep the required length runs from 6.997154 ft to 44.344927 ft, a spread of 37.347773 ft, while the vapour velocity runs from 3.340002 ft/s to 1973.354184 ft/s.")

q(3, "Where are the two edges of the L over D note, and what sits between them?",
 "The smaller-drum note ends at 2.000000000000 and the go-wider note starts at 6.000000000000, with silence between.",
 ["The smaller-drum note ends at 2.000000000000 and the go-wider note starts at 6.000000000000, with a third note between.",
  "The go-wider note ends at 2.000000000000 and the smaller-drum note starts at 6.000000000000, with silence between.",
  "The note fires below 0.780770 and above 2.529694, which are the two extremes of the diameter sweep."],
 "Both edges are bisected out of behaviour rather than read off constants. The stated drum at 9.000000 ft and a holdup of 0.300000 carries an L over D of 0.780770, so it sits below the lower edge and carries the note.")

q(2, "Six distinct holdup fractions appear in the published drum rows. What does that buy the set?",
 "It lets the set tell a route that reads the holdup from one that ignores it.",
 ["It lets the set cover the whole range over which the required length is monotonic.",
  "It lets the set recover the segment area fraction by fitting six points.",
  "It lets the set check the dropout velocity at six different droplet sizes."],
 "Every one of those rows carries its dropout velocity as an input column, at 1.730000 ft/s on five rows and 2.400000 ft/s on the sixth, so the set exercises the drum geometry with the settling fit out of the way.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/intermediate/fc5i_m05.json', label='fc5i_m05', expect_n=15)
finish()
