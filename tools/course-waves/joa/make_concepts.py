#!/usr/bin/env python3
"""WRITE concepts.json: every provision the EC9 digest quotes, with its citation,
the course's paraphrase and an EXACT excerpt of the public text it was read from.

The texts (read 2026-09-26, sources/ in this wave directory, never in the
repository):
  PIA      Petroleum Industry Act 2021 (Act No. 6), Official Gazette No. 142,
           Vol. 108, 27 August 2021 (pia_nuprc.txt, the EC7 copy)
  NOJOA    Norway, Ministry of Petroleum and Energy, Agreement concerning
  NOAA     petroleum activities, Attachment A Joint Operating Agreement and
           Attachment B Accounting Agreement, unofficial English translation
           (the 2007 text), cited from the Wayback Machine capture of 26 May
           2024 (no_agreement.txt)
  KENYA    Republic of Kenya, Model Production Sharing Contract 2015,
           Participation Agreement (kenya_model_psc_2015.txt)
  WB       World Bank, Petroleum Sector Briefing Note No. 8, Contracts for
           Petroleum Development, Part 2 (November 2007) (wb_bn8_raw.txt, a
           reading-order pdftotext of the two-column PDF)
  FARI     IMF, Luca and Mesa Puyo, Fiscal Analysis of Resource Industries
           (FARI) Methodology, TNM/16/01 (February 2016) (fari_raw.txt)
  IMFWP    IMF, Cash Flow Analysis of Fiscal Regimes for Extractive
           Industries, WP/24/89 (April 2024) (wp24089_raw.txt)
  OPENOIL  OpenOil, Oil Contracts: How to read and understand them, version 1
           (November 2012), Creative Commons (openoil_raw.txt)

No licensed model contract or accounting procedure (the AIPN model JOA,
COPAS, AAPL forms) is quoted anywhere. Each quote is checked here against its
text with whitespace collapsed and NOTHING else normalised, and the script
REFUSES to write if one is not found. quote_check.py re-checks every quote
and that the digest prints each one exactly.

    python3 make_concepts.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'sources')
TEXTS = {'PIA': 'pia_nuprc.txt', 'NOJOA': 'no_agreement.txt', 'NOAA': 'no_agreement.txt', 'KENYA': 'kenya_model_psc_2015.txt',
         'WB': 'wb_bn8_raw.txt', 'FARI': 'fari_raw.txt', 'IMFWP': 'wp24089_raw.txt', 'OPENOIL': 'openoil_raw.txt'}


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


# (id, text, cite, quote, paraphrase)
C = [
    # ---- PIA 2021: the contract forms and the carried interest provision
    ('pia_85_2a_psc', 'PIA', 'PIA s.85(2)(a)',
     '(a) a production sharing contract for the exploration, development and production of petroleum on terms under which the financial risk-bearing party shall recover costs from a share of production as established in the contract from the applicable area ;',
     'A production sharing contract lets the party that bears the financial risk recover its costs from a share of production, as the contract sets out.'),
    ('pia_85_2d_concession', 'PIA', 'PIA s.85(2)(d)',
     '(d) a concession agreement for exploration, development and production of petroleum, which may include an incorporated or unincorporated joint venture with NNPC Limited ; and',
     'A concession agreement may include an incorporated or unincorporated joint venture with NNPC Limited.'),
    ('pia_85_4_head', 'PIA', 'PIA s.85(4)',
     '(4) A contract as provided for under section 85 (2) (d) of this Act shall include a carried interest provision, whereby',
     'A concession agreement under s.85(2)(d) must carry a carried interest provision on the terms that follow.'),
    ('pia_85_4a_sixty', 'PIA', 'PIA s.85(4)(a)',
     '(a) the Government through the NNPC Limited has the right to participate up to 60% in the contract or identified as a bid parameter ;',
     'The Government, through NNPC Limited, may participate up to 60 percent, or as a bid parameter states.'),
    ('pia_85_4b_any_time', 'PIA', 'PIA s.85(4)(b)',
     '(b) the right to participate shall be from any time upon the granting of the licence or lease ;',
     'The right to participate runs from any time after the licence or lease is granted.'),
    ('pia_85_4c_refund', 'PIA', 'PIA s.85(4)(c)',
     '(c) the contract shall stipulate that Government shall refund fully its proportionate share of the unrecovered proven costs from the date of its participation',
     'The Government refunds in full its proportionate share of the unrecovered proven costs from the date it participates.'),
    ('pia_85_4c_kinds', 'PIA', 'PIA s.85(4)(c)',
     'such refunded cost shall relate to development and production and shall not include bonuses and penalties, interest, premium or markups on cost ;',
     'The refundable costs are development and production costs, with no bonuses, penalties, interest, premium or markups.'),
    ('pia_85_4d_upfront', 'PIA', 'PIA s.85(4)(d)',
     '(d) the contract shall not require any upfront payment by the Government ;',
     'The contract may not require the Government to pay anything upfront.'),
    ('pia_85_4e_expert', 'PIA', 'PIA s.85(4)(e)',
     '(e) the nature, the validity and quantum of the unrecovered costs to be refunded shall be determined or verified by an agreed expert determination procedure ;',
     'An agreed expert determination settles the nature, validity and amount of the unrecovered costs.'),
    ('pia_85_4f_kind', 'PIA', 'PIA s.85(4)(f)',
     '(f ) the refund obligation under this subsection may be in the form of cash or kind from future share of production or entitlements from the effective participation date ; and',
     'The refund may be paid in cash or in kind from the future share of production or entitlements.'),
    ('pia_311_limit', 'PIA', 'PIA s.311(2)(a)(iii)',
     'shall feature a cost oil limit of not more than 60% of the total oil production, a minimum of 55% haircut on disputed amount',
     'A renegotiated production sharing contract carries a cost oil limit of at most 60 percent of total oil production and a haircut of at least 55 percent on disputed amounts.'),
    # ---- the Norwegian Joint Operating Agreement (Attachment A)
    ('nojoa_8_1_funds', 'NOJOA', 'Norway JOA Art. 8.1',
     'The Parties are obliged to provide sufficient funds to cover all expenses relating to the activities of the joint venture.',
     'The parties must fund every expense of the joint venture.'),
    ('nojoa_8_1_share', 'NOJOA', 'Norway JOA Art. 8.1',
     'the amount to be contributed by each Party shall be calculated in accordance with the Participating interest at the time the payment is made.',
     'Each party contributes by its participating interest at the time of payment.'),
    ('nojoa_9_1_advance', 'NOJOA', 'Norway JOA Art. 9.1',
     'the amounts which are not paid shall be advanced by the non-defaulting Parties in accordance with their Participating interest.',
     'The non-defaulting parties advance a defaulter\'s unpaid amounts by their participating interests.'),
    ('nojoa_9_1_penal', 'NOJOA', 'Norway JOA Art. 9.1',
     'he shall be charged a penal interest pursuant to Article 1.2.2 of Attachment B',
     'A defaulting party pays penal interest under the Accounting Agreement.'),
    ('nojoa_9_2_vote', 'NOJOA', 'Norway JOA Art. 9.2',
     "If a Party's default has not ceased within five (5) working days after he has received a demand for payment from the Operator, he looses his right to vote and his access to data and information",
     'After five working days from the demand a defaulting party loses its vote and its access to data.'),
    ('nojoa_9_3_months', 'NOJOA', 'Norway JOA Art. 9.3',
     "If a Party's default remains in effect for more than three (3) months after the Operator has informed the management committee",
     'After three months from the operator\'s notice the other parties may demand an assignment of the defaulter\'s interest.'),
    ('nojoa_9_3_compensation', 'NOJOA', 'Norway JOA Art. 9.3',
     "The compensation shall be agreed between the Parties, but shall not exceed the book value of the Party's share of the investment",
     'The compensation on an assignment is agreed, with the book value of the share of the investment as its ceiling.'),
    ('nojoa_9_4_pro_rata', 'NOJOA', 'Norway JOA Art. 9.4',
     'The assigned Participating interest shall be apportioned pro rata amongst the non-defaulting Parties in accordance with their Participating interest, unless otherwise agreed.',
     'An assigned interest goes to the non-defaulting parties pro rata to their participating interests.'),
    ('nojoa_12_5_item', 'NOJOA', 'Norway JOA Art. 12.5',
     'In carrying out an approved work program, however, the Operator may exceed a budget item or an AFE by up to 10%.',
     'The operator may exceed a budget item or an AFE by up to 10 percent.'),
    ('nojoa_12_5_budget', 'NOJOA', 'Norway JOA Art. 12.5',
     'None of the budgets may be exceeded by more than the lower of 5% or NOK 75 million during the Accounting year.',
     'A budget may be exceeded by at most the lower of 5 percent and NOK 75 million in the year.'),
    ('nojoa_12_5_outside', 'NOJOA', 'Norway JOA Art. 12.5',
     'up to an aggregate amount for each budget of NOK 3 million during the Accounting year.',
     'Work outside the programme and the budgets may reach NOK 3 million a budget in the year.'),
    ('nojoa_18_6_sole_risk', 'NOJOA', 'Norway JOA Art. 18.6',
     'In sole risk projects each Party participates in proportion to his Participating interest, unless the Parties otherwise agree.',
     'Parties in a sole risk project take part in proportion to their participating interests.'),
    ('nojoa_18_12_thousand', 'NOJOA', 'Norway JOA Art. 18.12',
     'must pay one thousand (1000) % of their proportionate share of the costs of the project.',
     'A party entering a sole risk project later pays one thousand percent of its proportionate share of the cost.'),
    ('nojoa_18_12_apportioned', 'NOJOA', 'Norway JOA Art. 18.12',
     'The payment shall be apportioned between the initial participants according to their Participating interest in the project.',
     'That entry payment is shared by the initial participants by their interests in the project.'),
    # ---- the Norwegian Accounting Agreement (Attachment B)
    ('noaa_1_2_1_adjust', 'NOAA', 'Norway Accounting Agreement Art. 1.2.1',
     'The difference between the monthly cash advances and the actual payments in each currency shall be stated, and the next request for advances shall be adjusted accordingly.',
     'The difference between the advances and the actual payments adjusts the next request for advances.'),
    ('noaa_1_2_1_refund', 'NOAA', 'Norway Accounting Agreement Art. 1.2.1',
     'the Operator shall refund the excess amounts as soon as possible, unless the Parties agree to transfer the amount to the following period.',
     'An excess advance is refunded, or carried to the following period when the parties agree.'),
    ('noaa_1_2_1_threshold', 'NOAA', 'Norway Accounting Agreement Art. 1.2.1',
     'Where the total cash requirement is less than NOK 5 million a month, the Operator is not required to make cash calls.',
     'Below NOK 5 million a month the operator need not make a cash call.'),
    ('noaa_1_2_1_arrears', 'NOAA', 'Norway Accounting Agreement Art. 1.2.1',
     "If the Operator has made no request for advance payments, the Non-operators shall pay their proportionate share of the actual monthly payments within 15 days after receipt of the Operator's billing",
     'With no cash call, each non-operator pays its share of the actual payments when billed.'),
    ('noaa_1_2_2_period', 'NOAA', 'Norway Accounting Agreement Art. 1.2.2',
     'Interest is due for the period starting on and including the due date of payment and ending on, but excluding, the value date for payment.',
     'Late payment interest runs from and including the due date to, and excluding, the value date.'),
    ('noaa_1_2_2_rate', 'NOAA', 'Norway Accounting Agreement Art. 1.2.2',
     'as per the due date of payment, plus three percentage points.',
     'The rate is a reference rate on the due date plus three percentage points.'),
    ('noaa_2_2_2_scale', 'NOAA', 'Norway Accounting Agreement Art. 2.2.2',
     'may be charged to the Joint Account according to the following per cent rates and limits based on annual costs',
     'The operator\'s general research and development cost is charged by per cent rates in bands of annual cost.'),
    ('noaa_2_2_2_base', 'NOAA', 'Norway Accounting Agreement Art. 2.2.2',
     'Cost charged to the Joint Account in accordance with this Article is not to be included in the basis of calculation.',
     'The charge itself never enters the cost it is charged on.'),
    ('noaa_2_2_2_cpi', 'NOAA', 'Norway Accounting Agreement Art. 2.2.2',
     'The intervals above will be adjusted at the beginning of each Year on the basis of the consumer price index as published by Statistics Norway per 15 July of the current year.',
     'The band limits move each year with the Norwegian consumer price index.'),
    ('noaa_2_2_3_corporate', 'NOAA', 'Norway Accounting Agreement Art. 2.2.3',
     'may be charged to the Joint Account with 0.65 % of the annual costs for exploration, operation and development of the Joint operation',
     'Corporate management and staff cost is charged at 0.65 percent of the annual cost.'),
    # ---- the Kenya Model PSC 2015, Participation Agreement Art. 6
    ('kenya_6_2_advance', 'KENYA', 'Kenya Model PSC 2015, Participation Agreement Art. 6.2',
     'request a non-operator to advance a share of the estimated expenditure for the following month, stipulating the due date of payment',
     'The operator may ask each non-operator to advance its share of next month\'s estimated spend by a due date.'),
    ('kenya_6_4_reduce', 'KENYA', 'Kenya Model PSC 2015, Participation Agreement Art. 6.4',
     "If any non-operator's advances for a given month exceed its share of cash disbursements for the same month, the next succeeding cash advance, after such determination, shall be reduced accordingly.",
     'An advance above the month\'s spend reduces the next cash advance.'),
    ('kenya_6_4_refund', 'KENYA', 'Kenya Model PSC 2015, Participation Agreement Art. 6.4',
     'non-operator(s) may request that excess advances be refunded. The operator shall make such refund within fifteen (15) days after date of such notice.',
     'A non-operator may ask for an excess advance back, paid within fifteen days.'),
    ('kenya_6_7_libor', 'KENYA', 'Kenya Model PSC 2015, Participation Agreement Art. 6.7',
     'A late payment shall attract interest at LIBOR plus',
     'Late payment interest is a reference rate plus a margin the model leaves blank.'),
    ('kenya_6_7_monthly', 'KENYA', 'Kenya Model PSC 2015, Participation Agreement Art. 6.7',
     'compounded monthly and calculated from the due date of payment.',
     'The interest compounds monthly from the due date.'),
    ('kenya_6_7_grace', 'KENYA', 'Kenya Model PSC 2015, Participation Agreement Art. 6.7',
     'A payment not received within seventy-two (72) hours of the due date shall accrue interest from the due date',
     'A payment later than seventy-two hours after the due date carries interest from the due date itself.'),
    ('kenya_6_8_vote', 'KENYA', 'Kenya Model PSC 2015, Participation Agreement Art. 6.8',
     'A party which remains in default for five (5) days shall have no right to vote at any operating committee meeting held during the period of the default',
     'After five days in default a party loses its vote on the operating committee.'),
    ('kenya_6_9_forfeit', 'KENYA', 'Kenya Model PSC 2015, Participation Agreement Art. 6.9',
     'and remains in default for ninety (90) days, the participating interest share of the defaulting party may be declared forfeit by the non-defaulting parties',
     'After ninety days in default the other parties may declare the defaulter\'s share forfeit.'),
    ('kenya_6_10_rateably', 'KENYA', 'Kenya Model PSC 2015, Participation Agreement Art. 6.10',
     'that share shall vest rateably, unless otherwise agreed, in the non-defaulting parties without payment of compensation',
     'A forfeited share vests in the non-defaulting parties in proportion, with no compensation.'),
    # ---- World Bank Briefing Note 8 (2007)
    ('wb_royalty_first', 'WB', 'World Bank Petroleum Sector Briefing Note No. 8 (November 2007)',
     'the royalty is paid first. At 10 percent, this amounts to $10 going to the government.',
     'In the two-barrel example the royalty of 10 percent is paid first.'),
    ('wb_limit_gross', 'WB', 'World Bank Petroleum Sector Briefing Note No. 8 (November 2007)',
     'the contractor recovers costs to the limit permitted, in this case 60 percent of the gross revenue or US$60.',
     'The example\'s cost oil limit is 60 percent of gross revenue.'),
    ('wb_no_limits_tax', 'WB', 'World Bank Petroleum Sector Briefing Note No. 8 (November 2007)',
     'For paying income tax, there are no limits on deductible expenses in the way there are limits on cost oil.',
     'The note says income tax deductions carry no limit of the kind cost oil has.'),
    ('wb_split', 'WB', 'World Bank Petroleum Sector Briefing Note No. 8 (November 2007)',
     'The government takes 60 percent of US$65, or US$39, and the remaining US$26 goes to the contractor.',
     'Profit oil of 65 is split 60 percent to the government and 40 percent to the contractor.'),
    ('wb_result', 'WB', 'World Bank Petroleum Sector Briefing Note No. 8 (November 2007)',
     'The end result is that the contractor retains US$43 and the government takes $57.',
     'The note\'s end result, in whole dollars.'),
    # ---- IMF FARI TNM/16/01 (2016)
    ('fari_fig5_government', 'FARI', 'IMF FARI TNM/16/01 (February 2016), Figure 5',
     'In the PSC system, the government revenue consists of USD30 in profit oil and USD6 in income tax.',
     'In the one-barrel figure the government takes 30 of profit oil and 6 of income tax.'),
    ('fari_fig5_base', 'FARI', 'IMF FARI TNM/16/01 (February 2016), Figure 5',
     'In the PSC diagram below, the base for CIT is equal to cost petroleum plus profit petroleum minus allowable tax deduction.',
     'The income tax base is cost petroleum plus profit petroleum less the allowable deductions.'),
    ('fari_fig5_assumed', 'FARI', 'IMF FARI TNM/16/01 (February 2016), Figure 5',
     'Normal tax deductions in the tax/royalty regime are assumed to be equal to the cost recovery in the PSC.',
     'The figure assumes the deductions equal the cost recovered.'),
    # ---- IMF WP/24/89 (2024)
    ('imfwp_net_of_royalty', 'IMFWP', 'IMF WP/24/89 (April 2024)',
     'Under a production sharing regime, revenues shared are usually net of royalties.',
     'Production shared under a PSC is usually counted after royalty.'),
    ('imfwp_carry', 'IMFWP', 'IMF WP/24/89 (April 2024)',
     'The parties may establish a financing arrangement to cover (“carry”) the state’s proportional share of development spending.',
     'A carry is a financing arrangement for the state\'s share of development spending.'),
    # ---- OpenOil (2012)
    ('openoil_share', 'OPENOIL', 'OpenOil, Oil Contracts: How to read and understand them (version 1, November 2012)',
     "25% of the international oil company's share of benefits = 25% of 49 million dollars",
     'The book\'s state participation example taxes the companies\' 49 million at 25 percent.'),
    ('openoil_product', 'OPENOIL', 'OpenOil, Oil Contracts: How to read and understand them (version 1, November 2012)',
     'This is calculated by: 0.25 x 49 = 11.75 million dollars',
     'The book prints the product as 11.75 million.'),
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
        if not (6 <= n <= 45):
            bad.append(f'{cid}: {n} words (6 to 45)')
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
