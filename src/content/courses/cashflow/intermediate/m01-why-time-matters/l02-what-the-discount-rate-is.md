# What the discount rate is

The discount rate is the return the money would earn elsewhere, stated once, and every row is judged against it.

{{panel:ec-time-explorer}}

## An input, not a result

The engine takes discount_rate_pct as a configuration value. AKATA carries 10. Nothing in the production, the prices or the fiscal terms produces that number; it is the owner's statement of what a year's delay costs, or equally what the same capital could earn in its next best use. A project whose NPV at the stated rate is positive earns more than that alternative; a project whose NPV is negative earns less, even when its undiscounted total is comfortably positive.

The engine states the rate as nominal. On a nominal basis it is applied as printed, 10.000000 percent. On a real basis the engine converts it to the applied real rate, 6.796117 percent on AKATA, and discounts the real flows instead. Both routes take the 2033 nominal flow of 44874457.77 to the same discounted value of 30649858.46: at 10 percent on the nominal flow, or at 6.796117 percent on the real flow of 39870374.51.

## What changing it does

The NPV profile is the same ledger re-read at several rates. On AKATA's real flows:

| rate, percent | NPV |
| --- | --- |
| 0 | 117362408.71 |
| 5 | 83023565.60 |
| 8 | 65968275.69 |
| 10 | 55805775.02 |
| 12 | 46487466.07 |
| 15 | 33900281.71 |
| 20 | 16026160.80 |

At 0 percent the NPV is the plain total of the real column, 117362408.71. Every step up in the rate removes value, and the removals shrink as the rate rises, because the late years that a high rate punishes have already been reduced to little. AKATA is still positive at 20 percent, at 16026160.80, which is why its IRR, the rate at which this curve would cross zero, sits beyond anything in the table at 29.2361 percent.

## The mistake

The profile row labelled 10 percent reads 55805775.02, and AKATA's discount rate is 10, so a careful reader reports 55805775.02 as the NPV. The headline NPV is 72534830.66. The profile is evaluated on the real flows, where 10 percent is not the configured rate but a much harsher one; the configured 10 percent nominal is 6.796117 percent real, and the headline sits at that rate. A profile point labelled with your discount rate is your NPV only when the basis is nominal.

A second mistake runs the other way: treating the rate as something the project reveals. It does not. The IRR is the property the project reveals; the discount rate is the yardstick you bring.

## What the rate refuses

It refuses to be more than one number. Every year of AKATA is discounted at the same rate, so a risk that grows with time, or a financing cost that changes after payback, cannot be expressed here. It refuses to carry inflation on its own: with inflation and every escalator set to zero the NPV is 65055328.97 on either basis at 10.000000 percent, and it is the price and cost escalators, not the inflation rate, that lift the configured answer to 72534830.66. And it refuses to tell you whether 10 is right. That answer lives with the owner's cost of capital, not in the ledger.

## Exercise

Read the NPV at 5 percent and at 15 percent and say which step of the profile removed more value. Then state the rate at which the headline 72534830.66 was evaluated, and why it is not 10.
