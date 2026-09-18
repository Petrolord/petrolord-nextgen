# What allowance reinstates the life

{{panel:fc-inhibitor-integrity-explorer}}

This is the inversion that catches people, and it catches them because the engine already returns a field that looks like the answer. Ask what allowance a line needs to meet its design life and the eye goes to `requiredAllowanceMm`. That field answers a different question.

## The field and the question

`requiredAllowanceMm` is the rate times the design life. It is the allowance a new line would need, with nothing consumed. It ignores what has already gone.

The question in the title is about a line that has been in service. Some of its allowance is spent, and a reinstating allowance has to cover both the loss still to come and the loss already taken. So the answer is larger than the field, always, whenever anything has been consumed at all.

## The worked case

Take the digest's own example. A stated rate of 0.250000 mm/yr, a 4 mm allowance, 1.2 mm gone and a 20 year design life. The engine returns `requiredAllowanceMm` at 5.000000 mm, a remaining allowance of 2.800000 mm and a shortfall of 2.200000 mm. Now bisect the total allowance until `meetsDesignLife` turns true and the answer is 6.200000 mm.

Put 5.000000 mm and 6.200000 mm beside each other. The gap between them is exactly the consumed depth, and the digest asserts that identity on every rebuild rather than quoting it. That is the whole lesson in one subtraction: the field measures a new line and the bisection measures this one. Note also that the shortfall of 2.200000 mm compares `requiredAllowanceMm` against what is left rather than against the allowance the line started with, so it is a third quantity again.

## Why bisect rather than add

You could reach the same number by adding the consumed depth to the required allowance, and on this case it works. Bisecting the engine's own verdict is still the better habit. The bisection asks the engine a question it answers directly and inherits every guard on the way. Adding two fields asks a question you composed out of two answers, and it carries whatever you assumed about how those fields relate.

The difference stops being academic at the edges of the door. An allowance already fully consumed is a refusal rather than a number:

> the corrosion allowance is already consumed: this is now an inspection and fitness-for-service question

A negative consumed depth is a refusal too. A design life left out gives a remaining life with `requiredAllowanceMm` null and a shortfall of 0.000000. A bisection on the verdict runs into each of those and reports them. An addition of two fields sails past.

## The reading to carry

Two fields with similar names answer two different questions, and the engine is not hiding it. It returns both, it returns the consumed depth and the remaining allowance beside them, and the arithmetic linking all four is exact. The work is in knowing which question you asked before you read a number off a screen as the answer to it.

## Exercise

Take the worked case and record `requiredAllowanceMm`, the remaining allowance and the shortfall. Then find the total allowance that reinstates the design life by bisecting the verdict. Subtract the two allowance figures and say what the difference equals and why it has to.
