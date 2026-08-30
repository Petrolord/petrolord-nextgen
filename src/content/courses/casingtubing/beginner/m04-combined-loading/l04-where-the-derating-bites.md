# Where the derating bites

Hardest in the yield regime, not at all in the elastic one, and exactly computable in both.

{{panel:ct-rating-explorer}}

## The rule

The derating is only as strong as the formula's dependence on the yield strength.

- **Yield regime.** The formula is linear in the yield strength, so the collapse falls by exactly the same fraction the adjusted yield does.
- **Plastic and transition.** Partly dependent, so the loss is real but smaller than the yield loss.
- **Elastic.** No dependence at all, so the loss is exactly zero.

## The yield regime, checked

The 7 inch 35 lb/ft joint at K-55 is in the yield regime at every axial fraction.

| axial fraction | adjusted yield fraction | collapse lost |
|---|---|---|
| 0.4 | 0.738083151964686 | 0.261916848035314 |
| 0.7 | 0.4452986860293434 | 0.5547013139706565 |
| 0.9 | 0.17649820430708335 | 0.8235017956929166 |

Look at the two columns. Each pair adds to one, to fifteen decimal places. The collapse lost IS the yield lost, because a linear formula passes the derating straight through.

## The plastic regime

The 9-5/8 inch 47 lb/ft joint at P-110 loses 0.0964150734618342 of its collapse at an axial fraction of 0.4, where the yield itself has fallen by 0.261916848035314.

So about thirty seven percent of the yield loss came through. That is what partial dependence looks like.

## The elastic regime

The 20 inch 94 lb/ft joint at K-55 loses nothing at all up to an axial fraction of 0.5. Not a small amount. Nothing, to the last bit of the double.

At around 0.5465081838176975 the elastic boundary finally climbs past its ratio of 45.662100456621005 and it enters the transition regime, and only then does it start to lose anything: 0.003124397190863104 at a fraction of 0.6, still under a third of a percent.

## The design consequence

On a slender, elastically collapsing string, the tension at the top of the string does NOT reduce the collapse rating there. Which means the classic worry, that the top joint is squeezed and stretched at the same time, is a real worry for a thick production casing and a non-worry for a thin surface casing.

Which of those two you have is decided by one ratio, and you can read it off the row.

## Exercise

The 13-3/8 inch 68 lb/ft joint at L-80 loses 0.10969053380562654 of its collapse at an axial fraction of 0.4, from the transition regime.

Compare that with the yield loss of 0.261916848035314 at the same fraction, and place the transition regime on the scale between the yield regime and the elastic one.
