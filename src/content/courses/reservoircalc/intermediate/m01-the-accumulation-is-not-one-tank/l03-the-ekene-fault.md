# The Ekene fault

The fault this tier works with runs north to south at an easting of 1800 m, cuts the full height of the reservoir, and seals. Those three statements are all it takes to partition the field, and the arrangement they produce is worth studying before any volume is computed, because the shape of the answer is already visible in the map.

## Where it falls

The mapped frame runs from an easting of 400 m to 2800 m in 25 columns of nodes spaced 100 m apart. A fault at 1800 m therefore sits fourteen columns in from the western edge, leaving fourteen columns of nodes to its west and eleven from the fault eastward.

That is a partition of the frame. The partition of the accumulation is different, because most of the frame holds no oil. Of the 500 nodes in the frame only 201 are live, and of those only 169 carry an oil column at the 1560 m contact. Where those 169 sit relative to the fault is what decides the split.

## The wells on each side

Six wells control the map, and the fault divides them evenly.

| Well | Easting | Northing | Block | TOP_SAND | At 1560 m |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | 1000 | 1000 | West | 1548 | oil |
| Ekene-3 | 1400 | 2300 | West | 1541 | oil |
| Ekene-5 | 600 | 1900 | West | 1552 | oil |
| Ekene-6 | 1900 | 1800 | East | 1546 | oil |
| Ekene-2 | 2200 | 1150 | East | 1565 | dry |
| Ekene-4 | 2600 | 2500 | East | 1590 | dry |

Three wells each. Read the last column and the symmetry collapses. All three western wells found their top above the contact. In the east, Ekene-2 tops out at 1565 m and Ekene-4 at 1590 m, both below the 1560 m contact, so both are dry at this contact. Only Ekene-6 found oil in the east, and it sits 100 m from the fault.

The east block has three wells and one discovery. That single sentence explains most of what the rest of this tier finds, and module four returns to it in detail.

## What the shape implies

The structure at Ekene shallows to the west and north. The crest of the mapped surface sits at 1539.72 m in the western half of the field, which means the tallest oil columns are all on the western side of a fault at 1800 m.

Two consequences follow before any calculation. The west block will hold most of the oil, and it will hold a disproportionate share of it, because it holds both more oil bearing area and a greater column over that area. The east block will be a thin rim of oil around a structure that mostly lies below the contact.

That is what the arithmetic gives: 117 oil bearing cells west against 52 east, and 9.855617 MMstb west against 2.283591 MMstb east. The cells split about seven to three and the barrels about eight to two.

## Reading the panel

Open the block explorer below. It is the volume explorer from the Associate tier with two things added: a fault, and a colour for the block each cell belongs to. Blue cells belong to the west block, amber to the east, and the shade of each cell is still its oil column, so a pale cell is a thin sliver of oil and a saturated one is a tall column.

Leave the fault at 1800 m and both contacts at 1560 m for now. That is the capstone configuration and the tiles under the map show its six graded numbers.

{{panel:rc-block-explorer}}

Three things are worth looking at before moving on.

Look at where the amber cells are. They form a band running north to south immediately east of the fault, with an outlier cluster around Ekene-6. There is no oil at all in the far east of the frame, which is why Ekene-2 and Ekene-4 came in dry.

Look at the shading. The saturated blue cells cluster in the western half; almost every amber cell is pale. That is the column difference the tiles report as a mean of 15.4529 m west against 8.0561 m east.

Look at the fault trace itself, drawn as a dashed red line. Notice that it passes exactly through a column of cell centres rather than between two columns. That is not a coincidence of the drawing, and the next module is largely about what it costs.

## Worked example

Take the two mean columns and check them against the volumes, which is the kind of arithmetic worth doing by hand once so the tiles stop being magic.

Each cell covers 100 m by 100 m, so 10,000 square metres. The west block has 117 oil cells at a mean column of 15.452865 m, giving a gross rock volume of

$$117 \times 10{,}000 \times 15.452865 = 18.079852 \times 10^6 \ \mathrm{m^3}$$

which is the west tile to six figures. The east block gives $52 \times 10{,}000 \times 8.056122 = 4.189183 \times 10^6$ cubic metres, again matching its tile.

The two add to 22.269035 million cubic metres, which is the field gross rock volume the Associate tier booked. The partition has not created or destroyed any rock.

## Exercise

Using only the well table above, predict which block holds more oil and say how confident you are. Then set the panel's fault to 1500 m and to 2100 m and note how the split changes.

Self check: the west should hold more, and the well table alone gives high confidence, because all three western wells found oil while two of the three eastern wells are dry at this contact. At a fault of 1500 m the split is 78 cells west against 91 east; at 2100 m it is 155 against 14. The oil is concentrated well west of the eastern edge of the field.
