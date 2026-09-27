# The capstone brief

{{panel:farmout-deal-calculator}}

The Professional capstone asks this tier's question: caps, vesting, value and the fee. It gives you a synthetic farm-out of its own, with its own parties, events, prospect, costs and terms, and asks for six values the engine returns. This lesson says what the capstone asks, where each value sits in the deal calculator, and how to rehearse on the Ekene Deep terms first.

## What the capstone gives you

The capstone card carries one case file with a block for each call. The `earning` block holds the parties and their participating interests, the farmor and the farminee, the events with their gross costs, shares paid, interests earned and caps, the vesting rule, the events completed, the cash bonus and the past costs. The `deal` block holds the parties, the prospect's chance of success, well costs and success-case value, and the deal terms with the assignor fees. The `fee` block holds the licence, the value of the transaction and its source, the intra group flag, the fee basis and the payment dates.

## The six values

| value | module | where to find it |
| --- | --- | --- |
| a stated party's payment on the first event | caps and overrun rules | the event table of "Caps, overrun rules and drill-to-earn" |
| a stated party's payment on the second event | drill-to-earn vesting | the event table of the same view |
| the farminee's EMV | deal value to each side | the positions table of "The value of the deal to each side" |
| the break-even share paid | break-even promote and chance | the "Break-even share paid" tile of the same view |
| the farminee's break-even chance of success | break-even promote and chance | the break-even chance table of the same view |
| the consent fee | the consent fee | the "Consent fee" tile of "The consent fee and its day rules" |

All six are reported to six decimals, as the panel prints them. Each is a return value of the engine on the card's terms, so there is exactly one right answer, and each is the same number under every reading the engine states. None is a Monte Carlo draw.

## How to load the case

Paste the whole case file into the box of each of the three views. Each view reads the block it needs and leaves the rest of the file alone. Nothing needs to be copied between views: every value comes from one view on one block.

## Things to check before you copy a figure

Check the controls above each box against the card. In the earning view: each event's cap and, for a gross-cost cap, its overrun rule; the vesting rule and the events completed. An event's payment is reported as its obligation whether or not it is completed, so read the event table for a payment and the totals for what has been paid. In the deal view: the chance, both well costs, the cap and the assignor fees. In the fee view: the basis, the licence, the value of the transaction and whether the transfer is intra group. Read the reasons: a payment names its cap state, an EMV names its position, a break-even names its term. If a view refuses the case, a term has been changed or mistyped: read the field the refusal names and restore the card's term.

## Exercise

Rehearse in the course's own deal calculator on figures this tier prints.

1. In "Caps, overrun rules and drill-to-earn", from "Ekene drill-to-earn, both events", read FIN's payment on the exploration well, 16000000.000000, and EKO's on the appraisal well, 7500000.000000.
2. In "The value of the deal to each side", from "The Ekene Deep deal, cash flows stated", read FIN's EMV, -1806224.721864, the break-even share paid, 35.594574, and FIN's break-even chance, 27.281304.
3. In "The consent fee and its day rules", from "The Ekene consent fee, paid on time", read the consent fee, 392000.000000.
4. For each of the six values, write the control or input on the card you will check first.
