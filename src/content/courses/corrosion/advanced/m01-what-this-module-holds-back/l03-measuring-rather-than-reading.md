# Measuring rather than reading an export

An exported constant is a declaration. It tells you what a module says about itself. What the module actually does with that number while it runs is a separate question, and the two can differ innocently: a second copy inside a function, a branch that never reaches the exported name, a value transformed on the way in. Reading the export answers the first question. Only a measurement answers the second.

This engine exports fifteen constants by name, fourteen of them rows of the pin table plus the sour threshold again in psia, and the course prints both columns for all fifteen. `BAR_TO_PSIA` is declared at 14.503773800722 and measured from behaviour at 14.503773800722. `PH_REFERENCE` is declared at 4.000000000000 and measured at 4.000000000000. `SHEAR_SWITCH_RE`, `REGIME_CARBONATE_MAX`, `REGIME_MIXED_MAX`, `RATE_CATEGORY_BANDS.low` and `RATE_CATEGORY_BANDS.high` all come back at a relative difference of exactly 0. `FUGACITY_CAP_BAR` sits at 2.274e-16 and `SOUR_THRESHOLD_PSIA` at 2.734e-16, which is the arithmetic of the bisection that found them.

## Why both columns

The point of printing both is that a disagreement between them would be visible. If `FILM_STRIP_PA` were exported as one number and the risk word turned over at another, the two columns would separate and a reader would see it in the table rather than inferring it from a surprising screen. Nothing in this module currently separates. That is a result with a size attached, and the size is what makes it a result.

Many of the pinned constants have no export at all: the two reaction constants and the reaction fugacity exponent, the two fugacity coefficient constants, the mass-transfer coefficient and both of its exponents, the three scale constants, the pH slope, the Blasius pair and the laminar constant. For those the measurement is the only column there is, which is precisely the case the technique was built for.

## What a measurement can reach

Some of these are reached by algebra on the engine's own answers. The reaction fugacity exponent of 0.580000000000 is the slope of the base ten logarithm of the reaction rate against the logarithm of the fugacity, taken at 1 bar and 10 bar at 60 C. The mass-transfer velocity exponent of 0.800000000000 is the base two logarithm of the doubling ratio in velocity. Others are reached by bisecting a word or a flag rather than a number: the sour screening threshold of 0.003500000000 bar is bisected on the sour flag, and the three category boundaries are bisected on the category word.

The mass-transfer fugacity exponent is the interesting one. It measures at 1.000000000000 with a relative difference of exactly 0, and it is a property of the form rather than a typed constant. The term is exactly linear in fugacity, so doubling the fugacity doubles the term, and the measurement confirms the shape of the expression rather than the value of a literal.

An export agreeing with a measurement checks the export. A measurement standing alone checks the behaviour. Neither one tells you where the number came from.

## Exercise

Pick three exported constants and three that have no export. For each of the six, write down the measurement route and the relative difference the course reports. Then group the six by what the number would be worth if the export and the behaviour disagreed, and say which group you would investigate first.
