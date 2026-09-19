# The fill limit and its basis

A vessel of LPG is never filled to the top. How far it may be filled is its fill limit, and `lpgStorageSizing` asks for that limit and for the basis it is stated on. This lesson reads both, on KANO's vessel.

{{panel:gasvalue-rollout-explorer}}

## A required input with no default

The fill limit is required and has no default; the code value is the site's. Left blank, it is refused, and the refusal carries the engine's reason:

| probe | engine |
| --- | --- |
| fill limit left blank | REFUSED: A maximum fill ratio is required and is not defaulted. It is a code limit for the product and the vessel: LPG expands and a vessel filled liquid-full ruptures hydraulically. |
| fill limit 1 | REFUSED: The maximum fill ratio must lie between 0 and 1. |

Fill limits by code are held in this course. The engine ships no code value: the limit is a safety code value, typed by the site with its basis. The two limits used below are illustrative, and neither is a code value. This lesson teaches how the engine reads a limit. It does not teach which limit is right for a vessel.

## Two ways a code states it

A code states the limit two ways, and the engine takes the basis explicitly. FILL_RATIO_BASIS exports the two words: liquid_volume and water_capacity_mass. On the water capacity basis the engine weighs the water capacity at WATER_KG_M3 = 999.1 kg/m3.

KANO's vessel is 150 m3, and its liquid density is the blend's 557.4000 kg/m3. The engine was run on it twice, once on each basis:

| fill limit (input) | fillRatioBasis | usableM3 | usableTonnes | vapourSpaceM3 |
| --- | --- | --- | --- | --- |
| 0.85 | liquid_volume | 127.5000 | 71.0685 | 22.5000 |
| 0.42 | water_capacity_mass | 112.9230 | 62.9433 | 37.0770 |

On liquid_volume, 0.85 is a share of the vessel's volume and gives 127.5000 m3 usable, 71.0685 t. On water_capacity_mass, 0.42 is read as a filling density, with the water capacity weighed at 999.1 kg/m3. It gives 112.9230 m3 usable, 62.9433 t.

## The same number on the wrong basis

A fill limit read on the other basis is the shortcut the engine does not take. The same 0.42 read as a share of the liquid volume gives 35.1162 t. That is 27.8271 t below the filling density's 62.9433 t. The number typed is identical in both readings. Only the basis differs, and the tonnes differ by 27.8271 t.

The engine takes the basis explicitly, and a basis it does not know is refused by name:

| probe | engine |
| --- | --- |
| basis typed as 'weight' | REFUSED: Unknown fill ratio basis "weight". Use liquid_volume or water_capacity_mass. |
| a filling density of 0.6 on water capacity at the KANO blend density | REFUSED: At this density the filling density fills the vessel liquid-full. Check the limit and its basis. |
| no liquid density | REFUSED: A liquid density is required; it is not assumed. |

The fourth probe is worth reading slowly. A filling density of 0.6 on water capacity, at KANO's blend density, is refused because it fills the vessel liquid-full, and the refusal asks the user to check the limit and its basis. The fifth probe shows that the liquid density is required here too, and the refusal says it is not assumed.

In practice, a site's code limit arrives on a document that states its own basis, and the engine asks the user to carry that basis across with the number.

## In the explorer

Open KANO's vessel. Type 0.42, choose water_capacity_mass, and read 62.9433 t. Switch the basis to liquid_volume and read the tonnes the panel labels as the other basis. Then type 0.6 on water_capacity_mass and read the refusal.

## Exercise

Read the two rows of KANO's vessel: 0.85 on liquid_volume giving 127.5000 m3 and 71.0685 t, and 0.42 on water_capacity_mass giving 112.9230 m3 and 62.9433 t. Then read the same 0.42 on the other basis, 35.1162 t, and the printed gap of 27.8271 t. Say what the word in the fillRatioBasis column tells the engine, what the printed gap shows about a limit typed without its basis, and why the engine gives no default limit, quoting its refusal.
