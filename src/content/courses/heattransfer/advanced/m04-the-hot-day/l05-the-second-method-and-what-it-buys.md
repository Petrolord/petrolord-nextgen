# The second method, and what it buys

The hot day was rated by effectiveness and NTU. There is another classical route to the same answer and it is genuinely independent: solve the duty out of the surface equation itself, at the same fixed UA, using whatever log mean the new outlet and the new air rise produce. If both methods are right they have to agree.

{{panel:fc-rating-explorer}}

## The check, on every row of the sweep

| check ambient, degF | rated duty, Btu an hour | UA times the hot-day log mean | the two as a ratio |
| --- | --- | --- | --- |
| 86.000000 | 21161290.3226 | 21161290.3226 | 1.000000 |
| 92.000000 | 20387096.7742 | 20387096.7742 | 1.000000 |
| 98.000000 | 19612903.2258 | 19612903.2258 | 1.000000 |
| 104.000000 | 18838709.6774 | 18838709.6774 | 1.000000 |
| 112.000000 | 17806451.6129 | 17806451.6129 | 1.000000 |
| 124.000000 | 16258064.5161 | 16258064.5161 | 1.000000 |

Every ratio is one to the precision printed here, and the same holds on all six rows of ANTAN, whose rated duties run from 16857664.2336 Btu an hour at 86.000000 degF down to 12558394.1606 at 124.000000 degF and meet the same product on every row. The log mean in the middle column is the hot-day log mean, formed at the rated outlet and the rated air rise rather than at the design ones. That is what holding UA fixed means.

## Why this is a check and not a restatement

A rated answer has to satisfy the equation it came from. The effectiveness route never evaluates that equation: it takes UA, forms NTU and the capacity ratio, holds the effectiveness and multiplies by the inlet temperature difference. The surface route never evaluates the effectiveness relation. Two independent paths landing on one number is a thing that could have failed, and a check that could not have failed is not a check.

The oracle behind this module's published rows takes the second path in earnest. It bisects on the duty until the surface equation balances and it never touches the effectiveness relation at all, which is what makes its figures worth printing beside the engine's.

## What the published rows show

A golden figure is not the engine answering. This module's published file is written by the oracle, so a golden column standing beside an engine column is two methods meeting rather than one method restated.

At an ambient of 110.000000 degF the engine gives a duty fraction of 0.903226 against a golden 0.903226, a process outlet of 159.677419 degF against a golden 159.677419, an air rise of 27.096774 degF against a golden 27.096774, and a UA of 234565.8720 against a golden 234565.8720.

The duty column is the one to look at closely: 18064516.1290 Btu an hour from the engine against 18064516.1306 from the oracle. The oracle reached its figure by bisecting until the surface equation balanced, so the digits that differ are the digits its bisection stopped at.

## The lesson of the whole course, stated once

A rating that holds a duty and an outlet temperature its own duty cannot produce satisfies neither method. Checking against a second method is what turns an answer into a result. And an independent method has to be independent: restating an expression in other units and converting back is a multiply followed by a divide, while marching a differential equation or bisecting a different equation entirely is a second method.

## Exercise

Record the six rows above with the ratio each one produces. Record the four published figures at an ambient of 110.000000 degF beside their golden values, and the two duty figures separately. Then say which outlet and which air rise the hot-day log mean is formed at, and why taking it at the design values instead would turn this check into a restatement.
