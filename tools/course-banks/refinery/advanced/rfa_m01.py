import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Expert m01, One Shape, Three Ledgers. Digest sections 18 and 19 only,
# as the four lessons of m01 teach them: the three ledgers, the nine event types
# and their signs, what makeEvent refuses, a null cost, and the ODIOMA plan
# ledger. 15 questions.

q(1, "The stream model holds a plan event, a scheduled event and a recorded actual. What tells the three apart?",
 "Only the ledger each one is marked with: plan, schedule or actual.",
 ["The fields: an actual event adds a cost field.",
  "The sign: plan quantities positive, actuals negative.",
  "The grain: plan events by day, actuals by month."],
 "A plan event, a scheduled event and a recorded actual are the same shape, marked by their ledger: plan, schedule or actual. Because the shape is shared, the variance can match them on material and type with the same code on every line.")

q(3, "makeEvent records a delivery of 100 bbl. What signedQuantity does the engine return, and is the event flagged as emitting by its nature?",
 "-100, and it is not flagged as emitting.",
 ["100, since a typed quantity is never negative.",
  "0, since a delivery moves product inside the site.",
  "-100, and it is flagged as emitting."],
 "Direction comes from the event type. A delivery of 100 bbl signs to -100 for the site's stock, and its emits flag reads false. Only burn, flare and vent read true.")

q(0, "Which event type signs a quantity of 100 bbl to -100 while its emits-by-nature flag reads false?",
 "loss",
 ["flare", "vent", "unit_run"],
 "A loss removes barrels, -100 for 100 bbl, and emits nothing by its nature. Flare and vent also sign to -100 but read true on the flag, and a unit_run signs to 0.")

q(2, "A unit_run of 100 bbl is recorded for the ODIOMA reformer. What does makeEvent return as its signedQuantity?",
 "0, because the run moves material inside the site.",
 ["-100, the naphtha feed it consumes.",
  "100, the reformate it makes.",
  "-100, flagged as emitting, since a unit burns fuel while it runs."],
 "A transfer, a unit_run and a blend all sign to 0. Each moves material inside the site, so the site as a whole holds the same quantity after the event, and none of the three emits by its nature.")

q(0, "A clerk keys a quantity of -500 into makeEvent to reverse a delivery. What does the engine return?",
 "REFUSED: \"Event quantity is unsigned; direction comes from the event type\"",
 ["An accepted receipt of 500 bbl, since a negative delivery is read as material coming back in.",
  "REFUSED: \"Unknown event type \"sale\"\", the same message any bad type gets.",
  "An accepted delivery with its quantity stored as 500 bbl and a warning flag set."],
 "The quantity is unsigned and the type carries the direction. A quantity of -500 would state the sign twice, and the engine does not guess which was meant. It refuses and says where direction comes from.")

q(3, "An event is sent to makeEvent marked with a ledger called forecast. What happens to it?",
 "It is refused by name: \"Unknown ledger \"forecast\"\".",
 ["It is accepted into the plan ledger.",
  "It is accepted and listed as unmatched.",
  "It is refused with the quantity message, because a forecast quantity is unsigned."],
 "The stream model knows three ledgers: plan, schedule and actual. An event marked with any other ledger would sit outside every comparison the variance makes, so it is stopped at the door and the refusal names the word that caused it.")

q(0, "A trader wants to record an lpg sale with the event type sale. What does makeEvent do?",
 "Refuses it: \"Unknown event type \"sale\"\".",
 ["Accepts it as a delivery.",
  "Accepts it as revenue, signed 0.",
  "Accepts it as costed false."],
 "The nine event types are the only ones the engine knows. A type called sale is refused by name, because the engine could not set its direction or place its value on the cost or the revenue side. In this model a sale is recorded as a delivery.")

q(2, "An event is recorded with no cost at all. What does it carry, and how does a variance line built from it read?",
 "Cost null, and the line reads costed false.",
 ["Cost 0, and the line reads costed true.",
  "It is refused, naming the missing cost.",
  "Cost 0, and the line reads costed false."],
 "A cost of 0 says the movement cost nothing. A null says nobody has costed it yet. The engine keeps them apart and marks the line costed false. Every ODIOMA variance line reads costed true.")

q(1, "How many barrels of Escravos (illustrative) does the ODIOMA plan ledger receive?",
 "600000.00 bbl",
 ["700000.00 bbl", "350000.00 bbl", "400000.00 bbl"],
 "The escravos receipt line reads 600000.00 bbl in 2 events. The crude has 700000.00 bbl available, so the plan leaves some of it unused. Forcados (illustrative) is received at 400000.00 bbl, its full availability.")

q(3, "The plan ledger's cdu unit_run line reads a quantity equal to which other ODIOMA plan figure?",
 "The plan's total crude, 1000000.00 bbl.",
 ["The crude unit's capacity, 1200000.00 bbl.",
  "The Escravos availability, 700000.00 bbl.",
  "The reformer's 190000.00 bbl."],
 "The cdu unit_run line and the plan's total crude both print 1000000.00 bbl, since every barrel of crude passes through the unit with no feed. Its capacity of 1200000.00 bbl is another row of the configuration, and 700000.00 bbl is what Escravos has available.")

q(0, "Read the ODIOMA reformer's plan ledger quantity beside its capacity in the configuration. How do the two compare?",
 "They are equal, 190000.00 bbl each.",
 ["The ledger reads 131000.00 bbl against a capacity of 190000.00 bbl.",
  "The ledger reads 190000.00 bbl against a capacity of 1200000.00 bbl.",
  "The ledger reads 1000000.00 bbl, every barrel of crude, against 190000.00 bbl."],
 "The reformer line reads 190000.00 bbl and the reformer's capacity reads 190000.00 bbl, so the plan runs it full. 1200000.00 bbl is the crude unit's capacity.")

q(3, "At what value per barrel does the ODIOMA plan ledger hold its gasoline deliveries?",
 "110.5000, the gasoline price the plan was solved with",
 ["104.9000, the price of the Jet A-1 the plan also delivers",
  "4.7763, the plan's gross margin per barrel of crude",
  "100.6000, the diesel price in the product table"],
 "The plan ledger prices every movement at the configuration's own figure. The gasoline line reads 18055700.00 over 163400.00 bbl, 110.5000 a barrel, the gasoline price in the product table. That plan unit value is the price the volume variance later uses.")

q(2, "The plan ledger shows 2 events on each crude receipt line and 5 on each product delivery line. How does the variance read those events?",
 "It reads only each line's sum, so a cargo landing a day late inside the month moves no line.",
 ["It matches each event with the dated actual event nearest to it and prices the gap in days.",
  "It takes the value per barrel of the first event on each line as the line's unit value.",
  "It averages the events on a line, so a line with 5 events carries more weight than one with 2."],
 "The plan ledger is summed from the scheduled events by material and type, and that is the grain the variance matches on. The event count shows the schedule's shape; the variance reads the sum.")

q(3, "What does the value on a unit_run line of the ODIOMA plan ledger record?",
 "What running the unit costs, 1400000.00 for the cdu.",
 ["What the unit's products sell for, since a unit run makes the products the plan delivers.",
  "The value of the crude fed to the unit, 78.9000 a barrel on the Escravos share of the run.",
  "Nothing, since a unit_run signs to 0 and so carries a value of 0."],
 "A delivery's value is what it sold for and every other event's value is what it cost. The cdu line reads 1000000.00 bbl at an operating cost of 1.4000 a barrel, a value of 1400000.00.")

q(1, "The ODIOMA configuration lists the Crude distillation unit with no feed stream. What does the plan make of it?",
 "It is the crude unit and carries every barrel of crude.",
 ["It is left out of the plan, because a unit with no feed has nothing to run.",
  "It runs the Escravos crude alone, since that is the first crude in the configuration.",
  "It writes no crude-unit row until a feed stream is typed against it in the configuration."],
 "An owner decision in force names the unit with no feed as the crude unit. The plan needs no feed stream typed against it, and the ledger shows the result on the cdu unit_run line.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/advanced/rfa_m01.json', expect_n=15)
finish()
