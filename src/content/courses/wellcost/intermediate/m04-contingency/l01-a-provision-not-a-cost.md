# A provision, not a cost

The second largest number an AFE reviewer can be shown is money against work nobody has scheduled.

{{panel:wc-afe-explorer}}

## What the engine actually does

`afeCosts` takes a list of items, the total days, the metres drilled and one number called `contingencyFrac`. It prices every item on its own basis, sums the tangible items and the intangible items, and calls that sum the base.

Then it does one more line of arithmetic:

    contingencyUsd = contingencyFrac * baseUsd
    totalUsd       = baseUsd + contingencyUsd

That is all contingency is inside the model. It is not an item. It has no basis, no category and no activity to attach to. You cannot give it a rate, and no line in the programme consumes it.

## Why the modelling matters

Every other number on the estimate is a price for something somebody intends to do. The rig dayrate buys rig days. The mud line buys metres. The wellhead is a wellhead.

The contingency buys nothing. It is a statement about the estimate itself, that the other numbers may be too low, expressed in the same units as the numbers it doubts.

On the golden well the base comes to 5,380,000 USD, the fraction is 0.1, so the provision is 538,000 USD and the total is 5,918,000 USD. Nobody will invoice that 538,000. If the well goes to plan it is never spent, and it was still the right thing to put on the form.

## The fraction is not the share

A fraction f applied to the base is f/(1+f) of the total, because the base grew by the same amount you are taking a share of. The golden's 0.1 is 0.09090909090909091 of the total.

| fraction on the base | share of the total |
|---|---|
| 0.05 | 0.047619047619047616 |
| 0.10 | 0.09090909090909091 |
| 0.25 | 0.2 |
| 0.50 | 0.3333333333333333 |

That is the same stretch arithmetic the tier below used for the non-productive time allowance, and it catches people the same way. If somebody says the estimate carries ten percent contingency and you read that off the total, you are reading a smaller provision than the one that was made.

## Exercise

Set the contingency fraction to zero in the panel and note the total. Then set it to 0.1 and confirm the total moved by exactly one tenth of the base and by nothing else.

Write down, in one sentence each, what the rig dayrate line buys and what the contingency line buys.

Then say what the contingency would have to be attached to for the engine to price it as an item, and why nobody can supply that.
