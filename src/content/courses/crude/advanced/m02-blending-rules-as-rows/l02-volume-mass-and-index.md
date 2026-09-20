# Volume, mass and index

The row sum((w_i - L d_i) v_i) <= 0 has two weights, and choosing them is choosing how a property blends. The Associate tier taught that every property of a blend has its own basis. The optimizer carries the same idea into its rows: each specification declares how its property blends, and the declaration fixes w_i and d_i.

## The four bases

| basis | w_i (numerator weight) | d_i (denominator weight) |
| --- | --- | --- |
| volume | the property | 1 |
| mass | SG x the property | SG |
| index, on volume (RVP) | the property's index | 1 |
| index, on mass (viscosity) | SG x the property's index | SG |

**Volume.** The property averages by barrels. Octane numbers and density are declared this way in the templates.

**Mass.** The property is per unit mass, as sulfur in ppm is, so each barrel is weighted by what it weighs. SG x volume is proportional to mass, which is why both weights carry the specific gravity. A mass-basis specification needs a density on every component, a fact module five meets when one is missing.

**Index on volume.** The property does not mix linearly, so it is transformed into an index that does, blended on volume, and turned back. RVP is the case, and lesson three reads its index.

**Index on mass.** The same, weighted by mass. Viscosity is the case, through the Refutas index of the Associate tier, and lesson four reads it in a diesel pool.

## The templates declare the basis

SPEC_TEMPLATES are the optimizer's starting shapes, and each row carries its basis. The 50 ppm gasoline template reads RON on volume with a minimum of 91, MON on volume with a minimum of 81, Sulfur on mass with a maximum of 50 ppm, RVP on index with a maximum of 9 psi, and Density on volume between 0.72 and 0.775 kg/l. The diesel template declares Viscosity at 40 C on index, on mass, between 2 and 4.5 cSt. The fuel oil template does the same for Viscosity at 50 C with a maximum of 380 cSt.

Two cautions come with them. They are starting points. They are not a compliance source: the regulation in force governs, and every limit is editable. And every figure in them is invented and illustrative, like every figure in this course.

## Agreement is a check

The rows are one route to a property. propertyOfBlend is a second: it recomputes a property from the finished recipe by the specification's own rule, separately from the LP rows. At Apapa the two routes read:

| specification | achieved (optimiseBlend) | propertyOfBlend on the recipe | difference |
| --- | --- | --- | --- |
| RON | 94.5010 | 94.5010 | 0.0000 |
| MON | 84.4928 | 84.4928 | 0.0000 |
| Sulfur | 50.0000 | 50.0000 | 0.0000 |
| RVP | 9.0000 | 9.0000 | 0.0000 |
| Density | 0.7547 | 0.7547 | 0.0000 |

Every difference is 0.0000. The row that the kernel satisfied and the property recomputed from barrels are the same number, on every basis, including the mass-basis sulfur and the index-basis RVP. A wrong weight in a row would show here as a difference.

{{panel:crude-recipe-explorer}}

In the panel, switch a specification's basis and watch its weights change in the row. The recipe moves with them, because the kernel is now answering a different question.

## Exercise

Read the 50 ppm gasoline template's five specifications and the basis each declares. Then read the propertyOfBlend check table. Say which weight, w_i or d_i, carries the specific gravity for the Sulfur specification, and say what the difference column of 0.0000 for Sulfur and for RVP shows about the rows on the mass basis and the index basis.
