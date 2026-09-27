import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Associate m01, What a Farm-Out Is.
# Sources: the engine's function table, its stated constants and what it
# declines to compute; the texts with their editions and read dates; the
# provisions quoted; the Ekene Deep fixture; the refusals of this tier; what is
# graded and where the practicals run; the vocabulary. Every key rests on a
# digest-printed line or an engine return re-run in
# /root/cat-wip-farmout/scratch/bank-beginner/witness.mjs.

q(2, "Page OT30020 of HM Revenue and Customs' Oil Taxation Manual (Open Government Licence v3.0, updated 8 August 2019) describes a Farm Out in one sentence. What trade does that sentence describe?",
 "The owner, the Farmer Out, disposing of a licence interest for consideration given by the Farmer In.",
 ["A sale of a share in a producing field, which the manual says is generally paid for in cash or in shares.",
  "An undertaking to bear its own and the outgoing party's share of exploration or appraisal costs.",
  "An agreement that completes the whole work obligation before any share is assigned."],
 "OT30020 describes a Farm Out as the disposal of a licence interest by the owner, the Farmer Out, in return for consideration given by the Farmer In. Cash or shares is how OT30023 describes the price of a share in a producing field. Bearing both parties' share of the costs is how OT30048 describes an obligation to undertake work. Work completed before the assignment is what OT30021 calls an earn-in.")

q(0, "Where does the Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021) define a farm-out?",
 "In s.94(8)(b), which sits inside the Act's section on marginal fields.",
 ["In s.95(14), the subsection that also defines a change of control of a licence holder by its voting power.",
  "In s.233(10), where the Act requires a decommissioning and abandonment plan in every farm out agreement.",
  "Nowhere in the Act itself: the definition is reg. 24 of the 2024 Assignment of Interests Regulations."],
 "The Act defines a farm-out in s.94(8)(b), and s.94(8) opens \"For the purpose of this section\" inside the marginal field section. Section 95(14) defines a change of control, s.233(10) uses the word farm out without a second definition, and reg. 24 of the 2024 Regulations defines a petroleum agreement and an assignment. The engine's arithmetic applies to any farm-out a caller states.")

q(1, "In the Ekene Deep fixture, which party is the farmor, and what participating interest does it hold before the farm-out?",
 "EKO, Ekene Operator (synthetic), with 70.000000 percent.",
 ["PA, Partner A (synthetic), which holds 30.000000 percent and stays outside the trade.",
  "FIN, Farminee Energy (synthetic), which holds 0.000000 percent until it earns its share.",
  "EKO and PA jointly, as co-farmors of the licence."],
 "The fixture names EKO the farmor and FIN the farminee, with EKO at 70.000000 percent, PA at 30.000000 and FIN at 0.000000 before the deal. PA is a licence party outside the trade: it pays its own share and keeps its participating interest. FIN is the newcomer that earns. No call has two farmors; the engine reads one farmor id.")

q(3, "On what date was each text in the course's sources table read?",
 "2026-09-27, the same date for all four texts.",
 ["27 August 2021, which is the gazette date printed against the Petroleum Industry Act.",
  "9 April 2024, the gazette date of the Assignment of Interests Regulations, 2024.",
  "13 March 2024, the date on which the 2024 Assignment of Interests Regulations were made."],
 "Every text in the sources table, the Act, the 2024 Regulations, HMRC's manual pages and the Penn State page, was read on 2026-09-27, and the table prints that date against each one. 27 August 2021 is the Act's gazette date, 9 April 2024 the Regulations' gazette date and 13 March 2024 the date they were made: each is an edition date, and none is the date the course read a text.")

q(1, "How does the course give the edition of the Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024?",
 "S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111, 9 April 2024 (made 13 March 2024).",
 ["S.I. No. 61 of 2024, Official Gazette No. 67, Vol. 111, 9 April 2024 (made 13 March 2024), as the cover lists it.",
  "Official Gazette No. 142, Vol. 108, 27 August 2021, the gazette that also carries the Act itself.",
  "S.I. No. 67 of 2024, Gazette No. 61, Vol. 111, 13 March 2024 (made 9 April 2024)."],
 "The sources table gives S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111, 9 April 2024, made 13 March 2024. Swapping 67 and 61 names a different instrument and gazette, and swapping the two dates puts the gazette before the making. Official Gazette No. 142, Vol. 108, 27 August 2021 is the edition of the Petroleum Industry Act 2021.")

q(0, "The course cites the Penn State EME 801 page, Lesson 6, for its printed figures alone. Why does it use none of the page's sentences?",
 "Its CC BY-NC-SA 4.0 licence is non-commercial, and this course is sold.",
 ["Its figures are the only public farm-in schedule in print.",
  "It is a licensed model agreement, taught by concept only.",
  "Its sentences describe United Kingdom tax rules, which the course reads and applies to none of its deals."],
 "The sources table records the page's licence as CC BY-NC-SA 4.0, which is non-commercial, and this course is sold, so its payoffs and EMVs are cited as figures with the citation and no sentence is quoted. No public text prints a farm-in schedule, as the engine's validation record says. The licensed forms are the model agreements, and the United Kingdom guidance is HMRC's manual.")

q(2, "A lesson needs the idea of a promote, which licensed model farm-out agreements carry. How does the course treat those licensed forms?",
 "It teaches the idea from public texts and the engine's stated arithmetic, and neither quotes a form nor names one as a source.",
 ["It quotes the relevant clause once with a full citation, since a citation makes a short quotation fair.",
  "It quotes each form only in the lesson that first needs the clause, then refers to the clause number.",
  "It paraphrases each clause line by line and keeps the form's own numbering, so a learner can check it."],
 "The sources section says no licensed model agreement is quoted anywhere in the course and none is named as a source; where a lesson needs an idea such agreements carry, it teaches the idea from the public texts and the engine's stated arithmetic. A citation does not license a quotation, and a line-by-line paraphrase keyed to the form's numbering would reproduce the form.")

q(3, "In the earning calculator's box for the Ekene Deep well, a learner changes EKO's participatingPct from 70 to 60 and leaves PA at 30. What does the engine return?",
 "A refusal on the field parties, saying the participating interests must sum to 100 and got a sum of 90.",
 ["A result leaving the missing ten points unassigned while FIN still earns 30 percent.",
  "A result in which EKO and PA are scaled up in proportion until they sum to 100, with a reason line reporting the change.",
  "A refusal on events[0].earnedPct, since 30 percent is half of the farmor's 60."],
 "The engine checks that the parties' participating interests make up the whole, and refuses otherwise, in its own words: \"parties must have participatingPct summing to 100; got a sum of 90\". It never rescales or fills a gap, since every share is a stated input. An earning of 30 from a farmor at 60 is within the farmor's interest, so the earning check would pass.")

q(1, "A learner adds a top-level key carryCap to an earning box that is otherwise valid. What does the engine do with it?",
 "It refuses the call on carryCap and lists the eight top-level keys the function reads.",
 ["The call runs, and carryCap is read as a carry-amount cap on the first event of the box, at the amount stated.",
  "It runs the call and quietly drops carryCap as a key it does not read.",
  "A reason line is added warning that carryCap was set aside as a key it does not read, and the call runs."],
 "Every function refuses an input key it does not read, at every level, naming the key and the accepted keys. In the engine's words: \"carryCap is not an accepted key; the accepted keys at the top level are parties, farmor, farminee, events, vesting, eventsCompleted, cashBonus, pastCosts\". A misspelt optional key is refused so that a term is never silently dropped, and a cap belongs inside an event's cap object.")

q(0, "A box has no vesting rule and also carries an unknown top-level key vest. Which problem does the engine name?",
 "The unknown key vest: every function checks its accepted keys before it reads a term.",
 ["The missing vesting rule, since a missing required term is checked ahead of any extra key in the box.",
  "Both problems in one message, listing the missing vesting rule first and the unknown key vest second.",
  "Neither of them: vest is read as the vesting rule, and the call returns a result with a reason line."],
 "The course's order of refusals says a box that carries an unknown key and lacks a required term is refused on the unknown key first. On the Ekene single well with vesting removed and a key vest added, the engine names vest and lists the accepted top-level keys. One refusal names one field, and the engine never reads a key it does not know as another term.")

q(2, "A box for the Ekene licence (EKO 70 and PA 30 percent) names the farminee's id as PA. What does the engine do?",
 "It refuses on farminee.id: the farminee must have an id no licence party has.",
 ["It computes a farm-in between partners, moving 30 percent of the licence from EKO across to PA's holding.",
  "It merges PA's positions and reports PA at 60 percent after the deal.",
  "It swaps the roles, so PA becomes the farmor and EKO the farminee."],
 "The engine refuses a farminee that is already a licence party. Its own words: farminee.id must be an id no licence party has (EKO, PA); got \"PA\". A trade between existing partners is a different trade, and the earning call does not compute it. The engine never swaps or merges roles: the farmor and the farminee are stated inputs.")

q(3, "Which figures does the farmout engine hold for itself, with no caller stating them?",
 "Size caps and a sum tolerance in DEFAULTS, and the cited gazetted figures in NIGERIA_ASSIGNMENT.",
 ["A standard promote of 10 points, applied when a deal leaves the share paid out.",
  "Zero for the cash bonus and the reimbursement of any deal that states neither.",
  "Per-event vesting, written in for any deal that states only one event."],
 "The stated constants are the exported DEFAULTS (the most parties, events, years and so on, and SUM_TOLERANCE of 1e-9) and NIGERIA_ASSIGNMENT, whose figures are each cited to the 2024 Regulations or the Act. Every deal term (the share paid, the interest earned, the cap, the vesting rule, the bonus, the reimbursement) is an input with no default, and a call without one is refused by name.")

q(1, "What does the Ekene farm-out fixture file say about its own data?",
 "It is SYNTHETIC teaching data, with no real company, deal, prospect, price or regulator decision.",
 ["It is a redacted copy of a real Nigerian farm-out, with the parties' names replaced by Ekene names.",
  "It reproduces the Penn State drill or farm out problem under Ekene names.",
  "It is the regulator's worked example from the 2024 Regulations, converted from naira to US dollars."],
 "The fixture labels itself: \"SYNTHETIC teaching data for the Ekene field (ours). No real company, deal, prospect, price or regulator decision. The Ekene Deep prospect and every party below are synthetic.\" It is written by a stated script, every party in it is synthetic, and the 2024 Regulations print no worked example at all.")

q(0, "Where does an Associate learner run the practicals of this course?",
 "In the earning calculator, the course's own panel, calling the vendored engine the lessons quote.",
 ["In a Suite farm-out app, opened from the economics module on the dashboard.",
  "In a spreadsheet the learner builds from the lesson tables.",
  "In the valuation calculator, which serves every tier from one view."],
 "This is an engine course with no Suite app. Each tier has its own calculator panel calling the same vendored engine: the earning calculator at Associate, the deal calculator at Professional and the valuation calculator at Expert. Every graded number is a return value of the engine on fixed inputs, which no hand-built spreadsheet stands in for.")

q(2, "In its own sentences, what does the course call the party that gives up part of its participating interest?",
 "The farmor, the engine's name; each text's own word stays inside its quotation marks.",
 ["The farmee, the Act's word in s.94(5).",
  "The Farmer Out, as HMRC's manual prints it on page OT30020.",
  "The assignor, the word the 2024 Regulations use for the party that pays the assignment consent fee."],
 "The vocabulary rule makes farmor and farminee the engine's names for the party giving up an interest and the party earning it, with the texts' words quoted as they print them. \"farmee\" in the Act is the incoming party. Farmer Out and assignor are the texts' words for the outgoing party; the course quotes them and writes farmor in its own sentences.")

emit(Q, '/root/cat-wip-farmout/banks/ec10b_m01.json', expect_n=15)
finish()
