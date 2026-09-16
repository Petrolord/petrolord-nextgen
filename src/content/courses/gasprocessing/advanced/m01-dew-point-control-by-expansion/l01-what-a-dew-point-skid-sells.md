# What a dew point skid sells

The Gas Processing Studio runs three units over one gas stream. Dehydration takes water out with glycol, sweetening takes acid gas out with amine, and the dew point unit cools the gas by letting it down. This module is the third one, and it is the one the rest of the platform reaches into.

{{panel:fc-coldend-explorer}}

## The unit, in one sentence

A dew point skid takes a gas at line pressure, drops it across a valve into a lower pressure, and catches whatever falls out of the colder gas in a separator underneath. There is no refrigerant and no external duty. The cooling is paid for out of the pressure the stream already had.

## The teaching stream, end to end

AGBADA arrives at 1180.000000 psia and 96.000000 degF with a gas gravity of 0.680000 and a molar heat capacity of 9.800000 Btu per lbmol per degF. Let down to 640.000000 psia the gas arrives at 59.683516566 degF, having cooled 36.316483434 degF on the way.

The point of the cooling is the water it drops out. At its inlet the gas carries 33.801656743 lb of water per MMscf. At 59.683516566 degF and 640.000000 psia it can hold 18.762820770 lb per MMscf. The difference is 15.038835973 lb per MMscf, and that is what appears as liquid in the separator boot.

Those six figures are the whole product. Everything else here is how they were formed or what they cannot tell you.

## What the skid sells

It sells a cold spot with a known temperature, and a quantity of free water arriving at that cold spot. Both are answers a downstream question takes as its input.

## What it does not sell

It does not sell a hydrate margin. Nothing in this engine computes a hydrate boundary, and the Production module Flow Assurance engine is where that question lives. It does not sell an outlet composition either, because there is no compositional flash anywhere in this module. It does not sell a stage count or an approach to equilibrium, because it models no absorber at all.

Read the arrival temperature and the free water as the two inputs a phase question takes, and this unit hands you exactly what the next engine wants.

## Why the tier starts here

The tier starts from the plant rather than from the algebra, because the thing that makes this module worth an Expert tier is that the number this unit forms is the one another engine asks its caller to type in by hand.

## Exercise

Record the inlet pressure, the inlet temperature, the outlet pressure and the arrival temperature for AGBADA, and then the cooling across the let-down. Record the water the gas carries at the inlet and the water it can still hold at the cold separator. Then say what the difference between those two water contents is, and which of the six figures a Flow Assurance hydrate question would actually consume.
