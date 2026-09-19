# Three terms of vaporizer duty

KANO's plant turns liquid LPG into vapour in a vaporizer. `vaporizerDuty` sizes the heat that takes. It builds the duty from three terms, prints each one with its share, and adds a design margin on top. This lesson reads the three terms on KANO's vaporizer.

{{panel:gasvalue-rollout-explorer}}

## KANO's vaporizer

The inputs, all invented for the course: 650 kg/h of the blend, with a latent heat of 397.7592 kJ/kg from the blend on mass. The liquid comes in at 18 C, with a liquid heat capacity of 2.45 kJ/kg K. It boils at 38 C at the vaporizer's pressure. The vapour goes out at 55 C, with a vapour heat capacity of 1.68 kJ/kg K. The design margin is 15 percent.

The latent heat is the figure the blend lesson met: 397.7592 kJ/kg, blended on mass.

## The three terms

| term | kW | share of the duty |
| --- | --- | --- |
| Warm the liquid to boiling | 8.8472 | 0.1031 |
| Boil it | 71.8176 | 0.8368 |
| Superheat the vapour | 5.1567 | 0.0601 |
| dutyKW | 85.8215 | 1.0000 |
| designDutyKW (with the margin) | 98.6948 |  |

Warm the liquid to boiling takes the liquid from 18 C to the boiling point, 38 C. Boil it turns the liquid to vapour at that boiling point. Superheat the vapour takes the vapour from 38 C to the outlet, 55 C.

Their kW are 8.8472, 71.8176 and 5.1567. Their shares of the duty are 0.1031, 0.8368 and 0.0601. The dutyKW row prints 85.8215 kW with a share of 1.0000.

## The share column

Read the share column. Boil it prints 0.8368. Warm the liquid to boiling prints 0.1031 and Superheat the vapour prints 0.0601. The three shares sit beside the dutyKW row's 1.0000.

The vaporizer here was run on the engine's latent heat, 397.7592 kJ/kg on mass. The blend lesson printed the volume average of KANO's latent heat, 399.0000 kJ/kg, as the reading the engine does not use.

## The design margin

dutyKW is 85.8215 kW. designDutyKW, with the margin, is 98.6948 kW. The margin is the 15 percent typed, and the engine prints the design duty as its own row. A negative margin is refused:

| probe | engine |
| --- | --- |
| a design margin of -5 percent | REFUSED: The design margin cannot be negative. |
| no latent heat | REFUSED: A latent heat of vaporisation is required; it is a property of the product and is not assumed. |

The second refusal is the latent heat again. With no latent heat the engine gives no duty, and its sentence says the latent heat is a property of the product and is not assumed.

## When a term cannot be computed

The next lesson reads the boiling point closely. One result from it is read here as well. With the boiling point left blank, the engine gives the boil alone: dutyKW 71.8176, with missingTerms naming Warm the liquid to boiling and Superheat the vapour. The engine's note lists those two missing terms and says that the duty covers only the terms supplied. It calls the figure a floor on the duty. The full duty on KANO's inputs is the 85.8215 kW above.

In practice, a vendor sizing a vaporizer reads the design duty against the unit's rated capacity.

## In the explorer

Open KANO's vaporizer. Read the three terms, their shares and the design duty. Set the margin to 0 and read designDutyKW; set it to -5 and read the refusal. Then clear the boiling point and read dutyKW and missingTerms.

## Exercise

Read KANO's three terms: 8.8472, 71.8176 and 5.1567 kW, with shares 0.1031, 0.8368 and 0.0601, dutyKW 85.8215 and designDutyKW 98.6948. Say which temperatures bound each term, what share the engine prints for Boil it, and what the engine returns for dutyKW when the boiling point is blank.
