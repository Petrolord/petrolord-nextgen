# Crude, condensate and liquid gas

{{panel:pia-hct-calculator}}

The hydrocarbon tax is the Act's profit tax on crude oil. Before any rate or deduction, the first provision to read is the one that says what the tax charges at all, because everything a field produces outside that scope never enters the tax base.

## What the texts charge

The Petroleum Industry Act 2021, s.260(1)(a): "(a) hydrocarbon tax shall apply to crude oil as well as field condensates and liquid natural gas liquids derived from associated gas and produced in the field upstream of the measurement points ;".

The Nigeria Tax Act 2025 (Official Gazette No. 117, Vol. 112, 26 June 2025, re-gazetting ordered and no Certified True Copy read; read 2026-09-26) carries the same words into its own hydrocarbon tax Part at s.65(2)(a). The scope is the same under both texts.

Three streams are in: crude oil, field condensate, and liquid natural gas liquids from associated gas. The allowances follow the same scope. The Sixth Schedule para 1(4): "(4) Any allowances for crude oil shall also apply to condensates and liquid natural gas liquids under section 260 (1) (a) of this Act."

## What the engine charges

The engine charges the tax on crude oil and condensate revenue: its liquids line is oil plus condensate, each at its own price. Gas revenue sits outside the tax. Costs the field shares with gas enter at the crude-plus-condensate share of gross revenue, and the engine says so in `kpis.pia_notes` on any ledger with gas production:

> Opex, HCDT, NDDC, capital allowances and any decommissioning contribution enter the hydrocarbon tax at the crude-plus-condensate share of gross revenue. The Act allocates associated-gas costs to crude oil (s.260(2)) and excludes non-associated gas condensate from the tax (s.260(1)(b)(ii)); the engine cannot tell the two gases apart.

That is a stated approximation, and the note is part of the result.

## Ekene Alpha's share

Ekene Alpha (synthetic, shallow water, converted lease) sells associated gas beside its crude and condensate.

| year | gross revenue | liquids share (derived) | CPR cap | HCT assessable profit |
| --- | --- | --- | --- | --- |
| 2026 | 234184000.000000 | 0.970075 | 147664400.000000 | 182041059.069891 |
| 2027 | 206081920.000000 | 0.970075 | 129944672.000000 | 159495048.786836 |

The liquids share is liquids revenue over gross revenue, derived from the case's rows and prices. The cost price ratio cap reads crude and condensate revenue only, so gas revenue never raises it. Opex, HCDT and the NDDC levy enter the tax at the 0.970075 share, and the gas part of them stays on the gas side.

## Where a later lesson picks this up

The associated and non-associated gas line is concept-only in this course: the engine has one gas stream and cannot tell which kind it is. The next lesson reads gas outside the tax.

## Exercise

Work in the course's own hydrocarbon tax calculator, which runs the same engine.

1. Open "The tax base and the cost price ratio on a ledger" and start from ekene_alpha_shallow_converted_nta. Find the shared-costs note among the engine notes and read it against the quotation above.
2. Set every `gas_mscf` in `prodRows` to 0. Check three things: the shared-costs note has gone; the CPR cap in 2026 still reads 147664400.000000; the CPR claimed has risen.
3. Explain the third observation in one sentence: which costs, previously kept on the gas side, now enter the cap?
