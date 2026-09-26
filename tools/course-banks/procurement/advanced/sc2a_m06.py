import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Expert m06, Conventions and the Evaluation Report. Every figure is quoted
# from digest.txt: the conventions that are choices, what the engine does not
# build and where each would come from, what the evaluation report names, the
# engine's imports, the inputs with no default, unknown keys refused, and what
# a computed figure does not say. No capstone subject appears; the method is
# taught on the Ekene tenders.

K = [1, 2, 0, 3, 2, 1, 0, 3, 1, 2, 3, 0, 2, 1, 3]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The engine applies the completion-time rate to the corrected price less the unconditional discount. What kind of rule is that, and what alternative does it decline?",
 "An engine convention, since the SPD gives the rate without its base; charging on the quoted price is declined",
 ["A rule printed in Section III of the SPD, which names the corrected price as the base inside its own formula for time",
  "The Public Procurement Act 2007's rule at s.31(14), which prices every deviation on the corrected total",
  "An engine convention that uses the quoted price, since that is the figure the bidder signed for"],
 "The conventions table says: completion-time base, corrected price less the discount, engine convention; the SPD gives the rate without its base. The quoted price would charge a late bidder on a figure its own arithmetic corrected. s.31(14) concerns priced minor deviations, and the base is stated in every schedule reason, for example 0.005 x 3 x 849400 = 12741 for WS5.")

# 2
x("WS4 quotes a nitrogen line, yet its price is left out of the average added for WS3's omitted nitrogen. Which convention decides that?",
 "Who prices an omission: the other bids still responsive, which WS4 is not, since its envelope was never opened",
 ["Ties: WS4's nitrogen ties with WS2's at twelve significant digits, and the later receipt of the two drops out",
  "The arithmetic tolerance, which drops any line priced from a bill whose envelope the committee never opened",
  "ALB screening, since WS4's low total marks its prices as abnormally low"],
 "The engine's reading of ITB 34.1 is that the other bids still responsive at that point price an omission, and a bid never prices its own. WS4 failed the pass mark, so its commercial envelope was never opened and its nitrogen figure plays no part: the average of WS5 33600.000000, WS2 35400.000000 and WS1 37200.000000 is 35400.000000. Letting every bid received price it would give an unopened bid a say in an evaluation it never entered.")

# 3
x("The relative ALB test uses the population standard deviation. On Annex I Example 1, what would the sample standard deviation have done?",
 "Given 326337.099079 and a limit of 1338089.275921, flagging Bid 1 and Bid 2 only",
 ["Nothing different: both give 315974.537496 on sixteen bids, so Bid 1, Bid 2 and Bid 3 are flagged",
  "It would give 315974.537496 and a limit of 1348451.837504, adding Bid 4 to the flagged bids",
  "Given the Guidance's printed 315975 and a limit of 1348452, flagging the same three bids"],
 "The engine takes the population figure, 315974.537496, as the Guidance's own Annex I Example 1 computes it, and flags Bid 1, Bid 2 and Bid 3 below the limit 1348451.837504. The sample figure divides by one fewer, 326337.099079, which lowers the limit to 1338089.275921, and Bid 3 at 1342106 is then above it. 315975 and 1348452 are the Guidance's printed roundings of the population figures, and Bid 4 at 1378232 is above either limit.")

# 4
x("The materials tender measures casing, cement and baryte in tonnes and valves by number. How does the engine report one overall content for a bid, and why is that a convention?",
 "A weighted mean of the item contents with the bid's stated weights, since the Act has no rule for adding units",
 ["Pooling Nigerian quantities over total quantities, as it does on the well services tender, where every item is counted in man-hours",
  "The lowest item content, since an item below its minimum should set the overall figure",
  "By converting valves to tonnes with the Schedule's weights and pooling every item in tonnage"],
 "Pooling would add man-hours or numbers to tonnes, so where units differ the engine takes a weighted mean with stated weights (on the materials tender, each bid's quoted amount per item), and a bid with mixed units and no weights is refused. The well services items share one unit, man-hours, so pooling works there. The Schedule holds no conversion between units, and the engine reports each item against its minimum separately.")

# 5
x("The engine breaks a tie at twelve significant digits by the lower evaluated cost, then the earlier receipt, then the bidder id. Where does that rule come from?",
 "It is an engine convention: no text read states a tie-break",
 ["Paras 5.69 and 5.70 of the World Bank Regulations, on the Most Advantageous Bid",
  "The Public Procurement Act 2007, s.24(3), on the lowest evaluated responsive bid",
  "From the two-envelope SPD's ITB 35.1, which settles equal totals"],
 "The conventions table records ties as 12 significant digits, then the lower evaluated cost, the earlier receipt and the bidder id, from an engine convention; no text read states a tie-break. The paragraphs and sections named in the other options are cited for other rules (the award, the lowest evaluated responsive bid, arithmetic correction). Exact equality of doubles would let the last bit of a sum decide an award, and a drawing of lots cannot be reproduced.")

# 6
x("A committee asks whether the evaluated costs include a margin of preference for domestic goods. What does the course say?",
 "The engine applies none; para 5.52 of the Regulations sets one for Bank-financed competition, and the Act of 2007 at s.34 leaves Nigerian margins to regulations not read",
 ["Automatically, at the para 5.52 margin, on every bid it marks as indigenous",
  "A margin of 10 percent is applied through s.16 of the 2010 Act, which is the Nigerian preference",
  "Yes: the Bureau of Public Procurement's published margin under s.34 of the 2007 Act"],
 "Domestic preference is taught as a concept only: the World Bank Regulations para 5.52 margin of preference in Bank-financed international competition, and the Public Procurement Act 2007 s.34, which leaves Nigerian margins to regulations of the Bureau of Public Procurement that were not read. The engine applies no preference margin. s.16 of the 2010 Act protects an indigenous company within 10 percent of the lowest from exclusion solely on price; it adds nothing to a cost and selects nothing.")

# 7
x("A bid's amount in words differs from its amount in figures. What does the engine do about it?",
 "Nothing: words against figures, ITB 35.1(c), is taught as a concept and not computed",
 ["ITB 35.1(c) is applied, and the amount in words governs the corrected total of the bid",
  "Treating the gap as a decimal point misplaced, it lets the quoted amount govern the line",
  "It refuses the bid under the field lines until the two amounts agree"],
 "The engine corrects arithmetic on figures only, quantity times unit rate against the quoted amount, and compares no amount written in words. ITB 35.1(c), the rule for an amount in words that differs from the amount in figures, is listed among the steps the engine does not build. A misplaced decimal point is a separate rule on a figure the bid itself flags.")

# 8
x("Which steps of the Nigerian Oil and Gas Industry Content Development Act 2010 does the engine leave to the committee?",
 "The Board's approval steps in s.17 to s.24 and the Nigerian Content Development Fund deduction in s.104",
 ["s.14 and s.16, since content preference is a decision for the Board that the engine can only record in a note",
  "The Schedule's minimums, which the engine reads afresh from the latest Board targets on every call it answers",
  "Only s.11, since measuring content item by item is left to the bidders' own declarations of their share"],
 "The engine measures content against the 2010 Schedule and applies s.14 and s.16; it takes no approval step under s.17 to s.24 and deducts nothing for the Fund under s.104. It carries the Schedule as enacted in 2010, and a later Board target enters only as a stated target with its source. s.11 and the Schedule are what the engine reads.")

# 9
x("An evaluation report quotes figures from a contract-type comparison. Beyond the figures, what must it name?",
 "The seed, the iterations, the plan, and the percentile definition beside every cost percentile",
 ["Its random generator's internal state after the last draw, so that the run can be resumed later",
  "Only the mean company cost, since the percentiles follow from it and the plan",
  "Each contract's P90 as its budget, since the higher label is the prudent figure"],
 "The report list says: for a contract comparison, the seed, the iterations, the plan and the percentile definition beside every cost percentile. A seed and an iteration count already name the result exactly, so no generator state is needed. The percentiles do not follow from the mean on a skewed job. A cost P90 is the LOW figure, a 90 percent probability of meeting or exceeding it, so offering it as a prudent budget reads the label backwards.")

# 10
x("A report quotes MS2's overall content. Which form of the figure does it reason with?",
 "The numeric field at six decimals, 61.584657, with any reason string quoted verbatim as the engine's words",
 ["The longer figure printed inside the engine's s.14 reason, since that string carries every digit the engine holds",
  "A rounding to one decimal place, since a content percentage is measured to a tenth of a percent at best",
  "Whichever form the reason prints, pasted into a table without quotation marks"],
 "A reason prints its figures as the shortest decimal that reads back to the double, so MS2's content appears inside the s.14 reason with many digits. A report reasons with the numeric field at the course's six decimals, 61.584657, and quotes a reason or refusal verbatim, in quotation marks, as the engine's words. Lifting a figure out of a reason string is the error; rounding further loses what the field carries.")

# 11
x("Which list gives the engine's imports in full?",
 "lib/stats/stats.js, lib/conventions/percentile.js, economics/cashflow.ts, drilling/wellCost.js and economics/afe.js",
 ["lib/stats/stats.js and economics/cashflow.ts, with its own Monte Carlo sampler added for speed",
  "Only lib/stats/stats.js; the NPV, the well time and the AFE split are written inside tender.js",
  "economics/cashflow.ts and drilling/wellCost.js, with percentile labels defined locally in tender.js"],
 "The engine's imports are, in full, lib/stats/stats.js, lib/conventions/percentile.js, economics/cashflow.ts, drilling/wellCost.js and economics/afe.js. It discounts through the canonical npv and samples through lib/stats, and carries no Monte Carlo or NPV code of its own; the P labels come from the platform convention, and wellCost and afe.js supply the should-cost.")

# 12
x("Which of these inputs does the engine accept with a stated default when a call leaves it out?",
 "omissionRule, whose default is the cited average of ITB 34.1",
 ["seed, defaulting to 20270211",
  "The should-cost band, whose default is low 0.8 and high 1.25 on every call",
  "ncLeadBasis, whose default is points, the plainer reading of s.14"],
 "The omission rule defaults to 'average', the rule the World Bank SPD ITB 34.1 states. The seed, the band and the s.14 reading are among the inputs with no default: a call without one is refused, and each message says there is no default. 20270211 is the fixture's stated seed, 0.8 and 1.25 the fixture's stated band, and the Act does not settle points against relative.")

# 13
x("An evaluatedCosts call spells the life-cycle key lifecycle, with a small c. How does the engine respond?",
 "A refusal naming lifecycle as not an accepted key, with the accepted top-level keys listed",
 ["The evaluated costs without any life-cycle term, since an unknown key is ignored",
  "The evaluated costs with the life cycle applied as intended, since the engine reads its keys case-blind",
  "A refusal naming lifeCycle.years, since the life cycle arrived without its years"],
 "Every call refuses a key its function does not read, at every level, naming the key, its path and the accepted keys: \"lifecycle is not an accepted key; the accepted keys at the top level are bids, omissionRule, bestEstimates, schedule, lifeCycle, tolerance\". A misspelt optional key is refused, so it can never silently drop a term. Keys are matched exactly, and the call never reaches the life-cycle checks.")

# 14
x("The engine returns WS5's evaluated cost as 862141.000000. What does that figure not say?",
 "What the job will cost: it ranks bids under stated rules and is no forecast",
 ["Whether WS5 passed the technical envelope, since costs are computed for every bid",
  "Which omission rule and schedule were applied, since the figure is rule-free",
  "Whether WS5's bill was corrected, since corrections sit outside the evaluated cost"],
 "The course is plain that an evaluated cost ranks bids under stated rules and is not a forecast of what the job will cost. Only passing bids have an evaluated cost, so the figure itself says WS5 passed. It depends on the omission rule and the schedule and is quoted with them, and the corrected price is its first term.")

# 15
x("The plan of a contract comparison is the modes unless a plan is stated. Why does the engine take the modes, and what does a caller who plans differently do?",
 "Budgets are usually built from most likely values; a caller who plans differently states a plan with days and a daily cost",
 ["Because the modes are the mean of each triangle, the plan equals the expected cost; no other plan is accepted",
  "World Bank Regulations fix the plan at the modes; a caller cannot move it without a refusal",
  "The modes give the most overruns, the cautious choice; a caller may pass the mean days only"],
 "The conventions table lists the plan of a contract as the modes unless a plan is stated, an engine convention. The mean is another possible reference for an overrun, but a plan is what a company budgets, and budgets are usually built from most likely values. A stated plan must carry its days and daily cost. The mode of a skewed triangle is not its mean, and no text fixes the plan.")

emit(Q, '/root/cat-wip-procurement/banks/sc2a_m06.json', expect_n=15)
finish()
