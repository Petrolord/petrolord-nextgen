# The node mean over the oil

The second mean averages the model rather than the data, over the cells that hold oil. At Ekene it is 0.209368, and it is one of the six graded capstone values.

## The number

$$\bar{\phi}_{\text{nodes}} = \frac{1}{169} \sum_{j \in \text{oil}} \phi_j = 0.209368$$

It sits 0.002701 above the arithmetic well mean, which is 1.31 percent higher.

## What the step up measures

The step from the well mean to the node mean measures one thing only: that the cells holding oil are not a representative sample of the field's rock quality.

The plane predicts porosity falling eastward. The oil sits on the structural high, which at Ekene is in the west and centre. So the oil bearing subset of the field systematically excludes the eastern cells where the plane predicts the poorest rock.

The previous module measured the exclusion directly. Over the oil bearing cells the modelled porosity never falls below 0.194649, although a well measured 0.17 and the plane goes down to 0.181772 somewhere in the frame. The bottom of the distribution is simply absent from the population being averaged.

Cut off the low tail of any distribution and its mean rises. That is the whole mechanism, and the 1.31 percent is its size here.

## Why the graded value is this one and not another

The capstone asks for the node mean rather than the volume weighted mean, which is worth a word since the next lesson argues that the volume weighted mean is the one that belongs in a booking.

The node mean is asked for because it is a clean, checkable reading of the model over a defined population, and because it is the one a panel can display without ambiguity. The volume weighted mean is the one the booking uses, and it is recoverable from the pore and net volumes that the capstone also asks for.

Between them the two describe the model completely: one says what the model predicts over the oil, the other says what the volume actually experienced.

## The trap in this number

There is a specific and common error attached to the node mean, and it is worth naming.

The node mean is an average over cells, and cells are equal in area but not in rock. A cell carrying a 20 m column and a cell carrying a 2 m column count the same in this average and contribute ten to one in the booking.

So the node mean answers the question: what porosity does the model predict over the oil bearing area? It does not answer: what porosity did the booked volume actually use? Reporting the node mean and then multiplying it by the net volume gives the wrong pore volume.

At Ekene that error is worth

$$17.815229 \times (0.210822 - 0.209368) = 0.0259 \times 10^6 \ \mathrm{m^3}$$

of pore volume, which carries through to about 0.088 MMstb. Not large, and not zero, and it is the kind of error that never announces itself.

## Reading it off the panel

The second mean tile is this number, and the third is the volume weighted one.

{{panel:rc-property-explorer}}

With the method on trend they read 0.209368 and 0.210822. Compare them against the first tile at 0.206667 and note that the two steps are of similar size: 0.0027 then 0.0015.

Switch to krige and both move up together, to 0.217119 and 0.219745, with the same shape of gap and a wider one. The mechanism does not depend on the method; any model that predicts better rock where the oil is will show the same two steps.

## Worked example

Confirm the direction of the step with a subset calculation.

The plane over all 201 live nodes averages 0.206686. Over the 169 oil bearing nodes it averages 0.209368.

The difference must be carried by the 32 live nodes that hold no oil. Their mean porosity is

$$\frac{201 \times 0.206686 - 169 \times 0.209368}{32} = \frac{41.5439 - 35.3832}{32} = 0.19252$$

So the mapped ground that holds no oil averages 0.192526 while the oil bearing ground averages 0.209368. The dry ground is 8.7 percent poorer rock, which is exactly what the eastward trend and the eastward position of the dry ground together predict.

## Exercise

State what the node mean over the oil would be if the porosity model were the constant method, and explain what that tells you about the two steps described in this lesson.

Self check: it would be 0.206667, identical to the arithmetic well mean, because every node holds the same value and averaging any subset of them returns that value. It tells you that both steps are created entirely by the model's spatial variation: with no variation there is nothing for the choice of population or the weighting to bite on.
