# The errata in the worked example

{{panel:cq-fire}}

Reproducing a published example digit by digit does more than check an engine. It checks the example. Where the printed numbers do not follow from the printed inputs, the reproduction finds out. The Yellow Book's worked pool fire carries three such errata in its text, and its view factor table carries two more. Each is a fact about the published source, and a professional who uses the book needs to know them.

## Three errata in the worked pool fire

| what is printed | what the numbers say |
| --- | --- |
| Froude number 0.0545 | u10^2 / (g D) is 0.060060, and the printed tilt parameter and tilt follow only from that value |
| air viscosity 0.0000075133 m2/s "for air at 15 C" | air at 15 C is about twice that; the golden uses the printed value because the printed tilt depends on it, and the Reynolds number enters only to the power 0.117 |
| "50 m from the flame surface" in three steps | the steps compute with 100 m, the distance from the pool centre given in the inputs |

## The Froude number

The example states its wind and its pool diameter, so its Froude number follows directly: 0.060060. The book prints 0.0545. The printed tilt parameter, 1.94315, and the printed tilt, 50.8286 degrees, come out only from 0.060060, so the misprint sits in the printed Froude number itself. A reader who carried 0.0545 forward would get a different tilt and a different view factor.

## The viscosity

The example prints an air viscosity of 0.0000075133 m2/s and describes it as air at 15 C. Air at 15 C is about twice that, as the engine's own refusal message reminds a caller. The printed tilt was computed with the printed value, so the golden uses it too; to reproduce the book you must copy its inputs. The damage is small because the Reynolds number, which carries the viscosity, enters the tilt only to the power 0.117. The engine's Reynolds number, 28247014.532194 against the printed 28240000, is the largest relative gap among the tilt steps, and still the tilt agrees to 1.92e-6.

## The distance

In three steps the text says the target is 50 m from the flame surface. The arithmetic in those steps uses 100 m, the distance from the pool centre given in the inputs. The numbers are right; the words describing them are wrong. Here the rule is to follow the arithmetic, and to measure the view factor distance from the axis of the flame base as the engine does.

## The view factor table

The book's Table 6.A.1 prints Raj view factors times 1000. Three hundred and three cells reproduce to the last printed digit. Two Fmax cells do not follow from their own printed Fh and Fv:

| table | X/R | L/R | printed | computed x 1000 |
| --- | --- | --- | --- | --- |
| Fmax | 1.2 | 0.1 | 210 | 201.303914 |
| Fmax | 1.4 | 0.2 | 117 | 177.287465 |

An erratum here is a printing error in a published source, found by computing the source's own inputs. It is neither a change to the engine nor a disagreement about physics. The engine takes the printed inputs where the printed answers depend on them, and it names the source in every basis block, so a reader can go back to the book and see each erratum for themselves.

## Exercise

Using the example's wind of 5 m/s and the engine's gravity constant, 9.80665, work out on your calculator what pool diameter makes u10^2 / (g D) equal 0.060060. Then open the fire panel's Yellow Book view, change the viscosity to 0.000015 m2/s and record the tilt. Write two sentences on how far the tilt moved and why.
