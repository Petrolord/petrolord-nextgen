# Carrying cost forward

{{panel:pia-hct-calculator}}

A cost the cap turns away in one year is kept, and the Sixth Schedule says under what terms it can come back. This lesson reads those terms, follows the carry on the Ekene CPR case, and shows the two limits that bind a carried cost when it returns.

## The text

The Petroleum Industry Act 2021, Sixth Schedule para 2(2):

- (a) "the costs may be allowed for deduction for the purposes of ascertaining the profits of the company for subsequent years of assessment provided that the total costs to be deducted shall not exceed the actual costs incurred ;"
- (b) a carried cost claimed later "shall be such an amount that if added to the sum of the total costs to be allowed as deduction under subparagraph (1) shall not exceed the specified cost price ratio limit of 65% ;"

Two limits, then. Paragraph (a) caps the total over the life of the field: a cost is carried forward and claimed once. Paragraph (b) caps each later year: the carried amount and that year's own costs share one 65 percent limit.

## How the engine carries

The engine keeps one carried pool. Each year it adds the pool to this year's operating costs and claims them first, then this year's capital allowance, up to the cap. What does not fit becomes the next year's pool and is printed as `cpr_deferred_to_next`, the "CPR carried out" column of the panel.

On the Ekene CPR case (synthetic: shallow water, converted lease):

| year | CPR cap | CPR claimed | CPR carried out | HCT chargeable profit |
| --- | --- | --- | --- | --- |
| 2024 | 48750000.000000 | 48750000.000000 | 21250000.000000 | 12749396.909159 |
| 2025 | 39000000.000000 | 39000000.000000 | 52250000.000000 | 12442572.062084 |
| 2026 | 29250000.000000 | 29250000.000000 | 93000000.000000 | 8792934.782609 |

The cap binds in every year, so the pool only grows. A carried cost comes back only in a year whose own costs leave room under that year's cap, and on this lease revenue falls while the costs hold flat, so no year does.

## The carry and a loss

The carry is a deferral inside the hydrocarbon tax. It is separate from a loss. A loss is a chargeable profit below zero, relieved under s.265, and the course reads it in module five; the cost price ratio carry sits before that step, inside the assessable profit. On this case the hydrocarbon tax chargeable profit stays positive in every year even while the carry grows, because the cap holds the claimed cost well below the revenue it is measured on.

The arithmetic of carrying pools from year to year is the cash flow course's ground. This lesson names the provision that governs each figure.

## Exercise

Work in the course's own hydrocarbon tax calculator, which runs the same engine.

1. Open "The tax base and the cost price ratio on a ledger" on ekene_cpr_binding_forfeiture and match the table.
2. Add a 2027 year: a `prodRows` entry of 1000000 bbl of oil with no condensate or gas, and an `opexRows` entry of 0. Read the 2027 claim and the carried pool out of 2027.
3. Did the pool shrink? Name the paragraph of the Sixth Schedule that let part of it back in, and the one that stopped all of it coming back.
4. Explain why the chargeable profit in 2027 is still positive.
