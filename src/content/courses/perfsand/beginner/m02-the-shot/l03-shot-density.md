# Shot density

How many holes per unit length, why it is quoted per foot, and what the calculation actually uses.

{{panel:ps-shot-explorer}}

## The quoted number

Shot density is quoted in shots per foot. A four shot per foot gun fires four charges in every foot of gun length; a twelve shot per foot gun fires twelve.

The catalog in this course runs from four to twelve, which spans the usual range. Higher densities exist and cost more, in gun hardware and in the debris and the shock they put into the casing.

## What the calculation uses

The engine takes shots per metre, and it converts once at the input. Everything downstream is metric.

More importantly, the calculation does not use the density directly at all. It uses the SPACING, which is one over the density.

That distinction is the whole content of this lesson. Doubling the shot density does not double anything in the skin calculation; it halves the spacing, and the spacing then enters two of the four components.

## Why spacing rather than density

Because the geometry the flow sees is a set of tunnels a certain distance apart. Fluid converging into a perforation has to travel vertically as well as radially, and how far it has to travel vertically is set by how far apart the perforations are.

Halve the spacing and each perforation drains a shorter interval, so the vertical convergence is easier and the converging-flow skin falls.

The spacing also appears in the crushed-zone term, as a ratio against the tunnel length. The crushed shell is a fixed obstruction per perforation, so more perforations per metre share it out.

## The shape of the return

Because the spacing is a reciprocal, the return on extra shots diminishes. Going from four shots per foot to eight halves the spacing. Going from eight to twelve only takes another third off it.

That is why the catalog clusters at four, six and twelve rather than climbing steadily, and why nobody sells a forty shot per foot gun for ordinary work.

## Exercise

Convert a shot density in shots per foot into shots per metre, and then into a spacing in metres.

Explain in one sentence why the calculation uses the spacing rather than the density.

Then sketch the spacing against the density from two to twenty shots per foot, and say where on that curve extra shots stop being worth buying.
