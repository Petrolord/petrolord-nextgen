# Tension moves the regime

Derating the yield does not only lower the answer. It can change which formula produces it.

{{panel:ct-rating-explorer}}

## The mechanism

The three boundaries fall as the yield strength rises. Tension lowers the effective yield strength. So tension RAISES all three boundaries.

A pipe whose ratio of diameter to wall sat just above a boundary can find that the boundary has climbed past it, and it is now in the regime below.

## The direction is downward

Toward the yield regime. That is worth stating plainly, because the intuition runs the other way: tension makes a pipe weaker, so surely it becomes more like a thin pipe.

It does not. It becomes more like a LOW GRADE pipe, and low grade pipe reaches its regime boundaries at higher slenderness than high grade pipe does.

## The census

Across the 280 combinations in the catalog, with no axial load:

    yield 42, plastic 143, transition 52, elastic 43

At forty percent of yield in tension:

    yield 71, plastic 128, transition 57, elastic 24

Twenty nine pipes have moved into the yield regime and nineteen have left the elastic one. Nothing about the geometry changed.

## One row, walked

The 9-5/8 inch 53.5 lb/ft joint at L-80, ratio 17.660550458715594, plastic with no load.

| axial fraction | regime | collapse (Pa) |
|---|---|---|
| 0 | plastic | 45624175.296599805 |
| 0.4 | plastic | 37215937.73123948 |
| 0.7 | plastic | 25712693.64975457 |
| 0.8 | yield | 18922303.200540666 |
| 0.9 | yield | 10400641.160726702 |

Between 0.7 and 0.8 the plastic and yield boundary climbs past 17.660550458715594 and the answer starts coming out of a different formula.

## Why it does not show as a kink

Because the formulas are continuous at their boundaries by construction. The regime NAME changes discontinuously and the number does not, which is exactly what you want and also what makes the change easy to miss.

## Exercise

The 13-3/8 inch 68 lb/ft joint at L-80 sits at 27.864583333333332 and starts in the transition regime.

Step it through axial fractions of 0.7, 0.8 and 0.9 in the panel and record the regime each time. It passes through two boundaries, not one.
