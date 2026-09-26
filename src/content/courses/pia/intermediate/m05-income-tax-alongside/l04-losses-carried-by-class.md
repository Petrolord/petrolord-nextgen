# Losses carried by class

{{panel:pia-hct-calculator}}

When a year's chargeable profit falls below zero, the loss is carried to the next year and used there. The Act keeps losses apart: by tax, and within the hydrocarbon tax by class of rate. This lesson names the provisions; the arithmetic of carrying a pool forward belongs to the cash flow course.

## The text

The Petroleum Industry Act 2021, s.265:

- (1) assessable profit is the adjusted profit of "that period after the deduction of the amount of any loss incurred by that company during any previous accounting period."
- (2) "(2) The assessable profit shall be determined separately for each of the two classes of chargeable tax identified in section 267 (a) and (b)."
- (3) "(3) A deduction under subsection (1) shall be made so far as possible from the amount, if any, of the adjusted profit of the first accounting period after that in which the loss was incurred,"

The Nigeria Tax Act 2025 restates all three at s.70(1) to (3). Section 265(4) lets a company elect in writing to defer a loss deduction to a later period; the engine takes no such election, so it is concept-only here.

## Two pools, kept apart

The engine carries a hydrocarbon tax loss and a companies income tax loss separately. A loss in one never reduces the other. On the Ekene CPR case (synthetic):

| year | HCT chargeable profit | HCT loss carried | CIT chargeable profit | CIT loss carried |
| --- | --- | --- | --- | --- |
| 2024 | 12749396.909159 | 0.000000 | 7999798.969720 | 0.000000 |
| 2025 | 12442572.062084 | 0.000000 | 4480857.354028 | 0.000000 |
| 2026 | 8792934.782609 | 0.000000 | -65495752.569896 | 65495752.569896 |

In 2026 companies income tax has a loss while the hydrocarbon tax, on the same lease in the same year, has a profit. The two bases differ, as the previous lessons showed, so the two pools do too. The companies income tax loss waits for a later companies income tax profit and has no effect on the hydrocarbon tax.

## A loss and a carried cost

Two carries now sit on this lease, and they are different things. The cost price ratio carry holds costs the 65 percent cap turned away; it lives inside the hydrocarbon tax assessable profit and is forfeited at cessation. A loss is a chargeable profit below zero after every deduction; it lives in its own pool for its own tax.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "Companies income tax on a ledger" and choose ekene_cpr_binding_forfeiture. Read the CIT loss carried column and confirm 65495752.569896 in 2026.
2. Add a 2027 year: 1000000 bbl of oil in `prodRows` and an opex of 0 in `opexRows`. Read the 2027 CIT and the loss carried out of 2027. Did the pool shrink?
3. Which subsection of s.265 sets the year in which a loss is used first?
4. Open "The tax base and the cost price ratio on a ledger" with the same edited case and confirm the hydrocarbon tax in 2027 is positive while the companies income tax loss is still being used.
