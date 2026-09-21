import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Expert m04, The Investment Case. Digest section 22 only, as the five
# lessons of m04 teach it: the streams handed to the screening engine, revenue
# as revenue, no royalty, capital expensed when spent (held item H2 as a limit)
# and the feasibility NPV read as the screen's answer. No question keys an NPV
# or IRR figure. 15 questions.

q(1, "What royaltyRate does feasibilityEconomics hand the screening engine for the ODIOMA expansion?",
 "0",
 ["30", "12", "22"],
 "The royalty rate is 0 because a refinery buys its crude and pays no royalty, an owner decision in force. 30 is the taxRate, 12 the discountRate and 22 the projectLife in years.")

q(3, "Why is the royalty rate on the ODIOMA expansion 0?",
 "A refinery buys its crude and pays no royalty.",
 ["The tax rate of 30 percent carries it.",
  "It is charged on the crude in opexFixed.",
  "TaxRoyalty has no royalty term to set."],
 "The printed reason is that a refinery buys its crude and pays no royalty. The tax rate of 30 percent is a separate input, opexFixed holds the fixed operating cost plus the crude cost, and TaxRoyalty still takes a royaltyRate, which is 0.")

q(0, "With the royalty rate at 0, what fiscalType does the screening engine receive, and what does the royalty column show?",
 "TaxRoyalty, and the column reads 0.0000 in every year.",
 ["No fiscalType, and the column is dropped from the cash flow.",
  "A tax-only type, and the column is left blank.",
  "TaxRoyalty, and the column carries the crude royalty from 2029."],
 "feasibilityEconomics hands the screening engine fiscalType TaxRoyalty with royaltyRate 0, and the cash flow prints the royalty column at 0.0000 in every year from 2027 to 2048.")

q(2, "What does the opexFixed of 291.7664 million in the first operating year contain?",
 "The fixed operating cost plus the crude cost.",
 ["The fixed operating cost of 14000000.00 a year, and nothing else.",
  "The capital spread over 20 years.",
  "The variable cost of 4.2000 a barrel."],
 "The screen labels it: opexFixed in the first operating year is the fixed operating cost plus the crude cost, in millions. With opexVariable of 15.7651 it makes the cash flow's opex of 307.5315.")

q(0, "What price does the screening engine receive for the first operating year?",
 "92.2100, the slate's gross value",
 ["14.0100, the gross margin per barrel",
  "74.0000, the crude cost a barrel",
  "4.2000, the variable cost a barrel"],
 "Revenue goes in as revenue: barrels at the slate's value. The price is the gross value per barrel of crude, 92.2100, on production of 3753600.00 bbl. 14.0100 is the gross margin per barrel on the screen.")

q(3, "Among the inputs printed for the screen, which lossCarryForward value appears?",
 "true",
 ["false, the screening engine's default for other callers",
  "false, so that each year is taxed on its own",
  "Left out, so the screening engine's default applies"],
 "The inputs print lossCarryForward true beside royaltyRate 0 and taxRate 30. Loss carry-forward is off by default for every other caller; the refinery switches it on.")

q(0, "The cash flow's opex in each operating year reads 307.5315. How is that figure formed?",
 "opexFixed 291.7664 plus opexVariable 15.7651.",
 ["The fixed cost of 14000000.00 plus 4.2000 a barrel.",
  "opexFixed 291.7664 plus the tax of 15.7651.",
  "Gross revenue 346.1195 less the tax of 38.5879."],
 "The course prints the sum: 291.7664 + 15.7651 = 307.5315, and the cash flow's opex reads 307.5315. The crude cost sits inside opexFixed, so a fixed and variable cost alone would leave the crude out.")

q(2, "In the screening engine's units, what capex does year 0 carry?",
 "58.9160 million",
 ["58915982.67 million", "117.8320 million", "117831965.35 million"],
 "The screening engine works in millions of US dollars. The capital of 117831965.35 dollars is spread as 58915982.67 dollars in each construction year, which the cash flow prints as 58.9160 million in year 0 and again in year 1.")

q(1, "How does the expansion capital of 117831965.35 enter the streams?",
 "Evenly, 58915982.67 in each of the 2 construction years.",
 ["All of it in year 0, the first construction year.",
  "Evenly over the 20 operating years, as a yearly charge.",
  "In year 1, the year construction is finished, at 117.8320."],
 "The capital is spread evenly over the 2 construction years, each half printed to the cent. The engine carries the unrounded halves, which sum to the capital: true.")

q(3, "The screening engine receives a projectLife of 22 years. What does that cover?",
 "Construction in years 0 and 1, operation from year 2 to 21.",
 ["The 20 operating years plus 2 years of loss carried forward.",
  "The calendar years 2027 to 2048, less the construction years.",
  "The 12 percent discount horizon and the 30 percent tax years."],
 "The project life covers the construction years and the operating years together, numbered year 0 to year 21 on the cash flow, calendar 2027 to 2048 from start year 2027.")

q(1, "feasibilityEconomics passes no capexDepreciationYears. What does the screening engine then do with the capital?",
 "It deducts the capital in the year it is spent.",
 ["It deducts it over the 20 operating years.",
  "It deducts nothing until the plant is commissioned in 2029.",
  "It refuses the call without a schedule."],
 "The depreciation column equals the capex column in every year: true. So 2027 and 2028 each carry a deduction of 58.9160 million with no revenue against it, and the construction years make a tax loss.")

q(2, "Held item H2 is taught as a limit of the screening engine. What does it say the engine lacks?",
 "A capital allowance schedule starting at commissioning.",
 ["A royalty setting for a plant that buys its crude.",
  "Any way to carry a tax loss into later years.",
  "A mid-year discounting convention for the NPV."],
 "H2: the screening engine depreciates capital in the year it is spent and offers no capital allowance schedule starting at commissioning. Carrying the loss forward covers the refinery case, and a fuller allowance model belongs to the Economics module.")

q(1, "What net cash flow does the ODIOMA expansion read in 2028?",
 "-58.9160, capex with nothing earned",
 ["38.5879, the first operating year", "0.0000, no flow at all", "27.6320, the first taxed year"],
 "2028 is year 1, the second construction year: no revenue, no opex, a capex of 58.9160 and no tax, so the net cash flow reads -58.9160. 38.5879 is year 2 and 27.6320 year 5.")

q(3, "The screen prints its NPV of 88.6345 million at 12 percent. Which discounting convention does it state?",
 "Mid-year: a flow in year t is discounted at t + 0.5.",
 ["End-year: a flow in year t is discounted over t whole years.",
  "Start-year: year 0 undiscounted.",
  "Continuous, at 12 percent a day."],
 "The screen prints the convention beside the figure: mid-year discounting, a flow in year t discounted at t + 0.5. The Economics courses teach and grade the NPV; this course reads it as the screen's answer.")

q(0, "The expansion is re-run with start year 2031 in place of 2027. What changes?",
 "Only the calendar labels on the years.",
 ["The NPV, discounted further.",
  "The tax, as the pool opens in 2031.",
  "The capital, via the modular law."],
 "The start year labels the years and moves no figure. With start year 2031 the first calendar year reads 2031, and the NPV and total tax read 88.6345 and 196.1780 as they do with 2027. The two agree to the last digit: true.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/advanced/rfa_m04.json', expect_n=15)
finish()
