# How the engine marches

The forecast is a time march. Each step, it works out how much water has gone in, how far the swept area has grown, what state the displacement is in inside that area, and what the well is producing. This lesson walks one step so that every number the forecast produces is traceable.

## The setup

Before the march begins the engine computes three fixed quantities.

**The pore volume**, $PV = 7758 \, A \, h \, \phi \, E_V$ reservoir barrels, with the vertical sweep multiplier folded in.

**The mobility ratio and the areal sweep at breakthrough**, $M$ from the displacement spec and $E_{Abt}$ from the Craig correlation.

**The water to breakthrough**, $W_{i,bt} = Q_{i,bt} \times PV \times E_{Abt}$, where $Q_{i,bt}$ is the pore volumes injected at breakthrough from the Welge construction. This is the pattern-scale statement of the 1-D breakthrough: the swept region has grown to $E_{Abt}$ of the pattern and carries the Buckley-Leverett profile behind its front.

For the Ekene design case those come out as $PV = 5767063.995536059$ rb, $E_{Abt} = 0.6573574366303985$, $Q_{i,bt} = 0.33077027444818546$ from the SCAL course, and

$$W_{i,bt} = 1253957.5213374475 \text{ rb}$$

## One step

At step $s$, elapsed time is $t = s \times \Delta t$ with $\Delta t$ defaulting to 30.4375 days, a mean month.

**Cumulative injection.** $W_{i,\text{total}} = i_w t$, then subtract any gas fill-up volume to get the water that has actually displaced anything: $W_i = \max(0, W_{i,\text{total}} - PV \, S_{gi})$.

**Areal sweep.** Below breakthrough it grows in proportion to the injected volume, $E_A = E_{Abt} \, W_i / W_{i,bt}$. Above it, the logarithmic law.

**Displacement state.** Before breakthrough the outlet is dry and every injected barrel displaces oil. After it, the engine computes the pore volumes injected INTO THE SWEPT REGION, $Q_i = W_i / (PV \, E_A)$, and interpolates the Welge recovery profile at that $Q_i$ to get the displacement efficiency and the outlet fractional flow.

**Cumulative oil.** After breakthrough, $N_{p,rb} = PV \, E_A \, E_D (1 - S_{wc})$. Before it, $N_{p,rb} = W_i$ exactly, which is the subject of the next lesson.

**Rates.** Difference the cumulative oil, divide by the step, and take the water rate as whatever is left of the injection: $q_o = \Delta N_p / \Delta t$ and $q_w = i_w - q_o$ in reservoir barrels, then convert both to surface with their formation volume factors.

**Stop tests.** Break if the surface water oil ratio has reached the limit, or if the displacement profile is exhausted, or at the horizon.

## The two things this construction guarantees

**Material balance closes by construction.** The oil is computed from the volume and the efficiency, not accumulated from rates, and the rates are then differenced from it. That means the cumulative is exact and the rates inherit the step size.

**Production balances injection.** Because $q_w$ is defined as $i_w - q_o$, the reservoir-barrel total always equals the injection. On the design case's last step, $q_o B_o + q_w B_w = 2000$ exactly, which is the injection rate.

That second one is an assumption dressed as an identity. Real fields do not produce exactly what they inject; the difference goes into pressure change, into aquifer influx, or out of the pattern. The engine has no pressure model, so it enforces the balance instead, and the warnings say so.

## The monotonicity guard

The engine takes $N_p = \max(N_p, N_{p,\text{previous}})$ at every step, so cumulative recovery can never decrease.

That is a guard against a real numerical problem: the areal sweep and the displacement efficiency are both functions of $W_i$, and near breakthrough the transition between the pre- and post-breakthrough formulas can produce a small backward step. Clamping is the cheap fix, and its cost is that a real non-monotonicity would be hidden. On a screening tool that is the right trade, and it is worth knowing the clamp is there.

## Why the step size matters

Everything except the cumulative oil is resolved only to the step. The breakthrough time is reported as the first step at which $W_i$ exceeds $W_{i,bt}$, so it is quantised to a month. The stop condition fires at the first step past the limit, so the reported final water oil ratio overshoots.

On the Ekene design case that produces a striking artefact: water oil ratio limits of 10 and 25 give IDENTICAL results, because the water oil ratio crosses both inside one monthly step. Lesson 3 takes that up.

## The misconception to avoid

"The forecast integrates the flow equations." It does not integrate anything. It evaluates closed-form correlations and an interpolated displacement profile at a sequence of times. There is no timestep stability, no convergence, and no accumulation of numerical error, and refining the step improves only the resolution of the reported events, not the accuracy of the underlying answer.

## Exercise

First, for the design case at step 5, compute the cumulative injection and confirm from the pre-breakthrough rule that the oil rate times $B_o$ equals the injection rate of 2000 rb/d.

Second, explain why refining the time step from monthly to daily would change the reported breakthrough day and the reported final water oil ratio, but not the reported cumulative oil at a fixed time.
