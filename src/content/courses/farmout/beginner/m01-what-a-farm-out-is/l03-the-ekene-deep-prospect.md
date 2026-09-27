# The Ekene Deep prospect

{{panel:farmout-earning-calculator}}

Every deal this course teaches comes from one fixture file, the Ekene Deep farm-out. It is written by a stated script that reproduces it, and it labels itself plainly:

> SYNTHETIC teaching data for the Ekene field (ours). No real company, deal, prospect, price or regulator decision. The Ekene Deep prospect and every party below are synthetic.

Ekene Deep is an exploration prospect on the Ekene petroleum prospecting licence. Money is in US dollars, in whole dollars. Because the file is ours and synthetic, every figure it holds is a stated term of a made-up deal, chosen to show one rule at a time.

## The prospect's terms

The fixture states the prospect before any deal is struck:

| term (fixture) | stated figure |
| --- | --- |
| chance of success, percent | 25.000000 |
| exploration well as a dry hole | 40000000.000000 |
| exploration well on a success, tested and suspended | 46000000.000000 |

This tier uses the success-case well of 46000000.000000 as the gross cost of the earning event. The chance of success and the dry-hole cost enter when a later tier asks what the deal is worth to each side.

## The deal's terms

| term of the deal (fixture) | stated figure |
| --- | --- |
| share of the exploration well FIN pays, percent | 40.000000 |
| participating interest FIN earns from EKO, percent | 30.000000 |
| cap on the gross cost | 44000000.000000 |
| cash bonus | 2000000.000000 |
| past costs | 12000000.000000 |
| share of the past costs reimbursed, percent | 30.000000 |

The cap comes with an overrun rule, "post-deal-interests", which says who pays any cost above it. Caps and their overrun rules are taken up at the Professional tier; at this tier you read the cap in the engine's reasons and leave its working for later.

## What is planted in the file

The fixture's README lists nine planted situations, each one found by a stated engine behaviour. They concern the value of the deal to each side, the break-even promote, the cap, drill-to-earn vesting, a seismic signal, the spread of outcomes, a development carry and the price of an interest, and the Professional and Expert tiers take them up one by one. At this tier the file supplies the terms of one earning event, and you read what the engine returns for it: the split of the well, the promote, the consideration and the participating interests after the deal.

## Each term is stated, and the engine holds none

The engine decides nothing a deal does not state. Every share paid, participating interest earned, cap, overrun rule, vesting rule, cash bonus and reimbursement is an input with no default. When you change a term in the calculator, the engine computes the deal you stated; when you remove one, the engine refuses and names it. The Ekene file is simply a set of terms somebody wrote down, which is why it is a good place to practise.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "The Ekene Deep well, a gross-cost cap". Match each row of the deal table above to its control or its line in the box: the gross cost, the share the farminee pays, the participating interest earned, the cap and its amount, the cash bonus, the past costs and the past costs reimbursed. Then read the first line of the engine's reasons and find where it names the cap and the overrun rule.
