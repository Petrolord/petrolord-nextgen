# Actuals and the difference

{{panel:joa-account-calculator}}

A forecast is an estimate, and the month's actual spending always differs from it by something. After the month closes, the operator books the actual joint spending and splits it on the same paying interests. The gap between what a party advanced and what it owed is its difference, and a later cash call corrects it.

## The difference

The engine's rule defines it for a month with a call:

> forecast share = forecast x paying interest; difference = forecast share - actual share for a month with a call; call = forecast share - (the difference of the month reconciliationLagMonths earlier + any amount carried)

A difference above zero is an **over-call**: the party advanced more than its share of the month's spending, and it is owed a credit. A difference below zero is an **under-call**: it advanced too little and owes the rest.

## January 2027

The Ekene forecast for January 2027 was 4000000.000000; the actual was 3600000.000000. Split on the paying interests:

| party | forecast share | actual share | difference |
| --- | --- | --- | --- |
| EKO | 2000000.000000 | 1800000.000000 | 200000.000000 |
| PA | 1250000.000000 | 1125000.000000 | 125000.000000 |
| PB | 750000.000000 | 675000.000000 | 75000.000000 |
| NOC | 0.000000 | 0.000000 | 0.000000 |

January was over-called. The differences total 400000.000000, and each party's part is its paying interest of that total.

## When the difference reaches a call

The difference is not repaid on the spot. The agreement states a reconciliation lag, and the difference of a month adjusts the call that many months later. The Ekene terms state a lag of 2 months, so January's over-call is credited against the March call: EKO's March call is reduced by its difference of 200000.000000, PA's by 125000.000000 and PB's by 75000.000000.

A small worked case shows the credit landing with a lag of 1. The parties are A 50, B 30 and C 20 percent, with no carry. December 2026 forecast 1000.000000 and spent 900.000000. The engine's reason for January 2027:

> 2027-01: the over-call of 100 in 2026-12 (forecast 1000, actual 900) is credited against this cash call, 1 month later

January 2027 also forecast 1000.000000, and its calls total 900.000000: the forecast less December's over-call. The lag moves a difference across a year end with no special rule.

## Why a lag at all

The operator cannot know a month's actuals on the last day of the month, because invoices for a month can arrive after it ends. The lag gives the operator time to book the actuals before the difference is applied. How long that takes is a matter for each agreement, which is why the engine holds no default lag.

## The sign convention

In the per-party table the adjustment column prints a credit as a positive figure, subtracted from the forecast share to give the call. An under-call adjusts a later call upward. Read the reason beside each adjusted month; it says in words which month's difference was applied and in which direction.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Cash calls". Run the Ekene 2027 box and read the January 2027 rows: check each actual share and difference against the table above. Find the March 2027 rows and check that each paying party's adjustment is its January difference. Then change the control "Reconciliation lag, months (stated)" from 2 to 1, run it, and write down the month in which January's over-call now reaches a call.
