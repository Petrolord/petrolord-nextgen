#!/usr/bin/env python3
"""WRITE concepts.json: every provision the EC11 digest quotes, with its citation,
the course's paraphrase and an EXACT excerpt of the public text it was read from.

The texts (sources/ in this wave directory, never in the repository), every one
read 2026-09-27:
  PIA    Petroleum Industry Act 2021 (Act No. 6), Official Gazette No. 142,
         Vol. 108, 27 August 2021 (pia_nuprc.txt, the text of the searchable
         gazette PDF pia_nuprc.pdf, the copy the EC7 and EC10 courses read)
  SI37   Significant Crude Oil and Gas Discovery Regulations, 2023, S.I. No. 37
         of 2023, Official Gazette No. 111, Vol. 110, 20 June 2023 (made 24 May
         2023), the NUPRC-hosted PDF and its text
  SEC    17 CFR 229.1202 and 229.1203 (Regulation S-K Items 1202 and 1203) and
         17 CFR 210.4-10 (Regulation S-X Rule 4-10), the eCFR versions current
         at 2026-09-01 (US federal text, public domain), their text

NEVER QUOTED, used for their NUMBERS and SECTION NUMBERS only:
  * SPE-PRMS 2018 (licensed CC BY-NC-ND 4.0; this course is sold);
  * the SPE OGRC PRMS FAQs (copyright SPE, all rights reserved);
  * the 2011 Guidelines for Application of the PRMS (no licence printed;
    treated as copyright);
  * the NUPRC media release of 1 April 2026 (its page reads "All rights
    reserved"; its figures are cited);
  * the Nigerian Upstream Petroleum (Commercial) Regulations, 2025 (taught by
    concept, as the lead decided).
gate_no_prms_prose.py refuses any eight-word run of the first three in anything
a learner reads, and no concept here names them.

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
SI37_TXT = 'n_Nigerian_Upstream_Significant_Crude_Oil_and_Gas_Recovery_Regulations_2023_d00669111fcd0e4ce060e86b.txt'
TEXTS = {'PIA': ['pia_nuprc.txt'], 'SI37': [SI37_TXT], 'SEC': ['ecfr_229.1202.txt', 'ecfr_229.1203.txt', 'ecfr_210_4-10.txt']}


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def body_of(text):
    return ' '.join(norm(open(os.path.join(SRC, f), encoding='utf-8').read()) for f in TEXTS[text])


SI = 'S.I. No. 37 of 2023'
# (id, text, cite, quote, paraphrase)
C = [
    # ---- PIA 2021: the Commission's reserves function, the declarations after an appraisal, retention, the plan, the definitions
    ('pia_7i_national_reserves', 'PIA', 'PIA s.7(i)',
     '(i) undertake evaluation of national reserves and develop policies for prudent reservoir management practices ;',
     'One function of the Commission is to evaluate the national reserves and set policy for prudent reservoir management.'),
    ('pia_78_8_upon_completion', 'PIA', 'PIA s.78(8)',
     '(8) The licensee shall, upon the completion of the appraisal program',
     'When the appraisal programme is complete the licensee makes one of three declarations.'),
    ('pia_78_8ab_declarations', 'PIA', 'PIA s.78(8)(a) and (b)',
     '(a) declare a commercial discovery ; (b) declare a significant gas discovery or a significant crude oil discovery ; or',
     'The first two declarations are a commercial discovery, or a significant gas or crude oil discovery.'),
    ('pia_78_8c_no_interest', 'PIA', 'PIA s.78(8)(c)',
     '(c) inform the Commission that the discovery is of no interest to the licensee.',
     'The third is to tell the Commission the discovery is of no interest.'),
    ('pia_78_9_retain', 'PIA', 'PIA s.78(9)',
     'the licensee shall be entitled to retain the area of such significant gas discovery or significant crude oil discovery for a retention period as may be determined by the Commission,',
     'After a significant discovery is declared, the licensee may keep the area for a retention period the Commission sets.'),
    ('pia_78_9_ten_years', 'PIA', 'PIA s.78(9)',
     'which shall not be more than 10 years from the day the declaration was made',
     'The retention period runs at most ten years from the declaration.'),
    ('pia_78_13_relinquished', 'PIA', 'PIA s.78(13)',
     '(13) Where, upon the expiry of the retention period determined under subsection (9), the licensee has not declared a commercial discovery, the area declared under subsection (9) shall be immediately relinquished by the licensee.',
     'If no commercial discovery is declared by the end of the retention period, the area is relinquished at once.'),
    ('pia_78_15_no_interest', 'PIA', 'PIA s.78(15)',
     '(15) Where a licensee declares a discovery of no interest under subsection (3) or (8), the Commission may require the relinquishment of the parcels that cover the structure of such discovery.',
     'A discovery declared of no interest may have to be relinquished over its structure.'),
    ('pia_79_1_declares', 'PIA', 'PIA s.79(1)',
     'declares a commercial discovery under section 78 (8) (a) of this Act, the',
     'Section 79 applies once a licensee declares a commercial discovery.'),
    ('pia_79_1_two_years', 'PIA', 'PIA s.79(1)',
     'licensee shall within two years of the declaration, submit to the Commission a',
     'The licensee then submits a field development plan to the Commission within two years of the declaration.'),
    ('pia_318_commercial_discovery', 'PIA', 'PIA s.318, "commercial discovery"',
     '“commercial discovery” means a discovery of crude oil, natural gas or condensates within a petroleum prospecting licence or petroleum mining lease which can be economically developed in the opinion of the licensee or lessee after consideration of all relevant economic factors',
     'A commercial discovery is one the licensee judges can be economically developed after weighing all the relevant economic factors.'),
    ('pia_318_significant_crude', 'PIA', 'PIA s.318, "significant crude oil discovery"',
     '“Significant crude oil discovery” means a discovery of crude oil that is substantial in terms of reserves and is potentially commercial, but cannot be declared commercial for one or both of the following reasons',
     'A significant crude oil discovery is substantial and potentially commercial, and cannot yet be declared commercial for one of two stated reasons.'),
    ('pia_318_crude_reason_b', 'PIA', 'PIA s.318, "significant crude oil discovery", (b)',
     '(b) where the crude oil discovery would only be commercial when jointly developed with other existing discoveries or potential future discoveries ;',
     'One reason is that the discovery would be commercial only when developed jointly with other discoveries.'),
    ('pia_318_significant_gas', 'PIA', 'PIA s.318, "significant gas discovery"',
     '“significant gas discovery” means a discovery of natural gas that is substantial in terms of reserves and is potentially commercial, but cannot be declared commercial for one or more of the following reasons',
     'A significant gas discovery is substantial and potentially commercial, and cannot yet be declared commercial for one or more stated reasons.'),
    ('pia_318_gas_reasons_ab', 'PIA', 'PIA s.318, "significant gas discovery", (a) and (b)',
     '(a) no markets for natural gas within Nigeria ; (b) export markets need to be identified and developed ;',
     'Two of the reasons are no gas market in Nigeria and export markets still to be found.'),
    # ---- S.I. No. 37 of 2023, the Significant Crude Oil and Gas Discovery Regulations
    ('si37_citation', 'SI37', f'{SI}, the heading',
     'S. I. No. 37 of 2023 PETROLEUM INDUSTRY ACT, NO. 6, 2021',
     'The Regulations are S.I. No. 37 of 2023, made under the Petroleum Industry Act 2021.'),
    ('si37_3_reasons', 'SI37', f'{SI} reg. 3',
     'be declared commercial due to one or both of the following reasons :',
     'Regulation 3 repeats the Act\'s two reasons a substantial crude oil discovery cannot yet be declared commercial.'),
    ('si37_3_substantial', 'SI37', f'{SI} reg. 3',
     'that is substantial in terms of reserves and is potentially commercial, but cannot',
     'A significant crude oil discovery is substantial in reserves terms and potentially commercial.'),
    ('si37_4_gas', 'SI37', f'{SI} reg. 4',
     '4. A Significant Gas Discovery shall be a discovery of natural gas that',
     'Regulation 4 defines a significant gas discovery.'),
    ('si37_4_ab', 'SI37', f'{SI} reg. 4(a) and (b)',
     '(a) there is no market for natural gas within Nigeria ; (b) export markets need to be identified and developed ;',
     'Its first two reasons are no gas market in Nigeria and export markets still to be developed.'),
    ('si37_5_1_declared', 'SI37', f'{SI} reg. 5(1)',
     'shall be declared by a licensee by notifying the Commission in writing within',
     'A significant discovery is declared by written notice to the Commission.'),
    ('si37_5_1_sixty_days', 'SI37', f'{SI} reg. 5(1)',
     '60 days after completion of an appraisal programme pursuant to section',
     'The notice is due within 60 days after the appraisal programme is completed.'),
    ('si37_6_2_ninety_days', 'SI37', f'{SI} reg. 6(2)',
     '(2) The Commission shall, within 90 days of receipt of a notification from a licensee under regulation 5 of these Regulations, approve the application.',
     'The Commission approves a declaration within 90 days of the notice.'),
    ('si37_6_3_minimum', 'SI37', f'{SI} reg. 6(3)',
     '(3) An approval pursuant to subregulation (2) of this regulation shall be for a minimum period of five years in the onshore and shallow water areas, and eight years in the deep-water areas,',
     'An approval of retention is for at least five years onshore and in shallow water and at least eight years in deep water.'),
    ('si37_6_3_maximum', 'SI37', f'{SI} reg. 6(3)',
     'but the Commission may, at its discretion grant the maximum period prescribed under the Act.',
     'The Commission may grant up to the maximum the Act allows.'),
    ('si37_7_1b_choice', 'SI37', f'{SI} reg. 7(1)(b)',
     'whether it intends to declare a commercial discovery or that the discovery is of no interest.',
     'A licensee whose declaration fails the criteria says whether it will declare a commercial discovery or none of interest.'),
    ('si37_7_2_two_years', 'SI37', f'{SI} reg. 7(2)',
     '(2) Where the licensee informs the Commission that it intends to declare a commercial discovery, the Commission shall grant the licensee two years within which to submit a field development plan for the area in accordance with section 79 of the Act.',
     'If it will declare a commercial discovery, it has two years to submit a field development plan.'),
    ('si37_7_3_relinquish', 'SI37', f'{SI} reg. 7(3)',
     '(3) Where the licensee informs the Commission that the discovery is of no interest, the Commission shall, pursuant to section 78(15) of the Act, require the licensee to relinquish the parcels that cover the structure of such discovery from its licence area.',
     'If the discovery is of no interest, the parcels over its structure are relinquished.'),
    # ---- the SEC (US federal text, public domain)
    ('sec_1202_a3_sums', 'SEC', '17 CFR 229.1202(a)(3)',
     '(3) Reported total reserves shall be simple arithmetic sums of all estimates for individual properties or fields within each reserves category.',
     'For SEC reporting, total reserves are simple arithmetic sums of the property or field estimates, category by category.'),
    ('sec_1202_a3_probabilistic', 'SEC', '17 CFR 229.1202(a)(3)',
     'When probabilistic methods are used, reserves should not be aggregated probabilistically beyond the field or property level;',
     'Probabilistic aggregation stops at the field or property level.'),
    ('sec_1202_a3_arithmetic', 'SEC', '17 CFR 229.1202(a)(3)',
     'they should be aggregated by simple arithmetic summation.',
     'Above that level the SEC rule adds the estimates arithmetically.'),
    ('sec_1203_d_five_years', 'SEC', '17 CFR 229.1203(d)',
     '(d) Explain the reasons why material amounts of proved undeveloped reserves in individual fields or countries remain undeveloped for five years or more after disclosure as proved undeveloped reserves.',
     'A registrant explains proved undeveloped reserves left undeveloped for five years or more.'),
    ('sec_4_10_a22_proved', 'SEC', '17 CFR 210.4-10(a)(22)',
     'Proved oil and gas reserves are those quantities of oil and gas, which, by analysis of geoscience and engineering data, can be estimated with reasonable certainty to be economically producible',
     'The SEC defines proved reserves as quantities estimated with reasonable certainty to be economically producible.'),
    ('sec_4_10_a22_expire', 'SEC', '17 CFR 210.4-10(a)(22)',
     'prior to the time at which contracts providing the right to operate expire, unless evidence indicates that renewal is reasonably certain,',
     'Proved reserves stop at the expiry of the right to operate unless renewal is reasonably certain.'),
    ('sec_4_10_a24_ninety', 'SEC', '17 CFR 210.4-10(a)(24)',
     'If probabilistic methods are used, there should be at least a 90% probability that the quantities actually recovered will equal or exceed the estimate.',
     'With probabilistic methods, reasonable certainty means at least a 90 percent chance of meeting or exceeding the estimate.'),
]


def main():
    body = {k: body_of(k) for k in TEXTS}
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
        if re.search(r'\bPRMS\b|\bFAQ|Application Guidelines|\bSPE\b|media release', cite + quote, re.I):
            bad.append(f'{cid}: a licensed or reserved text is never quoted')
        out.append({'id': cid, 'text': text, 'source': ', '.join(TEXTS[text]), 'cite': cite, 'quote': q, 'paraphrase': para, 'found': True})
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
