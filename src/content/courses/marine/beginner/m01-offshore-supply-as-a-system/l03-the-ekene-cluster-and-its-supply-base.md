# The Ekene cluster and its supply base

{{panel:marine-voyage-calculator}}

Every teaching case in this course comes from one cluster: the Ekene offshore cluster, supplied by one PSV and one AHTS from the Ekene supply base. It is synthetic. A stated script wrote it for this platform, the fixture file labels it SYNTHETIC, and no real company, vessel, port, installation or contract appears in it. This lesson walks through what the cluster holds, so you recognise each input when a calculator view loads it.

## Four installations

The cluster has a production platform, a jack-up drilling unit, a wellhead platform and an FPSO. Each has a distance from the base, the hours a vessel spends alongside it on a visit, and the deck cargo and bulk of one planned voyage.

| id | installation | distance from the base, NM | field hours | one voyage: deck m2 | one voyage: deck t |
| --- | --- | --- | --- | --- | --- |
| EKA | Ekene-A production platform (synthetic) | 62.000000 | 6.000000 | 175.000000 | 205.000000 |
| EKJ | Ekene jack-up drilling unit (synthetic) | 68.000000 | 8.000000 | 215.000000 | 300.000000 |
| EKB | Ekene-B wellhead platform (synthetic) | 74.000000 | 4.000000 | 60.000000 | 50.000000 |
| EKF | Ekene FPSO (synthetic) | 95.000000 | 5.000000 | 90.000000 | 80.000000 |

The jack-up is the demanding one. It asks for all six bulk products on a voyage, including the mud, brine, cement and barite a drilling unit consumes, where the three production installations ask only for diesel and water.

## Six bulk products

Bulk travels in tanks, one product to a tank, and each product carries a stated kind and density. Diesel is a liquid at 0.850000 t a m3, water at 1.000000, mud at 1.400000 and brine at 1.200000; cement at 1.500000 and barite at 2.100000 are dry bulk. The densities matter because they turn a volume of bulk into a weight the vessel must carry.

## Two vessels

PSV Ekene Star has 800 m2 of deck, a deck load of 2000 t, a deadweight of 3500 t and a tank for every product, and sails at 11 knots. AHTS Ekene Tide is faster, at 12 knots, with a smaller deck of 550 m2, smaller tanks and a higher fuel burn. Both state a usable deck fraction of 0.75, a figure you will meet in module four.

## The route and the planning terms

The milk run calls at EKA, EKJ, EKB and EKF in that order, on legs of 62, 9, 12, 28 and 95 NM. Every voyage spends 12 port hours at the base. A rainy-season allowance puts a weather factor of 1.2 on sailing and field time, and fuel costs 870 a tonne.

## The supply base

The base has 2 berths and receives 3.2 vessel calls a day. How long a vessel waits for a berth is an Expert question, and this tier leaves the base there.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Scroll through the controls: find "Speed, knots (stated)", "Deck area, m2 (stated)" and the tank control of each product, and check them against the vessel described above. Find "installation EKJ: brine, m3" and read how much brine the jack-up asks for. Then set Start from to "Ekene AHTS milk run" and note which vessel controls change and which installation controls stay the same.
