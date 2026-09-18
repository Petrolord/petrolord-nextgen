import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# riskchange Associate m01, What These Engines Decide. Written from digest.txt
# SECTION 1 and the digest preamble, which are the four lessons of this module:
# four registers and a rule for each, one as-of date for every status, every
# verdict answers the same way, and what the engines leave to people.

q(1, "In the Suite, the Risk Register and its Heatmap tab both call one engine. Which engine is it?",
 "riskScoring",
 ["calendar",
  "lessonsLearned",
  "managementOfChange"],
 "The Risk Register with its Heatmap tab calls riskScoring. Management of Change calls managementOfChange, Peer Review Manager calls peerReview and Lessons Learned calls lessonsLearned. All four apps read calendar dates through calendar.js."),

q(3, "What does the riskScoring engine itself keep about the risks it scores?",
 "Nothing. The app stores the record and asks the engine what that record means.",
 ["The last band it derived for each risk, so that a screen can read it back without asking again.",
  "The likelihood and impact of every risk, so that the app only has to send the risk's id.",
  "A history of every band each risk has carried, dated by the as-of date of each call."],
 "None of the four engines stores anything. The app stores the record and the engine decides a state from it on each call, so a band is always a fresh answer about the record as it stands."),

q(0, "A user asks for the band beside a risk to be edited by hand, leaving the two levels as they are. What does this module teach about that request?",
 "A band is always derived from the record by the engine, so it follows the levels and nobody edits it directly.",
 ["A band may be overridden by the owner of the risk, and the override is kept until the next review date.",
  "A band may be edited, and the engine then recomputes the levels to match it.",
  "The band is a field the assessor types, and the engine only checks its spelling."],
 "Every entry an engine returns is a STATE decided from a record. Change the likelihood and the band that follows is a fresh answer from the same rule, which is why the question to ask about a surprising band is which field of the record produced it."),

q(2, "Every date-dependent status this course quotes is true on one as-of date. Which date is it?",
 "2026-10-01, a Thursday",
 ["2026-09-30, a Wednesday",
  "Whatever date the machine clock reads when the page is opened",
  "2026-10-01, a Friday"],
 "The digest's first line fixes the as-of date at 2026-10-01, a Thursday, and every engine call that takes a date was handed that one explicitly. None of them read a clock."),

q(2, "A caller hands isReviewOverdue a risk and leaves the date argument out. Which date does the function answer for?",
 "The date on the machine clock of whatever is running it.",
 ["The as-of date of this course, 2026-10-01, which the engine carries as its default.",
  "The date the risk record was last saved, which the app passes along with the record.",
  "It refuses the call, naming the missing date."],
 "Each function that takes a date has a parameter that defaults to the machine clock when the caller leaves it out. The answer looks complete, and it is an answer for whichever day the machine happens to be on."),

q(0, "In which argument position does isReviewOverdue in riskScoring take its date?",
 "Argument 2",
 ["Argument 1",
  "Argument 3",
  "It takes no date, and reads the status only"],
 "The digest reads every signature: riskScoring's isReviewOverdue takes its date as argument 2, and so does daysUntil in calendar. Both default that argument to the machine clock."),

q(3, "Two analysts open the same risk register a day apart. One reports a review as overdue and the other reports it on time, and neither wrote down a date. Which reading does this module give?",
 "Both can be right, because a function that defaults to the clock answers a different question each day, and neither report can be checked.",
 ["One of them must have a stale copy of the register, since the rule gives one answer for one record.",
  "The later reading is the right one, because a review status is always read on the latest date available.",
  "The earlier reading is the right one, because the engine locks a status on the first day it is asked."],
 "A report that does not state its as-of date cannot be checked by anybody, including its author the next morning. Handing the date in explicitly makes the answer a property of two named inputs."),

q(1, "How many of managementOfChange's functions take a date, as the digest reads them from the engine's signatures?",
 "7 functions",
 ["4 functions",
  "6 functions",
  "1 function"],
 "managementOfChange has 7 date-taking functions, peerReview has 4, lessonsLearned has 6, and riskScoring and calendar have 1 each. The digest reads them from each signature, a parameter that defaults to the machine clock."),

q(1, "When an engine in this course refuses a verdict, what shape does the answer take?",
 "An object whose ok field is false, carrying a reason a user can act on.",
 ["A thrown error, which the app catches and shows as a generic failure message.",
  "A score of 0, the value every engine in the course uses to mean it will not answer.",
  "An empty object, so the app has to work out for itself which input was missing."],
 "Every verdict that can be refused comes back as an object with ok, and a refusal carries a reason. The four engines refuse in the same shape, so one place in an app can show any refusal from any register."),

q(3, "Which set lists the three declining answers this tier meets, one for a band, one for appetite and one for a date?",
 "\"None\", \"Not set\" and null",
 ["\"Low\", \"Not set\" and the as-of date",
  "\"None\", \"Within appetite\" and null",
  "0, \"Above appetite\" and -1"],
 "A score with no basis bands \"None\", appetite with no basis reads \"Not set\", and a date that cannot be read parses to null. In each case the engine returns a named answer that means no answer and does not guess."),

q(0, "A register report groups \"Not set\" with \"Within appetite\" as a softer form of passing. What is wrong with that?",
 "\"Not set\" is the engine declining to report a pass it has no basis for, so it belongs with neither answer.",
 ["Nothing, since a risk with no target is carried at the organisation's default appetite.",
  "It should be grouped with \"Above appetite\", since the engine treats a missing target as a failure to be reported.",
  "\"Not set\" only appears on closed risks, so it should be left out of the report."],
 "\"Not set\" keeps the gap in the record visible. A missing target read as a pass would put a risk inside appetite that nobody ever measured against anything."),

q(2, "A chart ranks the bands with \"None\" at the bottom, one step below \"Low\". What does the module say about that ranking?",
 "It is wrong: \"None\" is the one band that means no score, so it is no grade at all.",
 ["It is right, since \"None\" covers the scores between 0 and the lower edge of \"Low\".",
  "It is right only for residual scores, which can fall below the bottom of the grid.",
  "It is wrong because \"None\" sits above \"Critical\", for scores beyond the grid."],
 "A likelihood of 2.5 against an impact of 4 scores 0 and bands \"None\" because a fraction is off the scale. Reading that as a very low risk would count an unscored risk as a scored one."),

q(1, "On a register where nobody has set a target on any risk, how many risks can read \"Within appetite\"?",
 "None of them, however low their residual scores are.",
 ["Every risk whose residual band is \"Low\", since a low residual needs no target.",
  "Every risk whose residual score is below its inherent score.",
  "All of them, until somebody enters a target that one of them exceeds."],
 "Appetite compares the residual with the risk's OWN target. With no target, or a target of zero, the answer is \"Not set\", so the target is one of the inputs people choose and the engine cannot supply."),

q(3, "An owner changes a risk's status to \"Closed\" while the hazard is still on the facility. What happens to the risk's review check?",
 "It stops being checked, because only a live risk carries a review obligation, whether or not the hazard has gone.",
 ["It keeps being checked until the engine sees the hazard removed from the facility record.",
  "It is refused: the engine will not accept a \"Closed\" status on a risk with a review date.",
  "It carries on as before, because the engine reads the review date before the status."],
 "The status is set on the record by people and the engine applies the rule that goes with it. A \"Closed\" risk is not live, so it can never read review-overdue, and nothing in the engine checks whether closing it was right."),

q(2, "What does an engine in this course guarantee about the status it returns?",
 "That the same record, target, date and population always give the same answer.",
 ["That the record it was handed describes the facility as it stands on the as-of date.",
  "That the levels on the record were chosen by somebody qualified to assess the risk.",
  "That every risk it scores was reviewed before the as-of date."],
 "An engine guarantees nothing about whether the record describes the facility. That part of assurance is done by the people who keep the register, and a status can only be as right as the record it was handed."),

emit(Q, '/root/wt-as-riskchange-nextgen/tools/course-banks/riskchange/beginner/asrcb_m01.json', label='asrcb_m01', expect_n=15)
finish()
