# Working the capstone

Six numbers, spanning the layer column, the two sweep methods, the areal correlation, the forecast and the reconciliation, on a layer column, a mobility ratio, an oil, a rate and a breakthrough the brief states. This lesson walks each mechanism on the teaching case, the one the design explorer opens on, and names the mistake most likely to produce a plausible wrong answer.

## What you are given

The five-layer column with thicknesses and permeabilities, in depth order. A mobility ratio and the frozen factor set. The five-spot element: 208.8040473397547 acres, 34.585155812896204 ft net, porosity 0.2, at a stated rate with the vertical sweep taken from the layer column and a water oil ratio limit of 25. A producer's breakthrough date and the allocation matrix. The teaching case is the planted column at $M = 1.2$, 2000 rb/d, the SCAL oil and Ekene-6's breakthrough.

## Field 1: the permeability variation

Fit the log-normal to the five permeabilities and report $V$.

Two things to get right. The plotting position is $(i + 0.5)/n$ with a zero-based index on the DESCENDING sort, so the probabilities are 0.1, 0.3, 0.5, 0.7 and 0.9. And $V = 1 - e^{-\sigma}$ where $\sigma$ is the negative of the fitted slope of $\ln k$ against the normal quantile.

The check on the teaching column: the answer is a clean round number, which is a sign you have the plotting position right, because a different convention gives something untidy in the second decimal.

## Field 2: coverage at the first breakthrough

Dykstra-Parsons at the stated $M$. Sort by permeability descending. At the first layer's breakthrough, that layer is at $x = 1$ and every other layer is at the frontal position given by the formula with $r = k_j / k_1$. Coverage is the thickness-weighted average.

The likely mistake is using the depth-ordered thicknesses with the permeability-ordered layers. In the teaching column the fastest layer is the 22 foot one. Sort the pairs, not the columns.

The check: with $M > 1$ the answer sits slightly BELOW the Stiles coverage at the same stage.

## Field 3: the Stiles water cut at the first breakthrough

Compute the capacity ratio $A = M B_o / B_w$, then

$$f_{ws} = \frac{A C_1}{A C_1 + (C_t - C_1)}$$

with $C_1$ the capacity $kh$ of the broken layer and $C_t$ the total.

The likely mistake is using $M$ in place of $A$ and omitting the $B_o/B_w$ factor. On the teaching case that gives 0.4956992136055276, close enough to the right value to look right.

## Field 4: the areal sweep at breakthrough

The forecast evaluates the Craig correlation at the endpoint mobility ratio its displacement gives, so the oil viscosity the brief states moves it. Four terms, all explicit; the forecast tile reports it.

The likely mistake is evaluating it at the Stiles capacity ratio (1.4304000000000001 on the teaching case) rather than at a mobility ratio. The correlation takes $M$, not $A$.

## Field 5: the design breakthrough time

Compute the element pore volume as $7758 A h \phi E_V$ with $E_V$ from field 2, then $W_{i,bt} = Q_{i,bt} \, PV \, E_{Abt}$ with $Q_{i,bt}$ from the displacement (0.33077027444818546 for the teaching oil), then divide by the injection rate, then round UP to the next whole monthly step of 30.4375 days.

Two mistakes. Forgetting $E_V$ in the pore volume doubles the answer. Forgetting the step quantisation on the teaching case gives 626.9787606687237 days, 12 days short of the engine's value, and the tolerance is tight enough to notice.

## Field 6: the implied swept fraction

Take the water allocated to the stated producer before its breakthrough date, convert to reservoir barrels, and divide by $Q_{i,bt} \, E_{Abt}$ of the forecast's breakthrough state to get the implied pore volume. Divide that by the element pore volume computed WITHOUT the vertical sweep multiplier.

That last point is the likely mistake and it is worth stating twice. The implied volume is compared against the whole element, 11205422.76570545 rb, not against the vertically-reduced flooded volume. Using the reduced one doubles the answer.

The check: the result is a percent-level number. If yours is a tens-of-percent number, look at your denominator.

## Using the panel

{{panel:wf-design-explorer}}

The panel opens on the teaching case. For the capstone, type the brief's permeabilities, $M$, rate and oil viscosity into the boxes. Layers mode then gives fields 1, 2 and 3, forecast mode with the EV toggle on gives fields 4 and 5, and the channel back-out block gives field 6 once you choose the producer and type its breakthrough date. Work each from the definition as well.

## The general advice

Every field in this capstone depends on getting one ordering, one convention or one denominator right. The arithmetic is not the hard part. Before submitting, for each answer, write down which volume or which ordering it is relative to. Half the near-misses in this tier come from that sentence not being written.

## Exercise

First, for each of the six fields, write the one-line statement of what the answer is a fraction of, or an ordering of, or a convention on. Some will be trivial; write them anyway.

Second, compute field 5 both with and without the step quantisation and confirm the difference is one step. State why the engine reports the quantised value.
