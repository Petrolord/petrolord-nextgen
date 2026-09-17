import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Professional m04, the fire case end to end.
# Digest sections 15 and 16, at the rendering those sections print.
# Every row quoted is an engine return on the teaching case or a one-input change.

q(1, "The fire case runs as a chain. In what order do its steps have to be taken?",
 "Wetted area, then duty, then relief load, then required area, then orifice.",
 ["Relief load, then wetted area, then duty, then required area, then orifice.",
  "Wetted area, then relief load, then duty, then required area, then orifice.",
  "Duty, then wetted area, then relief load, then orifice, then required area."],
 "The duty needs the area, the load needs the duty, the required area needs the load and the relieving pressure together, and the letter needs the required area. Nothing in that sequence can be rearranged.")

q(3, "Six of the seven rows in the teaching chain name the route that produced them. Which row names none, and why?",
 "The relieving pressure of 347.450000 psia, because it is arithmetic outside any engine call.",
 ["The margin of 1.164566, because the selection route returns the letter and the caller forms the margin.",
  "The relief load of 34641.5255 lb/hr, because no route in the module computes a load.",
  "The wetted area of 683.6960 ft2, because geometry is the caller's own work."],
 "It is built from the set pressure, the overpressure fraction and the atmospheric constant, and the sizing route is handed the result. It is also the row where the unit changes from psig to psia.")

q(0, "The teaching case reaches a required area of 1.578271 in2. What does the selection return?",
 "Orifice K at 1.838000 in2, with a margin of 1.164566.",
 ["Orifice K at 1.838000 in2, with a margin of 1.354759.",
  "Orifice J at 1.287000 in2, with a margin of 1.164566.",
  "Orifice L at 2.853000 in2, with a margin of 1.282951."],
 "The smallest standard orifice at or above the required area is the one returned, and the margin says how much of that standard size the case is not using.")

q(2, "The margin printed beside an orifice letter is a ratio. Of what to what?",
 "The standard orifice area, to the required area it was selected for.",
 ["The required area, to the standard orifice area it was selected into.",
  "The standard orifice area, to the area of the next orifice down the ladder.",
  "The required area, to the required area the same case would need at the next overpressure allowance."],
 "A margin close to one means the case sits just inside its letter and a small increase in load pushes it to the next orifice. A large margin means the letter has room, and neither is a fault.")

q(3, "The teaching case states 21.000000 percent overpressure. Run the same case at 10.000000 percent and what happens?",
 "The relieving pressure falls to 317.200000 psia, the required area rises to 1.728783 in2, and the letter stays K.",
 ["The relieving pressure falls to 317.200000 psia, the required area falls to 1.128544 in2, and the letter moves to J.",
  "The relieving pressure rises to 476.700000 psia instead, the required area falls to 1.578271 in2, and the letter stays K.",
  "The relieving pressure falls to 317.200000 psia, the required area rises to 1.728783 in2, and the letter moves to L."],
 "A change in the required area only shows as a change in the answer when it crosses an orifice boundary, and this one does not.")

q(0, "Why does a larger overpressure allowance make the required area smaller?",
 "Because a critical nozzle passes more mass per unit area as the upstream pressure rises.",
 ["Because the allowance is applied to the relief load before the sizing route sees it.",
  "Because a larger allowance lowers the back pressure ratio and moves the case into critical flow.",
  "Because the allowance enters the area expression as the discharge coefficient does."],
 "The allowance raises the relieving pressure, and the same load through a higher pressure needs less flow area. That is the part most readers guess backwards, because an allowance sounds like a concession that ought to cost something.")

q(2, "Which figures in the teaching chain are identical at both overpressure allowances?",
 "The wetted area, the pool fire duty and the relief load.",
 ["The relieving pressure, the required area and the margin.",
  "The relief load, the required area and the orifice letter.",
  "Only the wetted area, since the duty carries the pressure through the environment factor."],
 "None of those three takes a pressure, so the allowance enters at the sizing step and only there. An input moves only the steps below where it enters.")

q(1, "Answer the drainage question false on the teaching case and hold everything else. What does the chain give?",
 "A duty of 7284617.9291 Btu/hr, a load of 56911.0776 lb/hr, a required area of 2.592873 in2 and orifice L.",
 ["A duty of 7284617.9291 Btu/hr, a load of 56911.0776 lb/hr, a required area of 2.592873 in2 and orifice M.",
  "A duty of 6796981.4402 Btu/hr, a load of 56911.0776 lb/hr and orifice L.",
  "A wetted area of 1031.7419 ft2, a duty of 7284617.9291 Btu/hr and orifice L."],
 "The wetted area is untouched at 683.6960 ft2, because the drainage answer is not geometry. One word moves the case one letter up the ladder.")

q(3, "Drop the environment factor to 0.3 on the teaching case. Which letter does the chain reach, and out of what duty?",
 "Orifice G, out of 1330234.5784 Btu/hr.",
 ["Orifice F, out of the same 1330234.5784 Btu/hr.",
  "Orifice G, out of 1336211.5771 Btu/hr instead.",
  "Orifice J, at 2217057.6306 Btu/hr."],
 "That factor multiplies the heat rate directly and carries through to 10392.4576 lb/hr and then to 0.473481 in2. It is a judgment that leaves no trace in the figure it produces.")

q(0, "Trim the level to 2.0 ft, then instead raise it to 8.0 ft. What do the two changes give?",
 "454.1771 ft2 leading to orifice J, and 1031.7419 ft2 leading to orifice L.",
 ["454.1771 ft2 leading to orifice G, and 1031.7419 ft2 leading to orifice L.",
  "454.1771 ft2 leading to orifice J, and 1031.7419 ft2 leading to orifice M.",
  "158.3363 ft2 leading to orifice J, and 1031.7419 ft2 leading to orifice L."],
 "Those are the two rows where the wetted area itself moves, and the change carries all the way through the duty, the load and the required area to a different letter each time.")

q(1, "The required area row of the teaching chain reports a branch. Which, and what does reporting it buy?",
 "Critical, so a reader can see which of the two gas expressions produced the area.",
 ["Critical, so a reader can see that the back pressure was never stated.",
  "Subcritical, so a reader can see that the relieving pressure sits below the critical ratio.",
  "Neither, because the fire case uses its own expression rather than the gas route."],
 "The branch is reported rather than assumed. Taking that branch apart is the Associate tier's work and this tier does not repeat it.")

q(2, "Look the latent heat up at the wrong pressure and 90 Btu/lb goes in instead of the stated figure. What comes back?",
 "Orifice L, reached through 49267.9473 lb/hr with the heat rate unmoved.",
 ["Orifice L, reached through 49267.9473 lb/hr, with a near-critical warning attached to it.",
  "Orifice K, since 4434115.2612 Btu/hr and 34641.5255 lb/hr are both unmoved by a property.",
  "Orifice K, reached through 44341.1526 lb/hr, which is the sweep row at 100.000000 Btu/lb."],
 "The required area becomes 2.244651 in2. A latent heat enters after the heat rate is finished, so one property lookup moves the letter and nothing fires on either case.")

q(0, "Read the teaching vessel standing up rather than lying down. What does the whole chain give?",
 "158.3363 ft2 of wetted shell, ending on orifice G.",
 ["226.1947 ft2 of wetted shell, ending on orifice G.",
  "158.3363 ft2 of wetted shell, ending on orifice F.",
  "683.6960 ft2 of wetted shell, ending on orifice K, since the steel and the level are unchanged."],
 "The chain runs on through 1336211.5771 Btu/hr, then 10439.1529 lb/hr, then 0.475609 in2. One word in one field, and the case lands two letters from where it lands lying down.")

q(3, "Two of the changes in the sweep are a single word each. Which, and which way does each move the letter?",
 "Drainage answered false takes K to L, and reading the vessel standing up takes K to G.",
 ["Drainage false takes K to G, and standing up takes K to L.",
  "Drainage false takes K to L, and standing up takes K to J.",
  "Drainage false takes K to M, and standing up takes K to G."],
 "Neither is a calculation error. Both are a description of the plant somebody entered, and the answer that follows is correct for the plant described.")

q(2, "Why is the sensitivity of the letter not the sensitivity of the required area?",
 "Because the ladder is a published table of discrete areas and a required area lands wherever it lands.",
 ["Because the selection rounds the required area to the nearest listed area rather than the next one above.",
  "Because the margin is applied to the required area before the selection reads it.",
  "Because the letters are evenly spaced in area, so a fixed change in area always moves the same number of letters."],
 "Two quite different required areas can share a letter, as the two overpressure allowances do, and two similar ones can fall either side of a boundary. Where a case sits inside its letter is what the margin tells you.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/intermediate/fc5i_m04.json', label='fc5i_m04', expect_n=15)
finish()
