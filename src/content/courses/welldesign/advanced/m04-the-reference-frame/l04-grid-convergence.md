# Grid convergence

The angle a map projection introduces, and where it is zero.

## What it is

A map projection flattens a curved earth onto a plane. Meridians, which converge at the pole on the earth, cannot all be parallel on the map.

In a transverse Mercator projection, which is what most oilfield grids use, the central meridian is drawn as a straight vertical line and every other meridian curves away from it. So true north, which is along the meridian, is not parallel to grid north, which is along the map's vertical, except exactly on the central meridian.

Grid convergence is that angle.

## Its size

Approximately

    convergence = (longitude - central meridian longitude) x sin(latitude)

So it is zero on the central meridian, grows away from it, and grows with latitude.

In a standard UTM zone, six degrees wide, the maximum offset from the central meridian is three degrees. At 60 degrees latitude that is about 2.6 degrees of convergence. At the equator it is zero regardless of longitude.

## Why it is not negligible

2.6 degrees at 3000 m of horizontal displacement is 136 m.

That is more than twice the whole lateral uncertainty of the validation well in the Professional tier. A survey referenced to the wrong north is displaced by more than its uncertainty, systematically, with no symptom in the data.

## Where it bites

**At the edges of a projection zone.** A field near a UTM zone boundary has a large convergence, and fields that straddle a boundary have wells in two grids.

**At high latitude.** The sine of the latitude multiplies it.

**On custom grids.** Many operators use a field-specific projection with its own central meridian chosen near the field, which makes convergence small everywhere in the field. That is why the standard clearance examples can use zero convergence: the grid was chosen for the field.

## Convergence is not declination

They are different angles between different pairs of directions, from different causes.

Declination is physics: where the magnetic field points. It changes with time.

Convergence is cartography: how the map was drawn. It does not change with time and it is computable exactly from the projection parameters.

Adding them and calling the result a correction is a real and common error. They are applied at different steps: declination converts magnetic to true, convergence converts true to grid.

## The total correction

    grid azimuth = magnetic azimuth + declination - convergence

The combination is sometimes called grid variation or grid magnetic angle, and it is what a survey provider applies in one step. Reporting it as a single number is fine; forgetting that it has two components with different behaviour is not.

## The check

The panel's magnetics view lets a convergence be entered alongside a declination and shows all three azimuths for the same magnetic reading.

Watching the three numbers move as the convergence changes is the fastest way to fix the sign convention in mind, and the sign is the part that gets implemented backwards.

## The misconception to avoid

"Grid north and true north are the same for practical purposes." At the centre of a well-chosen field grid, yes. Near a zone boundary at high latitude the difference is degrees, which is more than the survey uncertainty, and the two wells being compared may not even be in the same zone.

## Exercise

A field sits at 58 degrees north, 2.5 degrees east of its projection's central meridian.

Compute the grid convergence. Then compute the lateral displacement at 3500 m of horizontal reach if a survey referenced to true north were treated as grid north, and compare it against a 50 m target radius.
