# A month with a zero forecast

{{panel:joa-account-calculator}}

Some months the joint venture plans to spend nothing: a pause between campaigns, a month of waiting on a rig. With no threshold stated, such a month is still called, and its call is the adjustment alone. If that adjustment is a credit, the call would come out below zero, and the agreement's negative call rule decides what happens.

## The small case

A worked case uses parties A 50, B 30 and C 20 percent with no carry, a reconciliation lag of 1 month and no threshold. January 2027 forecasts 1000.000000 and spends 800.000000, an over-call of 200.000000. February forecasts 0.000000. March forecasts 400.000000.

With a lag of 1, January's over-call reaches February, a month with nothing to call. The engine's reasons for February:

> 2027-02: the over-call of 200 in 2027-01 (forecast 1000, actual 800) is credited against this cash call, 1 month later

> 2027-02: a forecast of 0: the cash call is the adjustment alone

## Two stated answers

The negative call rule is a required input with two values, and the engine holds no default between them.

**`"carry"`**: the credit waits for the next call. February's calls are 0.000000 and 200.000000 is carried to March, where the March forecast of 400.000000 is reduced to calls of 200.000000:

> 2027-02: the adjustment exceeds the forecast share of A, B, C: the call is 0 and the rest of the credit is carried to the next cash call

**`"refund"`**: the credit is paid back at once, as a negative call. February's calls total -200.000000 and March is called in full, 400.000000:

> 2027-02: the adjustment exceeds the forecast share of A, B, C: the excess is refunded (a negative call)

## What the texts print

The Norwegian accounting agreement (Attachment B, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024) prints both choices:

> "the Operator shall refund the excess amounts as soon as possible, unless the Parties agree to transfer the amount to the following period." (Norway Accounting Agreement Art. 1.2.1)

The engine does not read that sentence for you. Each agreement picks one, and you state it in the control "A negative call is (stated)".

## A month with a threshold

On the Ekene terms a threshold is stated, so April 2027, with a forecast of 0.000000, makes no call at all. Clear the threshold and April is called, for its adjustment alone. The Professional tier follows a credit larger than a call through a whole year.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Cash calls". Replace the box with the small case:

    {"parties":[{"id":"A","participatingPct":50},{"id":"B","participatingPct":30},{"id":"C","participatingPct":20}],"months":[{"month":"2027-01","forecast":1000,"actual":800},{"month":"2027-02","forecast":0,"actual":0},{"month":"2027-03","forecast":400,"actual":400}],"reconciliationLagMonths":1,"negativeCall":"carry"}

Run it and read February's calls and carried amounts. Then switch "A negative call is (stated)" to refund, run again, and write down February's and March's calls under each rule.
