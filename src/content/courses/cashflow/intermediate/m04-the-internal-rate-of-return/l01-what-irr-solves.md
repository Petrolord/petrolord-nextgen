# What IRR solves

The internal rate of return is the discount rate at which the NPV of a cash flow vector is zero. It is solved from the vector alone, so nothing in the configuration can move it.

{{panel:ec-time-explorer}}

## The question it answers

Take the published vector jv_analytic, [-12500000, 37500000]. Its NPV reads 25000000.00 at 0 percent, 21590909.09 at 10 percent, 18750000.00 at 20 percent and 0.000000 at 200.0000 percent. The rate that zeroes it is 200.0000 percent, and the engine reports that as the IRR.

conventional_five_year, [-1000, 300, 300, 300, 300, 300], has NPV 500.00 at 0 percent, 137.24 at 10 percent and -102.82 at 20 percent. The zero sits between 10 and 20, and the engine finds it at 15.2382 percent, where the NPV reads 0.000000. loss_making, [-1000, 500, 400], never returns its outlay and reports -6.9926 percent: a negative IRR is a legitimate root, the rate at which a shrinking discount makes the receipts worth exactly the outlay.

## AKATA

AKATA's nominal net cash flows are [-121123680.00, 31746007.20, 64468245.07, 53959532.44, 44874457.77, 37311468.65, 30401798.05].

| rate, percent | NPV of the nominal flows |
| --- | --- |
| 0 | 141637829.18 |
| 100 | -77943008.48 |
| 300 | -108095645.04 |

The root is 29.2361 percent. The headline NPV of 72534830.66 belongs to the same vector at the configured 10 percent, and the IRR says where along the rate axis that NPV would reach zero.

## What cannot move it

The discount rate. On multiyear_jv_real swept from 0 to 20 percent in steps of 2, NPV falls from 148905488.72 to 50852201.45 while the IRR reads 47.9020 percent at every point. The basis and the convention: AKATA reports 29.2361 percent on the nominal basis end-year, nominal mid-year, real end-year and real mid-year, four runs with NPVs of 72534830.66, 69159247.46, 72534830.66 and 70188970.32. The working interest: at 100, 75, 60, 40 and 25 percent the IRR is 29.2361 percent every time, because scaling every entry of a vector by one factor scales its NPV at every rate and leaves the zero where it was.

## The mistake

The careful mistake is to read the IRR as a bank rate on the project's money. It is a root, and it is solved on the nominal flows: AKATA's 29.2361 percent zeroes the vector printed in money of the day, not the real flows 30821366.21 and 60767504.07 that the real basis discounts. So the rate it is compared against is the nominal 10 percent, not the applied real rate of 6.796117 percent. At the breakeven price of 64.916777 USD/bbl, where NPV is zero, the IRR reads 10.0002 percent, the nominal rate, and that is the proof of which comparison the number was built for.

## What it refuses

It refuses to use the discount rate, the basis, the convention or the working interest, and it refuses to say anything about scale: jv_analytic's 200.0000 percent sits beside an NPV of 21590909.09 while AKATA's 29.2361 percent sits beside 72534830.66.

## Exercise

Write AKATA's seven nominal flows and mark the sign of each. Then say, without solving, why the NPV at 0 percent must equal 141637829.18, and why the root has to lie between 0 and 100 percent.
