# Why seismic lives in time

A seismic survey is a listening exercise. A source puts energy into the ground at a known instant, and a receiver at the surface records how the ground moves after that instant. What gets written to disk is a list of ground motion values against elapsed time. Nothing in that recording is a depth. Depth is not measured by a seismic survey at all; it is inferred afterwards, and only if you are willing to make an assumption about velocity.

## What the instrument actually records

Energy leaves the source, travels down to an interface, reflects, and travels back up to a receiver. The receiver knows two things about that event: how strong the returning motion was, and how long after the shot it arrived. It does not know how deep the interface was, because the same arrival time could come from a shallow interface with slow rock above it or a deep interface with fast rock above it. Time and depth are related through velocity, and velocity is not something the receiver measures.

So the native axis of a seismic trace is two-way travel time, written in milliseconds. Every seismic display you open, every horizon pick you make on raw data, and every amplitude extraction starts life on that axis. Depth arrives later, as an interpretation product, not as a measurement.

## The circularity that sets the convention

The obvious response is to convert straight to depth and be done with it. Try to do that at the start of a project and you run into a genuine circle.

To turn a travel time into a depth you need to know the velocity of every layer the energy passed through. To know the velocity of a layer you need to know where that layer is, how thick it is, and what rock it is made of. Those are exactly the things an interpretation is supposed to produce. Before you have interpreted the survey you do not have a reliable velocity model, and before you have a velocity model you cannot honestly convert to depth.

Processing does produce velocities as a by-product of stacking, but those are tuned to flatten reflections rather than to describe rock. They are good enough to build an image, not good enough to hang a depth on.

The industry resolves the circle by ordering the work. Interpret in time first. Pick horizons, map faults, define closures, all on the time axis where the data actually lives. Then build a velocity model using everything you have learned, including the wells, and convert to depth as a deliberate final step whose errors you can inspect. Reversing the order does not remove uncertainty; it hides it inside a depth image that looks authoritative.

## What this means for the tie

Now put a well next to that survey. A wireline tool is lowered on a cable, and every sample it records is stamped with a depth. Tops are called in metres. Nothing in the well is naturally expressed in travel time.

So the tie has an axis problem before it has anything else. The well says 1500 metres. The seismic says 1582 milliseconds. Those two numbers cannot be compared, cannot be plotted on the same track, and cannot be checked against each other until one of them is moved into the other's world.

The synthetic seismogram performs that move, and the direction it moves in matters. A synthetic is built from well curves but computed and displayed in time. Depths are converted to two-way time, rock properties become reflection coefficients on that time axis, and a wavelet is applied there. The finished synthetic is a trace in milliseconds that can be laid directly beside a real seismic trace in milliseconds, with no further translation.

That is a deliberate choice. The alternative, converting the seismic into depth so the well can be compared in metres, would require the velocity model you do not yet have, which is the same circle again.

## The asymmetry worth remembering

Depth to time and time to depth are not equally forgiving.

Going from depth to time, you already know where you are. The well gives you the depths, and the velocity model only has to describe rock you have already penetrated and logged. Errors are local, they are bounded, and a checkshot survey can measure the answer directly.

Going from time to depth, every error in the velocity model is multiplied by the travel time and turned into a depth error. A velocity two percent too fast puts a horizon at 3000 metres roughly sixty metres too deep, and that error is systematic across the whole map rather than random. Depth conversion inherits every weakness of the model it is given, and it inherits them silently, because the resulting depth map looks exactly as crisp as a correct one.

That asymmetry is why this module works in the easy direction. Building a synthetic only ever asks you to go from depth to time.

## Exercise

Write down, in one sentence each, the two quantities a seismic receiver actually records, and then state what third quantity you would need in order to convert one of them into a depth. As a self-check: the receiver records the strength of the returning ground motion and the elapsed time since the shot, and the missing quantity is the velocity of everything the energy passed through. Then answer in two sentences why the industry interprets in time and converts at the end, and why the synthetic is built in time rather than the seismic being converted to depth.
