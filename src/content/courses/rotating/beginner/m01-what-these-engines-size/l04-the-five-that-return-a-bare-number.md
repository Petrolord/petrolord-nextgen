# The five that return a bare number

Most of the exports in these two modules return an object, which is what gives them somewhere to put an error string. Five of them return a bare number instead, so they have nowhere to put one at all.

{{panel:fc-pump-explorer}}

## The five

They are pumps.headFtToPsi, pumps.psiToHeadFt, compression.polytropicExponentRatio, compression.dischargeTempR and compression.actualInletCfm. Two of them are the pump conversions this tier uses later to turn a duty head into a discharge pressure and back again. The other three are small pieces of the compression chain.

What they have in common is their shape. Each takes a few arguments and hands back a single number, because that is what a caller of a conversion wants. Wrapping one in an object would make every use of it two lines longer.

## The contract they hold instead

They hold a documented NaN contract. When the inputs cannot be read, the return is NaN. It is never an Infinity, and it is never a plausible number. Those three clauses are the whole contract and each of them does work.

NaN is the right choice because it is the one value that cannot be mistaken for an answer. It fails every comparison, including a comparison with itself, and it poisons any arithmetic it touches, so a caller who ignores it gets a result that is visibly broken rather than quietly wrong.

An Infinity would be worse, because Infinity compares as larger than everything and survives some arithmetic looking like a bound. A plausible number would be worst of all, because nothing downstream could ever detect it.

## How a caller checks

A caller of one of these five tests the return for finiteness before using it. A caller of the other exports tests the error property. Both habits are cheap, and the Expert tier of this course walks all five of the bare-number exports and shows each one keeping its contract under inputs that cannot be read.

## Where the two contracts meet

The two conventions are consistent with each other rather than in tension. An object-returning export refuses in prose because it has a reader; a number-returning export refuses in a value because it has no room for prose. In both cases the engine declines to invent an answer, and in both cases the refusal is visible to a caller who looks.

## The mistake

Assuming a bare-number export validates the way an object-returning one does, and passing its result straight into a sum. A NaN added to a running total makes the total NaN, and the first place anybody notices is several steps further down, where the failure no longer names the input that caused it.

## Exercise

Name the five exports that return a bare number and say why an object would be awkward for them. Then give the three clauses of the NaN contract, and say what an Infinity return would cost a caller that a NaN return does not.
