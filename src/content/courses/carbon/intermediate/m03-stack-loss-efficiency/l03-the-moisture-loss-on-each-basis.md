# The moisture loss on each basis

Lesson two found the same Isiokpo heater at 86.4029 percent on LHV and 77.9288 percent on HHV. The two rows share a fuel, a stack and an oxygen reading. This lesson reads the one loss the engine explains differently on each basis: the moisture loss.

{{panel:carbon-efficiency-explorer}}

## The four rows

SECTION 13 prints the invented Isiokpo heater at its current reading of 5.5 percent oxygen and its target of 2.8 percent, each on both bases:

| case | basis | excess air percent | dry flue gas loss | moisture loss | radiation | unburned | total loss percent | efficiency percent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| current, 5.5 percent O2 | LHV | 32.1223 | 9.9883 | 1.8088 | 1.8000 | 0.0000 | 13.5971 | 86.4029 |
| target, 2.8 percent O2 | LHV | 13.9199 | 8.5436 | 1.8088 | 1.8000 | 0.0000 | 12.1524 | 87.8476 |
| current, 5.5 percent O2 | HHV | 32.1223 | 9.0262 | 11.2450 | 1.8000 | 0.0000 | 22.0712 | 77.9288 |
| target, 2.8 percent O2 | HHV | 13.9199 | 7.7207 | 11.2450 | 1.8000 | 0.0000 | 20.7657 | 79.2343 |

On LHV the moisture loss is 1.8088 percent. On HHV it is 11.2450 percent. On each basis it prints the same figure at 5.5 percent and at 2.8 percent oxygen.

## What the engine says about each

SECTION 13 prints the engine's moisture note on each basis. On LHV, verbatim: "On LHV only the sensible heat of the water vapour is a loss, because LHV never counted the latent heat as available."

On HHV, verbatim: "On HHV the latent heat of the water made from hydrogen is a loss, because HHV counted it as available."

Read side by side, the two notes turn on one word, available. LHV never counted the latent heat as available, and on LHV only the sensible heat of the water vapour is a loss. HHV counted it as available, and on HHV the latent heat of the water made from hydrogen is a loss. Each basis counts as lost what it counted as supplied, and the two notes say so in the engine's own words.

## What each loss is built from

The moisture the loss is built on is the water of module one, weighed. SECTION 13 prints moistureKgPerKmolFuel at 5.5 percent oxygen as 36.6245 kg per kmol of fuel. The properties are the engine's typical values from SECTION 1: a water vapour cp of 1.95 kJ/kg K and a latent heat of 2442 kJ/kg at the 25 C reference. The vapour cp prices the sensible heat on both bases. The latent heat enters only on HHV.

That is also where SECTION 13's refusal sits. Asked for an HHV efficiency with no latent heat, the engine answers: "REFUSED: On a higher-heating-value basis the moisture loss needs both the latent heat of water and the vapour specific heat." There is no HHV moisture loss without the latent heat, and the engine does not supply one.

## Why the moisture loss does not move with the oxygen

Module one printed the water the Isiokpo fuel makes per kmol of fuel: products.h2oPerKmolFuel 2.033000. In practice, the water in the flue gas comes from the fuel's hydrogen and excess air brings air to the stack with no water in it, which is why the four rows print one moisture loss per basis at both oxygen readings while the dry flue gas loss changes: 9.9883 to 8.5436 percent on LHV, 9.0262 to 7.7207 percent on HHV.

## Exercise

Read the moisture loss in all four rows of SECTION 13 and the engine's two moisture notes. Say what the moisture loss does between the current and target rows on each basis, and which property of the flue gas the HHV loss counts that the LHV loss does not.
