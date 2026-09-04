# What a percentage actually buys

A contingency percentage is a decision that looks like a calculation.

{{panel:wc-afe-explorer}}

## What the number does

Mechanically, everything. The fraction is linear on the base, so it is fully determined once the base is known.

| fraction | contingency USD | total USD |
|---|---|---|
| 0.05 | 269,000 | 5,649,000 |
| 0.10 | 538,000 | 5,918,000 |
| 0.20 | 1,076,000 | 6,456,000 |
| 0.30 | 1,614,000 | 6,994,000 |

There is no judgement anywhere in that table. Give the engine a fraction and it gives you a total.

## What the number does not do

It does not say how likely the total is to be enough.

The golden AFE totals 5,918,000 USD at a fraction of 0.1. That is a single figure with no probability attached to it. It might be a number the well beats nine times in ten, or one it beats one time in three. The estimate as constructed cannot tell you which, because nothing in it describes how wrong the inputs might be.

Ask anyone why the fraction is 0.1 and the honest answers are precedent, the last well, or a corporate standard. None of those is a statement about this well.

## What would answer the question

A distribution needs inputs that are ranges rather than single numbers, and the golden case document already carries them, unused by anything in this tier.

| uncertain input | low | most likely | high |
|---|---|---|---|
| intermediate hole rate of penetration, m/hr | 10 | 15 | 22 |
| production hole rate of penetration, m/hr | 6 | 10 | 14 |
| rig dayrate, USD/day | 85,000 | 100,000 | 130,000 |
| completion services, USD | 350,000 | 500,000 | 800,000 |

Those four, drawn 2000 times against a fixed seed, produce a distribution of totals rather than a total. Only then does the question have an answer: which percentile of that distribution does 5,918,000 USD reach.

Notice that three of the four enter the cost linearly, through a rate or a lump, and the two rates of penetration do not, because time goes as one over the rate of penetration. That asymmetry is why the answer is not simply the value at the most likely inputs, and it is the reason the question needs a run rather than a sum.

## Where this course answers it

Not here. The Expert tier builds the distribution and reads the percentile off it. What this tier can say is exactly what is missing, which is more useful than a fraction chosen from precedent and defended as if it were a calculation.

## Exercise

Write down the fraction your organisation uses, and the reason. If the reason is precedent, say so.

Then, using the panel, raise the fraction from 0.1 to 0.2 and note that the total moves to 6,456,000 USD. Say what evidence you would need before defending either of those two fractions over the other.

Finally, list which of the four uncertain inputs above would move the total most if it went to its high value, and say why you cannot be certain of your answer from a single run.
