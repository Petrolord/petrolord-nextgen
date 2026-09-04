# What the sizing optimises

The pick is the largest inside diameter whose ratio still clears one. Largest, not safest, and the difference is the whole character of the answer.

{{panel:pd-profile-explorer}}

## The objective, stated plainly

`sizeTubingForRate` walks the candidate list largest diameter first, 3.958, 3.826, 3.740, 3.548, 3.476, 3.068, 2.441, 2.041, 1.610, and `largestUnloaded` is the first row that clears. On EBOCHA-5 at the controlling station under Coleman that is 3.476 in at a ratio of 1.0022156322.

The next candidate down, 3.068 in, reads 1.2865006128 at the same station. The function saw it, scored it and rejected it for being smaller than something that also worked.

## The margin the objective produces

A constraint satisfied at the largest feasible size is a constraint satisfied at the edge, by construction. 1.0022156322 is not a design margin somebody chose. It is what is left over when you take the biggest string that fits.

| Candidate, in | Coleman ratio | Turner ratio |
| --- | --- | --- |
| 3.548 | 0.9619521855 | 0.8016268212 |
| 3.476 | 1.0022156322 | 0.8351796935 |
| 3.068 | 1.2865006128 | 1.0720838440 |

The workover this recommends takes EBOCHA-5 from 3.548 in reading 0.9619521855 to 3.476 in reading 1.0022156322. That is a real change in verdict and a very small change in condition.

## Why largest is a defensible objective, and why it is unpriced here

A larger string means less friction and more deliverability, so an engineer prefers the biggest tubing that will still unload. That preference is correct and these modules cannot support it, because there is no pressure drop calculation anywhere in them and no inflow performance either. The sizing therefore pays nothing for going smaller. It optimises against a hard constraint with no cost on the other side, so its answer is always the boundary.

## The mistake

Reading 1.0022156322 as headroom. It is the absence of headroom, and it is stated to ten digits by a function that had no opinion about how much you wanted. The well is also assumed to keep making 3100.0 Mscf/d through the new string, which nothing here checks and which a real velocity string would not leave alone.

The recovery is to read the neighbours. 3.068 in at 1.2865006128 is what buying margin costs in diameter, and that is a decision a person makes, not the function. The same is true in the other direction: 3.548 in at 0.9619521855 is what doing nothing costs.

## What it refuses

The sizing has no objective except the largest clearing diameter. It will not weight candidates by cost, by availability, by workover risk or by how much of the string is loading. It reports every candidate so a person can apply those, and it applies none of them itself.

## Exercise

Write the ratio of the Coleman pick and the ratio of the candidate immediately below it.

Then say what a report would have to add to 1.0022156322 before an engineer could call it a safe answer.
