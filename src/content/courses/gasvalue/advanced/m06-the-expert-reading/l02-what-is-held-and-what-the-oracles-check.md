# What is held and what the oracles check

This lesson gathers the four limits this course holds, the figures the engines pin without validating, and what the validation oracles check independently.

## Four held limits

These are taught as stated limits and are never computed with.

First, the flare efficiencies have no default. The rule's tiered defaults are a United States rule, and the basis for a Nigerian study is a regulation reading. The Associate tier met this when abatement refused a blank destruction efficiency.

Second, an unlit flare is not modelled. Gas sent to an unlit flare is vented, all of it methane. The engine's flare is lit.

Third, fill limits by code (NFPA 58, EN or NUPRC practice) are not shipped. The limit is a safety code value, typed by the site with its basis. This tier met it on KANO's vessel, where a blank fill limit is refused: "REFUSED: A maximum fill ratio is required and is not defaulted. It is a code limit for the product and the vessel: LPG expands and a vessel filled liquid-full ruptures hydraulically." KANO's two fill limits, 0.85 on liquid_volume and 0.42 on water_capacity_mass, are illustrative, and neither is a code value.

Fourth, GWP values and credit prices are case inputs. The Associate tier's CO2e and the Professional tier's credit tests used them as typed.

The course does not say which efficiency tier applies, which code's fill limit a vessel takes, which GWP edition a study should use, or what a credit sells for.

## Pinned and unvalidated

Some figures are pinned in the engines and the oracles do not validate them: the component heating values and liquid densities, the typical LPG densities and latent heats, the DAK and Sutton coefficients, the form of the rule's equations as their variable definitions fix it, and water at 15 C for a filling density.

This tier used several. The LPG_REFERENCE densities (508 and 584 kg/m3) and latent heats (425 and 385 kJ/kg) are typical figures, and the engine's note says the certificate of quality is the authority. The DAK and Sutton coefficients give every Z on IBAFO's banks. The water at 15 C is the WATER_KG_M3 of 999.1 kg/m3 that weighs a vessel's water capacity.

## What the oracles check

The validation oracles, oracle_flaretovalue.py and oracle_lpgcng.py, check the engines independently. Their list:

- the gas in exact rationals in kilograms and cubic metres;
- the flare by the rule by moles, cross-checked by the rule's volumetric route;
- Z by bisection on reduced density, with a second correlation as a plausibility check;
- the cascade as a mass ledger with conservation asserted;
- Erlang C in exact rationals on the positions wholly working;
- ledgers for the blend, storage, vaporizer, floats and the switch.

The compressor train's thermodynamics are the Facilities engine's and are validated there; only the unit bridge is checked here.

In practice, a reviewer of a study asks of each input whether it was held, pinned or checked.

## Exercise

Name the four held limits and the tier each was first met in. Then name three pinned figures this tier used, with the figure the engine uses for each where the course printed one: the butane typical liquid density, the propane typical latent heat and the water at 15 C for a filling density. Say which oracle check covers IBAFO's cascade and what it asserts.
