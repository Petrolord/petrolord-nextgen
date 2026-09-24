# Features and a target

{{panel:ml-fit-explorer}}

Every model in this course is handed two things. The features are the columns it reads, called X, with one row per depth sample. The target is the one column it learns to predict, called y, with one value per row. In the Ekene sonic model the features are three logs and the target is the compressional sonic.

| role | column | unit | what it is |
| --- | --- | --- | --- |
| feature | GR | gAPI | gamma ray |
| feature | RHOB | g/cm3 | bulk density |
| feature | NPHI | v/v | neutron porosity |
| target | DT | us/ft | compressional sonic slowness |

## Why the sonic is the target

A target is chosen for a reason a person can state. In the Ekene field one well, EKENE-6, was logged without a sonic, and the other 9 wells carry one on 270 rows. A rule that predicts DT from logs every well has could one day stand in for the missing log, which is the Expert tier's task. This tier learns how such a rule is built and judged.

The features are logs every well carries that respond to shale, density and porosity, as the sonic does. Choosing them is your decision; the engine fits the columns it is handed.

## Rows and columns line up

X is a table with one row per sample and one column per feature, and y is a list with one entry per row. A row of X and the matching entry of y describe the same depth in the same well, and the engine counts rows from 0.

Each column carries a unit, and the unit travels into the model: a coefficient on GR is in us/ft per gAPI. Module four reads those units closely.

## A coefficient belongs to its feature set

Fitted on the training rows of the teaching split with all three logs, the NPHI coefficient is 138.783590 us/ft per v/v. Fitted on NPHI alone, the same rows give 11.127468, with an R-squared on those training rows, about their own mean, of 0.001327. The NPHI column is identical in both fits. Beside GR and RHOB, its coefficient describes how DT moves with NPHI while the other two logs are held fixed; on its own it describes something else.

## Columns that are present and still questionable

The Ekene table also carries four well-level attributes: easting, northing, KB and mud weight. Each is constant down a well. The engine will fit them if you pass them. Whether they belong in a model is a question the Professional tier answers.

The caliper, CALI, is in the table too. The Ekene field drew it independently of every other channel, so it carries no sonic signal by design. A column can be present, clean and useless.

## A missing value stops the call

A null in a feature or in the target stops the call and names the entry. The engine does not fill it, because a filled value is a guess that would be scored as a measurement. Filling or dropping is your choice, made before the fit.

## Exercise

Open the fit explorer on the least squares view. The features box reads GR, RHOB, NPHI and the target box DT. Change the features to NPHI alone, then read the NPHI coefficient and the Training R-squared tile and check both against the figures above. Put all three logs back and add CALI to the features. Write the new NPHI coefficient beside the three-log one, and say in one sentence why a coefficient must be quoted with its feature list.
