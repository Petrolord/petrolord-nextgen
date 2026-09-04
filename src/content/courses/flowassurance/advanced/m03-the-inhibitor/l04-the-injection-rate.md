# The injection rate

The rate is a mass balance on the water. What makes it hard sits in the two conversions on either side of that balance.

{{panel:pd-hydrate-explorer}}

## The balance itself

To make the produced water W percent inhibitor by weight, the inhibitor mass has to be W over (100 minus W) of the water mass. The function gets the water mass per day from the water rate, a gallons-per-barrel conversion and a water density it carries as a default, then takes that fraction. On TEACHING LINE AKASO SPUR, a construct this course designed for itself and not a published case, the produced water is 420.0 bbl/d.

## The lean stream is not the inhibitor

Injected inhibitor is rarely pure. Recovered glycol comes back weaker, and injecting as though it were pure is a standard way to under-dose, so `leanWtPct` is an explicit input. The pure mass is grossed up by 100 over the lean strength.

The teaching line carries lean methanol at 96.00 weight percent and lean MEG at 89.00 weight percent. The weaker stream brings more water with it, and that water joins the water already there, which is why the gross-up is not a rounding detail.

## From pounds a day to barrels a day

The rate comes back as a volume, so the function forms a stream density by blending the inhibitor density with the water density in proportion to the lean strength, and divides. The catalogue densities are 6.6000 lb/gal for methanol, 9.3000 for MEG and DEG, and 9.4000 for TEG.

Sized at 36.0035520084 weight percent methanol from lean at 96.00 weight percent, the call returns 82766.408593 lb/day of pure methanol grossed up to 86215.008951 lb/day of stream, a `streamDensityLbGal` of 6.6696000000 and a `rateBpd` of 307.7753251096 bbl/d.

Two properties set the rate and they do not move together. Molecular weight sets the pounds the water needs; density sets the gallons those pounds occupy. MEG on the same duty is sized at 52.1503646614 weight percent from lean at 89.00 weight percent, blends to 9.1944000000 lb/gal, and needs 466.5311621077 bbl/d.

The return carries `rateBpd`, `rateGpd`, `massLbDay`, `pureMassLbDay` and `streamDensityLbGal`.

## What it refuses

Three things, each with a written reason. A water rate that is not zero or positive. A target not strictly between 0 and 100 weight percent. A lean strength no stronger than the concentration it has to produce, refused with a sentence quoting both: "It cannot get there however much is injected."

That third refusal is the useful one. A lean stream weaker than its target is not a rate problem, no pumping fixes it, and the module says so rather than returning a large number.

## The mistake

Sizing the pump on the pure inhibitor. The line carries the lean stream, water and all, and a design quoting 82766.408593 lb/day rather than 86215.008951 lb/day understates both the pump and the umbilical.

## Exercise

Reproduce the methanol rate of 307.7753251096 bbl/d from 420.0 bbl/d of water, then run MEG on the same duty.

Then say which of the two conversions opened the gap, and what happens when the lean strength is set below the target.
