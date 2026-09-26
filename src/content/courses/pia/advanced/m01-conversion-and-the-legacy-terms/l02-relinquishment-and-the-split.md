# Relinquishment and the prospecting and mining split

{{panel:pia-ledger-calculator}}

PIA s.93 makes the holder sort the acreage of an oil mining lease into three piles: areas that become petroleum mining leases, areas that become petroleum prospecting licences, and areas handed back. One old lease can become two ledgers and a relinquished block.

## Keeping, adding and giving back

The holder selects areas under s.93(1) by their work: appraisal or discovery in paragraphs (a) to (c), development or production in (d) and (e). A small selection can be topped up under s.93(2): "(2) Where the total acreage selected under subsection (1) is less than 40% of the area to which the applicable oil mining lease applies, the holder may select additional areas covered by the oil mining lease for conversion to a petroleum prospecting licence".

What is left goes back. S.93(4): "(4) Areas and zones subject to an oil mining lease and not selected by the holder under subsections (1) and (2) shall be relinquished by the holder."

## Where each pile lands

For a converted oil mining lease, the appraisal and discovery areas become a prospecting licence "with fiscal terms as applicable under section 267 (b)" (s.93(6)(a)), and the producing areas become mining leases "with fiscal terms as applicable under section 267 (a) and other terms of Chapter 4 of this Act to the lease," (s.93(6)(b)). S.93(7) does the same for an oil prospecting licence.

S.267 gives the two classes their rates. Paragraph (a) charges "30% of the profit from crude oil for petroleum mining leases selected under section 93 (6) (b) and (7) (b) of this Act with respect to onshore and shallow water areas ;". Paragraph (b) charges "15% of profit from crude oil for onshore and shallow water and for petroleum prospecting licences selected under section 93 (6) (a) and (7) (a) of this Act." The Nigeria Tax Act 2025 (Official Gazette No. 117, Vol. 112, 26 June 2025; re-gazetting ordered in December 2025 and no Certified True Copy read) restates both in s.72.

So the producing core goes to the 30 percent class and the appraisal fringe to the 15 percent class.

## The split in the engine

The engine takes the result as two stated inputs, `pia_license_type` ("PML" or "PPL") and `pia_lease_status`. Onshore, a prospecting licence returns a hydrocarbon tax rate of 0.150000 and a converted mining lease 0.300000, under either framework.

Ekene Alpha (synthetic; shallow water, converted, 2026 to 2032) run as a prospecting licence moves one line:

| stated change on Alpha | hydrocarbon tax, changed less base | take percent, changed less base |
| --- | --- | --- |
| a prospecting licence | -102385291.793528 | -12.247203 |

Alpha's hydrocarbon tax over the ledger is 204770583.587056 at 100 percent, so the licence removes exactly half of it: the rate halves and the chargeable profit is unchanged. Royalty and companies income tax do not move; the class of hydrocarbon tax reaches neither.

## Exercise

Open the ledger calculator on "Which provision moved" with ekene_alpha_shallow_converted_nta loaded. The change box starts at {"pia_license_type": "PPL"}; run it and confirm the two differences above. Name the provision that keeps companies income tax at zero. Then build the other half of a split: open "The whole ledger, year by year", set pia_license_type to "PPL" in the case and compare its hydrocarbon tax year by year with the converted run. Finally type "OPL" as the licence type and read the refusal.
