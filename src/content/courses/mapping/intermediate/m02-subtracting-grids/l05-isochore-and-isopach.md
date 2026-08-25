# Isochore and isopach

The map built in this tier is an isochore. The word isopach is often used for the same thing and they are not the same thing. This lesson separates them and works out how much the distinction is worth on this field.

## Two thicknesses

**Isochore thickness** is measured **vertically**: the vertical distance from the top of the interval to its base, at a fixed map location. It is what you get by subtracting one depth surface from another, which is exactly what this tier does.

**Isopach thickness** is measured **perpendicular to bedding**: the true stratigraphic thickness of the interval, the distance a geologist would measure across the layer at right angles to it.

On a horizontal bed the two are identical. On a dipping bed the vertical distance is longer than the perpendicular one, and the relationship is

$$t_{isopach} = t_{isochore}\cos\theta$$

where $\theta$ is the dip of the bed. Vertical thickness always overstates stratigraphic thickness, and the overstatement grows as the square of the dip for small angles.

## Which one you have

Ask what was subtracted. Two depth surfaces subtracted at fixed map coordinates give vertical thickness, so the product of this tier is an **isochore**, and calling it an isopach is a mislabel that will eventually reach a report.

Ask also what the picks were. The Ekene picks are measured depths in vertical wells, so the well thicknesses of 32, 36, 29, 25, 31 and 34 m are themselves vertical thicknesses. In a deviated well a measured-depth interval is neither vertical nor stratigraphic and has to be converted before it means anything, which is the well data course's territory rather than this one's.

## How much it matters here

Compute the dip. The steepest gradient anywhere on the Ekene TOP_SAND surface is 0.0558, which is **3.19 degrees**, at (2400, 2300) on the flank toward Ekene-4. Most of the field is considerably flatter.

At that steepest point, $\cos(3.19^\circ) = 0.99845$, so a vertical thickness of 32.25 m corresponds to a stratigraphic thickness of 32.20 m. The difference is **0.05 m**, which is 0.16 percent.

That is far below the precision of the picks, which are given to the metre, and far below the 0.1 m tolerance the capstone allows on the thickness fields. On this field the distinction is real, correctly stated, and quantitatively irrelevant.

## When it stops being irrelevant

The correction is $1 - \cos\theta$, which is tiny for gentle dips and grows quickly.

| Dip | Correction | On a 32 m interval |
| --- | --- | --- |
| 3 degrees | 0.14 percent | 0.04 m |
| 10 degrees | 1.5 percent | 0.49 m |
| 20 degrees | 6.0 percent | 1.93 m |
| 30 degrees | 13.4 percent | 4.29 m |
| 45 degrees | 29.3 percent | 9.37 m |

Below about 10 degrees the correction is smaller than most pick uncertainty and can be stated and ignored. Above about 20 degrees it is a first-order error and an uncorrected isochore will overstate stratigraphic thickness by more than most volumetric sensitivities are worth arguing about.

## Which one the calculation wants

This is the part that decides the answer, and the two uses want different things.

**Gross rock volume wants the isochore.** Volume is thickness times map area, and map area is measured in the horizontal plane. Multiplying a horizontal area by a vertical thickness gives the correct volume, because the vertical overstatement of thickness exactly compensates for the horizontal understatement of the dipping bed's true area. Correcting to stratigraphic thickness and then multiplying by map area would **understate** the volume.

**Sedimentology wants the isopach.** How thick the sand body actually was when it was deposited, how it thins toward a margin, how it compares with an outcrop analogue: all of those are stratigraphic questions and want the perpendicular measurement.

So the correct habit is not to convert. It is to know which quantity you are holding and to use it for the question it answers.

## Worked example

An interval maps at an isochore thickness of 48 m on a flank dipping at 25 degrees. Give both thicknesses and say which one belongs in a volume calculation.

The stratigraphic thickness is $48 \cos(25^\circ) = 48 \times 0.9063 = 43.5$ m, so the vertical measurement overstates the true bed thickness by 4.5 m, or 9.4 percent. The volume calculation wants the isochore value of 48 m, because it will be multiplied by a horizontal map area; using 43.5 m against the same area would understate the rock volume by 9.4 percent.

## Exercise

Define isochore and isopach thickness in one sentence each, state which one this tier produces, and compute the correction at the steepest point of the Ekene field.

As a self-check: an isochore is the vertical distance between the top and base of an interval at a map location, and an isopach is the thickness measured perpendicular to bedding; this tier produces an isochore, because it subtracts two depth surfaces at fixed map coordinates. At the steepest point the dip is 3.19 degrees, so the correction factor is $\cos(3.19^\circ) = 0.99845$ and a 32.25 m isochore corresponds to a 32.20 m isopach, a difference of 0.05 m that sits well inside the pick precision.
