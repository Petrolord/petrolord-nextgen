# Layers and their properties

Five layers, each with a thickness, a porosity and a permeability. The values are constant within a layer and change between layers, which is the layer-cake model, and it is the right model for this field because that is exactly how the waterflood course described it.

## The column

| layer | dz (ft) | permx (md) | permz (md) |
|---|---|---|---|
| 1 | 7.411104817049187 | 173.81198701129736 | 17.381198701129736 |
| 2 | 9.058016998615672 | 607.7507038307907 | 60.77507038307907 |
| 3 | 6.587648726265944 | 250 | 25 |
| 4 | 5.764192635482701 | 102.8382190362731 | 10.28382190362731 |
| 5 | 5.764192635482701 | 359.5839451276606 | 35.95839451276606 |

Porosity is 0.2 in every layer. Total thickness is

$$34.585155812896204 \text{ ft}$$

## Where these came from

The permeabilities are the Waterflood Management course's layer column: five values placed on an exact log-normal so that a Dykstra-Parsons fit recovers a permeability variation of exactly 0.5. Notice that layer 2 is the most permeable and layer 1, at the top, is only the fourth. That ordering is deliberate and it is a waterflood lesson: the fast layer is not the top layer.

The thicknesses are that same column's proportions, 18 to 22 to 16 to 14 to 14, rescaled so that the five sum to the mapped net pay of 34.585155812896204 ft rather than to the waterflood course's nominal 84 ft. The proportions carry over; the absolute scale comes from the geoscience booking.

The vertical permeability is one tenth of the horizontal in every layer, which is a design constant of this deck. Real fields have a kv/kh ratio somewhere between 0.01 and 1 and it is rarely measured directly.

## Net or gross

This is the convention that catches people, and this emitter forces you to be explicit about it.

There is no NTG keyword in this deck. So the porosity and the thicknesses have to carry the net-to-gross between them, and this deck's choice is that **the layer thicknesses are already net pay**. The 34.585155812896204 ft is net, and the porosity 0.2 is the porosity of net rock.

The alternative would be to use the gross thickness of about 43 ft with an NTG of 0.8 applied separately. Both give the same pore volume. They do NOT give the same answer for anything that depends on gross thickness, such as a vertical flow calculation across a layer, and they give different depths to every interface below layer 1.

A deck must state which convention it uses, and this one states it in a comment, because nothing about the numbers themselves reveals it.

## What layer-cake assumes

Each layer is continuous across the whole 30 by 30 area at constant properties. That is a strong assumption. It means no layer pinches out, no layer changes character laterally, and the permeability contrast between layer 2 and layer 4 is the same everywhere in the field.

The waterflood course's sweep calculations made exactly the same assumption, so the deck is consistent with the analysis it came from. Consistency is not correctness, and both inherit whatever the assumption costs.

## The misconception to avoid

"Porosity 0.2 everywhere means the model has no heterogeneity." It has vertical heterogeneity in permeability, by a factor of nearly six between the best and worst layers, and permeability is what controls flow. Uniform porosity means uniform STORAGE. A model can be perfectly uniform in what it holds and strongly heterogeneous in how it delivers it, and this one is.

## Exercise

First, confirm that the five layer thicknesses sum to 34.585155812896204 ft, and compute what fraction of the column layer 2 occupies.

Second, this deck carries net thickness at a porosity of 0.2. Compute the gross thickness and porosity that would give the same pore volume at a net-to-gross of 0.8, and state one calculation that would differ between the two conventions.
