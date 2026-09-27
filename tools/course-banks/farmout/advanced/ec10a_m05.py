import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Expert m05, Readings and Source Quirks. Every key rests on a line the
# digest prints (the four readings in the engine's own bases, the texts'
# quirks as the sources print them, the boundary table) or on the engine's
# consentFee and developmentCarry returns on golden inputs (fee-ekene,
# fee-day-90, fee-day-210, fee-day-211, devcarry-ekene-simple-ot18360,
# deal-psu-eme801). No key presents a reading as the law. No Penn State
# sentence is quoted: its figures are cited as figures.
# scratch/bank-advanced/witness.mjs recomputes each engine figure.

K = [1, 3, 2, 0, 2, 1, 3, 0, 3, 2, 0, 1, 0, 2, 3]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The engine states that the success-case value is at the valuation date; well costs, bonus, reimbursement and fees fall at the valuation date, undiscounted. Where does that reading act?",
 "On every EMV of the deal view, whose positions set those costs beside the discounted value",
 ["On the consent fee alone, whose day count starts on the date of the valuation",
  "On the risk view's draws alone, whose seed is fixed at the valuation date",
  "Nowhere a figure depends on it, since every cost is first discounted to the base year by the canonical npv"],
 "The course says the valuation timing acts on every EMV of the deal: a deal whose well costs, bonus, reimbursement and fees fell a year after the valuation date would discount them at the success-case rate and give different EMVs. The fee days count from the notification, the draws depend on the seed, and the costs are undiscounted by this very reading.")

# 2
x("fee-ekene is notified on 2027-05-03 and paid on 2027-07-30. How many days does the engine count, and what status does it return?",
 "88 days, on-time",
 ["91 days, within-grace, the notification day and the payment day both counted",
  "88 days, within-grace, since the payment falls in the third month",
  "90 days, on-time, rounded up to the regulation's own period"],
 "The engine counts from the notification date to the payment date, the notification day not counted: 88 days, and its reason reads paid 88 days after the notification: within the 90 days of reg. 19(7) (engine). The engine counts neither the notification day nor any extra day; it rounds nothing, and 88 is inside the 90 days.")

# 3
x("Reading two names an alternative day count for reg. 19(7): counting the notification day as well. On the golden case fee-day-90, which figure would that alternative move?",
 "The status: the payment the engine counts as day 90, on time, would fall into the grace days",
 ["The fee: the seven per cent would be charged on the value of the transaction plus one day",
  "The surcharge: 0.01 percent of the fee would be charged for the notification day itself",
  "Nothing: the engine's count and the alternative agree on every day the table probes, from day 90 to day 211"],
 "The course states it: counting that day as well would move a payment on day 90 into the grace days. The reading acts only at the day boundaries of the payment rules. The fee is seven per cent of the stated value whatever the dates, and no surcharge runs inside the 90 days or the 30 days of grace.")

# 4
x("On fee-day-210 the payment comes 90 days after the 90 + 30 days. How does the engine read reg. 19(9)'s surcharge for 90 days failing which the consent is deemed withdrawn?",
 "It charges the ninetieth surcharge day, 3528.000000 on the 392000.000000 fee, and deems the consent withdrawn from day 211",
 ["It deems the consent withdrawn on the ninetieth surcharge day itself, so day 210 returns no total paid at all",
  "It charges 90 days at 39.200000 each and keeps the consent standing on every day after, with the surcharge still running",
  "It refuses payment.paidOn for any date after day 120, since the regulation's grace days have then run out"],
 "The engine charges 0.01 percent of the fee a day straight line: 90 days cost 3528.000000 and the consent stands on day 210; on day 211 it returns consent-deemed-withdrawn and no total paid (engine). Withdrawing on the ninetieth day is the other reading, which the course names; the engine refuses no late date, since a withdrawn consent is a result.")

# 5
x("Reading four names the other order a simple-interest recovery could follow, principal first. What does the course say that order would do, and when does the reading act at all?",
 "Leave more principal outstanding to earn simple interest; it acts only under uplift type simple",
 ["Leave the ledger as it is, since accrued simple interest earns none under either order of payment",
  "Lower every year's uplift, whatever uplift type the carry states in its terms",
  "Raise the uplift only under the compound form, where it runs on the whole balance"],
 "The course: paying principal first would leave more principal outstanding to earn interest, and the reading acts only when a carry states uplift type simple. Simple interest runs on the principal alone, so the order moves the ledger; under the compound form the uplift is charged on the whole opening balance, and the order of payment has nothing to act on.")

# 6
x("Which of these does the course treat as a stated input with its source, and no reading at all?",
 "The value of the transaction on which the consent fee is charged",
 ["The day count from notification to payment",
  "The ninetieth surcharge day of reg. 19(9) and the day of withdrawal",
  "The valuation timing of well costs, bonus, reimbursement and fees"],
 "The course separates it: the value of the transaction is a stated input (the sum payable to the Assignor stated in the application or contract, or an amount the Commission determines); it is no reading. The engine takes the amount and its source from the caller and charges the gazetted rates on it. The other three are readings the engine states in its bases.")

# 7
x("The Penn State EME 801, Lesson 6 page labels its payoff table in two ways. How does the course handle that?",
 "It cites the page and its printed figures and calls the table by its first label, Table 6.1",
 ["It treats Table 6.1 and Table 10.1 as two separate tables and checks the engine against each one in turn",
  "It quotes the page's own sentence that explains the second label, with the page's citation",
  "It calls the table Table 10.1, the label the page uses where it computes the EMVs"],
 "The page labels the table as Table 6.1 where it first prints it and refers to it as Table 10.1 when it computes the EMVs and the value at risk from the same figures. The course cites the page and its printed figures and uses the first label. One table carries both labels, and no sentence of the page is quoted anywhere, because its licence is non-commercial and the course is sold.")

# 8
x("The engine's farm out EMV on deal-psu-eme801 prints as 17500.000000, and the page prints 17500.000000. What does the course claim about the two?",
 "The check passes within 0.000001; the double carries float residue, so no equality is keyed",
 ["Equal, since the engine and the page both print the same six decimals",
  "Different, by the rounding the page applies to the nearest whole dollar",
  "They are equal to the last binary digit of the double the engine holds"],
 "The course: the engine's farm out EMV prints as 17500.000000 at six decimals; the double it holds carries float residue in its last binary digits, and the check passes within 0.000001. Printed alike is not equal, so the course keys the check within its stated bound and claims no equality.")

# 9
x("The arrangement of regulations at the front of the Assignment of Interests Regulations, 2024 lists 22. General provisions 23. Revocation 24. Interpretation 25. Citation. How does the body number its citation provision?",
 "26",
 ["25",
  "24",
  "23"],
 "The body prints regulation 23 as guidelines and numbers the citation 26 (AOI Regulations 2024 reg. 26 (the citation, as the body numbers it)). A citation of reg. 25 follows the arrangement, and the body prints no regulation of that number. 24 is Interpretation in both; 23 is Revocation in the arrangement and guidelines in the body.")

# 10
x("How does the gazette cover of S.I. No. 67 of 2024 list the instrument, and which name does the course use?",
 "The cover says Nigeria Upstream Petroleum (Assignment of Interest) Regulations, 2024; the course uses the citation's name",
 ["The cover and the citation both say Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024",
  "The cover says Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024; the course uses a shorter name",
  "The cover names the instrument by its number alone, S.I. No. 67, and the course takes its name from reg. 1"],
 "The course quotes the cover as 67 Nigeria Upstream Petroleum (Assignment of Interest) Regulations, 2024, a shorter title, while the citation names it the Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024, the name this course uses. The course takes the name from the citation provision, which the body numbers 26.")

# 11
x("Reg. 19(3) and reg. 24 of the 2024 Regulations both define the value of the transaction. How do the two definitions differ?",
 "Reg. 19(3) names two sources for the amount; reg. 24 names the Commission's determination alone",
 ["Reg. 19(3) names the Commission alone; reg. 24 adds the amount stated in the contract as a second source",
  "Reg. 19(3) sets the fee at seven per cent; reg. 24 sets it at two per cent for every assignment",
  "They agree word for word, and the course quotes them twice because the body prints them twice"],
 "Reg. 19(3): the amount payable to the assignor stated in the application or contract, or an amount the Commission prescribes. Reg. 24: the amount determined by the Commission to be the value receivable by the Assignor. The engine does not choose between them; it takes the amount and its source as stated inputs. The seven per cent is reg. 19(2), and the two per cent processing fee applies to an intra group transfer.")

# 12
x("The engine says farmor and farminee. Which word does the Petroleum Industry Act 2021 print for the incoming party in s.94(5)?",
 "farmee",
 ["farminee",
  "Farmer In",
  "assignee"],
 "The Act says farmee (PIA s.94(5)). HMRC's manual says Farmer Out and Farmer In (OT30020) and, on another page, the increasing interest party, farmer-in or farmee (OT18320). farminee is the engine's word, and each text's own word is quoted as it prints it.")

# 13
x("Why does the course cite the Penn State EME 801 page for its figures and quote none of its sentences?",
 "Its licence, CC BY-NC-SA 4.0, is non-commercial and this course is sold",
 ["Its figures are rounded, so only the engine's six-decimal figures can be quoted",
  "It is a licensed model agreement, taught by concept only under the regulatory rule",
  "Its text is United Kingdom tax guidance, quoted only for concepts under OGL v3.0"],
 "The course's source table says numbers only: the licence is non-commercial and this course is sold, so no sentence of it is quoted. It is a teaching page and no model agreement; the Open Government Licence text is HMRC's manual. The engine reproduces the page's printed EMVs, so rounding is no obstacle.")

# 14
x("The validation record says no public text prints a farm-in schedule or a break-even promote. Where do those figures of the course come from?",
 "The stated deal arithmetic, run by the engine on stated terms",
 ["A licensed model farm-out agreement, taught by concept and computed by the engine",
  "The Penn State EME 801 problem, whose break-even promote the page prints",
  "The HMRC manual's worked farm-in examples"],
 "Its own words: No public text prints a farm-in schedule or a break-even promote: those goldens come from the stated deal arithmetic in the oracle. The course runs that arithmetic through the engine. The one published worked figure is the Penn State problem, whose page prints neither break-even; licensed forms are never a source, and the HMRC pages are quoted for concepts.")

# 15
x("Which capstone fields of the course depend on one of the four readings the engine states?",
 "None: every field is the same number under each reading and under its named alternative",
 ["The fee fields alone, since the day count decides whether a surcharge applies at all to the payment",
  "The development carry balance, since the simple uplift pays accrued interest first in every year",
  "Every EMV field, since the valuation timing places the costs at the valuation date"],
 "The course is explicit: no graded figure depends on a reading the engine states, and every capstone field is bit-identical under each reading and under the alternative named beside it. Each reading is taught as the engine's stated choice beside the text it reads.")

emit(Q, '/root/cat-wip-farmout/banks/ec10a_m05.json', expect_n=15)
finish()
