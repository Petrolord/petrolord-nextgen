# The value of the transaction, as the regulations define it

{{panel:farmout-deal-calculator}}

Seven per cent of what? The fee is only as definite as the value it is charged on, and the 2024 Regulations define that value twice. The engine decides neither version: it takes the value of the transaction as a stated input with a stated source. This lesson reads both definitions, the engine's basis and the Ekene fixture's choice.

## The first definition, in reg. 19(3)

The regulation gives two ways to fix the amount:

> "(3) The value of transaction pursuant to sub-regulation (2) of this regulation shall be by either the amount: (a) payable to the Assignor, as stated in the application or transaction contract; or" (AOI Regulations 2024 reg. 19(3)(a))

> "(b) prescribed by the Commission, using the metrics for the determination of good and valuable consideration for the asset at the relevant time." (AOI Regulations 2024 reg. 19(3)(b))

## The second definition, in reg. 24

The interpretation regulation defines the same words again, and names the Commission alone:

> "“Value of the Transaction” means the amount determined by the Commission to be the value receivable by the Assignor for an Assignment," (AOI Regulations 2024 reg. 24, "Value of the Transaction")

The course shows the text as it prints it. The Expert tier returns to this and the regulations' other quirks.

## The engine's basis

> the value of the transaction is a stated input: the sum payable to the Assignor stated in the application or contract, or an amount the Commission determines (reg. 19(3)); the engine does not decide which consideration of a farm-out counts

The source is a stated input too. The deal calculator's control "Value of the transaction is (stated)" offers "contract-amount" and "commission-determined", and any other word is refused:

> valueSource must be one of "contract-amount", "commission-determined"; got "market"

A missing amount is refused by name:

> transactionValue must be a finite number at or above 0; got nothing

## Which part of a farm-out counts

A farm-out's consideration has three parts: the carry, the cash bonus and the reimbursement. The Ekene fixture states a value of the transaction of 5600000.000000, the cash bonus of 2000000.000000 plus the reimbursement of 3600000.000000. It leaves the carry out. A deal that counted the carry as well would state a larger value, and the engine would charge seven per cent of it. On the Ekene Deep terms the whole consideration is 10000000.000000.

Neither choice is the engine's. The 2024 Regulations leave the amount to the application, the contract or the Commission, and the engine leaves it to the stated input.

## Exercise

Work in the course's own deal calculator.

1. Open the view "The consent fee and its day rules" and start from "The Ekene consent fee, paid on time". Read the value basis note under the tiles.
2. With the control "Value of the transaction (stated)", set the value to 10000000, the Ekene Deep consideration with the carry counted. Read the fee.
3. Set "Value of the transaction is (stated)" to "an amount the Commission determines" and read how the reason now names the source.
4. Set the value to "not stated" and read the refusal.
