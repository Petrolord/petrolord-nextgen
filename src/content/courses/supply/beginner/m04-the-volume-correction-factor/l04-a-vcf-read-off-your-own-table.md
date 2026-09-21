# A VCF read off your own table

{{panel:supply-tank-explorer}}

## The route AKODO takes

The coefficient refusal offers two ways forward, and AKODO takes the second. It does not type coefficients into the form. For each tank it measures a density at 15 C and an observed temperature, looks up the VCF for that pair in its own tables, and types the VCF in directly. The engine then multiplies.

The AKODO terminal is an invented record, and so are its tables. The VCF figures below are invented for this course. They are not read from any published table and should not be taken as the correction for any real product at these conditions.

## The typed figures

| tank | density kg/m3 | temperature C | VCF typed |
| --- | --- | --- | --- |
| AK-01 | 741.6 | 31.5 | 0.980300 |
| AK-02 | 846.3 | 30 | 0.987600 |
| AK-03 | 796.8 | 29 | 0.988400 |

Read a row as three inputs and one lookup. AK-01 holds petrol at a density of 741.6 kg/m3, dipped at 31.5 C, and its tables give a VCF of 0.980300. AK-02 holds diesel at 846.3 kg/m3 and 30 C, with a typed VCF of 0.987600. AK-03 holds kerosene at 796.8 kg/m3 and 29 C, with a typed VCF of 0.988400.

Each typed VCF is below one, and each tank was dipped above 15 C. That matches what the form says a VCF does above the reference: it takes the swelling back out.

## Two boxes that must stay apart

The synthetic row of the last two lessons also produces a VCF at a density of 741.6 kg/m3 and 31.5 C. It is a different kind of figure. The synthetic VCF is the form evaluated on invented coefficients that belong to no commodity group, printed to show how the form behaves. The typed VCF is the figure the terminal's own tables give for its tank. Only the typed figure touches a stock. The panel keeps the two in separate boxes, and the SYNTHETIC one is labelled.

This is why the course never lines the two up. Nothing ties them to each other, and setting one against the other compares an illustration with a reading.

## What typing a VCF changes

A typed VCF is still an input, and every rule about inputs applies. It carries the terminal's table, the density sample and the thermometer with it. If any of those is wrong, the VCF is wrong, and the engine cannot tell. What the engine can do is refuse to run without one, and name the standard volume as none when it is missing, as it did for AK-01 in module one:

gross 3461.489 m3, standard none; note: No volume correction factor supplied, so only the gross observed volume is reported.

With the typed VCF supplied, the same call returns a standard volume as well. That is the next lesson.

In the panel, type each AKODO tank's VCF into its box and watch the standard volume appear. Then clear one and watch it return to none.

## Exercise

Read the AK-02 row: density 846.3 kg/m3, temperature 30 C, VCF typed 0.987600. Say which of those were measured at the tank, which was looked up, and where the lookup came from.

Self check: the density and the temperature are measurements. The VCF of 0.987600 was read off AKODO's own tables for that density and temperature and typed in; like the tables it came from, it is invented for this course.
