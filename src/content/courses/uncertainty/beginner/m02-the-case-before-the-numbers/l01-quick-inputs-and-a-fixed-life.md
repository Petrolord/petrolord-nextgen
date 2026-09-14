# Quick inputs and a fixed life

The quick form takes a short list of numbers about a field and returns a twenty year case. Some of what arrives in the case was typed, and some of it the engine decided on its own.

{{panel:ec-screening-explorer}}

## What is typed

ISIALA, the teaching field, is entered as follows.

| quick input | ISIALA |
| --- | --- |
| initial rate | 4400 bopd |
| decline | 12 percent a year |
| oil price | 70 USD per bbl |
| capex | 180 million USD |
| fixed opex | 2.5 million USD a year |
| variable opex | 13 USD per bbl |
| royalty | 15 percent |
| tax | 35 percent |
| discount rate | 12 percent |
| first year | 2027 |

`expandQuickInputs` passes royalty, tax and discount rate straight through as royaltyRate 15, taxRate 35 and discountRate 12, and keeps 2027 as the first year. The rest become arrays, one value per year.

## What the engine decides

Five things in the case were never asked for. The life is 20 years. The fiscal type is TaxRoyalty. Gas volume is 0 in every year, at a gas price of 3.5. Capex is split 50/50 over the first two years, so 180 becomes 90.0000 in 2027 and 90.0000 in 2028. The abandonment line is empty, so nothing is spent to close the field in 2046.

None of these is shown on the quick form. All of them shape the ledger.

## The fixed life

ISIALA's case runs from 2027 to 2046, twenty rows, whatever the inputs say about the field. Its last year still produces 141552.0984 bbl and still earns a net cash flow of 2.6534, so on ISIALA the twentieth year pays. On OKPOMA, a field of 6800 bopd declining 18 percent a year at 78 USD per bbl with fixed opex of 4 million USD, the twentieth year does not: 2046 has a net cash flow of -0.5576 on gross revenue of 4.4603 and opex of 4.5718, and the engine keeps it.

No quick input moves the life. A field whose economics end early and a field that could run for decades both get twenty rows.

## The mistake

The careful mistake is to count the passthrough fields and think the case has been read. Someone checks royaltyRate 15, taxRate 35 and discountRate 12 against the form, finds them right, and signs off. The five decisions the engine made sit in the arrays, and a reviewer who never opens the arrays never sees that capex landed in production years or that 2046 is being produced at a loss on OKPOMA.

The other mistake is to take reserves from the case as though they were an input. There is no reserves field. Volume is whatever an initial rate and a decline add up to over twenty years, so changing the life would change the reserves, and the quick form will not let it change.

## What the quick form refuses

It refuses a life, a start of production after the first year, a gas stream, a capex schedule and an abandonment cost. A case that needs any of these has outgrown the quick form and has to be built year by year.

## Exercise

List ISIALA's quick inputs, then list what `expandQuickInputs` adds that was not typed, with the value it uses for each. Finally, state OKPOMA's 2046 gross revenue, opex and net cash flow, and say which quick input you would have to change to stop that year being produced.
