# The unloading curve

The loading curve assumed effective stress only ever grew. This lesson is about the rock for which that is false, the curve Bowers gave it, and the two new parameters that curve needs. It is the last piece of machinery in the course; everything after it is comparison and judgement.

## Why velocity does not walk back down

Compaction is substantially irreversible. Porosity lost to grain rearrangement and pressure solution does not return when the load comes off; a shale squeezed to 10 percent porosity at 50 MPa of effective stress keeps most of that stiffness if the stress later falls to 10 MPa. Velocity, which rides on stiffness, therefore does not retrace the loading curve during unloading. It falls a little, from the elastic part of the response, the closing and opening of microcracks and grain contacts, but far less than the loading curve would demand.

On a velocity-against-stress plot, an unloading rock leaves the loading curve at the maximum stress it ever felt and follows a much flatter path back. That flat path is the unloading curve.

## The equation

$$V = V_{ml} + A\,\left[\sigma_{max}\left(\frac{\sigma'}{\sigma_{max}}\right)^{1/U}\right]^{B}$$

Two new parameters. $\sigma_{max}$ is the maximum effective stress the rock ever carried, the point where the paths part company; the golden fixture uses 50 MPa. $U$ is the unloading exponent, the measure of irreversibility, with the fixture at 3: the inner $1/U$ power flattens the stress response, so a big stress change makes a small velocity change on this path.

Two limits anchor the meaning, and the engine honours both exactly. At $U = 1$ the bracket collapses to $\sigma'$ and the equation IS the loading curve: no irreversibility, paths identical. And at $\sigma' = \sigma_{max}$ the bracket is $\sigma_{max}$ regardless of $U$: the unloading curve REJOINS the loading curve exactly at the point of departure. From the engine: vLoading at 50 MPa is 3919.263125861896 m/s, and vUnloading at 50 of 50 MPa is 3919.263125861896, the same double to the last bit.

## The curve in numbers

Unloading velocities with the golden parameters, sigma_max 50 MPa, U 3: at 5 MPa, 2870.9554403767565 m/s; at 10 MPa, 3125.808993287662; at 50, the rejoin at 3919.263125861896.

Put the loading values beside them: 1949.94 and 2240.35 at the same two stresses. The unloaded rock is enormously faster at low stress, 921 m/s faster at 5 MPa, because it remembers 50 MPa of history. And its velocity RANGE is compressed: dropping from 50 to 5 MPa, ninety percent of the stress, costs only $3919.26 - 2870.96 = 1048.3$ m/s on this path, where the loading curve spans $3919.26 - 1949.94 = 1969.3$ over the same stresses. Flatness IS the irreversibility, drawn.

## What the parameters demand

Neither new parameter is readable from a single log. $\sigma_{max}$ is history: on an uplifted well it is estimated from eroded-thickness reconstructions, exactly the decompaction arithmetic the Basin course runs; where unloading is by late pressure charging, it is commonly taken at the onset of unloading, often near the start of the velocity reversal. $U$ is calibrated where measured pressures exist in unloaded sections, typically quoted between 3 and 8, larger meaning more irreversible. The golden values, 50 and 3, are a clean teaching pair at the friendly end of that range.

This dependence on history is not a defect; it is the honest shape of the problem. An unloaded rock's velocity genuinely does not determine its stress without knowing where it came from, and any method that pretended otherwise would simply be hiding the assumption. Bowers puts the history on the label.

## Worked example

Evaluate the unloading curve at 10 MPa by hand, the graded inversion's forward twin. Inner bracket first, in SI before converting: $\sigma_{max}(\sigma'/\sigma_{max})^{1/U} = 50 \times (10/50)^{1/3}$ MPa $= 50 \times 0.5848035476425732 = 29.24017738212866$ MPa. Note what that number is: the unloading curve at 10 MPa reads the same velocity as the LOADING curve at 29.24 MPa, the bracket converting a real stress into its loading-equivalent. Then the loading machinery on 29.24017738212866 MPa: to psi, $4240.929178333972$; through the power and scale, to 3125.808993287662 m/s, which the engine confirms. The 29.240177382128643 from lesson 2's five-point table was this number: every unloading evaluation is a loading evaluation at a remapped stress.

## Exercise

Without computing: as $U$ grows from 3 toward 8 with $\sigma_{max}$ fixed, does the unloading velocity at 10 MPa rise or fall, and what does the limit of very large $U$ describe?

Self check: it rises. Larger $U$ makes the inner exponent $1/U$ smaller, pulling $(10/50)^{1/U}$ toward 1, so the loading-equivalent stress climbs toward $\sigma_{max}$ and the velocity toward the rejoin value of 3919.26. Infinite $U$ is perfect irreversibility: the rock keeps its maximum-stress velocity forever, a horizontal unloading path. The velocity at 10 MPa moving from 3125.81 toward 3919.26 as U grows is the quantitative face of "more irreversible", and it is why an assumed U is worth megapascals in the inversion, the subject of the next lesson.
