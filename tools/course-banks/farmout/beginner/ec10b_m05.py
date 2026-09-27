import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Associate m05, The Consent Process in Words.
# Sources: the consent line of the engine's fee basis; the Petroleum Industry
# Act 2021 and 2024 Regulations provisions the course quotes (s.94(5), s.95(2),
# (3), (7)(b), (11)(a), (14), (15), s.233(10), s.264(f), s.302(12)(c); regs
# 3(3), 4(2), 4(4)(b), 4(7), 16(c), 18(3), 19(5), 19(6)); what the engine does
# with the consent. No fee figure: the fee is computed at Professional. Every
# key rests on a digest-printed line; the engine lines are re-run in
# /root/cat-wip-farmout/scratch/bank-beginner/witness.mjs.

q(1, "The Ekene licence is a petroleum prospecting licence (PPL). Whose consent does its farm-out need, and how is that consent given?",
 "The Minister's prior written consent, granted on the Commission's recommendation.",
 ["The Commission's own prior written consent, since the licence is still at the exploration stage.",
  "The Minister's alone, with no role for the Commission.",
  "No consent at all, since a farm-out assigns nothing until the farminee's work is finished."],
 "The Act gives the decision to the Minister and the recommendation to the Commission (PIA s.95(2)), and the application is made to the Commission (AOI Regulations 2024 reg. 4(2)). The Commission's own consent is the rule for a petroleum exploration licence, a different licence type. HMRC's manual notes that even a farm in, assigned before the work, is made subject to government consent.")

q(3, "Which authority gives consent to the assignment of an interest in a petroleum exploration licence (PEL)?",
 "The Commission, by its prior written consent (PIA s.95(15); AOI Regulations 2024 reg. 16(c)).",
 ["The Minister, on the Commission's recommendation, as for a PPL or a PML.",
  "The Minister alone, with consent deemed after 60 working days of silence.",
  "No authority: an exploration licence can be assigned without any consent."],
 "PIA s.95(15) says a PEL holder shall not assign without the prior written consent of the Commission, and reg. 16(c) applies the same to a change in control of a PEL holder. The Minister's consent on the Commission's recommendation is the PPL and PML route. The 60 working days of s.95(7)(b) run on the Minister's silence after a recommendation.")

q(2, "Under PIA s.95(14), when does acquiring voting power in a licence holder become a change of control?",
 "When the stake exceeds 50%, one buyer or several in concert.",
 ["When it reaches 50% exactly, the point at which the buyers hold half of the voting power.",
  "When one buyer on its own passes 50%, since the Act counts no persons acting together.",
  "When it passes 50% of the participating interest in the licence, whatever the voting power."],
 "The Act defines a change of control as any person or persons acting jointly or in concert acquiring a percentage of the voting power of the holder that \"exceeds 50%\" at any time. Exactly half does not exceed it. Persons acting together count, and the test is voting power in the holder, a company, with no reference to a participating interest in the licence. The engine records the figure as changeOfControlAbovePct, 50.")

q(0, "A buyer takes control of the company that holds EKO's participating interest, and no farm-out is signed. How does the Act treat the purchase?",
 "As an assignment: s.95(3) deems a change of control in a holder to be one.",
 ["As a private share sale outside the Act, since the participating interest stays with the same holder.",
  "A farm-out under s.94(8)(b), since control of the holder moves.",
  "A PEL matter for the Commission alone to decide."],
 "PIA s.95(3) says a change of control in the holder of a licence or lease shall be deemed to be an assignment, so the purchase needs consent as a sale of the participating interest would. The licence staying with the same holder is exactly the case s.95(3) reaches. A farm-out is an agreement with a third party to work the licence, and the Ekene licence is a PPL.")

q(1, "Regulation 3(3) of the Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024 requires the Minister's prior written consent to a change in control of a holder. Which holder does it except?",
 "A licensee, lessee or indirect controller listed on a public exchange.",
 ["A holder whose change in control stays at or below the 50% line of PIA s.95(14).",
  "A holder incorporated in Nigeria, the condition the Minister may set under s.95(11)(a).",
  "Any holder of a petroleum mining lease."],
 "Regulation 3(3) applies to a change in the control of a company that holds an interest in a licence or lease, other than a licensee, lessee or indirect controller of a licence or lease listed on a public exchange. A change at or below the line is no change of control to begin with, incorporation in Nigeria is a condition the Minister may set on a transferee, and a mining lease is one of the licences the rule covers.")

q(2, "What must a holder's notification of intention to the Commission state under reg. 4(4)(b) of the 2024 Regulations?",
 "The reason for the assignment, the method of the transaction, and its possible technical and economic benefits.",
 ["The value of the transaction, the consent fee and the date by which the fee will be paid.",
  "The field development plan the farmee will present for the licence or lease area.",
  "The participating interests before and after the deal, and the promote of each earning event."],
 "Regulation 4(4)(b) asks for a statement of \"the reason for the intended assignment, the method intended to be used for the conduct of the transaction, and possible technical and economic benefits derivable from the transaction\". The earning calculator gives figures a notification could carry, but the regulation names no promote, fee or date. A field development plan is the marginal field condition of PIA s.94(5).")

q(3, "What happens when the Commission does not answer a notification of intention within 15 working days?",
 "The notification is deemed approved (reg. 4(7)).",
 ["The notification lapses, and the holder must notify the Commission again before applying.",
  "The Minister decides it directly, with no recommendation from the Commission.",
  "The deal proceeds as an earn-in, with the assignment put off until the work is done."],
 "Regulation 4(7) says the Commission shall approve or disapprove the transaction within 15 working days from receipt of the notification of intention, failing which the application is deemed approved. Nothing lapses and the Minister gains no direct role. An earn-in is a deal's own order of events, which HMRC's manual describes; no regulation turns silence into one.")

q(0, "What does PIA s.95(7)(b) provide when the Minister does not respond to an application?",
 "Consent is deemed granted 60 working days after receipt of the Commission's recommendation.",
 ["The application is deemed refused after 60 working days, and the holder may apply again after a year.",
  "The Commission grants the consent in the Minister's place.",
  "Consent waits until the fee is paid in full."],
 "Section 95(7)(b): where no response on the application has been received within 60 working days from the receipt of the recommendation of the Commission, the consent of the Minister shall be deemed to have been granted. Silence counts as consent, and the Commission recommends while the Minister decides. Payment in full is a separate condition, in reg. 19(6).")

q(3, "How long does reg. 18(3) of the 2024 Regulations give the Commission to answer an application to assign an interest in a PEL?",
 "60 working days from receipt, with its reason given in writing.",
 ["15 working days, the same period the Commission has for a notification of intention.",
  "60 calendar days, after which the application is deemed approved.",
  "No period: the Regulations leave a PEL's timing open."],
 "Regulation 18(3): the Commission shall communicate the reason for the refusal or approval of an assignment of an interest in a PEL in writing to the applicant within 60 working days of the receipt of the application. The 15 working days are for a notification of intention under reg. 4(7), and the period is counted in working days with no deemed approval.")

q(1, "Which provisions the course quotes say that fees for an assignment, or for assigning rights, are not deductible for tax?",
 "PIA s.95(12), AOI Regulations 2024 reg. 19(5), and PIA s.264(f) and s.302(12)(c).",
 ["Only reg. 19(5) of the 2024 Regulations, since the Act itself is silent on the tax treatment of any fee.",
  "None of them: the fee is deductible as a cost of the deal.",
  "Only s.95(12) of the Act, which covers every tax at once."],
 "Section 95(12) says the fee shall not be tax deductible, reg. 19(5) says the same of the processing fee, consent fee and premium, and the tax sections list fees paid for assigning rights to another party as not deductible: s.264(f) for hydrocarbon tax and s.302(12)(c) for companies income tax. The Nigerian fiscal system as a whole is the Petroleum Industry Act course's subject.")

q(0, "Under reg. 19(6) of the 2024 Regulations, what is the consent of the Minister and the Commission held back until?",
 "Full payment of the application and processing fees.",
 ["Completion of the farminee's first earning event, as in an earn-in.",
  "The Minister's signature on the field development plan of the licence.",
  "The end of the Commission's 15 working days for a notification of intention."],
 "Regulation 19(6): the consent of the Minister and the Commission shall not be granted until the appropriate application and processing fees have been fully paid. The Professional tier computes the fee. The earning events, a field development plan and the notification period are separate matters with their own texts.")

q(2, "What does PIA s.233(10) require of a farm out agreement, and what does the engine do with it?",
 "A decommissioning and abandonment plan funded in whole or in part by the incoming parties; the engine computes no such share.",
 ["A decommissioning fund held by the farmor alone, which the engine sizes from the gross cost of the well.",
  "A plan for the farmee's field development, which the engine checks against the earning events.",
  "Nothing on decommissioning: s.233(10) deals only with the consent fee on the value of the transaction."],
 "Section 233(10): where the licensee or lessee is a party to a farm out agreement with one or more third parties, a decommissioning and abandonment plan funded in whole or in part by the applicable third parties shall be provided for in the agreement. The engine computes no decommissioning share and treats it as a concept only. A field development plan is s.94(5), and the fee is s.95(12).")

q(3, "What does PIA s.94(5) add to the Commission's consent to the farm-out of a marginal field?",
 "The farmee must present a field development plan.",
 ["The farmee must be a company incorporated in Nigeria and listed on a public exchange.",
  "The farmor must reimburse the farmee's past costs before any consent is given.",
  "The Minister must consent to it as well."],
 "Section 94(5) makes the consent of the Commission to a marginal field farm-out subject, amongst others, to the farmee presenting a field development plan. Incorporation in Nigeria is a condition the Minister may set on a transferee (s.95(11)(a)), a listed holder is the exception in reg. 3(3), and a reimbursement runs from the farminee to the farmor.")

q(0, "What does the farmout engine compute about consent?",
 "Nothing: it reports who consents in a basis line, and refuses a PEL under the gazetted fee basis.",
 ["It decides whether the Minister's consent is deemed granted, from the dates of the recommendation and the silence.",
  "Deemed approvals: it grants one once 15 working days pass in silence.",
  "It checks each change of control against the 50% line of s.95(14)."],
 "The engine computes no consent. Its fee basis carries the rule in its own words: \"a PPL or PML assignment needs the prior written consent of the Minister on the Commission's recommendation (PIA s.95(1) and (2)); a change of control above 50% is an assignment (s.95(3) and (14)); a PEL assignment needs the consent of the Commission (s.95(15); reg. 16)\". No term in a box states who owns a holder's voting securities.")

q(2, "Which condition on a transferee does PIA s.95(11)(a) name among those the Minister may set?",
 "That it is a company incorporated in Nigeria.",
 ["That it holds no other participating interest in a licence or lease in Nigeria.",
  "That it presents a field development plan before the assignment takes effect.",
  "That it is listed on a public exchange, so that a change in its control needs no consent."],
 "Section 95(11)(a) reads \"(a) is a company incorporated in Nigeria ;\" as the Act prints it, one of the conditions the Minister may set. A field development plan is the marginal field condition of s.94(5), and a public listing is the exception in reg. 3(3) to the consent needed for a change in control. No text the course reads bars a transferee from holding other licences.")

emit(Q, '/root/cat-wip-farmout/banks/ec10b_m05.json', expect_n=15)
finish()
