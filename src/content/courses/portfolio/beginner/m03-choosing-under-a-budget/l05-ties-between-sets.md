# Ties between sets

Two different sets of projects can fit the same limit and return the same summed risked EMV. The optimizer returns one of them, names no other, and gives no sign that a tie existed.

{{panel:ec-capital-explorer}}

## Two published ties

| case | capex limit | engine set | total capex | total risked EMV | optimal sets in the golden |
| --- | --- | --- | --- | --- | --- |
| tieIdenticalProjects | 100.0000 | twinA | 100.0000 | 50.0000 | twinA, or twinB |
| tieDifferentComposition | 100.0000 | A | 100.0000 | 80.0000 | A, or B + C |

In `tieIdenticalProjects` two identical projects each fill the limit of 100.0000 for 50.0000. The engine funds `twinA`, and the golden accepts either one, because nothing in the inputs separates them.

`tieDifferentComposition` is the harder tie. The engine funds project A alone for 80.0000. The golden lists a second optimum, B + C, reaching the same 80.0000 with two projects instead of one. The tie holds on the objective and on nothing else: one set is a single bet, the other spreads the same value over two.

## How the engine picks

The knapsack keeps the first set it builds for a given capacity and replaces it only with a set of strictly larger risked EMV. An equal set found later does not displace it. Which of two tied sets comes back therefore depends on the order the projects were entered, and it can change if the inventory is re-sorted. The output holds `optimalProjects`, the total capex and the risked EMV; it has no field for alternative optima.

## What a tie hides

Tied sets can differ in everything the optimizer ignores. They can hold different numbers of projects, different chances of success, different fail costs and different success spreads, so their P(loss) and their P90 can differ widely. The risk summary is computed only for the set the engine returned. The tied set is never simulated, so a reviewer never sees that an equally valuable alternative carried less risk.

## Near ties on OKONO

At 450.0000 the optimizer's set, OK-1 + OK-3 + OK-4, returns 291.0000, and the set filled from the ranking by risked EMV per million, OK-1 + OK-4 + OK-5, returns 287.7500 for capex 420.0000. The gap is 3.2500. The two sets are not tied, but their risk profiles differ sharply: the first holds the exploration well, with a `pos` of 0.250000 and a fail cost of 85.0000, and the second holds the workovers, with a `pos` of 1.000000 and none. A small revision to one project's inputs could close the gap, and then the order the projects were entered in would decide which set came back.

## The mistake

The mistake is reading the engine's set as the unique answer. When a board asks why A was chosen over B + C, "the optimizer picked it" is not a reason: the optimizer was indifferent. Where risked EMVs are equal or close, the choice between sets is a judgement about risk, count and execution that the engine leaves entirely to you.

## Exercise

For both published tie cases, give the limit, the engine's set, its risked EMV and every optimal set the golden accepts. Then explain how the engine chooses between tied sets, and name two things that could differ between A and B + C that the optimizer never looks at.
