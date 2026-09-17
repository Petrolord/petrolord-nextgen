# The horizontal velocity, and half a rule

The cut size is not the constraint that sizes an API 421 basin. This lesson is about the one that usually does.

## Why a fast basin fails at a good cut size

Oil that has risen to the surface of a basin has been separated. If the water underneath it is moving quickly enough, that oil is dragged back down into the bulk and carried out with the effluent. The device has done the separation and then undone it. No cut size calculation can see that happening, because the cut size question is only about whether a droplet can reach the top. Re-entrainment is a separate failure with a separate criterion, and a basin can be excellent by one and unacceptable by the other.

## The check, on the same basin

Take the two rows from the last lesson again:

| water depth m | cut micron | horizontal velocity m/s | residence s | warning |
| --- | --- | --- | --- | --- |
| 1.4 | 165.003927 | 0.014154851756 | 706.471546 | none |
| 0.9 | 165.003927 | 0.022018658288 | 454.160279 | the horizontal velocity above its limit |

Both basins cut at 165.003927 micron. The shallower one runs the water through at 0.022018658288 m/s against a fixed limit of 0.015000 m/s, and the engine says so. The residence time falls from 706.471546 s to 454.160279 s at the same time, which is the same fact read another way: the same flow through a smaller cross section moves faster and stays a shorter time.

## Reading the two answers together

This is the reason the depth was worth following after it dropped out of the cut size. A designer who optimises the footprint alone will find a shallow basin that appears to cut exactly as well as a deep one and costs less to build. The cut size column agrees. The velocity column is where the design fails, and it is reported on the same return precisely so that the two are read together. This is the clearest example in the tier of a headline answer that is true and incomplete.

## The half of the rule this module applies

There is an important honesty here. The module applies the fixed velocity half of the API 421 horizontal velocity rule and it says so on every return that carries the check, by marking the rule as incomplete. The second half of the published rule is not in this repository, so the engine does not apply it and does not pretend to.

That matters in both directions. A basin that fails this check has failed a real criterion and the failure is meaningful. A basin that passes it has passed one half of a published rule, and passing half a rule is not passing the rule. The engine could have quietly implemented one part and reported a clean verdict, and a reader would never have known which criterion had actually been applied to the design.

{{panel:pw-water-explorer}}

## Exercise

Explain why a basin can have an acceptable cut size and still be the wrong basin. Then say what the module is telling a reader when it marks its own velocity rule as incomplete, and what a designer should do with a basin that passes it.
