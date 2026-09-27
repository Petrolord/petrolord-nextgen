# Demand and lead-time variation

{{panel:materials-stock-calculator}}

Two things can empty a shelf before a replacement arrives: demand can run high while the order is on its way, or the order can take longer than planned. The engine takes a stated standard deviation for each, and both feed sigma, the standard deviation of demand over the protection period.

## Demand variation

The demand a period has a mean and a standard deviation. On the choke bean set, 3.3333 sets a month with a standard deviation of 1.6 sets a month. Over a fixed lead time of L periods, the variances of independent periods add, so the demand spread over the lead time grows with the square root of L. A longer lead time carries more demand uncertainty, but less than in proportion.

## Lead-time variation

The lead time has a mean and a standard deviation too. On the choke bean set, 2.5 months with a standard deviation of 0.5 months. A lead time that runs long lets the mean demand run on for longer, so this part of sigma is the demand a period times the lead-time spread.

The fixture's note on the choke bean case, verbatim:

> periods are months; lead time 2.5 months with a standard deviation of 0.5 months

## Each part on its own

The engine shows what each part contributes if the other is set to zero. On the choke bean set at a cycle service level of 0.95, rounded up to a whole set:

| case | demand over P | sigma | safety stock | reorder point |
| --- | --- | --- | --- | --- |
| as stated | 8.333250 | 3.029476 | 4.983044 | 13.316294 |
| lead-time spread set to 0 | 8.333250 | 2.529822 | 4.161187 | 12.494437 |
| demand spread set to 0 | 8.333250 | 1.666650 | 2.741395 | 11.074645 |

The mean demand over P is the same in every row. With the lead-time spread removed, sigma falls from 3.029476 to 2.529822; with the demand spread removed, to 1.666650. For this item demand variation is the larger part, and a supplier who cut the lead-time spread to nothing would save less than one set of safety stock.

## Lead-time spread alone

A separate stated case shows the second part cleanly: a steady demand of 20 a period with no spread, a lead time of 5 periods with a standard deviation of 1.5. Sigma is 30.000000, which is the demand times the lead-time spread. The engine's reason, verbatim:

> a cycle service level of 0.9 gives k = Phi^-1(0.9) = 1.281552, read as 1; safety stock 30 over a demand of 100 with sigma 30 gives the reorder point s 130, held as 130 (up to a multiple of 5)

The safety factor there is read from a table to whole numbers, a stated reading a later lesson takes up.

## A spread cannot be negative

A standard deviation below zero means nothing, and the engine refuses it by name:

> demandSd must be a finite number at or above 0; got -1

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, cycle service level". Confirm the first row of the table. Set the control "Lead time, standard deviation (stated)" to 0 and confirm the second row. Restore it to 0.5, set "Demand a period, standard deviation (stated)" to 0 and confirm the third row.

Then start from "Lead-time spread alone" and confirm sigma 30.000000. Set the demand standard deviation to -1 and read the refusal.
