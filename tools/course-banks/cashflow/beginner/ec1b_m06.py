import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, beginner tier, The Associate Reading. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit the rows there, then re-run it.

q(2,
 "The Associate reading is walked on AKATA's 2031 row rather than on 2029 or 2030. What makes 2031 the cleanest row in the field?",
 "It carries no capex, no loss and is one year past the last spend, so every column shows its ordinary behaviour.",
 ["It is the base year, so its prices are the typed 82 and 3.2 and no escalator has to be undone before the row can be checked.",
  "It is the payback year, so the cumulative crosses zero on it and the whole ledger can be checked from one row.",
  "It is the peak revenue year, at 136363147.20 USD, so every line is at its largest and easiest to read."],
 "The 2031 net of 64468245.07 is the peak, but the row is chosen for what it lacks: the 45000000.00 tranche is a year behind it and the cumulative is still -29534809.71.")

q(0,
 "AKATA's 2031 row applies 85.312800 USD/bbl and 3.329280 USD/Mscf where the configuration typed 82 and 3.2. Which setting produced the difference?",
 "The price escalators of 2 percent, compounded for the two years since the 2029 base.",
 ["The inflation rate of 3 percent, which the engine applies to every money column including the prices.",
  "A price deck, which steps the prices in the years it names and holds them between entries.",
  "The oil price differential, added after the flat price is resolved for each year."],
 "The 2030 row already reads 83.640000, one step, and 85.312800 is that step taken again; the opex column runs on its own 3 percent to 25461600.00.")

q(3,
 "The first step of working a ledger question is to check that the engine will accept the files. What is the reading of a run the engine refuses?",
 "The refusal itself, with its reason.",
 ["A ledger of zeros, from which the reader recovers the missing volumes by reading the annual totals the engine reports back.",
  "The same ledger the run would have produced, since a refusal only withholds the KPI block and not the rows.",
  "Whatever the engine produced on the last accepted upload, which it keeps until a new file replaces it."],
 "A file that fails is refused with a message, not run with a zero; the only fix for a missing price is the price.")

q(1,
 "A reader builds AKATA's 2029 row by hand and gets a tax of 0.00 where the engine prints 45250880.00 USD. Which convention did they break?",
 "They deducted the 210000000.00 of capex from the tax base instead of its 21000000.00 of depreciation.",
 ["They charged depreciation to cash, which turns 2029 into a loss year with nothing to tax.",
  "They took the royalty off revenue less opex, which shrinks the base until it goes negative.",
  "They forgot the royalty deduction, which leaves the base at gross revenue and the tax at zero."],
 "The gap names the mistake: a net 21000000.00 too low is depreciation charged to cash, a tax of 0.00 is capex in the base, a royalty below 27904800.00 is a royalty taken off something net.")

q(2,
 "The second proven row is 2030, chosen because the base year hides the escalators. A reader's 2030 opex still reads 24000000.00 USD where the engine prints 24720000.00. What was missed?",
 "The opex escalator of 3 percent, applied for one year from 2029.",
 ["The working interest, which scales the opex line along with the other money lines.",
  "The capex escalator, left at its default of 0.",
  "The inflation rate, which restates the opex in money of the day on a real-basis run."],
 "If the price is still 82.000000 in the 2030 row the oil escalator was not applied, and if the opex is still 24000000.00 the opex escalator was not; 2030 tests both at once.")

q(0,
 "A ledger question is asked at a working interest below 100 percent. What does the Associate method do with the take?",
 "Quotes what the engine prints on that run, 66.1723 percent, because the interest scales the government's lines and the partner's alike.",
 ["Scales it by the interest, as it scales every other money reading in the KPI block.",
  "Goes back to a 100 percent run for it, because a scaled run sets the partner's net against the whole field's value and its take is not a fiscal statement.",
  "Leaves it out, because take is a field-level reading and cannot be stated for a partner."],
 "Every money line and the volumes report the share, so take reads 66.1723 percent at 100, at 60 and at 25 percent alike, and the figure on the run asked about is the one to quote.")

q(3,
 "One of the four checks says the last cumulative equals the total net cash flow. On AKATA which number is that?",
 "117362408.71, the close of the real column.",
 ["141637829.18, the nominal total, because the totals block is stated in money of the day.",
  "30401798.05, the 2035 net cash flow, since the last cumulative is the last row's flow.",
  "19845806.34, the first positive cumulative, because the check is made at payback."],
 "The displayed cumulative_cash_flow follows the basis of the run, and AKATA runs real; the nominal running sum closes at 141637829.18 and is not what the check reads.")

q(1,
 "The method proves 2029 and 2030 to the cent and trusts the remaining rows on the strength of them. What does that not protect against?",
 "A convention that only bites in a later year, such as a loss carried or a limit reached.",
 ["A wrong price, because a price error is invisible in the base year and the escalated 2030 row only proves the escalator.",
  "A wrong working interest, because the interest is applied after the rows are built and cannot be seen in them.",
  "Nothing, because a ledger right for two rows is right by the same arithmetic everywhere."],
 "AKATA's loss columns read 0.00 on every row, so nothing in it ever exercises that edge, and two proven rows cannot say what happens when one does.")

q(2,
 "A production upload has oil volumes and the run stops with oil_price_unset. What is the fix?",
 "Set oil_price_usd_bbl. The method cannot rescue a refused upload.",
 ["Set the oil price escalator, which the engine reads as the price when the flat price is blank.",
  "Rename the oil column so the check does not fire.",
  "Leave it, because the engine falls back to the inflation rate for a price the way it does for an escalator."],
 "An escalator left blank falls back to inflation; a price left blank is a refusal, because a price default would be a number from nowhere.")

q(0,
 "AKATA's total net cash flow is 141637829.18 USD in money of the day and 117362408.71 in 2029 money. Which one does the Associate reading say a decision should rest on?",
 "Neither. It names both with their bases; choosing needs a clock, which is the Professional tier.",
 ["The real one, because a real-basis run reports the real total as total_net_cash_flow and the KPI block is authoritative.",
  "The nominal one, because payback and take are both read from the nominal running sum.",
  "The larger one, because money of the day is what was actually received."],
 "Same rows, same cash, two totals; what a 2035 flow of 30401798.05 is worth in 2029 is the question the tier does not answer.")

q(3,
 "Every Associate reading of AKATA treats the 30401798.05 USD earned in 2035 in one particular way. Which?",
 "As exactly 2029 money.",
 ["As 25461027.24, its value in 2029 money, since the run is on the real basis and every total follows it.",
  "As 17161022.43, its discounted value, because the readings are stated at the applied rate.",
  "As money the payback can see, because the cumulative includes it."],
 "Nothing in this tier has a clock: payback, take and unit cost alike are undiscounted, and the real column is a restatement, not a valuation.")

q(1,
 "The engine prints take 66.1723 and 76.1610 percent, and payback 3.461632 and 3.961607 years, on the same line. Which of each pair is the Associate reading?",
 "66.1723 and 3.461632, the undiscounted ones.",
 ["76.1610 and 3.961607, because the discounted readings are the ones on the real basis and AKATA runs real.",
  "66.1723 and 3.961607, because take is undiscounted by definition and payback is always discounted.",
  "Whichever is printed first, since the engine orders each pair by the convention of the run."],
 "The other two are the same readings with a clock, and none of the four can be read until its convention is stated.")

q(2,
 "The tier can say that AKATA pays back in 2032, costs 40.006602 USD per boe and hands the government 66.1723 percent. What can it not say?",
 "Whether 117362408.71 arriving when it does was worth the 255000000.00 spent in 2029 and 2030.",
 ["Whether the field was profitable, since profit needs the tax view and the tier reads only the cash view.",
  "What the government collected, because take is stated over value rather than as a sum.",
  "When the money came back, because payback is a year and not a date."],
 "The Associate ledger stops at a running sum with no clock, and whether AKATA is a good investment is a question that needs one.")

q(0,
 "AKATA's field ends when its data ends in 2035, and a year whose revenue no longer covered its opex would still be in the ledger. What decides that?",
 "The economic limit is off by default, so a losing tail is kept unless somebody turns it on.",
 ["The JV regime, which has no concept of a tail and so cannot trim one.",
  "The depreciation schedule, which keeps a year alive until its tenth has been claimed.",
  "The price escalator, which lifts revenue every year so that no tail ever fails."],
 "A default nobody set decides the shape of the ledger; the limit test, abandonment and the PIA edges are the Expert tier, and each changes a row before it changes a total.")

q(1,
 "Work the hand-derived 2030 row: revenue 100000000.00 USD, royalty at 20 percent, opex 10000000.00, depreciation 5000000.00, tax at 50 percent, capex 50000000.00, net -12500000.00. Which of the four checks can that one row settle on its own?",
 "Tax is not zero in a year that spent capex: 32500000.00 beside 50000000.00.",
 ["The last cumulative equals the total, since -12500000.00 sits in both.",
  "The take sits between the royalty rate and 100 percent, because the row's royalty and tax are both printed.",
  "The depreciation column sums to no more than the capex, because 5000000.00 is below 50000000.00."],
 "The other three need the whole ledger: the 2031 row adds another 5000000.00 of depreciation, the cumulative closes at 25000000.00 and the take of 80.7692 is a ratio of totals.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/beginner/ec1b_m06.json', expect_n=15)
finish()
