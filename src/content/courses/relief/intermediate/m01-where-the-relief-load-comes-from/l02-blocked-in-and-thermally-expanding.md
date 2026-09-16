# Blocked in, and thermally expanding

{{panel:fc-fire-drum-explorer}}

Two of the commonest relieving cases on a plant are a blocked-in outlet and thermal expansion in a liquid-filled line. Neither has a route in this module. Both are sized here every day. This lesson is about how that works and where it goes wrong.

## A load is an input, so a scenario is a decision

The gas, liquid and steam routes each want a flow rate, a set pressure, an overpressure allowance and a fluid description. The flow rate is the relief load, and the module has no opinion about where it came from. A blocked-in vessel on a compressor discharge relieves at the machine's own rated capacity at the relieving conditions. A liquid line warmed by the sun relieves a volumetric rate that follows from the coefficient of expansion, the heat rate and the liquid's compressibility. Those are two different calculations, in two different sets of units, and this engine performs neither.

What it does is accept the answer. That is the correct division of labour, and it puts the whole weight of the result on one typed number.

## Why the fire case is the exception

The fire case is computed because everything it needs is geometry plus two stated answers. A vessel has a diameter, a length, an orientation and a liquid level, and those four facts fix a wetted area exactly. The pool fire duty follows from the wetted area, one published constant and one published exponent. The relief load follows from the duty and a latent heat. Nothing in that chain asks what the process was doing.

A blocked-in case asks what the process was doing. So does thermal expansion. That is the whole reason one is computed and the others are typed.

## The three qualities a typed load has to carry

| quality | what it means here |
| --- | --- |
| a rate | pounds an hour for gas and steam, gpm for liquid |
| at relieving conditions | the pressure and temperature the valve actually sees |
| for one named scenario | the case the number was worked out for |

The third row is the one that gets lost. A load written down without the scenario beside it looks exactly like any other load, and the studio will size against it cheerfully. Six months later nobody can say whether the figure was a blocked-in rate, a fire rate or a control valve rate, and the only way to find out is to do the work again.

## The habit

Record the scenario name beside every load before you type it. Then, when the fire case comes along and produces its own load from geometry, you have two numbers you can compare, and comparing them is the actual engineering decision this tier exists to support. The governing case is the largest load the valve has to pass, and the engine will never tell you which one that is.

One further trap is worth naming. A fire load and a blocked-in load stay distinct even when they happen to be close, because they arrive at different relieving pressures. The fire case is customarily allowed a larger overpressure, and the same pounds an hour figure at a higher relieving pressure needs a smaller area. Two loads that look alike on paper can land on different orifices for that reason alone.

## Exercise

Name two relieving scenarios this module does not compute, and say what a caller must produce before either can be sized. Then list the three qualities a typed load has to carry, and say which of the three is the one most often lost.
