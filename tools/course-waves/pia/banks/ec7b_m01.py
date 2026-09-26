import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Associate m01, Who Decides What.
# Sources: the engine's function table and what it declines to compute; the
# texts with their editions and read dates; the provision map; the
# institutions and where the money lands; the vocabulary. Every key rests on a
# printed text row or an engine return re-run in
# /root/cat-wip-pia/scratch/bank-beginner/witness.mjs.

q(2, "Under PIA s.259(a)(i), which body assesses and collects the hydrocarbon tax?",
 "The Federal Inland Revenue Service, which the Act calls the Service.",
 ["The Nigerian Upstream Petroleum Regulatory Commission, which also sets each field's fiscal price.",
  "The Authority, which regulates the midstream and downstream.",
  "The Nigerian Sovereign Investment Authority."],
 "Section 259 opens by giving the collection of Government revenue to the Service and the Commission, and s.259(a)(i) gives the Service the assessment and collection of hydrocarbon tax. The Commission determines and collects royalties, rents and bonuses under s.259(b)(i); the Authority regulates the midstream and downstream; the Nigerian Sovereign Investment Authority is only the destination of the royalty by price.")

q(0, "What does PIA s.259(b)(i) make the Commission responsible for?",
 "Determining and collecting royalties, signature bonus, rents and related payments.",
 ["Assessing companies income tax and the tertiary education tax on taxable petroleum operations.",
  "Collecting the development levy into a special account and sharing it among seven recipients.",
  "Receiving the royalty by price for a sovereign investment fund."],
 "The text reads: \"(b) the Commission shall be responsible for the determination and collection of: (i) royalties, signature bonus, rents, and related payments and its enforcement under this Act\". Companies income tax and the tertiary education tax go to the Service under s.259(a)(ii); the development levy is collected by the Service under NTA s.59(2); the royalty by price is credited to the Nigerian Sovereign Investment Authority, which collects nothing.")

q(1, "Where does Seventh Schedule para 11(3) send the money raised by the royalty by price?",
 "To the credit of the Nigerian Sovereign Investment Authority.",
 ["Into the Federation Account, together with the production royalty and every tax.",
  "Into the special account of the development levy, shared out by fixed percentages.",
  "Toward the host communities development trust fund of the producing area each year."],
 "Para 11(3) reads: \"(3) Royalty derived from “royalty by price” shall be for the credit of Nigerian Sovereign Investment Authority.\" The Federation Account is the default for money due to Government (s.258(2)), but this royalty is carved out. The levy's special account belongs to NTA s.59(2), and the host communities trust is funded from opex under s.240(2).")

q(3, "What does PIA s.258(2) require of money collected from the petroleum industry that is due to the Government?",
 "Transfer to the Federation Account in a timely manner, subject to the Act.",
 ["Deposit in an escrow account with a Nigerian bank before any transfer is made to Government.",
  "Credit to the Commission's budget until royalties are verified.",
  "Retention by the Service until the NTA 2025 commences."],
 "Section 258(2) reads that such money \"shall be transferred to the Federation Account in a timely manner, subject to this Act\", and lists taxes, royalties, production and profit shares and bonuses among the payments. No escrow step, Commission budget or waiting period appears in the text; the escrow condition in this course belongs to a decommissioning fund, a later tier's question.")

q(2, "Under the Nigeria Tax Act 2025, which body is the relevant tax authority for the administration of royalty?",
 "The Service, under NTA s.89(2) and its Seventh Schedule para 1(1).",
 ["The Commission, which keeps the royalty role it holds under PIA s.259(b)(i) with no change at all.",
  "The Authority, because royalty in a year under that Act is treated as a downstream charge.",
  "The Nigerian Sovereign Investment Authority, for every royalty."],
 "NTA s.89(2) makes the Service the relevant tax authority for the administration of royalty, and the Seventh Schedule para 1(1) reads: \"The Service shall administer royalties payable in accordance with the provision of the Nigeria Tax Administration Act, 2025.\" The Nigeria Tax Act's Seventh Schedule restates the same terrain royalty rates. The Authority has no royalty role, and the sovereign fund receives only the royalty by price.")

q(0, "Which recipient takes the largest share of the development levy under NTA s.59(3)?",
 "The Tertiary Education Trust Fund, at 50%.",
 ["The Defence and Security Infrastructure Fund, which s.59(3)(f) gives 10% of the revenue.",
  "The Nigerian Education Loan, which s.59(3)(b) gives 15% of the levy revenue each year.",
  "The National Cybersecurity Fund, named last in the list of recipients at 5% of the levy."],
 "NTA s.59(3)(a) gives the Tertiary Education Trust Fund 50%. The other shares are the Nigerian Education Loan 15%, the Defence and Security Infrastructure Fund 10%, two funds at 8%, the National Cybersecurity Fund 5% and the National Board for Technological Incubation 4%, so each distractor names a real recipient with a smaller share.")

q(1, "What does NTA s.59(4) say about the development levy and the hydrocarbon tax?",
 "The levy is not charged on assessable profits computed for hydrocarbon tax.",
 ["The levy replaces the hydrocarbon tax in NTA years.",
  "The levy is deducted from hydrocarbon tax profit first.",
  "The levy reaches those profits in deep offshore years."],
 "The text reads: \"(4) The tax imposed under this Part shall not be levied on assessable profits computed for the purposes of hydrocarbon tax.\" So the levy reads the companies income tax base alone. It is therefore neither charged on nor deducted from the hydrocarbon tax base, and the section draws no line by terrain.")

q(3, "How many provisions does this course teach, and how does the engine divide them?",
 "41 provisions: 27 the engine computes and 14 that are concept-only.",
 ["41 provisions, every one of them computed by the engine, with 14 left out of any grade.",
  "27 provisions, all computed, plus 14 more that the Professional tier adds later on.",
  "41 provisions: 14 computed and 27 concept-only."],
 "The provision map lists 41 provisions: 27 computed and 14 concept-only. A computed provision may be graded, and only on a figure the engine returns; a concept-only provision is never computed. The 27 and 14 are one list for the whole course, and swapping them inverts which provisions the engine can compute.")

q(2, "In this course, what does it mean to call the fiscal oil price the Commission sets concept-only?",
 "It is taught from its text with its citation and is never graded on a number.",
 ["It is minor detail that the lessons mention in passing and a learner can safely skip over.",
  "It is computed but withheld from the capstone.",
  "It is graded only on the Regulations base figure."],
 "Concept-only has a legislated meaning here: taught from the text with its citation and never graded on a number. It does not mean unimportant. The engine does not compute the fiscal oil price at all (the realised price stands in for it and a note says so), so there is no engine figure to withhold or to grade on any base.")

q(1, "How does the course name the Petroleum Industry Act 2021 with its edition and read date?",
 "Official Gazette No. 142, Vol. 108, 27 August 2021, read on 2026-09-26.",
 ["Official Gazette No. 205, Vol. 109, 22 November 2022, read on 2026-09-26 with the Act.",
  "Official Gazette No. 117, Vol. 112, 26 June 2025, read on 2026-09-26 by the course.",
  "Commencement 16 August 2021, read through commentary."],
 "The texts table gives the Act as Official Gazette No. 142, Vol. 108, Lagos, 27 August 2021, with commencement on 16 August 2021, read on 2026-09-26. Gazette No. 205, Vol. 109 is the Petroleum Royalty Regulations 2022, and No. 117, Vol. 112 is the Nigeria Tax Act 2025. The Act is a primary text, quoted from the gazette.")

q(0, "What does the course record about the Nigeria Tax Act 2025 text it read?",
 "Effective 1 January 2026; re-gazetting ordered December 2025; no Certified True Copy read.",
 ["Effective 26 June 2025, with a Certified True Copy read.",
  "Effective 1 May 2023, read as a scanned copy.",
  "Effective 16 August 2021, with no edition recorded."],
 "The texts table records Official Gazette No. 117, Vol. 112, 26 June 2025, effective 1 January 2026 (a State House statement), with re-gazetting ordered in December 2025 and no Certified True Copy read. 26 June 2025 is the gazette date and no copy was certified; 1 May 2023 belongs to the Finance Act 2023; 16 August 2021 is the Act's commencement.")

q(3, "Which two values does the course say rest on a secondary source, and so states wherever they are used?",
 "The tertiary education tax of 2.5 percent before 2023, and the NDDC levy base of the total annual budget.",
 ["The development levy of 4% and the companies income tax rate of 30 percent, both from commentary on the NTA.",
  "The royalty by price benchmarks and the 2.5% gas rate.",
  "The 3% HCDT contribution and the terrain royalty rates."],
 "Only two values rest on secondary sources: the 2.5 percent tertiary education tax before 2023 (Finance Act 2021, read through EY and Forvis Mazars alerts) and the NDDC levy base of the total annual budget (NDDC Act 2000, read through Mondaq and Lexology commentary). The levy, the income tax rate, the benchmarks, the gas rate, HCDT and the terrain rates are all read from primary gazetted texts.")

q(2, "How does the course treat a model contract sold under licence, such as an AIPN model contract?",
 "It teaches it by concept only and quotes none of it.",
 ["It quotes short clauses with their citation, as it does for the Act and the Regulations.",
  "It quotes the contract's fiscal terms and leaves the operating clauses as concept-only.",
  "It replaces it with the Act's own wording and quotes that under the contract's title."],
 "The rule is that no licensed text is quoted anywhere in this course: model contracts sold under licence and paid commentary are taught by concept only. Only public texts are quoted, always with their citation, so neither short clauses nor fiscal terms of a licensed contract appear, and the Act's words are never passed off under another text's title.")

q(1, "Where do the practicals of this course run?",
 "In the course's own calculator panels, which call the same vendored engine.",
 ["In a Suite app for the Act, opened from the dashboard beside each lesson.",
  "On a spreadsheet the learner downloads and fills in by hand for each case.",
  "In a stored answer table that the panel looks up by the name of the case."],
 "This is an engine course with no Suite app. The royalty calculator (Associate), the hydrocarbon tax calculator (Professional) and the ledger calculator (Expert) each call the vendored engine on the learner's own terms and rows. Nothing is downloaded, and nothing is looked up: every figure a panel prints is computed on the inputs given.")

q(0, "Ekene Alpha runs and the panel prints the daily rate note from kpis.pia_notes below the table. How does the course classify that run?",
 "As a result: the note states a default, a conflict between texts or an approximation.",
 ["As a refusal, because the engine had to make an approximation before it could finish.",
  "As a partial run, whose figures stay withheld until the learner clears the note.",
  "As an error that the learner fixes by changing the terrain in the case box and rerunning."],
 "A refusal is a thrown error whose message states the exact condition that failed, and it returns no figures. A result returned with a note in kpis.pia_notes is a result: the note is course content, printed below the table, stating the engine's annual reading of the daily rate. Nothing is withheld, and no input needs changing.")

emit(Q, '/root/cat-wip-pia/banks/ec7b_m01.json', expect_n=15)
finish()
