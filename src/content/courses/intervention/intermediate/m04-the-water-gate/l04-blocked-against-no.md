# Blocked against no

`screenTreatments` refuses a treatment in two different ways, and only one of them sets a flag and carries a sentence saying why.

{{panel:pd-channel-explorer}}

## Two refusals in one enumeration

The verdict order is fixed at candidate, consider, marginal, blocked, unknown, no. Blocked sorts above unknown and no, so a blocked treatment prints higher in the ranked list than one the screening simply declined. Blocked also sets a separate boolean to true, and it is the only verdict carrying a block reason. A "no" leaves that boolean false and carries none.

## The same treatment refused three ways

Teaching well ELELENWO-4 is a case this course built to carry a result, not a published one. It runs at 74.5 percent water and a skin of 7.5, and these are derived screenings of that one well row.

| The shutoff was refused because | Verdict | Blocked | Reasons |
| --- | --- | --- | --- |
| the water cut was swept down to 29.0 percent | no | false | 1 |
| the reading at a late fraction of 0.9 said displacement | blocked | true | 1 |
| no diagnosis was handed in at all | blocked | true | 1 |

Both blocked rows carry a block reason and the first does not. On the untouched channelling reading at the default late fraction of 0.5 the shutoff is a candidate with 3 reasons, and every refusal here cuts that to 1.

## The mechanism does not decide which shape you get

Reduce drawdown is refused by the mechanism and still comes back no, with the reason "Only worth it for coning, and the diagnostic does not say coning. Choking a channelling well back gives away rate without touching the water path." That is the diagnosis speaking and the boolean stays false. In every screening this course prints, the only treatment that ever comes back blocked is the water shutoff squeeze. Blocked is not a rank of severity, it is a branch written for one treatment.

## What each refusal is waiting on

A no can be reversed by the well. At 29.0 percent water the shutoff is no with 1 reason and at 30.0 percent it is a candidate with 3. A block is reversed only by a different reading of the same history: at a late fraction of 0.5 those 38 samples give channelling and a candidate, at 0.9 they give displacement and a block.

## The mistake

Writing "the shutoff was rejected" and dropping which kind. The no at 29.0 percent is waiting on the well and the block at 0.9 is waiting on the reading. Nothing checks either verdict: `screenTreatments` and `rankTreatments` are asserted against nothing, and the published file carries no expected verdict and no expected block reason.

## Exercise

Refuse the shutoff twice in the panel, once by dropping the water cut below 30.0 percent and once by taking the reading to a late fraction of 0.9, and record the verdict, the blocked flag and the reason count each time.

Then say which of the two a change in the well could ever reverse.
