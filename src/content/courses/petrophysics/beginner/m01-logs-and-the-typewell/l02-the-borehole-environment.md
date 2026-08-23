# The borehole environment

Every log is measured from inside a hole that the drilling process has just disturbed. Before trusting any curve, a petrophysicist thinks about what sits between the sensor and the undisturbed formation: mud, mudcake, invaded rock, and sometimes a washed-out wall. This lesson gives you the vocabulary and the habits of suspicion you will use for the rest of the course.

## Drilling mud and invasion

Wells are drilled with mud, an engineered fluid that cools the bit, carries cuttings to surface and, critically, exerts pressure on the borehole wall to keep formation fluids from flowing in. That pressure difference pushes the liquid part of the mud, the **mud filtrate**, into any permeable formation. Solid mud particles plaster onto the wall as **mudcake**, which slows further invasion.

The result is a set of concentric zones around the hole in a permeable bed:

- **Flushed zone.** Closest to the hole. Original fluids are largely displaced by mud filtrate. Its resistivity is called $R_{xo}$.
- **Transition zone.** A mix of filtrate and original fluids.
- **Uninvaded zone.** Far enough from the hole that the original pore fluids remain. Its resistivity is the **true resistivity** $R_t$, and this is the number saturation work needs.

Shallow-reading tools see the flushed zone; deep-reading tools are designed to see past invasion to $R_t$. When this course says "resistivity" and writes $R_t$, it means the deep reading. On the teaching dataset the deep resistivity is provided directly as the RT curve, so invasion is already accounted for, but on real wells confirming that the deep curve truly reads $R_t$ is part of the job.

## Washouts and the caliper

In soft shales or poorly consolidated sands the hole can cave beyond bit size, a **washout**. The **caliper** log measures the actual hole diameter, and comparing it with bit size is the first quality check on any log plot.

Washouts matter most for **pad tools**, instruments that must press a sensor pad firmly against the borehole wall. The density tool is the classic case: its source and detectors sit on a pad, and if the pad bridges a cave, part of the measured signal comes from mud instead of rock. Mud is light, roughly 1 g/cc, so a washed-out density reading is biased low, which fakes extra porosity. A good habit you should already form: whenever a density porosity looks surprisingly high, ask what the caliper was doing at that depth.

The gamma ray, by contrast, is relatively forgiving of hole conditions, and deep resistivity averages over a large volume of rock, which is one reason the triple combo is such a robust starter kit.

## Depth of investigation and vertical resolution

Two phrases describe what each tool actually senses:

- **Depth of investigation** is how far into the formation, radially, the measurement reaches. Density reads a few centimetres. Deep resistivity reads a metre or more. This is why density responds to the flushed zone while deep resistivity can reach the uninvaded zone.
- **Vertical resolution** is the thinnest bed the tool can resolve as a distinct reading. Most standard curves resolve beds down to roughly half a metre; thinner beds read as an average of the bed and its neighbours.

The typewell samples every 0.5 m, which matches this scale. Remember that a curve value at one depth is never a point measurement of a geometric plane; it is an average over some volume of rock around that depth.

## A concrete reading

Consider the shale at the top of the typewell, at 2000 m: GR about 120 API, bulk density about 2.55 g/cc, deep resistivity about 2 ohm.m. Shales are usually impermeable, so mudcake does not build and filtrate does not invade; what the tools see is essentially the shale itself. In the sand at 2020 m (GR 20 API, RHOB 2.3035 g/cc, RT 9.2554 ohm.m) invasion would be real in a live well, and the 9.2554 ohm.m value is meaningful precisely because it represents the deep, uninvaded reading. The habit to internalise: for every curve, ask which zone around the borehole it actually measured.

## Exercise

A density log through a suspected reservoir reads 2.10 g/cc over one metre, while the caliper shows the hole six centimetres over bit size across the same metre. State, in two sentences, what you suspect about the density reading and which direction it is biased. Then name the resistivity zone (flushed, transition, uninvaded) whose resistivity you would need for saturation work, and the symbol this course uses for it. Check yourself: the reading is suspect because the pad likely bridged a washout and read mud, biasing density low and porosity high; saturation needs the uninvaded zone, $R_t$.
