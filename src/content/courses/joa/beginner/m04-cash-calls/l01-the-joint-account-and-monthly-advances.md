# The joint account and monthly advances

{{panel:joa-account-calculator}}

The operator spends the joint venture's money before the parties see the bills. To avoid financing the whole venture out of its own pocket, it asks each party for an advance every month, the cash call, against a forecast of the month's spending. This module works one month's cash call at a time: the forecast share, the actual share, the difference, and how that difference adjusts a later call.

## Four clauses from the public texts

The Norwegian joint operating agreement (Attachment A, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024) obliges the parties to fund the joint work:

> "The Parties are obliged to provide sufficient funds to cover all expenses relating to the activities of the joint venture." (Norway JOA Art. 8.1)

The Kenya Model Production Sharing Contract (the 2015 model, Participation Agreement) lets the operator ask in advance:

> "request a non-operator to advance a share of the estimated expenditure for the following month, stipulating the due date of payment" (Kenya Model PSC 2015, Participation Agreement Art. 6.2)

The Norwegian accounting agreement (Attachment B) then corrects the estimate:

> "The difference between the monthly cash advances and the actual payments in each currency shall be stated, and the next request for advances shall be adjusted accordingly." (Norway Accounting Agreement Art. 1.2.1)

And the Kenya model says the same from the other side:

> "If any non-operator's advances for a given month exceed its share of cash disbursements for the same month, the next succeeding cash advance, after such determination, shall be reduced accordingly." (Kenya Model PSC 2015, Participation Agreement Art. 6.4)

## The engine's rule

The engine computes each month's call from those clauses. Its basis states the rule:

> forecast share = forecast x paying interest; difference = forecast share - actual share for a month with a call; call = forecast share - (the difference of the month reconciliationLagMonths earlier + any amount carried)

## The terms you state

Three terms shape every cash call, and each has a control above the box in the cash calls view:

* **Reconciliation lag, months (stated).** How many months later a month's difference adjusts a call. Required, a whole number of at least one, with no default. The Ekene terms state 2.
* **A negative call is (stated).** What happens when a credit is larger than a call: `"refund"` or `"carry"`. Required, with no default. The Ekene terms state `"carry"`.
* **No cash call below (optional).** A threshold under which the operator makes no call that month. The Ekene terms state 500000.000000.

Leave the lag unstated and the engine refuses:

> reconciliationLagMonths must be an integer at or above 1; got nothing

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Cash calls". Run the Ekene 2027 box and find the three controls above it. Clear the control "Reconciliation lag, months (stated)" and read the refusal. Restore it to 2. Then set "A negative call is (stated)" to "not stated" and write down the field the refusal names.
