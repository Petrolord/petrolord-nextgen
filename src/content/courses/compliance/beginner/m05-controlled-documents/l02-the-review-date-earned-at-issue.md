# The review date earned at issue

A controlled document's next review date is set by a review period in months, counted from a starting date. Which starting date is the whole question. Document Control counts from the issue date, the date the document was issued for use. It does not count from the date somebody last touched it.

## nextReviewDate

The engine's nextReviewDate takes an issue date and a review period in months. Read at the as-of date of 2026-10-15:

| issue date | period in months | next review date | days until it |
| --- | --- | --- | --- |
| 2025-11-02 | 12 | 2026-11-02 | 18 |
| 2025-06-30 | 24 | 2027-06-30 | 258 |
| 2024-08-31 | 18 | 2026-02-28 | -229 |
| 2025-12-31 | 2 | 2026-02-28 | -229 |
| 2024-02-29 | 12 | 2025-02-28 | -594 |
| 2025-03-14 | 24 (DEFAULT_REVIEW_PERIOD_MONTHS, passed by the caller) | 2027-03-14 | 150 |
| 2025-03-14 | 0 | none | none |
| 2025-03-14 | null | none | none |

{{panel:compliance-register-explorer}}

The first two rows are IKORO documents. The digest recomputes each library document that has an issue date, from that date and its own review period:

| number | issue date | review period in months | nextReviewDate | next_review_date recorded | the two agree |
| --- | --- | --- | --- | --- | --- |
| HSE-PRO-0007 | 2024-09-30 | 24 | 2026-09-30 | 2026-09-30 | true |
| OPS-PLA-0002 | 2025-11-02 | 12 | 2026-11-02 | 2026-11-02 | true |
| ENG-STD-0011 | 2025-06-30 | 24 | 2027-06-30 | 2027-06-30 | true |

All three agree with the date on the record. OPS-PHI-0001, OPS-PRO-0004, HSE-PRO-0012 and ENG-PRO-0019 have no issue date recorded, so nextReviewDate has nothing to count from.

The next three rows show the month end rule from module four at work again. An issue date of 2024-08-31 on an 18 month period lands on 2026-02-28, and so does 2025-12-31 on a two month period. A document issued on the leap day 2024-02-29 on a 12 month period comes up for review on 2025-02-28.

## A correction does not buy time

The digest prints the case that makes this rule matter. A document issued 2025-03-14 on a 24 month review period is corrected and re-published on 2026-10-01.

Counted from the issue date, the review falls on 2027-03-14. Counted from the correction, it would fall on 2028-10-01.

Document Control counts from the issue date, so the review stays on 2027-03-14. A correction fixes a typo or a reference. It is not the full review the period asks for, and it must not reset the clock. If it did, a document could be kept away from review indefinitely by making a small correction every so often, and the library would show a review date that no real review had earned. The date is earned when the document is issued, and it is kept until the document is reviewed.

## When the period is missing

The last two rows are a limit the course teaches and never grades. With a review period of 0, nextReviewDate returns none. With the review period missing, as null, it returns none as well.

There is a default. documentControl.DEFAULT_REVIEW_PERIOD_MONTHS is 24, and the sixth row shows what it gives when the caller passes it: 2027-03-14. The owner's recorded position is that a review period missing from a call to nextReviewDate returns no date, and applying the 24 month default is the caller's job. The engine does not apply it for you inside this function.

So a none from nextReviewDate has two possible meanings: the period was genuinely zero, or nobody supplied one. A document in force with no review date on the record reads No review scheduled, as the flare management philosophy, OPS-PHI-0001, does in the IKORO library. That is the state that tells a document controller to go and set one.

## Exercise

Read the correction case: the issue date, the period, the correction date and the two review dates the digest prints. Say which review date Document Control uses and what would happen to a library if corrections reset the review clock. Then read the rows with a period of 0 and null, and the row where DEFAULT_REVIEW_PERIOD_MONTHS is passed by the caller, and say who is responsible for applying the default.
