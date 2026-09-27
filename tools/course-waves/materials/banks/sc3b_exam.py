import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Associate final exam, forty-two questions over the whole tier.
# Sources: the register, its policy and its texts; criticality; ABC by annual
# usage value; the EOQ; rounding; slow-moving and obsolete stock; the
# refusals of the four Associate functions; what the engine computes and what
# a figure does not say. The exam asks about items, cases and refusals the
# module banks do not key, so it reads the material afresh. Every keyed
# figure and message was re-run through the vendored engine
# (materials_engine.mjs) on the Ekene register and the stated golden cases.

# Criticality
q(3, "ESP-PMP, the ESP pump section, scores 2 on safety, 5 on production, 5 on lead time and 4 on redundancy. Under the Ekene weights and a scale of 5, what is its weighted score and class?",
 "74.000000, class V, from contributions of 16, 30, 20 and 8.",
 ["82.000000, class V, the ESP motor's figure.",
  "16, the plain sum of its scores.",
  "70.000000, class V, since a pump section is held at the V minimum."],
 "40 x 2 / 5 = 16, 30 x 5 / 5 = 30, 20 x 5 / 5 = 20 and 10 x 4 / 5 = 8 sum to 74.000000, at or above 70, so V: \"ESP-PMP: weighted score 74 is at or above 70, the minimum for class V\". 82.000000 belongs to ESP-MTR, one point higher on safety. The plain sum ignores the weights and the scale, and no item is held at a minimum by its kind.")

q(1, "Which two Ekene items have a weighted score exactly equal to a class minimum of the stated policy?",
 "MECH-SEAL at 70.000000 and GASKET-RJ at 44.000000.",
 ["PSV-KIT at 68.000000 and MECH-SEAL at 70.000000.",
  "CSG-958 at 42.000000 and COMP-RP at 66.000000.",
  "GASKET-RJ at 44.000000 and HEAT-TRC at 24.000000."],
 "The register plants MECH-SEAL exactly on the V minimum and GASKET-RJ exactly on the E minimum; each is in the class whose minimum it meets. PSV-KIT's 68.000000 sits two below V, CSG-958 and COMP-RP sit below the minimums above them, and HEAT-TRC's 24.000000 is well inside D.")

q(3, "Two classes in a criticality policy are both labelled V, the first from 70 and the second from 0. What comes back?",
 "A refusal on the second class: \"classes[1].label repeats the label 'V'\".",
 ["Two V classes merged into one.",
  "The classes, with the second V renamed V2.",
  "Every item from 0 to 70 labelled V, with a note beside the repeat."],
 "A class label may be used once only, and a repeat is refused on the field that repeats it. The engine merges nothing and renames nothing; the policy's author states the classes again.")

q(0, "In a criticality call, the first two items share the id X. What does the engine print?",
 "A refusal in the engine's words: \"items[1].id repeats the id 'X'\"",
 ["The classes, with the second X renamed so that both items appear in the result.",
  "Only the first X classed, the second dropped as a duplicate.",
  "One entry under X, with the two items' scores averaged."],
 "Every id in a call must be unique, and the engine refuses the repeat on the second item's field. It renames, drops and averages nothing, since any of those would change the register without its owner deciding.")

q(3, "A policy's criteria have the ids s and p, and its override list names safety. What does the engine print?",
 "\"topClassOnMaxScore[0] must be a criterion id (s, p); got safety\"",
 ["No override at all, since safety is not a criterion here.",
  "The classes with s taken as the override.",
  "Every criterion taken as the override, to keep safety items safe."],
 "Each id in the override list must be one of the policy's own criteria, and the message lists them. The engine matches no id by its first letter and applies no override that was not stated.")

q(3, "The first item in a criticality call carries a score under the key q, while the policy's criteria are s and p. What comes back?",
 "A refusal: \"items[0].scores.q is not a criterion; the criteria are s, p\".",
 ["The class, with q ignored.",
  "The class, with q read as a third criterion of weight 0 in the weighted score.",
  "A refusal naming items[0].scores.s."],
 "An item may score only the stated criteria; a score under any other key is refused on the field that carries it, with the list of criteria. A criterion of weight 0 is refused in its own right, and the order of the scores in the box does not matter.")

q(3, "The criterion key weight is typed as wieght in a criticality call. What does the engine print?",
 "\"criteria[0].wieght is not an accepted key; the accepted keys of criteria[0] are id, label, weight\"",
 ["The classes, with the first criterion's weight read from wieght, a close enough match to weight.",
  "A refusal saying the weights fall short of 100, since the first weight is missing.",
  "The classes, with the first criterion dropped and the other weights left as they were."],
 "The engine refuses a key it does not read at every level, naming the key, its path and the accepted keys of that object. It checks keys before it reads any input, so the misspelling is refused before any sum of weights is taken, and no key is matched by resemblance.")

q(2, "What is the most criteria, and the most classes, one criticality call accepts?",
 "20 criteria and 10 classes, two of the caps the engine holds in DEFAULTS.",
 ["4 criteria and 3 classes, as in the Ekene policy.",
  "100 criteria, one for each point of weight, and 5 classes, one for each score.",
  "No limit on either."],
 "DEFAULTS.MAX_CRITERIA is 20 and DEFAULTS.MAX_CLASSES is 10, and a call beyond either is refused by name with the cap in the message. The Ekene policy uses four criteria and three classes, well inside both caps.")

# ABC
q(2, "ESP-PMP is used 3 times a year at 96000 each. What annual usage value does ABC rank it by, and where does it rank?",
 "288000.000000, rank 3 on the Ekene register.",
 ["192000.000000, the stock on hand at that price.",
  "96000, since ABC ranks by unit cost alone and it is the third dearest item.",
  "288000.000000, rank 1, since its value is the largest of the pump and motor spares."],
 "Annual usage value is 3 x 96000 = 288000.000000, behind ESP-MTR at 370000.000000 and CSG-958 at 348000.000000, so rank 3. 192000.000000 is its stock value, 2 on hand at 96000, which the slow-moving view reports. ABC ranks by annual usage value; unit cost alone ranks nothing.")

q(3, "What class does the mechanical seal MECH-SEAL take in the Ekene ABC run, and does the boundary rule change it?",
 "B under both rules, at a cumulative share of 86.915261.",
 ["A under both rules, since it is criticality class V and carries the V weight.",
  "B under at-or-below and A under include-crossing, as the item that crosses 80.",
  "C under both rules, since its value of 53400.000000 is below the register's mean."],
 "MECH-SEAL ranks 8th: its share before it is 83.536840, above 80, and its cumulative share 86.915261 is at or below 95, so it is B under both rules. The item that crosses 80 is CEM-G, one rank above. Criticality plays no part in ABC, and no class is set against a mean.")

q(0, "Class C is the largest group on the Ekene register by count under at-or-below. How much of the money does it carry?",
 "5.802786 percent of the annual usage value, across 7 items.",
 ["15.443307 percent, across 5 items, the share the middle class carries.",
  "78.753907 percent, across 6 items.",
  "5 percent exactly, since C is whatever share lies above the B cut-off of 95."],
 "Class C is ranks 12 to 18 under at-or-below. The largest group by count carries the smallest share of the money, which is the pattern ABC is built to show. 5 items and 15.443307 describe class B, and 6 items and 78.753907 describe class A. C holds whatever its items hold; the B cut-off of 95 fixes no share for C.")

q(1, "The surface safety valve actuator SSV-ACT brings the cumulative share to 94.197214. What does that decide under at-or-below and the Ekene cut-offs?",
 "Class B: the share has passed 80 and has yet to pass 95, and SSV-ACT closes B.",
 ["Class C, since a share within one point of 95 is read as having reached it.",
  "Class A, since only the B cut-off is read at this rank of the register.",
  "Class C, since every share above 80 falls outside class A and so into C."],
 "SSV-ACT ranks 11th. Its cumulative share is above 80 and at or below 95, so it is B; the next item, LUBE-OIL, carries the share to 95.654870 and is C under at-or-below. The engine compares each share with both cut-offs at 12 significant digits.")

q(0, "A policy states an A cut-off of 0 percent. What does the engine print?",
 "It refuses cutoffs.aPct by name, since that cut-off has to lie above 0 and below 100.",
 ["The classes with no A items at all.",
  "The classes with the A cut-off moved to 80, the figure lecture 11 slide 4 prints for it.",
  "\"cutoffs must be { aPct, bPct }, the cumulative value shares that close classes A and B\""],
 "The engine's words are \"cutoffs.aPct must be a number above 0 and below 100; got 0\". The message for cut-offs left out altogether is a different one. The engine holds no cut-off to fall back on, and the cited lecture supports ranking by value while the cut-offs are the caller's policy.")

q(1, "How does the engine rank items for ABC, and at what precision does it compare shares against the cut-offs?",
 "By annual usage value, highest first, ties by id; shares compared at 12 significant digits.",
 ["By criticality class first and annual usage value second, compared to two decimals.",
  "By unit cost, dearest first, ties by name; shares compared to the nearest whole percent.",
  "By annual usage alone, most used first, ties by the order in the box; compared exactly."],
 "The engine ranks by annual usage value, highest first, and ranks a tie by id; it compares each cumulative share with the cut-offs at 12 significant digits. Both the id order and the 12-digit comparison are stated choices of the engine. Criticality plays no part in ABC, unit cost alone ranks nothing, and the order in the box decides no tie.")

# EOQ and rounding
q(3, "With lots of 140.000000 tonnes, how often does the store reorder baryte, and how long does each lot last?",
 "2.142857 orders a year, a cycle of 0.466667 years, from D / Q and Q / D.",
 ["One order a year, a cycle of one year, since each lot is sized to the year.",
  "0.466667 orders a year, a cycle of 2.142857 years, each the other's inverse.",
  "3 orders a year, a cycle of four months, since lots are placed quarterly."],
 "Orders a year are D / Q = 300 / 140 = 2.142857, and the cycle is Q / D = 0.466667 years. The engine places no order on a calendar; the lot and the demand set the cycle.")

q(2, "For the stud of his Figure III, Harris gives 48.5. Run with the rule none on his inputs, what EOQ comes out?",
 "An EOQ of 48.554321, which Harris prints a little short of the formula.",
 ["An EOQ of 48.5 exactly, which is why the stud is the check the course trusts most.",
  "An EOQ of 49.000000, Harris's words.",
  "An EOQ of 2190.890230, since the stud and his first example share the same inputs."],
 "The stud's inputs, annual demand 360, set-up cost 1.85, unit cost 5.65 and a holding rate of 0.1, give 48.554321. Harris prints 48.5, short of it, as he prints his other lots. 49.000000 is what the engine orders under the stated rule nearest multiple of 1. 2190.890230 is his first example, on different inputs.")

q(1, "The connector of Harris's Figure II is read as an annual demand of 14760, an order cost of 2.15, a unit cost of 0.0135 and a holding rate of 0.1. What EOQ does the engine return, and what did Harris print?",
 "6856.626965 from the engine; Harris printed 6,850.",
 ["6,850 from the engine; Harris printed 6856.626965.",
  "6856.626965 from the engine, and Harris printed exactly the same figure.",
  "2190.890230 from the engine; Harris printed 2,190 for the connector."],
 "On the course's reading the connector's EOQ is 6856.626965, and his article gives 6,850: his print falls short of the formula here too. A learner quotes the engine's figure to six decimals and the print as printed. 2190.890230 and 2,190 belong to his first example, a different set of inputs.")

q(1, "The baryte reason prints \"a relevant cost of 7861.14 a year\", while the panel's field reads 7861.142857. Which figure does a learner reason with, and why do they differ?",
 "The field, 7861.142857; inside a message the engine prints money rounded to the cent.",
 ["The reason, 7861.14, since the field carries rounding noise from binary arithmetic.",
  "Either one, since two figures that print alike are equal for every purpose in the course.",
  "The field, since the reason's figure is the relevant cost at the EOQ and the field is not."],
 "Inside a message the engine prints money to the cent and a computed quantity to six decimals; the numeric field carries the figure at six decimals, and that is the one to reason with. Printed alike is not equal. Both figures are the relevant cost at the quantity ordered; the cost at the EOQ is 7859.770989.")

q(1, "The Cost of an order control is set to -5. What does the engine do?",
 "It refuses orderCost, and the -5 is printed back exactly as it was typed.",
 ["An EOQ on an order cost of 5, the sign dropped since a cost cannot be negative.",
  "An EOQ of 0.000000, since a negative order cost makes every lot size free.",
  "\"annualDemand must be a finite number above 0; got -5\", naming the demand."],
 "The engine's words are \"orderCost must be a finite number above 0; got -5\". An order cost below zero has no meaning. It drops no sign and computes nothing on a policy that cannot work. The demand is stated and valid, so the refusal names orderCost.")

q(2, "An EOQ call states neither a holding rate nor a holding cost a unit a year. What does the engine print?",
 "\"holdingCostPerUnitYear or holdingRate: state exactly one (holdingRate goes with unitCost)\"",
 ["\"unitCost is required with holdingRate (the holding cost is holdingRate x unitCost)\"",
  "An EOQ on a holding rate of 0.22, the rate the Ekene baryte case states.",
  "An EOQ that grows without limit, since holding stock costs nothing at all."],
 "Neither form stated leaves nothing to hold against, and the engine refuses it with the same message it gives when both are stated: exactly one of the two forms is needed. It takes no rate from any register on its own. The unit cost message is for a rate stated without a price.")

q(2, "Rounding up to a multiple of 0 is typed into the rounding controls. What happens?",
 "rounding.multiple is refused before any rounding is tried, with the 0 it got in the message.",
 ["The EOQ unrounded, read as rule none.",
  "\"rounding gives an order quantity of 0 from the EOQ 400; state a smaller multiple or another rule\"",
  "The EOQ rounded up to the next whole unit, since 0 is read as the smallest multiple there is."],
 "The engine's words are \"rounding.multiple must be a finite number above 0; got 0\". A multiple of 0 has no meaning. The message about an order of nothing is for a valid multiple the EOQ cannot reach. The engine reads no multiple as another rule.")

q(0, "The baryte case lists every result the eoq function returns. Which of these is on that list?",
 "The purchase cost a year, 78000.000000, reported beside the relevant cost and outside it.",
 ["The count of spare lots to keep on the shelf between deliveries, from the stated demand.",
  "The net present value of a year's orders, discounted at the stated holding rate.",
  "The supplier's price break at which a larger lot would cost less per tonne."],
 "The eoq function returns the EOQ, the quantity ordered, the holding cost of a unit for a year, orders a year, the cycle, the ordering, holding and relevant costs at the quantity ordered, the relevant cost at the EOQ, the rounding penalty and the purchase cost. It discounts nothing, prices no schedule and sets no stock target; stock targets belong to other functions, taught at the Professional tier.")

q(2, "Why does a stated rounding rule cost baryte so little, whether up to 10 or even up to 50?",
 "The relevant cost is flat near its minimum, so a lot some way from the EOQ adds only a small percentage.",
 ["The engine charges no holding cost on the part of a lot above the EOQ, so a larger lot is nearly free.",
  "The penalty is set against the purchase cost of 78000.000000, which dwarfs any change in the lot.",
  "The engine rounds every relevant cost to the cent before it compares them, which hides the difference."],
 "Near its minimum the relevant cost changes slowly with the lot size: 140 costs 0.017454 percent more a year and 150 costs 0.384604 percent more. The penalty is a percentage of the relevant cost at the EOQ, the purchase cost stays out of it, and the holding cost is h Q / 2, charged on the units held. Money is rounded to the cent only inside a message.")

q(2, "What does the Ekene register's note on the baryte case say the order cost of 1800 covers?",
 "The purchase order, the marine freight booking and receiving at the Ekene shore base.",
 ["The purchase price of a tonne, the freight to the field and the insurance of the cargo while at sea.",
  "The storage of a lot at the shore base for the year, with its handling and rent.",
  "The cost of running out between two orders, spread over the orders of a year."],
 "The note reads \"order cost covers the purchase order, the marine freight booking and receiving at the Ekene shore base\". The price of a tonne is the unit cost, storage belongs in the holding cost, and a stockout cost is no part of the EOQ. Writing down what an order cost covers lets someone else check it.")

# Slow-moving and obsolete
q(0, "On the stated boundary items with the Ekene bands, AT12 has gone 12 months without an issue and BELOW12 has gone 11.99 months. What bands does the engine return?",
 "AT12 is slow and BELOW12 is active, since a band is reached at or above its minimum.",
 ["Both are slow, since 11.99 rounds to 12 at the engine's precision.",
  "Both are active, since a band starts only after its minimum is passed.",
  "AT12 is active and BELOW12 is slow, since the bands count down from 36."],
 "A band minimum is reached at or above it, the engine's stated choice: 12 months reaches slow and 11.99 months does not. Twelve significant digits separate 11.99 from 12 plainly, so no tie arises. Bands count up from active at 0 months.")

q(0, "ONEUNIT holds 13 units and uses 0.5 a month. It has reached 36 months without an issue, and its 26.000000 months of cover sits against a limit of 24. Band, write-down and excess?",
 "Band obsolete, its whole stock value written down, and 1.000000 unit of excess.",
 ["Band very slow, half its value written down, since 36 is the top of that band.",
  "Band obsolete, written down in full, and no excess, since obsolete stock is not counted.",
  "Band obsolete, and 26.000000 units of excess, one for each month of cover."],
 "36 months reaches the obsolete minimum, so the item is written down 100 percent of its stock value. Its cover of 26.000000 months is above 24, and the stock above 24 months of usage, 1.000000 unit, is excess. The band and the excess are reported side by side.")

q(0, "The surface safety valve actuator SSV-ACT holds 1 unit at 27500 and has gone 26 months without an issue. What write-down does the engine return?",
 "13750.000000: band very slow, 50 percent of 27500.000000.",
 ["A quarter of the value, since 26 months is still inside band slow.",
  "27500.000000 in full, since any item past 24 months is obsolete.",
  "0.000000, since its cover is inside the limit."],
 "The engine's reason reads \"SSV-ACT: 26 months since the last issue is at or above 24, band very slow (below 36), written down 50% of 27500 = 13750; cover 12.004802 months is at or below 24\". Slow runs from 12 to below 24, obsolete starts at 36, and cover decides excess, which leaves the write-down alone.")

q(1, "Band very slow holds just SSV-ACT and GASKET-RJ. What stock value and write-down does the engine print for it?",
 "32060.000000 held, with half of it, 16030.000000, written down.",
 ["4 items, 265700.000000 of stock.",
  "2 items, 32060.000000 of stock, all of it written down at the year end.",
  "1 item, 15500.000000 of stock, written down in full at 100 percent."],
 "SSV-ACT and GASKET-RJ are band very slow: 27500 + 4560 = 32060.000000, written down 50 percent, 16030.000000. 4 items and 265700.000000 are band slow; one item at 15500.000000 is band obsolete.")

q(1, "What does the engine return for the eleven Ekene items in band active?",
 "589980.000000 of stock value, with nothing at all written down.",
 ["A stock value of 903240.000000 and a write-down of 97955.000000.",
  "A stock value of 589980.000000 and a write-down of a quarter of it.",
  "No figures for active stock."],
 "Band active is written down 0 percent in the Ekene policy, so its 11 items carry 589980.000000 of stock and nothing written down. 903240.000000 and 97955.000000 are the register's totals. Every item in the call takes a band and appears in the totals.")

q(3, "The pressure transmitter PT-XMTR holds 14 units and uses 0.8333 a month. What cover does the engine return, and is any of it excess?",
 "16.800672 months of cover, inside the limit of 24, so none of it is excess.",
 ["9 months of cover, so no excess.",
  "16.800672 months of cover, which is excess, since any cover above 12 months counts.",
  "14 months of cover, one for each unit on hand, so 2 units above the band minimum."],
 "Cover is on hand over monthly usage: 14 / 0.8333 = 16.800672 months, at or below 24, so there is no excess. Nine months since its last issue sets its band, active. The cover limit is the stated 24 months, and a band minimum has nothing to do with excess.")

q(1, "The ESP motor ESP-MTR holds 1 unit and uses 0.1667 a month. What cover does the engine return?",
 "5.998800 months, inside the limit of 24, from 1 divided by 0.1667.",
 ["6 months exactly, since 0.1667 is one sixth of a unit a month.",
  "7 months, the time since its last issue, which the engine reads as cover.",
  "0.1667 months, the usage itself, since it holds a single unit on hand."],
 "Cover is 1 / 0.1667 = 5.998800 months. The usage is stated as 0.1667, and the engine divides by the figure as stated; it is close to one sixth and printed alike is not equal. Seven months since the last issue is a separate measure that sets its band, active.")

q(2, "A policy states its bands from 0, then 24, then 12 months. Which message does the engine return?",
 "\"bands[2].minMonths must be above the band before it (24); got 12\"",
 ["The bands, sorted so 12 comes before 24.",
  "\"bands[0].minMonths must be 0 so that every item takes a band; got 6\"",
  "The bands, with the third band moved to 24 so that each starts above the last."],
 "Each band must start above the one before it, and the engine refuses the first band that fails, naming the minimum it had to exceed. The first-band message is for a first band that starts above 0, and the engine moves and merges nothing.")

q(1, "A slow-moving call names two bands with the same label a. What does the engine print?",
 "Refused on the second band's field: \"bands[1].label repeats the label 'a'\"",
 ["The bands, with the second a renamed so that each label stays unique.",
  "The bands, with the two a bands merged into the first of them.",
  "A refusal in the engine's words: \"bands must be an array of at least 1 band { label, minMonths, writeDownPct }\""],
 "A band label may be used once only, and the repeat is refused on the second band's field. The engine renames and merges nothing. The message about an array of bands is for a call with no bands at all.")

q(2, "The first item in a slow-moving call has an on-hand figure of -1. What comes back?",
 "The figure is turned away on items[0].onHand, with the -1 echoed in the message.",
 ["The item's band, with its stock value of -1 times its unit cost added into the totals.",
  "A band with 0 read as on hand.",
  "Its band, and a note that the register needs a stock count, printed beside it."],
 "The engine's words are \"items[0].onHand must be a finite number at or above 0; got -1\". Stock on hand below zero has no meaning. It reads no figure as another and adds nothing it refused to the totals.")

q(3, "A register exported from another system gives each item a lastIssue field. What does slowMoving make of it?",
 "A refusal of lastIssue by name, listing the six keys an item may carry.",
 ["The item banded on lastIssue read as its months since the last issue, the nearest key.",
  "The item banded with lastIssue ignored, and a refusal only if no months are stated.",
  "\"items[0].monthsSinceLastIssue must be a finite number at or above 0; got undefined\""],
 "The engine's words are \"items[0].lastIssue is not an accepted key; the accepted keys of items[0] are id, name, onHand, unitCost, monthsSinceLastIssue, monthlyUsage\". It checks accepted keys at every level before it reads an input, and it would be refused first even with monthsSinceLastIssue missing as well. It reads no key as another and ignores no key.")

q(1, "Which Ekene items carry excess stock under the stated cover limit of 24 months?",
 "Three: ORING-KIT, GASKET-RJ and HEAT-TRC.",
 ["Two: ORING-KIT and GASKET-RJ, since HEAT-TRC has no usage and so no cover.",
  "Four: the three in bands slow, very slow and obsolete that hold the most stock, and CSG-958.",
  "One: HEAT-TRC, the only item in band obsolete."],
 "ORING-KIT has 80.000000 months of cover and GASKET-RJ 30.000000, both above 24; HEAT-TRC has no usage, so all its stock on hand is excess. CSG-958 is band slow with 3.000000 months of cover and no excess. Excess and band are separate measures.")

# The engine, the course and the texts
q(0, "Where is the Materials & Spares Planner, and how do its figures relate to the course's register calculator?",
 "In the Suite's Midstream & Downstream module; it vendors the same engine, so the same inputs give the same figures.",
 ["In the Suite's Drilling module; it runs its own engine, so a panel figure is checked against it by hand.",
  "In the academy itself, as a certificate reward; it adds figures the panels leave out for Suite learners.",
  "In the Suite's Production module; it vendors an older engine, so small differences are expected there."],
 "The Planner sits in the Suite's Midstream & Downstream module and vendors this same engine. A figure worked in a panel and the same inputs typed into the Planner come from the same engine file, and every practical runs in the course's own panels.")

q(3, "Which of these does the engine take as a stated input, with nothing computed behind it?",
 "The demand, with no forecast of it made anywhere in the engine.",
 ["The EOQ, read from the policy.",
  "The weighted score, which the policy states for each item in the register.",
  "The cumulative share, which the register carries for each item it ranks."],
 "The engine forecasts no demand: a demand is a stated input. It computes the EOQ from the stated costs, the weighted score from the stated scores and weights, and the cumulative share from the stated usages and costs.")

q(0, "A question in this course touches tendering or discounting. Where does the course send the learner?",
 "To the procurement course for tendering and bid evaluation, and to the cash flow course for discounting.",
 ["Nowhere: the engine runs a tender and discounts each cost, and this course teaches both in module 4.",
  "To the Planner, which carries a tender module and a discounting module beside the stock views.",
  "To the lectures of ESD.260J, which the course quotes for both subjects in their own words."],
 "The engine runs no tender and discounts no cost. The course names the procurement course for tendering, bid evaluation and contract types, and the cash flow course for discounting and NPV, in one sentence each, and teaches neither. The lectures are cited by lecture and slide and quoted nowhere.")

q(3, "What does baryte's EOQ of 137.408584 say, and what does it leave unsaid?",
 "It is the cheapest lot for the stated costs; it forecasts no demand and is no supplier's promise.",
 ["It is the tonnage the store will use in the next cycle, forecast from the stated demand of 300 a year.",
  "It is the lot the supplier has agreed to deliver, at the stated order cost of 1800 per order.",
  "It is the stock the store should hold at all times, above which baryte is reported as excess."],
 "An EOQ is the cheapest lot for the stated costs, and it is quoted with them. It is not a forecast of use, a supplier's commitment or a stock level; excess is set by the stated cover limit in the slow-moving view.")

q(0, "A register of many thousands of lines is sent to the ABC view in one call. Up to how many items will the engine take?",
 "5000, the cap DEFAULTS.MAX_ITEMS sets.",
 ["18, the size of the Ekene register.",
  "20, the same cap the criteria carry.",
  "No cap, since a register may hold any number of stock items."],
 "DEFAULTS.MAX_ITEMS is 5000 for one criticality, ABC or slow-moving call. Twenty is the cap on criteria, and the Ekene register's eighteen items sit far inside the cap. A call beyond the cap is refused by name.")

q(2, "What does every result the engine returns carry beside its figures?",
 "A basis block naming the rules applied and their sources, and a reason for each item or figure.",
 ["A confidence band on each figure, drawn from the canonical Monte Carlo on a fixed seed.",
  "A list of the inputs the engine filled in for itself, so the learner can review them.",
  "A grade, from A to C, of how far the stated policy departs from an industry standard."],
 "Every result carries a basis naming the rules and where they come from, and a reason on each item, band or candidate, so the working can be printed. The Associate functions sample nothing, the engine fills in no input, and no standard is read against which a policy could be graded.")

emit(Q, '/root/cat-wip-materials/banks/sc3b_exam.json', expect_n=42)
finish()
