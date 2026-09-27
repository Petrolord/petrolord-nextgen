# The forecast share of a cash call

{{panel:joa-account-calculator}}

Every cash call starts from the forecast: the operator's estimate of the joint venture's spending in the month. The engine splits the forecast between the parties on their paying interests, and each party's part is its forecast share. This lesson computes it for January 2027 on the Ekene terms and shows what the engine asks of the months you type.

## The rule

The first clause of the engine's rule:

> forecast share = forecast x paying interest; difference = forecast share - actual share for a month with a call; call = forecast share - (the difference of the month reconciliationLagMonths earlier + any amount carried)

The split itself goes through the canonical `calculatePartnerCosts` of the AFE engine, on the paying interests, as the partner split lesson showed.

## January 2027

The Ekene 2027 cash calls forecast 4000000.000000 for January 2027. The paying interests under NOC's carry split it:

| party | paying interest | forecast share | adjustment | call |
| --- | --- | --- | --- | --- |
| EKO | 50.000000 | 2000000.000000 | 0.000000 | 2000000.000000 |
| PA | 31.250000 | 1250000.000000 | 0.000000 | 1250000.000000 |
| PB | 18.750000 | 750000.000000 | 0.000000 | 750000.000000 |
| NOC | 0.000000 | 0.000000 | 0.000000 | 0.000000 |

January is the first month of the ledger, so no earlier month's difference reaches it: every adjustment is 0.000000 and every call equals its forecast share. From March on, calls and forecast shares part, as the next lesson shows.

## Why the paying interest

The forecast share uses the paying interest because a cash call collects cost. NOC's paying interest is 0.000000 because it is carried in full, so its forecast share is zero in every month, even though its beneficial interest is 20.000000. Split January's forecast on the participating interests by mistake and NOC would be called for a cost it does not bear, while each carrier would be called short of its paying interest.

## What the engine asks of the months

The months must be written as `YYYY-MM` and must follow one another with no gap, because the reconciliation lag counts months. A month that skips is refused, and the message names the month it expected:

> months[1].month must be 2027-02, the month after 2027-01 (the months are consecutive); got "2027-03"

A month written without its leading zero is refused:

> months[0].month must be a month 'YYYY-MM'; got "2027-1"

Each month reads only three keys, `month`, `forecast` and `actual`; a budget figure typed beside them is refused by name:

> months[0].budget is not an accepted key; the accepted keys of months[0] are month, forecast, actual

And an actual below zero is refused, since spending cannot be negative:

> months[0].actual must be a finite number at or above 0; got -1

## One call is one month

A forecast share is computed for every month in the box, called or not. This tier reads one month at a time. The Professional tier reads the whole year as a ledger, with balances carried from month to month.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Cash calls". Run the Ekene 2027 box and read the January 2027 rows of the per-party table; check each forecast share against the table above. Then change the second month's `month` from "2027-02" to "2027-03" and read the refusal. Restore it, change January's `month` to "2027-1", and write down what each refusal says the engine expected.
