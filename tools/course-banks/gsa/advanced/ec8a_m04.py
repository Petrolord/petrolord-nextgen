import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Expert m04, Reference Texts and Their Quirks. Keys rest on the course's
# table of the model agreement's alternatives and what the engine computes,
# the recovery orders in the texts and the golden order cases, the printed
# figures against the engine's exact ones (printed alike, never keyed equal),
# the Btu and cubic foot constants and the boundary table. The Commonwealth
# model is quoted with its attribution; the AIPN model is never quoted.

K = [0, 2, 1, 3, 3, 1, 2, 0, 2, 0, 3, 1, 1, 3, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Why may this course quote the Commonwealth model gas sales agreement (2025) and quote nothing from the AIPN model gas sales agreement?",
 "The Commonwealth model is licensed under Creative Commons Attribution 4.0; the AIPN model is licensed and taught by concept only",
 ["The AIPN model predates 2021, and the course quotes only texts written after the Petroleum Industry Act 2021",
  "The Commonwealth model is Nigerian law",
  "Both may be quoted; one was chosen for brevity"],
 "The model agreement's front matter reads \"This work is licensed under Creative Commons Attribution 4.0 International.\", so it is quoted short and exact with its attribution. The AIPN model is a licensed text: the course teaches its ideas as concepts and quotes none of it. Neither the date of a text nor any claim that a model contract is law decides this.")

# 2
x("Where the Commonwealth model agreement (2025) prints [## INSERT] for the take-or-pay percentage, what does the engine do?",
 "It takes the percentage as a required input with no default",
 ["It uses 80 percent, the percentage stated in the Ekene power plant agreement, until the parties agree otherwise",
  "It uses 100 percent, so the take-or-pay quantity equals the Adjusted ACQ until a figure is typed in",
  "Leaves the quantity at 0.000000"],
 "Where the model prints [## INSERT] the engine takes the figure as a required input, and a call without it is refused by name. 80 percent is only what the power plant fixture states; the engine holds no default percentage; and a take-or-pay percentage of 0 is accepted only when a contract states it.")

# 3
x("The Commonwealth model agreement (2025) prints the Adjusted ACQ without and with an operational flexibility credit. Which does the engine compute?",
 "Alternative 2, the credit entering as permittedReduction",
 ["Alternative 1, with no flexibility modelled",
  "Both, returning two Adjusted ACQ figures in every contract year for the reader to choose between",
  "Neither: the caller types it"],
 "The engine computes Alternative 2, with the operational flexibility credit entering as permittedReduction, one of the reductions it subtracts from the ACQ. It returns one Adjusted ACQ per year, and it computes it from the stated ACQ and reductions (the year keys include acq, maintenance, forceMajeure, sellerShortfall and permittedReduction).")

# 4
x("Article 12.6 of the Commonwealth model agreement (2025) prints two forms of the Buyer's Deficiency Payment, BADQ x TOPP and (BADQ - CFCQ) x TOPP. Which does the engine follow?",
 "The second when carry-forward is stated, which is the first when it is not",
 ["The first always, any carry-forward credit being paid back to the buyer separately at the end of the year",
  "The second always, with the carry-forward credit quantity set to the whole surplus of earlier years",
  "Whichever gives the lower payment"],
 "The engine follows Alternative 2 when carry-forward is stated; with no carry-forward the credit is zero and it is Alternative 1. A credit reduces the deficiency paid and is never paid back as money; the credit is capped at the stated percentage of the year's deficiency (the export feed's 2029 credit is 3219250.000000 against 3913300.000000 available); and the engine chooses nothing to favour a party.")

# 5
x("Article 12.7.5 of the Commonwealth model agreement (2025) prints three ends of the Delivery Period. Which does the engine leave out?",
 "Alternative 3, extending the term",
 ["Alternative 2, the refund at the last take-or-pay price, which the engine reports without computing",
  "Alternative 1, forfeiture, since the engine refunds every make-up entry still open at the end",
  "None, since makeUp.endOfTerm accepts forfeit, refund and extend alike"],
 "The engine computes Alternatives 1 and 2, forfeit and refund, and does not model extending the term. The export feed computes a refund (3700831.335000 in 2036) and the power plant a forfeiture (252000.000000 in 2034), and a call stating extend is refused: \"makeUp.endOfTerm must be one of \"forfeit\", \"refund\"; got \"extend\"\".")

# 6
x("ESMAP Report 152/93 (1993, para 6.62) and Article 12.8 of the Commonwealth model agreement (2025) both cap carry-forward. What is the engine's capPct a percentage of?",
 "The year's deficiency, as in the model's Alternative 2",
 ["The annual quantity, as ESMAP describes the cap on the use of a carry-forward right in any year",
  "The surplus carried from the oldest year",
  "The ACQ of the year in which the surplus arose, fixed when the surplus is first carried forward"],
 "ESMAP describes a cap stated as a percentage of the annual quantity; the model's Alternative 2 caps the credit as a percentage of the year's deficiency, and the engine's capPct follows the model. On the export feed in 2029 the credit of 3219250.000000 is half of the deficiency of 6438500.000000.")

# 7
x("Which engine order computes the description in ESMAP Report 152/93 (1993) that \"make-up quantities are accounted for after the minimum-pay quantity for the year has been taken\" (para 6.59)?",
 "after-top-quantity, the take-or-pay quantity as the minimum",
 ["after-adjusted-acq, the reference text's order",
  "first",
  "fifo, the order the model agreement's Article 12.7 names for drawing the make-up aggregate"],
 "The engine's after-top-quantity takes make-up once the year's take-or-pay quantity is taken, ESMAP's minimum-pay order. after-adjusted-acq is the Commonwealth model's Article 12.7.1 order, and first is HMRC's make-up in priority. First in first out is how entries are drawn under any order; \"fifo\" as an order is refused by name.")

# 8
x("Golden cases run the same years under each order. In 2028 the buyer takes 1100.000000 against an Adjusted ACQ of 1000.000000 and a take-or-pay quantity of 800.000000, with 200.000000 of make-up open. How much make-up does after-adjusted-acq draw?",
 "100.000000, only the take above the Adjusted ACQ",
 ["200.000000, all of it, the take being 300.000000 above the take-or-pay quantity",
  "300.000000",
  "0.000000, make-up waiting for a year with no deficiency open"],
 "Under after-adjusted-acq only gas taken above the Adjusted ACQ is make-up: 1100.000000 - 1000.000000 = 100.000000, and the rest expires at the end of 2029. Drawing all 200.000000 is what after-top-quantity and first do on the same year; 300.000000 is more than is open; and 2028 has no deficiency of its own, so the make-up is drawn.")

# 9
x("Make-up taken in priority (the order first) meets a year whose whole take equals its take-or-pay quantity of 800.000000, while 200.000000 is still open from 2027. What happens that year?",
 "Make-up of 200.000000 drawn first, 600.000000 counted, a new deficiency of 200.000000",
 ["No make-up and no deficiency, the take equalling the take-or-pay quantity",
  "Make-up of 200.000000 drawn first and no deficiency, the make-up counting toward the year's quantity",
  "Nothing drawn, the right expiring because the year does not exceed the Adjusted ACQ"],
 "Taken first, make-up comes off the top: 200.000000 of the 800.000000 is make-up, 600.000000 counts against the take-or-pay quantity of 800.000000, and a new deficiency of 200.000000 is paid again. Make-up gas does not count toward the year's own quantity; the order first has no threshold; and expiry depends on the period alone.")

# 10
x("HMRC Oil Taxation Manual OT05402 (updated 19 December 2019) divides a swing of 150 by a take-or-pay level of 90 and prints 1.66. How does the course quote this beside the engine?",
 "1.666667 as the engine's and 1.66 as the manual's, the manual's being the exact quotient cut after two decimals",
 ["1.66 for both, since the engine rounds effective swing to the manual's two decimals before printing it",
  "1.500000, the swing factor, which the engine reports as the effective swing",
  "1.666667 for both, as a misprint"],
 "The engine returns 1.666667; the manual prints 1.66, the engine's figure cut after two decimals (1.660000). Printed alike is not equal, so the course quotes each as its own. The engine prints effective swing at six decimals like every ratio, 1.500000 is the swing factor before division by the take-or-pay fraction, and the course calls no source's printed figure a misprint.")

# 11
x("The engine's reason for the export feed's 2036 reads \"2036: the delivery period ends with make-up of 457950 unrecovered; the seller refunds 457950 x 8.0813 = 3700831.3350000004\". Which figure does a report reason with?",
 "The refund field at six decimals, 3700831.335000",
 ["The figure inside the reason, since it carries every digit the engine holds for the refund",
  "457950 x 8.0813 worked again by hand and rounded to two decimals, as a currency amount",
  "The reason's figure cut at four decimals under the model agreement's rounding rule for prices"],
 "A reason carries the shortest round-trip decimal of the double the engine holds; the course quotes it whole as the engine's words and reasons with the numeric field, 3700831.335000. Recomputing by hand adds a figure the engine never returned, and the four-decimal rule applies to contract prices only.")

# 12
x("Which Btu does the engine use, and how does its validation record read the model agreement's Btu?",
 "The International Table Btu, 1055.05585262 J; the model's Btu, at 59 F to 60 F, is about 1054.80 J",
 ["The model agreement's Btu of about 1054.80 J, since the engine follows the Commonwealth model throughout",
  "The 59 F Btu for gross heating values and the International Table Btu for net ones",
  "Whichever the caller states"],
 "The engine holds the International Table Btu, 1055.05585262 J, exact by definition (NIST SP 811, 2008 edition, Appendix B). The validation record reads the model agreement's Btu as defined at 59 F to 60 F, about 1054.80 J, 0.02% smaller. The engine does not switch Btu by heating value basis, and toEnergy accepts no key that would choose one.")

# 13
x("What does the engine hold for one cubic foot?",
 "Exactly 0.028316846592 m3, the cube of the international foot",
 ["A value that depends on the reference conditions a contract states for its volume",
  "Only a rounded factor, the exact one being left for the caller to state",
  "One factor read from the model agreement's definitions, beside its own Btu"],
 "UNITS.M3_PER_FT3 is 0.028316846592, (0.3048 m) cubed, exact. It is geometry, so it does not move with reference conditions; the engine states it exactly; and it comes from the definition of the foot, with no contract involved.")

# 14
x("A stated probe asks for a carry-forward credit exactly at the cap: 50 percent of a deficiency of 100.000000. What is applied?",
 "The full 50.000000, since the cap is inclusive",
 ["Nothing, a credit having to be strictly below its cap to be applied",
  "One unit less than the cap, the engine applying the cap as a strict bound on the credit",
  "The whole 100.000000, a credit at the cap lifting the cap for that contract year"],
 "The course's boundary table: a credit equal to the cap percent of the deficiency is applied in full (inclusive), and the probe applies 50.000000 against a deficiency of 100.000000. Boundaries are per rule: a deficiency and a seller shortfall need a strict gap and make-up a take strictly above its threshold, while the cap is inclusive. The cap never lifts.")

# 15
x("A make-up period of 2 contract years follows a deficiency in 2027. In which year can the buyer last take that make-up, and what is left in 2030?",
 "2029, the last year of its period; nothing is available in 2030",
 ["2028, the first year after it",
  "2030, a year of grace after the period ends",
  "2029, the rest carrying into 2030"],
 "A make-up period of N years after a deficiency year y runs to the end of year y + N inclusive: make-up is usable in 2029 and the rest expires at its end, so none is available in 2030 (the golden last-day case draws 100.000000 in 2029 and expires 100.000000 at its end). There is no grace year and nothing carries past expiry.")

emit(Q, '/root/cat-wip-gsa/banks/ec8a_m04.json', expect_n=15)
finish()
