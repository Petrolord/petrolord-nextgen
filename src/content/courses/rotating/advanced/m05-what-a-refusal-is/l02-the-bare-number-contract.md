# The bare-number contract

Five exports in these two modules return a plain number. A plain number has nowhere to put an error key, so those five hold a written contract instead, and the contract is the only guard they can offer.

{{panel:fc-compressor-explorer}}

## The five, and what they promise

They are pumps.headFtToPsi, pumps.psiToHeadFt, compression.polytropicExponentRatio, compression.dischargeTempR and compression.actualInletCfm. Each is a small conversion, each returns a scalar, and the promise every one of them makes is the same: NaN when the inputs cannot be read, never an Infinity, and never a plausible number.

Each clause earns its place. NaN propagates through arithmetic rather than hiding, so a NaN that reaches a report is still visible when it gets there. Never an Infinity, because an Infinity looks like a very large answer and survives a finiteness test in the wrong direction. Never a plausible number, because a plausible number is the one failure a reader cannot catch.

## Kept, with a control beside it

| function | input | returns |
| --- | --- | --- |
| pumps.headFtToPsi | a gravity of zero | NaN |
| pumps.psiToHeadFt | a gravity of zero | NaN |
| pumps.psiToHeadFt | a readable case, as a control | 271.7647058823529 |
| compression.polytropicExponentRatio | an efficiency above one | NaN |
| compression.dischargeTempR | a suction temperature that is not a number | NaN |
| compression.actualInletCfm | a suction below absolute zero | NaN |
| compression.actualInletCfm | a state outside the compressibility window | NaN |
| compression.actualInletCfm | a readable state, as a control | 1069.0552909632156 |

## The control rows are the point

Read the two control rows against the rest. A contract that says NaN is worth nothing on its own, because a function that returned NaN for every input would satisfy it perfectly and compute nothing. The controls are what make the other rows mean something: the same functions return a real number when they can, and they decline only when they must.

That is the same discipline as a negative control on a gate. The evidence that a guard works is not that it fired. It is that it fired here and did not fire there.

The last two rows carry that further, because the same function appears on both. compression.actualInletCfm refuses a suction below absolute zero, refuses a state outside the compressibility window, and returns 1069.0552909632156 on a readable state. One function, two distinct reasons to decline and one reason to answer, all three demonstrated rather than asserted.

## Why they were left as bare numbers at all

Because they are conversions, and a conversion is used in expressions. A function returning an object would force every caller into unpacking for a single multiplication. The cost of that convenience is the contract, and the contract has to be documented and tested rather than assumed.

Note what a gravity of zero means on the two head conversions. It is not a near miss. A specific gravity of zero is a fluid with no density, the conversion between head and pressure divides by it, and there is no sensible number to return. Returning a zero or a very large figure would both be worse than declining.

## The mistake

The mistake is comparing against NaN. A NaN is not equal to anything including itself, so a test that asks whether the result equals NaN is always false and the bad value flows straight through. Test for finiteness instead.

The second mistake is assuming these five are guarded because the rest of the module is. They are guarded differently, and a caller has to check.

## Exercise

Name the five bare-number functions and state the three clauses of the contract they hold. Explain what the two control rows in the table are for, and say why testing a result against NaN by equality does not work.
