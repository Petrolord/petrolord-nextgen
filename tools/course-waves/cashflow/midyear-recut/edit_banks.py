#!/usr/bin/env python3
"""EC1 MID-YEAR RECUT (engines 3.12.3, owner decision 2026-10-14): the bank edits.

Every number below was taken from the rebuilt digest (tools/course-waves/cashflow/
digest.txt, printed by ec1_dump.mjs from the vendored engine), never typed from a
hand calculation. Each edit is an exact substring of a committed bank source and
must match exactly once, or the script refuses and writes nothing. Re-running it on
already-edited sources is refused too (the old text is gone), so it is run once and
its result committed.

    python3 tools/course-waves/cashflow/midyear-recut/edit_banks.py
"""
import os, sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
BANKS = os.path.join(REPO, 'tools', 'course-banks', 'cashflow')

# old digest figure -> new digest figure (digest section 7 and the published cases)
N = {
    '69159247.46': '76075172.20',     # AKATA nominal, mid_year
    '70188970.32': '74959094.51',     # AKATA real, mid_year
    '-115486897.55': '-127035587.31', # AKATA 2029 row, nominal mid_year
    'minus 115486897.55': 'minus 127035587.31',
    '20586124.09': '22644736.49',     # mid_year_discounting NPV
    'minus 11918282.37': 'minus 13110110.60',  # mid_year_discounting 2030 row
    '32504406.45': '35754847.10',     # mid_year_discounting 2031 row
    '212070544.45': '226483105.72',   # multiyear_pia_midyear_real headline
    '233779309.33': '245468274.80',   # multiyear_pia_midyear_real profile at 5 percent
}

E = {
 'intermediate/ec1i_exam.py': [
  ('It was shifted by half a year like every other row, so the capex is divided by the square root of 1.1 even though it sits in the valuation year.',
   'It was moved half a year like every other row, so the capex is multiplied by the square root of 1.1 even though it sits in the valuation year.'),
  ('That the second project is worth less, since NPVs on the same ledger scale are directly comparable whatever their convention.',
   'That the second project is worth more, since NPVs on the same ledger scale are directly comparable whatever their convention.'),
  ('That the second project carries the higher discount rate, since a lower NPV on a similar field is the mark of a harsher rate.',
   'That the first project carries the higher discount rate, since a lower NPV on a similar field is the mark of a harsher rate.'),
  ('a mid-year run on the real basis sinks the valuation year row by discounting it half a year,',
   'a mid-year run on the real basis moves the valuation year row by half a year,'),
 ],
 'intermediate/ec1i_m01.py': [
  ('both rows divided by the square root of 1.1 because each sits half a year from the base date.',
   'both rows multiplied by the square root of 1.1 because each arrives half a year before its year end.'),
  ('so the 2030 row stays at minus 12500000.00 and the NPV falls by the change in one row.',
   'so the 2030 row stays at minus 12500000.00 and the NPV rises by the change in one row.'),
  ('The mid-year NPV is the end-year NPV divided by 1.1 once more, a full extra year on every row, which is why it is lower.',
   'The mid-year NPV is the end-year NPV multiplied by 1.1, a full year earlier on every row, which is why it is higher.'),
  ('The mid-year NPV is the end-year NPV divided by the square root of 1.1, because every exponent moved by half.',
   'The mid-year NPV is the end-year NPV multiplied by the square root of 1.1, because every exponent fell by half.'),
  ('so there is less for the half-year shift to remove.', 'so there is less for the half-year shift to add.'),
  ('Half a year at 6.796117 percent is a smaller division than half a year at 10 percent.',
   'Half a year at 6.796117 percent is a smaller factor than half a year at 10 percent.'),
  ('The check will not reconcile: the engine discounts the valuation year row too, to minus 115486897.55.',
   'The check will not reconcile: the engine moves the valuation year row too, compounding it to minus 127035587.31.'),
  ('Discounting the 2029 capex by half a year makes it cheaper in present value and partly offsets the shrinking of the revenue rows, so the true gap is smaller than the reader computes.',
   'Compounding the 2029 capex forward by half a year makes it dearer in present value and partly offsets the lift of the revenue rows, so the true gap is smaller than the reader computes.'),
  ('Yes, because mid-year is the more accurate convention and its lower figure is the conservative one to rank on.',
   'Yes, because mid-year is the more accurate convention and its higher figure is the better estimate to rank on.'),
  ('End-year, because it gives the higher NPV of 72534830.66 and the engine reports the higher of the two readings.',
   'End-year, because it gives the lower NPV of 72534830.66 and the engine reports the more cautious of the two readings.'),
 ],
 'intermediate/ec1i_m02.py': [
  ('The half-year shift divides by the square root of one plus the applied rate, and the applied rates differ, so the shift is smaller on the real basis.',
   'The half-year shift multiplies by the square root of one plus the applied rate, and the applied rates differ, so the shift is smaller on the real basis.'),
 ],
 'intermediate/ec1i_m03.py': [
  ('It moves half a year later, because every exponent has been shifted by half.',
   'It moves half a year earlier, because every exponent has been brought forward by half.'),
  ('It moves earlier, because the 2029 capex shrinks to minus 115486897.55 and the hole is shallower.',
   'It moves later, because the 2029 capex grows to minus 125171883.54 and the hole is deeper.'),
 ],
 'intermediate/ec1i_m04.py': [
  ('and a lower root under mid-year, because the half-year shift discounts every receipt harder and the curve crosses zero sooner.',
   'and a higher root under mid-year, because the half-year shift discounts every receipt less and the curve crosses zero later.'),
 ],
 'intermediate/ec1i_m06.py': [
  ('The mid-year figure of 70188970.32, because it is the lower of the two and a decision should rest on the conservative reading.',
   'The mid-year figure of 74959094.51, because it is the higher of the two and cash really does arrive through the year.'),
  ('Mid-year discounting, which discounts the valuation year row and so pushes a negative into the tail of the discounted column.',
   'Mid-year discounting, which moves the valuation year row by half a year and so pushes a negative into the tail of the discounted column.'),
 ],
}

def main():
    out = {}
    for rel, edits in E.items():
        p = os.path.join(BANKS, rel)
        s = open(p, encoding='utf-8').read()
        for old, new in edits:
            n = s.count(old)
            if n != 1:
                sys.exit(f'REFUSED {rel}: expected one match, found {n}: {old[:70]}')
            s = s.replace(old, new)
        out[rel] = s
    # numbers, in every intermediate source (the only tier quoting mid-year figures)
    for rel in sorted(os.listdir(os.path.join(BANKS, 'intermediate'))):
        if not rel.endswith('.py'):
            continue
        key = 'intermediate/' + rel
        s = out.get(key) or open(os.path.join(BANKS, key), encoding='utf-8').read()
        for old, new in sorted(N.items(), key=lambda kv: -len(kv[0])):
            s = s.replace(old, new)
        out[key] = s
    for tier in ('beginner', 'advanced'):
        for rel in os.listdir(os.path.join(BANKS, tier)):
            if rel.endswith('.py'):
                s = open(os.path.join(BANKS, tier, rel), encoding='utf-8').read()
                hit = [o for o in N if o in s]
                if hit:
                    sys.exit(f'REFUSED: {tier}/{rel} quotes an old mid-year figure {hit}; add it to this script')
    changed = 0
    for key, s in out.items():
        p = os.path.join(BANKS, key)
        if open(p, encoding='utf-8').read() != s:
            open(p, 'w', encoding='utf-8').write(s)
            changed += 1
            print('edited', key)
    print(f'{changed} bank sources edited')

if __name__ == '__main__':
    main()
