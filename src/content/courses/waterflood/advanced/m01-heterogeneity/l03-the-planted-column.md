# The planted column

The Ekene layer set is not a measurement. It was constructed so that the engine's own fitting procedure recovers a designed answer exactly, which is the same trick the decline curve course used with planted Arps parameters and the SCAL course used with a planted J-function. This lesson shows the construction, the recovery, and the one digit that does not come back clean.

## The design

Choose a median permeability and a log standard deviation, then place each layer at the exact quantile the engine's plotting position will assign it:

$$k_i = k_{50} \, e^{-\sigma z_i}, \qquad z_i = \Phi^{-1}\!\left(\frac{i + 0.5}{n}\right)$$

With $k_{50} = 250$ md, $\sigma = \ln 2$, and $n = 5$:

| $i$ | probability | $z_i$ | $k_i$ (md) |
|---|---|---|---|
| 0 | 0.1 | -1.2815515641401563 | 607.7507038307907 |
| 1 | 0.3 | -0.5244005132792953 | 359.5839451276606 |
| 2 | 0.5 | 0 | 250 |
| 3 | 0.7 | 0.5244005132792952 | 173.81198701129736 |
| 4 | 0.9 | 1.2815515641401563 | 102.8382190362731 |

The choice of $\sigma = \ln 2$ is deliberate, because then

$$V = 1 - e^{-\ln 2} = 1 - \tfrac{1}{2} = 0.5$$

exactly. A permeability variation of 0.5 is a moderately heterogeneous sand, squarely in the range where a waterflood is worth doing and conformance is worth watching.

The choice of $k_{50} = 250$ md is also deliberate: it is the same reservoir permeability the SCAL course used to scale its J-function. The capillary half and the sweep half of the reservoir curriculum describe the same rock.

## The recovery

Feed those five permeabilities back to the engine's fitting routine and it returns

$$V = 0.5, \qquad \sigma = 0.6931471805599453, \qquad n = 5$$

$V$ is exactly 0.5 and $\sigma$ is exactly the double nearest $\ln 2$. The plant comes back.

That is not a coincidence and it is not a validation of the method against nature. It is a validation of the method against itself: the data were placed on the fitted line, so the fit reproduces the line. What it DOES prove is that the implementation is correct, that the plotting position is what the design assumed, and that the arithmetic carries no bias. Those are worth proving.

## The digit that does not come back

$$k_{50} = 250.0000000000001$$

The design value is exactly 250. The fit returns a value one ulp above it.

The reason is that $k_{50}$ comes from the regression INTERCEPT, exponentiated. The intercept is a sum of products of quantiles and logarithms, each rounded to a double, and $\exp(\ln 250)$ is not exactly 250 in binary arithmetic. Five layers of that and the last bit moves.

The right response is to report $k_{50}$ as 250, record the raw double in the digest, and never key an assessment on the trailing digit. The wrong response is to look for a bug. Knowing which of those you are looking at is the skill.

## The layer column as built

The permeabilities above are assigned to a column in DEPTH order, with thicknesses chosen so the total is 84 feet:

| layer | depth position | thickness (ft) | permeability (md) | quantile rank |
|---|---|---|---|---|
| L1 | top | 18 | 173.81198701129736 | 3 |
| L2 | | 22 | 607.7507038307907 | 0 |
| L3 | | 16 | 250 | 2 |
| L4 | | 14 | 102.8382190362731 | 4 |
| L5 | base | 14 | 359.5839451276606 | 1 |

The fastest layer is second from the top, not at the top. That is deliberate and it is the subject of the next lesson.

{{panel:wf-design-explorer}}

In layers mode the bars are drawn in depth order with length proportional to permeability. The second bar is much the longest. Read the $V$ and $\sigma$ tiles and confirm they are 0.5 and 0.693.

## Why plant at all

Because a teaching dataset whose answer is known is the only kind you can learn a method on. When your $V$ comes out at 0.5 you know your arithmetic is right, and you can then go and compute $V$ on real core data with confidence in the machinery. If the teaching set were a real one with an unknown answer, an error in your method and an oddity in the rock would look identical.

The cost is that a planted set teaches you nothing about how messy real data is. Real permeability distributions are not log-normal, they have outliers, and the fitted line is a compromise. Both experiences are needed and this course only supplies one.

## The misconception to avoid

"The engine recovered $V = 0.5$, so the method works." The method reproduced a distribution that was constructed on its own assumptions. On real data the log-normality assumption is the thing being tested, and the diagnostic is whether the points fall on a line, which a single $V$ value does not tell you. Always look at the plot.

## Exercise

First, verify one row of the design table: compute $250 \, e^{-\ln 2 \times 1.2815515641401563}$ and confirm you get 102.8382190362731. Then explain why that layer is the least permeable rather than the most.

Second, redesign the column for $V = 0.75$ keeping $k_{50} = 250$ md and $n = 5$. Compute $\sigma$ and the five permeabilities, and state the ratio of fastest to slowest for both this column and the original.
