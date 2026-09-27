import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Expert m04, Reference Texts and Their Quirks. Keys rest on the digest's
# sources table, its verbatim quotations, the three published PSC checks run
# through the engine (psc-wb-bn8-2007, psc-fari-table-12), the carry payout
# reason, OpenOil's printed error keyed as the source's error, and the
# boundary probes, each recomputed by scratch/bank-advanced/witness.mjs.
# Licensed texts are named and never quoted. No capstone figure appears here.

K = [2, 3, 1, 0, 3, 0, 2, 1, 1, 3, 0, 2, 3, 1, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("How does this course handle the AIPN model joint operating agreement, the COPAS accounting procedures and the AAPL forms?",
 "It teaches their ideas by concept only, since all three are sold under licence, and quotes none of their words",
 ["It quotes short clauses from each with a citation, as it does for the Petroleum Industry Act 2021",
  "It quotes them only where a public text is silent, such as the premium multiple for recovery from production",
  "It reads their figures into the engine as stated inputs, citing the edition and the date each was read"],
 "The sources section says licensed model contracts and accounting procedures are taught by concept only and never quoted; every quoted clause comes from a public text such as the Norwegian agreement or the PIA 2021. The premium multiple is a stated input of each call, and the engine holds no figure from any licensed form.")

# 2
x("The Kenya Model Production Sharing Contract 2015, Participation Agreement Art. 6.7 stops at LIBOR plus, with the margin left blank. How does the engine take the rate of default interest?",
 "As a required input, interest.annualRatePct, the whole rate the contract states",
 ["As LIBOR on the due date plus three percentage points, the margin the Norwegian text prints",
  "As LIBOR alone, since the model leaves the margin to be agreed at zero",
  "As a margin over a reference rate the engine reads for the due date"],
 "The engine takes the rate as a required input with no default, and a call without it is refused: interest.annualRatePct must be a finite number at or above 0; got nothing. The Norwegian three points are that text's figure; the engine reads no reference rate and supplies no margin of its own.")

# 3
x("Norway JOA Art. 9.2, in the unofficial English translation, reads that a defaulting party \"looses his right to vote\". What does the course do with that spelling?",
 "Quotes it exactly as printed and paraphrases the clause as the loss of the vote",
 ["Corrects it to loses inside the quotation, since the translation is unofficial anyway",
  "Drops the article from the course, as a misprinted clause cannot be cited as the text's",
  "Quotes the Kenya clause in its place, since both texts take away the defaulter's vote"],
 "The course quotes the translation exactly as printed and paraphrases it as the loss of the vote; it corrects nothing inside a quotation. The article is still quoted and cited, and the Kenya Art. 6.8 is a different text with its own five-day rule.")

# 4
x("World Bank Petroleum Sector Briefing Note No. 8 (November 2007) prints that the contractor retains US$43 and the government takes $57. On the note's own terms the engine returns 43.200000 and 56.800000. How does the course read the difference?",
 "The note rounds its totals to whole dollars: the engine's figures round to 43 and 57",
 ["The engine errs by a fifth of a dollar, since the note's figures are published and checked",
  "The note taxes a different base from the engine, so the two sets of totals cannot be compared",
  "The note makes an arithmetic error of the same kind as the OpenOil book's"],
 "The course runs psc-wb-bn8-2007 and prints 43.200000 and 56.800000 beside the printed 43 and 57, which they round to. The note's own income tax line is printed as 7.8, the engine's 7.800000, so nothing disagrees; OpenOil's 11.75 is a wrong product, a different kind of quirk.")

# 5
x("On the World Bank two-barrel example (gross 100.000000, costs 25.000000, royalty 10.000000 percent, limit 60.000000 percent of gross, contractor share 40.000000 percent, tax 30.000000 percent), the taxable income is 26. Why does that figure equal the contractor's profit oil here?",
 "The costs are recovered in full, so no cost is left over for tax to deduct",
 ["The limit of 60.000000 percent binds, so profit oil is taxed in its place",
  "Royalty is paid first at 10.000000 percent, which lowers the taxable figure",
  "The note taxes gross revenue, and 26 is 26 percent of the 100 gross"],
 "The course says the taxable income of 26 is the contractor's profit oil here, because the costs are recovered in full: 25.000000 recovered under a limit of 60.000000. The limit does not bind in this example, royalty is a separate first line, and 26 is 40 percent of the profit oil of 65.")

# 6
x("IMF FARI TNM/16/01 (February 2016) prints Tables 12 and 13 in whole USD million from an unrounded model. On psc-fari-table-12 the largest engine difference on the profit split is 1.560000. Why is that inside the agreement the course accepts?",
 "Table 13 prints the government share as a whole per cent, from which each stated contractor share is read",
 ["The engine rounds each year's profit split to whole millions before comparing it with the printed table",
  "The IMF model uses a different cost oil ceiling, so a gap of up to two million is expected in each year",
  "A cost line built from three printed whole numbers carries up to 1.5, and 1.560000 rounds down to it"],
 "The course bounds the profit split by 1.5 plus half a per cent of the year's profit petroleum, because Table 13 prints the government share as a whole per cent. The cost lines agree within 1.000000, inside the 1.5 they can carry; the engine rounds nothing in its fields, and the ceiling is the stated 80.000000 percent of after-royalty.")

# 7
x("OpenOil's Oil Contracts: How to read and understand them (version 1, November 2012, Creative Commons) prints \"This is calculated by: 0.25 x 49 = 11.75 million dollars\". How does the course key that figure?",
 "As the book's own arithmetic error: 0.25 x 49 is 12.25, and the printed 11.75 is wrong",
 ["As a rounded figure of the book's own, quoted as printed and within its printed precision",
  "As the engine's figure for state participation, which the course grades exactly as printed",
  "As a correct product on a share of benefits the book does not print in full"],
 "The course states the product of 0.25 and 49 is 12.25 and the printed 11.75 is an arithmetic error. It is no rounding: the book's own inputs give 12.25. The engine computes no OpenOil example, and nothing about its terms explains the printed figure.")

# 8
x("What does the engine's validation record do with the OpenOil book because of its printed 11.75?",
 "Keeps it out of every gate: no golden case is built from it and no engine figure is checked against it",
 ["Builds one golden case from it and marks the expected figure as 12.25 in place of the printed 11.75",
  "Uses it as the negative control of the published PSC checks, since a wrong figure there must fail the gate",
  "Cites it as the source of the state participation figures that the back-in view computes"],
 "The course says the validation record keeps the book out of every gate for that reason, and the course teaches the example as a printed arithmetic error. The back-in figures rest on PIA s.85(4) and stated cost lines, and the PSC checks run the World Bank and IMF examples only.")

# 9
x("The Ekene carry's payout reason reads \"2033: the balance 7267760.62 is recovered with 7267760.62 of the 9400000 available\". Which figure does a report carry into a further calculation?",
 "The field, 7267760.617882, since a reason rounds money to the cent",
 ["The reason's 7267760.62, since the engine prints it in the payout line as its answer",
  "The balance rounded to whole dollars, since a report quotes money in whole dollars",
  "The available 9400000, since the balance is recovered in full from what is available"],
 "The engine's convention rounds money in a reason to the cent, half away from zero, while every numeric field keeps full precision; the field behind the balance is 7267760.617882. A figure copied from a reason carries the rounding with it, and 9400000 is what was available, of which the balance took 7267760.617882.")

# 10
x("On cc-threshold-exactly, parties A, B and C state a no-call threshold of 500, a lag of 1 month and the negative call rule \"carry\". January's forecast is 500.000000 and February's 499.000000. Which months are called?",
 "January only: a forecast equal to the threshold is called, and one below it is not",
 ["February only: the engine calls a month whose forecast sits under the threshold",
  "Neither: a forecast must exceed the threshold strictly before a cash call is made",
  "Both: a threshold is applied to the year's total forecast and never month by month"],
 "The boundary probe prints called true for 500.000000 and false for 499.000000, with the reason 2027-02: no cash call: the forecast 499 is below the stated threshold 500; the actual is billed in arrears in the next month. The threshold acts month by month, and no single rule fixes every boundary the engine applies.")

# 11
x("On budget-item-at-tolerance an item approved at 50.000000 with an item tolerance of 10 percent is spent at 55.000000, and on budget-item-one-over at 55.500000. What does the engine return?",
 "55.000000 is inside its tolerance; the overrun of 5.500000 is beyond it",
 ["Both are beyond, since an overrun must stay strictly below the tolerance",
  "Both are inside, since the item limit of 55 is rounded before comparing",
  "55.000000 is beyond, and 55.500000 is flagged for the budget total alone"],
 "The engine's boundary reads: an overrun of exactly the tolerance is inside (\"may exceed ... by up to\"), following Norway JOA Art. 12.5, \"by up to 10%\". The engine's reason for 55.5 reads beyond the item tolerance of 10% (limit 55), and it rounds nothing before the comparison.")

# 12
x("On default-cured-on-trigger-day, PB's suspension is stated at 5 working-days from 2027-03-01, which the engine dates 2027-03-08, and PB cures on 2027-03-08. On default-cured-day-after-trigger PB cures on 2027-03-09. Where does the suspension apply?",
 "Only on the cure of 2027-03-09, since a consequence applies once the default is open after the whole trigger date",
 ["On both cures, since a default open on the trigger date itself has already triggered the suspension",
  "On neither cure, since a suspension needs PB to remain in default until the forfeiture trigger too",
  "Only on the cure of 2027-03-08, since the engine counts the trigger date as the first day of suspension"],
 "The engine's consequences basis reads: each applies when the default is open after the whole trigger date. The probe prints applies false for a cure on 2027-03-08 and true for 2027-03-09; the suspension and the forfeiture on 2027-06-10 are judged separately.")

# 13
x("Under basis \"pia-s85-4\", NOC backs in on backin-pia-at-60 to a target of exactly 60, and on backin-refuse-pia-61 to 61. What does the engine return?",
 "60 is accepted and 61 refused, the Act's 60 percent being a ceiling the engine applies",
 ["Both are refused, as the Act lets the Government participate only below 60 percent of the contract",
  "Both are accepted, as the Act's figure is a stated input that a call may raise at will",
  "60 is refused and 61 accepted, as the Act reads the 60 percent as a floor on entry"],
 "PIA s.85(4)(a) gives the right to participate up to 60%, so a target of exactly 60 is accepted (60.000000) and 61 is refused: targetPct must be at most 60 under basis \"pia-s85-4\" (the right to participate up to 60%, PIA s.85(4)(a)); got 61. The engine applies the Act's figure itself under the stated basis, so no call can raise it.")

# 14
x("On overhead-band-edge-exact, an operating base of exactly 1000.000000 meets a first band that ends at 1000 at 2.7 percent. What does the engine charge?",
 "27.000000, all in the first band, with the next band given 0.000000",
 ["27.000000 in the first band plus one unit charged at the next band's rate above the edge",
  "Nothing in the first band, since the whole base at the edge belongs to the next band",
  "A refusal, as a base on a band edge fits two bands at once and the engine will not choose"],
 "The boundary probe prints: a base exactly at a band's upper limit is charged in that band only; the next band gets 0.000000. The engine's reason reads operating: base 1000; 2.7% of 1000 = 27. No unit spills into the next band, and a base on an edge is no refusal.")

# 15
x("Norway Accounting Agreement Art. 1.2.2 runs late payment interest \"starting on and including the due date of payment and ending on, but excluding, the value date\". On default-cured-on-due-date PB cures on 2027-03-01, its due date. What does the engine charge?",
 "0 days and 0.000000 of default interest, the cure date being excluded",
 ["1 day of default interest, as the due date itself is included in the count",
  "2 days, both the due date and the cure date being counted as default days",
  "A refusal, as a default must run past its due date before it can be cured"],
 "The engine counts from and including the due date to, but excluding, the cure date, so a cure on the due date gives 0 days and 0.000000. Its reason reads interest 2000000 x 8.25% x 0 days / 360 = 0. A cure before the due date is refused, while one on it is accepted.")

emit(Q, '/root/cat-wip-joa/banks/ec9a_m04.json', expect_n=15)
finish()
