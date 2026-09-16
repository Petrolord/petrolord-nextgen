# Reading it beside the NPV

A rate is an efficiency and an NPV is an amount of money, so the two can rank the same pair of options in opposite orders. EGINA carries a pair that does exactly that.

{{panel:ec-value-explorer}}

## Two concepts, two answers

| scenario | concept | oil price | capex | NPV | IRR | payback years |
| --- | --- | --- | --- | --- | --- | --- |
| Base | FPSO development | 70.0000 | 2250.0000 | 2015.4123 | none | 3.8273 |
| Tie-back base | Subsea tie-back | 70.0000 | 730.0000 | 1013.7182 | none | 3.2035 |

At the same price neither concept carries a rate of return: both pay to abandon the field at the end of its life, both flows change sign twice, and both report `multiple-roots`. The money is unambiguous either way: the FPSO earns 2015.4123 million USD and the tie-back earns 1013.7182 million USD.

## Why both readings are true

The tie-back spends 730.0000 million USD and the FPSO spends 2250.0000. Value per million of capex is 1.388655 for the tie-back and 0.895739 for the FPSO. Every million the tie-back commits works harder. There is simply far less of it committed, and a plan that stops at the tie-back has left the rest of the field undeveloped rather than earning 0.895739 per million on it.

The rate answers how hard the money worked. The NPV answers how much money came back. Neither answer contains the other, and a plan that reports only one has thrown away the question the other was answering.

## The size the rate cannot see

The tie-back also runs a shorter life, 15.0000 years against the FPSO's 20.0000, and a lower peak, 25.0000 kbpd against 60.0000. A rate is blind to all of that. It is a percentage, so it divides out the scale of the thing it is describing before it reports. Two cash flows that differ by a factor of three in every single year carry exactly the same rate.

## Payback does not settle it either

The tie-back pays back in 3.2035 years and the FPSO in 3.8273. That is a third measure, and it ranks with the roots rather than with the money, because it is also indifferent to how much money is involved. Three measures agreeing on the smaller concept still does not make the smaller concept worth more.

## The mistake

The mistake is a ranked list of rates presented as a ranked list of projects. A screening portfolio sorted on a rate has nothing to sort here, and a reader who reaches instead for the higher of the two roots the engine lists, 40.4136 on the tie-back against 29.5779 on the Base, hands over an option worth 1013.7182 million USD in place of one worth 2015.4123 million USD. Neither figure is a rate of return, and the ordering they produce is the one the money contradicts.

The second mistake is comparing a rate on one concept against an NPV on another. The Base NPV and the tie-back NPV are both taken at a discount rate of 10.0000 percent on the same price of 70.0000 USD a barrel, which is what makes them comparable at all.

## Exercise

Write the NPV, IRR and capex of both EGINA scenarios and say which concept each of the three measures favours. Then explain, using 1.388655 and 0.895739, how the tie-back can be the more efficient use of capital and still be worth less money.
