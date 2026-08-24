# The workflow end to end

Five modules have each taken one part of a volume calculation apart. This lesson puts them back in working order, because the parts are not independent. Every step consumes what the step before it produced, and an error made early travels all the way to the booked barrels without ever announcing itself.

The order is: picks, surfaces, contact, columns, rock volume, properties, report.

## Step 1: the picks

The input to everything is six wells with two picks each. Ekene-1 through Ekene-6 carry a TOP_SAND and a BASE_SAND depth, giving sand thicknesses of 32, 36, 29, 25, 31 and 34 m.

Those picks are not produced here. The well data course got the LAS files in and QC'd them, and the correlation course put the tops on the section and made them consistent from well to well. A top picked ten metres low on the section is ten metres low in the map, ten metres low in every oil column that map produces, and nothing downstream of the correlation will ever find it. This step contributes nothing new to the volume and controls all of it.

## Step 2: the surfaces

Both sets of picks are gridded. The mapping course covered every decision in this step, and the settings here are the ones it used: a frame with two cells of padding around the control, a 100 m cell giving 25 columns by 20 rows and therefore 500 frame nodes, a thin plate spline through all six points, and an 800 m extrapolation limit that leaves 201 live nodes.

Two surfaces are built on the same frame, so they are node for node comparable. TOP_SAND runs from a mapped crest of 1539.72 m to a deepest value of 1590 m, and BASE_SAND from 1570 m to 1615 m. Both share one mask, which is why the both live count is also 201.

## Step 3: the contact

The contact is set. At the capstone it is 1560 m, and module five was entirely about how much rests on that one number.

## Step 4: the columns

Now the clip. At every live node the oil column is the shallower of the base surface and the contact, minus the top, keeping only the nodes where that difference is positive.

At 1560 m, 169 of the 201 mapped nodes qualify and 32 do not, because their tops are below the contact. The tallest column is 20.2818603515625 m, which is the contact minus the mapped crest. Two of the six wells, Ekene-2 and Ekene-4, sit on ground that does not qualify.

## Step 5: gross rock volume

Each qualifying node stands for a cell of 100 by 100 m, so 10,000 square metres of ground. Multiply each column by that area and sum over the 169 cells and the gross rock volume is 22.269036 million m3. The oil area is 1.69 square kilometres and the mean oil column is 13.176944 m.

## Step 6: the properties

The chain from rock to barrels is four multiplications, each by a constant at this tier.

$$22.269036 \times 0.8 = 17.815229$$
$$17.815229 \times 0.20 = 3.563046$$
$$3.563046 \times (1 - 0.35) = 2.315980$$
$$2.315980 / 1.2 \times 6.2898 = 12.139208$$

Net rock volume, then pore volume, then hydrocarbon pore volume in million m3, then STOIIP in MMstb after dividing by the formation volume factor and converting cubic metres to stock tank barrels at 6.2898 stb per m3. The petrophysics course is where NTG, porosity and water saturation come from in real work, and a fluid study is where Bo comes from.

## Step 7: the report

The last step is the one module five ended on. The booking is 12.139208 MMstb at an assumed contact of 1560 m, on a 100 m grid masked at 800 m, at the stated properties, with 3.835815 MMstb and 22.044451 MMstb at contacts of 1550 m and 1570 m. A volume without those attachments is not finished work.

## Where each course fits

Laid out this way, the geoscience path stops looking like five separate applications. The well data course made the logs trustworthy. The petrophysics course turned the logs into the properties that appear in step 6. The correlation course produced the tops in step 1. The mapping course produced the surfaces in step 2 and, just as importantly, taught you which parts of those surfaces are supported and which are the interpolator talking. This course supplies steps 3 through 7 and hands the result to whoever has to decide something with it.

Each course also inherits the previous one's weaknesses. The 800 m mask that the mapping course applied is the reason the volume claims 1.69 square kilometres rather than the whole frame, and the spline overshoot at the crest is the reason the maximum column is not a depth any well has seen.

That is the whole path. Six wells in, two surfaces, one contact, 169 cells, four multiplications, and a number a decision can rest on.

## Exercise

Write the seven steps from memory in order and put beside each the single Ekene number it produces. As a self check: the picks give 6 wells with 2 tops each; the surfaces give 500 frame nodes and 201 live at a 100 m cell; the contact is 1560 m; the clip gives 169 oil cells and a maximum column of 20.2818603515625 m; the rock volume is 22.269036 million m3; the properties give 17.815229 net, 3.563046 pore, 2.315980 HCPV and 12.139208 MMstb of STOIIP; and the report adds the 1550 m and 1570 m cases at 3.835815 and 22.044451 MMstb. Then answer in one sentence: which step adds no information to the volume and yet controls it completely? The picks, because everything downstream is arithmetic on them and no later step can detect a top that was picked wrong.
