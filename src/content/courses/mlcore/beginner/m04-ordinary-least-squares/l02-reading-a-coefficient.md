# Reading a coefficient and its unit

{{panel:ml-fit-explorer}}

A coefficient is a rate: how far the fitted target moves for one unit of its feature, with every other feature held fixed. It carries the target's unit over the feature's unit. For the teaching fit of DT on GR, RHOB and NPHI over the 180 training rows, every coefficient reads in us/ft per something.

| term | coefficient | unit |
| --- | --- | --- |
| intercept | -0.552686 | us/ft |
| GR | 0.288005 | us/ft per gAPI |
| RHOB | 22.499915 | us/ft per g/cm3 |
| NPHI | 138.783590 | us/ft per v/v |

## Reading each one aloud

GR: holding RHOB and NPHI fixed, one more gAPI of gamma ray moves the fitted DT by 0.288005 us/ft.

RHOB: holding GR and NPHI fixed, one more g/cm3 of bulk density moves the fitted DT by 22.499915 us/ft. One whole g/cm3 is a very large step: the density of the nine sonic wells runs only from 2.107000 to 2.734000 g/cm3, so no row moves a whole unit.

NPHI: the neutron porosity is a fraction, v/v, so its coefficient 138.783590 is per whole unit of v/v, a porosity of one. Per 0.01 v/v, one porosity unit, it is 1.387836 us/ft, the coefficient over 100. That is the reading a petrophysicist will recognise.

The sentence "holding the others fixed" is part of every reading. The plane is fitted with all three features present, and each coefficient answers a question about one of them with the other two pinned.

## Size is not importance

A large coefficient does not mean an important feature. NPHI's 138.783590 is large because a unit of v/v is large; RHOB's 22.499915 is large for the same reason. GR's 0.288005 looks small because a gAPI is small. The size of a coefficient says nothing about how much a feature matters until the feature's own spread is known.

One way to set the features side by side is to fit on standardised features, where every coefficient reads in us/ft per training standard deviation. On the one-well workflow of module six, EKENE-8 held out and 240 training rows, those read 6.898926 for GR, 2.402069 for RHOB and 4.610720 for NPHI. That is a different split from the teaching fit, so its numbers are quoted with their own split. The Expert tier measures importance directly with a stated method.

## A coefficient belongs to its company

Fitted on NPHI alone over the same 180 rows, the NPHI coefficient is 11.127468 us/ft per v/v; beside GR and RHOB it is 138.783590. Neither number is wrong. They answer different questions, because "holding the others fixed" means something different when there are no others. So a coefficient is quoted with its features, its rows and its unit.

## A coefficient is not a law of the rock

The fitted rate describes these rows of these six wells under this plane. It is a summary of the training data with the features chosen, and a different set of wells or features would give a different rate. Reading it as a rock property would claim more than the fit knows.

## Exercise

Open the fit explorer on the least squares view with its defaults, and read the coefficient table. Write each coefficient as a sentence with its unit and the words "holding the others fixed". Convert the NPHI coefficient to a rate per 0.01 v/v and check it against the figure above. Then set the features to NPHI alone and write both NPHI coefficients side by side, each with the feature list it came from.
