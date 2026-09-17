# What more equipment cannot buy

At some point another vessel stops being worth its foundations. This module will tell you where that point is, and it does so in two separate ways that a reader should keep apart.

{{panel:pw-train-explorer}}

## The first limit is the tail of the distribution

Take the OGBOTOBO inlet, which is wide at sigma 0.95, and put 8 identical devices on it, every one cutting at 4 micron. The train still leaves 36.154977 ppm, with the droplet median down at 1.700800 micron.

Eight devices. A cut size well below the inlet median. And the water is still carrying oil, because the fine tail of a wide distribution holds volume that no device in this module removes at all. The devices are working, and the thing they are working on has receded below them.

That is the shape of the coupling taken to its conclusion. Adding equipment moves you along a curve that is already flat, and a reader chasing single figures of ppm by adding equipment is chasing the wrong thing.

## The second limit is a floor this module does not carry

Every device here works on DISPERSED oil. Produced water also carries dissolved and soluble oil that none of these devices removes, so there is a floor under any outlet a train can reach. The engine says so on every train return, and it says the value is not its own to state.

That is a deliberate silence. No value for that floor is stated in this module, and none is stated in this course. A caller who has one passes it in, and the engine then reports both figures side by side so a reader can see which is which.

| what the caller gave | dispersed ppm | reported outlet ppm | floorApplied |
| --- | --- | --- | --- |
| no floor | 2.364977 | 2.364977 | no |
| a floor of 5 ppm | 2.364977 | 5.000000 | yes |

That row is a narrow inlet, 650 ppm at d50 26 micron and sigma 0.7, through one device cutting at 2 micron. The 5 ppm is the caller's number. The warning that arrives with it names the caller too: the dispersed oil falls below the floor the CALLER gave, so the outlet is reported at the floor.

## Two limits that do not meet

Notice that the two limits did not arrive together. On the wide water the dispersed prediction never gets near a dissolved oil floor, because the tail keeps the answer high. On the narrow water the dispersed prediction dives under a floor that the model cannot see without being told.

Which limit binds is a property of the inlet distribution. Knowing which one you are against is most of knowing whether more equipment is worth buying, and the two call for completely different responses. Against the tail you change the inlet, by attacking shear upstream or by chemical treatment this module does not carry. Against the floor you stop, because no equipment in this module addresses dissolved oil at all.

## Exercise

Run 8 identical 4 micron devices on the wide inlet and record the outlet. Then run one 2 micron device on the narrow inlet and record it.

Supply a floor to the second case and watch which figures move and which stay. Say which of the two reported numbers you would put in a report, and what you would write beside it.
