# Why rock physics

A reservoir gets measured twice, in two ways that have almost nothing in common.

The first measurement goes down the hole. A logging tool sits a few centimetres from the formation and reports porosity, water saturation, shale volume and a bulk density. It is a contact reading, and it covers a cylinder of ground a few tens of centimetres across, along one vertical line.

The second measurement is made from the surface or from a boat. A seismic survey puts energy into the earth and records what comes back. It covers tens of square kilometres at once, and at every point in that volume it reports one quantity: an amplitude, a number describing how strongly energy reflected from an interface at that arrival time.

Petrophysics gave you the first. Seismic interpretation gave you the second. Neither can be turned into the other by arithmetic, because they are not measurements of the same thing. Porosity is a fraction of void space. Amplitude is a contrast in acoustic impedance across a boundary. Rock physics is the model that connects them, and it is the only thing in the workflow that does.

## A bright amplitude on its own means nothing

Consider what an interpreter actually has in front of them. A reflection is unusually strong over part of a mapped structure. The asset wants to know whether that brightness is gas.

Each of the following will brighten that reflection:

- gas filling some of the pore space
- higher porosity in the same sand
- a cleaner sand, with less clay in the frame
- a harder shale sitting above an unchanged reservoir
- a thin bed tuning constructively at the seismic wavelength

That is five candidate explanations, one of them commercial and four of them not, with no way to rank them from the amplitude alone. A bright spot without a model is a bright spot. It is not a discovery, and every basin has a history of wells drilled as though it were.

Rock physics turns that ambiguity into something testable by running the question in the other direction. Given a rock with this porosity, this mineral frame and this fluid, at these temperature and pressure conditions, what velocity and density should it have, and therefore what reflection should it produce? Once you can predict an amplitude for each candidate rock, the observed amplitude starts to select between them.

## The bridge has a fixed shape

Every rock physics workflow, at every tier, has the same three storeys.

At the bottom are the fluids. Brine, gas and oil each have a density and a bulk modulus at the reservoir conditions, and none of those values is a constant. Module 2 builds all three for the Ekene SAND.

In the middle is the rock frame. The minerals that make up the grains have their own moduli, and the way they are mixed sets what the solid part of the rock can do. Module 3 builds that frame.

At the top is the combination. A rock is a frame with fluid in the pores, and the elastic properties of the whole are not the average of the parts. Wood's equation, in module 4, mixes the pore fluids with each other. Gassmann's equation, at the Professional tier, puts that mixed fluid into the frame and returns the velocity and density of the saturated rock. That saturated rock is what the seismic wave meets.

Only after all three storeys are in place does an amplitude become interpretable. The Associate tier of this course builds the bottom two storeys and the fluid mixing, carefully and with real numbers, so that the substitution step at the next tier has something honest to stand on.

## The numbers this course lives on

The setting is the Ekene SAND at 60 degC and 25 MPa, and by the end of module 4 you will have produced six values from it. Two of them are worth seeing now, because the whole argument of the course sits between them.

The brine in the pores has a bulk modulus of 2.6978112899395996 GPa. The gas at exactly the same temperature and pressure has a bulk modulus of 55.71865290286663 MPa. Note the change of unit. The brine is 48.42 times stiffer than the gas.

That single ratio is why seismic can see fluids at all. If gas and brine had similar moduli, replacing one with the other would barely change the rock, the reflection would barely change, and no amount of processing would recover a saturation. The gap is enormous, so a modest amount of gas produces a large and detectable change. The rest of the course is a careful account of how large, and under what conditions.

Set against that, the mineral frame of the same sand has a bulk modulus of 30.87940062475596 GPa, which is more than a thousand times the gas value. The rock is stiff and the fluid is soft, and the interesting question is how much the soft part can move the stiff part.

## What this tier does and does not do

At Associate level you build ingredients and learn to read them. You compute the three fluids at stated conditions, you mix the mineral frame and see how well constrained each modulus is, and you mix brine with gas in the pore space using Wood's equation.

You do not run Gassmann fluid substitution. That belongs to the Professional tier, and it is deliberately held back, because substitution performed on ingredients you do not understand produces confident numbers that are wrong in ways you cannot see. Every argument the Professional tier makes about a bright spot depends on the fluid moduli you are about to compute. Get them right first.

## Exercise

Write down, in your own words, the two measurements that rock physics stands between, and what each one actually reports. Then list the five things that could brighten a seismic reflection, and say in one sentence why an interpreter with only an amplitude cannot choose between them.

Self check: the two measurements are the well log, which reports rock properties such as porosity and saturation over a small volume along one borehole, and the seismic survey, which reports an amplitude, a contrast in acoustic impedance, over a large volume. The five brightening mechanisms are gas in the pores, higher porosity, a cleaner and less shaly frame, a harder overlying shale, and thin bed tuning. An amplitude alone cannot separate them because it is a single number produced by a combination of causes, so the interpreter needs a model that predicts an amplitude for each candidate rock before the observed value can distinguish between them.
