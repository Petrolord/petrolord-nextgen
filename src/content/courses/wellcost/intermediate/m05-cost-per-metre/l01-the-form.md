# The form

One fixed cost, one rate multiplied by a time, divided by a length.

{{panel:wc-afe-explorer}}

## The formula

`costPerMeter` is the classic drilling cost per unit depth, and it takes six inputs:

    usdPerM = (bitCostUsd + rigRateUsdPerHr * (drillingHr + connectionHr + tripHr)) / intervalM

Everything above the line is money. The bit is a fixed cost that the interval has to carry. The rig rate is a price per hour, and the three hour terms are the hours the section took. Below the line is the length the section made.

The engine requires `intervalM` to be strictly greater than zero and every other input to be zero or more. The strict guard on the interval is the division, and it is the reason you cannot report a cost per metre for a section that drilled nothing, however much it cost. A flat spot has a cost and no rate.

## The worked example

The course carries a published fixture that reproduces to the exact published value with an absolute error of zero.

| input | value |
|---|---|
| bit cost | 50,000 USD |
| rig rate | 6,000 USD/hr |
| drilling hours | 100 |
| connection hours | 4 |
| trip hours | 16 |
| interval | 1,000 m |

The rig is paid for 120 hours, and the answer is 770 USD/m.

## What that fixture is, and is not

It is a standalone worked example. It is not a section of the golden programme, and the digest flags it as such.

The giveaway is the 16 hour trip. No trip in the golden schedule takes 16 hours. The deepest one, the round trip at total depth, is 12 productive hours, and the trip at 2,000 m is 8. So the fixture describes a section of a well that is not the well the rest of this course is about.

Say what it is whenever you quote it. Somebody will otherwise carry 770 USD/m away as the production hole's rate, and the production hole does not have that rate.

## What the form tells you at a glance

The rig hours dominate. On the fixture the rig is 0.935064935064935 of the number and the bit is 0.06493506493506493 of it.

That ratio is the whole argument for the formula. It is a tool for asking whether a more expensive bit that drills faster or lasts longer is worth buying, and the answer is decided almost entirely by the hours it saves rather than by its own price.

## Exercise

Reproduce 770 USD/m from the six inputs by hand.

Then double the bit cost and note the change in the rate. Then cut the trip by four hours and note that change. Say which lever a bit salesman is actually selling.

Finally, write the one sentence you would put next to 770 USD/m in a report so that nobody mistakes it for a section of the golden well.
