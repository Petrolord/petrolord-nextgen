# Held items and owner decisions

Every engine has edges where its rule stops. This lesson reads two lists from the digest: the held items, which are limits these engines state or show and that no owner has decided, and the owner decisions, which are rules somebody with the authority to decide has decided. A held item is taught as a limit and graded nowhere.

## The held items

The digest lists nine. Five belong to the registers of the earlier tiers: a band found by its lower edge alone, so any positive score bands; countByBand counting whatever it is handed; an action on a change missing from the register counting as open work; urgency ranks that sort by expiry date or target date, so the two keys mix; and an invalid as-of date making daysUntil answer NaN, so every date rule reads as not due. Nothing in this course passes one.

Four belong to this tier, and each is a place where the engine trusts what it is handed:

- A comment whose review is not in the list handed to the peer review summary still counts as open work, as an MOC action with an unknown change does. The summary can keep a finished review's comments out of the open and blocking counts only when it can see the review.
- A reviewer named by display name only cannot be matched to the author, so the independence rule allows one; a review with no author recorded cannot be checked either. The record carries the name for a person to judge.
- Publishing a lesson checks that a validation record exists and does not check again who validated it. The independence check sits where the validation is recorded.
- The application counts in the lessons summary include applications on lessons that are not visible. The lesson counts beside them, lessonsApplied and lessonsUnapplied, cover visible lessons only.

A user who knows these limits reads a count or a verdict with the right caution. Each is a stated boundary of what the engine decides.

## The owner decisions

All were taken on 2026-09-18 under AS15, and each is held in the engine, the app and, where it matters, the database:

- D1, segregation of duties on change approvals and, from ASC-0, on peer review. For peer review the engine holds it now; the app and the database follow with the Suite pull request that ships ASC-0.
- Q9, emergency change authority and the ratification window.
- Q10, validation by typed name.
- Q3, fractional levels unscored.

AS13-0 decided that a closed temporary change reads "Closed out".

## Why the two lists are kept apart

An owner decision is policy, and an engine that disagrees with it is wrong. A held item is a limit nobody has ruled on. Teaching a held item as policy would say a gap is intended; teaching an owner decision as a limit would say the rule is negotiable.

## Exercise

Record the four held items that touch peer review and lessons, and for each say which count or verdict a user should read with care. Then record the four owner decisions taken on 2026-09-18 under AS15, and name which register each governs. Say what separates a held item from an owner decision.
