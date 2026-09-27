# The promote in points

{{panel:farmout-earning-calculator}}

A farminee usually pays more of a well than the participating interest it earns. The difference is the promote, and it is the first figure people ask about when they read a farm-out. This course measures it in points, with one stated rule.

## The rule

The engine states the promote in the basis of every earning result:

> promote = the share of the gross cost the farminee pays minus the interest it holds after the event (points); promote ratio = share paid / interest held

Two things in that rule matter. The promote is measured in percentage points of the gross cost, so 40.000000 percent paid for 30.000000 percent held is a promote of 10.000000 points. And it is measured against the participating interest the farminee holds after the event, which for a single event is the participating interest it earns.

## Three wells, three promotes

| worked case | share paid | held after | promote points | promote ratio |
| --- | --- | --- | --- | --- |
| earn-ekene-single | 40.000000 | 30.000000 | 10.000000 | 1.333333 |
| earn-third-for-a-quarter | 33.333333 | 25.000000 | 8.333333 | 1.333333 |
| earn-heads-up | 30.000000 | 30.000000 | 0.000000 | 1.000000 |

The Ekene Deep well carries a promote of 10.000000 points. The case `earn-third-for-a-quarter` states a share of a third for a quarter: a promote of 8.333333 points. The heads-up deal pays exactly its own share, so its promote is 0.000000 points.

## A promote below zero is refused

A farminee paying less than the participating interest it earns would be carried by the farmor, which is a different trade. The engine refuses it by name:

> events[0].farmineePaysPct must be at or above 30, the interest the farminee holds after the event (a promote of 0 or more); got 25

The limit in the message is the participating interest held after the event, the same figure the promote is measured against.

## Why points

A promote in points reads straight onto money. Ten points on a well means the farminee pays ten per cent of the gross cost beyond its own share, and with no cap that extra is the carry: on a well of 40000000.000000 with 40.000000 paid for 30.000000 held, FIN pays 16000000.000000 and the carry is 4000000.000000. A later lesson of this module shows the carry inside the promote.

The promote on its own says nothing about value. Whether ten points is a lot depends on how likely the well is to succeed and what success is worth, and the Professional tier weighs that by EMV for each side.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "A third for a quarter", which states the share as one third (it prints as 33.333333; typing 33.333333 states another deal, on which EKO pays 8000000.040000). Read the promote points column and check it against the table above. Then use the "event 1: share the farminee pays, percent (stated)" control to change the share paid to 30, and run it: read the new promote in points. Finally set the share paid to 25, below the participating interest earned, and read the refusal and the limit it names.
