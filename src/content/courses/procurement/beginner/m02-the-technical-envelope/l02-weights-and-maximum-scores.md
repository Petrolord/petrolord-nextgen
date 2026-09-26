# Weights and maximum scores

{{panel:pr-envelope-calculator}}

A technical proposal is judged on several criteria at once: the method, the people, the equipment, the safety plan, the programme. Each criterion gets a weight that says how much it matters and a maximum score that sets the scale the panel marks on. This lesson reads both and the rules the engine enforces on them.

## The well services criteria

| criterion (fixture) | weight | maxScore | what it scores |
| --- | --- | --- | --- |
| methodology | 30 | 4 | Method statement for the cleanout and the acid treatment |
| personnel | 25 | 4 | Key personnel: CT supervisor, pumping engineer, HSE lead |
| equipment | 20 | 4 | CT unit, pumps and N2 unit: age, certification, back-up |
| hse | 15 | 4 | HSE plan for live-well intervention and acid handling |
| schedule | 10 | 4 | Mobilisation and work programme |

The weights are percentages of the whole technical judgement, and they sum to 100. The committee that wrote this tender decided that the method of a live-well acid job matters three times as much as the mobilisation programme. That is a judgement, and it is stated in the tender before any bid is read.

## The materials criteria

The materials tender weights specification 60, delivery 25 and after-sales 15, each also on a maximum score of 4. Specification dominates because a casing string or a wellhead valve that fails its data sheet is useless at any price.

## The weights must sum to 100

The engine reads weights as percentages, so it requires them to sum to 100, within a tolerance of 1e-9 to absorb binary rounding. A tender whose weights sum to 99 is refused:

> criteria weights must sum to 100; they sum to 99

A weight of zero is refused too, since a criterion that counts for nothing should not be on the list:

> criteria[0].weight must be a finite number above 0

## The maximum score sets the scale

Each criterion has its own maxScore, the top of the scale the panel marks it on. Both Ekene tenders use 0 to 4 throughout, but a tender may mix scales, and the engine divides each score by its own maximum. A maxScore of zero is refused:

> criteria[0].maxScore must be a finite number above 0

## Every score inside its scale

A score above its criterion's maximum is refused, naming the criterion:

> bids[0].scores.methodology must be a number from 0 to 4 (the criterion's maxScore)

A missing score is refused with the same message for that criterion, here hse:

> bids[0].scores.hse must be a number from 0 to 4 (the criterion's maxScore)

The engine will not treat a missing mark as zero. A blank may mean the evaluator forgot, and a silent zero would sink a bid on a clerical slip. The refusal sends the sheet back to be completed.

## Exercise

In the envelope calculator choose "The technical envelope". In the criteria box, change the schedule criterion's weight from 10 to 9 and read the refusal. Now move that one point to methodology, making it 31, and check that the bids are scored again. Restore both. Next, give WS1 a methodology score of 5 and read the refusal, then delete WS1's hse score and compare the two messages. Finally, change the hse criterion's maxScore to 5 and note which bids' technical percentages move and in which direction.
