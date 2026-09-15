# The rate that zeroes the value

The internal rate of return is the discount rate at which the net present value is zero. It is a property of a cash flow, arrived at by solving, and no part of it is a judgement about whether the project deserves to be built.

{{panel:ec-value-explorer}}

## The number the flow already carries

The EGINA Base scenario runs the FPSO concept at 70.0000 USD a barrel on the studio's default screening terms: royalty 12.5000 percent, tax 30.0000 percent, discount 10.0000 percent and variable operating cost 5.0000 USD a barrel. Discounted at 10.0000 percent the NPV is 2047.5653 million USD. The rate that would drive that same NPV to zero is 29.5998 percent, and the engine reports the status `ok`.

Nobody chose 29.5998. The capex of 2250.0000 million USD, the twenty year production shape, the price and the terms fix a yearly cash flow, and the rate falls out of it. Change any one of them and the rate changes with it.

## Price moves the rate and the value together

| oil price | NPV | IRR percent |
| --- | --- | --- |
| 40.0000 | -161.0098 | 8.2444 |
| 55.0000 | 943.2778 | 19.4279 |
| 70.0000 | 2047.5653 | 29.5998 |
| 85.0000 | 3151.8529 | 39.3813 |

The same concept, the same capex, four prices. At 40.0000 USD a barrel the rate is 8.2444 percent, which is a real root, and the case is still worth -161.0098 million USD because it is discounted at 10.0000 percent. A rate exists there. It is simply lower than the rate the money is being charged.

## It needs a change of sign

Year 0 carries the capex and no production, so its net cash flow is -2250.0000. Year 1 earns 795.8125, and years 2 and 3 repeat that, so the cumulative runs -2250.0000, then -1454.1875, then -658.3750, then 137.4375. A flow that starts negative and later turns positive can be driven to zero by some rate, because discounting punishes the late positive years harder than the early negative one.

A flow that never turns has no such rate, and the engine says so instead of producing one.

## A verified root, or a stated reason

The search runs between -99 and 1000 percent, and a rate is reported only when it is a root inside that band. Otherwise the rate is null and the status names the reason: `no-sign-change`, `above-clamp`, `multiple-roots` or `no-root`, with `ok` as the fifth value. The EGINA Base case reads `ok` and 29.5998 percent. The same concept at 18.0000 USD a barrel reads no rate at all, status `no-root`, on an NPV of -1797.2732.

## The mistake

The mistake is reading the rate as an opinion the engine formed about the project. It is not. It is the answer to one arithmetic question asked of one cash flow, and the cash flow came from a screening case: one price deck, one shape, post royalty and tax on stated default terms. A rate of 29.5998 percent on those inputs is not a sanction case, and it is not evidence that the inputs were right.

## Exercise

State the NPV and the IRR of the EGINA Base case, and say which discount rate the NPV was taken at. Then, using the 40.0000 USD a barrel row, explain how a case can carry a rate of 8.2444 percent and an NPV of -161.0098 million USD at the same time.
