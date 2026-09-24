# The condition number, raw and scaled

{{panel:ml-diagnose-explorer}}

The Associate tier fitted least squares and read what it returned. The Professional tier penalised it, cross-validated it by wells and scored a classifier. This tier asks what happens at the edges: when the engine refuses a fit, when it stops before it has converged, and when it predicts outside the rows it was fitted on. The first edge is conditioning. The condition number of a design says how much a small change in the data can move the least squares coefficients, and the engine reports it twice on every fit.

| design, training rows of the teaching split | condition number, raw | scaled condition number | R-squared of the training fit |
| --- | --- | --- | --- |
| the three logs | 5595.200723 | 193.359232 | 0.683457 |
| the logs and the depth | 751074.623153 | 225.474144 | 0.698882 |
| the logs and the four attributes | 964782.182336 | 7608.495043 | 0.861914 |
| the same seven features, each centred on its training mean | 1251.765912 | 8.661304 | 0.861914 |

## Two numbers for one design

`conditionNumber` is the 2-norm condition number of the design exactly as given, with the intercept column of ones included. `scaledConditionNumber` is the same quantity after every column has been scaled to unit length, which is Belsley's convention. The raw number mixes units. A depth column in thousands of feet sitting beside a density in g/cm3 reads as ill-conditioned whatever the data say, because the columns differ in size before they differ in direction. Scaling each column to unit length removes the units, and what is left measures near-collinearity: how close some column comes to being a combination of the others.

Read the first two rows of the table that way. Adding the depth moves the raw number from 5595.200723 to 751074.623153, and the scaled number only from 193.359232 to 225.474144. The depth column is large, and it is not close to a copy of the logs.

## A column that is almost the intercept

The attribute design is different. Easting sits far from zero and varies little: over the training rows its mean is 414.173333 km and its population SD is 0.772284 km. With an intercept in the model, a column like that is nearly a multiple of the column of ones, and northing behaves the same way. That is real near-collinearity, and the scaled condition number of the attribute design is 7608.495043.

Centring every feature on its training mean is arithmetic done outside the fit. It brings the scaled number to 8.661304 and leaves the fit itself unchanged: the training R-squared is 0.861914 both ways, and moves by 0. Centring changes where the columns sit relative to the intercept and leaves the fitted plane where it was.

## Which number the refusal reads

Only the scaled number decides whether the engine fits a design. The raw number is printed so that you can see how much of the apparent trouble is units. A large raw number beside a modest scaled one is a units story; a large scaled number is a collinearity story, and it is the one the engine acts on. The next lesson shows where it acts and why the limit sits where it does.

## Exercise

Open the panel on the condition view. The default table holds all 270 sonic rows; delete the rows of EKENE-4, EKENE-5 and EKENE-8 so the 180 training rows of the teaching split remain, fit GR, RHOB and NPHI on DT, and confirm the scaled condition number 193.359232. Then add CALI, which the table already carries, to the features and refit. Write down both condition numbers before and after, and say in one sentence whether the change is a units story or a collinearity story.
