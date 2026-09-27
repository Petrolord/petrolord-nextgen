import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Professional m06, Paying the Fee on Time.
# Every figure is quoted from digest.txt, where the engine returned it on the
# Ekene consent or a stated golden input (a PPL, a value of the transaction of
# 5600000.000000 stated as "contract-amount", intraGroup false, the gazetted
# basis), and every key was re-run through the vendored engine by the writer's
# witness. Every question states its value of the transaction and its dates.
# The day count and the ninetieth surcharge day are keyed only as the engine's
# stated readings, never as the law. No capstone name, term, series or value.

q(3, "Count the days on the Ekene consent itself: notification 2027-05-03, payment 2027-07-30, a PPL priced at the gazetted rates on 5600000.000000 (contract amount, intraGroup false). What count and status does the engine report?",
 "88 days, \"on-time\"",
 ["Eighty-nine days, \"on-time\", the notification day counted as the first",
  "88 days, \"within-grace\", as the 90 days run from the grant",
  "Three calendar months, \"on-time\", the rule being read in months"],
 "The engine's reason reads \"paid 88 days after the notification: within the 90 days of reg. 19(7)\". It counts from the notification date to the payment date, the notification day not counted, which is its stated reading of reg. 19(7). 88 is inside the 90 days, so the status is \"on-time\" and the total paid is the fee, 392000.000000.")

q(1, "Paying on the ninetieth day exactly: notice 2027-01-01, money in on 2027-04-01. Which status does the engine give this PPL fee (seven per cent of 5600000.000000, contract amount, intraGroup false)?",
 "90 days and \"on-time\": the last day of reg. 19(7)",
 ["90 days and \"within-grace\", the ninetieth day being the first of the further days",
  "91 days and \"within-grace\", day one counted",
  "Eighty-nine days, both ends left out"],
 "The engine's reason is \"paid 90 days after the notification: within the 90 days of reg. 19(7)\". Day 90 is on time, so the boundary is inclusive. Counting the notification day as well would make this payment day 91 and move it into the grace days; the engine states the count it uses in its basis and leaves the notification day out.")

q(2, "One day past the ninety: the gazetted PPL fee on 5600000.000000 (contract amount, outside any group), notified 2027-01-01, reaches the Commission's account on 2027-04-02. What is returned?",
 "91 days, \"within-grace\", no surcharge: 392000.000000 paid",
 ["91 days, \"surcharge\", with one surcharge day of 39.200000 charged for the day after the 90",
  "91 days, \"consent-deemed-withdrawn\", the 90 days of reg. 19(7) having run out",
  "91 days, \"on-time\""],
 "The engine's reason reads \"paid 91 days after the notification: inside the further 30 days of reg. 19(8); no surcharge\". Reg. 19(8) gives the assignor 30 days more, and the surcharge of reg. 19(9) starts only after them. The consent is withdrawn only after the surcharge days run out.")

q(0, "Where does a payment on 2027-05-01 sit, 120 days after a notice of 2027-01-01, for a gazetted PPL fee of 392000.000000 on a stated 5600000.000000?",
 "Still \"within-grace\", the last of the further 30 days, with no surcharge",
 ["In \"surcharge\", its first day costing 39.200000",
  "\"on-time\", since 120 days is four months",
  "\"within-grace\", with a surcharge of 39.200000"],
 "Day 120 is the last of the further 30 days of reg. 19(8), so the engine returns \"within-grace\" and 392000.000000 with no surcharge. The surcharge starts on day 121, where one day costs 39.200000, and a calendar reckoning in months plays no part in the count.")

q(2, "The assignor misses the grace days by exactly one: its PPL fee of 392000.000000 on 5600000.000000 (\"contract-amount\", intraGroup false) was notified 2027-01-01 and is paid 2027-05-02, day 121. Which surcharge and total are reported?",
 "1 surcharge day, 39.200000, a total of 392039.200000",
 ["Thirty-one surcharge days counted from day 90, a far larger surcharge",
  "One surcharge day at 0.01 percent of the value of the transaction",
  "No surcharge: day 121 is the last grace day"],
 "The engine's reason reads \"paid 121 days after the notification: 1 day after the 90 + 30 days; surcharge 0.01% of 392000 x 1 day = 39.2 (reg. 19(9), straight line)\". The surcharge runs only after the 90 + 30 days, and it is a percentage of the fee; the value of the transaction is no part of it.")

q(0, "Ninety days of surcharge: the gazetted PPL fee of 392000.000000 (value 5600000.000000 as contract amount, intraGroup false) is notified 2027-01-01 and settled 2027-07-30. Which figures does the engine report?",
 "90 surcharge days, a surcharge of 3528.000000 and a total of 395528.000000; the consent stands",
 ["The consent deemed withdrawn, the ninetieth surcharge day being the last before withdrawal",
  "90 surcharge days compounding daily, a total above 395528.000000",
  "Eighty-nine surcharge days, the ninetieth free"],
 "Day 210 is the ninetieth surcharge day: the engine returns 90 surcharge days, 3528.000000 and a total of 395528.000000. Its stated reading keeps the consent standing through that day and withdraws it from day 211, so the ninetieth day is charged in full.")

q(3, "The assignor finally pays on 2027-07-31, day 211 after a notification of 2027-01-01, long after every allowance has run (PPL, 5600000.000000 as \"contract-amount\", intraGroup false). What status is returned?",
 "\"consent-deemed-withdrawn\", with no total paid",
 ["A refusal: a payment after the surcharge days is not an accepted input and the engine names payment.paidOn",
  "Ninety-one surcharge days, the straight line running on past the ninetieth day and the consent standing",
  "\"surcharge\" with the surcharge held at 3528.000000, the most reg. 19(9) allows, and the consent standing"],
 "The engine's reason reads \"paid 211 days after the notification: more than 90 surcharge days after the 90 + 30 days; the consent is deemed withdrawn (reg. 19(9))\", and it returns no total paid. A consent deemed withdrawn is a result with a reason, which is no refusal: the dates are valid inputs.")

q(1, "Someone argues the ninety days should include the notification day. The engine counts 2027-01-01 to 2027-04-01 as 90 on a 392000.000000 fee (5600000.000000, contract amount). How does the course treat the engine's count?",
 "As the engine's stated reading of reg. 19(7): the notification day is not counted, and counting it would move this payment into the grace days",
 ["As the rule reg. 19(7) prints in its own words, which exclude the notification day from the ninety and so settle the count for every single payment",
  "As the Commission's published practice, which the engine reads from its guidelines",
  "As a calendar-month rule, three months from the notification"],
 "The engine's basis reads \"days from the notification of the consent to the payment: within 90 on time, 30 more of grace, then 0.01% of the fee a day straight line for up to 90 days, after which the consent is deemed withdrawn (reg. 19(7) to (9))\". The regulation says only \"within 90 days of notification\" (AOI Regulations 2024 reg. 19(7)), so the count is a choice the engine states and the course grades no figure on.")

q(0, "Reg. 19(9) runs the surcharge for 90 days before the consent is deemed withdrawn. The engine charges a payment on 2027-07-30 and withdraws from 2027-07-31 (notice 2027-01-01; a 392000.000000 fee on 5600000.000000). What is that line?",
 "The engine's stated reading of reg. 19(9); the other reading would withdraw the consent on the ninetieth day",
 ["The rule as reg. 19(9) states it, which names the ninety-first day as the day of withdrawal",
  "A tolerance of one day the engine adds to every day rule",
  "The Minister's deemed consent of PIA s.95(7)(b)"],
 "Reg. 19(9) imposes the surcharge \"for 90 days failing which the consent is deemed withdrawn\" (AOI Regulations 2024 reg. 19(9)). The engine charges the ninetieth surcharge day (fee-day-210) and deems the consent withdrawn from the ninety-first (fee-day-211); that is its reading, and the course keys it as nothing more. PIA s.95(7)(b) is about the Minister's silence on an application.")

q(3, "By a typing slip the payment date, 2027-01-09, lands a day before the notification date, 2027-01-10, on the gazetted PPL call for 5600000.000000 (\"contract-amount\", intraGroup false). How does the engine answer?",
 "payment.paidOn must be on or after the notification 2027-01-10; got \"2027-01-09\"",
 ["A result paid one day before the notification, \"on-time\" and in full, since any early payment meets reg. 19(7)",
  "A result of zero days, the payment moved to the notification date",
  "payment.notifiedOn must be on or before the payment 2027-01-09; got \"2027-01-10\", the earlier field named"],
 "The engine refuses the payment date by name, in its own words: \"payment.paidOn must be on or after the notification 2027-01-10; got \"2027-01-09\"\". The days run from the notification of the consent, so a payment before it is refused; the engine moves no date.")

q(1, "A notification date of 2027-02-30 is keyed in, with payment 2027-03-01, for the PPL fee on 5600000.000000 (contract amount). Which answer appears?",
 "payment.notifiedOn must be a real date 'YYYY-MM-DD'; got \"2027-02-30\"",
 ["A result counting from 2027-03-02, the overflow carried",
  "A result counting from 2027-02-28, with the change noted",
  "payment.paidOn must be on or after the notification 2027-02-30; got \"2027-03-01\""],
 "The engine refuses the notification date, in its own words: \"payment.notifiedOn must be a real date 'YYYY-MM-DD'; got \"2027-02-30\"\". There is no 30 February, and the engine rolls no date forward or back. It refuses the date before it compares the two dates.")

q(2, "Before the consent is even notified, a learner prices it with both date controls cleared: a PPL at the gazetted rates on 5600000.000000 (\"contract-amount\", intraGroup false), no notification and no payment date. What comes back?",
 "The fee of 392000.000000, and nothing on timing: payment none",
 ["A refusal: payment.notifiedOn must be a real date 'YYYY-MM-DD'; got nothing, the dates being required",
  "The fee with a status of \"on-time\", a payment with no dates being taken as made on the day of notification",
  "The fee with the full 90 days of surcharge added"],
 "On fee-no-payment the engine computes the fee, 392000.000000, and returns payment none: a call with no payment dates says nothing about timing. The dates are optional as a group; the panel removes the whole payment entry when both date controls are cleared, so no empty payment reaches the engine. It assumes no payment date and adds no surcharge.")

q(0, "Why does ninety days of lateness cost only 3528.000000 on the 392000.000000 fee (value 5600000.000000; notice 2027-01-01, payment 2027-07-30)?",
 "0.01 percent of the fee a day, straight line: 39.200000 a day for 90 days",
 ["0.01 percent of the value of the transaction a day for 90 days",
  "0.01 percent compounded daily on the fee and the surcharge",
  "0.01 percent a day counted from day 91"],
 "Reg. 19(9) charges 0.01 percent of the stipulated amount a day on a straight line, and the engine reads that amount as the fee: 39.200000 a day on 392000.000000, and 90 days make 3528.000000. Nothing compounds, the value of the transaction plays no part, and the count starts after the 90 + 30 days.")

q(2, "Under the basis \"stated\" a PEL call (value of the transaction 1, \"contract-amount\", rates stated) also carries payment dates of 2027-05-03 and 2027-07-30. What does the engine return?",
 "payment must be left out under basis \"stated\" (the payment timing is reg. 19(7) to (9)); got {\"notifiedOn\":\"2027-05-03\",\"paidOn\":\"2027-07-30\"}",
 ["A result paid 88 days after the notification, \"on-time\", the day rules of reg. 19(7) applied to the stated rates in exactly the way they apply to the gazetted ones",
  "A result with the dates ignored and noted in the basis, since the stated rates carry no gazetted timing",
  "intraGroup must be left out under basis \"stated\" (the stated rates apply); got {\"notifiedOn\":\"2027-05-03\",\"paidOn\":\"2027-07-30\"}"],
 "The engine's words: \"payment must be left out under basis \"stated\" (the payment timing is reg. 19(7) to (9)); got {\"notifiedOn\":\"2027-05-03\",\"paidOn\":\"2027-07-30\"}\". The day rules belong to the gazetted fee, so a stated-rate call carries no timing, and the engine drops no term silently. The intraGroup message names a different field.")

q(3, "EKO's transfer goes to a company in its own group, so intraGroup is true (PPL, 5600000.000000 as contract amount, gazetted basis), with the Ekene dates 2027-05-03 and 2027-07-30. What is paid, and when does it fall?",
 "112000.000000, paid on day 88 inside the ninety",
 ["No timing at all: an intra group transfer is outside the day rules of reg. 19(7) to (9)",
  "392000.000000, paid on day 88 as the full seven per cent of the value",
  "112000.000000, paid on day 88 in the grace days a group transfer is given"],
 "The engine's reasons for fee-intra-group end \"paid 88 days after the notification: within the 90 days of reg. 19(7)\", and the total paid is the fee, 112000.000000, the processing fee alone. The day rules apply to the whole fee the call returns, intra group or not.")

emit(Q, '/root/cat-wip-farmout/banks/ec10i_m06.json', expect_n=15)
finish()
