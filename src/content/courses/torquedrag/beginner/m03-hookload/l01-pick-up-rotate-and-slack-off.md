# Pick up, rotate, slack off

Three numbers a driller writes down at every connection.

{{panel:td-string-explorer}}

## The three

**Pick up.** The hookload while pulling the string out of the hole. Friction opposes the motion, so it acts downward, and it ADDS to what you have to lift.

**Rotate off bottom.** The hookload while turning the string with no axial motion. Friction is entirely tangential, so it contributes nothing axially, and the hookload is the free-hanging weight.

**Slack off.** The hookload while running in. Friction now acts upward, holding part of the string's weight, so it SUBTRACTS.

Pick up is always the largest and slack off is always the smallest, with rotating in between. That ordering is not a convention; it comes out of the sign of the axial friction term.

## On the slant well

| operation | hookload |
|---|---|
| pick up | 1103695.4071581454 N |
| rotate off bottom | 819840.7115634651 N |
| slack off | 604424.8115063506 N |

Read the middle row against the string's buoyed weight, which is 997579.5357839314 N.

They are not equal, and that is worth pausing on. Rotating off bottom removes the axial friction, so the hookload should be the free-hanging weight. It is not, because in an inclined hole part of the string's weight is carried by the wall rather than by the string above it: the weight resolved ALONG the hole is w cos(theta), not w.

So the rotating hookload is the integral of w cos(theta) along the string, which on a 40 degree slant is substantially less than the total buoyed weight.

## The two drags

    pick-up drag = pick up - rotating = 283854.6955946804 N
    slack-off drag = rotating - slack off = 215415.90005711443 N

They are not equal, and they are not expected to be. Friction acts on the same normal force in both cases, but the TENSION that produced part of that normal force is different: tripping out puts more tension in the string, which presses it harder into the curves, which produces more friction.

That feedback is why the model is a recursion rather than a formula.

## The swing

    total swing = pick up - slack off = 499270.5956517948 N

Half a meganewton on a 3000 m well. That is the number that tells you how much of what the hook reads is friction rather than steel.

## Why a driller records all three

Because their DIFFERENCES are the diagnostic. The absolute values drift as the string gets longer; the differences track the state of the hole. A slack-off drag that grows over a few connections while the pick-up drag stays put says something specific, and the Professional tier is where that reading is taught.

## Exercise

For the build-and-hold well, read the three hookloads from the panel and compute both drags and the swing.

Then compare the rotating hookload against that well's buoyed string weight of 1130213.5695338733 N, and explain the gap in one sentence using the cosine of the hold angle.
