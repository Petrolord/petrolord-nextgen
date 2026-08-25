# What this tier adds

The Associate tier built a container with no wells in it. Three surfaces arrived on three different grids, you resampled them onto the 25 by 20 frame, clamped the stack, differenced it into two zones and read 45,000,000 m3 of gross rock out of zone A. Every number in that chain came from surfaces, and surfaces come from interpretation. Nothing in the model has yet been compared against rock.

This tier makes that comparison. Four wells are drilled through the golden model, each with a set of formation top picks, and the tier's single deliverable is the tie table: for every pick in every well, how far is the framework surface from where the well actually found the formation?

## Why that needs a trajectory

The comparison sounds trivial. A well says TopA is at some depth; the surface says TopA is at some depth; subtract. The reason it fills a tier is that a well does not report depths in the model's coordinate system. A well reports measured depth, which is distance along the hole from the kelly bushing, and the hole is not a vertical line.

Three of the four wells here are vertical, and for them the conversion is one subtraction. The fourth, W2, carries a real deviation: it holds vertical to 1200 m of measured depth, builds to 45 degrees over the next 300 m, and then holds that angle. By the time W2 reaches its deepest pick it is 295.72473168191937 m east of its surface location. Comparing that pick against the surface directly below the wellhead would be comparing rock in one place against a map in another.

So the tier has two halves. First, turn each well's survey into a three dimensional path, using minimum curvature, the standard of the industry and of this engine. Second, land every pick on that path, read the framework surface at the landing point, and difference the two.

## The headline you already know

The Associate tier's closing lesson told you the answer to one question this tier asks: the worst residual in the well set is the deviated well's BaseB at 45.028 m. You know the number and you know the slogan, that deviation moves the bottom of the hole.

What this tier adds is the mechanism, and the mechanism turns out to be less tidy than the slogan. Two vertical wells in this same set carry BaseB residuals of 37 and 36 m, nearly as large, and deviation cannot be the reason for those. Working out what is actually in the BaseB column, and how much of W2's 45.028 is trajectory and how much is something else, is where this tier earns its keep.

## What is graded

The capstone asks for six numbers, all of which this course derives and the panel displays: W2's TVDSS at its TopA pick (1496.6634373420557 m), three residuals from the tie table (W1 BaseB, W2 TopB, W3 TopA), the largest absolute residual in the set, and the x coordinate of W2's zone A control point, which is where the well's zone A information will sit when the Expert tier populates properties.

That last item is the bridge upward. A control point is a location, and for a deviated well the location is not the wellhead. The Expert tier inherits the consequences.

## Worked example

W1 is vertical with a kelly bushing 25 m above sea level, and its TopA pick is at 1530 m measured depth. Along a vertical hole, measured depth and true vertical depth are the same thing, so the pick sits 1530 m below the bushing, which is 1530 minus 25, or 1505 m below sea level. The framework's TopA surface at W1's location reads 1507 m. The residual is 1505 minus 1507, which is minus 2 m: the well found the formation 2 m shallower than the surface predicted.

That is the whole tier in one vertical well. Everything else is what happens when the hole stops being a vertical line.

## Exercise

W3 has a kelly bushing 20 m above sea level and picked TopB at 1625 m measured depth; the framework's TopB at W3 reads 1598 m. Compute the residual and state its sign convention in words. Then write one sentence saying why this arithmetic would be wrong for W2.
