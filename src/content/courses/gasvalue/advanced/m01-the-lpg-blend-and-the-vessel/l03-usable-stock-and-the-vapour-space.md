# Usable stock and the vapour space

The fill limit settles how much of KANO's vessel may hold liquid. `lpgStorageSizing` then reports the vessel in parts: the usable stock, in cubic metres and in tonnes, and the vapour space the limit keeps. This lesson reads those three figures on both of KANO's illustrative limits.

{{panel:gasvalue-rollout-explorer}}

## The vessel

KANO's vessel is 150 m3. Its liquid density is the blend's 557.4000 kg/m3, the density `lpgBlendProperties` gave on volume. Two illustrative fill limits were run on it, and neither is a code value:

| fill limit (input) | fillRatioBasis | usableM3 | usableTonnes | vapourSpaceM3 |
| --- | --- | --- | --- | --- |
| 0.85 | liquid_volume | 127.5000 | 71.0685 | 22.5000 |
| 0.42 | water_capacity_mass | 112.9230 | 62.9433 | 37.0770 |

## Three figures from one limit

Each row prints three figures from one fill limit and its basis. On the 0.85 liquid_volume row, usableM3 is 127.5000, usableTonnes is 71.0685 and vapourSpaceM3 is 22.5000. On the 0.42 water_capacity_mass row they are 112.9230, 62.9433 and 37.0770.

The field names carry their units. usableM3 is the usable stock in cubic metres. usableTonnes is the usable stock in tonnes. vapourSpaceM3 is the vapour space in cubic metres.

## The vapour space is kept

The vapour space is not spare capacity: it is what keeps a vessel of expanding liquid from rupturing. The engine's refusal of a blank fill limit gives the same reason in its own words: "LPG expands and a vessel filled liquid-full ruptures hydraulically."

On KANO's liquid volume row the vapour space is 22.5000 m3. On the water capacity row it is 37.0770 m3. Each is printed as its own column beside the stock.

A limit that leaves the vessel liquid-full is refused. A filling density of 0.6 on water capacity at the KANO blend density gets: "REFUSED: At this density the filling density fills the vessel liquid-full. Check the limit and its basis."

## The density is an input

The usable tonnes are given at the liquid density the engine is handed, and the engine does not assume one. With no liquid density it refuses: "REFUSED: A liquid density is required; it is not assumed." On KANO the density handed in is the blend's 557.4000 kg/m3.

The studio's opening blend prints a density of 553.6000 kg/m3. The vessel figures in this lesson were run at KANO's 557.4000 kg/m3 only, and no vessel row in this course is printed at the studio's density.

## Two bases, two stocks

The two rows are two different stocks from one vessel. Neither limit is a code limit, and the course does not say which one a site should use. Code fill limits are held: the engine ships none, and the limit is typed by the site with its basis. What the rows show is how the engine reads each basis: 0.85 as a share of liquid volume, 0.42 as a filling density on water weighed at 999.1 kg/m3. Each gives its own usable volume, its own tonnes and its own vapour space.

In practice, a plant engineer checks the vapour space against the site's own code document.

## In the explorer

Set KANO's vessel at 0.85 on liquid_volume and read usableM3, usableTonnes and vapourSpaceM3. Switch to 0.42 on water_capacity_mass and read the three again. Then clear the liquid density and read the refusal.

## Exercise

Read both rows of KANO's vessel: usableM3, usableTonnes and vapourSpaceM3 for 0.85 on liquid_volume and for 0.42 on water_capacity_mass. Say what unit each of the three columns carries, which density the tonnes are given at, and what the engine's refusal of a blank fill limit says about the vapour space.
