import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Professional m04, Default Cover and Interest.
# Every figure is quoted from digest.txt, where the engine returned it on the
# Ekene default fixture or a stated golden input. Default interest is always
# quoted with its rate, method, day basis and grace. The cover and the grace
# are keyed only as the engine's stated readings. No capstone name, term,
# series or value appears.

D = "PB's Ekene default (synthetic): PB pays 250000.000000 of its 2250000.000000 share of the 12000000.000000 call due 2027-03-01"

q(1, "PB leaves 2000000.000000 of its Ekene cash call unpaid from 2027-03-01 until 2027-04-15, and NOC is carried. Which parties advance the shortfall, as the engine states its cover?",
 "EKO 1230769.230769 and PA 769230.769231, in proportion to their paying interests among the non-defaulting parties",
 ["EKO, PA and NOC in proportion to their participating interests of 40, 25 and 20 percent, NOC included as a party to the venture",
  "EKO alone, as operator, which advances every unpaid amount and recovers it from PB with the default interest",
  "EKO 1000000.000000 and PA 1000000.000000, the two paying parties sharing the unpaid amount equally"],
 "The engine's stated cover reads \"the non-defaulting parties advance the unpaid amounts in proportion to their paying interests among themselves (the parties that pay cost; a carried party pays none)\", and it returns EKO 1230769.230769 and PA 769230.769231, 61.538462 and 38.461538 percent of the cover. This is the engine's stated reading of the cover: NOC, carried, pays no cost and covers none. The operator does not cover alone while another paying party is not in default.")

q(3, f"{D}, cures on 2027-04-15, and the contract states default interest at 8.250000 percent a year, simple, on a 360-day basis with a grace of 0 hours. What default interest does the engine return?",
 "20625.000000, on 45 days",
 ["20342.465753, the same 45 days on a 365-day year, the calendar the engine counts days on",
  "20210.781250, the default interest compounded monthly as the Kenya model prints it",
  "55916.666667, counted to 2027-07-01 as though the default were still open at the close"],
 "The engine's reason reads \"PB: share of the call 2250000, paid 250000, unpaid 2000000; interest 2000000 x 8.25% x 45 days / 360 = 20625 (from 2027-03-01 to the cure on 2027-04-15, the last date excluded)\". The day basis is a stated term: 20342.465753 is the same default on a 365-day basis, which the contract here does not state. 20210.781250 needs the method \"monthly-compound\". 55916.666667 belongs to the uncured case at 2027-07-01.")

q(0, "How does the engine count the days of default interest between the due date 2027-03-01 and a cure on 2027-04-15?",
 "From and including the due date to, but excluding, the cure date: 45 days",
 ["From the day after the due date to and including the cure date, the way a loan accrues from its drawdown",
  "Whole months only, the part-month ignored",
  "From the end of the stated grace to the cure date, since default interest cannot start inside a grace"],
 "The Norwegian Accounting Agreement Art. 1.2.2 prints \"Interest is due for the period starting on and including the due date of payment and ending on, but excluding, the value date for payment.\", and the engine's basis says the same: \"from and including the due date to, but excluding, the cure date (or asOf)\"; the table prints 45 days for this default. Whole months enter only the monthly-compound method, and on a default cured after the grace the engine runs default interest from the due date.")

q(2, "PB's Ekene shortfall of 2000000.000000, open from 2027-03-01 to 2027-04-15, is priced at 8.250000 percent, simple, with a 0-hour grace, but on a 365-day basis. What comes back?",
 "20342.465753 for the same 45 days",
 ["20625.000000, since the day basis only changes the count of days and 45 days is 45 days on either",
  "A refusal: the engine accepts a 360-day basis only, as the Norwegian agreement prints",
  "20625.000000 times 365 / 360, the 360-day figure scaled up to a calendar year"],
 "The course prints the stated probe: \"The same Ekene default on a 365-day basis ... gives 20342.465753 for the same 45 days, against 20625.000000 on the 360-day basis the fixture states\". Dividing by 365 gives the smaller figure. The engine accepts 365 or 360 and refuses anything else (\"interest.dayBasis must be 365 or 360; got 366\"); scaling the 360-day figure up would move it the wrong way.")

q(3, "The golden input default-ekene-monthly-compound-kenya states PB's Ekene default (unpaid 2000000.000000 from 2027-03-01, cured 2027-04-15) at 8.250000 percent, monthly-compound, 360-day basis, grace 72 hours. What does the engine return?",
 "20210.781250: one whole month compounded and 14 days simple",
 ["20625.000000, as with the simple method",
  "0.000000, the grace cancelling it",
  "20342.465753, on a calendar year"],
 "The engine's reason prints the formula: \"interest 2000000 x ((1 + 8.25% / 12)^1 x (1 + 8.25% x 14 days / 360) - 1), 1 whole month and 14 days = 20210.78\", with the field 20210.781250. On the same default the simple method gives 20625.000000. The grace of 72 hours is exceeded, so default interest runs from the due date, as the engine states the Kenya clause.")

q(1, "Seventy-two hours of grace are written into a contract (default-grace-last-hour: 8.25 percent simple, 360 days). The late partner settles on 2027-03-04, exactly three days after the due date. What does the engine charge?",
 "No default interest: 3 days (72 hours) are within the stated grace",
 ["1375.000000 on 3 days, since a grace only postpones the start of default interest and never cancels it",
  "1833.333333 on 4 days, the cure day counted",
  "0.000000 for three days, then default interest from the cure date on the rest of the month"],
 "The engine's reason reads \"PB: share of the call 2250000, paid 250000, unpaid 2000000; no interest: 3 days (72 hours, from 2027-03-01 to the cure on 2027-03-04, the last date excluded) are within the stated grace of 72 hours\". Cured exactly at the grace is inside it, which is the boundary, and the engine's stated grace charges nothing within it. 1375.000000 is the 3-day figure of the 71.5-hour grace, which is exceeded.")

q(2, "On default-grace-exceeded (8.25 percent simple, 360 days, a grace of 72 hours) the late partner pays on 2027-03-05, four days after the due date. Reading the grace as the engine states it, what is charged?",
 "1833.333333 on 4 days, with default interest running from the due date",
 ["Default interest on the one day past the grace alone, as it starts only when the grace ends",
  "0.000000, the grace read as three whole days",
  "1375.000000 on 3 days"],
 "The engine's stated grace reads \"a default cured within it carries no interest; one cured later carries interest from the due date, as the Kenya Model PSC 2015 Participation Agreement Art. 6.7 prints (72 hours)\". Cured after 4 days (96 hours), default interest runs over all 4 days: \"interest 2000000 x 8.25% x 4 days / 360 = 1833.33\". This is the engine's stated reading of the Kenya clause, and the course grades no figure that depends on it.")

q(0, "Suppose a contract's grace were 71.5 hours at 8.25 percent simple over 360 days (default-grace-fractional-hours) and payment lands on 2027-03-04, seventy-two hours after the due date. What figure comes back?",
 "1375.000000 on 3 days, the 71.5-hour grace being exceeded",
 ["0.000000, as 71.5 hours rounds to three days and the cure falls inside it",
  "A refusal: whole hours only",
  "1833.333333, counting the half-hour past the grace as a whole further day"],
 "Seventy-two hours have passed, which is more than 71.5, so the grace is exceeded, and as the engine states its grace, default interest runs from the due date over all 3 days: 1375.000000. Hours are compared as stated; the engine rounds no grace to whole days, and a fractional grace is a valid input.")

q(3, "A learner types interestMethod \"compound\" into the recovery calculator's box for the Ekene default, a word the method control does not offer. What does the engine return?",
 "Refused by name: the method takes only the words \"simple\" and \"monthly-compound\"",
 ["20210.781250, reading \"compound\" as monthly compounding, the only compounding the engine computes",
  "Daily compounding on the stated day basis",
  "20625.000000, with the unknown method ignored and simple default interest applied in its place"],
 "The engine refuses the word it does not accept, naming the field: interest.interestMethod must be one of \"simple\", \"monthly-compound\"; got \"compound\". The method is a stated term with no default: \"simple\" and \"monthly-compound\" are the two it computes, and it maps no other word onto either.")

q(1, "A contract gives no grace at all, and the learner leaves graceHours out of the default interest terms. What does the engine return?",
 "A refusal: graceHours must be stated, 0 when the contract gives no grace, since the engine holds no default",
 ["The Kenya model's 72 hours, the only grace a public text this course reads prints",
  "A grace of 0 hours, filled in by the engine and reported in its basis",
  "The default interest with no grace test at all, since a missing grace means none applies"],
 "The engine's message reads \"interest.graceHours must be a finite number of hours at or above 0, stated (0 when the contract gives no grace; the engine holds no default); got nothing\". A contract with no grace is stated as 0. The Kenya figure is the model's, and the engine takes none of it as a fallback.")

q(0, "Suppose PB is recorded as having paid 2250000.000000, its full share of the Ekene call, while still listed as a defaulter. What happens?",
 "A refusal naming defaulters[0].paid: a party that paid its share is not in default",
 ["A default of 0.000000 unpaid, with 0.000000 of default interest and no consequence triggered",
  "A default covered in full by EKO and PA, since PB is still named among the defaulters",
  "PB's default interest on the whole 2250000.000000, the paid amount read as the amount outstanding"],
 "The engine's message reads \"defaulters[0].paid must be below the party's share of the call 2250000 (a party that paid its share is not in default); got 2250000\". Paid equal to the share is the boundary, and it is refused; the engine does not return a zero default.")

q(2, "The golden input default-two-defaulters has PB pay 0.000000 of its 2250000.000000 share and PA pay 750000.000000 of its 3750000.000000 share of a call due 2027-03-01. Who covers the 5250000 unpaid, as the engine states its cover?",
 "EKO alone, 5250000.000000, as the only non-defaulting party with a paying interest",
 ["EKO and NOC, in proportion to their participating interests of 40 and 20 percent",
  "EKO for its own share and PB and PA for each other, pro rata to their paying interests",
  "Nobody: with two defaulters the engine refuses the call as leaving too few paying parties"],
 "The engine returns EKO covering 5250000.000000 (100.000000 percent): \"the unpaid 5250000 is advanced by EKO 5250000, in proportion to their paying interests among the non-defaulting parties\". NOC is carried and pays none. A call is refused only when no non-defaulting party with a paying interest above 0 is left.")

q(3, "A learner names EKO, PA and PB as defaulters on the Ekene call. What does the engine return?",
 "A refusal: defaulters must be leaving at least one non-defaulting party with a paying interest above 0",
 ["A cover by NOC of the whole call, NOC being the one party still not in default",
  "Three defaults with no cover, each accruing default interest and reported with its consequences",
  "A cover split among the three defaulters pro rata, as each advances the others' unpaid amounts"],
 "The engine's message reads: defaulters must be leaving at least one non-defaulting party with a paying interest above 0; got [\"EKO\",\"PA\",\"PB\"]. NOC's paying interest is 0.000000 under the carry, so it cannot cover, and a defaulter never covers another.")

q(0, "Suppose PB, in default on the Ekene call due 2027-03-01, pays up on 2027-04-15. Its contract states suspension after 5 working-days from 2027-03-01 and forfeiture after 3 months from 2027-03-10. Which consequences does the engine report as triggered?",
 "Suspension triggered after 2027-03-08; forfeiture, due after 2027-06-10, left untriggered",
 ["Neither triggered, since a default cured before the forfeiture date clears every consequence",
  "Both triggered, since both run from dates earlier than the cure on 2027-04-15",
  "Suspension triggered five calendar days on, with forfeiture triggered too"],
 "The engine reads \"each applies when the default is open after the whole trigger date; working days are Monday to Friday less the stated holidays; months keep the day of the month\". Its reasons: suspension \"starts after 5 working days from 2027-03-01, that is after 2027-03-08: triggered\", and forfeiture \"arises after 3 months from 2027-03-10, that is after 2027-06-10: not triggered, the default being cured on 2027-04-15\". The engine reports each consequence only as the contract states it.")

q(1, "On default-ekene-uncured PB's default (8.250000 percent, simple, 360-day basis, grace 0 hours) is still open at 2027-07-01, after the forfeiture trigger. What does the engine report if PB's assignment is demanded?",
 "Participating interests of EKO 47.058824, PA 29.411765 and NOC 23.529412, the compensation not computed",
 ["EKO 61.538462 and PA 38.461538, the assigned participating interest following the cover by paying interest",
  "The compensation for PB's share at its book value, computed by the engine, with PB's participating interest shared pro rata among the others",
  "A forfeiture to EKO alone as operator, PB's 15 points moving whole to the party that advanced the larger part of its cover"],
 "The engine's reason reads \"if the assignment of PB is demanded, the interest is apportioned pro rata: EKO 47.05882352941177%, PA 29.41176470588235%, NOC 23.529411764705884%; the compensation (at most the book value less unpaid contributions) is not computed\". The assigned participating interest is pro rata to the others' participating interests, NOC included; the compensation is reported only.")

emit(Q, '/root/cat-wip-joa/banks/ec9i_m04.json', expect_n=15)
finish()
