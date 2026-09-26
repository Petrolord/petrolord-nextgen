import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Expert m05, What the Engine Does Not Compute. Every concept-only item
# (excess gas, off-specification and pre-start gas, a price review's outcome,
# the index change cap, the extend-the-term alternative, carry-forward
# against next year's ACQ, the 90-day investigation, compensation, the supply
# tiers, the flare fine) is keyed only as "not computed", as the course's
# table says. The domestic base price is keyed only as a required input
# quoted as reported, and no key is a reported figure.

K = [2, 3, 1, 0, 0, 2, 3, 1, 3, 2, 0, 1, 2, 3, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A contract lets the seller supply excess gas above the DCQ, which the Commonwealth model agreement's (2025) BADQ Alternative 1 takes into account. What does the engine compute for that excess gas?",
 "Nothing: it computes BADQ Alternative 2 and models no excess gas",
 ["Over-take on the daily balance",
  "Excess gas at the make-up price",
  "It removes the excess from the take-or-pay quantity before the year's deficiency is found"],
 "The course lists excess gas and over-delivery as not computed: the engine does nothing with them and computes BADQ Alternative 2. The daily balance's over-take is gas taken above the adjusted DCQ, which is a different thing from excess gas in the model's sense; and the engine neither prices excess gas nor adjusts the take-or-pay quantity for it.")

# 2
x("Off-specification gas and gas delivered before the Start Date have their own clauses in the Commonwealth model agreement (2025) (Article 13 and the Start Date). What does the engine do with them?",
 "Nothing; both are taught as concepts only",
 ["It deducts off-specification gas from the quantity taken before looking for a deficiency in the year",
  "Pre-start gas is priced at the contract price of the first priced month of the delivery period",
  "Every off-specification day is booked as a seller shortfall on the daily balance of that month"],
 "The course's table of what the engine does not compute lists off-specification and pre-start gas with the engine doing nothing. Every quantity it reads is gas the contract counts, so it deducts nothing, prices nothing before the start and books no seller shortfall for gas quality.")

# 3
x("The export feed's price carries reopeners in 2031-01 and 2035-01. What does priceSeries return for them?",
 "Each reopener month reported with a note that the review's outcome is not modelled",
 ["A price reset in each reopener month to the contract price of the first priced month of the agreement",
  "No price past a date on which the parties may renegotiate their price, the call being refused",
  "Prices held flat from each reopener month to the next"],
 "The engine reports each reopener, verbatim: \"price reopener 2031-01: reported only; the engine does not model the outcome of a price review\". It prices every month on the stated formula through 2036-12, so it resets nothing, refuses nothing and holds nothing flat at a reopener.")

# 4
x("A learner types a reopener as \"2031\". What does the engine do?",
 "It refuses: reopeners[0] must be a month 'YYYY-MM'",
 ["It reads the year as 2031-01, the first month of the year",
  "It ignores the entry and prices the series with no reopener at all",
  "It reports a reopener note in every month of 2031, one for each priced month of that year"],
 "The engine's message, verbatim, is \"reopeners[0] must be a month 'YYYY-MM'; got \"2031\"\". A reopener is a stated month, and anything else is refused by name; the engine guesses no month, drops no input in silence and spreads nothing across a year.")

# 5
x("Article 15.8 of the Commonwealth model agreement (2025) prints a floor and ceiling per index (Alternative 1) and a cap on the change of an index (Alternative 2). What does the engine compute?",
 "Alternative 1 only; the change cap is not modelled",
 ["The change cap, turned into a floor and a ceiling set around each index's stated base value",
  "A refusal of any fast-moving index",
  "Both, the cap on the price"],
 "The course's table lists the index change cap of Article 15.8 Alternative 2 as not computed; the engine computes floors and ceilings per index (Alternative 1). It converts nothing, refuses no index for moving, and an index cap is no price ceiling.")

# 6
x("Which end-of-term rules does makeUp.endOfTerm accept?",
 "forfeit and refund, a call stating extend being refused",
 ["All three the model agreement prints for the end of the Delivery Period: forfeit, refund and extend",
  "refund only, forfeiture having no place in the Commonwealth model agreement",
  "extend and refund, with forfeiture the default"],
 "The refusal reads \"makeUp.endOfTerm must be one of \"forfeit\", \"refund\"; got \"extend\"\". The model's Article 12.7.5 prints forfeit, refund and extending the term, and the engine models the first two; forfeiture is the model's Alternative 1, and the end-of-term rule is a required input with no default.")

# 7
x("A contract's carry-forward reduces next year's ACQ, Article 12.8 Alternative 1 of the Commonwealth model agreement (2025). How does the engine treat it?",
 "It does not model that alternative; it credits carry-forward against a later deficiency",
 ["It lowers next year's ACQ by the surplus and then recomputes the take-or-pay quantity on it",
  "It enters the surplus as next year's permitted reduction",
  "It refunds the surplus to the buyer at the end of the term, at the last take-or-pay price"],
 "Carry-forward that reduces next year's ACQ is on the course's list of what the engine does not compute: it computes Alternative 2, carry-forward against the deficiency. It never lowers an ACQ, a permitted reduction is the operational flexibility credit, and refunds apply to make-up still open at the end of the term.")

# 8
x("Regulation 6(3)(b) of the DGDO Regulations 2022 deems the obligation met if the Commission fails to investigate a claimed excuse within 90 days. How does domesticGasObligation handle it?",
 "It does not compute that rule; the excuses are applied as stated",
 ["It deems the obligation met whenever an excuse is stated and no investigation date is given",
  "A penalty deferred for 90 days",
  "It refuses a call whose excuse lacks a date"],
 "The engine's basis, verbatim: \"the 90-day investigation rule of r.6(3) and the compensation to customer-clients of s.110(13) are not computed\". It applies the stated excuses in the order of s.110(10); it deems nothing met on a missing date, defers nothing and asks for no date.")

# 9
x("Section 110(13) of the Petroleum Industry Act 2021 requires a producer that defaults on supply through the domestic gas aggregator to compensate the customer-client for its loss. What does the engine compute for it?",
 "Nothing; its basis names that compensation as not computed",
 ["Compensation at US$3.50 per MMBtu not supplied, the rate of s.110(8)",
  "The seller shortfall price stated in the supply agreement, applied to the gas not supplied",
  "The penalised quantity valued at the domestic base price stated for the year"],
 "The compensation of s.110(13) is on the course's list of what the engine does not compute, and the engine's basis says so. The US$3.50 per MMBtu of s.110(8) is the obligation penalty paid for gas not delivered, a different rule; the seller shortfall price belongs to a gas sales agreement's damages; and no text read gives compensation a formula.")

# 10
x("Why does this course print no flaring penalty rate?",
 "The Act leaves the fine to regulations, and the copy of the 2023 Regulations read is unnumbered and undated",
 ["The rate is in a licensed text",
  "Each gas sales agreement sets its own flaring penalty",
  "Flaring has been outside Nigerian law since the Petroleum Industry Act 2021 took effect"],
 "PIA s.104(1) makes flaring outside the exceptions an offence with \"a fine as prescribed by the Commission in regulations\", and the copy of the 2023 Regulations on the regulator's gazetted page is unnumbered and undated, so no figure was read. The Act leaves the fine to the Commission's regulations, so a gas sales agreement does not set it, and the Act does regulate flaring (s.104, s.105).")

# 11
x("In the engine, where does a lessee's Domestic Gas Delivery Obligation quantity come from?",
 "The caller states it; the engine computes neither the tier allocation nor the supply curve",
 ["The engine derives it from the supply curve of r.5(2) and the lessee's share of national output",
  "The engine allocates the domestic gas demand among all lessees before 1 March of each year",
  "From the domestic base price"],
 "The Third Schedule tier allocation and the supply curve (DGDO Regulations r.4 and r.5) are listed as not computed: the obligation is a stated input. S.110(1)(a) gives the Commission the allocation before 1 March, and the engine does not do it; the domestic base price sets prices, and no quantity.")

# 12
x("How does the course treat the 2026 domestic base price?",
 "As a required input; the figures are quoted only as reported by BusinessDay and by Advocaat Law Practice through Legal 500",
 ["As law read from the regulator's circular effective 1 April 2026",
  "As a default the engine holds in PIA_GAS",
  "As a graded figure of the Professional tier's capstone, taken from the regulator's own published figure"],
 "The Authority determines the domestic base price each year (PIA s.167(1)); the regulator's circular could not be retrieved, so the engine holds no default and every call states it, and the course quotes the reported figures with their reporters and grades none. PIA_GAS holds the penalty rate, the commercial adder and the gas based industries floor, and no base price.")

# 13
x("A domesticPrice call states the reported 2026 domestic base price of 2.180000 for the commercial sector. What does it return, and by which rule?",
 "2.680000 on the reported base price: the base price plus US$0.50 per MMBtu under s.167(6)",
 ["2.180000, the reported power price, since s.167(5) sets one price for both sectors",
  "2.500000, a negotiated price inside the reported ceiling of s.167(7)",
  "2.980000 on the reported base, the price delivered with a stated transport tariff added"],
 "PIA s.167(6) prices the commercial sector at the domestic base price plus US$0.50 per MMBtu, the adder the engine applies as law; on the reported 2.180000 the engine returns 2.680000. S.167(5) is the power sector price only; 2.500000 is a gas distributor's negotiated price; and 2.980000 is the power price delivered with a stated transport tariff, a different call.")

# 14
x("Why can a learner not slip an excess gas term into the ledger by adding a key for it to a contract year?",
 "A key a function does not read is refused, with its path and every key the function accepts",
 ["The key is accepted and stored, then ignored when the ledger is computed, which a report must mention",
  "Unknown keys are renamed to the nearest accepted key",
  "It can: the engine reads any numeric key on a year as a permitted reduction to the Adjusted ACQ"],
 "The engine reads no key it does not know: every call refuses an input key the function does not read, at every level, naming the key, its path and the accepted keys, as the golden refusal of years[0].fm shows. A misspelt or unsupported key never silently drops a term, is never renamed, and is never read as a reduction.")

# 15
x("How are the export feed's prices after the 2031-01 reopener computed?",
 "On the same stated formula, the reopener reported with its note",
 ["At the 2031 annual average of 8.261300, held flat from the reopener to the end of the term",
  "At the parity slope of 0.172414",
  "With the slope raised to 0.1485"],
 "priceSeries keeps pricing on the only price the contract states, and reports the reopener with its note; the 2031 annual average of 8.261300 is simply that year's average of monthly formula prices. The engine models no review outcome, so it neither holds a price flat nor substitutes the parity slope or Figure 51's slope.")

emit(Q, '/root/cat-wip-gsa/banks/ec8a_m05.json', expect_n=15)
finish()
