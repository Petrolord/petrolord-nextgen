# Primary and secondary

Which envelope an element serves is not a property of the element. It is a decision somebody made and wrote down.

{{panel:wi-envelope-explorer}}

## The field, and what it accepts

Every element carries an envelope assignment, and the engine accepts exactly three values: primary, secondary, or both. Anything else is refused, with the offending element named in the error.

That refusal is deliberate. There is no default and no inference. The engine will not look at a packer and decide for itself that packers are primary, because in the next well the same packer might be doing a different job.

## What each envelope is for

The primary envelope is the one in contact with the pressure source. It is the first thing between the reservoir and everywhere else, and in a producing well it is largely the production path: the cement and casing across the sand, the packer, the tubing, and the valve that shuts the tubing in.

The secondary envelope is the backup. It contains the fluid if the primary lets go, which means it has to be outside the primary, wrapping it. In a producing well that is typically the annulus side: the casing and its cement, the wellhead, the hanger that seals the tubing into it, and the tree on top.

The published teaching well is exactly this shape. Five elements in the primary, five in the secondary.

| Envelope | Elements |
|---|---|
| primary | production casing cement, production casing below the packer, production packer, completion string, downhole safety valve |
| secondary | intermediate casing cement, production casing, wellhead, tubing hanger, Christmas tree |

## The same steel in two roles

Read those two rows again and notice the production casing. It appears in the primary as the section below the packer and in the secondary as the string itself.

That is not sloppiness. Below the packer the casing faces reservoir pressure directly and is part of the first line. Above the packer the same physical string faces the annulus and is part of the second. Two elements, two jobs, two status entries, one piece of steel with a packer between the roles.

This is the point of the assignment being a recorded decision. A drawing that treats the string as one element cannot express the split, and an engine that inferred the envelope from the kind could never have got it right. The engineer decides where the boundary is, and the record carries it.

It also raises the obvious question. What happens when the two roles are not separated by a packer, when one element genuinely is in both envelopes at once? That is the next lesson, and it is the one that matters most.

## Exercise

In the panel, take each of the ten published elements and say in one sentence why it sits in the envelope it sits in. Argue the case for the two casing entries carefully.

Then try assigning an element to something other than the three accepted values and read the error the engine returns.
