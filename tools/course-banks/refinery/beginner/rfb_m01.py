import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Associate m01, What a Feasibility Screen Computes. Written from
# digest.txt SECTIONS 1 and 2, which are the four lessons of this module: two
# apps and one barrel, a screen before a study, a blank box is refused, and
# illustrative prices and what they give.

q(2, "Two Suite apps call the refinery modules. Which app reaches the screening engine, and through which function does it get there?",
 "The Modular Refinery Feasibility Studio, through feasibilityEconomics.",
 ["The Refinery Planning Studio, through its cascadeToSchedule function.",
  "The Modular Refinery Feasibility Studio, through the scaleCapex function.",
  "The Refinery Planning Studio, through the plan, schedule and actual ledgers."],
 "modularRefinery hands its annual streams to the screening engine through feasibilityEconomics. The Refinery Planning Studio runs refineryPlanning over lib/lp/simplex and streamModel, and neither of those reaches the screening engine in this tier."),

q(0, "Some exports read the machine clock when an argument is left out. Which pairing of function and missing argument does the course print?",
 "feasibilityEconomics reads the year when startYear is left out.",
 ["cascadeToSchedule reads the year whenever startYear is left out of the call.",
  "feasibilityEconomics reads the date when periodStart is left out.",
  "scaleCapex reads the clock when no exponent is passed to it at all."],
 "cascadeToSchedule reads the clock when periodStart is missing, and feasibilityEconomics and calculateEconomics read the year when startYear is missing. The course passes both every time, with start year 2027 for every valuation."),

q(3, "The course counts each module's exports. Which count belongs to modularRefinery?",
 "6 exported functions and 4 exported lists and constants.",
 ["3 exported functions and 0 exported lists and constants.",
  "7 exported functions and 4 exported lists and constants, as measured.",
  "6 exported functions and 1 exported list or constant, as counted."],
 "modularRefinery counts 6 and 4. refineryPlanning counts 3 and 0, streamModel 7 and 4, and the screening engine 6 and 1."),

q(1, "streamModel.LEDGER names the three ledgers the later tiers read one barrel on. Which three are they?",
 "plan, schedule and actual",
 ["optimal, infeasible and unbounded",
  "receipt, delivery and transfer",
  "firm, tight and disrupted"],
 "LEDGER holds plan, schedule and actual. firm, tight and disrupted are modularRefinery.SUPPLY_SCENARIOS, the three futures for crude arriving at the gate, and the other two options are not ledgers at all."),

q(1, "feasibilityStreams is run on OKORDIA with the crude cost box left blank. What does the engine return?",
 "REFUSED: \"Missing crude cost. Enter 0 where the value really is zero.\"",
 ["An answer that reads the blank as a crude cost of zero and prints a higher margin.",
  "An answer at the firm scenario's crude cost with premium of 76.0000 a barrel.",
  "An answer with the crude cost column of the annual streams left out entirely."],
 "A money box left blank is refused by name, and the sentence says how to state zero on purpose: type 0. A blank says the value is unknown, and a typed 0 says it is known and nothing."),

q(3, "On OKORDIA, the capacity and the fixed operating cost are both left blank. What comes back?",
 "A single refusal that names both the capacity and the fixed operating cost, together in one sentence",
 ["A refusal naming capacity alone, so the fixed operating cost surfaces as its own refusal on the next run.",
  "A refusal naming capacity, with the blank fixed operating cost read as 0.00 so the year still builds.",
  "An answer with null capital from scaleCapex and streams that carry no capex or fixed opex at all."],
 "When two boxes are blank the refusal names both in one sentence: \"Missing capacity, fixed operating cost. Enter 0 where the value really is zero.\" Both are fixed together, and the second is not discovered on the next run."),

q(0, "A user types 90 into the utilisation box, meaning 90 percent. What does the engine return?",
 "REFUSED: \"Utilisation is a fraction between 0 and 1 (0.9 for 90 percent).\"",
 ["An answer that reads 90 as 0.9 and runs the plant at that fraction of nameplate.",
  "An answer running 90 times nameplate on each of the 330 on-stream days.",
  "REFUSED: \"On-stream days must be between 1 and 366.\""],
 "Utilisation is read as a fraction, and 90 lies outside 0 to 1, so the engine refuses it and gives the example 0.9 for 90 percent. It never guesses what was meant."),

q(2, "Utilisation typed as 0 and on-stream days typed as 0 are each tried on OKORDIA. How does the engine treat the two?",
 "Utilisation 0 is answered with 0.00 bbl; on-stream days 0 is refused with its range.",
 ["Both are refused, each with the range the engine accepts for that input.",
  "Both are answered, and each prints an annual throughput of 0.00 bbl.",
  "On-stream days 0 is answered with 0.00 bbl; utilisation 0 is refused with its range."],
 "A utilisation of 0 is inside 0 to 1, so the engine answers: annual throughput 0.00 bbl. On-stream days must be between 1 and 366, so a typed 0 is refused."),

q(3, "scaleCapex is given a capacity of 0. What does it return for the cost and the cost per bpd?",
 "null for the cost and null for the cost per bpd",
 ["0.00 for the cost and 0.00 per bpd",
  "REFUSED: \"Missing capacity, fixed operating cost. Enter 0 where the value really is zero.\"",
  "the reference cost of 64000000.00, unscaled, and 12800.00 per bpd"],
 "scaleCapex returns null for the cost and for the per bpd figure when the capacity is 0, the reference cost is blank or the reference capacity is blank. That is no cost at all, a different answer from a zero cost of 0.00. The refusal in the options is feasibilityStreams' sentence for a blank capacity and fixed operating cost."),

q(1, "feasibilityEconomics is called with the tax rate left blank. What does it return?",
 "REFUSED: \"A discount rate and a tax rate are needed to value the project.\"",
 ["A valuation that reads the blank tax rate as 0 and values the project untaxed.",
  "REFUSED: \"Missing capital cost. Enter 0 where the value really is zero.\"",
  "A valuation run at the engine's stated default tax rate for a refinery."],
 "A tax rate left out, a tax rate left blank and a discount rate typed as null all draw the same sentence: a discount rate and a tax rate are needed to value the project."),

q(0, "Streams that were refused for a blank crude cost are handed to feasibilityEconomics. What does the valuation return?",
 "The streams' own refusal, word for word, with the crude cost box still named",
 ["REFUSED: \"A discount rate and a tax rate are needed to value the project.\"",
  "A valuation in which the crude cost column is read as 0.00 in every year.",
  "A valuation of the other columns, with the crude cost named as unpriced."],
 "feasibilityEconomics refuses streams that carry a refusal, and the refusal travels forward with its words intact, so the reader of the valuation sees the same box named."),

q(2, "OKORDIA's inputs include a fixed operating cost of 7500000.00 a year. Where does that figure enter the screen?",
 "In neither the throughput nor the margin; it is a yearly line in the streams.",
 ["As a fourth term subtracted in the gross margin per barrel of 4.5900.",
  "As one of the three inputs multiplied into the throughput of 1518000.00 bbl.",
  "As part of the capital of 64000000.00 spread over the construction years."],
 "Annual throughput is capacity times on-stream days times utilisation, and the gross margin per barrel is gross value less crude cost less variable operating cost. The fixed cost appears as fixed opex of 7500000.00 in each producing year."),

q(2, "OKORDIA prices diesel at 101.0000 and gasoline at 104.0000 a barrel. What does the course say these prices are?",
 "Illustrative figures on invented records, set in US dollars.",
 ["Market quotations for a stated date the screen was calibrated on.",
  "The real prices of the crude grades whose names appear on the Studio panel.",
  "Averages of published prices the Studio refreshes itself."],
 "The course's case line says all three records are invented and every price and cost in it is illustrative, in US dollars. None is a market quotation for any date, and a crude grade name is a label on invented yields and prices."),

q(0, "All three configurations are valued against one OKORDIA price table, and give 76.9400, 83.7900 and 90.6300. What differs between them to give three values?",
 "The fixed yield row each configuration carries",
 ["Their crude cost of 76.0000 a barrel",
  "The supply scenario each configuration is run under, firm or tight",
  "The capital each plant is quoted at"],
 "The price table is shared and the crude cost is 76.0000 whichever plant is picked. The gross value is yields times prices, so the yield row is what moves 76.9400 to 83.7900 to 90.6300."),

q(1, "A screen refuses with \"Missing crude cost. Enter 0 where the value really is zero.\" The user types 0 to clear it. What has the screen now been asked to value?",
 "A plant whose crude is free",
 ["The firm case at 76.0000 a barrel",
  "A plant with its crude cost left unknown",
  "The last crude cost typed into that box"],
 "A typed 0 is a statement that the value is known and nothing. Typing it to clear a refusal makes the screen answer for free crude, which is why the sentence asks for 0 only where the value really is zero."),

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/beginner/rfb_m01.json', label='rfb_m01', expect_n=15)
finish()
