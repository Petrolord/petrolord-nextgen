# A second method

Everything in this course so far, three tiers of it, rides on one method. Eaton's ratio, however carefully run, is a single route from the sonic to a pressure, and a single route cannot check itself. This module adds the second route: Bowers' velocity-to-effective-stress relations. Two lessons of curve, one of units, one worked point, one inversion, and then module 5 turns the pair into the cross-check the tier exists for.

## Why a second method at all

The Professional tier's QC lesson ended with an honest limit: internal checks catch inconsistency, not shared error. Every check in that list would pass on a prognosis whose trend, exponent and screening were all wrong together in a coherent way. The only escape from shared error is a route that does not share it: different mathematics, different calibration parameters, different failure modes.

Bowers qualifies on all three. It has no compaction trend: normal is defined by a velocity-stress curve, not a depth curve. It has no Eaton exponent: its parameters are a coefficient and a power fitted to velocity against measured effective stress. And its failure modes are its own, as the module's last lessons show. Agreement between Eaton and Bowers is therefore evidence, not echo; disagreement is a diagnosis of which assumptions differ.

There is a second, equally practical reason the industry runs Bowers: it addresses the mechanism blindness that module 2 of the Professional tier catalogued. Eaton reads undercompaction only. Bowers comes in two forms, and the second one, unloading, exists precisely for overpressure that arrived AFTER compaction, the case Eaton systematically under-reads.

## The core idea

Bowers relates velocity directly to vertical effective stress:

$$V = V_{ml} + A\,\sigma^{B}$$

Velocity is mudline velocity plus a power law in effective stress. No depth appears. That absence is the whole difference from the trend-based world: two rocks at different depths carrying the same effective stress plot at the same point on the Bowers curve, whereas Eaton's machinery would treat them through different trend values.

Pore pressure then falls out through Terzaghi, the same partition as always: measure $V$, invert the curve for $\sigma$, and $PP = S - \sigma$ with the overburden supplied by the frame exactly as before. The frame is shared between the methods; the stress-from-velocity step is what differs, and that is the step where the errors live, so the sharing is acceptable.

## The parameters, and this course's values

$V_{ml}$ is the velocity of unconsolidated mudline sediment, defaulting to 5000 feet per second, of which more in lesson 3, since that unit is a story. $A$ and $B$ shape the power law and are calibration constants fitted per basin, exactly as Eaton's $n$ is; the golden fixture uses $A = 10$ and $B = 0.75$, and the capstone grades one point of the resulting curve: at 5 MPa of effective stress, the loading velocity is 1949.944709834568 m/s.

The unloading form adds two more parameters, a maximum past stress and an elastic exponent, and one more lesson's worth of meaning; module 5 owns it. This module stays on the loading curve, the form for rock whose effective stress has only ever increased.

## What agreement will mean

A preview of the payoff, so the module's work has its destination visible. At total depth this well's sonic reads 3691.0906301457703 m/s. Eaton, run the way three tiers have run it, says the effective stress there is 43.714487325732826 MPa. Bowers' loading curve, inverted at that same velocity with the golden parameters, will say 43.752391704220855. Two numbers from two mathematics, 0.038 MPa apart on a 43.7 MPa quantity: agreement to less than one part in a thousand. Module 5 unpacks what that does and does not certify; this module builds every piece the comparison needs.

## Worked example

Locate Eaton's TD state on the Bowers axes before knowing the curve, as orientation. From the frame and prognosis: effective stress $91.12306695073282 - 47.408579625 = 43.714487325732826$ MPa, velocity $10^6 / 270.92263512383806 = 3691.0906301457703$ m/s. So the point $(43.71\ \mathrm{MPa}, 3691.1\ \mathrm{m/s})$ is where three tiers of Eaton work say the bottom of this well lives. The entire question of module 5 is whether the Bowers loading curve passes through that point. Hold the picture: one point from the old method, one curve from the new, and the vertical distance between them is the cross-check.

## Exercise

Before learning the curve: from the one Bowers equation above, state qualitatively what happens to velocity as effective stress rises, what velocity a rock at zero effective stress has, and why the second answer makes physical sense.

Self check: velocity rises with effective stress, since $A$ and $B$ are positive, with a decelerating slope because $B$ is below 1. At zero effective stress the power term vanishes and the velocity is the mudline velocity, 5000 ft/s: a sediment carrying no grain load is as slow as fresh mudline ooze, whatever its depth. That limit is the equation quietly asserting that velocity tracks STRESS rather than burial, which is exactly the property that makes it a second, independent method rather than a re-dressed trend.
