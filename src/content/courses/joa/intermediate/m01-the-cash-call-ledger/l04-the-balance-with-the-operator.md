# The balance with the operator

{{panel:joa-recovery-calculator}}

At any month end a paying party has either advanced more than its share of what was spent, or less. The difference is its balance with the operator. The engine keeps it for every party in every month, with an identity you can check on any row.

## The identity

The engine's basis states it verbatim:

> balance with the operator = differences not yet adjusted + carried - arrears billed and not yet paid

A positive balance is money the operator holds for the party: an over-call waiting for its credit, or a credit carried to a later call. A negative balance is money the party owes: an under-call waiting to be added, or a month's actual spend made without a call and not yet billed. On the Ekene ledger EKO's balance is 200000.000000 after January, its over-call, and -50000.000000 after February, once its February under-call of -250000.000000 is added.

## The months without a call

The Ekene terms state no cash call below 500000.000000. April's forecast is 0.000000 and May's is 400000.000000, so neither month is called, and May's actual spend of 448000.000000 is billed in arrears in June:

> 2027-06: the actual of 2027-05, 448000, made without a cash call, is billed in arrears

The Norwegian Accounting Agreement (Attachment B, unofficial English translation, PDF dated 27 February 2007, cited from its Wayback Machine capture of 26 May 2024, read on 2026-09-26) prints the threshold as its own figure:

> "Where the total cash requirement is less than NOK 5 million a month, the Operator is not required to make cash calls." (Norway Accounting Agreement Art. 1.2.1)

The engine holds no threshold: the Ekene figure is the fixture's stated term.

At the end of May, EKO has 150000.000000 carried (its March over-call less its February under-call, neither yet met by a call) and 224000.000000 of May spend not yet billed. The identity gives its balance, -74000.000000. In June its call is 4350000.000000 on a forecast share of 4500000.000000, it is billed 224000.000000 in arrears, and its balance returns to 0.000000. June's payments total 9148000.000000 for the whole venture, the call and the arrears together.

## The close of the year

| closing | balance | differences not yet adjusted | carried | arrears due |
| --- | --- | --- | --- | --- |
| EKO | -48000.000000 | -48000.000000 | 0.000000 | 0.000000 |
| PA | -30000.000000 | -30000.000000 | 0.000000 | 0.000000 |
| PB | -18000.000000 | -18000.000000 | 0.000000 | 0.000000 |
| NOC | 0.000000 | 0.000000 | 0.000000 | 0.000000 |

With a lag of 2, the differences of November and December are still open at the close, and nothing is carried or in arrears. For every party the balance less the three terms is within 0.000001 of zero.

Stating no threshold changes the path. On the golden input that calls every month, no spend is billed in arrears, the arrears total is 0.000000 and the calls over the year are 69052000.000000; EKO's closing balance is again -48000.000000.

## Exercise

Work in the course's own recovery calculator, view "The cash call ledger", starting from "The Ekene 2027 ledger, a credit carried".

1. Find the 2027-05 rows. For each paying party, check the identity: carried less arrears not yet billed gives the balance.
2. Read the 2027-06 rows and the tile "Arrears billed", and check EKO's call and arrears billing.
3. Read the closing table and check the identity on every row.
4. Clear the control "No cash call below (optional)". Read the tiles "Calls over the ledger" and "Arrears billed" and the closing balances, and compare them with the figures above.
