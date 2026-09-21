# Three properties, three bases

The Kano plant in this course stores LPG and bottles it into cylinders. The plant and every figure attached to it are invented for teaching. Before the vessel, the vaporizer or the carousel can be sized, the plant needs three properties of its blend: a liquid density, a latent heat and a molar mass. `lpgBlendProperties` returns all three, and it prints beside each one the basis it blends on.

{{panel:gasvalue-rollout-explorer}}

## The table the engine ships

The engine exports LPG_REFERENCE, one row for each component:

| code | label | molar mass kg/kmol | typical liquid density kg/m3 | range | typical latent heat kJ/kg | range | typical boiling point C |
| --- | --- | --- | --- | --- | --- | --- | --- |
| propane | Propane (C3H8) | 44.096 | 508 | 500-515 at 15 C | 425 | 410-430 at atmospheric boiling | -42 |
| butane | n-Butane (C4H10) | 58.122 | 584 | 575-590 at 15 C | 385 | 370-395 at atmospheric boiling | -0.5 |

The engine attaches a note to this table: "Typical values only, offered as a starting point. Liquid density, latent heat and calorific value vary with the product and the supplier; the certificate of quality is the authority." Every figure below is computed on those typical rows. The ranges are printed beside each typical figure, and the engine computes on the typical figure.

## Kano's blend, and the studio's

KANO's blend is typed by liquid volume: propane 0.35 and butane 0.65. The LPG & CNG Rollout Studio opens on a second blend, propane 0.4 and butane 0.6. The engine returns:

| blend | densityKgM3 (basis) | latentHeatKJkg (basis) | molarMassKgKmol (basis) | propane mass fraction | butane mass fraction |
| --- | --- | --- | --- | --- | --- |
| KANO | 557.4000 (volume) | 397.7592 (mass) | 52.7681 (mole) | 0.3190 | 0.6810 |
| studio opening blend | 553.6000 (volume) | 399.6821 (mass) | 52.0456 (mole) | 0.3671 | 0.6329 |

Read the brackets first. KANO's density, 557.4000 kg/m3, carries the word volume. Its latent heat, 397.7592 kJ/kg, carries the word mass. Its molar mass, 52.7681 kg/kmol, carries the word mole. Three properties of one blend sit on three different bases, and the engine names each.

## The rule in one line

The engine's rule reads: density blends on volume; latent heat per kilogram blends on mass, through the mass fractions the densities give; molar mass blends on moles.

So the volume fractions the plant types go straight into the density. The latent heat waits for a second step. The engine first turns the volume fractions into mass fractions with the two liquid densities, and those are the last two columns of the table. For KANO they print as 0.3190 propane and 0.6810 butane, from volume fractions of 0.35 and 0.65. For the studio's blend they print as 0.3671 and 0.6329, from 0.4 and 0.6. The molar mass takes a third route, on moles.

## The shortcut the engine does not take

KANO's latent heat averaged on the volume fractions would be 399.0000 kJ/kg. That reading is 1.2408 kJ/kg from the engine's 397.7592 kJ/kg. It is the shortcut the engine does not take. The engine blends latent heat per kilogram on mass, and it prints the word mass beside the figure.

## What the blend refuses

| probe | engine |
| --- | --- |
| a blank butane volume fraction | REFUSED: Every component needs a volume fraction. |
| a butane liquid density left blank | REFUSED: A liquid density is required for every component; it is not assumed. |
| a negative volume fraction | REFUSED: A volume fraction cannot be negative. |

A blank fraction is refused. A blank density is refused, and the engine's own sentence says the density is not assumed. In the explorer, clear the butane density on KANO's blend and read the refusal; then type 584 again and read 557.4000 kg/m3 return.

## Exercise

Read KANO's row: 557.4000 (volume), 397.7592 (mass), 52.7681 (mole), with mass fractions 0.3190 and 0.6810. Then read the latent heat averaged on the volume fractions, 399.0000 kJ/kg, and the printed gap of 1.2408 kJ/kg from the engine's. Say which basis each property blends on according to the engine's rule, which two columns the latent heat is blended through, and what the printed gap of 1.2408 kJ/kg shows about reading the latent heat on volume.
