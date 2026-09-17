# Geometry to duty to load to letter

{{panel:fc-fire-drum-explorer}}

Everything in the tier so far has been one link. This lesson runs the whole chain on one vessel, from four geometry figures to a letter stamped on a valve, and every step is an engine return rather than a restatement.

## What is stated

| input | value |
| --- | --- |
| orientation | horizontal |
| diameter | 12.000000 ft |
| length | 45.000000 ft |
| liquid level | 4.200000 ft |
| adequate drainage | true |
| environment factor | 1.000000 |
| latent heat | 128.000000 Btu/lb |
| set pressure | 275.000000 psig |
| overpressure | 21.000000 percent |
| temperature | 180.000000 degF |
| molecular weight | 21.000000 |
| compressibility z | 0.900000 |
| specific heat ratio k | 1.220000 |

Thirteen stated figures, which is the real content of a fire case: thirteen decisions, and then arithmetic. Four describe steel, two are credits, one is a property, and six describe the valve's pressures and the relieving gas.

## The chain

| step | value | route |
| --- | --- | --- |
| wetted area | 683.6960 ft2 | wettedAreaFt2, horizontal |
| pool fire duty | 4434115.2612 Btu/hr | fireHeatInput |
| relief load | 34641.5255 lb/hr | fireReliefLoad |
| relieving pressure | 347.450000 psia | derived from the set pressure, the overpressure and the atmospheric constant |
| required area | 1.578271 in2 | gasVaporArea, critical |
| orifice | K at 1.838000 in2 | selectOrifice |
| margin | 1.164566 | selectOrifice |

Six engine answers and one derived pressure, in an order that cannot be rearranged. The duty needs the area. The load needs the duty. The valve area needs the load and the relieving pressure together. The letter needs the valve area.

## The one derived pressure

Six of the seven rows name a route. The relieving pressure names none, because no route computes it: it is built from the set pressure, the overpressure fraction and the atmospheric constant, and the sizing route is handed the result. It is the one place in the chain where the number on the screen came from arithmetic outside an engine call.

It is also the row where a unit changes, from psig to psia, and a set pressure carried into the sizing route without that conversion is out by one atmosphere in a direction nothing downstream can see.

## Where each link goes wrong

The value of seeing the chain whole is that the failure modes are separate.

A wrong orientation or an untrimmed level makes the wetted area wrong, and everything after it inherits that in proportion to the exponent. A wrong drainage answer or environment factor leaves the geometry correct and moves the duty. A wrong latent heat leaves the duty correct and moves the load. A wrong overpressure leaves the load correct and moves the required area. A required area that is right lands on a letter that is right.

So walk the chain in order and stop at the first step that surprises you. The step above the surprise is where the input lives.

## The branch reported

The required area row says critical, so the flow chokes in the throat. The Associate tier took that branch apart and this tier does not repeat it. What matters here is that the branch is reported rather than assumed, so a reader can see which of the two gas expressions produced the area.

## What the margin is telling you

The margin is the ratio of the selected orifice area to the required area, and here it is 1.164566 on an orifice of 1.838000 in2 against a required 1.578271 in2. It is worth reading every time, because it says how much of the next standard size up you are buying.

A margin close to one means the case sits just inside its letter and a small increase in load pushes it to the next orifice. A large margin means the letter has room. Neither is a fault.

## Exercise

Write out all thirteen stated inputs and then the seven rows of the chain in order with the route beside each. Then say which single input each of the first five chain steps is most sensitive to, and state what the margin is the ratio of.
