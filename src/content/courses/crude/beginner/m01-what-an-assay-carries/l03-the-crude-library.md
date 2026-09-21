# The crude library

This tier works from one library: four invented field streams at an invented Rivers State export terminal, and one partial assay. Every figure in it is illustrative. The specific gravity column is computed from API by sgFromApi, which the last lesson set out.

{{panel:crude-assay-explorer}}

## The four streams and the partial assay

| crude | API | SG (computed) | sulfur wt% | TAN mg KOH/g | nitrogen wt% | nickel ppm | vanadium ppm | viscosity cSt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Obigbo Light | 36.8 | 0.8408 | 0.14 | 0.26 | 0.07 | 3.2 | 1.4 | 4.6 |
| Egbema Medium | 25.9 | 0.8990 | 0.48 | 0.62 | 0.16 | 12.5 | 8.7 | 22 |
| Asarama Heavy | 17.2 | 0.9516 | 1.85 | 1.4 | 0.34 | 41 | 96 | 610 |
| Ubie Condensate | 54.6 | 0.7603 | 0.03 | 0.05 | 0.01 | 0.4 | 0.2 | 1.1 |
| Ebocha partial assay | 31.4 | 0.8686 | 0.22 | not given | not given | not given | not given | not given |

The names say what kind of stream each one is meant to be: a light crude, a medium crude, a heavy crude and a condensate. Each column is a property the engine can blend. Sulfur, the total acid number (TAN), nitrogen, nickel and vanadium are per unit mass and blend on mass, and viscosity blends through an index, as the next two modules show. Gravity blends as specific gravity on volume.

## A partial assay is a real kind of record

The Ebocha row carries a gravity and a sulfur, and nothing else. It is the one partial assay in the library. The library keeps the blanks as blanks. The engine never reads "not given" as a zero, and later lessons show what it does instead: it names the crude that lacks the value and returns the property as not blended.

## SARA

Four of the crudes carry a SARA analysis, in wt%.

| crude | saturates | aromatics | resins | asphaltenes |
| --- | --- | --- | --- | --- |
| Obigbo Light | 52 | 33.5 | 12.8 | 1.7 |
| Egbema Medium | 34.1 | 42.6 | 19.8 | 3.5 |
| Asarama Heavy | 31.5 | 37.2 | 19.4 | 11.9 |
| Ubie Condensate | 89.1 | 9.2 | 1.5 | 0.2 |

The four fractions are what the stability screen in module five works from. Saturates push asphaltenes out of solution, and aromatics and resins hold them in.

## The curves

Each crude also carries a true boiling point curve: the volume percent distilled at each temperature, in degrees F.

| crude | points (volume percent at F) |
| --- | --- |
| Obigbo Light | 0 at 85; 10 at 205; 30 at 390; 50 at 548; 70 at 742; 90 at 1060; 100 at 1380 |
| Egbema Medium | 0 at 95; 10 at 280; 30 at 500; 50 at 668; 70 at 880; 90 at 1230; 100 at 1480 |
| Asarama Heavy | 0 at 120; 10 at 380; 30 at 610; 50 at 790; 70 at 1000; 90 at 1320; 100 at 1560 |
| Ubie Condensate | 0 at 70; 10 at 140; 30 at 230; 50 at 320; 70 at 430; 90 at 600; 100 at 760 |
| Ebocha partial assay | 4 at 110; 25 at 370; 50 at 590; 70 at 760; 88 at 920 |

Four curves run from 0 to 100 percent. The Ebocha curve starts at 4 percent and stops at 88. Module four shows what the engine will and will not say about the parts of that crude its curve does not cover.

## How to use the library

Open the assay explorer and look at each crude card. Every figure there is the one in these tables. Build nothing yet: read each crude as a whole, with its gravity, its per-mass properties, its SARA and its curve together, because a blend inherits every one of them on its own basis.

Notice which figures are typed and which are computed. API, sulfur, TAN, nitrogen, the metals, viscosity, SARA and the curve points are inputs, and they print exactly as they were typed, which is why some carry one decimal and some none. Specific gravity is the one column the engine computes here, so it prints to four decimals. Every computed figure in this course prints that way, and a lesson quotes it as printed. Rounding a computed figure makes a new number that the engine never returned.

## Exercise

Read the Obigbo Light row and the Asarama Heavy row of the property table. Quote each crude's API, sulfur and vanadium. Then read the 50 percent point of each crude's curve. Say what these figures together show about the two crudes as refinery feed, and name the one row in the library whose curve cannot tell you what happens at 100 percent distilled.
