import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Associate m05, Rounding and the Flat Bottom.
# Sources: a stated rounding rule; the cost of rounding for baryte under six
# rules; halves upward and its alternative; the holding cost stated two ways;
# the refusals of rounding and holding. Every keyed figure and message was
# re-run through the vendored engine (eoq-ekene-baryte under each stated
# rule, eoq-q-exactly-half-of-multiple, eoq-nearest-rounds-up,
# eoq-exact-multiple-kept, eoq-holding-direct, eoq-holding-direct-with-price,
# harris-1913-stud-say-49 and the eoq-refuse-* cases).

q(2, "The Ekene policy rounds baryte's EOQ of 137.408584 up to a multiple of 10. What quantity is ordered, and what rounding penalty does the engine report?",
 "140.000000 tonnes, at a penalty of 0.017454 percent a year.",
 ["130.000000 tonnes, at a penalty of 0.153633 percent, the multiple of 10 below the EOQ.",
  "137.408584 tonnes, since the penalty of rounding is charged only when it passes one percent.",
  "140.000000 tonnes, with the penalty printed in money a year."],
 "Up takes the next multiple at or above the EOQ: 140.000000, at a relevant cost of 7861.142857 against 7859.770989 at the EOQ, a penalty of 0.017454 percent. 130.000000 and 0.153633 are what the rule down gives. The engine always orders the rounded quantity the stated rule gives and always reports the penalty. The penalty is a percentage of the relevant cost at the EOQ, and the engine prints no penalty in money.")

q(0, "On the same baryte case, what does the rule down to a multiple of 10 order, and at what relevant cost a year?",
 "130.000000 tonnes, at a relevant cost of 7871.846154 and a penalty of 0.153633 percent.",
 ["140.000000 tonnes, at 7861.142857, since down and up agree when the EOQ is so near a multiple.",
  "130.000000 tonnes, at 7859.770989, since rounding changes the lot and leaves the cost where it was.",
  "A refusal: rounding down leaves the store short."],
 "Down takes the multiple at or below the EOQ, 130.000000. It sits further below the EOQ than 140 sits above it, so it costs more: 7871.846154 a year, a penalty of 0.153633 percent. 7859.770989 is the cost at the EOQ itself. Rounding down is refused only when it would order nothing.")

q(3, "Rounding baryte up to a multiple of 50 orders 150.000000 tonnes, 12.591416 above the EOQ. What does the engine report, and what does it show?",
 "A penalty of 0.384604 percent, 7890 a year against 7859.77: the relevant cost is flat near its minimum.",
 ["A penalty that climbs a full percent for every tonne above the EOQ, in a steep rise.",
  "A penalty of 0.017454 percent, the same as the multiple of 10, since the rule up is the same rule.",
  "A refusal, since a multiple of 50 is more than a third of the EOQ and the order would overshoot it."],
 "The engine's reason reads \"EOQ = sqrt(2 x 1800 x 300 / 57.2) = 137.408584; ordered as 150 (up to a multiple of 50), a relevant cost of 7890 a year against 7859.77 at the EOQ\", a penalty of 0.384604 percent. An order 12.591416 units above the EOQ costs well under half a percent more a year. The multiple of 10 gives 0.017454. No multiple is refused for its size; only a rounding that orders nothing is.")

q(1, "Which rule on the baryte case costs least above the EOQ itself, and at what penalty?",
 "The nearest multiple of 1, which orders 137.000000 at a penalty of 0.000443 percent.",
 ["The rule up to a multiple of 10, which orders 140.000000 at 0.017454 percent, the Ekene policy.",
  "Down to a multiple of 10, which orders 130.000000 at 0.153633 percent.",
  "Up to a multiple of 50, which orders 150.000000 at 0.384604 percent."],
 "Of the stated rules the nearest multiple of 1 lands closest to 137.408584, at 137.000000, and costs 7859.805839 a year, a penalty of 0.000443 percent. The Ekene rule costs 0.017454, down to 10 costs 0.153633 and up to 50 costs 0.384604. The rule none costs nothing above the EOQ, since it orders the EOQ itself.")

q(0, "The baryte EOQ of 137.408584 is rounded to the nearest multiple of 10. What does the engine order?",
 "140.000000, the same quantity the Ekene rule up gives, at a penalty of 0.017454 percent.",
 ["130.000000, since nearest rounds toward the lower multiple whenever the EOQ has a fraction.",
  "137.408584, since the rule nearest keeps any EOQ within half a multiple of a round figure.",
  "The midpoint of 130 and 140, which splits the two costs evenly."],
 "Nearest takes the closer of the two multiples: 137.408584 is nearer 140 than 130, so the engine orders 140.000000, the same as the rule up, at the same cost of 7861.142857 and penalty of 0.017454. 137.408584 is above the midpoint between 130 and 140. The rule nearest always orders a multiple.")

q(2, "Halfway between two multiples: an EOQ of exactly 50.000000 is rounded to the nearest multiple of 100. What quantity does the engine order, and on what footing?",
 "100.000000; the engine takes an exact half upward, a stated choice its reason names as halves upward.",
 ["0, since a quantity exactly halfway rounds down to the lower multiple under the rule nearest.",
  "50.000000, since an EOQ with no nearer multiple is ordered as it stands, unrounded.",
  "A refusal, since an EOQ exactly halfway between two multiples leaves the rule nearest with no way to decide."],
 "The engine's reason orders 100 and names the rule as the nearest multiple of 100 with the words halves upward in brackets. Halves upward is the engine's stated reading; halves downward is the alternative, and on this case it would order nothing. No graded figure in the course depends on which is taken.")

q(3, "An EOQ that is already a whole multiple, 20.000000, meets the rule up to a multiple of 4. What is ordered?",
 "20.000000, since up takes the next multiple at or above the EOQ and 20 already is one.",
 ["The next multiple of 4 above 20, since up always moves the EOQ to a multiple strictly above it.",
  "The multiple of 4 below 20, since a figure already on a multiple is taken down to the one below it.",
  "A refusal, since an EOQ that is already a whole multiple needs the rule none stated."],
 "Up takes the next multiple at or above the EOQ, so an EOQ already on a multiple stays where it is: 20.000000. The engine reads the quotient 20 / 4 at 12 significant digits, finds it whole, and multiplies back. Nothing is refused here, and a rule up with no rounding to do is a result.")

q(1, "Under the rule nearest multiple of 10, what does an EOQ of 15.811388 become?",
 "20.000000, since 15.811388 is nearer 20 than 10.",
 ["10.000000, since the rule nearest takes the multiple at or below any EOQ that is not a whole multiple.",
  "15.811388, since the rule nearest leaves an EOQ unrounded when both multiples are within 10 of it.",
  "16, the closest whole unit, since the rule nearest rounds to a unit before it applies the multiple."],
 "Nearest takes the closer multiple: 15.811388 is past the midpoint of 10 and 20, so the engine orders 20.000000. Taking the multiple below is the rule down. The rule nearest always orders a multiple of the stated figure, and it works on the quotient over the multiple directly.")

q(2, "On a stated case whose EOQ is 400, the rounding rule and multiple would order a quantity of 0. What does the engine print?",
 "\"rounding gives an order quantity of 0 from the EOQ 400; state a smaller multiple or another rule\"",
 ["An order of 0.000000 with a relevant cost that grows without limit, since no order is ever placed.",
  "An order of 100.000000, the smallest multiple above 0, since a store must order something.",
  "\"rounding.multiple must be a finite number above 0; got 0\", naming the multiple."],
 "A rounding that orders nothing is refused by name before any cost is computed, and the message says what to do: pick a multiple the EOQ can reach, or a rule that rounds up. The engine substitutes no multiple of its own. The multiple itself is above 0, so the refusal names rounding and leaves rounding.multiple alone.")

q(0, "The rounding rule none is stated together with a multiple of 10. What does the engine return?",
 "A refusal: \"rounding.multiple must be left out when the rule is 'none'\".",
 ["The EOQ unrounded, with the multiple of 10 ignored since the rule none takes none.",
  "A quantity rounded to the nearest multiple of 10, since a stated multiple outranks the rule.",
  "Up to 10, the Ekene rule."],
 "The rule none takes no multiple, so a multiple stated beside it is a contradiction and the engine refuses it by name. It ignores no input it was given and picks no rule for itself. The Ekene rule is up to a multiple of 10, a stated input of the baryte case alone.")

q(1, "The baryte case is run with its rounding left blank in the box. Which message comes back?",
 "\"rounding must be a stated rounding rule { rule: 'none' } or { rule: 'up' | 'down' | 'nearest', multiple }\"",
 ["The EOQ with no rounding, since a rule that is not stated is read as the rule none by the engine.",
  "A lot rounded to the nearest whole unit, as Harris rounded his stud to 49 in the year 1913.",
  "Up to a multiple of 10, the rule the Ekene register states for its baryte order."],
 "The rounding rule is a stated input with no fallback, and leaving it out is refused with a message that spells out the shapes a rule can take. The engine takes neither the rule none nor any rule of Harris or of the Ekene register on its own.")

q(3, "A stated case gives the holding cost directly as 4.5 a unit a year, with the rule down to a multiple of 25. What EOQ and purchase cost does the engine report with no unit cost stated?",
 "An EOQ of 200.000000, and a purchase cost of none, since no unit cost is stated.",
 ["An EOQ of 200.000000, and a purchase cost of 36000.000000 at the Ekene baryte price.",
  "A refusal: a unit cost is needed first.",
  "A purchase cost of 0.000000, with the EOQ rounded down."],
 "A holding cost stated directly needs no unit cost, and the EOQ is 200.000000, already a multiple of 25. The purchase cost is reported as none without a unit cost; with a unit cost of 30 stated beside the holding cost, it is 36000.000000 and the EOQ is unchanged. Only a holding rate needs a unit cost. Rounding down leaves a figure already on a multiple where it is.")

q(0, "Baryte's holding rate is set to 0 in a stated probe. What does the engine print?",
 "A refusal naming holdingRate: stock that costs nothing to hold has no EOQ.",
 ["An EOQ that grows without limit, since stock that costs nothing to hold can be bought in any lot.",
  "An EOQ of 0.000000, since a holding cost of zero cancels the square root.",
  "\"unitCost must be a finite number above 0; got 0\", since the holding cost falls to zero."],
 "The engine's words are \"holdingRate must be a finite number above 0; got 0\". A rate of 0 would make holding free, so the engine refuses the rate by name. The refusal names the field that holds the zero, holdingRate; the unit cost of 260 is still stated and above 0.")

q(2, "How does the engine express the rounding penalty it reports on every EOQ call?",
 "As a percentage of the relevant cost at the EOQ, from the relevant costs at the quantity ordered and at the EOQ.",
 ["As money a year: the relevant cost at the quantity ordered less the relevant cost at the EOQ.",
  "As a percentage of the purchase cost a year, so that it can be set beside the price of the item.",
  "As the number of units between the EOQ and the quantity ordered, in whichever direction it falls."],
 "The engine reports the relevant cost at the quantity ordered and at the EOQ, and the gap between them as a percentage of the cost at the EOQ: 0.017454 percent for baryte ordered as 140. The purchase cost stays out of it, and the distance in units is not what it reports.")

q(3, "Harris (1913) writes of his stud: \"The correct quantity is 48.5 or, say, 49.\" What does the engine return for the stud with the stated rule nearest multiple of 1?",
 "An order of 49.000000 from an EOQ of 48.554321, with both relevant costs 27.43 a year to the cent.",
 ["An order of 48.5 exactly, the lot Harris prints, since the engine rounds the EOQ to one decimal.",
  "An order of the whole unit below the EOQ, since the rule nearest drops any fraction of a unit, however large it is, before ordering.",
  "An order of 50.000000 from an EOQ of 48.554321, since nearest takes any fraction upward to 50."],
 "The engine's reason reads \"EOQ = sqrt(2 x 1.85 x 360 / 0.565) = 48.554321; ordered as 49 (the nearest multiple of 1 (halves upward)), a relevant cost of 27.43 a year against 27.43 at the EOQ\". 48.554321 is past the midpoint, so the nearest whole unit is 49, the figure Harris states in words. The two costs agree to the cent, the flat bottom again.")

emit(Q, '/root/cat-wip-materials/banks/sc3b_m05.json', expect_n=15)
finish()
