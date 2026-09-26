# The greenfield gas credit

{{panel:pia-ledger-calculator}}

The Nigeria Tax Act 2025 adds an incentive for new gas developments: a tax credit per unit of non-associated gas sold, for fields that reach first gas within a window. The engine does not compute it. The credit is concept-only in this course, taught from its text and never graded on a number.

## Who qualifies

NTA s.85(1) covers onshore and shallow water greenfield developments of non-associated gas that reach first commercial gas production "from the commencement of this Act to 1 January, 2029: ".

## How large the credit is

The credit depends on how much liquid the gas carries. For gas carrying no more than 30 barrels of liquids per million standard cubic feet, s.85(1)(a) grants a credit at the "rate of US$1.00 per thousand cubic feet or 30% of the fiscal gas price, whichever is lower;". For gas with more liquid, up to 100 barrels per million standard cubic feet, s.85(1)(b) grants "a gas production tax credit at the rate of US$0.50 per thousand cubic feet or 30% of the fiscal gas price, whichever is lower;".

It runs for a fixed time. S.85(1)(d): "(d) the gas tax credit granted by this section shall apply on Non-Associated Gas sales for 10 years only, beginning from the date of attaining first gas production; and". An unused credit can wait, under s.85(4): "(4) Unrecouped tax credit in one year may be carried forward for a maximum of three years."

Fields that miss the window get a smaller relief of a different kind. S.85(2) gives projects with first gas after 1 January 2029 a "gas production allow- ance shall be granted at US$0.50 per thousand cubic feet or 30% of the fiscal gas price, whichever is lower,". An allowance reduces a tax base; a credit reduces the tax itself.

## What a model would need

Read as a list of inputs, the credit needs: that the gas is non-associated; the date of first commercial gas; the liquids content; the fiscal gas price; the gas sold each year; and any credit carried from earlier years, with its age. The engine's production rows carry the gas volume and nothing else on that list, and it reads a realised price in place of a fiscal price.

A number for the credit would rest on facts the engine never sees, so the course teaches it from its text.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_nag_gas_in_country_half, the Ekene gas field with no crude oil. Read its companies income tax in each year and confirm that no line on the ledger is a gas credit. Then open "The engine notes" and find the note on fiscal prices. Using the list in this lesson, write down which of the credit's inputs the case states and which it does not, and say which provision of s.85 each missing input comes from.
