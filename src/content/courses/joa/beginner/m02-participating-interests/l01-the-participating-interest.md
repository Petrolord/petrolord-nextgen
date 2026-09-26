# The participating interest

{{panel:joa-account-calculator}}

A participating interest is a party's percentage share of the joint venture as the agreement states it. It is the first number the agreement fixes for each party, and every other share this tier computes starts from it. In the Ekene joint venture EKO holds 40.000000 percent, PA 25.000000, PB 15.000000 and NOC 20.000000.

## What the participating interest decides

With no carry in the agreement, one percentage decides two things at once: how much of each joint cost a party pays, and how much of the production it takes. The Norwegian joint operating agreement (Attachment A, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024) ties the payment to the share at the moment money moves:

> "the amount to be contributed by each Party shall be calculated in accordance with the Participating interest at the time the payment is made." (Norway JOA Art. 8.1)

The words "at the time the payment is made" matter. Interests can change during the life of a licence, and a payment is split by the interests in force when it is made. The engine computes one set of interests for each call, from the parties you state in the box.

## Three interests in the engine's output

The engine returns three percentages for every party, and it states the rule it applies in its basis:

> beneficial interest = participating interest (the share of production); paying interest = participating interest - the carried part of a carried party's share + the carriers' shares of every carry

Read the rule from left to right. The **beneficial interest** is the share of production, and it always equals the participating interest. The **paying interest** is the share of cost, and it moves away from the participating interest only when a carry moves cost from one party to others. The next module takes up carries. For now, look at what happens when there is none.

## The Ekene venture with no carry

The worked case `int-ekene-no-carry` states the same four parties and no carry. The engine returns:

| party | beneficial interest | paying interest | carried percent |
| --- | --- | --- | --- |
| EKO | 40.000000 | 40.000000 | 0.000000 |
| PA | 25.000000 | 25.000000 | 0.000000 |
| PB | 15.000000 | 15.000000 | 0.000000 |
| NOC | 20.000000 | 20.000000 | 0.000000 |

Every party pays what it owns and owns what it pays. The engine returns no reason for this case, because nothing moved.

## What the participating interest does not say

A participating interest is a share of the joint venture's costs and production under the agreement. It says nothing about the host government's take, royalty or tax; those belong to the fiscal regime course and the Petroleum Industry Act course. It is also a share of this one licence only: a company can hold different interests in different licences, each under its own agreement.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Participating, paying and beneficial interests". Start from "The Ekene joint venture, NOC carried pro rata". In the box, delete the whole `carries` array, including its key, and run it. Compare each party's paying interest with its beneficial interest, and check the two totals tiles. Then restore the carry and run it again, and write down which party's paying interest changed and which beneficial interests stayed where they were.
