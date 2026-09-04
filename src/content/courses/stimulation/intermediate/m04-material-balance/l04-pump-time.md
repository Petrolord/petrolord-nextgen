# Pump time

How long you have to pump to place the geometry you designed, once the rock is allowed to drink.

{{panel:st-frac-explorer}}

## The equation being solved

Everything injected is either in the fracture or in the rock.

    qi ti = Vf + KL CL (2 Af) sqrt(ti)

The unknown appears twice, once linearly and once under a square root, so it is a quadratic in the square root of time. The engine solves it in that form and takes the positive root.

The published case gives 3945.2291680655526 s, a little over an hour of pumping at 0.053 m3/s.

## Against the no loss case

If nothing leaked off you would only need to inject the fracture volume, and the pump time would be 36.143836842230584 m3 divided by 0.053 m3/s, which is the 681.9591857024639 s the engine returns when the coefficient is zero.

So leakoff has multiplied the job by 5.7851397133124625. More than four fifths of the pumping is paying for fluid that will never be in the fracture at all.

## How badly it can go

| CL, m/sqrt(s) | pump time, s | pad fraction |
|---|---|---|
| 0 | 681.9591857024639 | 0 |
| 0.000025 | 1077.9646113131057 | 0.22501282514741658 |
| 0.00005 | 1722.8759409518486 | 0.4328432929610202 |
| 0.0001 | 3945.2291680655526 | 0.7052381992848291 |
| 0.0002 | 12524.08880432433 | 0.8967201715127071 |
| 0.0004 | 46688.88701504819 | 0.9712076418135991 |

The last row is more than half a day of continuous pumping to place a fracture volume of 36 cubic metres, with 97 per cent of it as pad.

That is not a treatment. It is a design that has failed and is telling you so through the clock.

## What a long pump time is telling you

Read it as a design signal, not a schedule. Four responses are available, and only one of them is pumping longer.

Lower the leakoff coefficient with a better fluid or a fluid loss additive, which moves you up the table. Shorten the target half-length, which cuts both the volume and the leaking area. Raise the rate, which shortens the time nearly in proportion. Or accept a smaller fracture.

Note what raising the rate does not do. It shortens the job almost linearly but widens the fracture only at the quarter power, which is the trade the previous module measured.

## Exercise

Set the coefficient to 0.0002 and read the pad volume and proppant mass the schedule returns. Ask whether the location can store that pad.

Then find the half-length at which the published job fits inside a two hour pumping window.
