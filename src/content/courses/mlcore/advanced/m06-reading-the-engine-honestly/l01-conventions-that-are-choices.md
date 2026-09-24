# Conventions that are choices

{{panel:ml-diagnose-explorer}}

Every number this engine returns rests on conventions, and each convention is a choice with a real alternative in common use. When a figure from this engine is compared with one from another tool, the choice can be the whole difference. This lesson lists the engine's choices, the alternative each one declined, and the engine's stated reason, and shows where some of them moved a number in this course.

| convention | this engine | a common alternative |
| --- | --- | --- |
| scaler divisor | population SD (n) | sample SD (n - 1) |
| random draws | mulberry32(seed), Fisher-Yates from the end | a library random number generator |
| group names | sorted by UTF-16 code unit | natural order |
| k-fold | round robin over shuffled groups | GroupKFold, balancing rows |
| test R-squared | about the mean of the test targets | about the training mean |
| OLS refusal | scaled condition number above 1.00e+8 | fit anything and warn |
| logistic stop | largest full Newton step at most 1.00e-10, in coefficient units | a relative or column-scaled rule |
| separation | decided exactly before iterating | iterate and watch the coefficients grow |
| F1 | 2TP / (2TP + FP + FN) | the harmonic mean of precision and recall |
| ROC start | threshold null | infinity |
| log loss clip | eps = 1.00e-15 | the float dtype epsilon |
| permutation drop | loss of score, positive when the feature matters | the raw permuted score |
| learning curve size | counted in wells | counted in rows |

## Choices that move a number

The scaler divides by n. On 180 training rows the sample SD is larger by the factor 1.002789, and the engine chose the population SD so that ridge lambda equals scikit-learn's alpha on the same features. The data quality course computes its z-score with the sample SD; name the divisor every time.

The test R-squared is taken about the mean of the test targets, to match scikit-learn's r2_score. On the teaching split it reads 0.815322, and 0.816151 about the training mean. The option is there, and the reference is named every time an R-squared is quoted.

Names sort by character before the shuffle, so EKENE-10 comes before EKENE-2. That order is stated and needs no parsing of names, and it is the order the seeded shuffle starts from in every split.

## Choices about randomness

Every random draw is mulberry32 with a stated seed, the one canonical random number generator across the platform. No library reproduces its draws, so a split from this engine is compared with another tool's by the list of wells, never by the seed. The k-fold deals shuffled wells round robin, which balances the number of wells in each fold and is seeded and reproducible; scikit-learn's GroupKFold balances rows and takes no seed.

## Choices about when to answer

The engine refuses least squares above a scaled condition number of 1.00e+8, because there the worst-case bound reaches the coefficient itself. It decides separation exactly before iterating, because a separated maximum likelihood fit has no finite answer to print. It stops logistic regression on the full Newton step in coefficient units, because the full step cannot be faked by halving and the unit is stated in the basis. Each of these is the engine declining to print a number it cannot stand behind, at a stated rule.

## Choices about sign and scale

F1 is written 2TP / (2TP + FP + FN), equal to the harmonic mean wherever both are defined and defined in more cases. The ROC curve starts at threshold null because JSON has no infinity. The log loss clips at a stated constant. The permutation drop is a loss of score, positive when the feature matters, one sign for every metric. The learning curve is counted in wells because rows of one well are not independent.

## Exercise

Pick three conventions from the table. For each, write down one figure from this course that the choice set, and what you would expect to change if the alternative were used, without inventing a number: say which way it would move, or that it would move, and why. Then open the panel on any view and find where the engine states the convention you picked in its basis.
