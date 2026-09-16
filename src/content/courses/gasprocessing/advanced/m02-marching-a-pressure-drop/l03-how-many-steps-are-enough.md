# How many steps are enough

A step count is a choice, and like every choice in this module it is an input with a default rather than a hidden constant. The way to decide it is to measure the answer against itself at a step count nothing downstream would ever use.

{{panel:fc-coldend-explorer}}

## The reference march

The same routine, on the same let-down, marched at twenty thousand steps reports a cooling of 36.316559445 degF. It has no special authority beyond being far finer than anything a design pass would run, which is exactly what a reference needs to be. It is the engine checked against itself rather than against a second method.

| steps | cooling, degF | arrival, degF | cooling over the 20000-step answer |
| --- | --- | --- | --- |
| 1 | 36.271170079 | 59.728829921 | 0.998750174391 |
| 2 | 36.306809467 | 59.693190533 | 0.999731528034 |
| 5 | 36.315215540 | 59.684784460 | 0.999962994696 |
| 10 | 36.316244375 | 59.683755625 | 0.999991324329 |
| 20 | 36.316483434 | 59.683516566 | 0.999997906978 |
| 50 | 36.316547556 | 59.683452444 | 0.999999672610 |
| 200 | 36.316558711 | 59.683441289 | 0.999999979778 |

## Reading the last column

Each row's last entry is that row's cooling over the reference cooling. The column climbs towards one and it does so quickly, which is the second-order behaviour of the midpoint step showing itself on a real let-down rather than in an argument about orders.

Twenty steps is the module's default, and on this let-down it lands at 0.999997906978 of the reference. Two hundred steps lands at 0.999999979778. A reader who needs to justify the default has the two figures to justify it with.

## What the table is and is not

It is a convergence measurement. It says how close the module's own arithmetic is to the limit of its own arithmetic. It says nothing about whether the identity being marched is the right identity, or whether the compressibility correlation underneath it suits this gas. The published cases are where those are answered.

A table this clean invites the wrong conclusion. Converging beautifully to a wrong answer is a thing numerical methods do very well.

## Why a self-check is still worth running

A check against your own arithmetic is the weakest kind of check there is, and this course says so in as many words elsewhere. It is still worth having, because it answers a question no independent oracle answers. An oracle tells you whether two roads reach the same place. A convergence table tells you whether you have walked far enough down one of them to have arrived anywhere at all.

The two failures are genuinely different. A wrong identity marched to convergence is a precise wrong answer. A right identity marched at one step is an imprecise right answer. Only one of the two can be cured by turning a dial, and this table is how you find out which one you are holding.

## Choosing a count

For a screening pass the default sits far inside anything the inputs can support. Raise the count when the let-down is deep, because a deeper drop walks the coefficient further and a fixed step count then spans more change per step. Lower it only after measuring what lowering it costs on your own case, which this table shows you how to do.

## Exercise

Record the cooling, the arrival temperature and the ratio to the reference at one, five, twenty and two hundred steps, and record the reference cooling itself. Say which step count the module uses by default and what ratio it reaches. Then write one sentence naming a question this table cannot answer about the march.
