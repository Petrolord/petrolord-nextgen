# Minimum wall, nominal weight

Which of the catalog numbers are real, and which are labels.

## The idea

A catalog row carries four numbers, and they do not all mean the same kind of thing.

## The nominal weight is a name

53.5 pounds per foot is what the row is CALLED. It is close to the steel area times the density, but it is a rounded published figure, and the rounding is not the same on every row.

The engine uses it in exactly one place: to compute the weight of the string hanging in the hole. It never uses it to reconstruct the wall, and it never checks it against the geometry.

## The wall is real

Every rating in this course is computed from the wall, and the catalog's own integrity test asserts that the inside diameter plus twice the wall reconstructs the outside diameter to within 5 mm, which is the API rounding tolerance and not a tighter one.

That tolerance is worth noticing. The published table rounds the wall and the inside diameter separately, so they do not reconstruct the outside diameter exactly, and any code that derives one from the other will disagree with the table by a fraction of a millimetre.

## Minimum wall, for burst only

The burst rating is computed as though the wall were 12.5 percent thinner than the catalog says.

That is not the catalog being wrong. It is the rating carrying the manufacturing tolerance so that the number applies to every joint rather than to an average one.

## Which is which, in one table

| number | kind | used for |
|---|---|---|
| outside diameter | real, and it is the hole size constraint | every rating |
| wall | real | every rating |
| inside diameter | real, and it is the next hole constraint | area, and drift |
| nominal weight | a label, plus a hanging weight | the axial profile only |
| grade name | a label | one yield lookup |

## The drift diameter

There is a fifth number a real catalog carries and this one does not: the DRIFT diameter, which is the largest mandrel guaranteed to pass through the joint, and it is smaller than the nominal inside diameter.

Anything that has to be run through the casing is sized against the drift, not against the inside diameter. That is a real omission from this engine and it is worth knowing where the boundary of the model is.

## Exercise

Take the 9-5/8 inch 47 lb/ft row: outside diameter 0.244475 m, wall 0.0119888 m, inside diameter 0.22049739999999998 m.

Check whether the inside diameter plus twice the wall gives the outside diameter exactly. Then say which of the three numbers you would trust if the three of them were inconsistent by a millimetre.
