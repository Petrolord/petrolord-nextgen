# Turndown, and what a bank is sized in

A basin is sized in square metres. A liner bank is sized in LINERS, and that one difference is what makes this module the most interesting device in the course.

{{panel:pw-device-explorer}}

## What turndown is

Every liner in this module is rated at a design flow of 0.0006 m3/s, declared as `designFlowPerLinerM3S`, at which it develops a field of 1000 g, declared as `gFieldAtDesign`. TURNDOWN is the ratio of the flow a liner is actually carrying to that design flow.

Split 75000 bwpd across 200 liners and each one carries 0.000690049023 m3/s, which is a turndown of 1.150082. The same flow across more liners gives each one less, and across fewer gives each one more.

So turndown is not a property of the water or of the liner. It is the single number that says how hard the bank is being run, and every other quantity in this module follows from it. The residence time follows from it, and so does the field, so a liner count reaches every term in the answer at once.

## Why the field follows the flow

A liner develops its field by spinning the water, and the water is spun by being pushed through a tangential inlet slot. Push more through the same slot and it enters faster. The centrifugal field goes as the square of the tangential velocity, and the tangential velocity goes with the flow, so the field goes as the SQUARE of the turndown.

That is a strong dependence and it is the reason a designer is tempted to buy fewer liners. Halve the bank and each remaining liner sees twice the flow, which looks like four times the field.

## The four numbers that bound it

The module declares an operating envelope around that arithmetic, and all four of its edges live in the frozen constants:

| declared constant | value | what it sets |
| --- | --- | --- |
| designFlowPerLinerM3S | 0.0006 | the flow one liner is rated at |
| gFieldAtDesign | 1000 | the field one liner develops at that flow |
| starvedTurndown | 0.5 | the bottom of the liner operating envelope |
| overloadTurndown | 1.3 | the top of it, past which the field stops rising |
| maxTurndown | 2 | past which the module refuses to answer at all |

Inside the envelope the square law runs. At the top of it something else takes over, and past twice design the module stops answering. The next three lessons take those three regions one at a time.

Every one of those five numbers is DECLARED. None of them is measured in this repository, and the module keeps them in one frozen object so that moving one is a reviewed act. A reader with a vendor curve for a particular liner has every right to disagree with them, and the point of declaring them is that the disagreement can be stated precisely.

## Exercise

Work out the turndown of a bank of 230 liners on the KOKORI flow, using the per liner flow this module reports, and say which region of the envelope it sits in.

Then state in one sentence why turndown, rather than bank flow, is the quantity this device is described by.
