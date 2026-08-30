# Adding them up at the packer

Three numbers, one sum, and two things to compare it against.

{{panel:ct-tubing-explorer}}

## The sum

    total = piston + ballooning + thermal

Straight addition, no weighting, no interaction term. All three are forces on the same body in the same direction, so they add.

## The three cases, totalled

| case | piston | ballooning | thermal | total |
|---|---|---|---|---|
| production heating | 35712.418834005 | 27216.466692956772 | -186613.83258144156 | -123684.94705447978 |
| injection cooling | 71424.83766801 | 54432.933385913544 | 124409.22172096104 | 250266.9927748846 |
| stimulation | 151205.11951994442 | 103852.60026147243 | 207348.7028682684 | 462406.42264968524 |

## The first comparison: the packer rating

    packer safety factor = rating / |total|

with the rating at 670000 N for this packer. The absolute value is deliberate: a packer has to resist both directions, and a rating is usually quoted as a single number for both.

| case | packer SF |
|---|---|
| production heating | 5.416989018921467 |
| injection cooling | 2.6771408908991274 |
| stimulation | 1.448941812184961 |

Stimulation is the worst by a wide margin, and it is worst because all three of its terms are large AND they all point the same way.

## The second comparison: buckling

Only the compressive part matters.

    compression = max(0, -total)

Production heating gives 123684.94705447978 N of compression. The other two give zero, because both are in tension.

So the only case that can buckle is the only case that is being heated, and module 4 is about what happens to it.

## The asymmetry worth noticing

The case with the WORST packer force does not buckle. The case that buckles has the BEST packer force of the three.

That is the shape of this whole tier: the limits are not ordered, so the worst case for one is not the worst case for another.

## What is not in the sum

Buckling itself. A buckled string carries some of its compression as bending against the casing wall, and that changes the force reaching the packer.

The engine reports the buckling state and does NOT feed it back into the force. It says so: the length changes are reported, not fed back. That is a planning-level simplification and it means the numbers here are the pre-buckling ones.

## Exercise

Work out what temperature change would bring the production heating case to a packer safety factor of 2, holding the pressure changes fixed.

Then say whether the string would still be buckled at that temperature.
