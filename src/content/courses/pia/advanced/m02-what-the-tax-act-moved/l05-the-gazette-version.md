# The gazette version and its date

{{panel:pia-ledger-calculator}}

Every figure this course prints for a year under the Nigeria Tax Act 2025 rests on one printed text with a known weakness. This lesson names the edition, says what is uncertain about it, and shows where the engine carries that uncertainty.

## The edition the course read

The Nigeria Tax Act 2025 (Act No. 7) was read from Official Gazette No. 117, Vol. 112, Lagos, 26 June 2025. It was read on 2026-09-26, the same day as every other text in this course. Two further facts come from secondary sources, a State House statement and an Arise TV report of 27 December 2025: the Act takes effect on 1 January 2026, and in December 2025 the National Assembly ordered the Acts re-gazetted. No Certified True Copy was read.

So the course knows which text it quotes and that a later printing was ordered, and it does not know whether that printing differs.

## Why the date and version travel with the figures

If a re-gazetted printing changed a rate, a deduction or the deep offshore wording, every figure for 2026 onward could move while 2025 and before stayed put. That is the line the framework switch draws, so the exposure on any ledger is every row the engine reads as "nta_2025". Naming each Act with its edition and read date is what lets a figure be traced back to the text that produced it.

## The engine says it too

The engine names its texts in its own export, and its entry for this Act reads, verbatim: `Nigeria Tax Act 2025 (Act No. 7), Official Gazette No. 117, Vol. 112, 26 June 2025, effective 1 January 2026; re-gazetting ordered December 2025, no Certified True Copy read`.

It also prints a note on every ledger that holds a year under the Nigeria Tax Act 2025:

> Nigeria Tax Act 2025 figures follow Official Gazette No. 117, Vol. 112, of 26 June 2025. The National Assembly ordered the Acts re-gazetted in December 2025; no Certified True Copy was read.

A ledger that sits wholly before 2026, or one forced to the Act alone, holds no such year, and the note does not appear.

## Reading a printed text with care

The June gazette carries at least one visible slip of its own. Its commencement note prints "[ 26th June, 2025 ] Commence- ment ENECTED by the National Assembly of the Federal Republic of Nigeria", a misspelling the course quotes as printed. It says nothing about the tax, but it is a reminder that a gazette is a printed object.

## Exercise

Open the ledger calculator on "The engine notes" and find the note on the Nigeria Tax Act version. Then open "The whole ledger, year by year" with ekene_onshore_across_2026 loaded and confirm that the note appears under the ledger. Set pia_under_nta_2025_override to "force_pia" in the case and check that the note disappears. Finally list the rows of ekene_onshore_across_2026 whose figures rest on the June 2025 gazette.
