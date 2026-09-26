# Working the capstone

A capstone of this tier's kind hands you a field's rows and a configuration and asks for readings under time. The method is the same on any field, so here it is worked on AKATA, one step at a time.

{{panel:ec-time-explorer}}

## Step one: name the convention before the number

Write the basis, the convention, the nominal rate, the inflation and the valuation year. AKATA: real basis, end-year, 10 percent nominal, 3 percent inflation, valued in 2029. That sentence is the label on every number that follows.

## Step two: derive the applied rate

Fisher: 10 percent nominal at 3 percent inflation is an applied real rate of 6.796117 percent. On the nominal basis the applied rate is the nominal rate, 10.000000 percent, and the NPV is the same either way: 72534830.66 on both bases end-year.

## Step three: read the NPV under both conventions

End-year 72534830.66, mid-year 70188970.32 on the real basis; the nominal-basis mid-year figure is 69159247.46. Report the convention with each; the pair is the answer, not either number alone.

## Step four: check the valuation year and sunk

If the valuation year is later than the first row, ask whether prior years are kept or sunk. AKATA from 2030 with prior years kept reads 77464382.26; sunk, 206819768.67 with IRR null. The question decides which is wanted.

## Step five: read the profile and its label

Profile at 0, 5, 8, 10, 12, 15 and 20 percent: 117362408.71, 83023565.60, 65968275.69, 55805775.02, 46487466.07, 33900281.71, 16026160.80. The applied-rate point is labelled 6.8 and reads 72534830.66, the headline, so the gap is 0.00. The label is the applied rate rounded to two decimals; the evaluation is at 6.796117. A reader who recomputes at the printed 6.8 lands slightly below the headline and should put that down to the label.

## Step six: the IRR and the sign of the last flow

IRR 29.2361 percent. Before trusting it, write the last nominal flow: 30401798.05, positive, so the curve has one crossing in the band and the engine names it. Had an abandonment turned it negative, as 60000000 does with a last flow of -29598201.95, the curve would cross twice and the engine would return null with irrStatus multiple-roots.

## Step seven: the discounted readings

Discounted payback 3.961607 years against undiscounted 3.461632; DPI 0.289088 on a PV of capex of 250909090.91; discounted take 76.1610 percent against 66.1723.

## Step eight: the sweeps and the breakeven

Price 60 gives -21406234.12, price 70 gives 22132715.69, and the breakeven is 64.916777 USD/bbl with IRR 10.0002 percent there. A discount rate of 15 percent gives NPV 48059114.69 and a breakeven of 69.518418.

## The mistake

The careful mistake is to work the steps out of order: read an NPV, then discover it was mid-year, then discover the valuation year was not the first row. Every number changes meaning when a convention is found late.

## What it refuses

The method refuses to produce one number. It produces a labelled set, and a reader who is asked for the NPV should answer with the label attached.

## Exercise

Work the eight steps on the published multiyear_jv_real case: 127186476.88 at 0 percent, headline 88104639.00 at 6.796117 percent, 88104639.00 at the point labelled 6.8, IRR 47.9020 percent. Write the gap, and say what the engine naming that IRR already tells you about the count of crossings.
