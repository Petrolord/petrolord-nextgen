# Monthly compounding and the grace

{{panel:joa-recovery-calculator}}

Some agreements compound default interest monthly, and some give a defaulter a short grace in which a late payment carries none. This lesson runs PB's March default under the Kenya terms and then walks the grace to its edge.

## What the Kenya model says

The Kenya Model PSC 2015, Participation Agreement (2015 model, read on 2026-09-26) compounds from the due date:

> "compounded monthly and calculated from the due date of payment." (Kenya Model PSC 2015, Participation Agreement Art. 6.7)

and sets a threshold of seventy-two hours, after which interest runs from the due date itself:

> "A payment not received within seventy-two (72) hours of the due date shall accrue interest from the due date" (Kenya Model PSC 2015, Participation Agreement Art. 6.7)

## Compounded monthly

The engine counts whole months from the due date, compounds each at the annual rate over 12, and charges the remaining days simply. On PB's unpaid 2000000.000000 at the stated 8.250000 percent, 360-day basis and a grace of 72 hours, 2027-03-01 to 2027-04-15 is 1 whole month and 14 days:

> PB: share of the call 2250000, paid 250000, unpaid 2000000; interest 2000000 x ((1 + 8.25% / 12)^1 x (1 + 8.25% x 14 days / 360) - 1), 1 whole month and 14 days = 20210.78 (from 2027-03-01 to the cure on 2027-04-15, the last date excluded); the stated grace of 72 hours is exceeded, so interest runs from the due date

| golden case | method | whole months | remaining days | default interest |
| --- | --- | --- | --- | --- |
| default-ekene-march | simple | none | none | 20625.000000 |
| default-ekene-monthly-compound-kenya | monthly-compound | 1 | 14 | 20210.781250 |
| default-monthly-compound-whole-months | monthly-compound | 2 | 0 | 27594.531250 |

On this default, compounding gives less than simple default interest on a 360-day year, because the whole month counts as one twelfth of a year where the simple method counts its 31 days. Neither method is more correct: the contract states one.

## The grace, at its edges

The engine's basis on the Ekene default states how it reads the Kenya clause:

> a stated grace of 0 hours (days x 24 from the due date): a default cured within it carries no interest; one cured later carries interest from the due date, as the Kenya Model PSC 2015 Participation Agreement Art. 6.7 prints (72 hours)

That is the engine's stated reading, beside the text it reads. Three golden inputs test the edge on the simple method:

| golden case | grace | cured | days | within the grace | default interest |
| --- | --- | --- | --- | --- | --- |
| default-grace-last-hour | 72 hours | 2027-03-04 | 3 | true | 0.000000 |
| default-grace-exceeded | 72 hours | 2027-03-05 | 4 | false | 1833.333333 |
| default-grace-fractional-hours | 71.5 hours | 2027-03-04 | 3 | false | 1375.000000 |

A cure at exactly 72 hours is within a grace of 72 hours; one day later, all 4 days carry default interest from the due date. A grace of 71.5 hours is exceeded by the same 3 days.

A contract with no grace states 0, and a call that states nothing is refused:

> interest.graceHours must be a finite number of hours at or above 0, stated (0 when the contract gives no grace; the engine holds no default); got nothing

## Exercise

Work in the course's own recovery calculator, view "A default: cover, interest and consequences".

1. Start from "The same default, compounded monthly with a grace". Check the whole months, remaining days and default interest against the second row above, and read its reason.
2. With the control "Interest method (stated)", switch to simple and read the default interest.
3. In the box, set PB's `curedOn` to `"2027-03-04"` and then to `"2027-03-05"`. For each, read "within the grace" and the default interest.
4. With the control "Grace, hours (stated, 0 for none)", clear the grace and read the refusal.
