# When renewal is expected

{{panel:prms-reserves-calculator}}

A licence expiry cuts the forecast only when no renewal is expected. If the company can show that the right to operate will continue, the standard lets the barrels after the expiry count, and the engine runs the whole forecast. Whether a renewal is expected is a stated fact, true or false, with no default. The engine decides nothing about it; it prints what you state beside the figures it moves.

## The renewal on EKN-1

Two golden inputs differ only in the renewal expectation:

| golden input | renewal expected (stated) | high case licence cut | high economic limit | high oil beyond the licence | 3P BOE |
| --- | --- | --- | --- | --- | --- |
| econ-ekene | false | 2040 | 2040 | 601257.000000 | 16851271.080000 |
| econ-ekene-renewal-expected | true | none | 2041 | 0.000000 | 17256718.756667 |

With a renewal expected, the high case runs to 2041, its economic limit moves to 2041, and nothing is beyond the licence. The 3P on the net-entitlement basis rises from 16851271.080000 to 17256718.756667 BOE.

## What moves and what stays

On EKN-1 the best case reaches its economic limit in 2037, before the expiry, so a renewal changes the 3P and leaves the 2P where it is: 11229764.729167 BOE either way. The low case stops paying in 2033 and is also untouched. The renewal matters only for a case that would still be paying after the expiry.

That is a useful test for any project. If the best case stops paying before the licence ends, the 2P does not depend on the renewal, and a reader can see that at once from the reasons. If it is still paying at the expiry, the 2P rests on the renewal, and the report has to say so and show the evidence behind it.

## What a renewal expectation needs

The standard asks for a reasonable expectation of renewal, and the SEC asks for evidence that renewal is reasonably certain (17 CFR 210.4-10(a)(22)). The two tests differ in strength, and neither is something the engine can check. A report that states a renewal as expected names the evidence: a renewal right in the licence, a regulator's record, a pending application. The course states no Nigerian rule on renewal, because no gazetted rule on booking reserves was found when the sources were read on 2026-09-27.

## Stated, every time

The renewal expectation has no default. Left out, it is refused, verbatim:

> licence.renewalExpected must be true or false (stated; no default); got nothing

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 with a renewal expected". Read the licence cut, the economic limit and the oil beyond the licence of each case, and the 3P BOE.
2. Set "Renewal expected (stated)" to false and read the same figures. Write down which case changed.
3. Set "Licence expiry year (stated)" to 2033 with no renewal expected, and read the 2P BOE. Then set "Renewal expected (stated)" to true and read it again.
4. Set "Renewal expected (stated)" to not stated and read the refusal.
