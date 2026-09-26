import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Associate m04, Royalty by Price.
# Sources: the royalty by price rule and its open base year; the benchmark
# table on both bases; the rates at stated prices in 2025 on each base; the
# Act's own example; each stream at its own price; frontier acreage; the texts
# behind the section; the refusal for an unknown base. Every question on a
# figure that the base year moves either states the base or sets the two
# readings side by side. Every keyed figure is re-run through
# priceRoyaltyBenchmarks, derivePriceRoyaltyRate and computeCashFlow in
# /root/cat-wip-pia/scratch/bank-beginner/witness.mjs.

q(2, "On the Regulations base, the engine default, what are the three royalty by price benchmarks in 2025?",
 "54.120000, 108.240000 and 162.360000 USD/bbl.",
 ["55.200000, 110.400000 and 165.610000 USD/bbl, the 2025 levels escalated from 2020.",
  "50.000000, 100.000000 and 150.000000 USD/bbl, fixed by the Act for every year.",
  "54.12, 108.00 and 162.36, as printed."],
 "On the Regulations base, 50, 100 and 150 apply to 2021 and rise by 2 percent of the previous year's benchmark from 1 January 2022, giving 54.120000, 108.240000 and 162.360000 in 2025. The first distractor is the Act base, a different stated reading; the unescalated levels hold only up to the base year; and the printed middle figure of 108.00 is the Schedule's misprint, which the engine does not follow.")

q(0, "At 75 USD/bbl in 2025 the royalty by price rate depends on the base year, an open reading. Which pair gives both readings as the engine returns them?",
 "0.019290 on the Regulations base, and 0.017935 on the Act base.",
 ["0.017935 on the Regulations base, and 0.019290 on the Act base.",
  "0.025000 on both bases, the figure of the Act's own example.",
  "0.019290 on both bases, as the readings agree between the benchmarks."],
 "The engine returns 0.019290 on the Regulations base and 0.017935 on the Act base, whose higher benchmarks put 75 lower on the scale. Swapping them reverses the bases; 0.025000 is the rate at 75 in 2020, before either base escalates; and between the benchmarks the two readings differ, agreeing only at or below both low benchmarks or at or above both high ones.")

q(3, "On the Regulations base in 2025, a price of exactly 108.240000 USD/bbl gives which royalty by price rate?",
 "0.050000, 5 percent at the middle benchmark.",
 ["0.048043, reading the same price against the Act's higher 2025 benchmarks on the other base.",
  "0.100000, since the price is above the Act's printed middle level of 100 USD per barrel.",
  "0.060865, the rate the engine returns for a 2025 price of 120 on this base."],
 "108.240000 is the Regulations' middle benchmark for 2025, where the rate is exactly 5 percent: 0.050000. The Act base returns 0.048043 at that price, a different stated reading; the escalated middle benchmark has replaced 100; and 0.060865 is the rate at 120 USD/bbl on the Regulations base.")

q(1, "Which description matches how the engine reads the royalty by price between its benchmarks?",
 "0 at or below the low benchmark, 5 percent at the middle, 10 percent at or above the high, linear between.",
 ["A step of 0, 5 or 10 percent, whichever band the price falls in, with no rise inside a band.",
  "A curve that doubles the rate for every 50 USD/bbl the price rises above the low benchmark.",
  "Straight from 0 at a price of zero to 10 percent at the high benchmark."],
 "The engine's rule is three points joined by straight lines: 0 at or below the low benchmark, 5 percent at the middle and 10 percent at or above the high. The NTA restatement names the method \"on linear interpolation\". A step jumps between bands and a line from a price of zero starts too low, so neither of them, nor a doubling curve, returns the Act's own example of 2.5% at 75 USD/bbl in 2020, which the engine reproduces as 0.025000.")

q(1, "The Act's own example puts the royalty by price at 2.5% for 75 USD/bbl in 2020. What does the engine return?",
 "0.025000 whichever of the two base years the run states.",
 ["0.025000 on the Act base only; the Regulations base returns 0.019290 for 2020.",
  "0.017935 on both bases, because the benchmarks already escalate from 2020.",
  "A refusal, as 2020 precedes the Regulations."],
 "The engine returns 0.025000 at 75 USD/bbl in 2020 on the Act base, and also 0.025000 on the Regulations base, which keeps the 2021 levels of 50, 100 and 150 for 2020. The rate 0.019290 is 75 in 2025 on the Regulations base, 0.017935 is 75 in 2025 on the Act base, and the engine refuses no year: before its base year each base keeps 50, 100 and 150.")

q(0, "How do the royalty by price benchmarks escalate?",
 "By 2% of the previous year's benchmark every 1 January, rounded to whole cents each year.",
 ["By 2% of the base-year level each year, on a straight line kept with no rounding at all.",
  "By the year's inflation rate, which each case states among its escalators.",
  "By 2 USD per barrel a year on each of the benchmarks."],
 "Both texts escalate by 2 percent relative to the previous year's values, and the Regulations' Schedule adds \"The results shall be rounded to entire US $ cents.\" The engine rounds year by year, so the table must be built one year at a time. A straight line on the base level ignores the compounding, the case escalators move prices and costs, and a flat 2 USD step is the pattern of the Schedule's misprinted middle row.")

q(3, "The Regulations' printed table gives the middle benchmark as 104.00 for 2023. What does the engine use for that year on the Regulations base?",
 "104.040000, applying the 2 percent rule.",
 ["104.00, since the gazetted table outranks the escalation rule that precedes it in the Schedule.",
  "106.120000, the Act base value for 2023, so that the two texts line up with each other.",
  "102.000000, carrying the 2022 value until the table and the rule agree with each other."],
 "The Schedule prints the middle column as 102.00, 104.00, 106.00, 108.00 and 110.00 for 2022 to 2026, which does not follow its own 2 percent rule. The engine applies the rule, giving 104.040000 for 2023, and names the conflict in a note on every ledger with a year of 2023 or later. The printed table does not outrank the rule in the engine, 106.120000 is the Act base in 2023, a different reading, and nothing is carried from 2022.")

q(2, "Read down the benchmark table on both bases. Which relationship does the course check for every year it prints?",
 "The Act base in any year equals the Regulations base one year later.",
 ["The Act base in any year equals the Regulations base one year earlier than it.",
  "They differ by 2 USD/bbl on every benchmark.",
  "The two bases agree from 2025 onward."],
 "The Act starts the levels in 2020 and escalates from 1 January 2021; the Regulations start them in 2021 and escalate from 1 January 2022. So the Act base runs one year ahead: its 2025 levels, 55.200000, 110.400000 and 165.610000, are the Regulations' 2026 levels. The gap is a year of escalation, which is a percentage, and it never closes.")

q(0, "Frontier acreage sells oil at 120 USD/bbl in 2026 (ekene_frontier). What royalty by price does the engine return?",
 "0.000000, since para 11(2) gives frontier acreages no royalty by price.",
 ["The full 10 percent, as 120 USD/bbl clears the high benchmark.",
  "0.060865, the 2025 rate at 120 on the Regulations base.",
  "7.5 percent, the frontier rate read against price."],
 "Seventh Schedule para 11(2) reads: \"(2) There shall be no royalty by price for frontier acreages.\" The engine returns 0.000000 on ekene_frontier, with a liquids royalty rate of 0.075000. 120 is below the 2026 high benchmark on either base anyway, 0.060865 is what another terrain pays in 2025 on the Regulations base, and 7.5 percent is frontier's production royalty rate on volume.")

q(2, "Crude sells at 95 and condensate at 88 USD/bbl in 2025, on the Regulations base. Which royalty by price rates does the engine charge?",
 "0.037768 on crude oil and 0.031301 on condensate.",
 ["0.037768 on both, since condensate counts as crude oil for royalty.",
  "0.036051 on crude and 0.029710 on condensate, the rates on the Act base.",
  "One rate at the volume-weighted price of the two streams together."],
 "The royalty by price is charged on crude oil and on condensate, each rated at its own price: on the Regulations base 0.037768 at 95 and 0.031301 at 88. Para 6 merges condensate with crude for the daily rate of the production royalty, and that merging stops at the volume. 0.036051 and 0.029710 are the Act base, a different stated reading than the one the question sets.")

q(3, "On that same 2025 case, how much royalty by price does the engine return on each base?",
 "Regulations reading 20694235.033259 USD; Act reading 19738586.956522 USD.",
 ["20694235.033259 USD on either base, since both readings agree for every price above 54.120000.",
  "19738586.956522 USD on the Regulations base, and 20694235.033259 USD on the Act base instead.",
  "69663505.866593 USD on the Regulations base alone."],
 "The engine returns 20694235.033259 USD on the Regulations base and 19738586.956522 USD on the Act base, whose higher benchmarks charge less. The readings differ between the benchmarks, so they do not agree at these prices, and 69663505.866593 USD is the case's total royalty on the Regulations base, production royalty included.")

q(1, "Ekene Alpha sells oil at a flat 75 USD/bbl. On the Regulations base, why does its royalty by price rate fall from 0.017935 in 2026 to 0.010320 in 2032?",
 "The benchmarks escalate each year, so a constant price sits lower on the scale.",
 ["The field's daily rate declines each year, and the royalty by price reads that daily rate as well.",
  "The rate steps down a fixed amount a year under a schedule of the Nigeria Tax Act 2025.",
  "Condensate's falling share pulls the rate down."],
 "The benchmarks rise by 2 percent a year while Alpha's price stays at 75, so each year the price sits closer to the low benchmark and the rate falls, from 0.017935 in 2026 to 0.010320 in 2032. The royalty by price reads price and year and leaves the daily rate alone; the NTA restates the same escalation; and the oil rate printed is for oil alone.")

q(2, "A case states pia_price_royalty_base \"act_2021\". What happens when it runs?",
 "The engine refuses: pia_price_royalty_base must be \"regulations_2021\" or \"act_2020\"; got \"act_2021\".",
 ["It runs on the Act base, since the string names the Act and a year close to the Act's own base year.",
  "It runs on the Regulations base, the default, with a note about the unknown string.",
  "No royalty by price for any year, at a zero rate."],
 "The engine accepts exactly two base strings, \"regulations_2021\" (the default) and \"act_2020\", and refuses anything else with that message, in its own words. It does not guess a base from a near miss, it does not fall back to the default with a note, and a refusal returns no ledger at all.")

q(0, "Which products carry a royalty by price?",
 "Only the two liquids para 11(1) names: crude oil and condensates.",
 ["Crude oil, condensate and natural gas liquids, all at the oil price.",
  "Every product the lease sells, gas included, at one blended price.",
  "Crude oil only."],
 "Para 11(1) charges \"a royalty by price with respect to crude oil and condensates\", and the engine rates each at its own price. Natural gas liquids are treated as natural gas for royalty, gas pays no royalty by price, and condensate is charged beside crude.")

q(3, "How does this course handle a graded figure that depends on the royalty by price?",
 "It states the Regulations base as the reading and grades no base against the other.",
 ["It grades the Act base as the law, because an Act of the National Assembly outranks the Regulations made under it.",
  "It grades the Regulations base as the law, as the later text.",
  "It averages the two bases."],
 "The base year is one of three open readings: taught side by side and never graded as the law. A figure that depends on it names the Regulations base, the engine default, as a stated reading for the run, and the Act base is taught beside it. Neither text is ranked as the law, and the engine computes no average of the two.")

emit(Q, '/root/cat-wip-pia/banks/ec7b_m04.json', expect_n=15)
finish()
