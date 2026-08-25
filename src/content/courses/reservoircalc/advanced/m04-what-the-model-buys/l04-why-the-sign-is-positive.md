# Why the sign is positive

The property model added barrels. It did not have to, and the reason it did is a fact about the field rather than about the method. This lesson establishes the mechanism and the number.

## The prediction that was made two tiers ago

The Associate tier, having explained that a constant is a simplification, made a prediction in words. Structural highs often carry the cleaner, better sorted rock, so porosity tends to be higher where the oil column is tallest. When a property correlates positively with column height, the cells that carry the most volume also carry the best rock, and the volume weighted average comes out above the plain average of the wells.

This tier can put a number on that prediction.

## The correlation

Across the 169 oil bearing cells, the correlation between the modelled porosity and the oil column is

$$r = +0.462$$

Positive and moderate. Not the near perfect relationship that would follow if porosity were purely a function of structural height, and not the zero that would follow if the two were unrelated.

## Where the correlation comes from

There is nothing mysterious about it and it is worth tracing, because the mechanism is partly geological and partly geometric.

The plane says porosity improves westward. The structure says the crest is in the west and centre, so the oil column is tallest in the west. Two quantities that both vary systematically along the same map direction are correlated by construction.

That is important to state plainly: the correlation is not independent evidence for the geological story. It is a consequence of two trends pointing the same way, one fitted to six porosity values and one fitted to six depth picks. If the porosity trend had come out pointing north instead, the correlation would have been near zero and the weighting effect would have vanished, without any change to the porosity data itself.

## The size of the effect

Module three gave the identity. The gap between the volume weighted mean and the plain node mean is the covariance of column and porosity divided by the mean column:

$$\phi_{\text{eff}} - \bar{\phi}_{\text{nodes}} = \frac{\mathrm{cov}(h, \phi)}{\bar{h}} = \frac{0.019168}{13.176944} = 0.001455$$

which through the chain is the 0.088293 MMstb the weighting contributes.

Notice how small that is relative to the fuss. A moderate positive correlation between porosity and column, across a field with a 20 m range of columns, is worth 0.7 percent on the effective porosity.

## When the sign reverses

The mechanism makes the reversal conditions clear.

If the best rock lies downdip, the covariance is negative and the property model removes barrels relative to the node mean. That is the situation in carbonate build ups where crestal facies are tightly cemented, and in fields where the crest has been exposed and diagenetically altered.

If the property trend is perpendicular to the structural trend, the covariance is near zero and the weighting effect disappears whatever the strength of either trend individually.

So a reader who has learned that property models increase volumes has generalised from a common case. What property models do is replace an unweighted assumption with a weighted one, and the direction of the change is set by the field.

## Reading it off the panel

The map and the three mean tiles show the mechanism together.

{{panel:rc-property-explorer}}

Under trend, the shading is lightest in the east. Compare that with the block explorer map from the tier below, where the tallest columns were in the west. The two maps grade in the same direction, which is the correlation made visible.

Then read the three means in order: 0.206667, 0.209368, 0.210822. Both steps up, because both the selection and the weighting run the same way in this field.

## Worked example

Construct the reversed case to see that nothing about the method forces a positive sign.

Keep the Ekene columns and flip the porosity trend, so that porosity improves eastward instead: give Ekene-1 0.20, Ekene-2 0.22, Ekene-3 0.19, Ekene-4 0.23, Ekene-5 0.19 and Ekene-6 0.21. The arithmetic mean is unchanged at 0.206667.

Now the poorest rock sits where the oil is thickest and the best rock sits under the eastern flank, most of which holds no oil. The selection step would run downward, since the oil bearing cells would sample the poorer western rock, and the weighting step would run downward too, since the thick cells carry lower porosity.

The booking would come out below 12.543848 MMstb, so the property model would remove barrels relative to the well average, from a data set with exactly the same six values and the same mean.

## Exercise

State the two conditions under which a property model leaves the booking unchanged relative to booking at the arithmetic well mean, and say whether either holds at Ekene.

Self check: the booking is unchanged if the oil bearing cells sample the modelled property with the same average as the whole mapped area, and if the property is uncorrelated with the oil column. Neither holds at Ekene: the oil cells average 0.209368 against 0.206686 over all live nodes, and the correlation with column is +0.462.
