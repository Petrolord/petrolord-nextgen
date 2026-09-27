import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Associate m01, The Resources Framework.
# Sources: the engine's five functions and what it declines to compute; the
# texts with their editions, licences and read dates; the Ekene field and its
# eight projects; the project as the unit; the refusals this module shows;
# what is graded and where the practicals run; the vocabulary. Every key rests
# on a digest line or an engine return re-run in
# /root/cat-wip-prms/scratch/bank-beginner/witness.mjs.

q(2, "The framework asks two separate questions of every quantity. Which pair of answers does a complete figure carry?",
 "A class, which describes the project, and a category, which places the estimate in the range of outcomes.",
 ["A licence and a gazette date, which tell a reader which Nigerian regulator accepted the figure for booking.",
  "A Pg and a Pd, which multiplied together give the class of the project.",
  "A discovery status and a unit, which together decide whether the figure is 1P, 2P or 3P in the table."],
 "The class answers the question about the project (is it discovered, can it be recovered, is it commercial; PRMS 2.1 and Table 1). The category answers the question about the estimate (the low, best or high outcome; PRMS 2.2.2.2). The two chances give a chance of commerciality, which sits beside the class and sets none of it. A discovery status and a unit set no category, and no Nigerian booking rule was found at all.")

q(0, "How many of the eight Ekene projects does the engine classify as Contingent Resources on their stated facts?",
 "Three: EKN-3, EKN-4 and EKN-5.",
 ["Two: EKN-1 and EKN-2.",
  "Five, EKN-8 included.",
  "Two: EKN-6 and EKN-7, the prospect and the lead that still wait on a well."],
 "The engine returns Contingent Resources for Ekene East gas, Ekene North appraisal and Ekene West tight sand. EKN-1 and EKN-2 are Reserves. EKN-6 and EKN-7 are undiscovered, so they are Prospective Resources. EKN-8 is discovered but has no recovery project, so it is Discovered Unrecoverable and does not reach the commerciality test.")

q(1, "SPE-PRMS 2018 (June 2018; CC BY-NC-ND 4.0) is cited throughout this course by section number, and none of its sentences appears. What is the reason?",
 "Its licence allows no commercial use and no derived works, and this course is sold.",
 ["The standard is out of date, and the course cites only the sections that the 2022 errata did not replace.",
  "Its sentences are long, so the course shortens each one and prints the shortened version in quotation marks.",
  "Quoting it would need the permission of the Commission, which reviews every text the course uses."],
 "The licence is non-commercial and no-derivatives, and a paid course is commercial, so the course teaches each idea in its own words and gives the section it comes from. The errata were checked and change none of the sections the engine applies. A shortened sentence in quotation marks is still a quotation. The Commission plays no part in the licence of an SPE text.")

q(3, "On what date was every text in the course's table of sources read?",
 "2026-09-27, the same date against every row.",
 ["2026-09-01, the date of the eCFR version the course read.",
  "27 August 2021, the Act's gazette date.",
  "1 April 2026, the date of the Commission's release on the national reserves position."],
 "Every text in the table was read on 2026-09-27. The eCFR version current at 2026-09-01 is the edition of the US rules, 27 August 2021 is the gazette date of the Act, and 1 April 2026 is the date of the NUPRC release. Each of those is an edition or publication date, and none is the date the course read a text.")

q(0, "How does the course use the Guidelines for Application of the PRMS?",
 "It cites the November 2011 edition for its printed figures and section numbers, and quotes none of its prose.",
 ["It quotes the 2022 edition with its citation, since that edition replaced the one from 2011 and is the current text.",
  "It quotes the 2011 edition word for word, because a superseded edition carries no copyright.",
  "It leaves the Guidelines out of the course entirely, because no open licence is printed on them."],
 "The 2011 edition prints no licence and is treated as copyright, so the course takes only its figures and section numbers. The 2022 edition is sold and was not read, so the course names the edition it did read by its year. A superseded edition keeps its copyright, and the course does use the 2011 figures, with their section numbers.")

q(2, "Which of these texts does the course quote word for word, with its citation?",
 "17 CFR 229.1202 and 229.1203, the US federal rules in the eCFR version current at 2026-09-01.",
 ["The PRMS Frequently Asked Questions (November 2022), whose answers the course prints with their numbers.",
  "NUPRC's release of 1 April 2026, quoted beside its gas figures.",
  "The Nigerian Upstream Petroleum (Commercial) Regulations, 2025, from which the course prints reg. 6 in full."],
 "The US federal text is public domain, so the course quotes it with its citation, as it does the Act and S.I. No. 37 of 2023. The FAQs are copyright SPE with all rights reserved, so only their figures and answer numbers are used. The release's page reads all rights reserved, so only its figures and date are cited. The Commercial Regulations are used by concept only.")

q(1, "What does the Ekene fixture file state about itself in the statement that opens it?",
 "That it is SYNTHETIC teaching data, and that no real company, field, licence, price, cost, reserves figure or regulator decision is in it.",
 ["That it is a cut of real Niger Delta data, with the names changed so the operator cannot be identified.",
  "That its eight projects were classified by the Commission, and the course reproduces the Commission's classes.",
  "That its figures are the rates of the Petroleum Industry Act 2021, rounded for teaching purposes."],
 "The file opens by calling itself SYNTHETIC teaching data for the Ekene field and listing what it does not contain. Its classes are what the engine returns on the stated facts, checked against the file's own notes. No regulator decision appears in it, and its royalty, tax and prices are synthetic teaching figures, which are not the rates of the Act.")

q(3, "The engine's `classify` function is called on a field with several projects. What does one call classify?",
 "One project: one set of stated facts gives one class and one sub-class.",
 ["The whole field, which receives the class of its most mature project and carries it for every project.",
  "The accumulation, so all projects on Ekene Main share the class of the waterflood.",
  "Every project in the box at once, as one field class."],
 "The project is the unit. Each classify call takes one project's stated facts and returns one class, so Ekene carries eight classifications. Nothing in the engine adds them into a field class, and the same accumulation holds Reserves in EKN-1 and Discovered Unrecoverable in EKN-8, because each project is read on its own facts.")

q(0, "EKN-8, Ekene Main residual oil, is discovered and its stated recovery project is none. At which step of the engine's decision list does its classification stop?",
 "At the second step, the recovery project: it becomes Discovered Unrecoverable and nothing further is read.",
 ["At the first step, discovery, because residual oil is left in the rock and is treated as undiscovered.",
  "At the fourth step, the commerciality test, where it fails the criterion on facilities and on the market.",
  "At the third step, where every project without a sub-class is sent to the Prospective Resources class."],
 "The list runs discovery, then a recovery project, then the undiscovered branch, then the commerciality test (PRMS 2.1.1.1, 2.1.0.1, 2.1.1.2, 2.1.2.1). EKN-8 is discovered, so it passes the first step, and with no recovery project it is Discovered Unrecoverable at the second, before any commerciality test. The third step applies only to undiscovered projects.")

q(2, "A learner clears the Discovery control on Ekene Main waterflood and runs the box. Which message is printed?",
 "discovery must be one of \"discovered\", \"undiscovered\"; got nothing",
 ["A Reserves class, read from the criteria that are all met.",
  "discovery must be one of \"discovered\", \"undiscovered\"; got \"appraised\"",
  "A result with the class left blank and a warning."],
 "Those are the engine's own words: a discovery status has no default, so a missing one is refused by name, and the message ends \"got nothing\" because no value was given. The message that ends in \"appraised\" is the refusal of a status the engine does not accept. The engine does not guess a status from the other facts, and it returns no half-filled result.")

q(1, "A box carries an unknown top-level key, `maturity`, and also lacks its discovery status. Which problem does the engine name?",
 "The unknown key: every function checks its accepted keys before it reads any input.",
 ["The missing discovery status, since a required input always comes first.",
  "Both problems, listed in one message in the order they appear in the box.",
  "Neither: an unknown key is dropped silently and the class is returned with a warning."],
 "The engine refuses on the unknown key first, in its own words: \"maturity is not an accepted key; the accepted keys at the top level are name, discovery, recoveryProject, subClass, commerciality, economicStatus, projectStatus, reservesStatus, chances, nigeria\". It names one field a refusal, and a misspelt or unknown key is refused by name, so nothing is dropped silently.")

q(3, "EKN-4 comes back as Contingent Resources with a list of criteria that are not met. How does the course describe that output?",
 "As a result: the list is a finding about the project.",
 ["As a refusal, since the project failed the test.",
  "As a warning, which the capstone treats as a refusal whenever a list is printed.",
  "As an error in the box, which the learner fixes by setting the missing criteria to true."],
 "A result returned with a reason is a result. The unmet criteria describe the project and are printed with its class. A refusal returns no figures, and its message names an input the engine cannot read. Setting the criteria to true would change the stated facts of the project, which is a different project.")

q(0, "What is every graded number in this course?",
 "A return value of the engine on fixed inputs, so the same inputs give the same number on any machine.",
 ["A figure the tutor works out by hand from the lesson tables and types into the answer key.",
  "A Monte Carlo figure, graded within a tolerance wide enough to cover the scatter of the draws.",
  "A figure published by the Commission, which the course checks against the engine before grading."],
 "Each graded figure is computed by one of the engine's functions on inputs written down in advance, so there is exactly one right answer. No graded figure is a Monte Carlo draw. The Commission's figures are cited as published and are never graded.")

q(1, "Which of these is outside what the engine does?",
 "Building a production forecast from well rates.",
 ["Naming each criterion that keeps a discovered project out of Reserves when the facts are stated.",
  "Returning the categories of three stated estimates with the probability label beside each one.",
  "Refusing an input key it does not read, at whatever level of the box the key sits."],
 "The engine builds no production forecast, no in-place volume and no distribution from data; a forecast from well rates belongs to the decline curve analysis course. Naming the blockers is part of classify, the categories are what categorize returns, and every call refuses an unknown key by name.")

q(3, "A report calls Nigeria's published national 2P gas figure \"Nigeria's gas reserves\". How does this course word that figure?",
 "As reported reserves, with its date and whoever reported it.",
 ["As Reserves in the class sense, since a national total adds up the Reserves projects of every licence.",
  "As Contingent Resources, because a national figure has passed no project's commerciality test.",
  "As resources, since the word covers every quantity in the ground without naming a class."],
 "In this course reserves is the PRMS class: discovered, commercial and remaining. A national or company figure is written as reported reserves, with its date and who reported it, which for the national gas figure is the Commission's release of 1 April 2026. Contingent Resources is a class of projects. Resources alone means all quantities together.")

emit(Q, '/root/cat-wip-prms/banks/ec11b_m01.json', expect_n=15)
finish()
