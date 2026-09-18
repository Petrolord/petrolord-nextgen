# The cut size as an inversion of the same law

A device that computes one quantity two different ways holds two opinions about it. This bed computes its removal one way, and gets its cut size by reading that same law backwards.

{{panel:pw-device-explorer}}

## The inversion

The penetration of a droplet through the bed is an exponential in the filter coefficient multiplied by the depth. The filter coefficient goes as the square of the droplet diameter. So there is exactly one droplet diameter for which the product of lambda and the depth is the log of two, and that droplet is the one the bed removes half of over its own depth.

That droplet is the cut size. Nothing new was assumed to get it. The module states the basis on every return, in its own words:

depth filtration, inverted: the filter coefficient is declared at a reference droplet, a reference grain and a reference loading, it goes as the square of the droplet diameter, and the cut size is the droplet the bed removes half of over its depth.

## Why one route matters

The removal the train reports for this device is the grade curve integrated over the droplet distribution, and that grade curve is the same exponential the cut size came out of. One law, read two ways, with no second parameter set anywhere.

A model with two routes to one quantity has to keep them agreeing, and the agreement is the thing nobody checks until it breaks. One route removes that whole class of problem, and it also means a reader who understands the exponential understands everything this device does.

There is a second benefit worth naming. Because the cut size is an inversion of the penetration law, an independent check can march the bed layer by layer, find the droplet whose marched removal is exactly one half, and compare. That is a different method reaching the same number, and it is only possible because the model kept one law.

## The depth sweep, and what it says

| depth m | lambda per m | removal at the reference droplet percent | cut micron | cut times the root of the depth |
| --- | --- | --- | --- | --- |
| 0.1 | 4.140060735138 | 33.900306 | 25.878516 | 8.183505 |
| 0.4 | 4.140060735138 | 80.910358 | 12.939258 | 8.183505 |
| 0.8 | 4.140060735138 | 96.355856 | 9.149437 | 8.183505 |
| 1.6 | 4.140060735138 | 99.867202 | 6.469629 | 8.183505 |
| 3 | 4.140060735138 | 99.999596 | 4.724749 | 8.183505 |
| 10 | 4.140060735138 | 100.000000 | 2.587852 | 8.183505 |

Two columns are doing the work here. The lambda column does not move, because depth is not one of the three things the filter coefficient depends on. The last column is derived, the cut multiplied by the square root of the depth on the same row, and it is constant.

A constant in that column says the cut goes as one over the root of the depth EXACTLY. Across this sweep the depth moves the cut by a factor of 10.000000.

## Reading a constant column

That last column is worth more than the statement it proves. A swept table with a derived column that holds still is a claim about the FORM of a relationship, testable by eye, and it cannot be produced by accident. Whenever a model asserts that something goes as a power of something else, ask for the column that holds still.

## Exercise

Confirm from the table that multiplying the cut by the square root of the depth gives the same figure on every row, and say what that tells you about the shape of the law.

Then explain why the lambda column does not move while the depth column does.
