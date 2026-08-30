# The two sources of side force

Curvature, and the weight of a string that is not vertical.

## The second source

The first source needs curvature. The second does not.

A string lying in a straight but inclined hole is pressed against the low side by its own weight. The component of weight perpendicular to the hole is

    w ds sin(theta)

with theta the inclination. At zero inclination it is zero, at 90 degrees it is the whole weight.

That is why a horizontal well has friction in a perfectly straight lateral: every metre of pipe is lying on the bottom of the hole under its own buoyed weight.

## The two together

| where | curvature term | weight term |
|---|---|---|
| vertical hole | zero, no curvature | zero, sin 0 is 0 |
| straight tangent at 40 degrees | zero | w sin 40, about 0.64 w |
| build section under load | large | moderate |
| horizontal lateral | zero | w, the full buoyed weight |

Read the first row. In a vertical well BOTH terms vanish, which is why the vertical well in this course has no drag at all, and why its hookload is a closed form.

Read the last row. In a horizontal lateral there is no curvature and the weight term is at its maximum. The drill pipe here is 265.26806749988424 N per metre buoyed, so every metre of lateral presses that hard against the low side.

## Which one dominates where

On the build-and-hold well, tripping in, the worst side force is 1167.5116395360324 N per metre, and it sits in the build section: that is the curvature term, driven by the tension of everything above.

On the horizontal well rotating on bottom, the worst is 1288.2065631957541 N per metre, and that is the collars in the lateral: pure weight term, and it happens to equal the collars' buoyed weight per metre exactly, because at 90 degrees the sine is one and the curvature is zero.

That equality is a good check. If a side force in a horizontal section is not equal to the local buoyed weight per metre, either the hole is not straight there or something is wrong.

## What is NOT a source

Hydraulic forces. Piston effects. Thermal expansion. The stiffness of the pipe pushing outward in a dogleg.

The first three are absent from this model entirely. The fourth is the soft-string assumption: a stiff string would develop extra contact force at the tangency points of a dogleg, and this model spreads that force smoothly instead.

## Exercise

Take the horizontal well's drill collars, 160.87051759 kg/m in 1440 kg/m3 mud, and compute their buoyed weight per metre.

Confirm it equals the worst side force per metre the panel reports for the horizontal well rotating on bottom, and say why that confirmation is only available in a horizontal section.
