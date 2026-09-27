import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Professional final exam, forty-two questions across the six modules
# (eight on deal value, six on paying the fee on time). Every figure is quoted
# from digest.txt, where the engine returned it on the Ekene fixture or a
# stated golden input, and every key was re-run through the vendored engine by
# the writer's witness. The exam asks each module's material from a different
# side than the module bank does. Every fee question states its value of the
# transaction and its dates; the day count and the ninetieth surcharge day are
# keyed only as the engine's stated readings. deal-ekene-bonus-zero is not
# keyed (BANKNOTES-intermediate.md). No capstone name, term, series or value.

# ---- caps and overrun rules ----

q(2, "Of the 46000000.000000 Ekene Deep success well (synthetic), how much falls to EKO once FIN has paid 40.000000 percent of the first 44000000.000000 and the post-deal interests share the rest? FIN earns 30.000000 of EKO's 70.000000; PA holds 30.000000.",
 "14000000.000000",
 ["12000000.000000, what EKO pays on the dry hole, which sits inside the cap",
  "17600000.000000",
  "15200000.000000, the farmor's payment on a well of 48000000.000000"],
 "EKO's payment on the success well is 14000000.000000 in the engine's event table: its share of the promoted 44000000.000000 less FIN's promote, plus its post-deal 40 percent of the 2000000.000000 above the cap. On the 40000000.000000 dry hole it pays 12000000.000000. The other two figures come from the 48000000.000000 teaching well under its two overrun rules.")

q(0, "A 40000000.000000 well has its carry capped at exactly 4000000.000000, the carry the promote produces when FIN pays 40.000000 percent to earn 30.000000 (EKO 70.000000, PA 30.000000 before). Which cap state and payment come back?",
 "\"exactly\", FIN paying 16000000.000000",
 ["\"exceeded\", FIN paying 14500000.000000",
  "\"below\", FIN paying 16000000.000000",
  "\"exactly\", FIN paying 12000000.000000"],
 "At a carry cap of 4000000.000000 the carry the promote produces meets the cap to the dollar: the engine reports \"exactly\" and splits the well as though no cap stood, FIN 16000000.000000 and EKO 12000000.000000. Lower caps hold the carry and cut FIN's payment: 14500000.000000 at a cap of 2500000.000000 and 12000000.000000 at a cap of 0.")

q(3, "In the box, a gross-cost cap is written with an amount of 0 on the first event. What is the engine's reply?",
 "A refusal: a gross-cost cap amount must be above 0",
 ["A result in which the promote applies to nothing and the whole well is split by the stated overrun rule",
  "A result with cap state \"exceeded\" and a carry of 0.000000, as under a carry-amount cap of 0",
  "A refusal: an amount may stand only beside a cap of \"none\", where 0 means no cap at all"],
 "A gross-cost cap of 0 is refused, and the message names the amount: \"events[0].cap.amount must be a finite number above 0; got 0\". A carry-amount cap of 0 is accepted and returns \"exceeded\" with a carry of 0.000000, so the two cap types have different boundaries. An amount beside a cap of \"none\" is refused too, whatever its size.")

q(1, "An earning event is stated with no cap object at all. How does the engine answer?",
 "events[0].cap must be an object { on } with on \"none\", \"gross-cost\" or \"carry-amount\" (no default); got nothing",
 ["A result with no cap applied, since a missing cap and a cap of \"none\" come to the same split of the cost",
  "events[0].cap.overrunRule must be one of \"post-deal-interests\", \"farmor-side\"; got nothing",
  "A result with a gross-cost cap at the stated gross cost, reported in the basis"],
 "The engine's words: \"events[0].cap must be an object { on } with on \"none\", \"gross-cost\" or \"carry-amount\" (no default); got nothing\". Every event states its cap, even when it is \"none\": the engine supplies no cap of its own. The overrunRule message belongs to a gross-cost cap without its rule.")

q(2, "A learner types a cap key the engine does not read, \"limit\", into the first event's cap. Which answer is printed?",
 "events[0].cap.limit is not an accepted key; the accepted keys of events[0].cap are on, amount, overrunRule",
 ["A result with the limit ignored and the cap read from the keys the engine knows",
  "A result with the limit read as the cap amount, the two words meaning the same thing in a deal",
  "events[0].cap.on must be one of \"none\", \"gross-cost\", \"carry-amount\"; got \"limit\""],
 "The engine refuses an unknown key at whatever level it sits, naming its path and the accepted keys: \"events[0].cap.limit is not an accepted key; the accepted keys of events[0].cap are on, amount, overrunRule\". It never drops a misspelt term silently, and it reads no synonym. The cap.on message is for an unknown cap type.")

q(0, "A first-event cap is stated as { \"on\": \"net-cost\" }. What does the engine return?",
 "events[0].cap.on must be one of \"none\", \"gross-cost\", \"carry-amount\"; got \"net-cost\"",
 ["A result with the cap applied to the cost net of PA's share, the part FIN and EKO pay between them",
  "A result with the cap read as \"gross-cost\", the nearest accepted type",
  "events[0].cap must be an object { on } with on \"none\", \"gross-cost\" or \"carry-amount\" (no default); got \"net-cost\""],
 "The engine names the three accepted cap types and refuses any other: \"events[0].cap.on must be one of \"none\", \"gross-cost\", \"carry-amount\"; got \"net-cost\"\". It maps no unknown type to a near one. The \"must be an object\" message is for an event with no cap object.")

q(3, "Two sides share the 2000000.000000 by which a 46000000.000000 Ekene well overshoots its 44000000.000000 cap when the stated rule is \"post-deal-interests\" and FIN is earning 30.000000 of EKO's 70.000000. Who pays that overshoot, and at what shares?",
 "FIN at 30 percent and EKO at 40 percent; PA pays its own 30 percent",
 ["FIN alone, at its 40.000000 percent promoted share, with the farmor paying none of the part above the line",
  "EKO alone, at its whole 70 percent, while FIN pays nothing of it and PA keeps to its own share",
  "All three at their interests before the deal: EKO 70 and PA 30 percent, FIN paying none"],
 "Under this rule each side meets the overshoot at the participating interest it holds once the event is done, and the engine's reason lists those shares as \"(FIN 30%, EKO 40%)\". PA sits outside the deal and meets its own 30 percent of every dollar through the canonical partner split. The farmor meeting the overshoot alone at 70 percent is the other overrun rule.")

# ---- drill-to-earn vesting ----

q(1, "With one of the two Ekene events done (the 40000000.000000 exploration well, 40.000000 paid for 20.000000, uncapped), what changes when the vesting rule moves from \"all-events\" to \"per-event\"?",
 "Only the vested interest: 20.000000 against 0.000000, for the same payment of 16000000.000000",
 ["Both the vested interest and the payment: \"per-event\" also counts the appraisal well's cost as paid",
  "Nothing: vesting is reported only once every event is complete",
  "Only the payment: FIN pays less under \"per-event\""],
 "The engine returns 16000000.000000 paid and a consideration of 8000000.000000 under both rules; \"all-events\" vests 0.000000 (\"vesting \"all-events\": 1 of 2 events completed; nothing vests\") and \"per-event\" 20.000000 (\"vesting \"per-event\": 1 of 2 events completed; 20% vests\"). The vesting rule decides when the interest is assigned; the payments are the completed events' in both.")

q(3, "What is left for EKO to pay on the Ekene appraisal well once FIN has paid its 45.000000 percent of the 30000000.000000? FIN earns 15.000000 there on top of 20.000000, with the carry capped at 3000000.000000; EKO held 70.000000 before the deal.",
 "7500000.000000",
 ["13500000.000000, FIN's payment on the same well",
  "EKO's post-deal 35 percent of the whole well",
  "12000000.000000, EKO's payment on the exploration well"],
 "In the engine's event table the appraisal well splits FIN 13500000.000000 and EKO 7500000.000000, with a carry of 3000000.000000 that reaches its cap exactly. EKO pays what is left of its post-deal share once the carry is paid for it. 12000000.000000 is EKO's payment on the exploration well.")

q(0, "After both Ekene events, vested under \"all-events\", which participating interest does PA hold, and why?",
 "30.000000: the earned interest comes out of EKO's alone",
 ["A smaller share, FIN's 35 percent being taken pro rata from EKO and PA",
  "35.000000, the licence being split three equal ways",
  "30.000000, since PA consents to the deal by keeping it"],
 "The engine returns EKO 35.000000, PA 30.000000 and FIN 35.000000 after both events. The farminee's interest comes out of the farmor's interest alone: the event's earned percentage is taken from EKO, and PA, which is no party to the deal, keeps its 30 percent. PA's consent plays no part in the engine's arithmetic.")

q(2, "A deal names PA, already a licence party, as the farminee. What does the engine return?",
 "farminee.id must be an id no licence party has (EKO, PA); got \"PA\"",
 ["A result in which PA's own interest simply grows by the interest earned from EKO",
  "A result with PA treated as a new party alongside its old interest, two rows under one id",
  "farmor must be one of \"EKO\", \"PA\"; got \"PA\", the farminee's id standing in the farmor's place"],
 "The engine's words: \"farminee.id must be an id no licence party has (EKO, PA); got \"PA\"\". The farminee earns its way into the licence, so it must be a new party; a transfer between existing parties is some other deal. The farmor message is for a farmor id that no party has.")

q(1, "A single 40000000.000000 well (FIN paying 40.000000 percent to earn 30.000000, uncapped, EKO 70.000000 and PA 30.000000) is stated with 0 events completed under \"per-event\". What does the engine report for the event and the totals?",
 "FIN's obligation of 16000000.000000 in the event, and totals of 0.000000",
 ["No event row at all, since an uncompleted event is left out of the result",
  "The event's 16000000.000000 in the totals as well, since the obligation is binding from signing",
  "A refusal: eventsCompleted must be at least 1"],
 "The engine's reason ends \"(not completed: the obligation only)\", and the totals are 0.000000 paid and 0.000000 percent vested: every event's split is reported as the obligation, and only completed events count in the totals. Zero completed events is an accepted input, which returns a result.")

q(3, "The engine prints a refusal that names events[1].farmineePaysPct and the share 36 under the farmor-side rule. What does the message say about the second event?",
 "Its share must be at or above 36, where the carry is 0; 35 leaves a carry of -400000",
 ["Its share must be at most 36, since a larger share would promote the farminee beyond the farmor's interest",
  "Its interest earned must be at most 36, the interest left",
  "Its share of 35 is accepted, the farmor carrying the farminee"],
 "The second event is guarded the same way as the first. Its message says the share must be at or above 36, the share at which the carry is 0 when the farmor side pays the excess, and that 35 percent of the promoted 40000000 leaves a carry of -400000. A negative carry is refused on every event where it arises, and the minimum is a floor.")

q(2, "With only the exploration well completed under \"all-events\" (40000000.000000 gross, 40.000000 paid for 20.000000, uncapped; no bonus, no reimbursement), what equivalent working interest does the engine report?",
 "40.000000 percent",
 ["20.000000 percent",
  "0.000000 percent",
  "42.142857 percent"],
 "The equivalent working interest counts the completed events' cost whatever has vested: 16000000.000000 over 40000000.000000 is 40.000000 percent. 20.000000 is the interest earned by the first well, 0.000000 is what has vested, and 42.142857 is the figure once both wells are done.")

# ---- deal value to each side ----

q(0, "Suppose the Ekene Deep well were sure to find oil: chance of success 100.000000 percent, nothing else changed. Which actions does the engine pick for each side?",
 "EKO drills alone; FIN farms in",
 ["EKO farms out; FIN farms in, both taking the certain success",
  "EKO walks away, the deal left unused",
  "EKO drills alone; FIN declines"],
 "On deal-ekene-certain every EMV is its success payoff: EKO alone 157675235.929265, EKO after the farm-out 99708134.816723, FIN 57575101.112542. Keeping the whole 70 percent is worth more than farming out, so EKO drills alone, and FIN's positive payoff makes farming in its best action.")

q(3, "Strike the cap from the Ekene deal altogether (cap \"none\"), so FIN pays its 40.000000 percent of every dollar of the 46000000.000000 success well; the chance stays 25.000000 percent and the bonus, reimbursement and fees are unchanged. Where does FIN's EMV land?",
 "-1856224.721864",
 ["-1806224.721864, as under the gross-cost cap of 44000000.000000",
  "-1656224.721864, the figure under the farmor-side rule",
  "-706224.721864, the figure under a carry-amount cap"],
 "On deal-ekene-no-cap the engine returns FIN -1856224.721864 and EKO after the farm-out 19883033.704181: without the cap FIN pays 40 percent of the whole success well, so its EMV falls and EKO's rises by the same amount. -1806224.721864 is the fixture deal with its cap; the other two belong to two other stated caps.")

q(1, "Under the overrun rule \"farmor-side\", with every other Ekene Deep term unchanged (gross-cost cap 44000000.000000, 40.000000 percent paid for 30.000000, chance 25.000000 percent), what is FIN's EMV?",
 "-1656224.721864, still below 0",
 ["-1806224.721864, as the dry hole sits inside the cap and the rule never acts",
  "-1856224.721864, the farminee paying more",
  "193775.278136, so FIN farms in"],
 "On deal-ekene-farmor-side the engine returns FIN -1656224.721864, and EKO after the farm-out 19683033.704181. The rule acts on the success well's 2000000.000000 above the cap, which EKO now pays alone, so FIN's EMV rises and EKO's falls; FIN still declines. The dry hole is below the cap, but the success outcome carries weight in the EMV.")

q(2, "A deal states the success-case value directly as an NPV of 271250000.000000, the fixture's 271250337.041807 rounded to the nearest thousand, with every other Ekene Deep term unchanged. How does EKO's EMV alone compare with the fixture's 18418808.982316?",
 "It is 18418750.000000, a different figure quoted with its own inputs",
 ["It is 18418808.982316, the same figure, since the rounding is too small to move an EMV",
  "It is 18418750.000000, and the course calls the two EMVs equal at the precision it prints",
  "It is refused: an NPV and cash flows cannot both describe it"],
 "On deal-ekene-npv-stated the engine returns EKO alone 18418750.000000, EKO after the farm-out 19833000.000000 and FIN -1806250.000000. The EMVs differ from deal-ekene's by the rounding scaled by each interest and the chance, and the course quotes each with its own inputs and never calls them equal. Stating the value as an NPV is accepted; stating both an NPV and cash flows in one call is what the engine refuses.")

q(3, "If Ekene Deep comes up dry, FIN has spent its 16000000.000000 share of the 40000000.000000 well and has also handed EKO the 2000000.000000 bonus and the 3600000.000000 reimbursement. Which dry-hole payoff does the engine give FIN?",
 "-21600000.000000",
 ["-16000000.000000, the well share alone",
  "-12000000.000000, FIN's own 30 percent of the dry hole",
  "-6792000.000000, the dry-hole payoff of EKO after the farm-out"],
 "FIN's dry-hole payoff in the engine's positions table is -21600000.000000: the bonus and the reimbursement are paid in both outcomes, at the valuation date, beside the well share. Counting the well share alone leaves them out. -6792000.000000 is EKO's dry-hole payoff after the farm-out.")

q(0, "How does the engine's basis scale the success-case value to each party's interest?",
 "every interest of the success-case value is the canonical applyJV of engines/economics/cashflow.ts on the 100% value (or on each year's net flow before the canonical npv), with no royalty, tax or cost",
 ["each party's value is its interest times the risked value at the stated chance, after royalty and tax at the Petroleum Industry Act's rates",
  "the farminee's value is its share paid times the success-case value, the promote being paid in value",
  "each interest's value is discounted again at the farminee's own rate"],
 "The engine's basis reads \"every interest of the success-case value is the canonical applyJV of engines/economics/cashflow.ts on the 100% value (or on each year's net flow before the canonical npv), with no royalty, tax or cost\". The fiscal system belongs to the Petroleum Industry Act course, and the engine applies no royalty or tax here. The share of value follows the interest held, and the promote is paid in cost.")

q(1, "A deal call on the Ekene Deep prospect states the success-case value as an NPV and also leaves the yearly cash flows in the box. How does the engine answer?",
 "A refusal naming project.successValue.cashFlows, which must be left out when npv is stated",
 ["A result from the NPV, the cash flows being kept for the report",
  "A result from the cash flows, discounted by the canonical npv, with the stated NPV set aside",
  "A refusal naming project.successValue, which must hold cash flows and never an NPV"],
 "The engine refuses the cash flows by name: its message begins \"project.successValue.cashFlows must be left out when npv is stated; got\" and prints the flows it was handed. The success-case value is an object { npv } or { cashFlows, discountRate, baseYear }, one or the other, and the engine chooses neither for the caller.")

q(2, "EKO drills Ekene Deep alone with its 70.000000 percent: the dry hole costs 40000000.000000. What is EKO's dry-hole payoff, and what does its success payoff subtract?",
 "-28000000.000000; the success payoff subtracts 70 percent of the 46000000.000000 success well",
 ["-40000000.000000; EKO bears the whole well as operator, and the success payoff subtracts it all",
  "-28000000.000000; the success payoff subtracts the dry-hole cost again as the risk charge",
  "-12000000.000000; its payment on the dry hole under the deal"],
 "The engine returns EKO alone at -28000000.000000 on a dry hole, its 70 percent of 40000000.000000, and at 157675235.929265 on a success: 70 percent of 271250337.041807 less 70 percent of the 46000000.000000 success well. PA pays its own share, and 12000000.000000 is what EKO pays on the dry hole after the farm-out, a payment and no payoff.")

# ---- break-even promote and chance ----

q(3, "With the Ekene carry capped at 3000000.000000 in place of the gross-cost cap (every other term unchanged), what break-even share paid does the engine solve for FIN?",
 "35.527169 percent, a ratio of 1.184239",
 ["35.594574 percent, as under the gross-cost cap, the carry cap binding only above the break-even",
  "37.500000 percent, the breakpoint where the dry hole's carry reaches the cap",
  "36.521739 percent, the first breakpoint above the earned interest"],
 "On deal-ekene-carry-cap the engine solves 35.527169 percent, a promote of 5.527169 points and a ratio of 1.184239: its reason reads \"break-even promote: FIN's EMV is 0 when it pays 35.527169% of the well for 30% (a promote of 5.527169 points)\". 36.521739 and 37.500000 are breakpoints, where each outcome's carry reaches the cap; the EMV is already below 0 at the first of them.")

q(1, "When even the farmor's whole share leaves the farminee in profit, no break-even promote exists. On deal-positive-at-farmor-share (50.000000 percent asked for 40.000000 from a sole farmor), which reason does the engine print?",
 "break-even promote: none up to the farmor's whole 100% share; paying it, N's EMV is 1280000, above 0",
 ["break-even promote: none; paying only its 40% share (no promote) N's EMV is 2240000, below 0",
  "break-even promote: N's EMV is 0 when it pays 100% of the well for 40% (a promote of 60 points)",
  "A refusal, since a farminee whose EMV never reaches 0 has no break-even the engine can report"],
 "The engine's reason is \"break-even promote: none up to the farmor's whole 100% share; paying it, N's EMV is 1280000, above 0\", with the status \"positive-at-farmor-share\". Its breakpoints are 40.000000: 2240000.000000 and 100.000000: 1280000.000000, both above 0. An absent break-even is a result with a reason.")

q(0, "On the stated case deal-carry-cap-kinks (N asked 50.000000 percent for 40.000000, a carry-amount cap on the carry), how many breakpoints does the engine roll the EMV back at, and where is the break-even?",
 "Three (40.000000, 52.500000, 100.000000); solved at 50.000000",
 ["Two (40.000000 and 100.000000); solved at 52.500000, where the line meets the cap",
  "Three; none solved, the EMV flat below 0 after the cap",
  "One, at 52.500000"],
 "The engine rolls the EMV back at 40.000000, 52.500000 and 100.000000: the earned interest, the share where the carry reaches its cap, and the farmor's whole share. The EMV falls to -40000.000000 at 52.500000 and stays there; it crosses 0 on the first segment, at 50.000000, a promote of 10.000000 points.")

q(2, "On deal-promote-exactly-break-even nothing moves to the sole farmor, because the farminee's EMV at the 50.000000 percent asked (for 40.000000; chance 25.000000 percent) is nil. Which farmor actions tie, and at what chances does the farmor break even?",
 "A tie between drill alone and farm out; break-even chances of 20.000000 alone and 16.666667 after",
 ["\"farm out\" alone, since the farmor gains whatever the farminee gives up",
  "\"drill alone\" alone, the farminee's EMV of 0 adding nothing to the farm-out",
  "A tie between farm out and walk away, and no break-even chance for either"],
 "With the farminee at 0 the farmor's EMV after the farm-out equals its EMV alone, and the engine lists both actions, as its EMV basis promises to report ties. The farmor's break-even chances are 20.000000 alone and 16.666667 after the farm-out, lower once it is carried.")

q(3, "Take the owner of the Penn State problem (deal-psu-eme801) drilling alone: 750000.000000 of value on a producer against a 250000.000000 well, whoever else is involved. Below what chance of success does its EMV turn negative?",
 "33.333333 percent",
 ["35.000000 percent, the producer chance the problem states",
  "35.714286 percent, the chance the incoming party needs",
  "None, the owner's position being \"never-negative\""],
 "Alone, the owner risks the whole 250000.000000 well for 750000.000000 of value, so its EMV crosses 0 at 33.333333 percent, the well over the value. The incoming party needs 35.714286 percent. Once farmed out, the owner's dry hole costs it nothing, and that position has no break-even chance at all.")

q(1, "On the stated case deal-break-even-at-farmor-share (N paying 100.000000 percent for 40.000000 at a chance of 50.000000), which position has no break-even chance of success?",
 "F after the farm-out, whose dry hole is no loss",
 ["N, the farminee, whose EMV is 0 at the stated chance of 50.000000 percent and so has no crossing to report",
  "F alone, since it keeps no interest of the well it would drill after the deal",
  "Every position, the promote taking it all"],
 "The engine's reason reads \"F after the farm-out: EMV is at or above 0 at every chance of success (the dry hole is not a loss)\": carried for the whole well, F pays nothing on a dry hole. F alone breaks even at 20.000000 percent and N at 50.000000 percent, the stated chance at which its EMV is exactly 0.")

q(0, "The Ekene Deep deal restated with \"farmor-side\" refuses any stated share below 31.363636. What break-even share does the engine solve on it?",
 "35.960428 percent, above that smallest share",
 ["31.363636 percent, where FIN's EMV is 0",
  "30.000000 percent, the first breakpoint",
  "35.594574 percent, the post-deal figure"],
 "On deal-ekene-farmor-side the engine solves 35.960428 percent, above the smallest share the stated-deal check accepts. The breakpoint table still lists 30.000000, a point on the EMV line; a deal stated there is refused. 35.594574 is the break-even under \"post-deal-interests\", and the smallest share is set by the carry reaching 0.")

# ---- the consent fee ----

q(3, "Which limb of reg. 19(3) of the 2024 Regulations matches the engine's value source \"contract-amount\", as on the Ekene fee (5600000.000000; PPL; notified 2027-05-03, paid 2027-07-30)?",
 "Limb (a): what is payable to the assignor as the application or transaction contract states it",
 ["Limb (b): an amount the Commission prescribes from its metrics for good and valuable consideration",
  "Reg. 24: the amount the Commission determines to be the value receivable by the Assignor for an Assignment",
  "Reg. 19(2): seven per cent of the value"],
 "Reg. 19(3) gives the value two limbs: (a) the amount \"payable to the Assignor, as stated in the application or transaction contract\" and (b) an amount \"prescribed by the Commission, using the metrics for the determination of good and valuable consideration for the asset at the relevant time\". The engine's \"contract-amount\" is the first and \"commission-determined\" the second. Reg. 24 defines the value a second time; reg. 19(2) sets the rate.")

q(1, "Two provisions of the 2024 Regulations each say what the value of the transaction is. Faced with that, how does the engine treat the 5600000.000000 on the Ekene PPL fee (notified 2027-05-03, paid 2027-07-30)?",
 "It takes the value and its stated source as inputs and charges the gazetted rates on them",
 ["It applies reg. 24, the later definition, and sets the value from its own metrics",
  "It averages the two definitions",
  "It refuses the value until the Commission confirms it"],
 "The engine's basis says the value \"is a stated input\" with its source, and \"the engine does not decide which consideration of a farm-out counts\". Reg. 24 defines it as \"the amount determined by the Commission to be the value receivable by the Assignor\"; the engine takes no side between the definitions and holds no metrics of its own. It charges 392000.000000 on the stated 5600000.000000.")

q(2, "A learner pricing a PEL on the caller's own rates (basis \"stated\", a value of 1 as \"contract-amount\") also writes intraGroup false into the box. What is printed?",
 "intraGroup must be left out under basis \"stated\" (the stated rates apply); got false",
 ["A result with the premium waived, the transfer being outside any group and so paying full rates",
  "A result with intraGroup read and ignored, since a false flag changes nothing on a stated basis",
  "intraGroup must be true or false (stated; no default); got nothing"],
 "The intra group proviso belongs to the gazetted fee of reg. 19(2). Under a stated basis the caller's own rates apply and the flag means nothing, so the engine refuses it: \"intraGroup must be left out under basis \"stated\" (the stated rates apply); got false\". Under the gazetted basis the same flag is required.")

q(0, "Someone clears the fee basis control on the Ekene PPL call and leaves every other term in place (5600000.000000, contract amount, intraGroup false, the 2027-05-03 notice and 2027-07-30 payment). What does the engine answer?",
 "basis must be one of \"nuprc-2024-r19\", \"stated\"; got nothing",
 ["A result at the gazetted rates, the basis the Regulations set for every PPL",
  "A result at the stated rates, with none stated",
  "licence must be \"PPL\" or \"PML\" under basis \"nuprc-2024-r19\"; got nothing"],
 "The engine's message for the basis removed is \"basis must be one of \"nuprc-2024-r19\", \"stated\"; got nothing\". The fee basis is a term with no default, even for a PPL: the engine applies the gazetted rates only when the call asks for them.")

q(3, "A learner forgets the amount: the PPL fee call keeps its \"contract-amount\" source, intraGroup false and the Ekene dates (2027-05-03, 2027-07-30), but carries no value of the transaction. Which reply is printed?",
 "A refusal naming transactionValue, a required input",
 ["A result of 392000.000000, the fee on the value the fixture states for this licence",
  "A result on the 10000000.000000 consideration",
  "A refusal naming valueSource, which cannot stand without an amount"],
 "The engine's words: \"transactionValue must be a finite number at or above 0; got nothing\". The value of the transaction is a required input with its source: the engine takes no figure from the fixture or from the deal's consideration, and the source it still has is accepted as stated.")

q(2, "Under PIA s.95(14), when is a change in the holder's voting power a change of control, and so an assignment needing consent, for a deal like the Ekene farm-out (value 5600000.000000; PPL; 2027-05-03 and 2027-07-30)?",
 "When persons acting together acquire voting power that exceeds 50%",
 ["When any single shareholder acquires 50% or more, the half counted in",
  "When the holder's board changes",
  "When the voting power moves by more than 10 points in one year, whoever acquires it"],
 "PIA s.95(14) defines a change of control as persons acting jointly or in concert acquiring beneficial ownership of voting power \"that exceeds 50% at any time\", and s.95(3) deems a change of control an assignment. The engine's constant for it is 50, a voting power above which the change is an assignment; exactly 50 percent is no change of control.")

q(1, "Within how many working days must the Commission answer a holder's notification of intention to assign, before the application is deemed approved (AOI Regulations 2024 reg. 4(7))?",
 "15 working days",
 ["60 working days, the time the Minister has after the Commission's recommendation under PIA s.95(7)(b)",
  "90 days, the time the assignor has to pay the consent fee after notification under reg. 19(7)",
  "30 days, the further days of reg. 19(8)"],
 "Reg. 4(7) gives the Commission 15 working days from receipt of the notification of intention to approve or disapprove, \"failing which the application is deemed approved\". 60 working days is the Minister's window after the Commission's recommendation (PIA s.95(7)(b)) and also the Commission's for a PEL (reg. 18(3)). The 90 and 30 days belong to paying the fee. The engine computes no consent; it reports who gives it.")

# ---- paying the fee on time ----

q(0, "Which provision of the 2024 Regulations gives an assignor that has not paid within the 90 days a further 30 days, as applied to the Ekene fee of 392000.000000 on 5600000.000000 (PPL, notified 2027-05-03)?",
 "Reg. 19(8)",
 ["Reg. 19(7), which sets both periods in one sentence",
  "Reg. 19(9), which opens with the 30 days of grace",
  "PIA s.95(12), which prescribes the fee"],
 "Reg. 19(8) reads \"the Assignor shall have an additional 30 days within which to pay or complete payment.\" Reg. 19(7) sets the 90 days, reg. 19(9) the surcharge of 0.01 percent a day for 90 days, and PIA s.95(12) the fee as a percentage of the value of the transaction. The engine's constants cite each.")

q(3, "On a PPL fee of 392000.000000 (5600000.000000, \"contract-amount\", intraGroup false) notified 2027-01-01, what is the most surcharge the engine ever charges before the consent is deemed withdrawn?",
 "3528.000000, on the ninetieth surcharge day",
 ["Ninety-one days' worth, charged on day 211",
  "39.200000, one day being the most",
  "No cap: it runs until the fee is paid"],
 "The engine charges up to 90 surcharge days at 39.200000 a day, 3528.000000 on day 210 (paid 2027-07-30), and on day 211 returns \"consent-deemed-withdrawn\" with no total paid. Charging the ninetieth day and withdrawing from the ninety-first is the engine's stated reading of reg. 19(9).")

q(2, "Which payment statuses can the engine return on a gazetted PPL fee call such as the Ekene one (5600000.000000; notified 2027-05-03, paid 2027-07-30)?",
 "on-time, within-grace, surcharge and consent-deemed-withdrawn",
 ["on-time, late and refused, a payment outside the 90 days being refused with a message",
  "on-time and surcharge only, the grace days counting as surcharge days at a rate of zero",
  "paid and unpaid, the day rules left to the reasons"],
 "The day table prints four statuses: \"on-time\" to day 90, \"within-grace\" on days 91 to 120, \"surcharge\" on days 121 to 210 and \"consent-deemed-withdrawn\" from day 211. Every one is a result with a reason; a late payment is never refused, because the dates are valid inputs.")

q(1, "Who pays the consent fee on the Ekene assignment (a PPL, 5600000.000000, notified 2027-05-03, paid 2027-07-30), in the engine's result and in reg. 19(7)?",
 "The assignor, EKO: the engine reports the fee as paid by the Assignor",
 ["The assignee, FIN, as the party acquiring the interest",
  "Both sides equally, since the Regulations name no payer for the fee",
  "The operator of the licence, whoever that is at the time of the consent"],
 "Reg. 19(7) reads \"Every Assignor shall be required to pay an applicable fee to an account provided by the Commission within 90 days of notification of the grant of the relevant consent\", and the engine's reason ends \"paid by the Assignor and not tax deductible\". The fee therefore sits in the farmor's position of the deal call, as its assignor fees.")

q(3, "An auditor asks what the engine's 88 days for the Ekene fee rests on, given that reg. 19(7) says only \"within 90 days of notification\" (PPL, 5600000.000000; 2027-05-03 to 2027-07-30). What is the answer?",
 "The engine's stated reading: days from the notification to the payment, the notification day left out",
 ["The rule reg. 19(7) prints word for word, which fixes the count of every assignment the same way for everyone",
  "The Commission's working days, weekends and public holidays in Nigeria being left out of the count",
  "A calendar-month count, three months being ninety days"],
 "The engine's basis begins \"days from the notification of the consent to the payment\", and the course teaches the count as the engine's stated reading of reg. 19(7). Counting the notification day would give one day more; only a payment on a day boundary could change status, and no graded figure rests on it.")

q(0, "In its own words, what does reg. 19(9) of the 2024 Regulations impose once the further 30 days have passed on a fee such as the Ekene 392000.000000 (5600000.000000, notified 2027-05-03)?",
 "a surcharge of 0.01% of the stipulated amount per day on a straight-line basis for 90 days failing which the consent is deemed withdrawn",
 ["a surcharge of 0.01% of the value of the transaction per day, compounding, until the fee is paid in full",
  "a surcharge of 0.01% of the stipulated amount for each month of delay, with the consent kept in force",
  "an immediate withdrawal of the consent"],
 "Reg. 19(9) \"shall impose a surcharge of 0.01% of the stipulated amount per day on a straight-line basis for 90 days failing which the consent is deemed withdrawn.\" The engine reads the stipulated amount as the fee, so one day costs 39.200000 on the Ekene fee. No surcharge compounds or runs by the month, and withdrawal comes only after the 90 surcharge days.")

emit(Q, '/root/cat-wip-farmout/banks/ec10i_exam.json', expect_n=42)
finish()
