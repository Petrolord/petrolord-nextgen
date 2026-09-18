# Infeasible and inefficient are different

Three states look similar on a screen and are not the same thing at all. A configuration can be working poorly, or working on a part of the curve where its answer is fragile, or unable to deliver the duty at any area whatever. This engine separates the three, and it uses a different kind of return for each.

## One duty at four shell counts

At a P of 0.920000 and an R of 1.400000 the engine refuses at every count up to four, and it refuses with two different messages.

At one shell pass the message is the general one: F is undefined at P = 0.92 and R = 1.4 with 1 shell pass: the configuration cannot reach this duty. Add a shell pass.

At two, at three and at four shell passes the message changes: this duty is unreachable with 2 shell passes: the equivalent single-shell P works out at NaN. The same sentence comes back for three and for four, with the count in it.

{{panel:fc-coefficient-explorer}}

## Why the second message is the more useful one

The first refusal names a remedy, and adding a shell pass is the right remedy on many duties. The second refusal is the engine saying that the remedy has been tried and the conversion itself has nowhere to land. That is the difference between a configuration that is inefficient and one that is infeasible.

A designer reading the second message knows the shell count is no longer the variable to move. What is left is the duty, the four terminal temperatures, or a different kind of exchanger. No amount of shell adding reaches this one, and the engine says so at each count rather than once.

The wording of that message is worth a moment as well. It reports that the equivalent single-shell P works out at a value that is not a number, which is an honest description of what happened inside the conversion. The alternative would have been to hand back some number anyway, and a number produced from a conversion that did not resolve is the worst possible answer: it looks exactly like a result, it carries no warning, and it will be quoted.

## Three answers, and which is which

| what the engine does | what it means |
| --- | --- |
| answers | the configuration reaches the duty |
| answers with a warning | it reaches it on a steep part of the curve |
| refuses | it does not reach the duty at this count |

The middle row is the one people misread. A warning is an answer and the factor beside it is correct. The bottom row is not an answer at all, and there is no number in it to salvage.

Behind all three sits the same principle, and it is the reason this module refuses as often as it does. A default answer is worse than a refusal, because a default answers a question the caller did not ask and never admits that it did. A refusal costs the caller a minute. A default can cost them the exchanger.

## Exercise

Record the P and R of the unreachable duty in this lesson and the shell counts the engine was asked at. Write down which counts return the general message and which return the conversion message. Then say in one sentence what separates a warned answer from a refusal.
