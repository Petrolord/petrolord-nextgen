# The reuse record counts

A lessons database is easy to fill and hard to prove useful. The engine answers the question "has this lesson been used?" with a count built from the application log, and it never takes a claim in place of the count.

{{panel:rc-review-explorer}}

## The reuse record of each visible lesson

For every visible lesson on the ONNE register the engine builds a reuse record from its applications:

| lesson | total | applied | adopted | adapted | rejected | last applied on | targets changed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ON-01 | 3 | 2 | 1 | 1 | 1 | 2026-07-14 | "Risk register", "Procedure" |
| ON-02 | 1 | 1 | 1 | 0 | 0 | 2026-06-10 | "Management of change" |
| ON-03 | 1 | 0 | 0 | 0 | 1 | null | none |
| ON-04 | 0 | 0 | 0 | 0 | 0 | null | none |
| ON-10 | 1 | 1 | 1 | 0 | 0 | 2026-08-20 | "Maintenance plan" |

Read each row as arithmetic on the log. Total is every application. Applied is adopted plus adapted. Rejected is the rest. For ON-01 that is 3 in total, 1 adopted and 1 adapted making 2 applied, and 1 rejected. The adopted and adapted columns are kept apart, and that separate count is the only difference the engine draws between the two outcomes.

## A count and never a claim

Every figure in this record is derived from application records, each of which names a target and an outcome. Nobody types "widely used" into it. If the reuse record says a lesson changed two targets, there are two records naming them.

That is the design choice this module turns on. A lesson's value is shown by where it went, and the engine shows exactly that and nothing more.

## Last applied is the last change

ON-01's last applied date is 2026-07-14, the date of AA-02, its "Adapted" application into a procedure. Its "Rejected" application, AA-03 on 2026-08-01, is later and does not move that date, because a rejection applied nothing. The digest prints this directly: ON-01 was last applied on the date of its Adapted application.

ON-03 has one application and a last applied date of null. Its only application is a rejection, so there is no date on which it was applied to anything. ON-04 has no application at all, and reads null for the same reason with nothing behind it. ON-02 and ON-10 are the simple cases: each has 1 application, an adoption, and each was last applied on the date of that adoption, 2026-06-10 and 2026-08-20.

A "last applied" that moved on a rejection would tell a reader the lesson was recently put to use when it was recently turned down. Keeping the date on changes only makes it answer the question its name asks.

## Targets changed

The last column lists the targets the lesson actually changed. ON-01 changed the "Risk register" and a "Procedure". Its "Training" application is absent from the column, because training was the target it was rejected for. ON-03 changed nothing, and the column says none.

## What the record cannot say

The reuse record counts applications. It cannot say whether an adoption was done well, or whether the risk register row the lesson changed is now better managed. The digest carries no quality measure for an application, and neither does this lesson. What the count gives a reader is the trail: which records to open to check.

Every figure here was also replayed through the independent oracle for lessonsLearned.

## Exercise

Record the reuse record of ON-01 and ON-03: total, applied, adopted, adapted, rejected, last applied on and targets changed. Show the arithmetic that gives ON-01 its applied count. Then say which rule keeps AA-03 from moving ON-01's last applied date, and why ON-03's last applied date is null.
