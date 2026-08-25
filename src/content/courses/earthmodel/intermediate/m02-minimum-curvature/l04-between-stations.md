# Between stations

Stations are sparse and picks are not obliged to land on them. W2's TopA pick at 1580 m MD falls between the stations at 1500 and 1900. The engine needs a position there, and how it gets one is a documented convention worth knowing exactly, because the capstone's headline value depends on it.

## Linear in MD

The engine interpolates positions LINEARLY IN MEASURED DEPTH between adjacent trajectory stations. For a pick at MD $m$ between stations $a$ and $b$:

$$f = \frac{m - a.md}{b.md - a.md}, \qquad x = a.x + f\,(b.x - a.x)$$

and the same fraction $f$ applies to y, TVD and TVDSS. For TopA at 1580: $f = (1580 - 1500)/(1900 - 1500) = 0.2$, so the position is one fifth of the way from station 1500 to station 1900 along a straight line.

Beyond the surveyed range the engine clamps: an MD above the last station returns the last station's position, an MD above zero but below the first returns the implied start. Clamping is a refusal to extrapolate, and like every refusal in this engine family it is visible rather than fatal.

## When linear is exact and when it is not

Within a hold segment, the true path IS a straight line in MD, so linear interpolation is exact. All three of W2's picks sit in the hold, which is why their positions are exact to the last digit:

TopA, MD 1580: x 1568.4455110683407, TVDSS 1496.6634373420557, the capstone's graded value.
TopB, MD 1700: x 1653.2983248107264, TVDSS 1581.5162510844414.
BaseB, MD 1760: x 1695.7247316819194, TVDSS 1623.9426579556343.

Within a build segment, the true path is an arc, and a straight chord between stations cuts the corner. Had a pick landed at MD 1350, the middle of W2's build, linear interpolation would misplace it by a few metres relative to the arc. The error scales with the dogleg and the station spacing; with a 45 degree turn over 300 m it is small but real, and the convention is documented precisely so that an oracle computing positions a different way knows what to match. The convention is defensible because a survey only constrains attitude AT stations; between them, every method is a model.

## Land all three picks

Do TopA fully by hand. Station 1500: x 1511.876968573417, TVDSS 1440.0948948471319. Station 1900: x 1794.719681048036, TVDSS 1722.9376073217509. With $f = 0.2$: x $= 1511.876968573417 + 0.2 \times 282.84271247461896 = 1568.4455110683407$, and TVDSS $= 1440.0948948471319 + 0.2 \times 282.84271247461896 = 1496.6634373420557$.

Equivalently, since this is a hold at 45 degrees: 80 m of hole past station 1500 is $80/\sqrt{2} = 56.568542494923804$ m east and the same down. Both routes give the same digits. The graded number is nothing more mysterious than that, but every piece of it, the arc endpoint, the hold slope, the fraction, had to be right.

## Worked example

Land W2's zone A midpoint. Zone A runs 1580 to 1700 m MD, midpoint MD 1640, $f = (1640 - 1500)/400 = 0.35$. East: $1511.876968573417 + 0.35 \times 282.84271247461896 = 1610.8719179395334$. That x coordinate is the sixth graded value of the capstone, and it belongs to the Expert tier's story: it is where W2's zone A information will stand when properties are populated. TVDSS there: $1440.0948948471319 + 0.35 \times 282.84271247461896 = 1539.0898442132484$.

## Exercise

Compute the position fraction $f$ and the x coordinate for W2's BaseB pick at 1760 m MD, and check your x against the value above. Then state what position the engine would report for a hypothetical pick at MD 2100, and why that behaviour is a feature.
