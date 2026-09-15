import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Expert m03, The Family of Vessels. Digest section 15.

q(1, "A sweep returns a preferred diameter. Which tests produce it, and in which order are they applied?",
 "Feasible first, so the vessel carries its gas and clears its droplet verdicts, then inside the band that was passed in, and only then the smallest of whatever survived both of those tests.",
 ["Smallest first, then feasible, then in band, so the list is walked from the smallest diameter upward and the first row that answers to both flags is taken.",
  "In band first, then the first such row in the order the diameters were supplied, which is the rule the sweep applied before FC1-0.",
  "Feasible first, then the largest surviving row, so the recommendation carries the most gas margin the vendor list can offer."],
 "ABANA-2 prefers 7.000000 ft with preferredStatus selected. Diameter drives cost and every larger feasible row also works, so smallest is an economic tie-break applied after the engineering tests.")

q(3, "ABANA-2 prefers 7.000000 ft in a band of 3.000000 to 5.000000. Why is the 8.000000 ft row passed over when it is feasible?",
 "Its slenderness of 2.908817 is below the band, so inRange is false and it never reaches the size comparison.",
 ["Its length of 23.270539 ft is shorter than the 30.394173 ft of the 7.000000 ft row, and the sweep prefers the longer vessel where both of them carry their gas.",
  "It is infeasible on gas capacity in the same way as the 5.000000 ft and 6.000000 ft rows, which is what the reason list of ld-out-of-band is recording on that row.",
  "It sits later in the diameter list than 7.000000 ft, and where two rows both qualify the sweep keeps whichever one it met first while it was walking the list."],
 "The 8.000000, 9.000000 and 10.000000 ft rows are all feasible and all below the band at 2.908817, 2.042955 and 1.489314. The 7.000000 ft row at 4.342025 is the only row that clears both tests.")

q(0, "Widen the ABANA-2 band from 3.000000 to 5.000000 out to 3.000000 to 7.000000. What changes in the table, and what does the preference do?",
 "The 6.000000 ft row becomes inRange true and stays infeasible on gas capacity, so its reason list drops ld-out-of-band and keeps gas-capacity, and the preference holds at 7.000000 ft.",
 ["The 6.000000 ft row becomes inRange true and feasible, and the preference moves down to it because it is the smaller of the two qualifying vessels.",
  "The 5.000000 ft row at a slenderness of 11.914516 comes into the band as well, and the preference moves to it as the smallest row now in range.",
  "Nothing changes anywhere in the table, because the band is compared against the slenderness and no slenderness moved."],
 "Preferred stays 7.000000 ft with status selected. A band is an input about shape, so it can move inRange and the reason list, and it can never make a row that fails on gas carry its gas.")

q(2, "Before FC1-0 the sweep took the first row inside the band. What would that rule have returned for ABANA-2 once the band was widened to 3.000000 to 7.000000?",
 "6.000000 ft, a vessel that cannot carry its gas, because somebody widened a preference about shape.",
 ["7.000000 ft, since the retired rule read the feasible flag too.",
  "5.000000 ft, the first row in the list order.",
  "No row at all, because the retired rule refused to answer once more than one row in a family had come into the band it was given."],
 "The 6.000000 ft row is inRange true, feasible false, reasons gas-capacity. That is the test the repair was built to pass, and the repaired answer stays at 7.000000 ft.")

q(1, "inRange and feasible are reported as two separate flags. What does each one answer?",
 "inRange asks whether the slenderness sits inside the band that was typed in, and feasible asks whether the vessel carries its gas and clears its droplet verdicts.",
 ["inRange asks whether the diameter appears in the vendor list that was swept, and feasible asks whether the length that resulted can be fabricated at that diameter.",
  "inRange asks whether the vessel works and feasible asks whether it is the shape the plot wants, which is why the 8.000000 ft row reads feasible true.",
  "Both ask the same question from different ends, which is why every row that is out of band is also infeasible."],
 "The two are independent and all four combinations occur. On ABANA-2 the 8.000000 ft row is feasible and out of band, while the 5.000000 ft row at 11.914516 is neither.")

q(0, "A row comes back with reasons gas-capacity and ld-out-of-band. Which of those two set feasible to false?",
 "gas-capacity, because it says the vessel failed to do the job, while ld-out-of-band records a preference about shape that was itself an input to the sweep.",
 ["ld-out-of-band, because a slenderness outside the band is the one objection a sweep is asked to enforce, and the band of 3.000000 to 5.000000 is what the plot can physically take.",
  "Both of them, which is why rows carrying two reasons are the infeasible ones in every published family.",
  "Neither, since feasible is set from the margin and the reason list is printed beside it for the reader."],
 "The reason vocabulary is gas-capacity, ld-out-of-band, water-carryover and none. On ABANA-2 the 8.000000 ft row carries ld-out-of-band alone and still comes back feasible true.")

q(3, "preferredStatus reads selected, none-feasible or none-in-band. What separates the two nulls?",
 "none-feasible means no row works at all, and none-in-band means feasible rows exist and none is shaped the way the band asks.",
 ["none-feasible means the diameter list was empty or refused, and none-in-band means the list was swept and every row came back with a reason attached to it.",
  "none-feasible means the droplet verdicts failed and none-in-band means gas capacity failed, so the status names which of the two physical tests did the excluding.",
  "none-feasible means the band was wider than any row could satisfy, and none-in-band means the band was narrower than the vessels the vendor had to offer that day."],
 "They call for opposite actions. none-feasible sends the stream, the specification or the diameter list back for change, and none-in-band is an argument about a band somebody typed.")

q(2, "The AGBAMI family at 500.000000 micron prefers 7.000000 ft. Tighten the water specification to 150.000000 micron and preferred is null with status none-feasible. What happened to the vessels?",
 "Nothing happened to the vessels: every row keeps its length and slenderness and every row now carries water-carryover.",
 ["Every row grew longer once the tighter specification was applied, and the lengths that resulted pushed all five slendernesses out of the band of 3.000000 to 5.000000.",
  "The 7.000000 ft row lost its gas margin at the smaller droplet size, so the reason list on it moved from none to gas-capacity and the sweep ran out of feasible rows.",
  "The band was re-judged against the new specification, so rows in range at 3.589407 fell out."],
 "The 7.000000 ft row still runs 25.125850 ft at a slenderness of 3.589407 and is still inRange true. A droplet verdict gates feasibility, because a vessel that carries water over has not separated the stream.")

q(1, "Leave the AGBAMI specification at 500.000000 micron and narrow the band to 4.000000 to 5.000000. Preferred is null with status none-in-band. What does that say about the vessels?",
 "Every one of them works: all five rows are feasible and all five carry ld-out-of-band alone, so the band asked for a shape none of the offered diameters makes.",
 ["Two of them work and three do not, which is the mix that produces none-in-band rather than none-feasible, since a family with no working row at all would have reported the other status.",
  "None of them works, since a status of null is only ever returned where the sweep found nothing it could recommend.",
  "The vessels are untested, because narrowing a band stops the sweep before the feasibility checks are run."],
 "The 7.000000 ft row at 3.589407 was preferred in a band of 3.000000 to 5.000000 and is out of range in a band of 4.000000 to 5.000000. No vessel got worse and the band stopped admitting any of them.")

q(0, "verticalUnsortedListSmallestFeasible has its 7.000000 ft and 8.000000 ft rows both feasible and both inside a band of 1.000000 to 2.000000. The repaired sweep prefers 7.000000 ft and the retired rule preferred 8.000000 ft. What produced the retired answer?",
 "The position of 8.000000 ft in the array it was handed, because the retired rule took the first row it met inside the band and the diameters had not been supplied in order.",
 ["Its slenderness of 1.040882 sits closer to the middle of the band of 1.000000 to 2.000000 than the 1.291345 of the 7.000000 ft row, and the retired rule broke ties on that distance.",
  "Its gas margin is the wider of the two feasible rows, and the retired rule broke a tie between qualifying vessels on the margin each one carried rather than on the diameter.",
  "Its length of 8.327054 ft is the shorter of the two, and the retired rule preferred the shorter vessel."],
 "A recommendation that depends on the order somebody typed the diameters is not a recommendation about vessels. The repaired rule takes 7.000000 ft because it is the smaller.")

q(2, "On horizontal2InBandButGasOverloaded the 7.500000 ft row has a slenderness of 4.706969 and a length of 35.302269 ft with inRange true, and the sweep prefers 8.500000 ft. What is wrong with the 7.500000 ft vessel?",
 "It is infeasible with reasons gas-capacity, so a well proportioned drum cannot carry the gas it was given.",
 ["Its length of 35.302269 ft exceeds what the sweep will recommend, so the answer moves up to the 27.484466 ft of the 8.500000 ft row on length grounds.",
  "Its slenderness of 4.706969 sits above the middle of the band of 3.000000 to 5.000000, and the sweep prefers the row nearest the centre of the band it was given.",
  "It carries water-carryover, which is the reason that gates feasibility on a horizontal family and the reason the retired rule was unable to see when it recommended it."],
 "The retired rule recommended it because it was the first in-band row. The repaired sweep passes over it to 8.500000 ft, slenderness 3.233467, length 27.484466 ft, reasons none.")

q(3, "d1ProbeVertical4ftGasOverloaded returns preferred null with status none-in-band. Why is it not none-feasible?",
 "Its 7.000000 ft and 8.000000 ft rows are feasible and out of band.",
 ["Because its 4.000000 ft row is inside the band of 3.000000 to 5.000000, and a status of none-feasible is only returned where no row is inside the band either.",
  "Because none-feasible is reserved for families whose rows fail on water carryover, and every failing row on this case fails on gas capacity instead.",
  "Because the sweep found a feasible row inside the band and then rejected it on size, which is the situation the none-in-band status was added to report."],
 "The 4.000000 ft row is inRange true and feasible false on gas capacity, while the 7.000000 ft and 8.000000 ft rows are feasible with ld-out-of-band. Feasible vessels exist, so the band is the thing to revisit.")

q(1, "A sweep returns none-feasible and an engineer widens the band to bring more rows in. What will that achieve?",
 "Nothing at all, because no row in that family was ever excluded by its shape, and a band touches inRange and the reason list and reaches no further than that.",
 ["It will recover the rows that were excluded for slenderness, which on verticalNoneFeasible means the 2.000000 ft row at 21.616431 comes back into consideration.",
  "It will return a preferred diameter once at least one row is in band, since a status of none-feasible is a statement about the band rather than about the vessels.",
  "It will move the status to none-in-band, which is the status a family reports once its band admits rows that do not work."],
 "verticalNoneFeasible carries a band of 1.000000 to 10.000000 already, and its 3.000000 ft and 4.000000 ft rows are inRange true and infeasible on gas capacity. Widening changes neither flag.")

q(0, "A report quotes a preferred diameter of 7.000000 ft for ABANA-2 and nothing else. What has the reader not been given?",
 "The band it was asked in, along with the row behind it: a length of 30.394173 ft, a slenderness of 4.342025, two flags and a reason list, and the status word that says a vessel was actually selected.",
 ["The diameters that were swept, which is the only missing input, since the preference is a property of the vessel once the list is known.",
  "The gas margin on the row, which the sweep prints beside every diameter it reports on.",
  "The droplet specification, which matters on three-phase families and not on a two-phase one such as ABANA-2."],
 "7.000000 ft in a band of 3.000000 to 5.000000 and a null in a band of 4.000000 to 5.000000 are two honest answers about one family, so a preference quoted without its band has left out half the question.")

q(2, "The ABANA-2 rows at 5.000000 ft and 6.000000 ft both carry two reasons. What does that tell a reader about which of them is worse?",
 "Nothing: the reason list is a set of objections in no order, and what separates those two rows is a gas margin the list does not print.",
 ["The 5.000000 ft row is the worse of the two, because its slenderness of 11.914516 is further outside the band than the 6.894974 of the 6.000000 ft row.",
  "The 6.000000 ft row is the worse of the two, because it is nearer the band and so it is the row a reader is most likely to accept without checking it.",
  "They are equally bad, since two reasons on a row of a sweep is the worst score a row can be given and both of them carry it."],
 "Reasons are not a severity ranking. Both rows are infeasible on gas capacity and both are out of band, and the 5.000000 ft row needs 59.572579 ft of length against the 41.369847 ft of the 6.000000 ft row.")

emit(Q, '/root/fc-wip-separation/banks/fc1a_m03.json')
finish()
