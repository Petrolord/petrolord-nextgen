import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Professional m05, The Consent Fee.
# Every figure is quoted from digest.txt, where the engine returned it on the
# Ekene consent (a PPL, a stated value of the transaction of 5600000.000000,
# "contract-amount", notified 2027-05-03 and paid 2027-07-30) or on a stated
# golden input, and every key was re-run through the vendored engine by the
# writer's witness. Every fee question states its value of the transaction and
# its dates. The rates are the gazetted ones of reg. 19(2); no reading is keyed
# as the law. No capstone name, term, series or value.

q(1, "EKO's farm-out moves part of its PPL interest to FIN, and the Minister's consent is priced by reg. 19(2) of the 2024 Regulations. The fee call states basis \"nuprc-2024-r19\", a value of the transaction of 5600000.000000 (\"contract-amount\"), intraGroup false, and notification and payment on 2027-05-03 and 2027-07-30. What fee comes back?",
 "392000.000000, seven per cent of the stated value",
 ["280000.000000, the premium alone, since the processing fee is paid with the application and outside reg. 19(2)",
  "112000.000000, the processing fee alone",
  "392039.200000, the fee with a day of surcharge added for the payment falling after the notification date"],
 "The engine's reason reads \"PPL: 2% processing + 5% premium on the value of the transaction 5600000 (the amount payable to the Assignor stated in the contract, reg. 19(3)) = 392000; paid by the Assignor and not tax deductible\". 280000.000000 and 112000.000000 are its two parts. The payment falls 88 days after the notification, inside the 90 days of reg. 19(7), so no surcharge runs.")

q(3, "Break the Ekene consent fee into its two gazetted parts. Terms: PPL, \"nuprc-2024-r19\", 5600000.000000 as \"contract-amount\", outside any group, 2027-05-03 to 2027-07-30. Which split is returned?",
 "A processing fee of 112000.000000 at 2.000000 percent and a premium of 280000.000000 at 5.000000 percent",
 ["A processing fee of 280000.000000 at 5.000000 percent and a premium of 112000.000000, the two rates the other way round",
  "One fee of 392000.000000, since the Regulations set no split",
  "A processing fee of 112000.000000 and no premium"],
 "The engine's basis reads \"seven per cent of the value of the transaction: two per cent processing fee and five per cent premium; an intra group transfer two per cent (reg. 19(2))\", and it returns 112000.000000 and 280000.000000. Reg. 19(2) itself prints the split. A fee of the processing part alone is the intra group case.")

q(0, "Suppose FIN were a company in EKO's own group, so intraGroup is true; everything else about the PPL call stays (5600000.000000, \"contract-amount\", \"nuprc-2024-r19\", notified 2027-05-03, paid 2027-07-30). Which fee is charged?",
 "112000.000000, the processing fee alone",
 ["392000.000000, since a transfer inside one group still changes the licence and pays the whole seven per cent",
  "280000.000000, the premium alone, as the processing is waived inside a group",
  "0.000000, since a transfer inside one group needs no consent and so pays no fee to the Commission"],
 "The engine's reason reads \"PPL: 2% processing on the value of the transaction 5600000 (the amount payable to the Assignor stated in the contract, reg. 19(3)) = 112000 (an intra group transfer: the processing fee alone)\". Reg. 19(2)'s proviso subjects an intra group transfer to the two per cent processing fee only, so the premium goes and the processing stays.")

q(2, "Where does the 5600000.000000 on the Ekene PPL consent (\"contract-amount\", notified 2027-05-03, paid 2027-07-30) come from, as far as the engine is concerned? Choose its own basis line.",
 "the value of the transaction is a stated input: the sum payable to the Assignor stated in the application or contract, or an amount the Commission determines (reg. 19(3)); the engine does not decide which consideration of a farm-out counts",
 ["the value of the transaction is the consideration the engine computes for the deal: the carry, the cash bonus and the reimbursement together, which it passes to the fee call itself",
  "the value of the transaction is the success-case value of the interest assigned, risked at the stated chance, which the engine takes from the deal call",
  "the value of the transaction is a market value the engine sets"],
 "The engine's basis reads \"the value of the transaction is a stated input: the sum payable to the Assignor stated in the application or contract, or an amount the Commission determines (reg. 19(3)); the engine does not decide which consideration of a farm-out counts\". It takes the amount and its source from the caller and charges the gazetted rates on it. It passes no consideration to the fee call and prices no interest at a market value.")

q(0, "The fixture builds its 5600000.000000 from the 2000000.000000 cash bonus plus the 3600000.000000 reimbursement (a PPL consent notified 2027-05-03 and paid 2027-07-30). If a deal counted its carry in that value as well, what would change?",
 "The deal states a larger value, and the engine charges seven per cent of it",
 ["The engine adds the carry itself, since the consideration always counts in full",
  "The engine refuses, as a carry cannot sit in a value",
  "Nothing changes: the fee is 392000.000000 whatever is counted in the value"],
 "Which parts of a farm-out's consideration the value covers is the caller's statement with its source (reg. 19(3)), and the engine's basis says it \"does not decide which consideration of a farm-out counts\". The Ekene fixture counts the bonus and the reimbursement; a deal that counts its carry states a larger value, and the engine charges the gazetted rates on whatever amount the call states. The fee moves with the value.")

q(2, "An exploration licence is being assigned, so the call states licence \"PEL\" while keeping the gazetted basis \"nuprc-2024-r19\" and the Ekene figures (5600000.000000, \"contract-amount\", intraGroup false, 2027-05-03 and 2027-07-30). What comes back?",
 "A refusal: reg. 19(2) sets the fee for the Minister's consent, a PEL needs the Commission's, and its rates go under basis \"stated\"",
 ["A result of 392000.000000, the gazetted seven per cent applied to a PEL the same way as to a PPL",
  "A result of 112000.000000, the processing fee alone, a PEL paying no premium under reg. 19(2)",
  "A refusal: a PEL cannot be assigned at all, since the Act allows no transfer of an exploration licence to anyone"],
 "The engine's words: \"licence must be \"PPL\" or \"PML\" under basis \"nuprc-2024-r19\": reg. 19(2) sets the fee for the consent of the Minister, and a PEL assignment needs the consent of the Commission (reg. 16); state its rates under basis \"stated\"; got \"PEL\"\". A PEL can be assigned with the Commission's prior written consent (PIA s.95(15)), and the engine prices it only on rates the caller states.")

q(3, "Under the basis \"stated\" a call prices a PEL assignment at 1.500000 percent processing and 0.000000 percent premium, on a value of the transaction of 1000000.000000 stated as \"commission-determined\", with no payment dates. What fee does the engine return?",
 "15000.000000",
 ["392000.000000, the gazetted Ekene fee, which applies whatever rates the call states",
  "112000.000000, the gazetted two per cent processing fee, which a PEL pays as well",
  "0.000000, since a PEL assignment pays no fee under the 2024 Regulations"],
 "The engine's reason reads \"PEL: 1.5% processing on the value of the transaction 1000000 (an amount the Commission determines, reg. 19(3)) = 15000; paid by the Assignor and not tax deductible\". The rates are stated inputs and no gazetted figure: reg. 19(2) sets the fee for the Minister's consent only. Under \"stated\" the engine applies the caller's rates and none of its own.")

q(1, "Trying to negotiate the rate down, a learner adds ratesPct { processingPct 1, premiumPct 1 } to the gazetted call (PPL, \"nuprc-2024-r19\", 5600000.000000, \"contract-amount\", intraGroup false, 2027-05-03 and 2027-07-30). How does the engine respond?",
 "ratesPct must be left out under basis \"nuprc-2024-r19\" (2% processing and 5% premium, reg. 19(2)); got {\"processingPct\":1,\"premiumPct\":1}",
 ["A result of 112000.000000, the stated 1 and 1 per cent applied to the value of the transaction, since a stated rate always wins over a gazetted one",
  "A result of 392000.000000, the stated rates overridden by the gazetted ones and the override noted in the basis for the caller to read later",
  "ratesPct must be an object { processingPct, premiumPct } under basis \"stated\" (no default); got nothing"],
 "Under the gazetted basis the rates are the Regulations', so a stated rate is refused, in the engine's words: \"ratesPct must be left out under basis \"nuprc-2024-r19\" (2% processing and 5% premium, reg. 19(2)); got {\"processingPct\":1,\"premiumPct\":1}\". The engine overrides nothing silently. The other message is the one for a \"stated\" call with no rates.")

q(3, "Believing the interest is worth more on the open market, a learner sets valueSource to \"market\" on the PPL call (5600000.000000, intraGroup false, notified 2027-05-03, paid 2027-07-30). Which reply is printed?",
 "valueSource must be one of \"contract-amount\", \"commission-determined\"; got \"market\"",
 ["A result of 392000.000000, the source reported",
  "A result at a market value the engine sets",
  "valueSource must be \"commission-determined\"; got \"market\""],
 "The engine refuses the source by name: \"valueSource must be one of \"contract-amount\", \"commission-determined\"; got \"market\"\". The two accepted sources are the two limbs of reg. 19(3): the amount payable to the assignor stated in the application or contract, or an amount the Commission prescribes. The engine sets no market value for any interest.")

q(0, "The intra group control is set to not stated on an otherwise complete PPL call (5600000.000000 as \"contract-amount\", gazetted basis, 2027-05-03 and 2027-07-30). Which answer appears?",
 "intraGroup must be true or false (stated; no default); got nothing",
 ["A result of 392000.000000, a transfer being taken as outside any group unless the call says otherwise",
  "A result of 112000.000000, the lower of the two fees the Regulations allow, reported with a warning",
  "intraGroup must be left out under basis \"stated\" (the stated rates apply); got nothing"],
 "The engine's words: \"intraGroup must be true or false (stated; no default); got nothing\". Whether a transfer is intra group moves the fee from 392000.000000 to 112000.000000, so the engine assumes neither. The \"left out\" message belongs to a call under the basis \"stated\".")

q(1, "Can EKO set the consent fee on its PPL assignment (5600000.000000; 2027-05-03 to 2027-07-30) against its taxes? Pick the treatment the engine's basis states.",
 "Not tax deductible, citing reg. 19(5) and PIA s.95(12), with PIA s.264(f) and s.302(12)(c) for fees paid for assigning rights",
 ["Deductible against hydrocarbon tax as a cost of acquiring the interest, under PIA s.264(f), and against companies income tax too",
  "Deductible for companies income tax only, under PIA s.302(12)(c)",
  "Not a tax question: the engine's basis is silent on it"],
 "The engine's basis reads \"not tax deductible (reg. 19(5); PIA s.95(12)); fees paid for assigning rights to another party are not deductible (PIA s.264(f) and s.302(12)(c))\". Both PIA sections list fees paid for assigning rights among the items that are not deductible, for hydrocarbon tax and for companies income tax. The engine computes no tax on the deal.")

q(2, "Whose approval does a Nigerian assignment need? The engine prints its answer in the basis of every fee call, such as the Ekene PPL call (5600000.000000; 2027-05-03 and 2027-07-30). Which is it?",
 "a PPL or PML assignment needs the prior written consent of the Minister on the Commission's recommendation (PIA s.95(1) and (2)); a change of control above 50% is an assignment (s.95(3) and (14)); a PEL assignment needs the consent of the Commission (s.95(15); reg. 16)",
 ["every assignment needs the consent of the Commission alone, which the Minister then notes (PIA s.95(15))",
  "a PPL or PML assignment needs the Minister's consent; a change of control at 50% or more is an assignment",
  "only a change of control needs consent (reg. 3(3))"],
 "The engine's basis reads \"a PPL or PML assignment needs the prior written consent of the Minister on the Commission's recommendation (PIA s.95(1) and (2)); a change of control above 50% is an assignment (s.95(3) and (14)); a PEL assignment needs the consent of the Commission (s.95(15); reg. 16)\". The Act's line is voting power that \"exceeds 50%\" (PIA s.95(14)), so exactly 50 percent is no change of control. For a PEL the consent is the Commission's (PIA s.95(15); AOI Regulations 2024 reg. 16(c)).")

q(0, "Carry the consent fee into the value of the deal: dealValue is handed assignor fees of 392000.000000, the fee on the Ekene 5600000.000000 (PPL, 2027-05-03 and 2027-07-30). Where is it counted?",
 "In EKO's position in both outcomes: its dry hole after the farm-out is -6792000.000000",
 ["In FIN's position, the farminee paying the fee as the party that acquires the interest from EKO",
  "Only on the success outcome, since a dry hole leaves no interest worth assigning",
  "Nowhere: the fee is reported by the fee call alone and kept out of every EMV of the deal"],
 "The engine's basis says the farmor \"pays the assignor fees in both outcomes\", and the assignor pays the fee (reg. 19(7)). EKO's dry hole after the farm-out is -6792000.000000 (engine): 12000000.000000 of well cost and the fees paid out, the bonus and reimbursement received. The fees also appear in the transfer identity, leaving both sides.")

q(2, "Which edition does the course give for the Nigerian Upstream Petroleum (Assignment of Interests) Regulations, 2024, the text behind the Ekene fee on 5600000.000000 (PPL, notified 2027-05-03, paid 2027-07-30)?",
 "S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111, 9 April 2024, read on 2026-09-27",
 ["Act No. 6, Official Gazette No. 142, Vol. 108, 27 August 2021, the edition of the Act itself, read on 2026-09-27",
  "S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111, 13 March 2024, the gazette date of the instrument",
  "Official Gazette No. 142, Vol. 108, 9 April 2024, the edition of the Commission's own guidelines"],
 "The course's sources table gives the Regulations as S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111, 9 April 2024 (made 13 March 2024), read on 2026-09-27. 13 March 2024 is the day the instrument was made, and the gazette is dated 9 April 2024. Act No. 6 of 27 August 2021 is the Petroleum Industry Act 2021.")

q(3, "Switching a PEL call to the basis \"stated\" but leaving both rate boxes empty (value of the transaction 1, \"contract-amount\", no dates), what does a learner get back?",
 "ratesPct must be an object { processingPct, premiumPct } under basis \"stated\" (no default); got nothing",
 ["A result at the gazetted two per cent processing and five per cent premium, the engine's fallback rates",
  "A result of 0.000000, no rate being stated and so no fee being charged on the value of the transaction",
  "ratesPct must be left out under basis \"nuprc-2024-r19\" (2% processing and 5% premium, reg. 19(2)); got nothing"],
 "The engine's words: \"ratesPct must be an object { processingPct, premiumPct } under basis \"stated\" (no default); got nothing\". Under \"stated\" the rates are the caller's, and a call without them is refused; the engine applies no gazetted rate to a PEL and charges no fee of 0 by omission.")

emit(Q, '/root/cat-wip-farmout/banks/ec10i_m05.json', expect_n=15)
finish()
