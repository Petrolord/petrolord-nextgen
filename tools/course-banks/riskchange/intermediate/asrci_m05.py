import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Professional m05, temporary and emergency change.
# Every expiry state, days-until, ratification due date and refusal is from
# digest Section 11, with the ESANMI rows m05 lessons quote from Section 12.
# Every dated state is true on the as-of date 2026-10-01 and says so.

q(1, "Screening and Review are stages before the facility. For a Temporary change in \"Review\" whose expiry was 2026-09-30, what does the engine print on 2026-10-01?",
 "\"No expiry\", because a change that is not in effect cannot expire.",
 ["\"Expired\", because the expiry date is already behind the as-of date on 2026-10-01.",
  "\"Expiring soon\", until the change goes into Implementation.",
  "\"Closed out\"."],
 "Only a change in effect can expire. A temporary change still in Screening or Review is not running anywhere, so its expiry date is a plan and it is not counted expired.")

q(3, "Which expiry state belongs to a finished temporary change in the Closed stage whose date lies behind the as-of date of 2026-10-01?",
 "\"Closed out\".",
 ["\"Expired\", because a closed change is in effect and its date has passed.",
  "\"No expiry\", because a closed change is terminal and no longer running.",
  "\"Permanent change\", because it stayed on the facility."],
 "The Closed stage is in effect and terminal. A closed temporary change reads \"Closed out\" and is not counted expired, so a change taken through to the Closed stage is not reported as expired for ever after.")

q(0, "ES-10 is a Temporary change in \"Screening\" with an expiry of 2026-09-01. What does it read on 2026-10-01, and is it counted expired?",
 "\"No expiry\", and it is not counted expired, because nothing went onto the facility.",
 ["\"Expired\", counted expired, because the date is behind 2026-10-01 and the change carries a Temporary type.",
  "\"Expired\", though left out of the expired count until the change reaches Implementation on the plant.",
  "\"Within expiry\", uncounted."],
 "The date passed while the change was still being screened. The ESANMI summary reads expired 1 on 2026-10-01, and that one is ES-03.")

q(2, "Which three expiry states come from the record and do not move with the as-of date?",
 "\"No expiry\", \"Permanent change\" and \"Closed out\".",
 ["\"Expired\", \"Expiring soon\" and \"Within expiry\".",
  "\"Permanent change\", \"Closed out\" and \"Expired\", since an expired change stays expired on every later date.",
  "\"No expiry\", \"Permanent change\" and \"Within expiry\", since a date far off is read as no date."],
 "\"Expired\", \"Expiring soon\" and \"Within expiry\" move with the date and appear only on a change in effect with a readable expiry. Quote those three with the date they are true on.")

q(1, "Counting inclusively, where does an expiry of 2026-10-15 fall for a Temporary change in \"Implementation\" read on 2026-10-01?",
 "\"Expiring soon\": 14 days away, and the lead of 14 days is counted inclusively.",
 ["\"Within expiry\": 14 days away, and \"Expiring soon\" starts below 14.",
  "\"Expiring soon\": 15 days away.",
  "\"Within expiry\": 15 days away."],
 "EXPIRY_LEAD_DAYS is 14, counted inclusively, so the fourteenth day is inside the lead. An expiry of 2026-10-16, 15 days away, reads \"Within expiry\" on the same date.")

q(3, "The expiry of a Temporary change in effect is 2026-10-16. Which expiry state does the engine give it on 2026-10-01?",
 "\"Within expiry\".",
 ["\"Expiring soon\", because 15 days is still inside a lead of 14 counted inclusively.",
  "\"Expiring soon\", because the expiry falls in the same calendar month.",
  "\"No expiry\", because an expiry outside the lead is not read."],
 "2026-10-16 is 15 days from 2026-10-01, one day past the lead. \"Counted inclusively\" takes in the fourteenth day and no more.")

q(2, "Due today: a temporary change on the plant expires on 2026-10-01 itself. Which state and days until does the engine print that day?",
 "\"Expiring soon\", at 0 days.",
 ["\"Expired\", at 0 days, because the expiry day has arrived.",
  "\"Expired\", at -1 days.",
  "\"Within expiry\", at 0 days."],
 "Only a negative count of days reads \"Expired\"; an expiry of 2026-09-30 is -1 and reads \"Expired\". A date equal to the as-of date has not passed.")

q(0, "An Emergency change in \"Approval\" has level 1 signed and level 2 pending, and nothing is rejected. A Permanent change has the same signatures. What does the gate into \"Implementation\" answer for each?",
 "It allows the Emergency change and refuses the Permanent one: Approval level 2 has not signed yet.",
 ["It refuses both: Approval level 2 has not signed yet.",
  "It allows both, because level 1 has signed on each.",
  "It allows the Permanent one only."],
 "The signatures are identical and only the type differs. An Emergency change goes in once its first level has signed and nobody has rejected it; a Permanent change needs every level.")

q(1, "Nothing has signed at level 1 on an Emergency change waiting in \"Approval\". Which sentence refuses it at the gate?",
 "It refuses: An emergency change can go in once approval level 1 has signed, with the rest ratified within 7 days. Level 1 has not signed yet.",
 ["It allows it, because the emergency route defers every signature until after the change goes in.",
  "It refuses: Approval levels 1 and 2 have not signed yet.",
  "It allows it and reads the ratification state as \"Awaiting ratification\" for 7 days."],
 "One signature is reduced authority; none is no authority. The refusal states the whole policy, decision Q9 under AS15: level 1 up front, the rest ratified within 7 days.")

q(3, "An Emergency change in \"Implementation\" with level 2 unsigned went in on 2026-09-24. What does it read on 2026-10-01?",
 "Due 2026-10-01, \"Awaiting ratification\".",
 ["Due 2026-09-30, \"Ratification overdue\", since 7 days have gone by.",
  "Due 2026-10-01, \"Ratification overdue\", because the due date has arrived.",
  "Due 2026-10-02, \"Awaiting ratification\", counted from the day after it went in."],
 "EMERGENCY_RATIFY_DAYS is 7, added to the actual implementation date. Day seven is still inside the window, because a due date equal to the as-of date has not passed.")

q(0, "Level 2 is still unsigned on an Emergency change implemented on 2026-09-23. Give its ratification due date and state on 2026-10-01.",
 "Due 2026-09-30, \"Ratification overdue\", because the due date is the day before the as-of date.",
 ["Due 2026-10-01, \"Awaiting ratification\", because the window of 7 days runs from the day after it went in.",
  "Due 2026-09-30, \"Awaiting ratification\".",
  "Due 2026-09-30, \"Ratified\"."],
 "Implemented 2026-09-23 plus 7 days is 2026-09-30. Day eight is outside the window, and level 2 is still unsigned.")

q(2, "No implementation date is recorded for an Emergency change on the plant whose level 2 is unsigned. Which due date and ratification state does the engine give on 2026-10-01?",
 "Due null, \"Ratification overdue\".",
 ["Due null, \"Awaiting ratification\", because no window has started yet to run out.",
  "Due 2026-10-08, \"Awaiting ratification\", counting from the as-of date instead.",
  "Due null, \"Not required\"."],
 "The window cannot be shown to be open, so it fails closed. ES-12 in the ESANMI register is this case: due null, \"Ratification overdue\" on 2026-10-01.")

q(1, "What ratification state does a Temporary change read?",
 "\"Not required\", because ratification belongs to the emergency route alone.",
 ["\"Awaiting ratification\" while it is in effect, until every level has signed.",
  "\"Ratified\" once its expiry date has passed.",
  "\"Ratification overdue\"."],
 "The four ratification states are \"Not required\", \"Awaiting ratification\", \"Ratification overdue\" and \"Ratified\". Only an Emergency change is ratified.")

q(3, "Every approval level has now signed on an Emergency change that went in on 2026-09-01. Name its ratification state as of 2026-10-01.",
 "\"Ratified\".",
 ["\"Ratification overdue\", due 2026-09-08, because it went in 30 days before the as-of date.",
  "\"Awaiting ratification\", because the change is still in \"Implementation\".",
  "\"Not required\", because nothing is left to sign."],
 "Every level signed reads \"Ratified\", however long ago the change went in. With level 2 unsigned the same date gives due 2026-09-08, \"Ratification overdue\".")

q(0, "The ESANMI summary reads ratificationOverdue 2 on 2026-10-01. Which two changes, and why does each read overdue?",
 "ES-05, whose due date 2026-09-27 has passed, and ES-12, whose due date is null because no implementation date is recorded.",
 ["ES-04 and ES-05, both past their due dates of 2026-10-03 and 2026-09-27.",
  "ES-05 and ES-03, the two changes past their dates.",
  "ES-05 alone, counted twice."],
 "ES-04 reads \"Awaiting ratification\", due 2026-10-03, which is ratificationPending 1. A reader who drops the row with a null due date misses ES-12.")

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/intermediate/asrci_m05.json', label='asrci_m05', expect_n=15)
finish()
