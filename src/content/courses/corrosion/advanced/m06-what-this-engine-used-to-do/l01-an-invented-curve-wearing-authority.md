# An invented curve wearing authority

This module is the one place in the course whose subject is what this engine did before the repair that preceded the course. Everything else you have read describes the engine as it ships. Here the tense changes, and each item is a general lesson that happens to have an example in this file.

## What was there

Before the repair this engine computed a sour-service severity region from an expression of its own, labelled it with the names of two standards, and served three named material recommendations off it: what steel to buy, when to control hardness, and when to qualify weldments.

Four measurements settled what the expression was worth. Moving its pH pivot by a whole unit left the validation suite entirely green. Widening one of its region boundaries by a factor of two left the suite green. A missing pH made the expression not-a-number, both of its comparisons failed, and it fell through to the hardest material recommendation in the file from an input nobody had supplied.

## The general lesson

Here is the part that outlives this engine. A calculation can be wrong in a way that no amount of measurement repairs, because the number was never the claim. If a curve is labelled with a standard's name, the claim being made is that this is what the standard says. Retuning the curve does not make that claim true. It makes a different unsourced curve carry the same false attribution, with a fresh coat of confidence on it.

Compare the two failure modes carefully, because they are easy to merge. A fit that is wrong by a factor of two in a coefficient is a tolerance problem, and you fix it by measuring. A fit that is invented and then dressed in somebody else's authority is a different kind of thing. The only honest repair available is to withdraw the claim and say that the thing is not provided.

## What is there now

The function is gone, nothing replaces it, and the absence is current, permanent and declared. The engine returns `regionProvided` false and `materialGuidanceProvided` false today and will keep doing so, so a caller cannot read the gap as an unset property. Reading this as something the engine might get back is a misreading of what was decided.

The absence is proved three ways and each is a separate check. The region function is not exported, so asking for its type gives undefined. None of the three material guidance strings and neither standard name appears anywhere in the 775 lines of the engine source. And no returned string anywhere in three whole screenings names either standard.

The threshold value the screen still uses stayed exactly where it was, at 0.003500000000 bar. Changing a live number without a source would have been the same mistake with the sign flipped, so the engine keeps the number, declares it held in a field, and prints it in both units so nobody has to convert.

## Exercise

Write down the two failure modes side by side, one repairable by measurement and one not, and give the test that tells them apart. Then take the three proofs of absence and say what each one would catch that the other two would miss.
