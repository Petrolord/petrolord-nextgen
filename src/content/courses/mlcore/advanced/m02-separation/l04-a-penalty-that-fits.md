# A penalty that makes the fit finite

{{panel:ml-diagnose-explorer}}

{{panel:ml-validate-explorer}}

The separation message offers two remedies: add an L2 penalty, or remove the separating feature. This lesson takes the first on the 106 high-RT rows where PHIC alone decides the pay label, and reads what the penalised coefficient means.

| l2 | what the engine returns | PHIC coefficient (log odds per v/v) |
| --- | --- | --- |
| 0 | refused as completely separated | none |
| 0.1 | a fitted model | 6.814258 |
| 1 | a fitted model, intercept 1.881712, 6 iterations, separation type complete | 0.817700 |

## What the penalty does

With a penalty the objective the engine maximises is the log likelihood less (l2 / 2) x sum b_j^2, the sum running over the non-intercept coefficients. The Professional tier met the same idea in ridge, where lambda penalises the sum of squared coefficients and the intercept is left alone. Here the penalty is what makes the objective bounded. The log likelihood still rises as the PHIC coefficient grows, but it can never rise above zero, while the penalty grows without limit, and so there is a finite best coefficient.

With l2 = 1 on the high-RT rows the fit returns a PHIC coefficient of 0.817700 log odds per v/v and an intercept of 1.881712, after 6 iterations, converged true. The result still reports `separation.type` complete. The separation has not gone away. The penalty has made the answer finite, and the engine tells you it is fitting through a separation.

## The coefficient is set by the penalty

At l2 = 0.1 the PHIC coefficient is 6.814258. A weaker penalty gives a larger coefficient, and as l2 goes to zero there is no finite limit for the coefficient to settle at. That is the sense in which the penalised coefficient is set by the penalty: on separated data the likelihood alone would take the coefficient to infinity, and the value you read is where the penalty stops it. Change l2 and you change the coefficient.

So a penalised coefficient on separated data says as much about the penalty as about the rock. Quote it with its l2, always, and never compare coefficients fitted at different l2 values as if they were two estimates of one number.

## Scaling matters to a penalty

A penalty on the sum of squared coefficients depends on the units of each feature, because a coefficient's size depends on them. The same holds here: the size of the PHIC coefficient depends on the unit PHIC is written in, and so does the penalty on it. State the units of every feature with the l2.

## The other remedy

Removing the separating feature is the other remedy, and on these rows it is the honest one if the question is how to predict pay from the logs: PHIC is an input of the rule that made the label, and a model that uses it has been handed part of the answer. The Professional tier's pay model saw RHOB, NPHI and RT and never PHIC, and it had no separation to fit through.

## Exercise

Open the diagnose panel on the separation view with the default high-RT table and the feature PHIC. Run it at l2 1 and confirm the PHIC coefficient 0.817700, the iterations and the separation type. Then run it at l2 0.1 and confirm 6.814258. Pick two smaller values of your own and write down the PHIC coefficient at each. Then open the validate panel's logistic view and compare its pay fit, which carries no PHIC, with what you found.
