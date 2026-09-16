# A level the engine refuses

A liquid level of 0 is refused by name: SeparatorInputError on liquidLevelFrac, "liquidLevelFrac must lie strictly between 0 and 1 (got 0)".

{{panel:fc-slug-explorer}}

## The two ends of the range

| what was asked for | the engine's answer |
| --- | --- |
| a liquid level of zero | SeparatorInputError on liquidLevelFrac: "liquidLevelFrac must lie strictly between 0 and 1 (got 0)" |
| a liquid level of one | SeparatorInputError on liquidLevelFrac: "liquidLevelFrac must lie strictly between 0 and 1 (got 1)" |
| a segment area larger than the circle | { error: "the area must lie between zero and the full circle" } |

The word strictly is doing the work. A level of 0 is an empty drum with no liquid area to retain anything, and a level of 1 is a full drum with no gas space for anything to separate in. Neither is a separator, and the engine has no honest dimension to return for either, so it declines to return one.

## Two kinds of no

The first two answers are thrown. A SeparatorInputError carries an `input` property naming the input that was wrong, so the message points at the field on the form. No default, clamp or fallback stands in for a refused input.

The third answer is returned. An area outside the circle is a state the inputs were readable for and the method has no answer to, so it comes back as an object with an `error` string. The distinction is worth holding: a throw says the request was malformed, and an error object says the request was well formed and has no answer.

Both are honest, and both are different from a number. Code that catches the throw and carries on with a level of 0.500000 has turned a refusal into an assumption.

## What is accepted

Everything strictly inside the range is accepted and sized. The teaching drum runs at 0.200000, 0.300000, 0.400000, 0.500000, 0.600000 and 0.750000 without complaint, giving liquid areas from 7.156723 ft2 up to 40.438525 ft2 on the same 50.265482 ft2 of shell. A level of 0.200000 is a strange way to run a separator and the engine sizes it anyway, because it is a legitimate question about a real operating state.

## The mistake

The mistake is treating a refusal as a bug to be worked around. A level of 1 typed into a sizing sheet is usually a units slip, a percentage where a fraction belongs, and the fix is to type 0.500000 rather than to patch the guard. A level of 0 is usually an empty field read as a zero, which is the failure the guard exists to catch.

The second mistake is reading the refusal as being about the vessel. It is about the input. The drum may be perfectly sizeable at any level inside the range, and the engine is saying the number it was handed is not one of them.

## Exercise

Write the two refusal messages for a liquid level and name the property that tells you which input failed. Then say which of the three answers in this lesson is thrown and which is returned, and explain what that difference tells a reader about the input they typed.
