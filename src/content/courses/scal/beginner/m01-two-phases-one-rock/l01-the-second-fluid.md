# The second fluid

Every course before this one let you get away with a simplification: the pore space held oil, and the oil sat still or moved alone. Volumetrics counted it, material balance watched it expand, decline curves watched it leave. This course is about what happens when a second fluid moves through the same rock at the same time, because that is what a waterflood is: two fluids racing each other through pores a few microns wide.

The subject is called SCAL, for special core analysis, and it supplies the two property sets that every displacement calculation stands on. This tier covers the first set, relative permeability, and rides it all the way to a recovery forecast. The Professional tier covers the second set, capillary pressure.

## Saturation is bookkeeping

Take one cubic metre of the Ekene sand. Its pore space is a fifth of it, the locked porosity of 0.2 from the geoscience ladder. Inside that pore space live water and oil together, and the water saturation $S_w$ is simply the water's share of the pore volume:

$$S_w = \frac{\text{water volume}}{\text{pore volume}}$$

The oil saturation is the rest. With only two phases present the two shares must close:

$$S_w + S_o = 1$$

That closure looks trivial and it is the most used equation in this course. Every time a lesson says "the water saturation rose from 0.35 to 0.55" you should hear the unspoken second half: the oil saturation fell from 0.65 to 0.45, and the difference left through a well. Saturation change IS production, once you multiply by pore volume.

Notice what saturation does not say. It does not say where the fluids sit in the pore, how they are connected, or which of them can move. Two rocks at the same $S_w$ can behave completely differently. Saturation is a volume fraction, nothing more, and the whole reason relative permeability exists is that a volume fraction is not enough to predict flow.

## Wettability decides the geometry

Put water and oil in the same pore and they do not mix; a curved interface separates them. One of the two fluids preferentially sticks to the mineral surface, coating the grain walls and hiding in the finest corners. That fluid is the wetting phase, and in the Ekene sand, a clean quartz-rich sandstone, the wetting phase is water.

Water-wet geometry has consequences you can reason from directly:

- Water lines the grain surfaces and fills the smallest pores and crevices. Even in the oil column, a film of water is everywhere.
- Oil occupies the centres of the larger pores, the easy highways, because it was forced in against water's preference and took the widest openings first.
- When water later invades during a flood, it advances along the surfaces it already wets, and the oil it fails to reach gets cut off in pore centres as disconnected blobs.

Those trapped blobs are held by the same interfacial forces that made the rock water-wet in the first place. At the scale of a single pore the pressure difference across a curved oil-water interface is far larger than any viscous pressure gradient a field flood can apply, which is why a waterflood cannot simply push the last of the oil out. Some oil is stranded by geometry, not by impatience. Module 1 gives that stranded volume a name and a number in the next lesson.

## The race, previewed

Because both fluids occupy the same pore network, each one is in the other's way. The rock's plumbing must be shared, and the sharing is not proportional to saturation. A phase at low saturation occupies disconnected patches and barely flows at all; a phase at high saturation owns connected pathways and flows almost as if it were alone.

That sharing rule is exactly what relative permeability curves describe, and module 2 builds them properly. For now, hold the qualitative picture: as a waterflood raises $S_w$, water's ability to flow rises from nothing, oil's ability to flow falls toward nothing, and somewhere in between the two fluids move together. The arithmetic of that competition, one equation with the two curves and the two viscosities in it, is module 3, and its geometric consequence, a sharp front moving through the sand, is module 4.

## Worked example

A cell of the Ekene model holds 2500 cubic metres of pore volume, and its water saturation is the initial 0.35. Compute the fluid volumes.

Water: $2500 \times 0.35 = 875$ cubic metres. Oil: $S_o = 1 - 0.35 = 0.65$, so $2500 \times 0.65 = 1625$ cubic metres.

Now the flood arrives and the water saturation rises to 0.55. Water becomes $2500 \times 0.55 = 1375$ cubic metres, oil becomes $2500 \times 0.45 = 1125$ cubic metres. The oil that left is $1625 - 1125 = 500$ cubic metres, and it equals the water that arrived, $1375 - 875 = 500$. In an incompressible displacement the swap is barrel for barrel; that exchange rule is the backbone of everything module 4 derives.

## The misconception to avoid

Learners meet $S_w = 0.35$ and read it as "35 percent of the flow is water." Saturation is not a flow share. At the initial Ekene condition the water saturation is 0.35 and the water flow is exactly zero, because that water is the immobile film and corner water that wettability put there. The number that says what fraction of the flow is water is called the fractional flow, it depends on saturation through the relative permeability curves and the viscosities, and module 3 is devoted to it. Keep the two ideas separate now and the rest of the tier stays easy: saturation is where the fluids sit; fractional flow is what the fluids do.

## Exercise

A one cubic metre block of water-wet sand has porosity 0.2 and water saturation 0.4. First, compute the water and oil volumes in litres, and state what the oil volume becomes if a flood raises the water saturation to 0.6. Second, explain in two or three sentences why the water that was present at saturation 0.4 was not flowing, while the water added by the flood does flow. Use the words wetting phase, film, and connected pathway.
