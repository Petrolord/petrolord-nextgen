# When settling has no answer

Some inputs are valid numbers describing a situation the method cannot size. Those come back as an object carrying an error string rather than as a thrown refusal, so the caller can show them beside the other results.

{{panel:fc-separator-explorer}}

## The two settling dead ends

A gas at least as heavy as its liquid gives { error: "settling needs a positive K and a liquid denser than the gas" }. The density difference has gone to zero or turned negative, the square root has nothing real to return, and there is no terminal velocity to report.

A vertical vessel asked to size on a settling velocity of zero gives { error: "a positive settling velocity is needed" }. The required area is the rate over the velocity, and dividing by zero would report a vessel of infinite diameter.

Neither is a typing error. Both are the method reaching a state it has no answer for.

## Why these arrive as data

A thrown SeparatorInputError stops the run and names an input to fix. A returned error object lets the rest of a result stand. That matters in a sweep, where one candidate lands in an impossible state: the others still return their numbers, and the failed one carries its reason.

| kind | what it means | how it arrives |
| --- | --- | --- |
| SeparatorInputError | an input is missing or out of domain | thrown, naming the input |
| an error string | the inputs are valid and the method has none | returned, beside the results |

## When a gas really can be as heavy as a liquid

The condition is not academic. Density difference shrinks as pressure rises, and near the critical region of a rich gas the two phases converge. A separator designed for those conditions is not a gravity separator in any useful sense.

Reaching it accidentally is more common than reaching it physically. Typing a gas density in the same units as the liquid, or swapping the two arguments, produces exactly this state, and the message tells you which comparison failed.

## The neighbouring refusals

Settling is guarded on its inputs before it reaches either dead end. A K given as zero is refused outright with "kOverride must be a positive K in ft/s when it is given (got 0); leave it out to use the published table". The zero velocity error is therefore reached from the vessel side, where a velocity computed elsewhere is handed in.

## The mistake

Substituting a small number for the impossible one. Sizing a vertical vessel on a settling velocity of a thousandth of a foot per second rather than on zero returns a diameter, and it is a diameter derived from a state the method has already said it cannot describe. The error string is the answer.

## Exercise

Write the two returned error strings and say what state each describes. Then explain why these come back as data while a missing gas gravity is thrown, and say which behaviour is the right one when a dozen candidate diameters are being sized at once.
