# A threshold cleared by nothing

The branch fires strictly below 1000.0 psia. Its sentence used to print a pressure that read as sitting exactly on the limit, under a branch that never fires there.

{{panel:pd-remedy-explorer}}

## The collision

The reason string rounded the pressure it branched on to a whole number.

| Pressure, psia | Correlation | Printed whole | Printed to one decimal |
| --- | --- | --- | --- |
| 999.04 | coleman | 999 | 999.0 |
| 999.88 | coleman | 1000 | 999.9 |
| 999.96 | coleman | 1000 | 1000.0 |
| 1000.00 | turner | 1000 | 1000.0 |
| 1000.04 | turner | 1000 | 1000.0 |
| 1000.50 | turner | 1001 | 1000.5 |

A well at 999.88 psia printed "At 1000 psia wellhead this well sits inside the low-pressure range Coleman's data covered", a claim about a pressure that would have returned turner. A reader cannot tell a display artefact from a branch that fired the wrong way, and here only the display was wrong.

## What one decimal bought

The fix prints one decimal, so 999.88 psia now reads "At 999.9 psia wellhead this well sits inside the low-pressure range Coleman's data covered, where the unadjusted equation fitted better." The collision narrows by ten and does not close: anything inside 0.05 psi of the limit still renders as the limit. At 999.96 psia the sentence prints 1000.0, the limit prints 1000.0, and the branch still returns coleman. That pressure is 0.0400 psi from the limit, against 0.9600 psi for 999.04 psia.

The same change made the station a caller argument, because the sentence hardcoded the word wellhead for whatever station it was handed. With no label at 1500.00 psia it reads "At 1500.0 psia wellhead this well is above the range Coleman studied"; with a label, "At 1500.0 psia at the 7,500 ft shoe this well is above the range Coleman studied".

## The second defect the fix introduced

Display-only in intent is not display-only in effect. Rounding a value that was never validated returns something for any input. Fixed-decimal formatting throws on the same input. A change that touched only a message therefore turned a quiet nonsense reading into a crash, and a second change had to guard the pressure before formatting and return a reason saying no pressure could be read.

The rule that comes out of it: a formatting change is safe only where the values reaching the formatter were already checked.

## The mistake

Reading the printed pressure as the pressure that branched. The branch is strict, so the name is the reliable field and the number in the sentence is a rendering. When they disagree, the name is right.

## What it refuses

The sentence is guidance and never a verdict, and the function returns only a name and a reason. It will not report the pressure it received, only a rendering of it, so a caller who needs the exact value keeps the one it passed in.

## Exercise

Print the reason at 999.04, 999.88 and 999.96 psia and record which still renders as the limit.

Then say in one sentence why raising the precision again narrows that collision without removing it.
