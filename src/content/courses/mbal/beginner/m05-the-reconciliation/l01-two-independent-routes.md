# Two independent routes

Nobody has ever counted the barrels in a reservoir. Every oil in place figure that reaches a reserves report is an inference, and the whole credibility of the number rests on how it was inferred. This module is about the fact that our industry has two completely different ways of making that inference, and about what it means when they land on the same answer.

The first route measures the container. The second route measures what came out of it and how hard the remaining fluid pushed back. They are built from different data, gathered by different people, using different instruments, and they fail in different ways. That is the point.

## Route one: geometry

The volumetric route asks how big the oil-bearing rock is and how much oil each cubic metre of it holds. It is the route the geoscience ladder walks, and it produced the Ekene booking you are about to reconcile against. Its chain is a sequence of multiplications, and every factor comes from a different measurement.

Start with a mapped surface and a fluid contact. On Ekene the oil water contact sits at 1560 m TVD, and the volume of rock above that contact and inside the closure is the gross rock volume, 22269035.64453125 cubic metres, accumulated cell by cell across 169 oil-bearing cells of 100 m by 100 m. That number is the map. It comes from seismic interpretation, from depth conversion, and from the contact pick, and if any of those three moves, it moves.

Then narrow it. Not all of that rock is reservoir, so a net to gross of 0.8 gives 17815228.78109259 cubic metres of net rock. Not all of the net rock is pore space, so a porosity of 0.2 gives 3563045.809312045 cubic metres of pore volume. Not all of the pore space holds oil, because connate water occupies some of it, so a water saturation of 0.35 leaves a hydrocarbon pore volume of 2315979.7972902344 cubic metres. Those three factors come from logs and core, and each carries its own uncertainty.

Finally, convert. There are 6.2898 stock tank barrels of container per cubic metre, so the hydrocarbon pore volume is 14567049.7289961 reservoir barrels of oil at initial conditions. Reservoir barrels are not stock tank barrels, because oil shrinks on the way to the tank as its dissolved gas comes out of solution. Dividing by the initial oil formation volume factor of 1.2 rb/stb gives

$$\text{STOIIP} = \frac{14567049.7289961}{1.2} = 12139208.1074968 \text{ stb}$$

That is the geoscience booking for Ekene: 12139208.107496763 stb. Notice what went into it. A seismic surface. A contact depth. A cutoff. A log-derived porosity. A saturation. One fluid property. Not one single pressure measurement, and not one single produced barrel.

## Route two: thermodynamics

The material balance route never looks at a map. It asks a different question entirely: when you took 261475.039999678 stb out of this tank, the pressure fell from 3200 psia to 2096.00826266700 psia, so how much oil must have been down there for a drop that size to be the consequence?

You have built this chain over four modules. Underground withdrawal $F$ says how much reservoir volume left the tank. Total expansion $E_t$ says how much reservoir volume each stock tank barrel of oil in place, together with its share of rock and connate water, gave back per unit of pressure drop. The tank balances when

$$F = N \, E_t$$

and $N$, the oil originally in place, is the slope of $F$ plotted against $E_t$. On Ekene that slope is 12139208.1074968 stb.

Look at what went into that. Six pressure surveys. Six cumulative production readings. Oil formation volume factors along the pressure path. A rock compressibility of 0.000004 per psi and a water compressibility of 0.000003 per psi. No map, no contact, no seismic, no net to gross, no porosity, and no reservoir area at all. You could compute this number knowing nothing whatsoever about the shape of the field.

## What each route can and cannot see

They are not just different arithmetic. They see different things, and that matters more than the algebra.

Volumetrics sees every barrel inside the mapped closure, whether or not it is connected to your wells. A sealing fault, a low permeability streak, a compartment your producers never drained: volumetrics counts it all, because it is measuring rock, not flow.

Material balance sees only the volume that is in pressure communication with your wells over the period you surveyed. Oil in a disconnected compartment never expands into your withdrawal, so the slope never learns it is there. Material balance is measuring a connected, dynamic thing.

This asymmetry is the single most useful fact in the whole module. It means that when the two routes disagree, the disagreement usually has a direction, and the direction is diagnostic rather than embarrassing. Lesson 3 works that out properly.

## The honest small print

It is tempting to say the two routes share nothing at all. Almost true, and the "almost" is worth knowing before you claim independence in front of an auditor.

Two quantities appear in both chains. The initial oil formation volume factor of 1.2 rb/stb divides the volumetric hydrocarbon pore volume, and it also sits inside the material balance expansion terms as $B_{ti}$. The initial water saturation of 0.35 sets the volumetric oil share of the pore space, and it also sits in the rock and connate water expansion term through the group $(1 - S_{wi})$. Everything else is genuinely disjoint.

So the correct claim is this: the two routes share two fluid and saturation constants and share no measurements. If the laboratory got $B_{oi}$ wrong, both routes move together and their agreement proves less than it looks. That is not a reason to distrust the reconciliation. It is a reason to know exactly what you are asserting when you present it.

## Worked example

Rebuild the volumetric booking yourself, in four multiplications and one division, from the numbers above. Take the gross rock volume, apply net to gross, apply porosity, apply the oil share of the pore space, convert to barrels, and shrink to stock tank conditions:

$$22269035.64453125 \times 0.8 \times 0.2 \times (1 - 0.35) \times 6.2898 \div 1.2$$

Work it on a calculator. You will land within a barrel of 12139208.1074968 stb. The tiny residual is because the fixture accumulated its net, pore and hydrocarbon pore volumes cell by cell rather than by scaling the gross volume once, so the committed hydrocarbon pore volume of 2315979.7972902344 cubic metres is the value to use if you want the booking to the last decimal. Starting from that value, 2315979.7972902344 times 6.2898 divided by 1.2 gives 12139208.1074968 stb exactly.

## Exercise

Suppose the petrophysicist revisits the net to gross cutoff and drops it from 0.8 to 0.7, with everything else unchanged. Compute the new volumetric STOIIP by scaling: you should get 10621807.0940597 stb, which is 12.5 percent lower. Then answer the question that matters: does the material balance answer of 12139208.1074968 stb change at all when the cutoff is revised? Write one sentence saying why not, and keep it. The next two lessons are built on the reason.
