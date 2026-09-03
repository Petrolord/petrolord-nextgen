# What the geometry refuses

Eight inputs the skin calculation will not accept, and why each is a data error rather than a design.

{{panel:ps-shot-explorer}}

## The four that must be positive

A perforation length, a perforation radius, a shot density and a wellbore radius. Each is refused by name if it is zero or negative.

None of the four can be zero in any physical arrangement. A zero length is no perforation; a zero density is no perforating; a zero wellbore radius is no well. Each would also produce a division by zero or a logarithm of zero somewhere downstream, and a silent infinity is much harder to spot than a named refusal.

## The permeability ratio

The horizontal to vertical permeability ratio must be positive. A zero or negative anisotropy has no meaning, and it appears inside a square root.

## The phasing

Refused unless it is one of the six angles in the published table, and the message names all six.

This is the refusal most likely to annoy a user, because thirty degrees is a real gun phasing that exists in the world. The refusal is still correct: the seven constants per angle are a fitted set and interpolating between two fitted sets is not the same as fitting the angle between them.

## The crushed zone pair

The crushed zone radius must EXCEED the perforation radius, because a damage ring inside the tunnel is not a ring. And the permeability ratio must be at least one, because the crushed permeability is by definition the damaged one and cannot be better than the rock.

The second is the interesting refusal. A ratio below one would give a NEGATIVE crushed-zone skin, which is a tunnel surrounded by rock better than the reservoir. That is not a physical outcome of shooting a hole, and returning it would make a damaged completion look stimulated.

## The pattern

Every one of the eight would produce a number if it were allowed through, and every one of those numbers would be believable. That is the test for whether an input should be refused rather than warned about: not whether the arithmetic survives it, but whether a reader could tell from the output that something was wrong.

## Exercise

List the eight refusals and, for each, the wrong number it prevents.

Say which one you think is most likely to be hit by a legitimate user with a legitimate design, and what you would do about it.

Then explain why a permeability ratio below one is refused rather than computed.
