# Which one the method takes

The published motor sizing rule and this package pick opposite ends of the rounding margin. Knowing that is a professional obligation, because the disagreement was recorded and deliberately left standing.

{{panel:pd-power-explorer}}

## The published rule takes the larger one

PetroWiki, ESP system selection and performance calculations, sizes the motor on total stages times brake power per stage times specific gravity. That product is the power at the head the stack MAKES. On the published gassyOffshore design, 192 stages at 0.6549201841 hp per stage, the rule lands on 125.74467535 hp and not on the 125.69771587 hp that the design records as its shaft horsepower.

Everything electrical in this package is built on the smaller number. The load fraction, the motor current, the voltage drop and the cable pick all start from the power at the head REQUIRED.

## The direction of the error has a name

Building on the smaller power understates the duty, and that is the non conservative direction: the motor sits closer to its plate than the published rule intends, the amps come out lower, and the drop and the cable pick inherit both.

| Case | Chain is built on, hp | Published rule takes, hp | Understatement, hp | Percent |
| --- | --- | --- | --- | --- |
| Published gassyOffshore | 125.69771587 | 125.74467535 | 0.04695948 | 0.037345 |
| Published highWaterCut | 172.55965200 | 172.74929676 | 0.18964476 | 0.109780 |
| Teaching well QUA-IBOE-4 | 95.41621294 | 95.97003263 | 0.55381969 | 0.577076 |
| Teaching well IBENO-2 | 29.77428389 | 30.53878580 | 0.76450191 | 2.503380 |

## Recorded, not fixed, and that is a decision

The finding was examined and left alone. Not because it is harmless: because every number in this engine is consumed by a live application, so a numeric edit moves a value somebody is looking at today. Changing which power feeds the amps would move the amps, the drop, the cable size and every saved design built on them.

So this is an open owner decision, not a settled convention. A convention can be quoted. An open decision has to be stated as one, with the side the code sits on and the size of the disagreement.

## What it refuses

The engine refuses to arbitrate. Both powers are returned, neither is marked as the sizing power, and no warning is raised when they differ. The published gassyOffshore design raises 0 warnings while carrying a 0.04695948 hp disagreement, and the teaching well IBENO-2 raises 0 while carrying 0.76450191 hp.

It does not hide the ingredients: stages before and after rounding, head required, head made and brake power per stage are all in the result, so the second power can be rebuilt by hand.

## The mistake

Quoting a motor size from the published method and then reading the amps out of this package, without noticing that the two started from different horsepowers. The two answers will agree to three figures on a 192 stage design and disagree by 2.503380 percent on a 33 stage one.

## Exercise

For the published highWaterCut design, read the shaft horsepower and the stack brake power in the panel and state which one the published sizing rule would use.

Then say, in one sentence, which direction the package's choice moves the motor current.
