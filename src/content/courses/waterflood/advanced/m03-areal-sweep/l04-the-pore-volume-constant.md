# The pore volume constant

The forecast engine computes the pattern pore volume in field units:

$$PV = 7758 \times A_{\text{acres}} \times h_{\text{ft}} \times \phi$$

The Ekene element's volume is also known exactly, in cubic metres, from the geoscience booking. The two disagree, by a small and completely explicable amount, and this lesson is about the amount.

## The element

Ekene's oil leg is 169 cells of 100 m by 100 m, from the locked NG5 booking. Its area is

$$\frac{169 \times 100 \times 100}{4046.8564224} = 417.6080946795094 \text{ acres}$$

The flood has two injectors, so one element per injector gives

$$A_{\text{element}} = \frac{417.6080946795094}{2} = 208.8040473397547 \text{ acres}$$

The net rock volume from the booking is $17.81522878109259 \times 10^6$ cubic metres over the same area, so the average net thickness is

$$\frac{17.81522878109259 \times 10^6}{1.69 \times 10^6} \times 3.280839895013123 = 34.585155812896204 \text{ ft}$$

with porosity 0.2.

## The two answers

Field units:

$$7758 \times 208.8040473397547 \times 34.585155812896204 \times 0.2 = 11204911.22581217 \text{ rb}$$

Exact, from the metric pore volume and the fixture's own barrels-per-cubic-metre:

$$\frac{3.563045809312045 \times 10^6 \times 6.2898}{2} = 11205422.76570545 \text{ rb}$$

Relative difference:

$$\frac{11204911.22581217 - 11205422.76570545}{11205422.76570545} = -4.565110161166218 \times 10^{-5}$$

Forty six parts per million, and the field-unit answer is the smaller.

## Where the discrepancy comes from

Almost all of it is the constant 7758. Work out what it should be. One acre-foot is

$$4046.8564224 \times 0.3048 = 1233.4818375475202 \text{ m}^3$$

both of those conversions being exact by definition. At the fixture's 6.2898 barrels per cubic metre that is

$$1233.4818375475202 \times 6.2898 = 7758.354061806392 \text{ barrels per acre-foot}$$

The industry constant is 7758. The ratio is

$$\frac{7758}{7758.354061806392} = 0.9999543637988714$$

so the field-unit calculation is low by $4.56362 \times 10^{-5}$, against an observed discrepancy of $4.565110161166218 \times 10^{-5}$. The constant accounts for 99.97 percent of it, and the tiny remainder is the rounding in the area and thickness chain.

For completeness, the exact barrels per cubic metre is $1/0.158987294928 = 6.289810770432105$, which would give 7758.367346938776 barrels per acre-foot. So 7758 is a rounding of a number just above 7758.36, and it is short by about 47 parts per million however you cut it.

## Why this is worth a lesson

Not because 46 parts per million matters. It never will.

Because it is a clean, small, fully explicable discrepancy between two calculations of the same physical quantity, and being able to explain one of those is the difference between an engineer who trusts their tools and one who is at their mercy.

When two calculations of the same thing disagree, there are exactly three possibilities: one is wrong, they are computing different things, or the difference is unit conversion. The first two are important and the third is noise. Distinguishing them takes five minutes and saves days.

The magnitude is the discriminator. Forty six parts per million is a rounded constant. Four percent is a different definition. Forty percent is a bug.

## A practical rule

Carry ONE unit system through a calculation and convert at the boundaries. The Ekene case has metric statics from geoscience and a field-unit forecast engine, so a conversion is unavoidable, and the right response is to do it once, explicitly, and record which direction it went.

What you must not do is convert back and forth repeatedly, because each round trip through a rounded constant adds another 46 parts per million and they do not cancel.

## The other constants worth knowing

| conversion | rounded | exact |
|---|---|---|
| barrels per acre-foot | 7758 | 7758.367346938776 |
| square metres per acre | 4046.8564224 | exact by definition |
| feet per metre | 3.280839895013123 | exact, 1/0.3048 |
| barrels per cubic metre | 6.2898 | 6.289810770432105 |

Two of those four are exact by definition, because the international foot and the acre are defined in metric terms. The other two are rounded, and both appear in every field-unit volumetric calculation done anywhere in the industry.

## The misconception to avoid

"7758 is the conversion factor." It is a rounded conversion factor that has been standard for so long that it is treated as exact, and the rounding it carries is smaller than any input uncertainty you will ever have. Treat it as exact in practice, and know that it is not when you are reconciling two calculations that should agree.

## Exercise

First, derive 7758.367346938776 from the acre and foot definitions and the exact barrels-per-cubic-metre conversion, and confirm that using the fixture's rounded 6.2898 instead gives 7758.354061806392.

Second, compute the Ekene element pore volume using 7758.354061806392 instead of 7758 and compare it with the exact metric answer of 11205422.76570545 rb. State the remaining discrepancy and where it comes from.
