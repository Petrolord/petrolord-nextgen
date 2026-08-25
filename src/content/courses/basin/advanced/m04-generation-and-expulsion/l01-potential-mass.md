# Potential mass

Everything with units of mass in this model descends from one closed-form number: the source rock's generative potential per square metre of basin. This lesson derives it by hand, because the capstone's generated mass is this number times a TR you already understand.

## The formula

$$M_{pot} = \rho_{grain} \times H_s \times \frac{TOC}{100} \times \frac{HI}{1000}$$

Read it factor by factor. Grain density times solid thickness is the mass of solid rock per square metre of basin: the pore-free inventory, using solid thickness precisely because grain, not bulk volume, is what carries organic matter through compaction. TOC over 100 converts weight-percent organic carbon into a mass fraction. HI over 1000 converts the hydrogen index, milligrams of hydrocarbon per gram of organic carbon from laboratory pyrolysis, into hydrocarbon mass per organic carbon mass.

The result is the mass of hydrocarbon this source could generate if every bin of its kerogen spectrum emptied: the hundred-percent ceiling that TR is a fraction of.

## The fixture's number

For the reference source: grain density 2720 kg/m3, the shale library value; solid thickness 345.33834344581027 m from module 1's stack; TOC 4; HI 500.

$$M_{pot} = 2720 \times 345.33834344581027 \times 0.04 \times 0.5 = 18786.405883452077 \; \mathrm{kg/m^2}$$

Nearly nineteen tonnes of potential hydrocarbon under every square metre of this basin. The number is exact arithmetic from four stated inputs, and the panel carries it as a QC tile for exactly the reason the Associate tier carried closed forms: any corruption upstream, a wrong lithology, a wrong solid thickness, an HI typo, moves it, and it is checkable on paper.

## Why solid thickness, one more time

Use bulk thickness and the potential would change with burial: 400 m today, 728.8203220981025 m at deposition, the same rock. Organic matter does not appear or vanish as pores close, so the inventory must be written on the conserved quantity. This is the Associate tier's grain-conservation principle promoted from geometry into geochemistry, and it is why the potential is a constant of the run, computed once at initialisation from the present-day stack and never updated.

Notice also what the potential deliberately ignores: kerogen type. Type II appears in the kinetics, deciding how fast the potential converts, not in the potential itself, which is pure mass bookkeeping. The separation mirrors the Professional tier's two clocks: inventories and rates are different kinds of facts.

## What real numbers look like

Calibrate your sense of scale. TOC of 4 percent is a rich source; ordinary marine shales run 1 to 2. HI of 500 is good Type II; Type III woody material runs 150 to 300. A leaner source at TOC 2 and HI 300 in the same geometry would carry $2720 \times 345.33834344581027 \times 0.02 \times 0.3 = 5635.92$ kg/m2, thirty percent of the fixture's. Richness enters the charge linearly, twice over, which is why source-rock quality screening leads every exploration chain: no downstream sophistication recovers mass that was never there.

## Worked example

A well revision halves the source's TOC to 2 percent and thins its present thickness to 300 m. Recompute the potential. New solid thickness scales with the geometry: recomputing the stack, or proportionally for a quick estimate, 345.33834344581027 times 300 over 400 is approximately 259.0 m. Then $2720 \times 259.0 \times 0.02 \times 0.5 = 7044.9$ kg/m2, 37.5 percent of the original. Both revisions entered linearly; the quick proportional route on solid thickness is approximate because compaction is depth-dependent, and the honest route re-runs module 2's stack.

## Exercise

Write the formula and evaluate it for the fixture from memory. Then answer in one sentence each: why is the potential computed on solid rather than bulk thickness, and where does kerogen type enter the mass chain?

As a self check: $2720 \times 345.33834344581027 \times 0.04 \times 0.5 = 18786.405883452077$ kg/m2. Solid thickness because organic inventory rides the conserved grain, not the compacting bulk, so the potential stays constant through burial. Kerogen type never touches the potential; it enters through the kinetics as the spectrum that sets how fast, and at what temperatures, the potential converts.
