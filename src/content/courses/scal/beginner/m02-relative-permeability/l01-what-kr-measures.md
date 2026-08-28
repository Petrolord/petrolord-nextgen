# What kr measures

Module 1 established that the Ekene sand holds two fluids at once, and that only the saturation window between connate water and residual oil is in play. This module gives you the tool that says how easily each fluid moves through that shared pore space. The tool is relative permeability, written $k_r$, and it is the single most consequential laboratory measurement in waterflood engineering.

## Three permeabilities, one rock

Absolute permeability $k$ is a property of the rock alone. Flow one fluid through a core at full saturation, apply Darcy's law, and the number you recover is $k$, in millidarcies. The Ekene sand carries an average of 250 md. One rock, one number, no dependence on what the fluid is.

Effective permeability is what you measure when two fluids share the pores. Flow water through a core that also holds oil and the water sees only part of the pore network: the part water occupies. Its effective permeability $k_w$ is lower than $k$, often dramatically lower. The same is true for the oil phase and its effective permeability $k_o$. Both numbers depend on saturation, because saturation decides how much of the network each phase occupies.

Relative permeability is the ratio that strips the rock back out:

$$k_{rw} = \frac{k_w}{k} \qquad k_{ro} = \frac{k_o}{k}$$

Each is a dimensionless number between 0 and 1, and each is a function of water saturation $S_w$. When you plot $k_{rw}$ and $k_{ro}$ against $S_w$ you get the two crossing curves that every reservoir engineer learns to read, and that the rest of this module teaches you to compute.

## Why the ratio is the useful form

The ratio form separates two questions that would otherwise be tangled together.

How good is the rock? That is $k$, and it belongs to geology. A 250 md sand and an 8 md sand differ by a factor of thirty in every flow calculation, but that factor multiplies everything equally.

How do the fluids share the rock? That is $k_r(S_w)$, and it belongs to the physics of two phases in one pore network. Two rocks with very different absolute permeabilities can have nearly identical relative permeability curves, because the curves describe the sharing, not the plumbing.

Every displacement calculation in this course uses only the curves. The absolute permeability never enters the fractional flow arithmetic you will meet in module 3, because it multiplies the water and oil terms equally and cancels. That cancellation is worth noticing now: it is why a laboratory can measure curves on a small plug and hand them to you for use across a whole field.

## The zeros are physical

At connate water saturation, $S_{wc} = 0.35$ in the Ekene sand, the water phase does not flow at all: $k_{rw} = 0$ exactly. The water is there, occupying thirty five percent of the pore space, but it is held in the smallest pores and in films on the grain surfaces, disconnected from any flowing path. Water that cannot flow has zero permeability by definition, not by approximation.

At residual oil saturation, where $S_w = 1 - S_{or} = 0.75$, the oil phase stops flowing the same way: $k_{ro} = 0$. The remaining oil sits in disconnected blobs, trapped by capillary forces, and no amount of additional water throughput moves it.

Between those two walls both curves are positive and both fluids move. The walls themselves are the endpoints you met in module 1, and lesson 4 of this module shows how completely they control the curves.

## What the curves are not

A relative permeability curve is not a property you can see on a log, and it is not derivable from porosity or from absolute permeability. It comes from a laboratory displacement experiment on core, or from a model calibrated to such experiments. The Ekene course uses the model route, with a Corey parameter set committed in the field's fixture, so that every number you compute is exact and checkable. Real projects use the same machinery with laboratory tables in place of the model, and lesson 5 treats that case.

## The misconception to avoid

The tempting error is to read $k_{rw} = 0.3$ as "water flows at thirty percent of its single phase rate, so oil must flow at seventy percent." The two curves do not sum to one. At the Ekene endpoints, $k_{rw}$ reaches only 0.3 while $k_{ro}$ reaches 0.9, and at intermediate saturations the two values sum to far less than one. Each phase interferes with the other, and the interference costs total flow capacity. The sum $k_{rw} + k_{ro}$ has no physical meaning at all; the curves are two separate answers to two separate questions.

## Exercise

A core plug from the Ekene sand has absolute permeability 250 md. At some saturation, the laboratory reports effective water permeability $k_w = 13.2$ md and effective oil permeability $k_o = 56.3$ md. Compute $k_{rw}$ and $k_{ro}$, and state what fraction of the pore network's single phase capacity is lost to interference at this saturation, taking the sum of the two relative permeabilities as your measure.

Then answer without computing: if the same fluids at the same saturations occupied an 8 md plug with the same pore geometry, would you expect the two relative permeabilities to change by roughly the factor 250 over 8, or to stay roughly where they are? Say why in one sentence.
