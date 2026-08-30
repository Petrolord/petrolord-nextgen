# Cuts, merges and gaps

Three things the profile builder does with the depth intervals it is given.

{{panel:cd-clearance-explorer}}

## Cuts

The profile is cut wherever anything changes: a section boundary within a string, the top of an inner string, the bottom of one.

It is not cut anywhere else. There is no fixed depth step and no resampling. That matters because a resampled profile would introduce depths that no string actually has, and a clearance reported at such a depth would be reported at a fiction.

## Merges

Adjacent intervals with the same bore and the same label are merged into one.

Without merging, a program entered as ten consecutive sections of identical casing would produce ten profile rows, and a reader would reasonably conclude something changed nine times. Merging makes the row count meaningful: a change in the profile is a real change in the well.

The merge tests both the bore and the label, so two different strings that happen to share a bore stay as two rows. That is deliberate: the label is what a failed check reports, and merging across strings would make the report ambiguous.

## Gaps

A program that does not cover an interval leaves a gap, and the profile does not invent anything to fill it.

Ask for the governing drift below a gap and the answer is nothing rather than a number. Not zero, which would be a bore that stops everything, and not the bore above the gap, which would be a guess.

## Why the gap answer is nothing rather than a guess

Consider a program consisting only of a liner from twenty four hundred metres down. Ask what governs at twenty eight hundred metres, and the honest answer is that we do not know what is between surface and twenty four hundred.

The liner is the innermost thing at the depth asked about, so a naive answer would be the liner bore. That answer is wrong whenever anything above the liner is tighter, which is the normal case, since the liner is the smallest string in most wells.

Returning nothing forces the caller to notice that the program is incomplete.

## What that costs downstream

The volume calculation, which also reads the profile, does not stop at a gap. It skips the interval and warns, naming the depths. That is a different choice from the clearance check and it is deliberate, because a partial volume with a named hole is useful and a partial clearance verdict is not.

## Exercise

Write down what triggers a cut, what triggers a merge, and what a gap returns.

Then explain, in two sentences, why the gap answer is nothing rather than the bore of the nearest string.

Finally, say why the merge compares labels as well as bores.
