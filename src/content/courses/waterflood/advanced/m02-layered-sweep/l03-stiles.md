# Stiles

Stiles predates Dykstra-Parsons by a year and makes one simplifying move: it assumes the fronts advance in proportion to permeability alone, ignoring the mobility contrast. In exchange it gives the producing water cut directly in surface units, which is what an operator actually measures.

## The kinematics

At the breakthrough of layer $i$, layer $j$ is swept to

$$x_j = \frac{k_j}{k_i}$$

which is the $M \to 1$ limit of the Dykstra-Parsons frontal position. Coverage follows as before, thickness-weighted.

## The water cut

Here Stiles differs in kind. Define the capacity of a layer as $k_j h_j$, and let $C_i$ be the capacity of the layers that have broken through and $C_t$ the total. Then the producing SURFACE water cut is

$$f_{ws} = \frac{A\,C_i}{A\,C_i + (C_t - C_i)}$$

where $A$ is the capacity ratio

$$A = \frac{k_{rw}/\mu_w}{k_{ro}/\mu_o} \cdot \frac{B_o}{B_w}$$

The first factor is the endpoint mobility ratio $M$. The second converts reservoir volumes to surface volumes. So

$$\boxed{A = M \frac{B_o}{B_w}}$$

$A$ is not a new parameter. It is the mobility ratio expressed in surface units.

For Ekene, $M = 1.2$, $B_o = 1.21584$, $B_w = 1.02$:

$$A = 1.2 \times \frac{1.21584}{1.02} = 1.4304000000000001$$

The trailing digit is binary arithmetic on 1.4304, and the design value is 1.4304.

## The Ekene table

At $A = 1.4304000000000001$:

| stage | $k$ broken (md) | coverage | surface water cut |
|---|---|---|---|
| 0 | 607.7507038307907 | 0.5283542009271434 | 0.5843728303284756 |
| 1 | 359.5839451276606 | 0.712244206408273 | 0.7544492578929508 |
| 2 | 250 | 0.8365881348910084 | 0.8752362824061102 |
| 3 | 173.81198701129736 | 0.9319439266959082 | 0.9620748854997383 |
| 4 | 102.8382190362731 | 1 | 1 |

The producer is at 58 percent water cut the moment the first layer breaks through, and above 87 percent by the third. That is a harsher-sounding picture than the Dykstra-Parsons water oil ratios, and it is the same picture: a water oil ratio of 1.099 corresponds to a reservoir water cut of 0.524, and the surface figure is higher because $A$ exceeds 1.

## Why water cut and not water oil ratio

Because water cut is what a test separator reports and what a facility is sized for. A water oil ratio of 19 and a water cut of 95 percent are the same statement, and one of them is the number in the operations report.

The conversion is

$$f_w = \frac{\text{WOR}}{1 + \text{WOR}}, \qquad \text{WOR} = \frac{f_w}{1 - f_w}$$

with the caveat that the Dykstra-Parsons water oil ratio above is at RESERVOIR conditions and the Stiles water cut is at SURFACE conditions, so converting one to the other requires the $B_o/B_w$ factor as well. That is precisely the factor sitting inside $A$.

## The sensitivity to $A$

$A$ appears only in the water cut, not in the coverage, because Stiles kinematics do not depend on mobility. So $A$ moves the producing water cut and leaves the sweep alone:

| $A$ | water cut at first breakthrough |
|---|---|
| 1.0 | 0.4956992136055276 |
| 1.4304000000000001 | 0.5843728303284756 |
| 2.0 | 0.6628327528642564 |

A more unfavourable mobility ratio makes the broken-through layers carry a larger share of the surface stream. It does not make the fronts move differently, which is exactly the assumption that distinguishes Stiles from Dykstra-Parsons.

{{panel:wf-design-explorer}}

The Stiles tiles sit alongside the Dykstra-Parsons ones in layers mode. Compare the two coverages at first breakthrough at the default mobility ratio, and then set the slider to 1.0 and compare again.

## When Stiles is the right choice

When the mobility ratio is close to one, where its kinematic assumption is nearly exact and it gives you the surface water cut directly.

When you need a quick answer and the capacity data is what you have. Stiles needs only $k h$ per layer and one fluid parameter.

When you want a conservative water cut. At $M > 1$ Stiles reports a higher water cut at first breakthrough than the Dykstra-Parsons equivalent, because it does not credit the mobility contrast with holding back the fast layer.

## The misconception to avoid

"$A$ is a fitting parameter." $A$ is fully determined by the endpoint relative permeabilities, the viscosities and the formation volume factors. If you find yourself adjusting $A$ to match a history, you are adjusting the mobility ratio or the PVT, and you should say which.

## Exercise

First, verify $A$ from its definition using the Ekene endpoints $k_{rw,max} = 0.3$, $\mu_w = 0.5$ cp, $k_{ro,max} = 0.9$, $\mu_o = 1.8$ cp, $B_o = 1.21584$, $B_w = 1.02$.

Second, convert the Dykstra-Parsons first-breakthrough water oil ratio of 1.099451244867303 to a reservoir water cut, then to a surface water cut using $B_o/B_w$, and compare with the Stiles figure of 0.5843728303284756. Explain the remaining difference.
