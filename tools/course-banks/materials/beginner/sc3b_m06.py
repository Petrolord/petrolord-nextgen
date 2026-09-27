import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Associate m06, Slow-Moving and Obsolete Stock.
# Sources: months since the last issue; bands and their minimums; stock value
# and write-down band by band; cover and excess; the boundary items; the
# refusals of slowMoving. Every keyed band, value, write-down, cover, excess
# and message was re-run through the vendored engine (sm-ekene, sm-boundaries
# and the sm-refuse-* cases).

q(1, "The wellhead master valve WH-MV holds 3 units at 42000 and has gone 14 months without an issue. Under the Ekene bands, what band and write-down does the engine return?",
 "Band slow, written down 25 percent of 126000.000000, which is 31500.000000.",
 ["Band active, written down 0, since 14 months is below the very slow minimum of 24.",
  "Band slow, written down 25 percent of the unit cost of 42000, a quarter of one unit.",
  "Band very slow, written down half of 126000.000000."],
 "The engine's reason reads \"WH-MV: 14 months since the last issue is at or above 12, band slow (below 24), written down 25% of 126000 = 31500; cover 17.996401 months is at or below 24\". The stock value is on hand times unit cost, 3 x 42000, and the write-down is the band's percentage of it. An item takes the last band whose minimum it has reached, and 14 months reaches slow at 12 and falls short of very slow at 24.")

q(3, "Class G cement CEM-G has gone exactly 12 months without an issue, the slow band's minimum. What band does the engine return, and on what footing?",
 "Slow, since the engine reads 12 months as reaching the slow minimum of 12, a choice it states in its basis.",
 ["Active; a band minimum is reached only once the months are strictly above it, so an item at exactly 12 stays active.",
  "Slow, because its cover of 2.333333 months marks it as stock that has stopped moving.",
  "A refusal, since an item may not sit exactly on a band's minimum without a stated tie rule."],
 "The engine's reason reads \"CEM-G: 12 months since the last issue is at or above 12, band slow (below 24), written down 25% of 14700 = 3675; cover 2.333333 months is at or below 24\". At or above is the engine's stated reading; reached only strictly above is the alternative, which would keep CEM-G active, and no graded figure in the course moves between the two. Cover plays no part in the band.")

q(0, "What total write-down does the engine return across the Ekene register under its stated bands?",
 "97955.000000, against a total stock value of 903240.000000.",
 ["66425.000000, the write-down of band slow alone, the largest of the four bands.",
  "903240.000000, since stock that has stopped moving is written off in full at the year end.",
  "15500.000000, the obsolete band alone, since only obsolete stock is written down."],
 "The band totals are 0.000000 for active, 66425.000000 for slow, 16030.000000 for very slow and 15500.000000 for obsolete, which sum to 97955.000000. Each band writes down its own stated percentage, so slow and very slow stock is written down in part as well. 903240.000000 is the stock value of the whole register.")

q(2, "HEAT-TRC, the heat tracing controller, holds 5 units at 3100, has gone 40 months without an issue and has a monthly usage of 0. What does the engine return for it?",
 "Band obsolete, written down 100 percent, 15500.000000, with all 5.000000 units reported as excess.",
 ["A refusal naming items[16].monthlyUsage, since cover cannot be worked out with no usage at all.",
  "Band obsolete and written down in full, with no excess, since cover has no meaning without usage.",
  "Band very slow, half its value written down, since 40 months falls inside that band's range."],
 "The engine's reason reads \"HEAT-TRC: 40 months since the last issue is at or above 36, band obsolete, written down 100% of 15500 = 15500; no usage, so all stock on hand is excess\". A usage of 0 is accepted: cover has no meaning then, so all stock on hand is excess. That is a result with a reason. Very slow runs from 24 months to below 36, so 40 months is obsolete.")

q(1, "The O-ring kit ORING-KIT holds 400 kits and uses 5 a month. With the Ekene excess limit of 24 months, what does the engine return for its cover and excess?",
 "Cover of 80.000000 months and an excess of 280.000000 kits above the 120 the limit allows.",
 ["Cover of 80.000000 months and an excess of 400.000000, since all stock above the limit counts.",
  "Cover of 20.000000 months, the months since its last issue, so it carries no excess at all.",
  "Cover of 80.000000 months and no excess, since band slow already writes its value down."],
 "Cover is on hand over monthly usage: 400 / 5 = 80.000000 months, above 24, so the item carries excess. The limit allows 24 x 5 = 120 kits, and the excess is the stock above that, 280.000000. Months since the last issue sets the band; it is a separate measure from cover. The band's write-down and the excess are reported side by side.")

q(3, "The ring joint gasket GASKET-RJ holds 120 at 38, has gone 24 months without an issue and uses 4 a month. What does the engine return?",
 "Band very slow, 2280.000000 written down, with 30.000000 months of cover and 24.000000 units of excess.",
 ["Band slow, a quarter of 4560.000000 written down, since 24 months is the top of the slow band.",
  "Band very slow, 2280.000000 written down, with 30.000000 months of cover and no excess, the limit being 30.",
  "Band obsolete, 4560.000000 written down, since 24 months with excess cover counts as obsolete."],
 "The engine's reason reads \"GASKET-RJ: 24 months since the last issue is at or above 24, band very slow (below 36), written down 50% of 4560 = 2280; cover 30 months is above 24, excess 24 units\". 24 months reaches the very slow minimum. Cover is 120 / 4 = 30.000000, above the limit of 24, and the limit allows 24 months at 4 a month, so 24.000000 units are excess. Obsolete starts at 36 months whatever the cover.")

q(0, "On the stated boundary items, COVER24 has exactly 24.000000 months of cover and COVER25 has 25.000000, against an excess limit of 24. What does the engine return?",
 "COVER24 carries no excess, and COVER25 carries 1.000000 unit of excess.",
 ["Both carry excess, since a cover limit is reached at or above it, like a band.",
  "Neither carries excess, since cover must pass the limit by a full month to count.",
  "COVER24 carries 1.000000 unit of excess, and COVER25 carries 2 units."],
 "Stock is excess only strictly above the cover limit: 24.000000 months is inside it, and 25.000000 months is one month's usage over it, 1.000000 unit. The engine states this in its basis as \"excess above 24 months\". It is the engine's stated reading, with at or above the limit as the alternative. A band minimum works the other way: it is reached at or above it.")

q(2, "On the stated boundary items, EMPTY has no stock on hand, no usage and 50 months since its last issue. What does the engine return for it?",
 "Band obsolete, with no excess, since there is no stock on hand to call excess.",
 ["A refusal, since an item with no stock and no usage has no place on a register.",
  "Band obsolete with all its stock excess, as for any item that has no usage.",
  "Band active, since an item holding nothing cannot be slow or obsolete."],
 "EMPTY is 50 months since its last issue, at or above the obsolete minimum of 36, so its band is obsolete, with a stock value of 0.000000 and nothing written down. With no usage all stock on hand is excess, and it has none, so it carries no excess. The engine accepts a zero stock and a zero usage.")

q(1, "A policy states its first band from 6 months. What does the engine print?",
 "A refusal of the first band's minimum, which has to start at 0 months.",
 ["The bands, with any item below 6 months left unbanded and listed on its own.",
  "The bands, with an active band from 0 months added so that every item takes one.",
  "A refusal naming bands[1].minMonths, the second band, which starts at 12."],
 "The engine's words are \"bands[0].minMonths must be 0 so that every item takes a band; got 6\". Stock issued last month would otherwise fall below every band. The engine adds no band of its own. The refusal names the first band, whose minimum is the one that fails.")

q(0, "A policy states a write-down of 101 percent for its first band. What does the engine return?",
 "A refusal of the write-down, which the engine takes only as a percentage from 0 to 100.",
 ["A write-down capped at 100 percent, the most any stock can lose on the books.",
  "A write-down of 101 percent, which carries a disposal cost beyond the stock value.",
  "A refusal naming bands[0].minMonths, since the first band must start at 0."],
 "The engine's words are \"bands[0].writeDownPct must be a number from 0 to 100; got 101\". The engine caps nothing and invents no disposal cost. The first band's minimum is not what failed here, so the refusal names writeDownPct.")

q(3, "In the slow-moving view, the Ekene cover limit of 24 months is replaced by 0. What comes back?",
 "A refusal naming excessCoverMonths, the cover limit, which has to be above 0.",
 ["Every item with any stock at all reported as excess, since no cover is allowed.",
  "No item reported as excess, since a limit of 0 switches the excess test off.",
  "The Ekene limit of 24 months restored, with a note that 0 was not a limit."],
 "The engine's words are \"excessCoverMonths must be a finite number above 0; got 0\". A limit of 0 is refused by name. The engine switches no test off and restores no earlier value; it names the field it would not accept.")

q(2, "How many Ekene items fall in band slow, and what stock value and write-down does that band carry?",
 "4 items, a stock value of 265700.000000 and a write-down of 66425.000000.",
 ["3 items, a stock value of 126000.000000 and a write-down of 31500.000000.",
  "4 items, a stock value of 265700.000000 and half of it written down.",
  "2 items, a stock value of 32060.000000 and a write-down of 16030.000000."],
 "Band slow holds WH-MV, CSG-958, CEM-G and ORING-KIT: 126000 + 87000 + 14700 + 38000 = 265700.000000, written down 25 percent, 66425.000000. 126000.000000 and 31500.000000 are WH-MV alone. Two items, 32060.000000 and 16030.000000, are band very slow. The slow band's percentage is 25, a quarter of its value.")

q(1, "The casing CSG-958 is band slow at 13 months since its last issue, yet it holds only 3.000000 months of cover. What does the pair of figures show?",
 "The two measures ask two questions: whether an item is still issued, and whether the store holds more than it needs.",
 ["The register has an error, since an item with 3 months of cover must have been issued in the last month.",
  "The engine has put the casing in the wrong band, since cover below 24 months keeps an item active.",
  "The write-down should fall to 0, since the casing is not excess and only excess stock is written down."],
 "Months since the last issue sets the band and its write-down; cover against the stated limit sets excess. They can disagree: the casing is band slow, written down 21750.000000, with 3.000000 months of cover and no excess, while the O-ring kit is band slow and carries excess. Cover plays no part in the band.")

q(0, "What does the engine's basis for slow-moving stock say about the bands, write-downs and cover limit?",
 "They are the caller's stated policy, and it cites lecture 13 slide 13 for days of supply to find dead stock.",
 ["They are fixed by the lecture it cites, and the engine applies the same four bands to every register.",
  "They follow the accounting standard for inventory, which sets 25, 50 and 100 percent by age of stock.",
  "They come from the Ekene register, which the engine reads whenever a call leaves its bands unstated."],
 "The basis reads \"the bands, write-down percentages and cover limit are the caller's stated policy; Caplice, MIT ESD.260J (2006) lecture 13 slide 13 (days of supply IOH / D to find dead stock)\". The engine holds no write-down schedule, the course reads no accounting standard, and a call without bands is refused by name.")

q(3, "One item in a slow-moving call has no months since its last issue in the box. What does the engine print?",
 "A refusal naming items[0].monthsSinceLastIssue, with the missing value printed as undefined.",
 ["The item placed in band active, since an item with no record is taken to be in use.",
  "The item placed in band obsolete, since no record of an issue means it has never moved off the shelf at all.",
  "The item left out of the bands and the totals, with a note beside it in the result."],
 "Every item needs its months since the last issue. The engine's words are \"items[0].monthsSinceLastIssue must be a finite number at or above 0; got undefined\". The engine places no item in a band it was not given the months for, and it drops nothing from the totals.")

emit(Q, '/root/cat-wip-materials/banks/sc3b_m06.json', expect_n=15)
finish()
