# Why burial history needs it

Decompaction is fiddly, it needs an iteration, and it produces thicknesses that nobody ever measured. It is fair to ask whether it earns its place. This lesson makes the case, and in doing so it hands the course over to module 4.

## The chain

A basin model is a chain of dependencies, and it is short enough to write out.

Geometry gives you depth. For any layer and any past moment, the reconstructed column says how deep that layer was then.

Depth gives you temperature. Module 4 shows that in a conducting column the temperature at a point is set by the surface temperature, the heat flow and the depth, so a depth history becomes a temperature history.

Temperature and time give you maturity. Kerogen reacts at a rate that depends on temperature, and the reaction integrates over time, so a temperature history becomes a maturity history. That is Professional tier work.

Maturity gives you charge. Once enough of the kerogen has reacted, oil and then gas are generated and eventually expelled into a carrier. That is Expert tier work.

Every link in that chain takes the output of the one before it as input. There is no route into the chain that skips the first link. If the depth history is wrong, everything downstream inherits the error, and no amount of care in the kinetics can recover from it.

## What skipping decompaction actually does

Suppose you build a burial history by taking present-day thicknesses and stacking them, moving layers up as younger layers are stripped off but never regrowing them. This is the shortcut, and it is easy to do by accident.

Consider the shale from the last two lessons. Today it is 100 m thick with its top at 1000 m. At the moment it finished being deposited it was 159.79553483785466 m thick and its top was at the surface. Every layer below it in the stack was correspondingly thicker too, because they were all shallower and less compacted then than they are now.

The shortcut gets that wrong in a consistent direction. Because it uses compacted thicknesses everywhere, the reconstructed column is always thinner than the real one, so every layer is placed shallower in the past than it really was. The error is not a small correction, either. The layer above has lost 37.42 percent of its original thickness, and a whole stack of layers each carrying a loss of that order adds up to hundreds of metres of missing burial for a deep horizon.

There is a second, subtler consequence. The shortcut does not merely shift the burial curve down by a constant, it changes its shape. Because compaction is fastest in the first kilometre, the layers that are shallow at a given past moment are the ones whose thickness is most understated. So the reconstructed history is wrong by a varying amount that depends on where every layer sat at the time, and the burial curve comes out both too shallow and too flat in its early part.

## Why the shape matters more than the offset

A depth error becomes a temperature error, and the size of the temperature error follows from module 4. In the golden fixture a temperature of 41.66666666666673 degC sits at 950 m in a layer with conductivity 1.8 W/m/K, and the gradient there is 33.333333333333336 degC per km. In a column like that, a few hundred metres of missing burial is worth several degrees Celsius, and it is worth those degrees at every moment of the history rather than at one instant.

Several degrees may sound survivable. It is not, once the chain reaches kinetics, because the reaction rates that govern maturity depend on temperature exponentially. A source rock that spent 40 million years at one temperature and a source rock that spent 40 million years a few degrees cooler are not the same rock at the end of it. The Professional tier makes this concrete with the Easy%Ro integrator, whose results turn on the shape of the heating path and not only on the temperature eventually reached.

That is why the flattening introduced by the shortcut is worse than a simple offset. It distorts the rate at which the source heated, which is precisely the quantity the maturity calculation is sensitive to. The model can then get today's temperature roughly right and still put the onset of generation tens of millions of years away from where it belongs. Timing is the whole point of a basin model, because a source that charged before its trap existed has charged nothing.

## The join to module 4

Module 3 has now given you a reconstructed column: for any past moment, how thick every layer was and how deep every layer sat. That is the input module 4 needs, and module 4 supplies the second link in the chain, which is the step from depth to temperature.

Module 4 does that step in the simplest setting that is still honest, a steady state column with no internal heat production, where the answer is exact arithmetic you can do on paper. It introduces heat flow and thermal conductivity, works the golden two-layer fixture, and arrives at the result that most changes how people read a temperature log. Hold onto one sentence from this module while you read it: the depths going into that arithmetic are decompacted depths, and if they are not, the temperatures coming out are wrong before the heat physics is even reached.

## Exercise

A colleague shows you a burial history built from present-day thicknesses, with no decompaction anywhere, and argues that it does not matter because the layer of interest is at its deepest today and today's depth is measured rather than reconstructed. Write down whether today's temperature is affected, whether the history is affected, and which of the two the study needs.

Self check: today's temperature is essentially unaffected, because today's depth is the logged depth and no reconstruction is involved in it. The history is badly affected, because at every earlier moment the layer is placed shallower than it really was, and the error grows with the amount of section above it that has since compacted. The study needs the history. A basin model exists to say when the source passed through the temperatures that matter, and that timing is read from the path rather than from the endpoint, so a model that is right only about today has answered a question nobody asked.
