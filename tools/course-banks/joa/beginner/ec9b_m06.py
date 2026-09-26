import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Associate m06, Overhead Basics.
# Sources: the overhead rule and the base rule in the engine's basis, the Ekene
# 2031 overhead by band and by category with its reasons, the overhead golden
# cases (the Norwegian scale stated in NOK million), the band edge, the
# Norwegian Art. 2.2.2 and 2.2.3 provisions, what the engine does not compute,
# and the overhead refusals. Every key rests on a digest-printed line or an
# engine return re-run in /root/cat-wip-joa/scratch/bank-beginner/witness.mjs.

q(1, "Before any band is applied, how large is the Ekene 2031 operating category's base?",
 "58000000.000000: cost of 60000000.000000 less 2000000.000000 excluded.",
 ["60000000.000000, since an exclusion reduces the charge after the scale has been applied.",
  "50000000.000000, the part of the base that sits in the first band.",
  "58000000.000000 plus the overhead charged on it."],
 "The engine's basis reads: base = annual cost - stated exclusions. The operating cost is 60000000.000000 and 2000000.000000 is excluded, so the base is 58000000.000000, and the engine's reason prints base 58000000 (cost 60000000 less exclusions 2000000). The exclusion comes out before the scale, 50000000.000000 is only the part inside band 1, and overhead charged under the scale is never part of its own base.")

q(3, "What operating overhead does the engine charge on the Ekene 2031 base of 58000000.000000?",
 "1455000.000000: 2.75% of 50000000 plus 1% of 8000000.",
 ["1375000.000000, the charge of the first band alone.",
  "1343750.000000, the flat corporate charge.",
  "80000.000000, 1% of the part above 50000000."],
 "The scale is marginal: each band's per cent on the part of the base inside the band. The engine's reason reads: operating: base 58000000 (cost 60000000 less exclusions 2000000); 2.75% of 50000000 + 1% of 8000000 = 1455000. 1375000.000000 and 80000.000000 are the two band charges taken one at a time, and 1343750.000000 is the flat 0.625000 percent charge on all three categories together.")

q(0, "The Ekene 2031 development base of 150000000.000000 runs through three bands. What is the development charge?",
 "2000000.000000, band by band.",
 ["1250000.000000, the first band's charge.",
  "3580000.000000, the charge over all three categories.",
  "500000.000000, the second band's charge alone."],
 "The engine's reason reads: development: base 150000000; 2.5% of 50000000 + 1% of 50000000 + 0.5% of 50000000 = 2000000. 1250000.000000 and 500000.000000 are the first and second bands' own charges, and 3580000.000000 is the total over the exploration, operating and development categories.")

q(2, "What total overhead does the engine return for Ekene 2031 under the category scales?",
 "3580000.000000.",
 ["1343750.000000, the flat corporate charge, which takes the place of the category scales.",
  "2000000.000000, the development charge, the largest of the three categories.",
  "1455000.000000."],
 "The three category charges are exploration 125000.000000, operating 1455000.000000 and development 2000000.000000, and the engine returns a total overhead of 3580000.000000. The flat corporate charge of 1343750.000000 is a separate golden case, and 2000000.000000 and 1455000.000000 are single categories.")

q(3, "The Ekene corporate charge is a flat 0.625000 percent. How does the engine state a flat percentage?",
 "As a scale with no bands, the whole base charged at abovePct.",
 ["As one band whose upTo is set equal to the base, at its pct.",
  "Under the key flat, which the scale accepts for a single rate.",
  "As an exclusion equal to the base less the charge."],
 "The engine's basis reads: a flat percentage is a scale with no bands. With no bands, the whole base is charged at abovePct, as on overhead-ekene-2031-corporate: exploration, operating and development: base 215000000; 0.625% of 215000000 = 1343750. A scale reads only bands and abovePct, so a key named flat is refused, and a band would need its upTo restated for every base.")

q(1, "The Norwegian accounting agreement, Art. 2.2.3, prints 0.65 % of the annual costs for exploration, operation and development. On a base of 3400 NOK million, what does the engine charge?",
 "22.100000.",
 ["65.450000, the Art. 2.2.2 scale over the three categories.",
  "35.000000, the Art. 2.2.2 operating scale on 1800.",
  "42.500000, the Art. 2.2.2 development scale on 4000."],
 "On overhead-norway-corporate-065 the engine's reason reads: exploration, operation and development: base 3400; 0.65% of 3400 = 22.1, a total of 22.100000. The other three figures are cases of the Art. 2.2.2 research and development scale: 65.450000 over three categories with an exclusion, 35.000000 on an operating base of 1800 and 42.500000 on a development base of 4000.")

q(0, "overhead-band-edge-exact states an operating base of 1000 on a scale whose first band ends at 1000, at 2.7%. Where is the base charged?",
 "All 1000.000000 in the first band and 0.000000 in the second: 27.000000.",
 ["In the second band, since a base at the limit has passed into the next band.",
  "Split at the edge, the last unit in the second band.",
  "At the second band's rate on the whole base."],
 "A base exactly at a band's upper limit is charged in that band only: overhead-band-edge-exact charges 1000.000000 in the first band and 0.000000 in the second, a total of 27.000000, and the reason reads: operating: base 1000; 2.7% of 1000 = 27. Nothing crosses the edge, and the scale is marginal, so no rate applies to the whole base.")

q(2, "A worked case states the Norwegian development scale in NOK million on a base of 4000, with 0 stated above the last band. What does the engine charge?",
 "42.500000, with nothing charged on the 500 above 3500.",
 ["40.000000: the printed scale stops at 3000.",
  "100.000000, 2.5 per cent of the whole base of 4000.",
  "35.000000, as for the operating scale on 1800."],
 "The engine's reason reads: development: base 4000; 2.5% of 1000 + 1% of 1000 + 0.5% of 1500 + 0% of 500 above 3500 = 42.5. The bands run to 3500, where 40.000000 is the charge on a base of 3000, the first band's 2.5 per cent covers only its first 1000, and 35.000000 belongs to the operating scale.")

q(1, "A Norwegian worked case excludes 150 of area fees and CO2 duty from an operating cost of 1000 NOK million. What is the operating charge?",
 "22.95 on a base of 850, at 2.7%.",
 ["27.000000, 2.7% of the whole cost of 1000.",
  "22.100000, 0.65% of the annual costs.",
  "65.450000, the charge over all three categories of that case."],
 "On overhead-norway-all-with-exclusion the reason reads: operating: base 850 (cost 1000 less exclusions 150); 2.7% of 850 = 22.95. The exclusion comes out of the base before the scale, so 27.000000 on the whole 1000 is wrong. 22.100000 is the flat 0.65% corporate case, and 65.450000 is that case's total over three categories.")

q(3, "Can overhead charged under a scale enter the base it is charged on?",
 "No: the engine's basis and Norway Art. 2.2.2 both keep it out.",
 ["Yes: each year's charge is added to the next year's base.",
  "Yes, under a marginal scale, as each band's charge feeds the next band.",
  "Only under a flat percentage, where the base and charge are one."],
 "The engine's basis reads: overhead charged under the scale is never part of its own base. The Norwegian accounting agreement says the same: \"Cost charged to the Joint Account in accordance with this Article is not to be included in the basis of calculation.\" (Norway Accounting Agreement Art. 2.2.2). Neither a marginal scale nor a flat percentage makes an exception.")

q(0, "The Norwegian accounting agreement moves its band limits each year with the consumer price index. What does the engine do with a scale?",
 "No index adjustment: it applies the limits the call states.",
 ["Each limit is moved by the index per 15 July.",
  "It adjusts them once a base year is stated.",
  "It refuses a scale that comes with no index series."],
 "The Norwegian Art. 2.2.2 moves its intervals each year by the consumer price index as published by Statistics Norway per 15 July of the current year. The engine computes no index adjustment of a scale: it applies the band limits each call states, so a later year's scale is stated with that year's limits. It reads no index and refuses nothing for want of one.")

q(2, "The operating scale is deleted from the Ekene 2031 overhead box. What does the engine do?",
 "It refuses, naming scale.operating: there is no default rate.",
 ["It charges operating at the exploration scale, the nearest category it holds.",
  "Operating is charged at 0, since no scale was stated.",
  "It charges operating at the Norwegian 0.65 %."],
 "The engine refuses, in its own words: scale.operating must be an object { bands, abovePct } (no default rate); got nothing. It borrows no scale from another category or from the Norwegian text, and it charges nothing at all on an unstated term.")

q(3, "A scale's second band is given the same upTo as the first, 100. How does the engine answer?",
 "With a refusal: each band's upTo must be above the one before.",
 ["By merging the two bands and charging the merged band at the higher of their two per cents.",
  "By treating the second band as empty and charging the base above it at abovePct.",
  "The bands are sorted."],
 "The engine refuses, in its own words: scale.operating.bands[1].upTo must be above the previous band's upTo 100; got 100. It merges, empties and sorts nothing: a scale is charged exactly as it is stated or not at all.")

q(0, "An exclusion of 11 is stated on an operating cost of 10. What happens?",
 "The engine refuses: an exclusion may not exceed its category's cost.",
 ["The base is clipped at 0, and nothing is charged for operating.",
  "A negative base of -1 gives a small credit to the parties.",
  "The spare 1 is taken from the next category's base."],
 "The engine refuses, in its own words: excluded.operating must be at or below the cost of the category 10; got 11. A base cannot fall below zero by an exclusion, and an exclusion belongs to the category it names.")

q(1, "A scale lists its bands and leaves out abovePct. What happens?",
 "It is refused: abovePct is required even when it is zero.",
 ["The part above the last band is charged at the last band's per cent.",
  "The part above the last band is left uncharged, as the Norwegian text prints nothing there.",
  "Everything above is charged at the 0.65 % of Art. 2.2.3."],
 "The engine refuses, in its own words: scale.operating.abovePct must be a number from 0 to 100; got nothing. The Norwegian scale prints nothing above its last band, so the worked cases state 0 there; the engine extends no band's per cent and borrows no rate from Art. 2.2.3.")

emit(Q, '/root/cat-wip-joa/banks/ec9b_m06.json', expect_n=15)
finish()
