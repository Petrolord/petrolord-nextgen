# The no-call threshold and billing in arrears

{{panel:joa-account-calculator}}

For a small month a cash call is more effort than it is worth, so an agreement may let the operator skip the call and bill the month's actual spending afterwards. This lesson works the threshold, the arrears billing and the payment.

## What the Norwegian accounting agreement says

The Norwegian accounting agreement (Attachment B, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024) sets a threshold:

> "Where the total cash requirement is less than NOK 5 million a month, the Operator is not required to make cash calls." (Norway Accounting Agreement Art. 1.2.1)

And it says how a month with no call is paid:

> "If the Operator has made no request for advance payments, the Non-operators shall pay their proportionate share of the actual monthly payments within 15 days after receipt of the Operator's billing" (Norway Accounting Agreement Art. 1.2.1)

The NOK 5 million is the Norwegian text's figure. The engine holds none: the threshold is an optional input, `noCallBelow`, and with none stated every month is called.

## The engine's threshold rule

On the Ekene terms the engine states its threshold in its basis:

> no cash call in a month whose forecast is below 500000; its actual share is billed in arrears the next month

The test is on the **forecast**, since the call is made before the actuals are known, and it is **strictly below**: a forecast equal to the threshold is called.

## The boundary, on a small case

A worked case with parties A 50, B 30 and C 20 percent and a threshold of 500 shows the edge. January 2027 forecasts exactly 500.000000 and is called. February forecasts 499.000000 and is not:

> 2027-02: no cash call: the forecast 499 is below the stated threshold 500; the actual is billed in arrears in the next month

By the rule, February's actual share is billed in arrears the month after.

## The Ekene months

The Ekene 2027 forecasts include two months with no call. April forecasts 0.000000, below the threshold of 500000.000000, and May forecasts 400000.000000, also below it. Neither is called. May's actual is billed in arrears in June, so June's payment holds two parts: the June call and the May arrears billing.

## Reading the columns

In the cash calls view, the month totals table prints for each month whether it was `called`, the `calls`, the `arrears billed` and the `total paid`. The per-party table prints each party's `call`, `arrears billing` and `paid`. A party's payment in a month is its call plus any arrears billing it receives that month. A month with no call shows `called` false and a call of 0.000000, and its actual share still appears.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Cash calls". Run the Ekene 2027 box. Read April, May and June 2027 in the month totals table and write down which were called and what June's arrears billed column holds. In the per-party table, check for EKO that June's paid equals its call plus its arrears billing. Then clear the control "No cash call below (optional)" and run it again. Write down which months are now called and what happens to June's arrears billing.
