# The best action after each signal

After each reading the EKPAN decision is made again, at that reading's posteriors. A bright spot keeps Drill, worth 207.7989 million USD, and no bright spot changes the action to Farm out, worth 9.2361.

{{panel:ec-information-explorer}}

## After a bright spot

Success is 0.646739 likely and dry hole 0.353261.

| action | chance node value | branch cost | branch value |
| --- | --- | --- | --- |
| Drill | 262.7989 | 55.0000 | 207.7989 |
| Farm out | 61.4402 | none | 61.4402 |
| Walk away | 0.0000 | none | 0.0000 |

Drill's chance node is 0.646739 x 420.0000 + 0.353261 x -25.0000 = 262.7989, and less its 55.0000 cost the branch is 207.7989. Farm out weights 95.0000 and 0.0000 to 61.4402. Drill is best.

## After no bright spot

Success is 0.097222 likely and dry hole 0.902778.

| action | chance node value | branch cost | branch value |
| --- | --- | --- | --- |
| Drill | 18.2639 | 55.0000 | -36.7361 |
| Farm out | 9.2361 | none | 9.2361 |
| Walk away | 0.0000 | none | 0.0000 |

Drill's chance node is 18.2639, and after the 55.0000 cost the branch is -36.7361. Farm out is best at 9.2361.

## The switch explains both

On the EKPAN lottery Drill and Farm out are worth the same at a success probability of 0.228571. A posterior above it favours Drill; a posterior below it favours Farm out. 0.646739 is above and 0.097222 is below. The survey earns its value because its two posteriors straddle the switch, so the two readings lead to different actions. Without the survey the choice at 0.350000 is Drill for every prospect, at 75.7500; with it, the readings that lean dry are farmed out.

## Why the action must change

If both readings led to Drill, the survey would be worth nothing, whatever it did to the probabilities. Information is worth exactly the money earned by acting differently on some reading. Here one reading changes the action, and it is the reading after which 0.902778 of prospects are dry. On the reading that keeps Drill the survey earns nothing over the prior action; all of its value comes from farming out at 9.2361 where Drill would be -36.7361.

## Ties and what the engine assumes

Walk away is worth 0.0000 after either reading and is never best, because Farm out cannot lose money. If two actions tied at a posterior, the engine would keep the one listed first. The choice is risk neutral: after a bright spot Drill still loses 80.0000 net of its cost with probability 0.353261, and the engine gives that loss no weight beyond its expectation.

## The mistake

After a bright spot the drill chance node is worth 262.7989, its value before the 55.0000 on the branch leading into it, and the Decision Tree Builder's drawing labels each node with exactly that value before the cost. A reader who compares node values gets the right action after a bright spot, 262.7989 against 61.4402, with the wrong value. After no bright spot the same reader compares 18.2639 with 9.2361 and drills, which is the wrong action: the branch is -36.7361. Subtract every branch cost before taking a maximum.

## Exercise

At the posteriors 0.646739 and 0.097222, roll back Drill, Farm out and Walk away, subtracting the drill cost before taking the maximum. Name the best action after each reading, and show that comparing node values before the cost picks the wrong action after no bright spot.
