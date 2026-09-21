# Held items and owner decisions

Every engine has edges where its rule stops. This lesson reads two lists this course keeps: the held items, which are limits these engines state or show and that no owner has decided, and the owner decisions, which are rules somebody with the authority to decide has decided. A held item is taught as a limit and graded nowhere.

## The held items

The course lists nine, in this order, with the section it names where it names one:

1. A band is found by its lower edge alone, so any positive score bands, including a score no cell of the grid holds (Section 2).
2. countByBand counts whatever it is handed (Section 5).
3. An action on a change that is not in the register counts as open work (Section 12).
4. Within one urgency rank, changes sort by expiry date when they have one and by target date otherwise, so the two keys mix.
5. A comment whose review is not in the list handed to the peer review summary still counts as open work, as an MOC action with an unknown change does (Sections 12 and 14).
6. A reviewer named by display name only cannot be matched to the author, so the independence rule allows one (Section 14); a review with no author recorded cannot be checked either.
7. Publishing a lesson checks that a validation record exists and does not check again who validated it.
8. The application counts in the lessons summary include applications on lessons that are not visible.
9. An invalid as-of date makes daysUntil answer NaN rather than refuse, and a comparison on NaN is false either way, so every date rule reads as not due. Nothing in this course passes one.

Items five and three are tied in the course's own words: a comment counts "as an MOC action with an unknown change does".

## The owner decisions

All were taken on 2026-09-18 under AS15, and each is held in the engine, the app and, where it matters, the database:

- D1, segregation of duties on change approvals (Section 9) and, from ASC-0, on peer review (Section 14). For peer review the engine holds it now; the app and the database follow with the Suite pull request that ships ASC-0.
- Q9, emergency change authority and the ratification window (Section 11).
- Q10, validation by typed name (Section 15).
- Q3, fractional levels unscored (Sections 2 and 3).

AS13-0 decided that a closed temporary change reads "Closed out" (Section 11).

## Why the two lists are kept apart

An owner decision is policy, and an engine that disagrees with it is wrong. A held item is a limit nobody has ruled on. Teaching a held item as policy would say a gap is intended; teaching an owner decision as a limit would say the rule is negotiable.

## Exercise

Record the nine held items in the course's order, and beside each write the section this lesson names, or "none named". Record the two items the course ties to each other in its own words. Then record the four owner decisions taken on 2026-09-18 under AS15 and the section or sections this lesson names for each, and the decision AS13-0 took. Say what separates a held item from an owner decision.
