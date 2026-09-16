# Actual cubic feet, and the base they came from

{{panel:fc-fire-drum-explorer}}

The knockout drum route wants a vapour rate in actual cubic feet a second. Almost every gas rate on a plant is quoted in standard cubic feet a day. Between those two units sits a conversion this engine does not perform.

## The teaching drum, as it is stated

| what is stated about ODIDI | value |
| --- | --- |
| gas rate | 44.000000 MMscfd |
| pressure | 42.000000 psia |
| temperature | 160.000000 degF |
| gas gravity | 0.680000 |
| liquid density | 36.500000 lb/ft3 |
| vapour viscosity | 0.013500 cp |

Six stated facts, and not one of them is in the units the drum route reads. That route wants a volumetric rate at drum conditions, a settling velocity, a diameter and a level fraction.

## The vapour density, and the base behind the rate

The vapour density follows from the stated gravity with the package's own gas constant and air molecular weight: 0.124385 lb/ft3. It is derived rather than stated, and it matters twice, because the settling calculation needs a vapour density and so does the rate conversion.

The actual vapour rate follows from the stated MMscfd at the package's own standard base, which is 14.696 psia and 519.67 degR: 212.481739 actual ft3/s. Write both halves of that down, because the base is the part people leave out. A standard cubic foot is a bookkeeping unit defined at a reference pressure and temperature, and more than one reference is in common use. Quote a rate as MMscfd without naming the base and its meaning depends on which table the reader reaches for.

## Why this is a caller's job here

The drum route is handed a rate at drum conditions. It does not ask what pressure the header runs at, so it cannot convert anything for you, and it cannot flag a standard rate either, because a positive number in actual cubic feet a second and a positive number in standard cubic feet a second are indistinguishable once they are in the box.

That is the same shape as the load question from the first lesson of this module. The engine takes a number and returns the size that number demands. What it never does is check the units the number arrived in.

## Two figures with no ratio between them

The course states the rate as 44.000000 MMscfd and gives the actual rate as 212.481739 actual ft3/s, and prints no ratio between them. Resist forming one. A figure got by dividing either into the other carries a day, a second, a pressure and a temperature all at once, and nothing here stands behind it. Ask whether a quantity is entitled to be compared before comparing it.

The direction is safe to say. Compress a gas and the same molecules occupy less volume, so a rate quoted at a header pressure above the standard base is a smaller volumetric rate than the standard figure suggests. Type the standard number into a box wanting the actual one and you have asked for a drum sized for more gas than the header carries.

The discipline is one habit. Before any figure goes into the drum route, write down the quantity, its unit and the conditions it is quoted at.

## Exercise

List the six stated facts about the teaching drum and the two derived figures this lesson names. Then write down the standard base behind the rate conversion, both the pressure and the temperature, and say why the drum route cannot detect a rate handed to it in the wrong unit.
