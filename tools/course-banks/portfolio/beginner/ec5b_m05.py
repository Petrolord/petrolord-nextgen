import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC5 portfolio, beginner tier, The Exact Solve and Its Fallback. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC5 engine re-cut applied;
# written by tools/course-waves/portfolio/recut/build.py. Edit the rows there, then re-run it.

q(1,
 "Every OKONO limit from 300.0000 to 1000.0000 million USD reports solveMethod \"exact\" and optimalityGap 0.0000. What does that say about the 450.0000 answer?",
 "That OK-1 + OK-3 + OK-4 at 291.0000 is the true optimum on the capex as typed, with nothing left out.",
 ["Only that no project was refused; the set itself was rounded to whole million USD cells before it was chosen.",
  "That overLimit was checked and cleared, which is all an exact solve adds beyond the funded set.",
  "That the limit fell under the fallback's 2000 cells, so the grid had more cells than million USD."],
 "An exact solve reads the capex as typed, reports resolution null and optimalityGap 0.0000, and returns the optimum; OKONO at 450.0000 funds OK-1 + OK-3 + OK-4.")

q(3,
 "The published nonIntegerLimit case enters its money in million USD with a limit of 450.5000. How is it solved, and what is left unspent?",
 "Exactly on the figures as typed, funding A + B + D for 250.0000 and leaving 0.5000 unspent.",
 ["On the fallback grid at 450.5000 over 2000 per cell, since a limit that is not whole cannot be solved exactly.",
  "Exactly, after the engine rounds the limit down to 450.0000, so nothing is left unspent.",
  "It is refused, since a limit must be a whole number of million USD like every capex."],
 "nonIntegerLimit reports solveMethod exact, optimalityGap 0.0000 and resolution null; A + B + D costs 450.0000, so 0.5000 of the limit is idle because no project costs that little.")

q(0,
 "The published rawDollars case types every capex and the limit in whole USD, with a limit of 450000000.0000. What does the engine report?",
 "A + B + D for 250.0000, solveMethod \"exact\" and resolution null, the same set the million USD inventory funds.",
 ["The same set on a fallback grid of 225000 USD per cell, since a limit that large is always divided into 2000 cells.",
  "A PortfolioInputError, since a capex of 100000000.0000 is beyond the largest figure the knapsack reads.",
  "An empty set, since every capex is a million times the NPVs and no project's value can pay for its cost."],
 "The engine reads the capex as typed at any scale; rawDollars funds A + B + D, capex 450000000.0000, with optimalityGap 0.0000. The unit is the typist's convention, and consistent scaling changes nothing.")

q(2,
 "rawDollars and nonIntegerLimit both land on A, B and D at 250.0000, equal to the golden exact optimum. What should a reader take from the match?",
 "That no golden is needed: \"exact\" with optimalityGap 0.0000 already says the set is optimal.",
 ["That the fallback grid happens to be safe for these projects, since its rounding cancels on this inventory.",
  "That a golden is needed to trust any run, since the engine cannot tell whether its own answer is optimal.",
  "That both inventories are converted to million USD before solving, which is why their answers agree."],
 "Both cases report solveMethod exact, optimalityGap 0.0000 and resolution null. A user running their own inventory reads the same two fields and needs no golden; only a grid-feasible answer carries a bound to weigh.")

q(0,
 "In the published gridOvershoot case, A costs 4000.0000, B 2002.0000 and C 1995.0000 against a limit of 6000.0000 million USD. Why does the exact solve fund A and C?",
 "A and B together would cost 6002.0000, over the limit, so the best set that fits is A and C at 780.0000.",
 ["B's 2002.0000 is refused as a capex that does not divide evenly into the limit.",
  "The engine tolerates a breach smaller than one million, so it could fund A and B and prefers the set with slack.",
  "C has the best risked EMV per million of the three, and the optimizer funds down that ranking until the limit is reached."],
 "A plus C costs 5995.0000 and returns 500.0000 plus 280.0000, the golden exact optimum; overLimit reads false and 5.0000 is left unspent.")

q(1,
 "The published gridOvershootFallback case forces the stated fallback on the gridOvershoot projects by setting exactStateLimit to 2. What does the fallback fund?",
 "A and C at 780.0000 with overLimit false, because every weight is rounded up and A and B together need more than the 2000 cells.",
 ["A and B at 800.0000 with overLimit true, since rounding lets B squeeze into the cells.",
  "Nothing, since a state limit of 2 is too small for any set and the call is refused.",
  "B and C at 580.0000, the only pair whose rounded weights leave a spare cell."],
 "At 3.000000 per cell A weighs 1334, B 668 and C 665 cells; A and B need 2002 cells, so the fallback funds A + C at 5995.0000, solveMethod grid-feasible, optimalityGap 20.0000.")

q(3,
 "Why does the stated fallback round every capex up to whole cells?",
 "So any set that fits the grid also fits the limit in money: on gridOvershootFallback it keeps A + B, which would cost 6002.0000, out of the answer.",
 ["To make the fallback faster, since a rounded-up weight lets the knapsack skip the projects near the limit.",
  "To match the exact solve's answer, since rounding up and rounding down cancel over a whole inventory.",
  "To leave a reserve in every run, since the fallback keeps one cell of the limit unspent by design."],
 "Rounding up can only overstate a capex, so a set that fits 2000 cells never costs more than the limit; the fallback on gridOvershootFallback funds A + C with overLimit false. The price is that a set which fits in money can miss the grid.")

q(3,
 "gridOvershootFallback reports optimalityGap 20.0000, and its set, A + C, is the exact optimum. How can both be true?",
 "optimalityGap is an upper bound on the EMV left out, worked from the grid with weights rounded down, and here the true shortfall is 0.0000.",
 ["They cannot: a positive optimalityGap means the funded set missed the optimum by exactly that much.",
  "The gap measures the capex left unspent, 5.0000 here, scaled into million USD of risked EMV.",
  "The gap is the breach the fallback allowed over the limit, which is why its set could reach the optimum."],
 "Rounded down, A and B fit the 2000 cells, so the bound is worked from a set worth 800.0000 against the funded 780.0000; the exact optimum is also 780.0000, so nothing was lost. On gridUndershootFallback the bound of 200.0000 is exactly what was left out.")

q(2,
 "gridUndershoot has W, X and Y at 1499.0000 each and Z at 1502.0000 against a limit of 6000.0000 million USD. What does the exact solve fund?",
 "All four at capex 5999.0000 for 860.0000, with 1.0000 of the limit left unspent.",
 ["X, Y and Z at 660.0000, dropping W, the least valuable, because four projects cannot share one limit.",
  "W, X and Y at 630.0000, the three cheapest, leaving 1503.0000 as a reserve.",
  "Nothing, since a set that leaves only 1.0000 of headroom is treated as over the limit."],
 "The four cost 5999.0000 in money and fit; the exact solve returns W + X + Y + Z for 200.0000 plus 210.0000 plus 220.0000 plus 230.0000, the golden optimum, with optimalityGap 0.0000.")

q(0,
 "gridUndershootFallback forces the stated fallback on the same four projects with exactStateLimit 3. Why does it fund only three?",
 "At 3.000000 per cell 1499.0000 and 1502.0000 both round up, to 500 and 501 cells, so the four weigh one cell more than the 2000 the limit holds.",
 ["Z's 1502.0000 pushes the money total of the four over 6000.0000, so one project has to leave the set, and the knapsack drops W because it is the least valuable of them.",
  "The fallback keeps one project's capex unspent as a reserve against rounding up.",
  "W's EMV of 200.0000 falls below the value the grid assigns to a single cell at this resolution, so its value is rounded to nothing and it cannot win a place in the set."],
 "Three weights of 500 and one of 501 make 2001 cells, so the fallback drops W, the least valuable, and funds X + Y + Z for 660.0000; its optimalityGap of 200.0000 is exactly W's risked EMV.")

q(1,
 "Two answers leave money unspent: OKONO at 750.0000 leaves 60.0000, and gridUndershootFallback leaves 1500.0000 of 6000.0000. Which one calls for a closer look?",
 "The fallback's: it reports solveMethod \"grid-feasible\" and optimalityGap 200.0000, and W at 1499.0000 would fit the money left over.",
 ["Neither, since the optimizer leaves money unspent only when no left-out project fits in the space.",
  "OKONO's, since an exact solve that leaves money idle has stopped before it filled the limit.",
  "Both equally, since unspent money on any solve means the knapsack stopped early."],
 "OKONO is solved exactly and OK-6, the only project left, costs 310.0000, so its 60.0000 is genuine. The fallback's 1500.0000 sits beside a stated bound, and the exact solve funds all four for 860.0000.")

q(2,
 "freeProjectTightLimit has a free project with capex 0.0000 and EMV 10.0000 beside A at capex 100.0000 and EMV 60.0000, at a limit of 100.0000. What does the engine fund?",
 "Both for 70.0000 at capex 100.0000, since a free project weighs nothing and rides along with A.",
 ["A alone for 60.0000, since a project with capex 0.0000 is treated as a row nobody finished entering and is skipped.",
  "The free project alone for 10.0000, since it is the only one that costs nothing.",
  "A alone, since funding both would set overLimit true and the engine keeps the flag false."],
 "On the exact solve a free project with positive EMV is always funded: 60.0000 plus 10.0000 is the golden optimum, and the total capex stays 100.0000.")

q(0,
 "freeProjectSlack raises the limit to 101.0000 beside the same free project and A. What does the extra million change?",
 "Only the money left unspent, 1.0000; the engine funds the same free project and A for 70.0000 at either limit.",
 ["A share of A's capex overrun, since the engine lets a tight budget fund A only once it has a million of contingency.",
  "The free project's price, one million USD, which is its true cost once its capex is read at the higher limit.",
  "The solve method, since a limit of 101.0000 sends the free project to the fallback grid where it rounds away."],
 "Funded capex is 100.0000 against 101.0000, so 1.0000 stays unspent; freeProjectTightLimit at 100.0000 already funds both, because a free project weighs nothing.")

q(3,
 "In all three free-project cases, at limits of 0.0000, 100.0000 and 101.0000, overLimit reads false and the free project is funded. What does the false flag tell you?",
 "Only that each funded set sits inside its limit in money; an exact solve cannot exceed the limit, so the flag reads false every time.",
 ["That a cell was charged and fitted, since the flag counts cells and a free project's cell sits inside every limit.",
  "That the free project was funded only where money remained after A, which a limit of 0.0000 cannot offer.",
  "That the free project's value was checked against its cost, since the flag reads true when a set is worth less than it costs."],
 "The engine funds the free project, then free + A twice, at capex 0.0000, 100.0000 and 100.0000, each inside its limit with optimalityGap 0.0000. overLimit and overLimitBy stay in the result shape and read false and 0.0000.")

q(1,
 "A user runs their own inventory and gets solveMethod \"grid-feasible\" with optimalityGap 200.0000. What does the gap tell them without any golden?",
 "That the funded set may fall short of the best set that fits by at most 200.0000 of risked EMV.",
 ["Nothing until the exact optimum is solved separately, since the engine does not compare its answer with anything.",
  "That the funded capex runs 200.0000 over the limit, the amount to cut before the set is authorised.",
  "That exactly 200.0000 was left out, since the gap is always the shortfall to the exact optimum on any inventory."],
 "optimalityGap is the best value on the same grid with every weight rounded down, less the funded EMV, so it bounds what the fallback left out. On gridUndershootFallback it is 200.0000 and the shortfall is exactly that; on gridOvershootFallback it is 20.0000 and the shortfall is 0.0000.")

emit(Q, '/root/wt-ec45-recut/tools/course-banks/portfolio/beginner/ec5b_m05.json', expect_n=15)
finish()
