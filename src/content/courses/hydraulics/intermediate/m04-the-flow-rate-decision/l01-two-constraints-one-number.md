# Two constraints, one number

The trade, in one chart.

{{panel:hy-cleaning-explorer}}

## The two

**Cleaning wants more flow.** The transport ratio rises and the cuttings concentration falls with every extra litre per second.

**The formation wants less.** The equivalent circulating density rises with every extra litre per second too.

There is one flow rate, and it has to satisfy both.

## The shapes

The transport ratio rises steeply at low rates and flattens: on the slant well with kcl_polymer it goes 0.7384068092371119 at 0.015 m3/s, 0.8284815558593573 at 0.025 and 0.8712896713371077 at 0.035.

The equivalent circulating density rises with an exponent of about 0.75 on the annulus loss: 1483.5443226994705, then 1498.3349880149756, then 1521.9582775037711 kg/m3.

So the cleaning benefit has diminishing returns and the pressure cost has slightly accelerating ones. There is a rate beyond which you are paying more and getting less.

## The third constraint

The pump. At 0.035 m3/s this well needs 20875441.5255568 Pa, which is over 200 bar, and at 0.050 it needs nearly 400 bar.

On many rigs the pump is the binding constraint long before the formation is, and on this well with this string it certainly is.

## When there is a window

Most of the time. On a well with a comfortable fracture gradient and a rig with a decent pump, the flow rate is chosen well inside both limits and the decision is easy.

## When there is not

Narrow-margin wells: deep water, depleted reservoirs, long laterals. There the fracture gradient and the pore pressure are close together and the equivalent circulating density has almost nowhere to go.

Those are the wells that need managed pressure drilling, and the Expert tier is about them.

## The order of operations

**First** find the flow rate the cleaning needs.

**Then** check the equivalent circulating density it produces against the fracture gradient.

**Then** check the pump pressure it needs against the pump.

If any check fails, something else has to change: the hole size, the mud, the string, or the plan.

## Exercise

Open the panel's minimum-flow view for the horizontal well with the light mud and set a target transport ratio of 0.8.

Read the flow rate, the pump pressure and the equivalent circulating density it produces, and say which of the three constraints you would worry about first.
