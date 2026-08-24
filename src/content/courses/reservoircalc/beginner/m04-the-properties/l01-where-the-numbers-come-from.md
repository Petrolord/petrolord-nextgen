# Where the numbers come from

Module 3 ran the chain with four numbers that arrived without explanation. NTG 0.8, porosity 0.20, water saturation 0.35 and $B_o$ 1.2. They were handed to you the way a laboratory or a subsurface team hands out a property set for a first pass volumetric, and taking them on trust was the right thing to do while you were learning the arithmetic.

They are not free parameters. Each one is somebody's result, produced by a workflow with its own data, its own assumptions and its own error bars. Three of the four are petrophysical results computed from wireline logs, which is exactly what the Petrophysics course produced from the typewell. The fourth comes from a fluid sample. This lesson says where each number is born, so that when a property sheet lands on your desk you know what to ask about it.

## Porosity comes from the density log

Porosity is computed from a log that responds to how much of the formation is rock and how much is fluid. The workhorse is the bulk density log, which measures the density of the formation as the tool sees it, and it is converted with the density porosity relation:

$$\phi_D = \frac{\rho_{ma} - \rho_b}{\rho_{ma} - \rho_{fl}}$$

Here $\rho_b$ is the logged bulk density, $\rho_{ma}$ is the matrix density of the rock and $\rho_{fl}$ is the density of the fluid in the flushed zone. The measurement is $\rho_b$. The other two are choices, and the Petrophysics module on choosing matrix and fluid values exists because those choices move the answer. Assume a sandstone matrix where the rock is actually dolomite and every porosity in the well is wrong.

The neutron and sonic logs give independent porosity routes, each with its own sensitivities, and combining neutron with density is the standard defence against shale effect and gas effect. So the 0.20 on your sheet is the end of a chain that started with a physical measurement, passed through at least two assumed constants, and was probably averaged over a zone.

## Water saturation comes from resistivity

Water saturation is computed from the deep resistivity log through Archie's equation:

$$S_w^{\,n} = \frac{a \, R_w}{\phi^{m} R_t}$$

$R_t$ is the measurement. Everything else is an input. $R_w$ is the resistivity of the formation water, which is a whole Expert level topic on its own because it is rarely measured directly in the well being interpreted. The exponents $a$, $m$ and $n$ come from core, from a Pickett plot on a water leg, or from a regional default.

Two things follow. First, $S_w$ depends on porosity, so an error in porosity propagates into saturation before it ever reaches the volumetric chain, and it does so raised to the power $m$. Second, Archie assumes a clean, water wet formation with conductivity only through the brine in the pores. In shaly sand the clay conducts as well, Archie reads too much conductivity, and it reports a water saturation that is too high. That is what the Simandoux and Indonesia models exist to correct.

So the 0.35 on your sheet is the most assumption laden number in the whole chain, and it is the one worth asking about first.

## Net to gross comes from cutoffs

NTG is not measured by any tool. It is a counting result. The petrophysicist computes shale volume from the gamma ray, computes porosity, computes saturation, and then applies cutoffs. A depth sample is net if it passes all of them, typically something like shale volume below a limit, porosity above a limit, and for net pay a water saturation below a limit as well.

Net thickness is then the count of passing samples times the sample interval, and NTG is that thickness divided by the gross interval. The Petrophysics module on cutoffs and net pay is the whole of this workflow.

The consequence is that NTG is a function of a decision. Nobody measured 0.8. Somebody chose cutoffs that produced 0.8, and a different but equally defensible set of cutoffs would produce a different figure. When you receive an NTG, the useful question is not how accurate it is but which cutoffs generated it, and whether it is net reservoir or net pay. The two are not the same, and using net pay thickness in the chain while also applying a saturation cutoff later would double count the saturation screen.

## Bo comes from the fluid, not the logs

The formation volume factor is a fluid property and no log gives it. It comes from a pressure, volume and temperature study on a downhole sample or a recombined surface sample, in which the fluid is taken through a depletion sequence in the laboratory and the shrinkage is measured directly. Where no sample exists, $B_o$ is estimated from a correlation using API gravity, solution gas ratio, reservoir temperature and pressure.

$B_o$ is also the one property that changes over field life, because it depends on pressure. The value used in a volumetric is the one at initial reservoir conditions, which is consistent with STOIIP being an initial quantity.

## What to do with a property sheet

Treat every number on it as a claim with a provenance. For each one, three questions cover most of the risk. What data produced it, which assumed inputs went into it, and over what interval was it averaged? A sheet that cannot answer those is a sheet you should not book from.

## Exercise

For each of NTG, porosity, water saturation and $B_o$, write down in one line the measurement or data source that produces it and one assumed input that could move it. Then say which of the four is not a petrophysical result at all.

Self check: NTG comes from cutoffs applied to log derived curves, and the cutoff values themselves are the assumption. Porosity comes from the bulk density log, with the assumed matrix density as an input that moves it. Water saturation comes from the deep resistivity log through Archie, with formation water resistivity as the input most able to move it. $B_o$ comes from a PVT study on a fluid sample or from a correlation, with the sample being representative as the assumption. The one that is not a petrophysical result is $B_o$, which is a fluid property measured in a laboratory rather than computed from logs.
