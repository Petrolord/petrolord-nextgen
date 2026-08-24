# Heat flow and conductivity

Module 3 gave you depth. This module turns depth into temperature, and it starts by separating two quantities that everyday language runs together: the heat that the earth delivers, and the temperature gradient that you measure in a well.

## Where the heat comes from

The earth is hot inside and cold at its surface, so heat moves outward continuously. Some of it is left over from the planet's formation and from core processes, and some of it is produced by the decay of radioactive isotopes, mostly in the continental crust. Whatever the source, the direction is the same. Heat crosses the sediment column from below and leaves at the surface.

The quantity that describes this is heat flow, written $Q$. It is the amount of thermal energy crossing one square metre of a horizontal surface per second, so its unit is watts per square metre, W/m2. Continental values are small in those terms, which is why the field normally quotes them in milliwatts per square metre, mW/m2. The golden fixture in this module uses a basal heat flow of 0.06 W/m2, which is the same thing as 60 mW/m2, and both forms appear in the lessons that follow. Whenever you write one, say which you mean.

Heat flow is a property of the setting rather than of the rock. It is set by what is happening beneath the sediments: the age and thickness of the lithosphere, whether the basin is rifting or has cooled for a hundred million years, whether there is a nearby intrusion. It varies across a basin and it varies through geological time, and one of the things the Expert tier does is give the reference basin a heat flow that cools from 80 to 60 mW/m2 over its history.

## What the rock does to it

Rock resists the passage of heat. The property that measures how well a rock lets heat through is thermal conductivity, written $k$, in watts per metre per kelvin, W/m/K. A high conductivity rock passes heat easily. A low conductivity rock is an insulator.

Sedimentary rocks differ from one another more than people expect. Shale is a poor conductor, held back by clay mineralogy and by porosity full of water, which conducts heat badly. Salt is an excellent conductor, several times better than shale, which is why salt bodies visibly disturb the temperature field around them. Sandstone, limestone and dolomite sit in between, and every one of them conducts better when it is tighter, because rock matrix conducts better than pore water. The two layers of this module's fixture use $k = 1.8$ W/m/K for the upper 1000 m and $k = 3.5$ W/m/K for the lower 1000 m, a spread that is entirely ordinary for a sedimentary column.

That last point connects this module back to the last one. Conductivity depends on porosity, and porosity depends on depth through the compaction curve, so a layer's conductivity changes as it is buried. The engine handles this by computing an effective conductivity from the matrix value and the porosity at each step. For the fixture in this module the conductivities are given directly, so that the arithmetic stays clean.

## Fourier's law in words

Put the two quantities together. Conductive heat transfer obeys a law that says: the heat flow through a material equals its thermal conductivity multiplied by the temperature gradient across it, and the heat travels from hot toward cold. In symbols, for a vertical column,

$$Q = k \frac{dT}{dz}$$

Read it as a sentence about cause and effect and it is the wrong way round, which is the single most useful thing to understand in this module. The gradient is not what drives the heat. The heat flow is imposed from below, and the rock responds by establishing whatever temperature gradient is needed to carry that heat through itself.

Rearranged for the quantity you actually observe:

$$\frac{dT}{dz} = \frac{Q}{k}$$

The geothermal gradient is a ratio. It is the heat flow the earth is delivering divided by the ability of the rock at that point to conduct it. Change either term and the gradient changes.

That is why a low conductivity rock has a steep gradient. It is a poor conductor, so it needs a large temperature difference across it to move the same heat through. A high conductivity rock passes the same heat with a gentle gradient. The next two lessons make this quantitative on the fixture, and lesson 3 is where the consequence lands.

## Flow and gradient are different things

Keep the two words separate from here on.

Heat flow is what the earth delivers to the base of the column, in W/m2 or mW/m2. You do not measure it directly in a well. It is inferred, usually from a measured gradient combined with an estimate of conductivity, or it is assigned from a regional model.

Gradient is what you get from temperature measurements at more than one depth, in degC per km. It belongs to the interval you measured it over and to the rock in that interval.

Conflating them is the source of most of the temperature prediction errors that this module exists to prevent. A statement like "the gradient in this basin is 30 degC per km" sounds like a statement about the basin, and it is really a statement about one rock type in one interval of one well.

## Exercise

Two wells a few kilometres apart in the same basin sit over the same crust and receive the same heat flow at the base of their sediments. Well A logs a much steeper geothermal gradient over its measured interval than well B. Give a physical explanation that does not require the heat flow to differ, and say what you would need to know to test it.

Self check: the gradient is $Q/k$, so with $Q$ the same in both wells a steeper gradient in well A means a lower conductivity over the interval that was logged. A thick shale section in well A against a sandier or tighter section in well B would do it, and so would higher porosity in well A, because water conducts heat poorly and a more porous rock therefore has a lower effective conductivity. To test it you need the lithology and the porosity over the logged interval in both wells, so that you can estimate conductivity for each, and you need to know that the two gradients were measured over comparable depth ranges rather than one shallow and one deep.
