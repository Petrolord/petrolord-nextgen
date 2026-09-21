# The feasibility NPV

The screening engine returns a full cash flow for the ODIOMA expansion, twenty-two years of it. It also returns one figure that summarises the whole: a net present value. This lesson reads that figure as the feasibility screen's answer, what it is built from, and what it does not settle.

{{panel:refinery-variance-explorer}}

## The cash flow it summarises

| year | calendar year | gross revenue (MM) | opex (MM) | capex (MM) | tax (MM) | net cash flow (MM) |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 2027 | 0.0000 | 0.0000 | 58.9160 | 0.0000 | -58.9160 |
| 1 | 2028 | 0.0000 | 0.0000 | 58.9160 | 0.0000 | -58.9160 |
| 2 | 2029 | 346.1195 | 307.5315 | 0.0000 | 0.0000 | 38.5879 |
| 5 | 2032 | 346.1195 | 307.5315 | 0.0000 | 10.9559 | 27.6320 |
| 6 | 2033 | 346.1195 | 307.5315 | 0.0000 | 11.5764 | 27.0116 |
| 21 | 2048 | 346.1195 | 307.5315 | 0.0000 | 11.5764 | 27.0116 |

Years 2 to 4 read 38.5879 million, with no tax. Year 5 is the first with tax to pay. From year 6 to year 21 every year reads 27.0116 million.

## The screen's answer

NPV at 12 percent, mid-year discounting (a flow in year t is discounted at t + 0.5): 88.6345 million US dollars.

Mid-year discounting treats each year's cash as arriving in the middle of the year, which is closer to how a plant earns through twelve months than a single payment at the end. The discount rate of 12 percent is an input the user sets.

Read as a screen, the figure says that on these illustrative prices, this capital estimate, firm supply and this fiscal treatment, the expansion's cash flows are worth 88.6345 million at a 12 percent rate. It is the answer to the screen's question: is this worth studying further?

## What owns the NPV

The Economics courses teach and grade the NPV. This course reads it as the feasibility screen's answer. How a discount rate is chosen, why mid-year and end-year conventions differ, how an NPV is tested under uncertainty and how it is weighed against other measures all belong there. The Studio also shows an IRR beside the NPV. The Economics courses teach it, and this course does not read it.

## The start year labels the years

The start year labels the years and moves no figure. With start year 2031 the first calendar year reads 2031, the NPV reads 88.6345 and the total tax 196.1780, against 2027, 88.6345 and 196.1780 with start year 2027. The two agree to the last digit: true.

That matters because the feasibility engine reads the year from the machine clock when it is not given one. Every figure in this module is valued from start year 2027, passed on every call, so a reader running the screen in any year gets the same cash flow. The calendar labels would move with a different start year. The money would not.

## What the figure leaves out

The NPV is only as good as the streams beneath it. The capital exponent of 0.9 is a default for a vendor's figures to replace. The capital is deducted when spent under held item H2. The prices are illustrative. Module 5 shows that one setting alone, carrying the tax loss forward, changes the tax the plant pays over its life by a printed 35.3496 million.

A screen that returns a positive figure has earned the project a closer look. It has not made the investment decision, and the lessons ahead read the inputs that decide how far to trust it.

## Exercise

Read the net cash flow in 2027, 2029, 2032 and 2048, and the NPV at 12 percent with its discounting convention. Then read the NPV and total tax with start year 2031 beside those with start year 2027, and say what their agreement shows about the start year. Finally, name which courses teach and grade the NPV and the IRR.
