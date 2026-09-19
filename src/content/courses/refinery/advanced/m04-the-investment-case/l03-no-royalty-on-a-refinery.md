# No royalty on a refinery

The screening engine offers a royalty because the fields it usually values pay one. A royalty is the state's share of oil produced from the ground. A refinery produces nothing from the ground. This lesson reads how the feasibility engine sets the royalty for a refinery and what the cash flow shows as a result.

{{panel:refinery-variance-explorer}}

## The setting

feasibilityEconomics hands the screening engine a fiscalType of TaxRoyalty, a royaltyRate of 0 and a taxRate of 30. The royalty rate is 0 because a refinery buys its crude and pays no royalty. This is an owner decision in force: no royalty on a refinery, and feasibilityEconomics passes a royalty rate of 0.

The fiscal type stays TaxRoyalty. That type applies a royalty and a tax, and with a royalty rate of 0 only the tax does any work. The royalty column is still printed, and it reads zero.

## The royalty column

| year | calendar year | gross revenue (MM) | royalty (MM) | opex (MM) |
| --- | --- | --- | --- | --- |
| 0 | 2027 | 0.0000 | 0.0000 | 0.0000 |
| 2 | 2029 | 346.1195 | 0.0000 | 307.5315 |
| 21 | 2048 | 346.1195 | 0.0000 | 307.5315 |

Every year of the ODIOMA expansion reads 0.0000 in the royalty column, from 2027 to 2048.

## Why this matters

A royalty is charged on gross revenue. For a refinery, gross revenue is the value of the products sold, and that value already contains the price of the crude the refinery bought. The royalty on that crude, where one is due, was paid by the producer who lifted it, and it sits inside the crude price the refinery pays. Charging a royalty again on the refinery's product sales would take a share of a figure that includes bought-in crude.

In the ODIOMA cash flow the gross revenue in each operating year is 346.1195 million and the net cash flow in year 2 is 38.5879 million. Any royalty rate above zero would be charged on the first of those figures and come out of the second.

## Reading the zero

A zero in a cash flow can mean two things: a value that is really zero, or a value nobody set. The screen is strict about that difference elsewhere, refusing a blank money box and asking for 0 where the value really is zero. Here the zero is set deliberately by the feasibility engine, with a stated reason. A reader who sees the royalty column should read it as a setting of the refinery case.

The royalty rate is one of the settings a user of the Studio cannot confuse with an estimate. It is a rule of the model for this kind of asset. The tax rate of 30 percent is an input and can be changed. The royalty rate of 0 follows from what the asset is: a plant that buys every barrel it runs.

## Exercise

Read the fiscalType, the royaltyRate and the taxRate that the feasibility engine hands to the screening engine, and the royalty column of the cash flow in 2027, 2029 and 2048. Say why the rate is 0 for a refinery, and what a royalty on the refinery's gross revenue of 346.1195 million a year would be charged on.
