import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Professional m01, the inspection and test plan.
# Draws on m01's five lessons only: digest SECTION 10 and the planProgress
# lines of SECTION 11. Every figure, date, status and refusal is a string the
# digest prints; every status is read at the as-of date 2026-10-15.

q(1, "BLOCKING_POINT_TYPES is the qualityAssurance list of the point types that stop work. What does it hold?",
 "Hold point, and no other type.",
 ["Hold point and Witness point, the two types at which a test is watched.",
  "Hold point, Witness point and Review point, the three types a verifier signs.",
  "Every point type whose planned date has passed at the as-of date."],
 "The list holds one entry. On QAP-2026-014 the stops work column reads true on the five hold point rows and false on every other row, and the engine derives the column from the type.")

q(3, "At the as-of date 2026-10-15, H-08 reads Pending, planned 2026-10-20, overdue false. Is it one of the three in hold points outstanding 3?",
 "Yes. It is unresolved, and that count does not read the planned date.",
 ["No. A hold point joins the outstanding count only once its planned date has passed.",
  "No. The three are H-05, S-10 and R-12, the overdue points.",
  "No. Only a hold point that has Failed is counted as outstanding before closure."],
 "The three are H-05, H-08 and H-11, the hold point rows whose resolved column reads false. H-08 and H-11 read overdue false and still stop work; being outstanding and being overdue are two separate readings.")

q(0, "H-08, the hydrostatic test, is asked to pass with nobody named. Which sentence does canDecideCheckpoint refuse with?",
 "A hold point needs the date it was verified and who verified it. Without those it has not been held.",
 ["Record the date this was decided and who decided it.",
  "Say why this point is being waived.",
  "Accepted is not a checkpoint status."],
 "The shorter sentence about the date and who decided it is the one W-09, a witness point, meets. The requirement under both is the same pair, a date and a person, and the hold point sentence adds that without them the point has not been held.")

q(2, "W-09 is asked to be waived with a reason and no date or verifier, and the engine refuses. What does a waiver need on the record before it is allowed?",
 "A date, who decided it, and the reason for the waiver.",
 ["A reason alone, since the reason is the part of a waiver that an auditor can test.",
  "A date and who decided it, with the reason optional on a point that does not stop work.",
  "A reason and a second verifier."],
 "The refusal for this request is \"Record the date this was decided and who decided it.\" and the refusal for a waiver with no reason is the waiver sentence. Only with all three does the digest print ALLOWED.")

q(2, "Does canDecideCheckpoint allow a hold point to be waived?",
 "Yes, with a date, a verifier and a reason on the record.",
 ["No. A hold point may be Passed or set Not applicable, and Waived is refused for it.",
  "Only while its plan is still a Draft, the same stage at which it may be removed.",
  "Only after it has first Failed."],
 "H-08 waived with a date, a verifier and a reason is ALLOWED. The digest states that canDecideCheckpoint has no rule that forbids waiving a hold point, and a waived hold point with its record and reason is resolved like any waived point.")

q(0, "H-11, the pre-commissioning release, is to be set Not applicable. In what order does canDecideCheckpoint ask for what it needs?",
 "The date and the name first, then the reason.",
 ["The reason first, then the date and the name.",
  "All three at once, in one refusal.",
  "The verifier, then the date, then the reason."],
 "With nothing recorded the engine refuses on the date and the name, the same record a waiver needs. Given those two, it refuses again until a reason says why the hold point does not apply. H-11 with all three reads ALLOWED.")

q(3, "S-10, site surveillance, reads In progress and overdue true. It is set Not applicable with nothing recorded. What does the engine answer?",
 "ALLOWED, with nothing asked of it.",
 ["REFUSED, because S-10 reads overdue true against its planned date of 2026-10-01.",
  "REFUSED, because setting any point aside needs the date and who decided it.",
  "ALLOWED once a reason is recorded, the same record H-11 needs."],
 "A surveillance point stops nothing, and the digest prints ALLOWED for S-10 with nothing recorded: no date, no name and no reason. Not applicable is one of the three statuses in CHECKPOINT_RESOLVED_STATUSES. The same request on H-11, a hold point, is refused until a date, a name and a reason are on the record.")

q(1, "Which of these points is inside planProgress's resolved 6 at the as-of date?",
 "W-06, the coating holiday test, which reads Waived.",
 ["H-05, which reads Failed.",
  "S-10, site surveillance, which reads In progress.",
  "R-12, the as-built dossier review, which reads Notified."],
 "The resolved six are H-01, W-02, H-03 and R-04, which Passed, W-06, which is Waived, and M-07, which is Not applicable. H-05 Failed and is outstanding.")

q(0, "H-05 reads Failed at the as-of date. How does planProgress count it?",
 "In failed 1, and again among the outstanding 6.",
 ["In failed 1 alone.",
  "Among the resolved 6.",
  "In outstanding 6 alone."],
 "A failure does not finish a point. H-05 is not in the resolved list, it is the failed 1, and it is one of the outstanding six with H-08, W-09, S-10, H-11 and R-12.")

q(2, "SECTION 11 prints four cases of how a planProgress percent rounds. Which pairing is one of them?",
 "3 of 8 prints 38.",
 ["5 of 8 prints 58.",
  "1 of 8 prints 63.",
  "23 of 40 prints 13."],
 "The four cases are 1 of 8 prints 13, 23 of 40 prints 58, 3 of 8 prints 38 and 5 of 8 prints 63. planProgress rounds half up on the exact fraction of resolved points, and a percent is quoted as the engine prints it.")

q(3, "planProgress is asked about a plan with no points. What does it print for the percent?",
 "null.",
 ["0.",
  "50.",
  "It refuses to count an empty plan."],
 "An empty plan has no fraction to take, and planProgress over a plan with no points prints percent null. A screen that shows 0 there, or the 50 that QAP-2026-014 reads, has invented a figure the engine does not make.")

q(1, "Between the as-of date reading, resolved 6 and percent 50, and the allowed closure step, resolved 9 of 12 and percent 75, which three points were resolved?",
 "H-05, H-08 and H-11, all three of them hold points.",
 ["W-09, S-10 and R-12, the three the closure walk reached last.",
  "H-08, H-11 and S-10.",
  "H-05, S-10 and R-12, the three points that read overdue true."],
 "At the allowed step W-09, S-10 and R-12 are still unresolved. The walk re-inspects H-05 and passes H-08 and H-11, and none of the three unresolved types stops work.")

q(1, "A reviewer asks canDecideCheckpoint to set a point to Accepted. What happens?",
 "It refuses: Accepted is not a checkpoint status.",
 ["It records the point as Passed.",
  "It allows it and counts it resolved.",
  "It refuses until a date and a verifier are recorded beside the word."],
 "The checkpoint vocabulary is a fixed list: Pending, Notified, In progress, Passed, Failed, Waived and Not applicable. A word outside it is refused before it reaches the record.")

q(3, "H-08 is asked to pass with nobody named, and the engine refuses. What is H-08's status after the refused request?",
 "Pending.",
 ["Passed.",
  "In progress.",
  "Failed."],
 "A request is not a result. A refused request changes nothing on the plan, so H-08 keeps the status it had at the as-of date.")

q(0, "W-06 is Waived and H-01 Passed. What does planProgress's percent 50 tell a reader about the difference between them?",
 "Nothing. Both are inside resolved 6 and count alike.",
 ["That W-06 counts as half a point.",
  "That W-06 is left out of total 12.",
  "That W-06 is still outstanding."],
 "Passed, Waived and Not applicable are the three resolved statuses and each counts alike. The percent says how many points no longer need anything; the status column, and the reason on the waiver, say which were checked.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/intermediate/cqi_m01.json', label='cqi_m01', expect_n=15)
finish()
