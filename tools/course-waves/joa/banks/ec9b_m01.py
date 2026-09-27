import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Associate m01, What a Joint Operating Agreement Fixes.
# Sources: the engine's function table, its stated constants and what it
# declines to compute; the texts with their editions and read dates; the
# provisions quoted; the Ekene joint venture and its planted situations; the
# refusals of this tier; what is graded and where the practicals run; the
# vocabulary. Every key rests on a digest-printed line or an engine return
# re-run in /root/cat-wip-joa/scratch/bank-beginner/witness.mjs.

q(2, "Which of these texts does the course quote word for word, with its citation?",
 "The Norwegian joint operating agreement, from its unofficial English translation of the 2007 text.",
 ["The AIPN model joint operating agreement, whose clauses the industry adapts more than any other form.",
  "The COPAS accounting procedures, for their overhead scale and the timing of each cash call.",
  "The AAPL forms, for the duties of the operator and the consent rules of the non-operators."],
 "The Norwegian agreement is a public text, quoted with its citation from the Wayback Machine capture of 26 May 2024. The AIPN model joint operating agreement, the COPAS accounting procedures and the AAPL forms are licensed, so the course teaches their ideas by concept only and quotes none of them.")

q(0, "How does the course cite the Petroleum Industry Act 2021 (Act No. 6) when it names the Act's edition?",
 "Official Gazette No. 142, Vol. 108, 27 August 2021.",
 ["Official Gazette No. 108, Vol. 142, 27 August 2021, with the volume and number as the gazette prints them.",
  "Official Gazette No. 142, Vol. 108, 27 February 2007, the date the Act's joint venture rules were first printed.",
  "Act No. 6, cited from the Wayback Machine capture of 26 May 2024, because the gazette answered a bot check."],
 "The sources table gives the Act as Official Gazette No. 142, Vol. 108, 27 August 2021. The number and the volume are not interchangeable, so 108 and 142 swapped name a different gazette. 27 February 2007 is the date on the Norwegian agreement's PDF, and the Wayback capture of 26 May 2024 is how the course reads the Norwegian agreement, whose live copy answered the bot check.")

q(3, "On what date was each text in the course's sources table read?",
 "2026-09-26, the same date for every text in the table.",
 ["26 May 2024, the date of the Wayback Machine capture the Norwegian agreement is cited from.",
  "27 August 2021, the date of the Act's gazette.",
  "27 February 2007, the date printed on the Norwegian agreement, the oldest text in the table."],
 "Every text in the sources table was read on 2026-09-26, and the table prints that date against each one. 26 May 2024 is the date of the Norwegian agreement's archived capture, 27 August 2021 the date of the Act's gazette and 27 February 2007 the date on the Norwegian PDF: each is an edition date, and none is a date the course read a text.")

q(1, "Why does the course cite the Norwegian agreement from a Wayback Machine capture?",
 "The live regjeringen.no copy answered a bot check with HTTP 403 on the date it was read.",
 ["The ministry withdrew the English translation in 2024, so the archived capture is the last copy.",
  "The capture holds the official Norwegian text, which the course then translates for itself.",
  "The regjeringen.no copy is licensed, so only an archived copy may be quoted in a course."],
 "The sources table says the live regjeringen.no copy answered a bot check with HTTP 403 on 2026-09-26, so the text is cited from the capture of 26 May 2024. The text is an unofficial English translation, and the course translates nothing itself. It is a public text: the licensed texts are the AIPN, COPAS and AAPL forms.")

q(1, "What does the course say about a public worked schedule for a cash call reconciliation or for an overhead scale applied to figures?",
 "The research found none, so those figures are the Norwegian clause arithmetic run by the engine.",
 ["The Kenya Model PSC 2015 prints one, and the course copies its cash call figures.",
  "World Bank Briefing Note 8 prints one for overhead, which the panel runs.",
  "OpenOil prints one, and the course teaches it with the printed 11.75 corrected to the engine's figure."],
 "The validation record, quoted in the course, found no public text that prints a worked schedule for a cash call over/under reconciliation or an overhead scale applied to figures, so those figures are the stated clause arithmetic of the Norwegian agreement run by the engine. The Kenya model prints cash call clauses and no schedule, Briefing Note 8 prints a PSC illustration, and OpenOil's 11.75 belongs to a state participation example that is taught as a printed arithmetic error.")

q(3, "How does the fixture file of the Ekene joint venture describe itself, in its own words?",
 "SYNTHETIC teaching data for the Ekene field (ours). No real company, contract, budget, price or regulator decision.",
 ["Anonymised books of a Nigerian shallow water joint venture, with each partner's name removed.",
  "A worked schedule published with the Norwegian agreement, restated in US$ for the course's use.",
  "A regulator's model case for PIA s.85(4), with the four parties relabelled EKO, PA, PB and NOC."],
 "The fixture is labelled SYNTHETIC in the file, written by a stated script for this platform, and the course quotes that label verbatim. No real joint venture's books are used, no public text prints a worked schedule of this kind for the Norwegian agreement, and no regulator decision appears in the data.")

q(0, "Which participating interests and which carry does the Ekene fixture state?",
 "EKO 40.000000, PA 25.000000, PB 15.000000 and NOC 20.000000, with NOC carried 100 percent by pro rata carriers.",
 ["EKO 50.000000, PA 31.250000, PB 18.750000 and NOC 0.000000, with no carry stated anywhere in the file.",
  "EKO 40.000000, PA 25.000000, PB 15.000000 and NOC 20.000000, with NOC carried half, in stated shares.",
  "EKO 40.000000, PA 25.000000, PB 15.000000 and NOC 20.000000, with no carry, so each pays its own share."],
 "The fixture gives EKO 40.000000, PA 25.000000, PB 15.000000 and NOC 20.000000 as participating interests, and states NOC carried 100 percent with carriers pro rata. The set 50.000000, 31.250000, 18.750000 and 0.000000 is the paying interests the engine computes from that carry. A half carry in stated shares is a separate worked case, and the fixture does state a carry.")

q(2, "Which of these does the engine decline to compute?",
 "An index adjustment of an overhead scale's band limits.",
 ["Each carrier's carry points under a stated carry.",
  "The allowed overrun of a budget under its stated tolerance.",
  "Each party's forecast share of a month's cash call."],
 "The course lists what the engine does not compute: no compensation on an assignment, no cover by taking a defaulter's petroleum, no index adjustment of a scale, no expert determination and no sliding scale of profit shares. Carry points, the allowed overrun of a budget and each forecast share are all figures the engine returns, from participatingInterests, budgetControl and cashCalls.")

q(3, "What code does jointVenture.js take from elsewhere in the engines package?",
 "applyPSC and npv from cashflow.ts, and calculatePartnerCosts from afe.js.",
 ["Its own npv and a Monte Carlo sampler, with calculatePartnerCosts imported from afe.js for splits.",
  "None at all: every split, pool and discount is its own code.",
  "applyPSC from cashflow.ts, with a partner split of its own kept in a helper beside the cash calls."],
 "The engine's two imports are engines/economics/cashflow.ts, for applyPSC and npv, and engines/economics/afe.js, for calculatePartnerCosts. It carries no cost pool, NPV or Monte Carlo code of its own, nothing in it samples, and every split of a joint account amount goes through the canonical calculatePartnerCosts.")

q(0, "What does the engine hand back when it refuses an input?",
 "An object with error and field, whose message starts with the name of the field it refuses.",
 ["A result whose figures are all zero, with a reason naming the field the engine doubted.",
  "The figures computed on the nearest accepted terms, with a warning printed in the basis.",
  "An empty result and a code number, which the panel looks up in a table of messages."],
 "A refusal is an object with error and field: field names the input refused, and the message starts with that name and states the exact condition that failed, with the value it was given. A refusal returns no figures, so it hands back no zeros and no result on substitute terms, and the message is the engine's own words with no code to look up.")

q(2, "On the Ekene 2027 cash calls, April and May make no cash call. How does the engine report those two months?",
 "As a result, with a reason printed beside each month.",
 ["As a refusal naming noCallBelow, since the engine cannot compute a month that has no call.",
  "As a refusal naming the forecast of April, since a forecast of 0 is refused as an input.",
  "As a result with both months left out of the ledger, and with no reason printed for them."],
 "A result returned with a reason, such as a month with no cash call, is a result and no refusal. April's forecast of 0 and May's below 500000 are both below the stated threshold, and each month's reason reads that there is no cash call and that the actual is billed in arrears in the next month. The months stay in the ledger, and a forecast of 0 is accepted.")

q(1, "A box states the carry under the key carry, singular. What does participatingInterests do with it?",
 "It refuses the key, naming it and listing the keys it accepts at the top level: parties, carries.",
 ["It reads carry as carries, since the engine accepts the singular form of every plural key it knows.",
  "It drops carry without a word and returns the paying interests as though no carry had been stated.",
  "It refuses the call for want of carries, naming carries as a required term with no default."],
 "Every call refuses an input key the function does not read, naming the key, its path and the accepted keys. In the engine's own words: carry is not an accepted key; the accepted keys at the top level are parties, carries. A misspelt key is refused, so a term is never dropped silently. The refusal names carry: carries itself is optional, and the worked case with no carry states none.")

q(1, "Why does every graded figure in this course have exactly one right answer?",
 "Nothing in the engine samples or searches, so the same terms give the same number on any machine.",
 ["Each figure is rounded to whole dollars by the grader, so any difference between machines disappears.",
  "The engine seeds its Monte Carlo sampler with a fixed seed that the capstone card states for each run.",
  "The capstone accepts the digits a reason prints, whichever of the two precisions the panel shows."],
 "Every graded number is a return value of the engine on fixed inputs, and nothing in the engine samples or searches, so there is exactly one right answer. The engine has no Monte Carlo code of its own, so there is no seed. Each graded figure is quoted to six decimals as the panel prints it, which is neither whole dollars nor a reason's digits.")

q(3, "Where does an Associate learner run the practicals of this course?",
 "In the account calculator, the course's own panel, which calls the vendored engine.",
 ["In a Suite app for joint ventures, opened from the Suite dashboard.",
  "In the recovery calculator, shared with the Professional tier.",
  "In a spreadsheet the learner builds, since an engine course carries no panel of its own."],
 "This is an engine course with no Suite app. Each tier has a calculator panel that calls the same vendored engine: the account calculator at Associate, the recovery calculator at Professional and the agreement calculator at Expert. The recovery calculator belongs to the Professional tier, and the panels make a spreadsheet unnecessary.")

q(0, "In this course the word overhead carries a narrower meaning than it has in conversation. What is it?",
 "The operator's charge on a stated scale over a stated base.",
 ["Any indirect cost of the joint venture, charged at whatever figure the operator books for it.",
  "Every cost outside the approved budget, charged against the stated unbudgeted allowance.",
  "The part of a carried party's cost share that its carriers pay on its behalf each month."],
 "The course's vocabulary legislates overhead as the operator's charge on a stated scale over a stated base, and notes that the Norwegian scale it follows is a research and development and corporate charge. Any indirect cost is the conversational meaning the rule narrows. Spending outside the budget is tested against the unbudgeted allowance, and the cost share paid by carriers is a carry.")

emit(Q, '/root/cat-wip-joa/banks/ec9b_m01.json', expect_n=15)
finish()
