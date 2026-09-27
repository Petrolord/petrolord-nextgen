#!/usr/bin/env python3
"""WRITE concepts.json: every provision the EC10 digest quotes, with its citation,
the course's paraphrase and an EXACT excerpt of the public text it was read from.

The texts (sources/ in this wave directory, never in the repository):
  PIA    Petroleum Industry Act 2021 (Act No. 6), Official Gazette No. 142,
         Vol. 108, 27 August 2021 (pia_nuprc.txt, the EC7 copy), read
         2026-09-27 for this course
  AOI    Nigerian Upstream Petroleum (Assignment of Interests) Regulations,
         2024, S.I. No. 67 of 2024, Official Gazette No. 61, Vol. 111, 9 April
         2024 (nuprc_assignment_regs_2024.txt, the text of the gazette PDF
         saved as nuprc_assignment_regs_2023.pdf), read 2026-09-27
  HMRC   HM Revenue and Customs, Oil Taxation Manual, pages OT18320, OT18360,
         OT30020 to OT30023, OT30048, OT30081 and OT30131 (Open Government
         Licence v3.0), read 2026-09-27 from the GOV.UK content API
         (hmrc_ot*.json; hmrc_ot.txt is their text, written by
         sources/make_hmrc_txt.py)

Penn State EME 801 (CC BY-NC-SA 4.0) is NEVER quoted: NextGen is commercial,
so the course uses its printed NUMBERS as a cited check and none of its prose.
No licensed model contract (AIPN, AAPL, CAPL) is quoted or named as a source.
Each quote is checked here against its text with whitespace collapsed and
NOTHING else normalised, and the script REFUSES to write if one is not found.
quote_check.py re-checks every quote and that the digest prints each one
exactly.

    python3 make_concepts.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'sources')
TEXTS = {'PIA': 'pia_nuprc.txt', 'AOI': 'nuprc_assignment_regs_2024.txt', 'HMRC': 'hmrc_ot.txt'}


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


AOI = 'AOI Regulations 2024'
# (id, text, cite, quote, paraphrase)
C = [
    # ---- PIA 2021: the farm-out, the assignment and its consent, the fees
    ('pia_94_8b_farmout', 'PIA', 'PIA s.94(8)(b)',
     '(b) “farm-out” means an agreement between the holder of a petroleum mining lease or petroleum prospecting licence and a third party, which permits the third party to explore, prospect, win, work and carry away any petroleum encountered in a licence or lease area',
     'In the marginal field section of the Act, a farm-out is an agreement that lets a third party explore for and produce petroleum in the holder\'s licence or lease area.'),
    ('pia_94_4b_farm_out_discovery', 'PIA', 'PIA s.94(4)(b)',
     '(b) with the consent of the Commission and on terms and conditions as the Commission may approve under regulations, farm out the discovery ; or',
     'The holder of a marginal field may farm out the discovery with the consent of the Commission.'),
    ('pia_94_5_farmee', 'PIA', 'PIA s.94(5)',
     '(5) The consent of the Commission to the farm-out of a marginal field under subsection (4) (b) shall, amongst others, be subject to the farmee presenting a field development plan',
     'The Commission\'s consent to a marginal field farm-out requires the farmee to present a field development plan.'),
    ('pia_95_2_recommendation', 'PIA', 'PIA s.95(2)',
     '(2) The consent of the Minister under subsection (1) shall be granted upon the recommendation of the Commission.',
     'The Minister consents to an assignment on the Commission\'s recommendation.'),
    ('pia_95_3_change_of_control', 'PIA', 'PIA s.95(3)',
     '(3) For the purpose of subsection (1), a change of control in the holder of a licence or lease under subsection (1) shall be deemed to be an assignment.',
     'A change of control of a licence holder counts as an assignment.'),
    ('pia_95_4_application', 'PIA', 'PIA s.95(4)',
     'shall make an application for approval of the transfer to the Commission in the format prescribed by the Commission,',
     'A holder that wishes to transfer its interest applies to the Commission in the prescribed format.'),
    ('pia_95_7b_deemed', 'PIA', 'PIA s.95(7)(b)',
     '(b) no response on the application has been received within 60 working days from the receipt of the recommendation of the Commission, the consent of the Minister under subsection (1) shall be deemed to have been granted.',
     'If the Minister does not respond within 60 working days of the Commission\'s recommendation, consent is deemed granted.'),
    ('pia_95_11a_incorporated', 'PIA', 'PIA s.95(11)(a)',
     '(a) is a company incorporated in Nigeria ;',
     'One condition the Minister may set is that the transferee is a company incorporated in Nigeria.'),
    ('pia_95_12_fee', 'PIA', 'PIA s.95(12)',
     '(12) The Commission shall make regulation to prescribe for payment of fees as a condition for any transaction under subsection (1), which fee shall be based on a percentage of the value of the transaction and shall not be tax deductible.',
     'The Commission sets by regulation a fee on each assignment, a percentage of the value of the transaction and not tax deductible.'),
    ('pia_95_14_control', 'PIA', 'PIA s.95(14)',
     '“change of control” means any person or persons acting jointly or in concert, to acquire direct or indirect beneficial ownership of a percentage of the voting power of the outstanding voting securities of the holder, by contract or otherwise, that exceeds 50% at any time.',
     'A change of control is the acquisition of more than 50 percent of the holder\'s voting power by persons acting together.'),
    ('pia_95_15_pel', 'PIA', 'PIA s.95(15)',
     '(15) A holder of a petroleum exploration licence shall not assign, novate or transfer his licence or any right, power or interest without prior written consent of the Commission.',
     'A petroleum exploration licence is assigned only with the prior written consent of the Commission.'),
    ('pia_233_10_decommissioning', 'PIA', 'PIA s.233(10)',
     '(10) Where the licensee or lessee is a party to a farm out agreement with one or more third parties, a decommissioning and abandonment plan funded in whole or in part by the applicable third parties shall be provided for in the applicable farm out agreement.',
     'A farm-out agreement must provide for a decommissioning and abandonment plan funded by the incoming parties in whole or in part.'),
    ('pia_264_f_not_deductible', 'PIA', 'PIA s.264(f)',
     'bonuses or fees paid for renewing petroleum mining lease or petroleum prospecting licence or marginal field or fees paid for assigning rights to another party ;',
     'For hydrocarbon tax, fees paid for assigning rights to another party are not deductible.'),
    ('pia_302_12c_not_deductible', 'PIA', 'PIA s.302(12)(c)',
     'signature bonuses or fees paid for renewing petroleum mining lease or petroleum prospecting licence or fees paid for assigning rights to another party including for marginal fields ;',
     'For companies income tax, fees paid for assigning rights to another party are not deductible either.'),
    # ---- the Assignment of Interests Regulations 2024
    ('aoi_cover_title', 'AOI', f'{AOI}, the gazette cover (S.I. No. 67)',
     '67 Nigeria Upstream Petroleum (Assignment of Interest) Regulations, 2024',
     'The gazette cover lists the instrument under a shorter title.'),
    ('aoi_arrangement_citation', 'AOI', f'{AOI}, the arrangement of regulations',
     '22. General provisions 23. Revocation 24. Interpretation 25. Citation',
     'The arrangement at the front numbers the last four regulations from 22 to 25.'),
    ('aoi_23_guidelines', 'AOI', f'{AOI} reg. 23',
     '23. The Commission may from time to time, make and publish guidelines',
     'The body\'s regulation 23 is on guidelines.'),
    ('aoi_26_citation', 'AOI', f'{AOI} reg. 26 (the citation, as the body numbers it)',
     '26. These Regulations may be cited as the Nigerian Upstream Petroleum',
     'The body numbers its citation regulation 26.'),
    ('aoi_3_3_control', 'AOI', f'{AOI} reg. 3(3)',
     '(3) A change in the control of a company that holds an interest in a licence or lease, (a “holder”), other than a licensee, lessee or indirect controller of a licence or lease listed on a public exchange, shall require prior written consent of the Minister.',
     'A change in the control of a holder needs the Minister\'s prior written consent, unless the holder is listed on a public exchange.'),
    ('aoi_4_2_application', 'AOI', f'{AOI} reg. 4(2)',
     '(2) Application for consent of the Minister under the Act and these Regulations shall be made to the Commission in the manner prescribed in these Regulations,',
     'The application for the Minister\'s consent is made to the Commission.'),
    ('aoi_4_4b_reasons', 'AOI', f'{AOI} reg. 4(4)(b)',
     'stating the reason for the intended assignment, the method intended to be used for the conduct of the transaction, and possible technical and economic benefits derivable from the transaction',
     'The notification of intention states the reason for the assignment, the method of the transaction and its expected benefits.'),
    ('aoi_4_7_fifteen_days', 'AOI', f'{AOI} reg. 4(7)',
     '(7) The Commission shall within 15 working days from date of receipt of the notification of intention under sub-regulation (4)(a) of this regulation, approve or disapprove the transaction, failing which the application is deemed approved',
     'The Commission answers the notification within 15 working days, or it is deemed approved.'),
    ('aoi_16c_pel_control', 'AOI', f'{AOI} reg. 16(c)',
     '(c) a change in control of a company that holds an interest in a PEL shall require prior written consent of the Commission.',
     'For a petroleum exploration licence the consent is the Commission\'s.'),
    ('aoi_18_3_pel_decision', 'AOI', f'{AOI} reg. 18(3)',
     'the Commission shall communicate the reason for the refusal or approval of an assignment of an interest in a PEL in writing to the applicant within 60 working days of the receipt of the application.',
     'The Commission answers a PEL assignment application in writing within 60 working days.'),
    ('aoi_19_2_seven_per_cent', 'AOI', f'{AOI} reg. 19(2)',
     '(2) The consent of the Minister in respect of an assignment pursuant to these Regulations shall be by the payment of seven per cent of the value of the transaction, comprising two percent processing fee and five per cent premium,',
     'The Minister\'s consent costs seven per cent of the value of the transaction: two per cent processing fee and five per cent premium.'),
    ('aoi_19_2_intra_group', 'AOI', f'{AOI} reg. 19(2), proviso',
     'provided that consent to an Assignment in an intra group transfer shall only be subject to the payment of two per cent processing fee.',
     'An intra group transfer pays the two per cent processing fee alone.'),
    ('aoi_19_3a_amount_payable', 'AOI', f'{AOI} reg. 19(3)(a)',
     '(3) The value of transaction pursuant to sub-regulation (2) of this regulation shall be by either the amount — (a) payable to the Assignor, as stated in the application or transaction contract; or',
     'The value of the transaction is either the amount payable to the assignor stated in the application or contract.'),
    ('aoi_19_3b_prescribed', 'AOI', f'{AOI} reg. 19(3)(b)',
     '(b) prescribed by the Commission, using the metrics for the determination of good and valuable consideration for the asset at the relevant time.',
     'Or it is an amount the Commission prescribes from its metrics for good and valuable consideration.'),
    ('aoi_19_5_not_deductible', 'AOI', f'{AOI} reg. 19(5)',
     '(5) Any payment made as processing fee, consent fee, or premium under these Regulations shall not be tax deductible.',
     'The processing fee, consent fee and premium are not tax deductible.'),
    ('aoi_19_6_paid_before', 'AOI', f'{AOI} reg. 19(6)',
     '(6) The consent of the Minister and the Commission shall not be granted until the appropriate application and processing fees have been fully paid.',
     'Consent is not granted until the application and processing fees are paid in full.'),
    ('aoi_19_7_ninety_days', 'AOI', f'{AOI} reg. 19(7)',
     '(7) Every Assignor shall be required to pay an applicable fee to an account provided by the Commission within 90 days of notification of the grant of the relevant consent',
     'The assignor pays the fee within 90 days of the notification of the grant of consent.'),
    ('aoi_19_8_thirty_more', 'AOI', f'{AOI} reg. 19(8)',
     'the Assignor shall have an additional 30 days within which to pay or complete payment.',
     'An assignor that has not paid in full within the 90 days has 30 days more.'),
    ('aoi_19_9_surcharge', 'AOI', f'{AOI} reg. 19(9)',
     'shall impose a surcharge of 0.01% of the stipulated amount per day on a straight-line basis for 90 days failing which the consent is deemed withdrawn.',
     'After the 30 days, a surcharge of 0.01 per cent of the fee a day runs for 90 days, after which the consent is deemed withdrawn.'),
    ('aoi_24_value', 'AOI', f'{AOI} reg. 24, "Value of the Transaction"',
     '“Value of the Transaction” means the amount determined by the Commission to be the value receivable by the Assignor for an Assignment,',
     'The interpretation regulation defines the value of the transaction again, as the amount the Commission determines the assignor receives.'),
    ('aoi_24_assignment_d', 'AOI', f'{AOI} reg. 24, "Assignment" (d)',
     '(d) assignment by a contractor or joint venture partner under an upstream petroleum arrangement, including joint venture arrangement, production sharing contract, production sharing agreement, service contract, under a sole risk award or a marginal field.',
     'An assignment includes one by a contractor or joint venture partner under any upstream arrangement.'),
    ('aoi_24_petroleum_agreement', 'AOI', f'{AOI} reg. 24, "Petroleum Agreement"',
     '“Petroleum Agreement” includes any or all of the following documents and or arrangements including, production sharing contracts, joint operating agreements, joint venture agreements, farm-in-agreements or any other document',
     'A farm-in agreement is one of the petroleum agreements the Regulations name.'),
    # ---- HMRC Oil Taxation Manual (OGL v3.0)
    ('hmrc_ot30020_farm_out', 'HMRC', 'HMRC Oil Taxation Manual OT30020',
     'A Farm Out involves the disposal of a licence interest by the owner - the Farmer Out in return for consideration given by the Farmer In.',
     'A farm out is the disposal of a licence interest by its owner for consideration given by the incoming party.'),
    ('hmrc_ot30021_consideration', 'HMRC', 'HMRC Oil Taxation Manual OT30021',
     'For relatively unexplored acreage consideration will generally consist wholly, or mainly, of the Farmer in undertaking to bear future costs (e.g. drilling).',
     'On unexplored acreage the consideration is mainly the incoming party paying future costs such as drilling.'),
    ('hmrc_ot30021_farm_in', 'HMRC', 'HMRC Oil Taxation Manual OT30021',
     'The assignment is normally made, subject to government consent, before the work is undertaken and is called a Farm in.',
     'In a farm in the interest is assigned before the work is done.'),
    ('hmrc_ot30021_earn_in', 'HMRC', 'HMRC Oil Taxation Manual OT30021',
     'In contrast, an agreement under which the work obligation is to be completed before the assignment is generally referred to as an earn-in.',
     'In an earn-in the work is completed before the assignment.'),
    ('hmrc_ot30021_reimbursement', 'HMRC', 'HMRC Oil Taxation Manual OT30021',
     'The Farmer in may also pay a cash reimbursement to the farmer out for sunk costs relating to the proportionate interest acquired,',
     'The incoming party may also reimburse sunk costs in cash for the share it acquires.'),
    ('hmrc_ot30022_carry', 'HMRC', 'HMRC Oil Taxation Manual OT30022',
     'The Farmer in may therefore agree to “carry” the Farmer out by meeting the subsequent development costs relating to the farmer out’s retained interest.',
     'In a development carry the incoming party pays the development costs of the retained interest.'),
    ('hmrc_ot30022_recovered', 'HMRC', 'HMRC Oil Taxation Manual OT30022',
     'Those costs, probably with an interest element, will normally be recovered from the proceeds of the proportion of the production accruing to the Farmer out’s retained interest.',
     'Those costs are usually recovered, with an interest element, from the production of the retained interest.'),
    ('hmrc_ot30023_producing', 'HMRC', 'HMRC Oil Taxation Manual OT30023',
     'The consideration for the disposal of an interest in a producing field is generally in the form of cash or shares.',
     'An interest in a producing field is usually sold for cash or shares.'),
    ('hmrc_ot30048_obligation', 'HMRC', 'HMRC Oil Taxation Manual OT30048',
     'The phrase “obligation to undertake” is intended to cover all cases where the farmer in commits himself to bear his and the farmer out’s share of the costs of exploration or appraisal work',
     'A work programme obligation covers the incoming party paying its own share and the outgoing party\'s share of the work.'),
    ('hmrc_ot30081_reimbursement', 'HMRC', 'HMRC Oil Taxation Manual OT30081',
     'The reimbursement should therefore be treated as cash consideration for the licence interest acquired.',
     'A reimbursement of earlier costs is cash consideration for the interest.'),
    ('hmrc_ot30131_value', 'HMRC', 'HMRC Oil Taxation Manual OT30131',
     'The value of the right will need to reflect the degree of probability that future benefits will accrue as well as their extent',
     'A right to future benefits is valued by their chance as well as their size.'),
    ('hmrc_ot18320_farmee', 'HMRC', 'HMRC Oil Taxation Manual OT18320',
     'The increasing interest party (farmer-in or farmee) undertaking a work programme at his own expense,',
     'The same manual calls the incoming party the increasing interest party, the farmer-in or the farmee.'),
    ('hmrc_ot18360_simple_interest', 'HMRC', 'HMRC Oil Taxation Manual OT18360',
     'the increasing interest party may also stipulate in the agreement that he recover his costs, usually including an addition representing simple interest, out of production relating to the reducing interest party’s licence interest.',
     'A development carry is usually recovered with an addition for simple interest out of the carried party\'s production.'),
    ('hmrc_ot18360_payback', 'HMRC', 'HMRC Oil Taxation Manual OT18360',
     'When his costs are recovered this is referred to as payback.',
     'The moment the carry is recovered is called payback.'),
]


def main():
    body = {k: norm(open(os.path.join(SRC, f), encoding='utf-8').read()) for k, f in TEXTS.items()}
    out, bad = [], []
    ids = set()
    for cid, text, cite, quote, para in C:
        q = norm(quote)
        if cid in ids:
            bad.append(f'{cid}: repeated id')
        ids.add(cid)
        n = len(q.split())
        if not (6 <= n <= 50):
            bad.append(f'{cid}: {n} words (6 to 50)')
        if q not in body[text]:
            bad.append(f'{cid}: NOT FOUND in {text}: {q[:90]}')
        if re.search('[—–]', para) or re.search(r',\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b', para, re.I):
            bad.append(f'{cid}: the paraphrase breaks the copy rule')
        out.append({'id': cid, 'text': text, 'source': TEXTS[text], 'cite': cite, 'quote': q, 'paraphrase': para, 'found': True})
    if bad:
        print('REFUSED, nothing written:')
        for b in bad:
            print('  ' + b)
        sys.exit(1)
    json.dump(out, open(os.path.join(HERE, 'concepts.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    open(os.path.join(HERE, 'concepts.json'), 'a').write('\n')
    per = {}
    for c in out:
        per[c['text']] = per.get(c['text'], 0) + 1
    print(f'concepts.json: {len(out)} quotations, every one found in its text: {per}')


main()
