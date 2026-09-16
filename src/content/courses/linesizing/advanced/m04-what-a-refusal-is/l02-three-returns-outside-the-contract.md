# Three returns outside the contract

Three returns in this engine break the rule the last lesson set out, and all three do it deliberately. Knowing which three, and why each one had no alternative, is what separates a designed exception from an oversight.

{{panel:fc-liquid-explorer}}

## The three

| the call | what it returns |
| --- | --- |
| the Reynolds number of a line with no viscosity | NaN |
| the volume of a line with no bore | NaN |
| the friction factor at a negative relative roughness | {"f":null,"regime":"invalid"} |

## Why each one is outside

The Reynolds number and the line volume are bare numbers. Each function returns a single value with no structure around it, so there is nowhere to put a message. They answer NaN by documented contract, and the functions that wrap them are what refuse in words. A caller who goes through the ordinary entry points never sees the bare NaN at all.

The friction factor is different. It already returns an object with a regime field in it, so its refusal rides in the field that was there anyway. The regime comes back as "invalid", which is a word no valid flow ever produces, and the friction factor beside it is null.

That third one is the tidiest of the three, because the refusal lands in a field a caller is already reading.

The pattern behind all three is worth naming. Where a function has room for a message it refuses in words, and where it has none it returns a value that cannot be mistaken for a pressure or a rate and leaves the words to whatever wraps it. Neither of the two bare numbers is reached through the ordinary entry points, so the exception is contained by the design rather than by a convention somebody has to remember.

## The trap worth carrying out of this lesson

A NaN has no JSON spelling.

Serialise any of these three and the first two print as null, because that is what encoding a NaN does. The engine returned NaN. Null is what printing it produced. The third genuinely contains a null, in a field the engine set to null on purpose.

So in a log line, an API response or a saved case file, all three look the same. Two of them are a number that is not a number and one of them is a deliberate null, and the record cannot tell them apart. The regime field is the only thing that distinguishes the third, which is another reason that design is the better one.

## The mistake

The mistake is reading a null in a stored payload as the engine having returned null. It may be a NaN that went through an encoder, and the difference matters as soon as anybody tries to reproduce the call.

The second mistake is reaching past a wrapping function to the bare primitive underneath, for speed or convenience. The words are in the wrapper. Call the Reynolds number directly with a missing viscosity and the refusal that would have named the missing input is gone, replaced by a value that will propagate quietly.

## Exercise

Name the three returns that sit outside the refusal contract and give what each one returns. Then say why the two bare numbers had no alternative, why the friction factor's refusal is the tidiest of the three, and explain what happens to all three when they are serialised.
