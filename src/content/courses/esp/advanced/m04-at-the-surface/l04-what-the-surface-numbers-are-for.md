# What the surface numbers are for

Four fields come back from one call, and they answer four separate questions. They do not answer a fifth one that everybody tries to ask of them.

{{panel:pd-power-explorer}}

## One field, one purpose

`dropPct` is the number a cable is selected on, against a default limit of 5 percent. `surfaceVolts` is what the switchboard has to present. `kva` is what the switchboard and the transformer are bought in. `lossKw` is heat in the conductor. Each is complete on its own, and each is used by a different person.

## They do not close

`kva` is built on `surfaceVolts`, which already contains the cable drop. `kw` is `kva` multiplied by the power factor. `lossKw` is computed separately from the same current and the same resistance. No combination of the returned fields is motor input power, and there is no energy balance a reader can check.

Nothing here is arithmetically wrong. The fields are each correct for what they name. What is missing is a closure, and a reader who assumes one is present will build a number the engine never claimed.

That is why the honest way to report the cable is as a percentage: 4.72992077 kW is 3.864668 percent of the 122.38878485 kW real power on golden electrical case 1, and 13.66665016 kW is 15.573059 percent of 87.75828739 kW on case 2. A percentage is a comparison of two returned fields. A subtraction would be a claim about where the power went.

## The number that is not in the object

Motor input power needs a motor efficiency, and no efficiency curve exists anywhere in this module. On golden design gassyOffshore, 125.69771587 hp of shaft at a stated 0.85 motor efficiency is 110.273867 kW of motor input. That figure comes from a separate assumption about the motor, held outside the electrical call, and none of `kva`, `kw` or `lossKw` equals it or can be made to.

## Three things not to do

Do not subtract `lossKw` from `kw` and call the difference motor input power. Do not add it and call the sum what a surface meter reads. Do not bill energy off `kw`, because the power factor in it is one assumed constant and the motor efficiency is absent entirely.

## What they are for, said plainly

Sizing surface equipment and choosing a conductor. Consumption is a different calculation, built on a motor efficiency the caller states out loud, and the honest report says so rather than implying a balance that the four fields cannot support.

## Exercise

For golden electrical case 2 write down all four surface fields, then write one sentence for each naming who uses it and for what.

Then attempt a power balance from those four fields alone, and record precisely which quantity you are missing and where it would have to come from.
