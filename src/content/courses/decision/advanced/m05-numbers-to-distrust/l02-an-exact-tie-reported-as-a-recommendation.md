# An exact tie and what the screens say

When two branches are worth exactly the same, both apps say so: the tree engine reports every tied branch, the VOI Analyzer's insight names both actions as indifferent, and the Builder and the brief name every tied branch as the first move. One thing still follows listing order: the branch the engine marks.

{{panel:ec-judgement-explorer}}

## The rule in the tree engine

Two values tie when they differ by at most 1e-9 x max(1, |best|). A decision node lists every tied branch in tiedIndices and sets indifferent true; bestBranchIndex and the optimal path mark the first listed. On a small tree, Drill is worth 40.0000 less a cost of 10.0000 and Farm out is worth 30.0000:

| listing order | engine report | emv |
| --- | --- | --- |
| Drill first | tiedIndices [0, 1], indifferent true, Drill marked | 30.0000 |
| Farm out first | tiedIndices [0, 1], indifferent true, Farm out marked | 30.0000 |

The value and the tie report are the same both ways; only the marked path follows the typing order. A second set, tiedIndicesAtCardPrecision, holds every branch whose value rounds to the same two-decimal card as the best. The published equalEmvTie case ties "A" and "B" at 30.0000 on value, and "C" at 29.9990 joins them on the cards: tiedIndices [0, 1], tiedIndicesAtCardPrecision [0, 1, 2], with A marked. The EKPAN information tree ties its two root branches at a survey cost of 24.8250, both 75.7500, reports them tied and marks the acquisition, listed first.

## The same tie in the Analyzer

The VOI Analyzer's two actions are the named decision and "Do Not", with every payoff 0. Type Success at 25 percent paying 200, Dry hole at 75 percent paying -50, and a decision cost of 12.5. Acting is worth 0.25 x 200 plus 0.75 x -50, less 12.5, which is 0, exactly the value of "Do Not". The cards read:

| card | value |
| --- | --- |
| emvWithoutInfo | 0.00 |
| emvWithInfo | 20.00 |
| voi | 25.00 |
| netVoi | 20.00 |
| evpi | 46.88 |

The insight opens: "The Expected Monetary Value (EMV) without new information is $0.00M, and 'Drill Exploration Well' and 'Do Not Drill Exploration Well' both come to that figure, so the decision without new information is indifferent between them." Nothing is withheld, and the tree is drawn with root emv 20.0000.

## Why the tie matters here

At a tie, the value of information is at its most useful. The gross voi of 25.00 is large against an emvWithoutInfo of 0.00 because any signal at all can tip a perfectly unsettled decision. On the EKPAN lottery EVPI is largest at the drill against farm-out switch, 61.7143 at 0.228571, for the same reason.

## Reading the brief

For equalEmvTie the brief prints Optimal EMV 30.0000, Recommended first move Indifferent: "A", "B" and "C" come to the same figure, Next best alternative 30.0000 and Decision advantage "Indifferent at the precision shown". The Builder's cards read the same way, with "Indifferent" on the advantage card.

## The mistake

The careful mistake is to read the marked branch as the recommendation: the highlighted path, or bestBranchIndex in an export, names the first branch listed and nothing more. The honest report names both branches, their shared value, and an indifferent choice on EMV grounds. The opposite mistake is reordering the branches to get the label you prefer, which changes nothing but the mark.

## Exercise

Roll the Analyzer's tie case back by hand and show that acting is worth 0. Then quote what the insight says about the two actions, give the netVoi card, and state what the first-move and advantage rows of a Decision Studio brief print for equalEmvTie.
