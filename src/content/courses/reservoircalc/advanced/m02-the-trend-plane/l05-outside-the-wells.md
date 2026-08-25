# Outside the wells

A plane does not stop at the edge of the data. This lesson looks at what the model does where nothing was measured, which is most of the field.

## Three ranges

The measured porosities run from 0.17 to 0.23.

Over the whole 500 node frame the plane runs from 0.181772 to 0.232281.

Over the 201 live nodes it runs from 0.186013 to 0.227348.

Over the 169 oil bearing nodes, which are the only ones that reach the booking, it runs from 0.194649 to 0.227348.

## The overshoot

The frame maximum, 0.232281, is above the highest value ever measured. The plane extrapolates past its own data, which any unbounded model will do.

Here the overshoot is small, 0.001 above the maximum well value, because the frame does not extend far beyond the wells. A plane extrapolated further keeps going: two kilometres further west the same gradient would predict a porosity of 0.27, and ten kilometres further west it would predict 0.43, which is not a porosity any sandstone has.

That is the standing hazard with a trend. It has no mechanism to flatten off, so its predictions degrade without limit and without warning. Distance from control is the only thing that bounds the error, and the model does not track it.

The mask limits the damage here. Nodes more than 800 m from a well are dead, so the plane is never evaluated far outside the data in a way that reaches the booking. That is the mapping tier's extrapolation limit doing a second job it was not designed for.

## The value that never appears

Look at the third range again. Over the oil bearing cells the model never uses a porosity below 0.194649, although a well measured 0.17.

The reason is structural rather than statistical. The 0.17 was measured at Ekene-4, at an easting of 2600 m, which is far to the east on the flank, and every cell out there has its top below the contact and holds no oil. The worst rock in the field sits in the part of the field that holds no oil.

That has a specific consequence for the booking. The property model's effect on the volume is decided entirely by the porosity over the 169 oil cells, and that subset excludes the low end of the data. It is one of the two reasons the effective porosity comes out above the well average, and module four takes up the other.

It also means Ekene-4 influences the booking without its value ever being used. It pulls the plane down in the east, which changes the coefficients, which changes the porosity everywhere including over the oil. A well can matter to a volume through the fit while contributing no cell to it.

## A note on the live node mean

The plain average of the plane over the 201 live nodes is 0.206686, which is within 0.00002 of the arithmetic well mean of 0.206667.

That near coincidence is not a coincidence. The plane passes through the centroid of the wells, and the live area is roughly centred on the wells, so averaging a plane over a region centred on its own pivot returns close to the pivot value.

It is worth noticing because it is a trap. Somebody could report that the trend model gives the same average porosity as the wells, conclude that the model changes nothing, and be wrong, because the booking does not average the plane over the live area. It averages it over the oil, weighted by rock.

## Reading it off the panel

Set the method to trend and compare the map against the well posts.

{{panel:rc-property-explorer}}

The shading covers only the 169 oil bearing cells, so the map you see is exactly the subset that reaches the booking. Notice that Ekene-4 and Ekene-2, the two lowest porosity wells, sit on blank ground: they are dry at this contact and no cell around them is coloured.

The colour scale runs from the lowest to the highest modelled porosity over the coloured cells, which is 0.194649 to 0.227348, not the well range. The map cannot show you a value the booking never uses.

## Worked example

Quantify how much the exclusion of the low porosity area is worth.

If the booking averaged the plane over all 201 live nodes rather than over the 169 oil cells, the effective porosity would be about 0.206686 rather than 0.210822. The STOIIP would then be

$$12.139208 \times \frac{0.206686}{0.20} = 12.545 \ \mathrm{MMstb}$$

against the actual 12.796077.

So of the 0.656868 MMstb the property model adds, about 0.25 MMstb comes from the fact that the oil sits on the better rock, and the rest comes from the well average being above 0.20 in the first place. Module four makes that split precisely; the point here is that the geometry of which cells hold oil is part of the property model's answer.

## Exercise

A trend model is fitted to wells spanning 3 km and then evaluated over a frame spanning 12 km. State the two things you would check before using the result, and what the extrapolation limit on the structural grid does about the problem.

Self check: check the range of modelled values against the range of measured values to see how far the extrapolation has pushed beyond the data, and check whether the extreme values are physically possible for the rock type. The structural extrapolation limit helps only indirectly: it kills nodes far from well control, so the far field values never reach a volume, but it is a distance rule on the structural grid rather than a constraint on the property model.
