#!/usr/bin/env python3
"""WRITE concepts.json: every provision the EC8 digest quotes, with its citation,
the course's paraphrase and an EXACT excerpt of the public text it was read from.

The texts (read 2026-09-26, sources/ in this wave directory, never in the
repository):
  PIA    Petroleum Industry Act 2021 (Act No. 6), Official Gazette No. 142,
         Vol. 108, 27 August 2021 (pia_nuprc.txt)
  DGDO   Domestic Gas Delivery Obligation Regulations 2022 (S.I. No. 74 of
         2022), Official Gazette No. 206, Vol. 109, 23 November 2022 (dgdo.txt)
  CW     Commonwealth Secretariat, Gas Sales Agreement, Contract 2 in the
         Commonwealth Model Contract Series (2025), licensed under Creative
         Commons Attribution 4.0 International (comsec.txt)
  ESMAP  ESMAP Report 152/93, Long-term Gas Contracts: Principles and
         Applications (January 1993), World Bank / UNDP (esmap.txt)
  HMRC   HMRC Oil Taxation Manual OT05435 and OT05402, updated 19 December
         2019, Open Government Licence (hmrc_ot05435.txt, hmrc_ot05402.txt)

No licensed model contract (AIPN) is quoted anywhere. Each quote is checked
here against its text with whitespace collapsed and NOTHING else normalised,
and the script REFUSES to write if one is not found. quote_check.py re-checks
every quote and that the digest prints each one exactly.

    python3 make_concepts.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'sources')
TEXTS = {'PIA': 'pia_nuprc.txt', 'DGDO': 'dgdo.txt', 'CW': 'comsec.txt', 'ESMAP': 'esmap.txt', 'HMRC': 'hmrc_ot05435.txt', 'HMRC2': 'hmrc_ot05402.txt'}


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


# (id, text, cite, quote, paraphrase)
C = [
    # ---- PIA 2021: the Domestic Gas Delivery Obligation, s.110
    ('pia_110_1a_allocation', 'PIA', 'PIA s.110(1)(a)',
     'prescribe and allocate the domestic gas delivery obligation among all lessees before 1st March of each year based on the domestic gas demand requirements',
     'The Commission prescribes the domestic gas delivery obligation and allocates it among all lessees before 1 March of each year, from the domestic gas demand requirements.'),
    ('pia_110_2_deemed', 'PIA', 'PIA s.110(2)',
     'where the volume of the contracts is equal to or higher than the domestic gas delivery obligation for the lessee, the lessee shall',
     'A lessee whose voluntary contracts with the strategic sectors reach its obligation is deemed to have fulfilled it.'),
    ('pia_110_2a_fulfilled', 'PIA', 'PIA s.110(2)(a)',
     '(a) be deemed to have fulfilled its domestic gas delivery obligation ;',
     'The first consequence of voluntary contracts that reach the obligation: the obligation is deemed fulfilled.'),
    ('pia_110_8_penalty', 'PIA', 'PIA s.110(8)',
     'a lessee who fails to comply with the domestic gas delivery obligation shall incur a penalty of US $3.50 per MMBtu not delivered,',
     'A lessee that fails its obligation pays US$3.50 for each MMBtu not delivered.'),
    ('pia_110_8_proviso', 'PIA', 'PIA s.110(8)',
     'where the lessee has signed a gas purchase and sale agreement with a wholesale supplier of the strategic sectors, the penalty for failure to deliver shall be as stated in that agreement.',
     'Where the lessee has signed a gas purchase and sale agreement with a wholesale supplier of the strategic sectors, the agreement states the penalty.'),
    ('pia_110_9_adjust', 'PIA', 'PIA s.110(9)',
     'The penalty amount of US $3.50 per MMBtu referred to under subsection (8) may be adjusted as the Commission may prescribe in a regulation made under this Act.',
     'The Commission may adjust the US$3.50 rate by regulation.'),
    ('pia_110_10_excuses', 'PIA', 'PIA s.110(10)',
     'A lessee shall not incur a penalty prescribed under subsection (8), where it can establish that its failure to comply is as a result of',
     'No penalty is due where the lessee establishes that its failure came from one of four listed causes.'),
    ('pia_110_10bc', 'PIA', 'PIA s.110(10)(b) and (c)',
     '(b) the inability of a purchaser to accept allocated natural gas volumes ; (c) the inability to transport the allocated natural gas for reasons beyond the control of the lessee ; or',
     'Two of the causes: a purchaser that cannot accept the allocated volumes, and gas that cannot be transported for reasons beyond the lessee\'s control.'),
    ('pia_110_10d', 'PIA', 'PIA s.110(10)(d)',
     '(d) the failure of a purchaser to pay for allocated natural gas volumes.',
     'The fourth cause: a purchaser that fails to pay for the allocated volumes. The first, (a), is force majeure.'),
    ('pia_110_13_compensation', 'PIA', 'PIA s.110(13)',
     'A producer-customer of the domestic gas aggregator shall pay compensation to customer-client for any loss suffered as a result of default to supply marketable natural gas',
     'A producer that defaults on supply through the domestic gas aggregator compensates the customer for its loss.'),
    ('pia_110_14a_export', 'PIA', 'PIA s.110(14)(a)',
     'in addition to the penalties provided under subsection (8), not be entitled to supply natural gas to any new midstream gas export operations,',
     'A lessee that does not comply may not supply gas to any new midstream gas export operation, in addition to the penalty.'),
    ('pia_110_15_approval', 'PIA', 'PIA s.110(15)',
     'An approval for the supply of natural gas for export projects shall, from the effective date, be subject to prior compliance by the lessee with its domestic gas delivery obligation.',
     'Approval to supply gas for export requires the lessee to have complied with its domestic obligation first.'),
    ('pia_110_16_prior', 'PIA', 'PIA s.110(16)',
     'Domestic gas delivery contracts entered into by lessees or licensees prior to the effective date and continuing after the effective date, shall be counted towards their domestic gas delivery obligation',
     'Domestic supply contracts signed before the Act took effect and still running count towards the obligation.'),
    # ---- PIA 2021: prices, s.167 and s.168, the Third and Fourth Schedules
    ('pia_167_1_base', 'PIA', 'PIA s.167(1)',
     'determine the domestic base price under the Third Schedule to this',
     'The Authority determines the domestic base price each year under the Third Schedule.'),
    ('pia_167_3_control', 'PIA', 'PIA s.167(3)',
     'The price control and the corresponding role of the domestic gas aggregator shall not be required, where the',
     'Price control, and the aggregator\'s role with it, is not required where either of two conditions is met.'),
    ('pia_167_3b_free_market', 'PIA', 'PIA s.167(3)(b)',
     '(b) domestic market for natural gas is largely characterised by free market based contracting for natural gas between willing buyers and willing sellers,',
     'The second condition: the domestic market is largely free-market contracting between willing buyers and willing sellers, on criteria the Authority sets.'),
    ('pia_167_3b_consequence', 'PIA', 'PIA s.167(3)(b)',
     'and at such time the provisions of subsections (4), (5), (6) and (7) and section 168 shall no longer be applicable',
     'Once that condition is met, the sector prices of s.167(4) to (7) and the gas based industries price of s.168 cease to apply.'),
    ('pia_167_5_power', 'PIA', 'PIA s.167(5)',
     'The price of marketable natural gas applicable to the power sector shall be the domestic base price at the marketable natural gas delivery point.',
     'The power sector price is the domestic base price at the delivery point.'),
    ('pia_167_6_commercial', 'PIA', 'PIA s.167(6)',
     'The price of marketable natural gas applicable to the commercial sector shall be the domestic base price at the marketable natural gas delivery point plus US $0.50 per MMBtu.',
     'The commercial sector price is the domestic base price plus US$0.50 per MMBtu.'),
    ('pia_167_7_distributors', 'PIA', 'PIA s.167(7)',
     'the applicable price for gas distributors for the marketable natural gas at the marketable gas delivery point shall not exceed that of the commercial sector under subsection (6).',
     'Gas distributors negotiate their price, which may not exceed the commercial sector price.'),
    ('pia_167_8_transport', 'PIA', 'PIA s.167(8)',
     'shall pay for the transportation cost of the marketable natural gas from the marketable natural gas delivery point to the facilities of the wholesale customers.',
     'The buyers pay the transport cost from the delivery point to their own facilities.'),
    ('pia_168_2_floor', 'PIA', 'PIA s.168(2)',
     '(2) The floor price for the gas based industries shall be US $0.90 per MMBtu.',
     'The gas based industries price has a floor of US$0.90 per MMBtu.'),
    ('pia_168_3_ceiling', 'PIA', 'PIA s.168(3)',
     '(3) The ceiling price shall be the domestic base price applicable for any particular year.',
     'Its ceiling is the domestic base price of the year.'),
    ('pia_168_4_point', 'PIA', 'PIA s.168(4) and (5)',
     'be added for delivery to the respective gas based industries. (5) The Authority may by regulation adjust the price mechanism to add other gas based industries in line with market realities.',
     'The Fourth Schedule prices are prices at the delivery point, and transport costs are added for delivery (s.168(4)); the Authority may add other gas based industries by regulation (s.168(5)).'),
    ('pia_sch3_voluntary', 'PIA', 'PIA Third Schedule para 1(a)',
     '(a) the price must be of a level to bring forward sufficient natural gas supplies for the domestic market on a voluntary basis by the upstream petroleum industry ;',
     'The first principle for the domestic base price: high enough to bring forward enough gas for the domestic market voluntarily.'),
    ('pia_sch4_formula', 'PIA', 'PIA Fourth Schedule',
     'CP = NRP * (1 + EPF) <=EPP Where - CP is the applicable price in US $/MMBtu, EPP is the domestic base price under section 168 (3), NRP is the National Reference Price which is US $1/MMBtu',
     'The gas based industries formula: CP = NRP x (1 + EPF), no higher than EPP, the domestic base price; NRP is US$1 per MMBtu.'),
    ('pia_sch4_epf', 'PIA', 'PIA Fourth Schedule',
     'CMPP is the Average Current Month End Product Price in US $/MT PRP = Product Reference Price in US $/MT i.e. dollar per metric tonne which varies depending on the industry',
     'EPF = (CMPP - PRP) / PRP, where CMPP is the average current month end product price and PRP the product reference price, both in US$ per tonne.'),
    ('pia_sch4_change', 'PIA', 'PIA Fourth Schedule',
     'The Authority may by regulation change the formulas or the values for NRP, CMPP and PRP and introduce other values for one or more gas based industries',
     'The Authority may change the formula or the NRP, CMPP and PRP values by regulation.'),
    # ---- PIA 2021: flaring, concept only
    ('pia_104_1_fine', 'PIA', 'PIA s.104(1)',
     'commits an offence under this Act and is liable to a fine as prescribed by the Commission in regulations under this Act.',
     'Flaring or venting outside the listed exceptions is an offence with a fine the Commission prescribes by regulation; the Act prints no rate.'),
    ('pia_105_2_take', 'PIA', 'PIA s.105(2)',
     '(2) The Commission shall have the right to take free of charge natural gas that is destined for flaring at the flare stack.',
     'The Commission may take, free of charge, gas that is destined for flaring.'),
    # ---- DGDO Regulations 2022
    ('dgdo_6_1_penalty', 'DGDO', 'DGDO Regulations 2022 r.6(1)',
     'Except as provided under section 110(10) of the Act, a lessee',
     'Regulation 6(1) opens by preserving the four excuses of the Act.'),
    ('dgdo_6_1_rate', 'DGDO', 'DGDO Regulations 2022 r.6(1)',
     'shall incur a penalty of US$3.50 per MMBtu of gas not',
     'The Regulations repeat the Act\'s rate: US$3.50 per MMBtu of gas not delivered.'),
    ('dgdo_6_2_agreement', 'DGDO', 'DGDO Regulations 2022 r.6(2)',
     'the penalty payable to the Commission for failure to deliver such gas shall not be less than the amount specified in subregulation (1) of this regulation.',
     'Under a signed agreement the penalty is not less than the US$3.50 of r.6(1).'),
    ('dgdo_6_3_ninety', 'DGDO', 'DGDO Regulations 2022 r.6(3)(b)',
     '(b) Commission fails to investigate within 90 days, the lessee shall be deemed to have met the domestic gas delivery obligation',
     'If the Commission does not investigate a claimed excuse within 90 days, the lessee is deemed to have met its obligation.'),
    ('dgdo_5_2_supply_price', 'DGDO', 'DGDO Regulations 2022 r.5(2)',
     'The Commission shall identify on the supply curve the lowest level for the domestic gas supply price',
     'The Commission finds on the national supply curve the lowest supply price that covers the strategic sectors\' demand.'),
    ('dgdo_9_base_price', 'DGDO', 'DGDO Regulations 2022 r.9',
     '“domestic base price” is the price for marketable natural gas determined pursuant to the Third Schedule to the Act ;',
     'The Regulations define the domestic base price by reference to the Act\'s Third Schedule.'),
    # ---- Commonwealth model GSA (2025, CC BY 4.0)
    ('cw_licence', 'CW', 'Commonwealth model GSA (2025), front matter',
     'This work is licensed under Creative Commons Attribution 4.0 International.',
     'The model agreement is published under Creative Commons Attribution 4.0, so it may be quoted with attribution.'),
    ('cw_adjacq', 'CW', 'Commonwealth model GSA (2025), definition of Adjusted ACQ',
     'the quantity of Gas equal to the Annual Contract Quantity less the sum of the Scheduled Maintenance Quantities, Force Majeure Quantities, Shortfall Quantities, and if applicable less the Operational Flexibility Credit,',
     'The Adjusted ACQ is the ACQ less scheduled maintenance, force majeure and seller shortfall quantities, and any operational flexibility credit.'),
    ('cw_acq', 'CW', 'Commonwealth model GSA (2025), definition of ACQ',
     'the quantity of Gas equal to the sum of the Daily Contract Quantities determined using the',
     'The ACQ is the sum of the daily contract quantities of the contract year.'),
    ('cw_topq', 'CW', 'Commonwealth model GSA (2025), definition of Take or Pay Quantity',
     'quantity of Gas equal to [## INSERT] percent (##%) of the Adjusted Annual Contract Quantity for that Contract Year.',
     'The take-or-pay quantity is a percentage of the Adjusted ACQ; the model leaves the percentage for the parties to insert.'),
    ('cw_maxdcq', 'CW', 'Commonwealth model GSA (2025), definition of MaxDCQ',
     'a quantity of Gas equal to [## INSERT] percent (##%) of the applicable DCQ.',
     'MaxDCQ is a stated percentage of the DCQ, left for the parties to insert.'),
    ('cw_sfq', 'CW', 'Commonwealth model GSA (2025), definition of Shortfall Quantity',
     'the Properly Nominated Quantity less the Delivery Tolerance Quantity and less the Daily Actual Quantity determined using the following formula: SFQ = (PNQ − DTQ ) − DAQ',
     'The model computes the seller\'s shortfall as the properly nominated quantity less the delivery tolerance less the daily actual quantity.'),
    ('cw_sfq_made_available', 'CW', 'Commonwealth model GSA (2025), definition of Shortfall Quantity',
     'means for any Day in the Delivery Period, during which Seller did not make available the Properly Nominated Quantity,',
     'The definition opens with a day on which the seller did not make the properly nominated quantity available.'),
    ('cw_badq', 'CW', 'Commonwealth model GSA (2025), definition of BADQ',
     'means for any Contract Year in which Buyer does not take at least the Take or Pay Quantity,',
     'The buyer\'s annual deficiency quantity arises in a year the buyer takes less than the take-or-pay quantity.'),
    ('cw_mua', 'CW', 'Commonwealth model GSA (2025), definition of Make-Up Aggregate',
     'a quantity of Gas equal to the sum of Buyer’s Annual Deficiency Quantities in prior Contract Years less the sum of the Make-Up Quantities taken in prior Contract Years and expired Make-Up Aggregate',
     'The make-up aggregate sums the deficiency quantities of prior years, less make-up already taken and make-up expired.'),
    ('cw_makeup_period', 'CW', 'Commonwealth model GSA (2025), definition of Make-Up Period',
     'Contract Years immediately following the Contract Year corresponding to such Buyer’s Annual Deficiency Quantity, within which Buyer has a right to make up',
     'The make-up period is a stated number of contract years after the deficiency year.'),
    ('cw_top_obligation', 'CW', 'Commonwealth model GSA (2025), Article 12.6',
     'In each Contract Year Buyer shall be obligated to take and pay for, or to pay for if not taken, a quantity of Gas at least equal to the Take or Pay Quantity.',
     'The take-or-pay obligation: take and pay for, or pay for if not taken, at least the take-or-pay quantity each contract year.'),
    ('cw_makeup_after', 'CW', 'Commonwealth model GSA (2025), Article 12.7.1',
     'Make-Up Aggregate Buyer shall have the ALTERNATIVE 1 right ALTERNATIVE 2 obligation for any Day in such Contract Year after Buyer has taken delivery of at least',
     'The make-up right (or, in Alternative 2, obligation) runs on any day of the year after the buyer has taken at least the stated quantity; the text goes on to name the Adjusted ACQ.'),
    ('cw_fifo_makeup', 'CW', 'Commonwealth model GSA (2025), Article 12.7',
     'A Make-Up Quantity nominated and taken shall be attributed on a FIFO basis to the specific Buyer’s Annual Deficiency Quantities comprising the Make-Up Aggregate at the time.',
     'Make-up taken is attributed first in first out to the deficiency quantities in the aggregate.'),
    ('cw_forfeit', 'CW', 'Commonwealth model GSA (2025), Article 12.7',
     'the right to make up such equivalent quantity shall terminate, and Buyer shall forfeit any and all rights with respect to such Buyer’s Annual Deficiency Quantity.',
     'Make-up not taken within its period is forfeited.'),
    ('cw_end_refund', 'CW', 'Commonwealth model GSA (2025), Article 12.7, end of the Delivery Period, Alternative 2',
     'Seller shall pay to Buyer an amount equal to the value of the Make-Up Aggregate multiplied by the Take or Pay Price in the Contract Year in which the Delivery Period expires.',
     'Alternative 2 at the end of the term: the seller refunds the make-up aggregate at the last contract year\'s take-or-pay price.'),
    ('cw_fifo_cf', 'CW', 'Commonwealth model GSA (2025), Article 12.8',
     'A Carry Forward Credit Quantity applied under Article 12.8.1 shall be attributed on a FIFO basis to the specific Buyer’s Annual Surplus Quantities comprising the Carry Forward Aggregate at the time.',
     'A carry-forward credit is drawn first in first out from the surpluses in the carry-forward aggregate.'),
    ('cw_topp_alt1', 'CW', 'Commonwealth model GSA (2025), Article 15.2.6, Alternative 1',
     'the arithmetic average of the Contract Price for each Month during such Contract Year.',
     'Alternative 1 for the take-or-pay price: the average of the year\'s monthly contract prices.'),
    ('cw_topp_alt2', 'CW', 'Commonwealth model GSA (2025), Article 15.2.6, Alternative 2',
     'the Contract Price for the last Month of such Contract Year.',
     'Alternative 2: the contract price of the last month of the year.'),
    ('cw_rounding', 'CW', 'Commonwealth model GSA (2025), Article 15.4',
     'Calculations to determine the Contract Price for any period shall be made to at least five (5) decimal places, without rounding, and the final expression of Contract Price for any period shall be rounded to the fourth decimal place.',
     'Prices are computed to at least five decimals without rounding and the final price is rounded to four decimals.'),
    ('cw_rounding_rule', 'CW', 'Commonwealth model GSA (2025), Article 15.4',
     'if the number in the fifth decimal place is five (5) or more then the number in the fourth decimal place shall be rounded up to the next number.',
     'A fifth decimal of five or more rounds the fourth decimal up.'),
    # ---- ESMAP 152/93 (1993)
    ('esmap_659', 'ESMAP', 'ESMAP Report 152/93 (1993) para 6.59',
     'Normally, make-up quantities are accounted for after the minimum-pay quantity for the year has been taken.',
     'ESMAP describes make-up counted only after the year\'s minimum-pay quantity is taken.'),
    ('esmap_661', 'ESMAP', 'ESMAP Report 152/93 (1993) para 6.61',
     'gas taken in excess of the minimum pay could be credited against the minimum-pay quantities in later years, reducing the minimum-pay obligation in those years.',
     'ESMAP describes carry-forward: gas taken above the minimum pay credited against later years\' minimum-pay quantities.'),
    ('esmap_662', 'ESMAP', 'ESMAP Report 152/93 (1993) para 6.62',
     'the seller may include a provision whereby the use of a carry-forward right in any year should not exceed a certain percentage of the annual quantity.',
     'ESMAP describes a carry-forward cap stated as a percentage of the annual quantity.'),
    # ---- HMRC Oil Taxation Manual
    ('hmrc_05435_priority', 'HMRC', 'HMRC Oil Taxation Manual OT05435 (updated 19 December 2019)',
     'The arrangements will usually give the buyer the opportunity to make up the quantity paid for but not taken. The make-up may be taken either:',
     'HMRC describes make-up taken in one of two orders.'),
    ('hmrc_05435_orders', 'HMRC', 'HMRC Oil Taxation Manual OT05435 (updated 19 December 2019)',
     'in priority over that period’s contract amount; or only when the minimum for that period has been taken.',
     'The two orders: make-up first, or make-up only after the period\'s minimum is taken.'),
    ('hmrc_05402_swing', 'HMRC2', 'HMRC Oil Taxation Manual OT05402 (updated 19 December 2019)',
     'is derived from the result of dividing the swing factor by the take or pay level, or maximum daily capacity by the minimum take.',
     'Effective swing is the swing factor divided by the take-or-pay level.'),
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
        out.append({'id': cid, 'text': 'HMRC' if text == 'HMRC2' else text, 'source': TEXTS[text], 'cite': cite, 'quote': q, 'paraphrase': para, 'found': True})
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
