# The volumetrics workflow map

The mapping course ended with a five step workflow you could recite: assemble control, choose the frame and cell, interpolate, mask, present and read. This course has a workflow of the same shape, and it starts where that one stopped. This lesson lays it out end to end so that every later module has a known place in it.

There are eight steps. The first three build the geometry, the next four apply the properties, and the last one converts to barrels.

## Step 1: two gridded surfaces

The input is not a well file. It is two grids on one mask: TOP_SAND and BASE_SAND, both built by the mapping workflow from the same six Ekene picks, at a 100 m cell, with an 800 m extrapolation limit, and both live at the same 201 nodes.

Nothing in volumetrics improves those surfaces. Whatever they got wrong, this course inherits.

## Step 2: a contact

One depth, interpreted rather than measured, dividing oil above from water below. This course uses 1560 m on Ekene. The previous lesson covered what it is and how fragile it is.

## Step 3: clip and get the oil column at every node

This is where the geometry actually happens, and it is the whole of module 2. At each of the 201 live nodes the rule is

$$\text{column} = \min(\text{base},\ \text{contact}) - \text{top}$$

and a node whose result is zero or less holds no oil and contributes nothing. Module 2 works through why the rule takes the shallower of base and contact, which nodes survive it on Ekene, and what the largest surviving column is.

## Step 4: gross rock volume

Sum the columns over area. Each live node stands for a cell of 100 by 100 m, which is 10,000 square metres, so a column in metres multiplied by that area is a block of rock in cubic metres, and the sum of the blocks is the gross rock volume. On Ekene at the 1560 m contact it comes to 22.269036 million cubic metres.

Gross rock volume is rock. It includes shale, tight streaks and every pore filled with water. Nothing has been taken out of it yet.

## Step 5: net to gross

Not all of the gross interval is reservoir. Net to gross is the fraction that is, and at this tier it is handed to you as a constant of 0.8. Multiply and the 22.269036 becomes a net volume of 17.815229 million cubic metres.

## Step 6: porosity

Net rock is still rock. Porosity is the fraction of it that is void space, given here as 0.20. Multiply again and the pore volume is 3.563046 million cubic metres. This is the number petrophysics was working towards in a single well, now integrated over a field.

## Step 7: water saturation

Pore space is not all oil. Even in the oil leg, water clings to grain surfaces and occupies the finest pores. Water saturation is given as 0.35, so the oil fraction is 1 minus 0.35, and the hydrocarbon pore volume is 2.315980 million cubic metres.

## Step 8: formation volume factor and units

The 2.315980 million cubic metres is a volume at reservoir conditions, where the oil is hot and holds dissolved gas. Bring it to the surface and it shrinks as that gas comes out of solution. The formation volume factor accounts for the shrinkage, given here as 1.2 reservoir volumes per stock tank volume, so you divide by it. Then convert cubic metres to stock tank barrels at 6.2898 barrels per cubic metre.

The result is 12.139208 MMstb of STOIIP, and that is the end of the chain.

## The shape of the whole thing

| Step | Produces | Ekene at 1560 m |
| --- | --- | --- |
| 1 to 3 | Oil column at each node | module 2 |
| 4 | Gross rock volume | 22.269036 million m3 |
| 5 | Net volume | 17.815229 million m3 |
| 6 | Pore volume | 3.563046 million m3 |
| 7 | Hydrocarbon pore volume | 2.315980 million m3 |
| 8 | STOIIP | 12.139208 MMstb |

Two features of that table are worth noticing now.

Steps 5 through 8 are each a single multiplication by a constant. They shrink the number at every step, and they are entirely predictable. Change any one of them by a fraction and the answer changes by the same fraction.

Steps 1 through 4 are not like that at all. They involve two surfaces, a contact, a mask and a node by node test, and their output responds to its inputs in ways you cannot read off by inspection. That is why the geometry gets the most attention in this course, and it is why the Professional tier, which replaces the constants in steps 5 through 7 with property models, still spends most of its effort on the same geometry you are about to build.

Set the contact in the panel below and read the chain through to STOIIP before module 2 explains any of it.

{{panel:rc-volume-explorer}}

## Exercise

Write the eight steps in order from memory, and beside each one write what it needs as an input. Then answer two questions in one sentence each. Which steps could you carry out with a calculator and no map at all? At which step does the mapped crest of TOP_SAND first affect the answer?

Self check: the eight steps are two gridded surfaces, a contact, the clip to an oil column at each node, the sum to gross rock volume, net to gross, porosity, water saturation, and the formation volume factor with the unit conversion. Steps 5 through 8 need only the previous number and a constant, so all four could be done on a calculator by someone who had never seen the map. The mapped crest enters at step 3, because the column at a node is the contact minus the top at that node, so the shallowest mapped value sets the largest column in the field and then carries into the gross rock volume at step 4 and into everything after it.
