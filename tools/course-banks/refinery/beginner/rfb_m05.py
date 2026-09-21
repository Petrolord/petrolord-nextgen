import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Associate m05, Crude Supply and Licensing. Written from digest.txt
# SECTIONS 6 and 7, which are the four lessons of this module: three supply
# scenarios, the premium and the run rate, the licensing sequence, and licences
# out of order.

q(1, "Which utilisation and crude premium does the tight supply scenario carry?",
 "Utilisation 0.7500 and a premium of 3.0000 a barrel",
 ["Utilisation 0.5000 and a premium of 6.0000 a barrel",
  "Utilisation 0.9200 and a premium of 0.0000",
  "Utilisation 0.7500 and a premium of 6.0000 a barrel"],
 "SUPPLY_SCENARIOS prints firm at 0.9200 and 0.0000, tight at 0.7500 and 3.0000, and disrupted at 0.5000 and 6.0000. Each scenario sets both inputs together.")

q(3, "Which scenario carries the note \"Cargoes are available but contested: the plant runs below nameplate and pays up for barrels.\"?",
 "Tight supply, at a utilisation of 0.7500",
 ["Disrupted supply, as its second sentence",
  "Firm supply, on a contract under strain",
  "None; it is a note from the licensing tracker"],
 "The tight note describes both of its changes at once: fewer barrels run, and more paid for each. Firm's note is about a term contract that is honoured, and disrupted's says interruptions are routine.")

q(0, "What probability does the engine attach to the disrupted scenario?",
 "None; the scenarios are named futures only",
 ["0.5000, the share of the years that are disrupted",
  "An equal weight with firm and tight, for averaging",
  "One set by the premium of 6.0000 a barrel"],
 "The scenarios carry no probability. A probability would invite a weighted answer describing a plant that never exists, part firm and part disrupted every year, so the screen keeps the three apart and a reader sees each whole.")

q(2, "Tight supply is picked for OKORDIA, whose own utilisation is 0.9200. Which inputs change?",
 "Utilisation to 0.7500 and the crude cost from 76.0000 to 79.0000",
 ["Utilisation to 0.7500, with the crude cost kept at 76.0000",
  "The crude cost to 79.0000, with utilisation kept at 0.9200",
  "The gross value from 83.7900 and the crude cost to 79.0000"],
 "A scenario's utilisation replaces the plant's, and its premium is added to the crude cost before the streams are built. Tight supply does both in one move. The gross value comes from the slate and is 83.7900 under every scenario.")

q(0, "What annual throughput does OKORDIA print under disrupted supply, and which input sets it?",
 "825000.00 bbl, set by a utilisation of 0.5000",
 ["1237500.00 bbl, set by a utilisation of 0.7500",
  "825000.00 bbl, set by the premium of 6.0000",
  "1518000.00 bbl, as supply moves only the price"],
 "Annual throughput is capacity times on-stream days times utilisation, and the premium is not in that formula. The throughput column reads 1518000.00, 1237500.00 and 825000.00 bbl as utilisation reads 0.9200, 0.7500 and 0.5000.")

q(2, "In OKORDIA's scenario table, which column is set by the premium alone, whatever the utilisation?",
 "The gross margin, in dollars a barrel",
 ["The annual throughput in barrels",
  "The first operating year revenue",
  "The first year's crude cost in dollars"],
 "The margin is gross value less crude cost less variable operating cost, and the premium goes into the crude cost; utilisation is not in it. So the margin reads 4.5900, 1.5900 and -1.4100 as the crude cost reads 76.0000, 79.0000 and 82.0000. Both annual money columns move with the barrels too.")

q(3, "A reader models tight supply by cutting the run to 1237500.00 bbl and keeping the firm margin of 4.5900. What have they got wrong?",
 "The margin, which the tight row prints as 1.5900",
 ["The run, which the tight row prints as 825000.00 bbl",
  "Nothing, since the premium moves the revenue alone",
  "The gross value, printed as 79.0000"],
 "The scenario is one choice that sets two inputs. The run of 1237500.00 bbl is right, and the margin is not: the premium raises the crude cost to 79.0000 and the engine prints 1.5900. 825000.00 bbl is the disrupted run.")

q(1, "Hydroskimming under disrupted supply prints a gross margin per barrel of -1.4100. What does that sign say about running more barrels?",
 "Each barrel run loses money before any fixed cost is paid.",
 ["More barrels would spread the fixed cost and cure the loss.",
  "The plant breaks even once it runs past 825000.00 bbl a year.",
  "The loss sits in the fixed cost, so the barrels themselves pay."],
 "A negative margin per barrel is a different kind of answer from a small one. Each barrel costs more to buy and process than its products sell for, so running more would lose more. The disrupted note says this is where most of these projects are actually decided.")

q(1, "Which first operating year revenue and crude cost does OKORDIA print under disrupted supply?",
 "69126750.00 and 67650000.00",
 ["103690125.00 and 97762500.00",
  "69126750.00 and 115368000.00",
  "127193220.00 and 115368000.00"],
 "The disrupted row reads revenue 69126750.00 and crude cost 67650000.00. 103690125.00 and 97762500.00 are the tight row, and 127193220.00 and 115368000.00 the firm row. Both money columns move with the scenario.")

q(0, "What is the second stage in LICENSING_STAGES, and what is its id?",
 "Licence to Construct, id ltc",
 ["Licence to Operate, with id lto",
  "Licence to Establish, id lte",
  "Licence to Construct, id lto"],
 "The stages run 1 lte Licence to Establish, 2 ltc Licence to Construct and 3 lto Licence to Operate, in that order.")

q(3, "In which stage's typical evidence does the feasibility study sit?",
 "Licence to Establish, beside site title and evidence of funding",
 ["Licence to Construct, beside the detailed engineering design",
  "Licence to Operate, beside the pre-startup safety review",
  "In none of the three; the tracker leaves the study out"],
 "The first stage asks whether the project is real: a feasibility study, site title or lease, evidence of funding and environmental impact assessment scoping. This tier's screen is the kind of study that goes into that application.")

q(2, "A team has ticked all three stages in the tracker. What has that shown?",
 "What the team has ticked, as the regulator's current requirements govern",
 ["That the regulator has approved each of the three licences",
  "That each stage's typical evidence has been filed in full",
  "That the project may begin its producing years at once"],
 "The tracker is a process aid. It records which stages are complete and names the next, and it does not know the regulator's forms, fees or timelines. Whether the regulator agrees is answered by the regulator.")

q(0, "A project has ticked ltc alone. What does the tracker return?",
 "Count 1, next Licence to Establish, out of order true",
 ["Count 1, next Licence to Operate, out of order false",
  "Count 1, next Licence to Construct, out of order false",
  "Count 0, next Licence to Establish, out of order true"],
 "The next stage is the first stage in sequence that is not complete, and lte is still open, so the tracker sends the project back to it and flags the tick as out of order. lte alone gives count 1, next Licence to Construct, out of order false.")

q(3, "Which column of the tracker's return reads the same for lte ticked alone and for ltc ticked alone?",
 "The complete count",
 ["The next stage named",
  "The out of order flag",
  "None; all three differ"],
 "Both rows carry a complete count of 1. The next stage reads Licence to Construct against Licence to Establish, and out of order reads false against true, which is why a count reported alone misleads.")

q(1, "All three stages, lte, ltc and lto, are ticked. What does the tracker name as the next stage?",
 "null, with nothing left to name",
 ["lto, the last stage ticked",
  "Licence to Establish, as the cycle begins again",
  "Licence to Operate, flagged out of order true"],
 "With all three complete the count is 3, the next stage is null and out of order reads false. There is no stage left, and the tracker says so with no stage at all.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/beginner/rfb_m05.json', label='rfb_m05', expect_n=15)
finish()
