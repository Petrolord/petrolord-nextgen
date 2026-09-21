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

q(0, "Which row of the nine-row table prints a first operating year revenue of 63475500.00?",
 "Topping under disrupted supply",
 ["Topping under tight supply",
  "Hydroskimming under disrupted supply",
  "Conversion under disrupted supply"],
 "Topping under disrupted supply prints 63475500.00. Topping under tight supply prints 95213250.00, hydroskimming under disrupted supply 69126750.00 and conversion under disrupted supply 74769750.00.")

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

q(3, "Under firm supply, which configuration earns the most per barrel of crude, and at what gross margin?",
 "Conversion, at 11.4300",
 ["Hydroskimming, at 4.5900",
  "Conversion, at 8.4300",
  "Topping, at -2.2600"],
 "The three firm rows read topping -2.2600, hydroskimming 4.5900 and conversion 11.4300. 8.4300 is conversion under tight supply.")

q(1, "Hydroskimming under tight supply prints a gross margin per barrel of 1.5900. What first operating year revenue does the same row print?",
 "103690125.00",
 ["127193220.00",
  "69126750.00",
  "112154625.00"],
 "Read the hydroskimming tight row: gross margin 1.5900 beside 103690125.00. The firm and disrupted hydroskimming rows carry 127193220.00 and 69126750.00, and 112154625.00 sits on the conversion tight row.")

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

q(3, "In the OKORDIA chain the capital step returns 64000000.00 and 12800.00 per bpd. What does it use?",
 "The 64000000.00 quotation for 5000 bpd and the modular law",
 ["The hydroskimming yields and OKORDIA's prices",
  "5000 bpd, 330 on-stream days and a utilisation of 0.9200",
  "The 2 construction years and the 20 operating years"],
 "The screen prints capital (modular law at the reference point): 64000000.00; capital per bpd 12800.00, from the vendor quotation of 64000000.00 for a 5000 bpd plant. The yields and prices give the slate, the capacity, days and utilisation give the throughput, and the construction and operating years lay out the streams.")

q(1, "In the chain's streams step, what does each producing year from year 2 carry?",
 "Crude run 1518000.00 bbl, revenue 127193220.00, crude cost 115368000.00",
 ["Crude run 1518000.00 bbl, revenue 127193220.00, capex 32000000.00",
  "Crude run 1650000.00 bbl, revenue 127193220.00, crude cost 115368000.00",
  "Crude run 1518000.00 bbl, revenue 116794920.00, crude cost 115368000.00"],
 "From year 2 the plant produces a crude run of 1518000.00 bbl, revenue of 127193220.00, crude cost of 115368000.00, fixed opex of 7500000.00 and variable opex of 4857600.00. Capex of 32000000.00 sits in the two construction years, 1650000.00 bbl is nameplate on every on-stream day, and 116794920.00 is topping's revenue.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/beginner/rfb_m06.json', label='rfb_m06', expect_n=15)
finish()
