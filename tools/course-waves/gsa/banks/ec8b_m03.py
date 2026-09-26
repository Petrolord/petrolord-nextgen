import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Associate m03, Contract Quantities.
# Sources: the contractQuantities golden cases with the engine's day count
# wording, ACQ, MaxDCQ, swing factor, take-or-pay quantity on the full ACQ and
# effective swing; HMRC OT05402's printed 1.66; the properly nominated rule;
# the contractQuantities refusals. Every key rests on a digest-printed line or
# an engine return re-run in
# /root/cat-wip-gsa/scratch/bank-beginner/witness.mjs.

q(3, "At the power plant's DCQ of 21000 MMBtu, what ACQ does the engine return for calendar year 2027?",
 "7665000.000000 MMBtu, 365 days at the DCQ.",
 ["7686000.000000 MMBtu, counting 366 days in 2027 as the engine does for a year that follows a leap year.",
  "6132000.000000 MMBtu, the take-or-pay share of the year.",
  "23100.000000 MMBtu for each day, since the ACQ sums MaxDCQ."],
 "The rule, in the engine's basis: ACQ = DCQ x days in the contract year. The engine's day count reads \"calendar year 2027: 365 days (not a leap year)\", so 21000 x 365 is 7665000.000000. 7686000.000000 is 2028, a leap year of 366 days. 6132000.000000 is 80 percent of the ACQ, the take-or-pay quantity on the full ACQ. MaxDCQ, 23100.000000, is a daily ceiling and adds nothing to the ACQ.")

q(1, "The power plant's ACQ is 7686000.000000 in 2028 and 7665000.000000 in 2027. What accounts for the difference?",
 "2028 is a leap year of 366 days, one more DCQ than 2027.",
 ["The DCQ rises in 2028 with the plant's demand.",
  "The engine adds back 2027's force majeure when it counts 2028.",
  "A period rule: the engine counts 2028 with its end date included, one day more."],
 "The engine's day count reads \"calendar year 2028: 366 days (a leap year)\". At the same DCQ of 21000 the extra day adds exactly one DCQ, 21000, to the ACQ. The fixture's DCQ is 21000 in every year, force majeure reduces the Adjusted ACQ and never the ACQ, and a calendar year is a calendar year: a period's end-date rule applies only when a period is stated.")

q(0, "Calendar year 2100 is run at a DCQ of 1000. Which ACQ comes back?",
 "365000.000000, because 2100 is no leap year under the Gregorian rule.",
 ["366000.000000, as 2100 divides by four.",
  "366000.000000, like the year 2000.",
  "A refusal, as 2100 lies past MAX_YEARS."],
 "The engine's day count reads \"calendar year 2100: 365 days (not a leap year)\". A century year is a leap year only when it divides by four hundred: 2000 is one (366000.000000 at the same DCQ) and 2100 is not. DEFAULTS.MAX_YEARS, 100, caps the number of contract years one take-or-pay call accepts; it has nothing to do with a calendar year's date.")

q(2, "A first contract year is stated as a period from 2027-07-01 to 2028-01-01 at the export feed's DCQ of 63000. What does the engine count?",
 "184 days and an ACQ of 11592000.000000.",
 ["A refusal, because a contract year stated as a period must run a whole twelve months.",
  "The days to 2028-01-01 inclusive, one day more than the engine's own count.",
  "365 days, because a period is always rounded up to the full calendar year."],
 "The engine's own wording: \"2027-07-01 up to 2028-01-01 (end date excluded, as a contract year that finishes on the following 1 January): 184 days\". 63000 x 184 is 11592000.000000. A period may be any length with its end after its start; the end date is excluded, and nothing is rounded to a calendar year.")

q(2, "Fifty thousand MMBtu a day over a stated 350 days: which ACQ does the engine return?",
 "17500000.000000, for 350 days as stated.",
 ["A result for 365 days, as every contract year is read as a calendar year.",
  "A refusal, since a contract year must hold 365 or 366 days to be counted by the engine.",
  "14875000.000000, a share of it."],
 "A stated number of days is one of the three ways the engine takes a day count; its wording is \"350 days as stated\", and 50000 x 350 is 17500000.000000. The engine never substitutes a calendar year for a stated count. 14875000.000000 is that case's take-or-pay quantity on the full ACQ, a different figure.")

q(0, "What MaxDCQ and swing factor does the engine return for the power plant's 110 percent?",
 "A MaxDCQ of 23100.000000 and a swing factor of 1.100000.",
 ["A MaxDCQ of 21000.000000 and a swing factor of 1.375000.",
  "A MaxDCQ of 66150.000000 and a swing factor of 1.050000.",
  "A swing factor of 1.100000 and no MaxDCQ."],
 "MaxDCQ = maxDcqPct % of DCQ, so 110 percent of 21000 is 23100.000000, and the swing factor is MaxDCQ / DCQ, 1.100000. 1.375000 is the power plant's EFFECTIVE swing, the swing factor over the take-or-pay fraction. 66150.000000 and 1.050000 are the export feed's 105 percent of 63000. A MaxDCQ percentage the engine accepts returns a MaxDCQ beside the swing factor.")

q(3, "The power plant pairs a MaxDCQ of 110 percent with take-or-pay at 80 percent. Which effective swing results?",
 "1.375000.",
 ["1.100000, the swing factor itself, since effective swing is the swing factor.",
  "The take-or-pay fraction itself, the level the swing is measured against.",
  "1.666667, the effective swing of every contract with a swing factor of this size."],
 "The engine's rule: effective swing = swing factor / take-or-pay fraction, so 1.100000 / 0.8 is 1.375000. HMRC OT05402 describes it as \"dividing the swing factor by the take or pay level\". 1.100000 is the swing factor before the division. 1.666667 belongs to HMRC's own example of 150 over 90, and the fraction alone is no measure of swing.")

q(1, "HMRC's Oil Taxation Manual OT05402 works 150 over 90 and prints 1.66. How does this course quote that effective swing?",
 "As the engine's 1.666667, naming 1.66 as the figure the manual prints.",
 ["As 1.66, because the manual is the source and a printed text outranks a computed one.",
  "As 1.500000, HMRC's swing factor, which the course quotes in place of a ratio.",
  "As 1.660000, the engine's figure, which matches the manual."],
 "The engine returns 1.666667. The golden file's rule says the manual prints the quotient cut after two decimals; that cut is 1.660000, derived, and not the engine's figure. When a text prints a figure the engine computes more exactly, the course quotes the engine's and names the text's printed one as the text's. The swing factor, 1.500000, is the numerator of the division and no effective swing.")

q(0, "A learner enters maxDcqPct 90. What does the engine do?",
 "Refuses: maxDcqPct must be a number at or above 100 when given.",
 ["Accepts it, giving a MaxDCQ below the DCQ and a swing factor under one.",
  "Treats it as 90 percent of the take-or-pay quantity instead.",
  "Clamps it to 100 and returns a swing factor of exactly one."],
 "The engine's own words: \"maxDcqPct must be a number at or above 100 when given; got 90\". A ceiling below the ordinary daily quantity would make every ordinary nomination improper. Exactly 100 is accepted and means no swing, but the engine does not quietly raise a figure to reach it.")

q(3, "When does the engine refuse a take-or-pay percentage of 0 in a contractQuantities call?",
 "When a maxDcqPct is stated beside it.",
 ["Always, in any call at all.",
  "Only for a calendar year count.",
  "Never; 0 gives a quantity of 0."],
 "The engine's own words: \"topPct must be above 0 when maxDcqPct is stated (the effective swing divides by it); got 0\". Without a MaxDCQ a 0 is accepted: the golden case returns a take-or-pay quantity of 0.000000 and no effective swing. The day count has nothing to do with it.")

q(1, "A learner adds \"days\": 365 to a contractQuantities box that already states a year. What does the engine return?",
 "A refusal: days must be the only day count stated; got days and year.",
 ["A result for 365 days, the stated count taking priority over the year.",
  "A result for the calendar year, and the days entry is dropped.",
  "Both counts combined, with a reason naming the conflict."],
 "A day count is a stated term, and the engine takes exactly one: a stated number of days, a calendar year or a period. Two at once are refused with the message quoted, the engine's own words, and none at all is refused with \"days must be stated, or replaced by year or by period; got nothing\". Nothing is chosen between them or added.")

q(2, "In the contract quantities view, the power plant's 2027 shows a take-or-pay quantity of 6132000.000000. What is that figure?",
 "80 percent of the full ACQ, before any of the year's reductions.",
 ["The quantity the buyer owes for 2027, after force majeure and seller shortfall.",
  "The Adjusted ACQ of 2027 that the take-or-pay year view prints.",
  "What the buyer took in 2027, as the fixture records it."],
 "contractQuantities applies topPct to the ACQ \"before any adjustment\", so 80 percent of 7665000.000000 is 6132000.000000, a planning figure. The quantity the buyer owes is a percentage of the Adjusted ACQ, which the one take-or-pay year view computes after the year's reductions. The fixture's 2027 take is 7245000.000000.")

q(0, "On 2027-01-25 the power plant's buyer nominated 24150 against a MaxDCQ of 23100. What is the properly nominated quantity?",
 "23100.000000, with 1050 not properly nominated.",
 ["24150.000000, the whole nomination.",
  "21000.000000, the DCQ.",
  "22050.000000, which is 24150 less the 2100 of over-take the day records."],
 "The engine's rule: PNQ = min(nominated, MaxDCQ). Its reason, verbatim: \"2027-01-25: nominated 24150 is above the MaxDCQ 23100; 1050 is not properly nominated\". The seller owes nothing for the 1050 above the ceiling. The DCQ is no cap on a nomination; MaxDCQ is.")

q(2, "A contract states no MaxDCQ. On a stated day the buyer nominates, is offered and takes 180 against a DCQ of 100. What does the engine report?",
 "No reason at all, because nothing is owed either way.",
 ["A seller shortfall of 80, since the nomination runs above the DCQ.",
  "A refusal, as a nomination may never exceed the DCQ.",
  "Trimmed to 100, with 80 not properly nominated."],
 "Without a MaxDCQ there is no ceiling, and every nomination is properly nominated: the golden day daily-no-maxdcq returns a properly nominated quantity of 180.000000 and an empty list of reasons, since nothing is owed either way. The 80 above the DCQ is over-take, taken and paid for, and neither side owes anything for it.")

q(3, "Four contractQuantities calls are drafted, and only one comes back refused. Which?",
 "Days stated as 365.5.",
 ["Calendar year 2000 at a DCQ of 1000, which the engine counts as 366 days.",
  "A maxDcqPct of exactly 100, which states no swing at all.",
  "A topPct of 0 with no MaxDCQ stated, and a DCQ of 50000."],
 "The engine's own words: \"days must be an integer at or above 1; got 365.5\". Year 2000 is a leap year and returns 366000.000000 at a DCQ of 1000; a maxDcqPct of 100 is accepted and means MaxDCQ equals the DCQ; a topPct of 0 without a MaxDCQ is accepted and gives a take-or-pay quantity of 0.000000.")

emit(Q, '/root/cat-wip-gsa/banks/ec8b_m03.json', expect_n=15)
finish()
