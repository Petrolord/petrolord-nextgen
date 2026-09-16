# Price is an input, not a fact

The oil price a scenario runs on is a field somebody typed into a box, and every value, rate of return and payback that follows is that person's price carried through to the end.

{{panel:ec-plan-explorer}}

## One concept, four scenarios

| scenario | oil price | NPV | IRR | IRR status | payback years |
| --- | --- | --- | --- | --- | --- |
| Base | 70.0000 | 2015.4123 | none | multiple-roots | 3.8273 |
| Low price | 48.0000 | 392.8013 | none | multiple-roots | 5.7734 |
| High price | 92.0000 | 3638.0233 | none | multiple-roots | 3.0625 |
| Stress | 18.0000 | -1834.1220 | none | no-root | never |

Every row runs the same FPSO concept, the same capex of 2250.0000 million USD, the same operating cost of 95.0000 million USD a year and the same 20 year production shape. Nothing about the rock, the wells or the vessel differs between the first row and the last. The plan is worth 2015.4123 million USD under one typed price and -1834.1220 million USD under another.

## The step between prices

Priced at 40.0000 USD a barrel the same concept returns an NPV of -197.2391. At 55.0000 USD a barrel, 909.0866. At 70.0000 USD a barrel, 2015.4123. At 85.0000 USD a barrel, 3121.7380. Each of those four runs reports its rate of return as none, at the status multiple-roots, because the plan pays to abandon the field at the end of its life. The four prices are evenly spaced and the NPV rises by the same amount at every step, because the production shape, the capex and the fiscal terms never move between the runs. Only what a barrel earns moves.

## Zero is a price, blank is not

A scenario priced at zero is accepted and returns an NPV of -3554.2621 million USD, because zero is a number somebody chose and the engine runs the number it was given. A scenario with no price is refused by name: FdpInputError: "the scenario oil price is missing". A blank box gets the same message. A negative price gets its own: FdpInputError: "the scenario oil price may not be negative: -5".

## The mistake

Quoting a value without its price. "The development is worth 2015.4123" is not a statement about the field. It is a statement about that concept at 70.0000 USD a barrel, post royalty and tax, discounted mid year on the studio's default terms. Put 18.0000 USD a barrel in the same sentence and it reads -1834.1220 with no rate of return at all. Write the price beside every figure you carry out of the studio, and look for the price beside every figure somebody carries in.

## What it refuses

The studio will not pick a price, will not extend one across years it was not given, and will not label a scenario optimistic or conservative. It holds no view on whether 92.0000 USD a barrel is plausible for anybody. It also does not claim the four rows form a range for the field: they are four separate runs of one concept, each one complete and each one conditional on the single number at its head.

## Exercise

State the NPV, the rate of return and the payback the Base scenario reports, and name the price all three are conditional on. Then say what the engine returns for a scenario priced at zero and what it returns for a scenario with no price at all, and explain why those two inputs get different answers.
