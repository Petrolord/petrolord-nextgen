# The volume weighted mean

The third mean is the one the booking actually used. At Ekene it is 0.210822, and unlike the other two it was never computed as an average at all.

## Two routes to it

The engine forms the pore volume as a sum of products, one per cell. Divide that by the net volume and you recover the porosity that a single constant would have had to be to give the same answer:

$$\phi_{\text{eff}} = \frac{\text{pore}}{\text{net}} = \frac{3.755847}{17.815229} = 0.210822$$

The second route computes it directly as an average weighted by oil column, since every cell has the same area and the same net to gross:

$$\phi_{\text{eff}} = \frac{\sum_j h_j \phi_j}{\sum_j h_j} = 0.210822$$

The two agree to 0.21082226429530276 against 0.21082226429530274, a difference in the seventeenth digit. They are the same quantity computed two ways, and seeing that they agree is worth the check, because it confirms that the effective porosity is exactly a column weighted average and not something more complicated.

## Why the weight is the column

The weight is whatever the porosity is being multiplied by. In this chain each cell's porosity multiplies that cell's net rock, which is cell area times net to gross times oil column. Area and net to gross are the same everywhere, so they cancel out of the weighting and the column is all that is left.

That cancellation is specific to this model. If net to gross also varied by node, the weight would be the product of column and net to gross, and the correct porosity average would be net rock weighted rather than column weighted.

The general rule is worth stating in its general form: the average of a property that belongs in a calculation is the one weighted by whatever that property multiplies. Nothing else is a shortcut for it.

## The step from the node mean

The node mean over the oil is 0.209368 and the volume weighted mean is 0.210822, a rise of 0.001455 or 0.69 percent.

That step measures the correlation between porosity and column. The volume weighted mean exceeds the plain node mean exactly when the cells with more rock carry higher porosity, and by an amount that grows with the strength of the correlation and with the spread of the columns.

At Ekene the correlation between the modelled porosity and the oil column across the 169 cells is +0.462, which is moderate. The columns range from a sliver to 20.28 m, which is a wide spread. Together they give the 0.69 percent.

## The general identity

There is a compact way to see it. For any two quantities the weighted mean can be written as the plain mean plus a covariance term:

$$\frac{\sum h_j \phi_j}{\sum h_j} = \bar{\phi} + \frac{\mathrm{cov}(h, \phi)}{\bar{h}}$$

where the bars are plain averages over the cells. So the gap between the node mean and the volume weighted mean is the covariance of column and porosity divided by the mean column.

At Ekene the mean column is 13.176944 m and the covariance of column and porosity over the 169 cells is 0.019168, so the gap is $0.019168 / 13.176944 = 0.001455$, which is the step measured above. Positive covariance, positive gap. If porosity were uncorrelated with column the two means would coincide, and if the best rock lay in the thinnest cells the volume weighted mean would fall below the node mean.

That identity is the whole content of the third mean, and it makes the sign predictable from geology rather than from arithmetic.

## Reading it off the panel

The third mean tile is this number.

{{panel:rc-property-explorer}}

Check the first route yourself: divide the pore volume tile by the net volume tile, 3.7558 by 17.8152, and you get 0.210822. That division is available on any report that quotes both volumes, which makes the effective porosity recoverable from somebody else's work even when they never state it.

That is a useful audit trick. If a report gives net and pore volumes and separately claims an average porosity, divide the first two and compare. A mismatch means the quoted average is not the one the booking used.

## Worked example

Recover the effective porosity from the Associate tier's booking and confirm the machinery on a case where you know the answer.

The Associate tier reported a net volume of 17.815229 and a pore volume of 3.563046 million cubic metres. Dividing gives 0.20000000298, which is the 32 bit representation of 0.20 rather than 0.20 exactly.

So the audit trick works and it is sensitive enough to reveal how the constant was stored. It also confirms that for a constant model the effective porosity is the constant, with no weighting effect at all, since there is nothing for the weights to bite on.

## Exercise

A field books a net volume of 40 million cubic metres and a pore volume of 9.2 million, and the report states an average porosity of 0.21. State whether the report is internally consistent and what the discrepancy would mean.

Self check: the effective porosity is $9.2 / 40 = 0.23$, not 0.21, so the report is not internally consistent. The quoted 0.21 is most likely a plain average of the well values or of the property grid, while the booking used a volume weighted average of 0.23, which implies the oil sits on rock better than the field average. The volumes are the numbers to trust, since they are what the chain actually computed.
