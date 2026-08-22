# Neutron and sonic porosity

Density is one of three classic porosity logs. The other two, neutron and sonic, measure different physics and therefore fail in different ways. In this beginner tier you compute porosity from density only, but you need to know what the neutron and sonic curves are telling you, because the combinations between tools are where much of the diagnostic power of log analysis lives. The intermediate tier puts them to work quantitatively.

## Neutron porosity

The neutron tool emits fast neutrons into the formation. Neutrons lose energy most efficiently when they collide with nuclei of similar mass, which in rocks means hydrogen. Since hydrogen lives almost entirely in pore fluids (water, oil) rather than in the rock matrix, the rate at which neutrons slow down measures the **hydrogen index** of the formation, which is a proxy for fluid-filled porosity. The curve is logged as NPHI, usually already scaled to porosity units.

Two calibration habits matter. The tool is conventionally calibrated to read true porosity in water-filled **limestone**; in other lithologies it needs a small matrix correction. And because it responds to all hydrogen, it has two famous biases:

- **Shale reads high.** Clay minerals carry structural hydrogen and bound water, so a shale with almost no effective porosity can show NPHI of 0.30 or more.
- **Gas reads low.** Gas holds far fewer hydrogen atoms per unit volume than water or oil, so gas-bearing porosity partially disappears from the neutron reading.

## Sonic porosity

The sonic tool measures the travel time of a compressional sound pulse over a fixed span of formation, reported as **interval transit time** $\Delta t$ (the DT curve). Sound travels fast in solid minerals and slowly in fluids, so transit time stretches as porosity increases. The classic Wyllie time-average model treats the rock as if the wave crossed matrix and fluid in series:

$$\phi_S = \frac{\Delta t - \Delta t_{ma}}{\Delta t_{fl} - \Delta t_{ma}}$$

The typewell dataset carries metric values for the two end members: $\Delta t_{ma} = 182$ us/m for the sand matrix and $\Delta t_{fl} = 656$ us/m for the pore fluid.

Worked example: suppose the sonic in a sand reads $\Delta t = 277$ us/m. Then

$$\phi_S = \frac{277 - 182}{656 - 182} = \frac{95}{474} = 0.2004$$

which is about 0.20, in line with what density porosity gives in the same kind of rock. The Wyllie model is empirical and behaves best in compacted, water-wet rocks; it under-reads vuggy porosity because sound finds a fast path through the connected matrix around the vugs.

## Using the tools together

The real diagnostic value comes from overlaying the curves, classically neutron and density plotted on compatible scales:

- **Clean water or oil sand:** neutron and density porosity agree, the curves track each other.
- **Shale:** neutron reads much higher than density; the curves separate widely. This separation is itself a useful shale indicator alongside gamma ray.
- **Gas:** the biases go opposite ways. Neutron reads too low while density reads slightly high (gas is light, lowering $\rho_b$ and thus raising $\phi_D$). The curves cross over, and that **gas crossover** is one of the fastest visual gas indicators in logging.

When both are valid porosity measurements of the same clean formation, an average improves on either alone. The intermediate tier uses exactly this neutron-density combination, $\phi_{ND} = (\phi_D + \phi_N)/2$, along with Wyllie sonic porosity, and lets you compare all three over SAND_A. In this tier the deliverable porosity is $\phi_D$ alone, with quartz parameters, which is a defensible choice in a clean water-wet sand like the typewell's.

## What to remember

Each porosity tool answers a slightly different question. Density senses mass deficit, neutron senses hydrogen, sonic senses travel time through the frame. Where they agree you gain confidence; where they disagree the disagreement is information about lithology or fluid. A log analyst who can glance at the neutron-density pair and say "shaly", "clean and wet" or "possible gas" before computing anything is using the physics, and that habit starts now even though your calculator work stays with density.

## Exercise

Using the typewell sonic parameters $\Delta t_{ma} = 182$ us/m and $\Delta t_{fl} = 656$ us/m:

1. Compute Wyllie porosity for $\Delta t = 229.4$ us/m.
2. In a gas-bearing clean sand, state the direction each of NPHI and $\phi_D$ moves relative to true porosity, and name the visual effect on a neutron-density overlay.

Self-check: $(229.4 - 182)/474 = 47.4/474 = 0.1000$. In gas, neutron reads low and density porosity reads slightly high, so the curves cross over; that crossover is the classic gas signature.
