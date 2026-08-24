# Onward to Professional

This tier taught two things and taught them completely. You learned that porosity falls with depth on the Sclater-Christie curve, so shale with phi0 0.63 and c 0.00051 per m holds 0.63 at the surface, 0.37831221465172754 at 1000 m and 0.22717481230903933 at 2000 m. You learned that what survives burial is grain, so 100 m of fresh surface shale is 38.57953418711555 m of solid and the rest is pore, and a 100 m shale found at 1000 m carries 63.11728183077296 m of grain that restores to 159.79553483785466 m at the surface. You learned that a heat column is a boundary value problem, so the golden fixture is exactly $T = T_s + Qz/k$ layer by layer, giving 11.666666666666671 degC at 50 m, 41.66666666666673 degC at 950 m and 59.619047619047684 degC at 1950 m, with a gradient of 33.333333333333336 degC per km above the conductivity break and 17.142857142857142 degC per km below it.

That is a complete skill and it is deliberately narrow in one direction. Everything you built is a snapshot. There is no clock anywhere in it. The two tiers above put the clock in, and it is worth knowing what they do with it before you decide whether to climb.

## Professional: the clock and the thermometer

The Professional tier runs the Sweeney-Burnham Easy%Ro integrator and the Type II kerogen clock over a temperature history.

Easy%Ro is a published kinetic scheme that turns a temperature history into a vitrinite reflectance, and the kerogen clock turns the same history into a transformation ratio, the fraction of the kerogen that has reacted. Both are integrals along a track rather than functions of a single temperature, which is why this tier had to teach you to produce a track.

The headline of that tier is a result that looks wrong until you understand it. Two rocks are heated to 150 degC, one on a ramp of 3 degC per Ma and one on a slower ramp of 1 degC per Ma. Compared at the same 150 degC, the slow rock is the more mature of the two. It took three times as long to arrive and it collected reaction at every temperature on the way. Time is a reagent, and the Professional tier is where you get to see that written as numbers instead of asserted.

Two things you already know become load bearing there. A burial history built without decompaction places the old layers too shallow and therefore too cool, and the integrator will faithfully turn that geometry error into a maturity error. And the steady column you can check by hand is the sanity anchor for the transient columns that tier solves.

## Expert: the kitchen and the erosion signature

The Expert tier runs the full forward model on the golden reference basin: four layers over 150 Ma, a heat flow that cools from 80 to 60 mW/m2, and a 600 m erosion event at 10 Ma.

Running it forward gives the source shale at present day as a reflectance, a temperature, a transformation ratio and, past maturity, a mass of hydrocarbon generated and a mass expelled in kg/m2. That last pair is the charge, which is the number a prospect has been waiting for since the first lesson of this course.

Then the tier does something this course cannot. It runs the same basin again with the erosion event removed and compares the two answers. The difference in final reflectance between the two runs is the erosion signature, a delta Ro of 0.0567, and it is a measurement of what the missing 600 m did to the source rock. Recovering a number for a thing that is no longer there, by running the model twice, is a good picture of what a basin model is for.

Notice that the erosion event only means something because the tier is transient. A steady solver has nothing to say about a column that is still adjusting to cover being stripped off it, which is the fourth omission from module five doing its work two tiers up.

## The shape of the ladder

Put the three tiers in one line. The Beginner tier builds burial and heat on fixtures, in steady state, checkable by hand. The Professional tier puts a clock into that and reads maturity. The Expert tier runs the whole basin forward through its own history and reads charge.

Each tier makes the one below it more demanding rather than replacing it. A reflectance is only trustworthy if the burial curve under it conserved grain, so module three matters more at the Professional tier, not less. An erosion signature is only readable if the heat column it came from is right, which is module four doing work two tiers up.

## The ladder closes here

This is the last Associate course in the geoscience path, and the tenth of ten.

Well Data Manager settled the depths. Petrophysics read the rock at those depths. Well Correlation named the layers. Seismolord and Mapping carried them across the basin. ReservoirCalc Pro turned containers into volumes. Rock Physics explained why rock properties move as porosity falls. Pore Pressure worked the fluid side of that same compaction. Earth Modeling put every piece into one frame. This course asked how the basin got that way.

Nine courses described the subsurface as it is. This one described how it came to be, which is the only order those two questions can be asked in. If you go on from here, the whole geoscience path is behind you, and every higher tier you take builds on a foundation you have already tested by hand.

## Exercise

Write one sentence for each tier saying what it does that the tier below it cannot. Then answer in two sentences: at 150 degC, which heating ramp leaves a rock more mature and why, and what is the erosion signature of the reference basin?

As a self check: this tier builds burial and heat on fixtures in steady state, giving 38.57953418711555 m of grain in 100 m of surface shale, a restored 159.79553483785466 m for the layer from 1000 m, 0.22717481230903933 v/v at 2000 m and a column running from 11.666666666666671 degC at 50 m to 59.619047619047684 degC at 1950 m; the Professional tier adds the Sweeney-Burnham Easy%Ro integrator and the Type II kerogen clock and reads maturity from a history; and the Expert tier runs the four-layer reference basin forward over 150 Ma with a cooling 80 to 60 mW/m2 heat flow and a 600 m erosion event at 10 Ma, reading generation and expulsion. At 150 degC the slower 1 degC per Ma ramp leaves the rock more mature than the 3 degC per Ma ramp, because it spent longer reaching that temperature and reaction accumulates over time. The erosion signature is a delta Ro of 0.0567, recovered by rerunning the basin without the erosion event and differencing the two final reflectances.
