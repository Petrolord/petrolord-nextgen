# The engine was always ready

Moving from a constant to a grid requires no new machinery, and understanding exactly why is the cleanest way into what the change does and does not do.

## What the engine does per node

The volume engine walks the nodes. At each live node with an oil column it computes a contribution and adds it to a running total. The contribution is

$$\text{bulk}_j = h_j \, A, \qquad \text{net}_j = \text{bulk}_j \cdot \mathrm{NTG}_j, \qquad \text{pore}_j = \text{net}_j \cdot \phi_j, \qquad \text{hcpv}_j = \text{pore}_j \cdot (1 - S_{w,j})$$

where $h_j$ is that node's oil column, $A$ is the cell area, and every property carries a node subscript.

The subscripts were always there. The two tiers below supplied grids in which every entry held the same value, so the sums collapsed:

$$\sum_j h_j A \cdot \mathrm{NTG} \cdot \phi \cdot (1 - S_w) = \left( \sum_j h_j A \right) \mathrm{NTG} \cdot \phi \cdot (1 - S_w)$$

and the chain became four multiplications applied to the total gross rock volume.

## What the collapse depended on

That factorisation is legal only because the properties were constants. Pull a constant out of a sum and the sum is unchanged. Pull a varying quantity out and you have changed the arithmetic.

With a porosity grid, the pore volume is a sum of products:

$$\text{pore} = \sum_j h_j A \cdot \mathrm{NTG} \cdot \phi_j$$

and this is not equal to the total net volume times any average of $\phi_j$ chosen without reference to $h_j$. It is equal to the total net volume times one very specific average: the one weighted by $h_j$.

That is the whole reason module three exists, and it is worth seeing it fall out of the algebra rather than being asserted.

## What this means practically

Three consequences follow immediately and all three will be measured later.

The geometry cannot change. The cell count, the gross rock volume and the net volume are computed before porosity enters the chain, so no porosity model can move them. All three are identical for a constant, a trend or a kriged grid.

The chain diverges at exactly one step. Everything above the pore volume is untouched; everything from the pore volume down scales.

The effect is expressible as a single equivalent constant. Since only one factor changed and it changed multiplicatively at each node, the total effect can always be reported as the constant porosity that would have given the same answer, which module four shows is 0.210822 here.

## A note on how the grids are stored

There is a small piece of machinery worth knowing about because it will produce a puzzling number later.

The chain fills its constant property grids as 32 bit floats. A 32 bit float cannot represent 0.20 exactly; the nearest value is 0.20000000298023224. So the Associate tier's booking used that value, not one fifth.

You can detect this from the published numbers. The Associate net volume is 17.81522878109259 million cubic metres. Multiply by exactly 0.2 and you get 3.5630457562185178. Multiply by the 32 bit value and you get 3.5630458093120372. The engine's pore volume is 3.563045809312045, which matches the second to fourteen digits and misses the first in the eighth.

Nothing about that is a defect and nothing about it matters to a booking. It is worth knowing because a difference of that size will appear again in module three, where two ways of computing the same average disagree, and it saves you from hunting for a modelling explanation of a storage artefact.

## Worked example

Confirm the factorisation numerically on the Associate booking.

The field holds 169 oil bearing cells with a mean column of 13.176944 m and a cell area of 10,000 square metres, so gross rock volume is $169 \times 10{,}000 \times 13.176944 = 22.269035$ million cubic metres.

Because the properties are constants, the chain collapses: multiply by 0.8, then 0.20, then 0.65, then divide by 1.2 and convert at 6.2898 stb per cubic metre, giving 12.139208 MMstb.

Now do it the long way for a single node and confirm that node contributions are what is being summed. A node with a 20 m column contributes $20 \times 10{,}000 = 200{,}000$ cubic metres of bulk, $160{,}000$ of net, $32{,}000$ of pore and $20{,}800$ of hydrocarbon pore volume, which is $109{,}000$ stock tank barrels. Sum 169 such contributions with their own columns and you have the field.

The second route is the one the engine actually takes. The first is what it reduces to when nothing varies.

## Exercise

State which of the following can be changed by a porosity model, and which cannot: oil bearing cell count, gross rock volume, net volume, pore volume, hydrocarbon pore volume, STOIIP.

Self check: the cell count, gross rock volume and net volume cannot change, because porosity enters the chain only after the net volume is formed. Pore volume, hydrocarbon pore volume and STOIIP all change, and all three change by exactly the same ratio, since the two steps below the pore volume are multiplications by constants.
