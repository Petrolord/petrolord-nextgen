# The two classes of rate

{{panel:pia-hct-calculator}}

Where the hydrocarbon tax applies, it has two rates, and the Act ties each to how the acreage came to be held. This lesson reads s.267, sets the engine's rates beside it, and shows that the class of rate also separates the tax base.

## The text

The Petroleum Industry Act 2021, s.267:

- "(a) 30% of the profit from crude oil for petroleum mining leases selected under section 93 (6) (b) and (7) (b) of this Act with respect to onshore and shallow water areas ;"
- "(b) 15% of profit from crude oil for onshore and shallow water and for petroleum prospecting licences selected under section 93 (6) (a) and (7) (a) of this Act."

Section 93(6)(b) and (7)(b) are the areas a holder keeps in development or regular production when an oil mining lease or prospecting licence converts: they become petroleum mining leases on the 30 percent terms. Section 93(6)(a) and (7)(a) are the areas kept for appraisal and discovery, which become or continue as petroleum prospecting licences on the 15 percent terms. The Nigeria Tax Act 2025 prints the same two classes at s.72.

A producing marginal field converted under s.94(1) takes the terms of s.267(b). In the engine that is a stated flag, `pia_marginal_field_pre_2021`, on an onshore or shallow water lease.

## The rates the engine returns

| terrain | licence | lease status | converted marginal field | rate |
| --- | --- | --- | --- | --- |
| onshore | PML | converted | no | 0.300000 |
| shallow_water | PML | converted | no | 0.300000 |
| onshore | PPL | either | no | 0.150000 |
| shallow_water | PML | converted | yes | 0.150000 |

The terrain does not move the rate between onshore and shallow water; the licence and the way the lease was acquired do. The Ekene marginal field (synthetic, shallow water, 2026, 20,000 bopd) pays hydrocarbon tax at 0.150000 while its royalty follows the shallow water tranches at 0.093750.

## Two classes, two bases

The class also separates the arithmetic. Section 265(2): "(2) The assessable profit shall be determined separately for each of the two classes of chargeable tax identified in section 267 (a) and (b)." The Nigeria Tax Act 2025 repeats it at s.70(2). A loss in one class is relieved in that class. The engine runs one lease on one ledger, so one class applies to each run.

A lease granted after the Act out of new acreage fits neither sentence cleanly. That is an open question, and the next lesson reads it.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "The hydrocarbon tax rate". Read the rate for an onshore PML converted, then a PPL, then a shallow water PML converted with the marginal field flag set to yes. Match each to the table.
2. Open "The tax base and the cost price ratio on a ledger" and start from ekene_alpha_shallow_converted_nta. Change `pia_license_type` to "PPL".
3. Compare the new run with the old. Which columns moved, and which stayed? Confirm that the HCT assessable profit in 2026 still reads 182041059.069891.
4. Explain in one sentence why the licence type moves the tax without moving its base.
