# What a caller may assume

A caller may assume that an argument a function accepts is an argument it reads. The assumption is reasonable, nearly always right, and enforced by nothing.

{{panel:pd-balance-explorer}}

## Nothing in the stack checks it

Not the language: destructuring an argument and never mentioning it again is legal and silent. Not a type declaration, because this package has none. Not the documentation, which lists `kin`, `structuralUnbalanceLb` and `crankOffsetDeg` in the design function's own input list. Not the committed cases, which do not pass those inputs, so no golden can disagree.

And not the oracle. Its gates hold the two independent routes to 2 percent on plunger stroke and 3 percent on the minimum load, and an ignored input produces a difference of exactly zero. No tolerance detects zero. A checker built on agreement cannot find a value that nothing disagreed about.

## The test costs one extra call

Run the function twice, change only the input in question, compare the returned numbers with strict equality. That is the whole method.

Choose the two values far enough apart to be seen. A structural unbalance of 600 lb and a crank offset of 10 deg move a balance's counterbalance moment by 11.077174 percent and its peak gearbox torque by 4.691080 percent, so they are not quiet values. Compare every output you mean to quote, not one: ten came back strictly equal here, count of differences 0.

## Where the test stops

It cannot tell you that an input is read in the right place. Pass a crank offset to `balanceUnit` and the counterbalance effect does move, from 13508.771698 lb at zero offset to 12740.372690 lb at 10 deg. An equality test passes there and reports nothing. The number is still wrong by 6.051664 percent, because the offset reached the balance and not the line inside it that reads the torque factor.

Change detected is not correctness. The second question is where the input should have shown up and by how much, and that is a physical question the test hands back to you.

## What to do with a failure

Do not conclude that the function is broken. Conclude something narrower and more useful: on this call, with these values, that input went nowhere. Then look one layer down, because `balanceUnit` forwards one of its two inputs to `counterbalanceEffect` and not the other, so a pass at one level is not a pass at the next.

## The habit

Every number you quote out of a design function should be traceable to an input you have watched move it. A sheet that lists a structural unbalance beside a torque percentage asserts a link, and here that link is made by hand: solve the card, balance it with those inputs, and quote the torque from the balance.

## Exercise

Name the five things that could have caught an unread argument and did not, with the reason for each.

Then describe the two-call test in three sentences, including how you would choose the values.
