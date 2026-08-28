# Drainage curves in the lab

Capillary pressure is measured on core plugs, and the Ekene programme cut three: EK1-P from the Ekene-1 core, EK3-P from Ekene-3, and EK5-P from Ekene-5. Three plugs, three laboratories, three different measurement systems. That was not carelessness. It is the normal condition of real SCAL data, and learning to read across it is the point of this module.

## Three ways to make one measurement

The lab has to push a non-wetting fluid into a plug in controlled steps and record how much water leaves at each pressure. Three classical systems do it:

| plug | system | $\sigma$ (dyn/cm) | $\theta$ (deg) | k (md) | $\phi$ |
|---|---|---|---|---|---|
| EK1-P | air-brine | 72 | 0 | 420 | 0.23 |
| EK3-P | mercury-air | 480 | 40 | 250 | 0.20 |
| EK5-P | oil-brine | 48 | 30 | 95 | 0.16 |

Air-brine, on a porous plate or centrifuge, is the traditional workhorse: brine-saturated plug, air pushed in, days to weeks per curve. Mercury injection is the fast one: the plug is dried and mercury, spectacularly non-wetting against the vacuum in the pores, is forced in; a full curve takes hours, but the plug is sacrificed and the fluids are nothing like reservoir fluids. The oil-brine restored-state test is the slow aristocrat: reservoir-like fluids, reservoir-like wettability, weeks of patience.

Each system carries its own $\sigma \cos\theta$. Air-brine at 72 with $\theta = 0$ works at 72. Mercury at 480 with $\theta = 40$ works at $480 \cos 40^\circ$, roughly 368. Oil-brine at 48 with $\theta = 30$ works at roughly 41.6. The lever arm of the last lesson differs by nearly a factor of nine across the table.

## The same rock family, wildly different numbers

All three labs sampled the same depositional sand, and each reported the capillary pressure at $S_w = 0.30$ on its own plug in its own system:

| plug | $P_c$ at $S_w = 0.30$ (psi) |
|---|---|
| EK1-P | 29.190762994489138 |
| EK3-P | 180.18302550343515 |
| EK5-P | 29.55586916053684 |

The mercury curve rides about six times above the air-brine curve. If you filed these three curves side by side without conversion, the mercury measurement would look like a different formation altogether. It is not. The fluids set the scale, and the mercury system's enormous $\sigma \cos\theta$ inflates every pressure on the page by the same factor. Nothing about the rock changed.

Now look at the quieter surprise in the table: EK1-P and EK5-P agree to within about one percent, 29.19 against 29.56 psi. It would be natural to conclude those two plugs are near-twins. They are not. EK1-P is the best rock of the three, 420 md at 23 percent porosity; EK5-P is the tightest, 95 md at 16 percent. The tight rock's smaller throats push its capillary pressure up, its lab's gentler fluid system pulls the measured numbers down, and the two effects happen to cancel almost exactly at this saturation. Two curves that look the same for two different reasons.

## What the eye cannot do

That near-coincidence is the honest lesson of this module. Raw capillary pressure curves are the product of two levers, the fluid pair through $\sigma \cos\theta$ and the pore structure through the throat-size distribution, and eyeballing the curves cannot separate them. A six-fold spread might be fluids. A one-percent agreement might be hiding a four-fold contrast in rock quality. Until the fluid system and the rock quality are both divided out, comparison between plugs is not merely difficult, it is meaningless.

Dividing both out in one move is exactly what the next module does. Each of these three tables was measured on a fifteen-row saturation grid running from $S_w = 0.30$ to $1.00$ in steps of 0.05, and module 2 will push all three through a single dimensionless transformation and watch them land on one curve.

## The misconception to avoid

Do not rank rocks by the height of their raw capillary pressure curves. Higher curves do not mean tighter rock until the fluid system has been divided out, and near-identical curves do not mean similar rock. Between EK1-P and EK3-P the fluids dominate the comparison; between EK1-P and EK5-P the fluids and the rock conspire to hide the comparison. The raw curve is a lab artefact wearing a geological costume.

## Worked example

Estimate how far above the EK1-P curve the EK3-P curve should ride, using only the two levers.

The fluid lever is the ratio of the working tensions: roughly $368 / 72$, call it 5.1. The rock lever compares throat sizes through the quality ratio each plug carries; EK1-P at 420 md and 0.23 porosity against EK3-P at 250 md and 0.20 porosity works out to a factor of roughly 1.2 in EK3-P's favour, tighter rock reading higher. Multiplying the levers gives roughly $5.1 \times 1.2 \approx 6.2$.

Check it against the measured table: $180.18302550343515 / 29.190762994489138$ is about 6.17. The two-lever estimate lands within a percent of the measured ratio, which is the first quiet evidence that a clean scaling law is hiding under these three curves. Module 2 gives that law its name.

## Exercise

First, using the two-lever logic of the worked example, explain why EK5-P, the tightest plug in the table, still posts capillary pressures close to EK1-P, the best rock in the table. Say which lever pushes its curve up, which pulls it down, and roughly how large each push is.

Second, your company is offered a fourth measurement, a mercury-injection curve on a plug from Ekene-6, and a colleague objects that mercury numbers are six times too high to be useful. Write two sentences answering the objection: what exactly is high, and what would you do to the curve before comparing it with the air-brine data?
