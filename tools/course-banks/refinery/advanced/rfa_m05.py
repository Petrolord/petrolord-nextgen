import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# refinery Expert m05, Tax Losses Carried Forward. Digest section 23 (with the
# lossCarryForward setting of section 22 and the owner decision of section 24),
# as the four lessons of m05 teach it: the construction year loss, the pool year
# by year, the first taxable year, and what carrying the loss is worth, read as
# tax. No question keys an NPV figure. 15 questions.

q(2, "What taxable income before relief does each operating year of the ODIOMA expansion read, before the pool is set against it?",
 "38.5879 million",
 ["11.5764 million", "58.9160 million", "10.9559 million"],
 "From year 2 to year 21 the taxable income before relief reads 38.5879 million, with no capital left to deduct. 11.5764 million is the full annual tax on it, 10.9559 million the tax in year 5, and 58.9160 million the capital deducted in each construction year.")

q(0, "How much sits in the pool once 2028, the second construction year, closes?",
 "117.8320 million",
 ["58.9160 million", "79.2440 million", "40.6561 million"],
 "The pool holds both construction years' losses: 58.9160 million at the end of year 0 and 117.8320 million at the end of year 1. 79.2440 and 40.6561 are the pool at the end of years 2 and 3.")

q(1, "For a caller other than the refinery, how is the screening engine's lossCarryForward option set?",
 "Off by default.",
 ["On by default for every caller.",
  "On only when a royalty is charged.",
  "Off only for a TaxRoyalty fiscal type."],
 "The owner decision in force: loss carry-forward is an option of the screening engine, off by default for every other caller; the refinery switches it on. feasibilityEconomics passes lossCarryForward true.")

q(3, "In years 0 and 1, what tax do the two treatments print?",
 "Both read 0.0000.",
 ["Carried reads 0.0000; option off reads 11.5764.",
  "Option off prints a refund of 58.9160.",
  "Carried holds 58.9160 as a tax credit."],
 "Years 0 and 1 read taxable income before relief of -58.9160 million, and both tax columns read 0.0000. With the loss carried forward, the loss at year end reads 58.9160 and then 117.8320 million. The two tax columns first differ in year 2.")

q(2, "Year 2, calendar 2029, reads taxable income before relief of 38.5879 million. With the loss carried forward, why is its tax 0.0000?",
 "The pool of 117.8320 million carried in covers the whole year's income.",
 ["The plant makes no profit until year 5, when the first tax falls due.",
  "The tax rate of 30 percent is not applied until the pool is empty.",
  "Year 2 is still a construction year, so its income is not taxed."],
 "The loss carried in to 2029 is 117.8320 million, larger than the year's taxable income of 38.5879 million, so no income is left to tax, and the loss carried forward at year end reads 79.2440 million.")

q(3, "With the loss carried forward, which is the first year with tax to pay?",
 "Year 5, calendar 2032, tax 10.9559",
 ["Year 2, calendar 2029, tax 11.5764",
  "Year 4, calendar 2031, tax 2.0682",
  "Year 6, calendar 2033, tax 11.5764"],
 "The engine prints: first year with tax to pay, loss carried forward: year 5, tax 10.9559 MM. 2.0682 million is the pool at the end of year 4, and 11.5764 million is the full annual tax from year 6.")

q(0, "Why is year 5's tax of 10.9559 million below the 11.5764 million that year 6 pays?",
 "The last 2.0682 million of the pool shelters part of year 5's income.",
 ["Year 5 carries a smaller taxable income than year 6 does.",
  "The tax rate in year 5 is lower than the 30 percent later.",
  "Year 5's tax is a rounding of the 11.5764 million figure."],
 "Year 5 opens with 2.0682 million in the pool against taxable income of 38.5879 million, the same income as year 6. The pool is emptied and the income it cannot cover is taxed at 30 percent. From year 6 nothing is left to set against income.")

q(3, "With the option off, what tax does year 2, calendar 2029, pay?",
 "11.5764 million",
 ["0.0000 million", "10.9559 million", "38.5879 million"],
 "With the option off, calculateEconomics taxes each year on its own taxable income and the construction losses are not carried, so every operating year from year 2 pays 11.5764 million. With the loss carried forward year 2 pays 0.0000.")

q(1, "What rule does the engine state for the loss carried forward at year end?",
 "The loss carried in less taxable income, never below zero.",
 ["The loss carried in less the tax paid in the year, never below zero.",
  "The capex less the depreciation, never below zero.",
  "The loss carried in times the tax rate of 30 percent."],
 "The loss carried forward = the loss carried in - taxable income, never below zero. In 2029 the loss carried in is 117.831965348 million, the taxable income 38.587936000 million and the loss carried forward 79.244029348 million.")

q(2, "Subtracting two printed four-decimal pool figures can differ from a printed result in the last place. Why?",
 "Each four-decimal figure is rounded on its own.",
 ["The engine rounds only the tax column to four decimals.",
  "The pool is carried in whole millions.",
  "The tax rate is applied after the pool is rounded down."],
 "Each four-decimal figure is rounded on its own, so the digest prints the construction years through year 6 to nine decimals for arithmetic. Each nine-decimal figure agrees with the engine's own to within two units in the ninth decimal.")

q(0, "How does the feasibility oracle check the loss pool?",
 "With a dated tax-loss ledger used oldest first.",
 ["With one undated pool, used newest loss first.",
  "By re-solving the plan with a small extra supply.",
  "With a pool that lapses after 2 years unused."],
 "The feasibility oracle keeps annual accounts and a dated tax-loss ledger used oldest first, so the loss from 2027 is used before the loss from 2028. Re-solving with a small extra supply is how the plan oracle values a stream.")

q(1, "Years 0 and 1 read taxable income before relief of -58.9160 million. Where does that figure come from?",
 "The capex deducted in the year, with no revenue against it.",
 ["The fixed operating cost, charged before the plant starts.",
  "The tax at 30 percent on the capital, owed in advance.",
  "The crude bought ahead of start-up, carried inside opex."],
 "Taxable income before relief = gross revenue - opex - capex deducted. At nine decimals years 0 and 1 read gross revenue 0.000000000, opex 0.000000000 and capex deducted 58.915982674, so taxable income reads -58.915982674, and the tax in both years is 0.000000000.")

q(2, "What total tax over the life does the engine print with the option off?",
 "231.5276 million",
 ["196.1780 million", "35.3496 million", "11.5764 million"],
 "Total tax over the life: 196.1780 MM with the loss carried forward; 231.5276 MM with the option off; the difference 35.3496 MM.")

q(1, "In which years does the whole printed difference of 35.3496 million in total tax arise?",
 "Years 2 to 5, the years the pool shelters.",
 ["Years 0 and 1, the two construction years.",
  "Every one of the 20 operating years alike.",
  "Year 21, when the unused pool is released."],
 "The construction years pay 0.0000 under both treatments, and from year 6 both pay 11.5764 million a year. With the option off years 2 to 5 each pay 11.5764 million; with the loss carried years 2 to 4 pay 0.0000 and year 5 pays 10.9559 million.")

q(0, "The screen reads 88.6345 MM with the loss carried forward and 64.8440 MM with the option off. What does the pair show?",
 "Switching the option off, on the same inputs, lowers the screen's NPV.",
 ["The option off screens a different capital, so the two are different plants.",
  "The NPV is the graded figure, so the carried case wins.",
  "The option on moves the tax into the two construction years."],
 "The option-off run takes the same inputs through calculateEconomics directly, and the NPV at 12 percent reads 88.6345 MM carried and 64.8440 MM with the option off. The construction years pay 0.0000 tax in both columns. The Economics courses teach and grade the NPV; this course reads it as the screen's answer.")

emit(Q, '/root/wt-md-refinery-nextgen/tools/course-banks/refinery/advanced/rfa_m05.json', expect_n=15)
finish()
