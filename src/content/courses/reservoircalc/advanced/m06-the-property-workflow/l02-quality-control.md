# Quality control

The checks from the tiers below still apply, two of them need rewriting, and the property model adds four of its own.

## The four new checks

**The geometry is untouched.** Compare the oil bearing cell count, the gross rock volume and the net volume against the constant booking. All three must be identical, bit for bit. Any difference means something other than the property model changed.

**The ratios agree.** The pore volume, hydrocarbon pore volume and STOIIP must all change by the same factor. At Ekene that factor is 1.054111 in all three.

**The effective porosity is in range.** Divide pore by net. The result must lie within the range of the modelled property grid over the oil bearing cells, which at Ekene is 0.194649 to 0.227348. An effective porosity outside the grid's own range is arithmetically impossible and means a mismatched grid or frame.

**The residuals are inspected.** Model minus measured at every control point, with their size compared against the property's measurement uncertainty and their pattern examined for structure.

## The two checks that need rewriting

The Associate tier's check that the chain multiplies out has to change. It used to read: net times porosity gives pore volume. With a grid that only holds for the volume weighted porosity, so the check now runs backwards. Divide pore by net to obtain the effective porosity, then confirm it is the number being reported as the average.

The Associate tier's check that a property is physically plausible also has to change. Checking that a single porosity is between 0 and 1 was trivial. Checking a grid means checking its range, and specifically its extremes, since a trend extrapolates without limit. At Ekene the plane reaches 0.232281 somewhere in the frame, above every measured value, which is worth noticing even though it is small and lands on dead ground.

## What the checks cannot see

They cannot tell you the model is right. Every check above passes on a plane fitted in the wrong direction, on a kriged map built from an invented variogram, and on a model fitted to porosity values that were computed with the wrong matrix density.

They also cannot see the two properties left constant. Nothing in a porosity model's quality control will remind you that water saturation is still 0.35 everywhere, which is the larger modelling gap.

## The check worth doing every time

Compute the decomposition. Two extra bookings, at the handed out constant and at the arithmetic well mean, then subtract.

It costs two runs and it is the only check that tells you how much of your result depends on the model at all. At Ekene it says that 62 percent of the uplift would survive the property model being wholly discredited.

That is a different kind of check from the others. The rest verify that the arithmetic is sound. This one tells you how much the arithmetic matters.

## Reading it off the panel

Run the four new checks from the method control.

{{panel:rc-property-explorer}}

Switch between the three methods and confirm the geometry tiles hold at 169, 22.2690 and 17.8152. Then take pore over net for each method: 3.6818 over 17.8152 is 0.206667, 3.7558 over 17.8152 is 0.210822, and 3.9148 over 17.8152 is 0.219745. Compare each against the volume weighted mean tile, which reads the same three numbers.

That agreement is the effective porosity check, and it also demonstrates that the third mean tile is not an independent quantity but a restatement of the volumes.

## Worked example

Run the full set on the trend model and record each result.

Geometry: 169 cells, 22.269036 and 17.815229 million cubic metres, identical to the constant booking. Pass.

Ratios: pore 3.755847 over 3.563046 is 1.054111; HCPV 2.441300 over 2.315980 is 1.054111; STOIIP 12.796077 over 12.139208 is 1.054111. Pass.

Effective porosity: 3.755847 over 17.815229 is 0.210822, which lies inside the grid range of 0.194649 to 0.227348 and matches the volume weighted mean tile. Pass.

Residuals: six values from minus 0.019309 to plus 0.017348, summing to zero, alternating in sign, largest 1.2 times the next. Consistent with a fair fit of a modest model, and worth reporting rather than passing silently.

Decomposition: 0.404640 from the better constant and 0.252229 from spatial variation.

Five checks, all clean, on a model that still misses four of six wells by more than 8 percent. The checks and the model's quality are different questions.

## Exercise

A property model reports an effective porosity of 0.24 while its grid over the oil bearing cells ranges from 0.18 to 0.22. State what has gone wrong.

Self check: an effective porosity is a weighted average of the grid values over the booked cells, so it cannot lie outside the range of those values. A value of 0.24 means the pore volume and net volume come from different runs, the grid being summarised is not the grid that was booked, or the frames do not match.
