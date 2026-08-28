# A column is not one permeability

Every calculation in the previous two tiers treated the Ekene sand as one thing. It is not. A sand deposited over geological time is a stack of layers with different grain sizes, different sorting, and permeabilities that can differ by an order of magnitude between beds a few feet apart. This module is about what that does to a flood, and it does a great deal.

## Why an average permeability is not enough

Consider two columns, both 84 feet thick, both with an arithmetic average permeability of 250 md.

The first is uniform: 84 feet of 250 md rock. Water enters it as a front and advances at one velocity everywhere.

The second is five layers with permeabilities from 100 to 600 md. Water enters all of them and advances fastest in the most permeable, because for the same pressure gradient the velocity is proportional to permeability. By the time the front in the fastest layer has reached the producer, the front in the slowest has covered a fraction of the distance.

The two columns have the same average permeability and completely different flood behaviour. The first sweeps everything before any water is produced. The second starts producing water while most of its oil is still behind un-arrived fronts.

That is vertical sweep, and averaging destroys it.

## What "swept" means here

At the moment a layer's front reaches the producer, that layer is fully swept along its length and every other layer is partially swept. The vertical sweep, or coverage, is the thickness-weighted fraction of the column that has been contacted:

$$E_V = \frac{\sum_j h_j x_j}{\sum_j h_j}$$

where $x_j$ is the fractional distance the front in layer $j$ has travelled, equal to 1 for layers that have broken through.

Coverage rises in steps as each successive layer breaks through, reaching 1 only when the slowest layer finally arrives, by which time the producer has been making water for a long time.

## Why this is not just a correction factor

The temptation is to treat vertical sweep as a multiplier applied at the end: compute the flood as if the reservoir were uniform, then multiply by 0.6 or whatever. That is roughly what the forecast engine does, and it labels the move as a screening simplification in its warnings.

The reason it is a simplification is that the layers do not just reduce the recovery, they change the SHAPE of the production. A uniform reservoir produces dry oil until breakthrough and then a rapidly rising water cut. A layered reservoir produces water early, from its fast layer, while continuing to produce oil from the slow ones, so the water cut rises earlier and more gradually and the tail is much longer.

Two floods with the same ultimate recovery and different water cut histories have very different economics, because the water handling cost arrives at a different time.

## The two classical methods

Both date from around 1950 and both are still in use, because both are transparent and neither needs a simulator.

**Dykstra-Parsons** (1950) tracks the frontal position in each layer using a mobility-dependent velocity, so the mobility ratio enters the geometry directly.

**Stiles** (1949) assumes fronts advance in proportion to permeability alone, which is the unit-mobility-ratio limit, and computes the producing water cut from the capacity that has broken through.

They agree when the mobility ratio is one and diverge as it departs from one. Module 2 works both.

## What both assume

Three things, and all three are surfaced by the engine as warnings rather than buried:

**Piston displacement.** Inside a layer, water displaces oil as a sharp front leaving residual oil behind, with no transition zone. That is the same idealisation the SCAL course examines, and it is worse here because it is applied per layer.

**No crossflow.** Layers do not communicate vertically. Real sands have shale breaks that are laterally discontinuous, and where they are absent, water crossflows from the fast layer into the slow one, which actually IMPROVES the sweep relative to the no-crossflow prediction.

**Equal porosity and saturation change per layer.** The pore volume per foot and the movable oil per foot are the same in every layer, so thickness alone weights the coverage.

None of those is true. All three are stated, which is what makes the method usable: you know which direction each error pushes.

## The misconception to avoid

"A layered model is more realistic than a uniform one, so its answer is more accurate." It is more realistic in one dimension and just as idealised in others. A no-crossflow layered model is pessimistic about sweep where crossflow occurs, and a piston-displacement model is optimistic about displacement within each layer. The value of the layered model is not accuracy; it is that it gives you a number for a mechanism the uniform model cannot represent at all.

## Exercise

First, take two layers of equal thickness with permeabilities 400 md and 100 md. At the moment the fast layer breaks through, and assuming fronts advance in proportion to permeability, compute the coverage. Then repeat for permeabilities 250 md and 250 md and comment on the difference.

Second, describe qualitatively how the water cut history of the two-layer case differs from the uniform case, and name the economic quantity most affected.
