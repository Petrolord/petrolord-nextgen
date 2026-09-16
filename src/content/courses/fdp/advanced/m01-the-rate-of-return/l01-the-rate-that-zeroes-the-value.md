# The rate that zeroes the value

The internal rate of return is the discount rate at which the net present value is zero. It is a property of a cash flow, arrived at by solving, and no part of it is a judgement about whether the project deserves to be built.

{{panel:ec-value-explorer}}

## The number the flow already carries

The EGINA Base scenario runs the FPSO concept at 70.0000 USD a barrel on the studio's default screening terms: royalty 12.5000 percent, tax 30.0000 percent, discount 10.0000 percent and variable operating cost 5.0000 USD a barrel. Discounted at 10.0000 percent the NPV is 2015.4123 million USD. Run the same case with no end-of-life cost and it is worth 2047.5653 million USD, and the rate that drives that flow to zero is 29.5998 percent at status `ok`.

Nobody chose 29.5998. A capex of 2250.0000 million USD, a twenty year production shape, the price and the terms fix a yearly cash flow, and the rate falls out of it. Charge the plan's end-of-life cost of 260.0000 million USD in production year 20 and the flow is zeroed at two rates, -44.3414 and 29.5779, so the engine reports `multiple-roots` and no rate.

## Price moves the rate and the value together

| oil price | NPV | rate of return |
| --- | --- | --- |
| 40.0000 | -197.2391 | none, multiple-roots |
| 55.0000 | 909.0866 | none, multiple-roots |
| 70.0000 | 2015.4123 | none, multiple-roots |
| 85.0000 | 3121.7380 | none, multiple-roots |

The same concept, the same capex, four prices, and not one of them carries a rate. The value moves by the same amount at every step because only what a barrel earns changes, and the rate is missing for a reason unrelated to the price: each of these flows spends, earns, and then pays to abandon.

## It needs a change of sign

Year 0 carries the capex and no production, so its net cash flow is -2250.0000, and the cumulative runs -2250.0000, then -1454.1875, then -658.3750, then 137.4375. A flow that starts negative and later turns positive can be driven to zero by some rate, because discounting punishes the late positive years harder than the early negative one. A flow that never turns has no such rate, and the engine says so instead of producing one.

## A verified root, or a stated reason

The search runs between -99 and 1000 percent, and a rate is reported only when it is the one root inside that band. Otherwise the rate is null and the status names the reason: `no-sign-change`, `above-clamp`, `multiple-roots` or `no-root`, with `ok` as the fifth value. The EGINA Base case reads `multiple-roots` and no rate. The same concept at 18.0000 USD a barrel reads no rate either, status `no-root`, on an NPV of -1834.1220.

## The mistake

The mistake is reading the rate as an opinion the engine formed about the project. It is not. It is the answer to one arithmetic question asked of one cash flow from a screening case: one price deck, one shape, post royalty and tax on stated default terms. A value of 2015.4123 million USD on those inputs is not a sanction case, and it is not evidence that the inputs were right.

## Exercise

State the NPV of the EGINA Base case and what it reports in place of a rate, and say which discount rate the NPV was taken at. Then give the two rates that zero the Base flow and say what has to be true of a cash flow before one rate can answer for it.
