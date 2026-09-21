# Viscosity on mass in the diesel pool

The fourth basis is an index blended on mass. Viscosity is its case, and the course reads it in a second cargo at the same invented Lagos terminal: a 6000 bbl AGO cargo to the 50 ppm diesel template.

## The pool

| component | cost $/bbl | SG | cetane | sulfur ppm | viscosity cSt | flash point C | available bbl |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Straight-run gasoil | 101.5 | 0.846 | 52 | 12 | 3.8 | 74 | 5000 |
| Kerosene | 107.2 | 0.795 | 44 | 6 | 1.3 | 46 | 1800 |
| Hydrotreated LCO | 86.4 | 0.921 | 29 | 35 | 2.7 | 66 | 1500 |
| Light vacuum gasoil | 90.3 | 0.866 | 54 | 85 | 6.9 | 112 | 1200 |

The template asks for a Cetane number of at least 48, Sulfur of at most 50 ppm, Density between 0.82 and 0.845 kg/l, Viscosity at 40 C between 2 and 4.5 cSt, and a Flash point of at least 55 C.

## Three bases in one pool

**Viscosity at 40 C** blends through the Refutas index on mass, the same index as the assay studio. On this basis w_i is SG x the component's index and d_i is SG. The limit enters as its own index, so a viscosity maximum and a viscosity minimum are each a linear row in the volumes.

**Sulfur** blends on mass, as in the gasoline pool.

**Cetane and flash point** are treated linearly on volume, which the template notes is a screening approximation. The engine says so in its template and uses the linear rule as a screen, and a planner reads a recipe that binds on cetane with that in mind, because the cetane limit is one of the two rows this recipe is pressed against.

## The recipe

| component | volume bbl | cost $ |
| --- | --- | --- |
| Straight-run gasoil | 2670.0508 | 271010.1523 |
| Kerosene | 1505.9222 | 161434.8562 |
| Hydrotreated LCO | 624.0271 | 53915.9391 |
| Light vacuum gasoil | 1200.0000 | 108360.0000 |
| total | 6000.0000 | 594720.9475 |

The unit cost is 99.1202 $/bbl. The recipe's viscosity, with the index on mass, is 3.0036 cSt, and the engine reports it with a giveaway of 1.0036 and marks it not binding. For a range, giveaway is the smaller of the two gaps, so 1.0036 is the distance to the nearer end.

## The same recipe on another basis

The lab prints the same recipe's viscosity with the same index blended on volume instead: 2.9518 cSt. Against the engine's 3.0036 cSt on mass, the two are different figures for one set of barrels. The course prints no difference column for this pair, so read both as printed.

The choice between them is a held item, C12. The engine blends the Refutas index on mass fraction, the classic Refutas form. ASTM D7152 blends the same family of index on volume. The two disagree, and the basis is a course and owner decision that this course states as a limit and does not settle. What a reader can say is what the engine does, and what the engine names: "Refutas index on mass fraction".

In this recipe the engine marks Viscosity at 40 C not binding, and its value of one unit of relief is 0.0000 per cSt, a column module four reads. Binding: Cetane number and Density. The engine also re-solved the recipe with the viscosity index blended on volume instead. Every component volume comes back the same, the total cost is 594720.9475 $ on both bases, and the binding specifications are again Cetane number and Density. On this pool the basis moves the achieved viscosity and leaves the recipe where it is.

{{panel:crude-recipe-explorer}}

In the panel, load the AGO pool and switch the viscosity basis between mass and volume. Watch the achieved viscosity move with the basis.

## Exercise

Read the AGO recipe's viscosity on mass, 3.0036 cSt, and on volume, 2.9518 cSt, against the template's range of 2 to 4.5 cSt. Read also the engine's giveaway of 1.0036 and its binding flag of false. Say where each figure sits inside the range, and say what the binding flag and the giveaway show about the part viscosity plays in pricing this recipe.
