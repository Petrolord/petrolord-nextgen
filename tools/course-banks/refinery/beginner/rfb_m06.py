import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Associate m06, The Associate Reading. Written from digest.txt
# SECTION 8, read with SECTIONS 3 to 7 as one screen, which is the three
# lessons of this module: the OKORDIA screen end to end, OKORDIA under three
# supplies, and what the next tier changes.

q(3, "In the nine-row table, which configuration keeps a positive gross margin per barrel under disrupted supply?",
 "Conversion alone, at 5.4300",
 ["Hydroskimming alone, at 1.5900",
  "Conversion and hydroskimming, both above zero",
  "None; every configuration is negative under disruption"],
 "Under disrupted supply topping reads -8.2600, hydroskimming -1.4100 and conversion 5.4300. 1.5900 is hydroskimming under tight supply.")

q(1, "Read down the three hydroskimming rows of the nine-row table. Which figure stays the same from firm to disrupted?",
 "The gross value per barrel, 83.7900",
 ["The annual throughput, 1518000.00 bbl",
  "The gross margin per barrel, 4.5900",
  "The first year revenue, 127193220.00"],
 "The slate does not depend on supply, so the gross value holds at 83.7900 on all three rows. The throughput moves with the scenario's utilisation and the margin with its premium.")

q(0, "Hold the scenario at tight and compare topping, hydroskimming and conversion. What is common to all three rows?",
 "A throughput of 1237500.00 bbl",
 ["A gross value per barrel of 76.9400",
  "A gross margin per barrel of 1.5900",
  "A first year revenue of 103690125.00"],
 "The configuration does not change how many barrels are run, so every tight row runs 1237500.00 bbl. What moves across configurations is the gross value, and with it the margin and the revenue.")

q(2, "Topping under firm supply shows a first operating year revenue of 116794920.00. What does its row say about the plant?",
 "It loses money on every barrel, at a margin of -2.2600.",
 ["It earns 4.5900 on every barrel before the fixed cost.",
  "Its large revenue carries it past its fixed operating cost.",
  "It loses money only when supply turns tight or disrupted."],
 "Revenue counts what the products sell for. A revenue of any size on a negative margin is a loss on every barrel run, with the fixed operating cost and the capital still to pay. 4.5900 is hydroskimming under firm supply.")

q(2, "Which configuration's margin changes sign with the supply scenario?",
 "Hydroskimming: positive on firm and tight, negative on disrupted",
 ["Topping: negative on firm, positive on both tight and disrupted supply",
  "Conversion: positive on firm, negative on tight and disrupted",
  "All three: each positive on firm and negative on disrupted"],
 "Hydroskimming reads 4.5900, 1.5900 and -1.4100. Topping is negative on all three scenarios and conversion positive on all three, so hydroskimming is the one whose reading depends on supply.")

q(0, "The nine-row table holds the capital at 64000000.00 for every configuration. What does that make the table?",
 "A reading of margins, with each plant's capital a separate step",
 ["A valuation of each plant, since the capital is held equal",
  "A finding that a conversion plant costs what a topping plant does",
  "A reading taken on the stick-built law in place of the modular"],
 "Holding one capital figure across configurations lets the rows be compared on their margins. A conversion plant with its fluid catalytic cracker would carry its own quotation, and the capital question is answered with its own reference point.")

q(3, "In the OKORDIA chain, which step takes 5000 bpd, 330 on-stream days and a utilisation of 0.9200?",
 "Throughput, returning 1518000.00 bbl a year",
 ["Capital, returning 64000000.00 at 12800.00 per bpd",
  "Margin, returning 4.5900 a barrel of crude",
  "Streams, returning 22 years with revenue from year 2"],
 "Throughput is capacity times on-stream days times utilisation. Capital takes the quotation and the law, the margin takes the gross value and two costs, and the streams take the construction and operating years.")

q(1, "Why does the choice of exponent not change OKORDIA's capital of 64000000.00?",
 "It is screened at the reference size, where both laws give the quotation.",
 ["The modular exponent is fixed in the engine and cannot be changed.",
  "Its capital is spread over 2 construction years, cancelling the exponent.",
  "The capital per bpd of 12800.00 is set before any exponent applies."],
 "OKORDIA is screened at 5000 bpd, the size of the quotation, so the capital is the quotation itself on either law. At any other size the exponent would matter, and the exponents are defaults that a vendor's figures replace.")

q(0, "The crude cost in OKORDIA's streams looks wrong. Where does the lesson send you to check?",
 "The crude price, the premium and the throughput",
 ["The slate and the throughput, as with revenue",
  "The quotation, the capacity and the exponent",
  "The fixed cost and the count of construction years"],
 "Every step feeds the next, so a surprising figure has its cause at one step. Revenue sends you to the slate and the throughput; capex to the quotation, the capacity, the exponent and the construction years.")

q(3, "What does the lesson say the nine-row table decides?",
 "Which configurations earn a valuation",
 ["Which configuration the sponsor should build",
  "Which of the three supplies is most likely",
  "Which capital law each plant is priced on"],
 "Topping does not earn a valuation at these prices, conversion does under every supply, and hydroskimming does only if the sponsor can show crude supply will not be disrupted. The scenarios carry no probability, and the capital is held at one figure.")

q(1, "Hydroskimming under tight supply reads a margin of 1.5900. What does the lesson say about a reading whose sign turns on a modest change in one input?",
 "Its inputs need defending before it is reported.",
 ["It is averaged with the firm row and then reported.",
  "It is rounded and reported as a break even plant.",
  "It is left out of the table as an unstable row."],
 "The panel exercise raises the crude cost a step at a time until the tight margin changes sign. A reading that turns on a modest change in one input needs its inputs defended before anyone reports it.")

q(2, "In the Professional tier, what does every barrel of crude the plant buys pass through?",
 "The crude unit, whose capacity and cost join the answer",
 ["The naphtha reformer, which takes crude as its feed",
  "The supply scenario, which then sets its utilisation",
  "The licensing tracker, before any unit may run it"],
 "In the plan every barrel of crude passes through the crude unit, and the crude unit's own capacity and cost become part of the answer. Yields become streams that other units take as feed.")

q(0, "Which course teaches how the plan finds each stream's marginal value?",
 "The crude course, which owns linear programming",
 ["The Professional tier of this course, in its own lessons",
  "The Economics courses, beside the valuation",
  "The supply course, with terminals and landed cost"],
 "The plan prices one more barrel of each stream arriving from outside. How it finds those values is linear programming, and the crude course teaches it; this course reads the plan's answers.")

q(3, "Moving from the screen to the monthly plan, what stays the same?",
 "The unit of the answer, a margin per barrel of crude",
 ["One fixed yield row for each configuration",
  "A single price table and a single utilisation for the year",
  "The five-line chain from quotation to streams"],
 "The plan's headline is still a margin per barrel of crude: product value, less crude, less the cost of running units. The fixed yield row, the one price table and the one utilisation are what the plan replaces.")

q(1, "In the chain's streams step, what does each producing year from year 2 carry?",
 "Crude run 1518000.00 bbl, revenue 127193220.00, crude cost 115368000.00",
 ["Crude run 1518000.00 bbl, revenue 127193220.00, capex 32000000.00",
  "Crude run 1650000.00 bbl, revenue 127193220.00, crude cost 115368000.00",
  "Crude run 1518000.00 bbl, revenue 116794920.00, crude cost 115368000.00"],
 "From year 2 the plant produces a crude run of 1518000.00 bbl, revenue of 127193220.00, crude cost of 115368000.00, fixed opex of 7500000.00 and variable opex of 4857600.00. Capex of 32000000.00 sits in the two construction years, 1650000.00 bbl is nameplate on every on-stream day, and 116794920.00 is topping's revenue.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/beginner/rfb_m06.json', label='rfb_m06', expect_n=15)
finish()
