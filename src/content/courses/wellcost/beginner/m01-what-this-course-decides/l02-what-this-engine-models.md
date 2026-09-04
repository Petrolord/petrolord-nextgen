# What this engine models

Seven outputs, all deterministic, all built on an ordered list of activities.

## Durations from three closed forms

The engine turns a programme into hours. Three of its four activity kinds have a formula: drilling is interval divided by rate, tripping is twice the depth divided by trip speed, and running casing is depth divided by run speed plus a flat term. The fourth kind, flat, is simply the duration you type.

No iteration, no solver, no time stepping. Each activity is one line of arithmetic, evaluated once.

## A productive and non-productive split

Every productive duration is multiplied by one plus a non-productive time fraction. On the golden programme that fraction is 12.5 percent, which turns 384 productive hours into 432 elapsed hours and adds 48 hours of allowance.

## A rolled-up programme

The activities are then accumulated in order. You get a start hour and an end hour for each activity, a running drilled depth, a time-depth curve, and totals: 432 hours, 18 days, 3,000 m drilled, 3,000 m total depth.

## An AFE with a tangible and intangible split

Cost items are priced against those totals and sorted into two categories. On the golden case that gives 1,050,000 dollars tangible and 4,330,000 dollars intangible, a base of 5,380,000 dollars, a contingency of 538,000 dollars at a 10 percent fraction, and a total of 5,918,000 dollars.

## A cost-time curve

The base cost is accrued along the schedule, so you can read money against elapsed hours. Its final point lands on 5,380,000 dollars, exactly the AFE base, with an absolute error of zero.

## A cost per metre

A separate classical formula prices one bit run over one interval. The example shipped with the engine returns 770 dollars per metre from a 1,000 m interval, 100 drilling hours, 4 connection hours, 16 trip hours, a 50,000 dollar bit and a 6,000 dollar per hour rig rate.

Treat that as a standalone worked example. Its 16 hour trip matches no trip in the golden programme, so 770 dollars per metre is not the production hole's own number and must never be quoted as if it were.

## A risked run

Finally, the deterministic evaluator can be called repeatedly with sampled inputs to produce a risked result. The sampling lives outside the engine on purpose, which is what keeps every published percentile reproducible.

## Exercise

List the seven outputs above and mark which ones need only hours, which need only metres, and which need both.

Then say which output you would show first to a drilling superintendent, and which to a finance manager.
