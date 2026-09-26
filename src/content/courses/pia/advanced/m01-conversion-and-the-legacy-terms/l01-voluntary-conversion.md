# Voluntary conversion and its deadline

{{panel:pia-ledger-calculator}}

The earlier tiers read the Act for a lease already inside it. The Expert tier starts at the door. Much producing acreage was held under oil mining leases and oil prospecting licences granted before the Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021; commencement 16 August 2021; read on 2026-09-26). The Act does not move those holders across by force. It offers them a contract.

## The offer in the text

PIA s.92(1) makes conversion a choice. It closes with "lease may enter into a voluntary conversion contract under this Act." Nothing in it obliges the holder to sign.

The choice has a deadline. PIA s.92(4) reads: "(4) A conversion contract shall be concluded at a date (“conversion date”) which is the earlier of: (a) 18 months from the effective date ; and (b) the expiration date of the oil mining lease". For an oil prospecting licence the second limb is the date it converts to an oil mining lease. Two leases can face different deadlines, because the second limb reads each lease's own expiry.

Letting the date pass has a consequence in s.92(6): the old terms "shall continue to apply". The lesson on leases that do not convert reads that sentence in full.

## What the engine asks instead

The engine does not model a conversion contract. Conversion is concept-only in this course: taught from the text and never graded on a number. The engine takes the outcome as a stated input, `pia_lease_status`. "converted" is a petroleum mining lease converted from an oil mining lease under the Act; "new" is one granted out of new acreage. Anything else is refused in the engine's own words:

> pia_lease_status must be "converted" or "new"; got "renewed".

A licence type from before the Act is refused the same way:

> pia_license_type must be "PML" or "PPL"; got "OML".

The engine runs only a lease that has already crossed the door.

## What the status changes on a ledger

The lease status decides which production allowance the Sixth Schedule gives. A converted lease earns what PIA Sixth Schedule para 1(1) describes: "There shall be a production allowance for crude oil production by leases which are converted oil mining leases based on a conversion contract and their renewals, which shall be the lower of US $2.50 per barrel and 20% of the fiscal oil price." A new lease earns the larger per-field allowance of para 1(2), up to a cap.

Run Ekene Alpha (synthetic; shallow water, converted, 2026 to 2032) as a new lease at a stated rate of 30. That stated reading keeps the same 30 percent class the converted lease pays, so the rate cannot explain the change:

| stated change on Alpha | hydrocarbon tax, changed less base | take percent, changed less base |
| --- | --- | --- |
| a new lease, stated 30 | -24691339.200000 | -2.953548 |

The movement is the larger new-lease allowance.

## Exercise

Open the ledger calculator on the view "Which provision moved" with ekene_alpha_shallow_converted_nta loaded. Enter {"pia_lease_status": "new"} as the change and read the refusal: the engine will not pick a rate for you. Add "pia_new_pml_hct_rate_pct": 30 to the change and confirm the hydrocarbon tax difference above. Explain its sign from para 1(1) and para 1(2). Then set the status to "renewed" in the case, open "The whole ledger, year by year" and read the refusal.
