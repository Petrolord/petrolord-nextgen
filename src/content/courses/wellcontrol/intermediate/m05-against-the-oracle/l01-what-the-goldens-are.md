# What the goldens are

Two wells, two scenarios and one hand-built example.

{{panel:wc-volume-explorer}}

## The contents

For each of the two wells: the volumes and the two depths and two capacities; two kill sheets with their four outputs, their influx and their full pressure schedule; a kick tolerance with both its cases; and a sweep of kick tolerance against mud weight.

Plus a separate hand-constructed example with round numbers.

## Where the two wells came from

An independent implementation: a span walk over the same geometry, an IWCF-convention kill sheet, and the same MAASP and single-bubble kick tolerance, written separately.

The file asks for a relative tolerance of 1e-6.

## Where the hand example came from

A person, with a calculator, choosing round numbers so that every answer has a closed form.

That is a different kind of check and it is the more valuable of the two.

## Why both

The independent implementation catches coding errors: a sign, a unit, a misread formula.

The hand example catches something the implementation cannot, because both implementations could share a misreading of the convention. A case whose answers can be verified by arithmetic settles that.

## What this course has that the previous ones did not

A closed-form case. The torque and drag course had one, the hydraulics course had none, and this one has a whole example built for the purpose.

That is a genuinely stronger position than either.

## The agreement

Better than 1e-6 on every value in both wells, and exact on the hand example's round numbers.

## What is checked

Over a hundred values: six volume quantities per well, seven summary fields per kill sheet per scenario, both influx quantities, twenty-two schedule points per sheet, six kick tolerance quantities per well, and nine sweep points per well.

## Exercise

Open the panel's hand example view and read the inputs.

Note which of them are round numbers and which are not, and say what the author was choosing for and what they were prepared to leave awkward.
