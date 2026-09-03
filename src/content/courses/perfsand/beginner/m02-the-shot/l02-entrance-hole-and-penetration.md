# Entrance hole and penetration

The two numbers a charge is sold on, and what the skin calculation does with each.

{{panel:ps-shot-explorer}}

## Entrance hole

The diameter of the hole through the casing. It is measured on the steel, at the point where the jet went through, and it is what a gravel pack has to be placed through and what a wireline tool passing outside would see.

The skin calculation uses HALF of it, as the radius of the tunnel. That is an approximation and it is worth naming: the real tunnel tapers, so a single radius is a stand-in for a shape. The convention is to use the entrance radius, which is the widest part, and the correlation was fitted with that convention.

## Penetration

The distance the jet reached, measured from the casing outer wall into the target. The skin calculation uses it directly as the tunnel length.

Two subtleties. The published figure is total penetration in the API target, and what the flow calculation wants is the length in the FORMATION beyond the cement sheath. Those differ by the cement thickness, and the difference matters most for a short charge. And formation penetration is generally less than concrete penetration at the same charge, because reservoir rock under stress is not an unconfined concrete block.

## Which one the skin cares about more

Penetration, by a wide margin, and not for the reason people expect.

The tunnel length appears in the effective wellbore radius, which appears inside a logarithm, so its direct effect is gentle. But it also appears as a ratio against the perforation spacing, and that ratio drives both the converging-flow term and the crushed-zone term.

The entrance hole appears only through the dimensionless radius, and its effect is smaller across the range a real catalog covers.

## Where they trade

The catalog carries a big-hole gun with a seven-tenths of an inch entrance hole and a deep-penetrating gun family with entrance holes around four tenths. The big-hole gun also has the longest tunnel in the catalog, which looks like getting both, until you notice that its wide hole is what puts it outside the correlation's development range.

The Professional tier follows that up.

## Exercise

For a charge quoted at a given entrance hole and penetration, write down the two lengths the skin calculation will use.

Say which of the two published figures needs a correction before it is used, and what the correction is.

Then say which of the two moves the total skin more, and give the mechanism.
