import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, beginner tier, The Efficient Frontier. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(2,
 "On OKONO's frontier point 3 sits at 120.0000 and 89.7500 and point 4 at 180.0000 and 127.7500. What is the best risked EMV a budget of 150.0000 million USD can buy?",
 "89.7500, the value of the lower point, because no whole set of OKONO projects costing between those two capexes does better.",
 ["A share of the 38.0000 that step 4 adds, priced at its 0.633333 per extra million USD over the 30.0000 above point 3.",
  "127.7500, since a frontier point is read as the value available to every budget from the point before it up to its own capex.",
  "The midpoint of the two values, since the frontier is a curve of best value and a budget halfway between two capexes earns halfway between their values."],
 "The frontier keeps a point only where the best value rises, so 89.7500 holds for every budget from 120.0000 to just short of 180.0000. No project can be funded in part, so none of the 38.0000 is bought early.")

q(0,
 "Step 3 of the OKONO frontier reads 1.616667 per extra million USD. What does that ratio measure?",
 "The trade of OK-3 for OK-1: 48.5000 of risked EMV gained for 30.0000 more capex.",
 ["OK-1's own return on capital, the risked EMV it earns for each million USD it costs, which is why it leads every ranking.",
  "The value of each single million from 90.0000 to 120.0000, any one of which could be spent to buy its share of the gain.",
  "The best project to add on top of point 2's set, since a step reports the project a larger budget brings in."],
 "Step 3 replaces OK-3 at 41.2500 with OK-1 at 89.7500. OK-1's own ratio is 0.747917 per million USD of its capex, so the 1.616667 belongs to the swap and not to the project.")

q(3,
 "The OKONO frontier shows a step of 3.2500 three times, at points 2, 5 and 11. What is that step?",
 "The same swap each time: OK-5 out and OK-3 in, a net 3.2500 for a net 30.0000 of capex.",
 ["OK-3 added on top of the set before at a diluted ratio, since its 41.2500 is spread across the capex of the projects already funded.",
  "Rounding residue the grid leaves between whole cells, repeated wherever a capex does not divide evenly into the cell size.",
  "Three different small projects that each happen to be worth 3.2500 of risked EMV once their fail costs are charged."],
 "OK-3 adds 41.2500 for 90.0000 and OK-5 takes away 38.0000 for 60.0000. On an exact grid of 1.0000 per cell there is no rounding to leave a residue.")

q(1,
 "A reader expects the step ratios on the OKONO frontier to fall as the budget grows, the way diminishing returns usually look. What does the frontier show?",
 "They need not fall: 0.108333 is followed by 1.616667, and 0.300000 by 1.191667, because each step is a change of whole sets.",
 ["They fall steadily once past point 3, where the best ratio anywhere on the frontier is reached and every later step is worth less.",
  "They fall on risked EMV but rise on success-case NPV, which is why the two curves cross close to the limit.",
  "They fall exactly as expected, and any rise is the grid's rounding at the one million USD cell."],
 "No project can be funded in part, so a step can swap a weak set for a strong one: step 7 buys 0.300000 and step 8 buys 1.191667 by trading OK-3 and OK-5 for OK-2.")

q(1,
 "With 450.0000 million USD to spend, a reader stops at frontier point 3 because its 1.616667 per extra million USD is the steepest step anywhere. What is the answer to the funding question?",
 "291.0000 at the limit, on OK-1, OK-3 and OK-4; a steep step is a good trade at its budget and not a reason to stop spending.",
 ["89.7500 on OK-1 alone at 120.0000, since the best use of capital is the point that earns the most per extra million USD.",
  "204.7500 at point 8, the last step whose ratio of 1.191667 stays above one, beyond which a million buys less than a million.",
  "287.7500 at point 10, since the final step's 0.108333 per extra million USD is capital spent for almost nothing."],
 "The question is what 450.0000 funds, and the frontier's last point answers it: 120.0000 plus 90.0000 plus 240.0000 costs 450.0000 and returns 291.0000.")

q(3,
 "OKONO's frontier point 10 sits at 420.0000 and 287.7500, one step short of the answer. Which set is behind it?",
 "OK-1, OK-4 and OK-5, the set a greedy ranking by EMV per million USD produces.",
 ["OK-1, OK-3 and OK-4 with 30.0000 left unspent, since the optimum's projects are printed at a capex the grid rounded down.",
  "OK-1 and OK-4 plus a share of OK-3, the part of the exploration well that the 60.0000 left over could pay for.",
  "OK-2, OK-4 and OK-5, the set funded further along, printed at this point because the frontier lists sets in order of value."],
 "120.0000 plus 240.0000 plus 60.0000 is 420.0000 and 89.7500 plus 160.0000 plus 38.0000 is 287.7500. Greedy found a frontier point, and the last step swaps OK-5 for OK-3 for 3.2500 more.")

q(0,
 "The optimizer runs OKONO at a limit of 750.0000 million USD. Where does the frontier's last point sit, and why?",
 "At 690.0000 and 444.0000, with 60.0000 unspent, because no remaining project fits and OK-6 alone costs 310.0000.",
 ["At 750.0000 and 444.0000, because the last point is always printed at the limit whatever its set costs.",
  "At 1000.0000 and 588.0000, the value of all six projects, since a limit is rounded up to the next whole set.",
  "At 690.0000 with a grid undershoot, the coarse rounding that leaves a set out, which a finer cell would recover."],
 "A point is printed at what its set costs. OKONO solves on an exact grid of 1.0000 per cell, so the 60.0000 is genuine: OK-6 is the only project left and needs 310.0000.")

q(2,
 "The OKONO frontier ends at 450.0000 and 291.0000. What does it say about the chance that the funded set loses money?",
 "Nothing: it ranks on risked EMV alone, and the seeded Monte Carlo reports P(loss) 0.123600 for that set separately.",
 ["That it is small, because a set on the efficient frontier is by definition the one with the least risk at its budget.",
  "That it is the lowest of any set at 450.0000, since the optimizer breaks ties between equal values toward the set with less spread.",
  "That it matches the 600.0000 set's, since both sit on one frontier and share every point up to 450.0000."],
 "The last point is the best value, not the safest. At seed 20260829 and 10000 iterations the 450.0000 set shows P(loss) 0.123600 and the 600.0000 set 0.001800, and the frontier shows neither.")

q(3,
 "OKONO's best value at a budget of exactly 450.0000 million USD is 291.0000. What does one more million buy?",
 "0.0000: the value stays at 291.0000 until the budget reaches 480.0000, where it steps to 313.0000.",
 ["0.733333, the ratio of the next step, which is the price at which each extra million converts into risked EMV.",
  "0.108333, the ratio of the step just taken, carried forward as the going rate for more capital.",
  "0.633333, OK-5's own ratio, since OK-5 is the cheapest project and the one a small addition to budget funds first."],
 "The 0.733333 is 22.0000 over 30.0000, an average across a whole step. No project can be funded in part, so every extra million inside a step buys 0.0000.")

q(0,
 "A 450.0000 million USD programme is offered 600.0000. What is the honest figure for what the extra budget is worth?",
 "111.7500 of risked EMV for 150.0000 more capex, the difference between the two last points.",
 ["The sum of the four step ratios between the two budgets, each one a price that the next million can be bought at.",
  "OK-2's 115.0000, since the larger set is the smaller one plus OK-2.",
  "The last step's 0.108333 per extra million USD, carried across the 150.0000."],
 "402.7500 at 600.0000 less 291.0000 at 450.0000 is 111.7500. The step just taken reads 0.108333, yet later steps buy 0.733333 and 1.191667, so the step behind never prices the steps ahead.")

q(2,
 "Step 12 of the OKONO frontier reads 0.733333, close to OK-1's own 0.747917 per million USD. What does step 12 do to OK-1?",
 "It drops OK-1, funding OK-2, OK-4 and OK-5 at 480.0000 for 313.0000.",
 ["It brings OK-1 in, since a step whose ratio matches a project's own ratio is that project being added on top of the set.",
  "It keeps OK-1 and adds OK-5 to the 450.0000 answer, which is the 30.0000 of capex the step reports.",
  "Nothing to OK-1, since step 12 only trades OK-3 for OK-5 and leaves the two projects that carry the set untouched."],
 "180.0000 plus 240.0000 plus 60.0000 is 480.0000 and 115.0000 plus 160.0000 plus 38.0000 is 313.0000. Step 12 drops both OK-1 and OK-3 from the 450.0000 answer, so the resemblance of the ratios is a coincidence.")

q(1,
 "A 600.0000 million USD OKONO programme is cut to 450.0000, and the planner drops OK-2 from the funded set because it frees 180.0000. What does that leave?",
 "OK-1, OK-4 and OK-5 at 420.0000 for 287.7500, which is 3.2500 short of the solved answer.",
 ["The solved answer, since smaller optimal sets nest inside larger ones.",
  "The best value the smaller budget can buy, since a project left outside the larger set cannot come back at a smaller budget.",
  "A set with 30.0000 held back to buy part of OK-3."],
 "402.7500 less 115.0000 is 287.7500. The optimizer reaches 291.0000 by bringing back OK-3, a project the 600.0000 set did not fund, so no single drop reaches the answer.")

q(0,
 "A programme funded at 450.0000 million USD is raised to 600.0000, and the planner keeps OK-1, OK-3 and OK-4 and adds whatever still fits. Where does building up stop?",
 "At 329.0000 on 510.0000, after adding OK-5, since OK-2's 180.0000 no longer fits; solving again reaches 402.7500.",
 ["At 402.7500, since adding what fits to a solved set reproduces the solved set at the larger budget.",
  "At 402.7500 on 600.0000, after adding OK-2 and OK-5, the two projects the larger budget was always going to fund.",
  "At 313.0000 on 480.0000, the next frontier point, which is where a set built up from the smaller answer lands."],
 "291.0000 plus 38.0000 is 329.0000. The solved set at 600.0000 is OK-1, OK-2, OK-4 and OK-5, reached by giving up OK-3, so a funded set is a starting point for nothing.")

q(3,
 "The OKONO set funded at 600.0000 million USD sums to 473.0000 of success-case NPV, against 725.0000 for the set at 450.0000. Is the larger budget buying less value?",
 "No: risked EMV rises from 291.0000 to 402.7500, and success-case NPV falls because OK-3's 420.0000 success case leaves the set.",
 ["Yes, since success-case NPV is what the projects return when they work and the larger programme returns less of it.",
  "Yes, because the optimizer at 600.0000 fell back to a coarser grid and lost the exploration well to rounding.",
  "No, because success-case NPV is reported only for the smaller set and the 473.0000 is a partial total of the larger one."],
 "The optimizer maximises risked EMV, not success-case NPV. OK-3 is worth 420.0000 if it works and 41.2500 risked, so dropping it costs little value.")

q(2,
 "The frontier run to 600.0000 million USD and the frontier run to 450.0000 are compared point by point. What do points 0 to 11 show?",
 "The same capex and value at every point, ending both stretches at 450.0000 and 291.0000.",
 ["Higher values at the larger limit, because more projects become admissible and every budget has more sets to choose from.",
  "The same values up to point 10, then a lower point 11 on the larger run, since OK-3 is dropped from the set at 600.0000.",
  "Shifted capexes, since a longer run spreads its 2000 cells wider."],
 "The best value at a budget does not depend on how far past it the frontier is run. What changes at 600.0000 is which set wins at the limit, OK-1, OK-2, OK-4 and OK-5 at 402.7500.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/beginner/ec5b_m04.json', expect_n=15)
finish()
