# The Obigbo library crude by crude

The last lesson read one blend. This one reads the library itself, one crude at a time, with every answer the engine gives about each crude on its own gathered in one place. A blend inherits everything here, so knowing each crude well is how you predict what a blend will need checking.

{{panel:crude-assay-explorer}}

## Obigbo Light

36.8 API, a specific gravity of 0.8408, 0.14 wt% sulfur and 4.6 cSt. Its Refutas index is 18.5704. Its SARA is 52 saturates, 33.5 aromatics, 12.8 resins and 1.7 asphaltenes, and its CII on its own is 1.1598. Its curve runs from 0 at 85 to 100 at 1380, and its cut set closes at 100.0000.

| crude | LPG / Light ends | Naphtha | Kerosene / Jet | Diesel / Gasoil | Vacuum gasoil | Vacuum residue |
| --- | --- | --- | --- | --- | --- | --- |
| Obigbo Light | 0.4167 | 25.2590 | 18.2484 | 16.5914 | 25.7110 | 13.7736 |

It is the light, low-sulfur backbone of the export blend.

## Egbema Medium

25.9 API, 0.8990, 0.48 wt% sulfur and 22 cSt, with a Refutas index of 27.5437. Its SARA is 34.1, 42.6, 19.8 and 3.5, and its CII alone is 0.6026. Its curve runs from 0 at 95 to 100 at 1480.

| crude | LPG / Light ends | Naphtha | Kerosene / Jet | Diesel / Gasoil | Vacuum gasoil | Vacuum residue |
| --- | --- | --- | --- | --- | --- | --- |
| Egbema Medium | 0.0000 | 16.3636 | 13.6364 | 17.8571 | 29.0000 | 23.1429 |

Its aromatics and resins are what hold asphaltenes in a blend. Blended at 85 with 15 of Obigbo Light, the pair screens stable at 0.6634.

## Asarama Heavy

17.2 API, 0.9516, 1.85 wt% sulfur, 41 ppm nickel, 96 ppm vanadium and 610 cSt, with a Refutas index of 37.9879. Its SARA is 31.5, 37.2, 19.4 and 11.9, and its CII alone is 0.7668. Its curve runs from 0 at 120 to 100 at 1560.

| crude | LPG / Light ends | Naphtha | Kerosene / Jet | Diesel / Gasoil | Vacuum gasoil | Vacuum residue |
| --- | --- | --- | --- | --- | --- | --- |
| Asarama Heavy | 0.0000 | 8.8462 | 11.5886 | 14.0097 | 35.5556 | 30.0000 |

This is the crude that makes every basis matter. In the three-crude blend at 20 by volume it carries a mass fraction of 0.2162, and vanadium on mass minus volume there is 1.5761 ppm. With Ubie Condensate it screens unstable at 1.7614.

## Ubie Condensate

54.6 API, 0.7603, 0.03 wt% sulfur and 1.1 cSt, with a Refutas index of 4.5307. Its SARA is 89.1, 9.2, 1.5 and 0.2, and its CII alone is 8.3458. Its curve runs from 0 at 70 to 100 at 760.

| crude | LPG / Light ends | Naphtha | Kerosene / Jet | Diesel / Gasoil | Vacuum gasoil | Vacuum residue |
| --- | --- | --- | --- | --- | --- | --- |
| Ubie Condensate | 2.8571 | 52.5974 | 22.7807 | 14.8897 | 6.8750 | 0.0000 |

A condensate is a diluent and a naphtha source. As a blend component its saturates are a stability risk, which is why the gravity rule of thumb flags it beside Asarama Heavy at an API contrast of 37.4000.

## Ebocha partial assay

31.4 API, 0.8686 and 0.22 wt% sulfur. Everything else is not given. Its curve runs from 4 at 110 to 88 at 920. On the default cuts it yields 16.3881 kerosene and 17.2861 diesel, with four cuts unknown and a total of 33.6742 that does not close. It can blend for gravity and sulfur. It cannot blend for any property it does not carry, and the engine will name it each time.

## Reading a library

A library read this way is a list of what each crude brings and what each will cost you in a blend. Before building any recipe, know which crude carries the sulfur, which the metals, which the viscosity, which the saturates, and which record is incomplete.

## Exercise

Read the Asarama Heavy and Ubie Condensate sections. Quote each crude's API, viscosity, Refutas index, CII alone and residue yield. Say what these figures show about the risks of blending the two together, and name the lesson in this tier that printed the engine's verdict on that pair.
