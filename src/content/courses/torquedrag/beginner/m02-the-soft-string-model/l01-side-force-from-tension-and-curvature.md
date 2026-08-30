# Side force from tension and curvature

Where the normal force comes from, and why it is a product.

## The picture

Take a short element of the string, length ds, lying in a hole that curves. Tension T pulls on it from below and from above. If the two pulls are not parallel, their resultant is a force pressing the element against the wall.

The size of that resultant is the tension times the angle between the two pulls. Over an element of length ds in a hole with curvature k, the angle is k ds, so:

    normal force from tension = T k ds

That is the whole idea. A string under tension going around a corner presses on the corner, exactly as a rope around a bollard does.

## The consequence

Side force is a PRODUCT of tension and curvature. Both have to be present.

A straight hole has no curvature, so no matter how much tension the string carries, there is no side force from it. A slack string in a sharp dogleg has curvature and no tension, so again nothing.

The place where side force is largest is where a highly tensioned string passes through a bend, which in a real well is the build section, near the top of it, where the string above is heaviest.

## Why that is counter-intuitive

Most people expect the worst friction to be at total depth, because that is where the hole is longest and most deviated.

It is not. At total depth the tension is small, because there is very little string below that point to pull on. The side force there is dominated by the second source, which is the next lesson. The tension-times-curvature term peaks near the top of a build, and on the build-and-hold well the worst side force while tripping in is 1167.5116395360324 N per metre.

## The formula the engine uses

Over each interval the engine forms

    N = hypot( T dPhi sin(theta),  T dTheta + w ds sin(theta) )

with theta the inclination, dTheta the change in inclination, dPhi the change in azimuth, w the buoyed weight per metre and ds the interval length.

Read the two components. The first is the azimuth-turning term, scaled by the sine of inclination because a turn at low inclination barely bends the string. The second is the inclination-building term plus the weight component. They combine as a right-angled triangle because they act in perpendicular directions.

## The tension in that formula

Notice it is the tension at the MIDDLE of the interval, predicted from the tension at the bottom plus half the weight contribution. The engine does that deliberately: using the end-point tension would make the recursion first-order accurate, and the midpoint predictor makes it second-order.

That choice is worth remembering. Module 5 measures what it costs.

## Exercise

A string carrying 400 kN of tension passes through a build of 3 degrees per 30 m. Compute the side force per metre from the tension term alone.

Then repeat it for 40 kN of tension in the same build, and say in one sentence where in a well each of those two cases occurs.
