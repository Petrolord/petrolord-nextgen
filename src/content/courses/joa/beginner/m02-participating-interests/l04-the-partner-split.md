# The partner split of a joint account amount

{{panel:joa-account-calculator}}

The operator keeps one set of books for the joint venture, the joint account. Every cost of the joint work is booked there first as one amount, and then split between the parties. This lesson is about that split: which share it uses, which code performs it, and how to check it by hand.

## One canonical split

The engine does not carry its own splitting arithmetic. Every joint account amount it divides between parties goes through the canonical `calculatePartnerCosts` function of `engines/economics/afe.js`, the partner split of the platform's AFE engine. The engine's basis says so in its own words:

> every split of a joint account amount is calculatePartnerCosts from engines/economics/afe.js on the paying interests

For a cost, the split is on the paying interests. For production, the engine uses the same function on the beneficial interests. With one split, a joint account amount divides the same way wherever the engine divides it.

## January 2027 on the Ekene terms

The Ekene 2027 cash calls forecast 4000000.000000 of joint spending for January 2027. The paying interests under NOC's carry are EKO 50.000000, PA 31.250000, PB 18.750000 and NOC 0.000000. The engine splits the forecast as:

| party | paying interest | forecast share |
| --- | --- | --- |
| EKO | 50.000000 | 2000000.000000 |
| PA | 31.250000 | 1250000.000000 |
| PB | 18.750000 | 750000.000000 |
| NOC | 0.000000 | 0.000000 |

Check it by hand: 50 percent of 4000000 is 2000000, and the shares add back to the forecast. NOC's share is zero because its whole cost share is carried.

## The split is a share, and the call is more

The forecast share is the starting point of a cash call. It is the forecast times the paying interest. The call a party actually receives can differ from its forecast share, because an earlier month's difference may adjust it; the cash calls module takes that up. In January 2027 there is no earlier month in the ledger, so each party's call equals its forecast share.

## What a split does not decide

The split divides an amount the parties have already agreed is a joint cost. It does not decide whether the amount belongs in the joint account at all, whether it was inside the budget, or whether the operator may add overhead to it. Those are the questions of the budget control and overhead modules. It also does not decide what happens when a party does not pay its share; the Professional tier takes up default.

## Reading the split in the panel

In the cash calls view, the per-party table prints each party's forecast share, its adjustment, its call and its actual share month by month. The first column reads as the month and the party together, such as `2027-01 EKO`. The month totals table above it prints the forecast and the calls summed over the parties.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Cash calls". Run the Ekene 2027 box. In the per-party table, read the four January 2027 rows and check each forecast share against the table above. Then change January's `forecast` in the box to 6000000 and run it again. Write down the new forecast share of each party, and check that the four shares add back to the forecast.
