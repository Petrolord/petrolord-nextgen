import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D2 Associate m03, Scaling on the Training Rows.
# Sources: digest sections 3 (the scaler refusals), 6 (the standard scaler on
# the teaching split, the two divisors, the first test row, min-max on EKENE-6)
# and 10 (standardised least squares on the one-well workflow). Every figure is
# printed there.

q(3, "How does the engine's standard scaler map a feature value x, and on which rows are its two numbers fitted?",
 "z = (x - centre) / scale, with the centre and scale fitted on the training rows and applied unchanged to any other rows.",
 ["z = (x - centre) / scale, with a fresh centre and scale fitted on whichever set of rows it is applied to.",
  "It divides x by the scale alone, fitted on all rows passed, and leaves each feature's centre where it was.",
  "Each value becomes (x - minimum) / range from the training rows, so every row lands between 0 and 1."],
 "A standard scaler maps each feature to z = (x - centre) / scale, fits both numbers on the training rows only (the rows passed or the rows `trainIndices` lists) and applies them unchanged to any other rows. Refitting on the rows being transformed would let the test wells shape their own scaling. Minimum over range is min-max scaling, and even that does not keep a new row inside 0 to 1."),

q(1, "For the teaching split, which GR centre should the scaler use, and why?",
 "59.844500, the mean of the 180 training rows, because the three test wells must influence nothing.",
 ["60.250741, the mean of all 270 sonic rows, because more rows give a steadier centre for every well.",
  "22.375203, the population standard deviation of those training rows, since a centre measures spread.",
  "The mean of the 90 test rows, since a scaler should centre the rows it transforms."],
 "The centre is the mean of the training rows: 59.844500 gAPI on the 180 rows of the teaching split. 60.250741 is the mean over all 270 sonic rows, which include EKENE-4, EKENE-5 and EKENE-8, the wells the split promised to keep unseen. 22.375203 is the training scale, and a centre fitted on the test rows would let them shape their own transform."),

q(0, "On the 180 training rows, GR's scale reads 22.375203 with the population standard deviation and 22.437616 with the sample standard deviation. What separates the two?",
 "The divisor: n against n - 1, which makes the sample scale larger by the factor 1.002789 on 180 rows.",
 ["Rounding: they are one number printed at two precisions, so either may be quoted for the scale.",
  "The rows: the sample figure is fitted on all 270 sonic rows and the population one on the training rows.",
  "An outlier rule: the sample standard deviation drops rows beyond three scales before dividing by n."],
 "The population standard deviation divides by n and the sample standard deviation by n - 1; on 180 rows the sample scale is larger by sqrt(180 / 179), which is 1.002789, for every feature. Both figures are fitted on the same 180 training rows (the all-rows population scale is 21.363430), the gap between them is far larger than rounding at six decimals, and neither drops any row."),

q(2, "Why does the engine's standard scaler divide by n unless told otherwise?",
 "So that its scale matches the one scikit-learn's StandardScaler computes on the same rows, as its basis states.",
 ["Dividing by n - 1 is refused on training sets smaller than 180 rows, as the scaler's basis states.",
  "It is the divisor the data quality course uses for its own z-score, and the two courses must agree on it everywhere.",
  "Dividing by n gives the larger scale of the two, so every standardised value sits closer to zero."],
 "The basis reads, in the engine's words, \"population standard deviation (n), as scikit-learn StandardScaler\". The option `sd: 'sample'` divides by n - 1 on any number of rows. The data quality course uses the sample standard deviation, n - 1, which is why the course asks every standard deviation to name its divisor. Dividing by n gives the smaller scale, so the z values come out larger."),

q(0, "A caller passes `sd: 'unbiased'` to `fitStandardScaler`. What happens?",
 "A refusal on `sd`, whose message is \"sd must be 'population' or 'sample'\".",
 ["The engine reads it as the sample standard deviation, n - 1, the usual meaning of an unbiased estimate.",
  "Any unknown value falls back to the population standard deviation, with a note in the basis.",
  "The scaler fits no scale at all and returns the centres only, so that z = x - centre."],
 "The option takes two values, 'population' and 'sample', and any other value is refused on the field `sd` with the message quoted. The engine does not guess what a word was meant to say, it does not fall back to a default for a value it cannot read, and it never returns half a scaler."),

q(3, "The training scaler turns the first test row, EKENE-4 at 7966 ft, into z = -0.520420, -0.303186 and -0.360332 for GR, RHOB and NPHI. What do the three signs say?",
 "All three logs of that row sit a little below their training centres, measured in training scales.",
 ["The row is refused as out of range, since a fit on training rows cannot return a negative z.",
  "It sits below its own well's centres, since each test row is scaled by the mean of its own well.",
  "Each log is below zero in its raw unit, so the row reads a negative gamma ray, density and porosity."],
 "The row's raw values, GR 48.200000, RHOB 2.348000 and NPHI 0.243000, are each below the training centres 59.844500, 2.391150 and 0.255072, so each z is negative, and each is well under one training scale away. A negative z is an ordinary value. The scaler uses the training parameters unchanged and computes nothing from the test well itself."),

q(1, "After the training scaler is applied to the 90 test rows of the teaching split, do the test rows come out with centre 0 and scale 1?",
 "No; they land wherever the training centres and scales put them, which shows where the test wells sit.",
 ["Yes; applying the scaler recentres any rows it is given, so every set of rows comes out at centre 0 and scale 1.",
  "Yes, once the engine refits the scale on the test rows, which it does to keep all the z values comparable.",
  "Only GR does, since the gamma ray is the one log whose training and test centres happen to agree."],
 "The parameters are fitted on the training rows and applied unchanged, so only the training rows come out with centre 0 and scale 1. The test rows come out wherever those parameters put them, which is informative about the test wells. The basis says, in the engine's words, \"standard scaler fitted on 180 training rows; parameters unchanged\". Nothing is refitted on the test rows."),

q(2, "`fitStandardScaler` is fitted on EKENE-1's 30 rows with GR and mudWeight and refuses on `X.mudWeight`. On the nine sonic wells the same feature is accepted. Why?",
 "Mud weight is constant down a well, so it has zero variance on one well's rows and varies across nine.",
 ["The engine refuses a well-level attribute whenever fewer than 180 training rows are passed to the scaler with it.",
  "Mud weight is missing on EKENE-1, and the nine-well fit simply skips over the rows where the value is null.",
  "Any feature measured in ppg is refused until it is converted to a unit the scaler lists."],
 "The engine's own words are: \"X.mudWeight has zero variance on the 30 training rows (every value is 9.4): standardising would divide by zero, so drop the feature or fit on rows where it varies\". A feature is refused as constant only when every training value is identical, so whether it is refused is a statement about the training rows. The refusal has no row-count rule and no unit rule, and EKENE-1's mud weight is present on every row."),

q(3, "Min-max scaling fitted on the nine sonic wells maps EKENE-6's highest gamma ray to 1.219324. What is the engine telling you?",
 "That row reads above the training maximum of 120.870000 gAPI, and the scaler leaves it unclipped so the fact shows.",
 ["The scaler has failed, since a min-max value must lie in [0, 1], and the row should have been refused.",
  "That value was clipped to the nearest allowed figure after rounding and lies inside the training range.",
  "EKENE-6 was fitted on its own rows, so its own maximum maps to 1.219324 by the scaler's design."],
 "Min-max maps the training minimum to 0 and the training maximum to 1 and does not clip a new row. The basis says, in the engine's words, \"none: a new row outside the training range maps outside [0, 1]\". EKENE-6's gamma ray is above the nine-well maximum on 4 of its 30 rows, and a scaled value above 1 marks a row outside the range the model was fitted on. EKENE-6 has no sonic, so it trains nothing here."),

q(0, "EKENE-6's gamma ray is raised by 30 gAPI on all 30 of its rows, yet min-max flags only 4 rows above 1. What does that show?",
 "A range check sees only rows that leave the training range; the rest are shifted and still inside it.",
 ["Only 4 rows were raised by the hot shale, and the other rows of EKENE-6 read an ordinary gamma ray for the rock.",
  "The scaler clipped the rest back to 1, so only the 4 rows it could not clip are left above 1.",
  "Min-max compares each row with EKENE-6's own maximum, which only its 4 highest rows are able to exceed."],
 "The hot shale raises every EKENE-6 gamma ray by the same 30 gAPI. Only 4 rows end up above the training maximum of 120.870000 gAPI; the others are raised too but still fall inside the range, so min-max maps them between 0 and 1 and raises no flag. The scaler clips nothing, and it is fitted on the nine sonic wells, never on EKENE-6."),

q(2, "On the one-well workflow, with EKENE-8 held out, least squares is fitted on the raw logs and again on standardised logs. How far apart are the two sets of predictions for EKENE-8?",
 "At most 1.42e-14 us/ft, which is rounding: with an intercept, least squares gives the same plane under any rescaling.",
 ["Several us/ft, since standardising changes every coefficient and so moves every prediction along with them.",
  "They differ by the ratio 1.002789, because the scaler divides each feature by its population spread.",
  "They cannot be compared, because a model fitted on standardised features cannot predict raw rows."],
 "The predictions differ by at most 1.42e-14 us/ft, which is rounding. The coefficients do change, because they change units, but the fitted plane is the same, so scaling leaves this model's predictions alone. 1.002789 is the ratio of the sample to the population scale on 180 rows, and a standardised model predicts any row once the same training scaler is applied to it."),

q(1, "A colleague fits the standard scaler on all 270 sonic rows before splitting. For this tier's least squares model the test RMSE then moves only by rounding. Is the procedure acceptable?",
 "No: the scaler's numbers were computed partly from the test wells, and the procedure is the defect whatever its size.",
 ["Yes: a change that small cannot matter, so the order of splitting and scaling is a matter of taste.",
  "Yes, as long as the population standard deviation is used, since dividing by n makes the scaler independent of the rows.",
  "Only with the sample standard deviation, because dividing by n - 1 corrects for the extra test rows."],
 "Every number in a scaler fitted on all 270 rows was computed partly from EKENE-4, EKENE-5 and EKENE-8, the wells the split promised to keep unseen. Least squares with an intercept happens to hide it, but models whose answers depend on the scale do not, so the habit is learned here: split first, then fit anything with parameters on the training rows alone. Neither divisor makes a scaler independent of the rows it was fitted on."),

q(3, "A scaler fitted on GR and RHOB is applied to rows carrying GR, RHOB and NPHI. What comes back?",
 "A refusal on `X`, whose message is \"X must have 2 columns, as the scaler was fitted on\".",
 ["Scaled GR and RHOB, with NPHI passed straight through in its raw unit at the end of each row.",
  "All three scaled, with NPHI taking the centre and scale of the last feature that was fitted.",
  "Three scaled columns, with NPHI fitted afresh on the very rows that are being transformed."],
 "`applyScaler` checks the shape of what it is handed and refuses rows with a different number of columns from the fit, on the field `X`. It never passes a column through untouched, borrows another feature's parameters or fits anything new: the parameters it applies are the ones fitted on the training rows, unchanged."),

q(0, "`fitMinMaxScaler` is fitted on 2 training rows whose CALI both read 3. What does it return?",
 "A refusal on `X.CALI`: the range is zero, so min-max scaling would divide by zero.",
 ["CALI scaled to 0 on both rows, since the training minimum always maps to 0 by definition.",
  "Both rows set to 0.5, the midpoint the engine takes whenever the training range vanishes.",
  "A scaled CALI of 1 on both rows, as the training maximum always maps to 1 by definition."],
 "Min-max divides by the training range, maximum less minimum, and here it is zero. The engine's own words are: \"X.CALI has zero range on the 2 training rows (every value is 3): min-max scaling would divide by zero, so drop the feature or fit on rows where it varies\". It returns no scaled value at all, and it has no midpoint rule."),

q(2, "On the one-well workflow, EKENE-8 held out, the standardised least squares fit gives GR a coefficient of 6.898926. In what unit is that?",
 "us/ft per population standard deviation of GR over the 240 training rows.",
 ["us/ft per gAPI, the unit of the raw GR coefficient, since standardising leaves a unit as it was.",
  "gAPI per us/ft, since a standardised fit reverses which log is read against which.",
  "A unitless share of DT's own spread, since both sides of the fit were standardised first."],
 "Only the features are standardised; the target stays DT in us/ft. So a standardised coefficient reads in us/ft per population standard deviation (divisor n) of its feature over the training rows, here the 240 rows of the eight training wells. The raw GR coefficient of that fit, 0.320501, is the one in us/ft per gAPI."),

emit(Q, '/root/dai-wip-mlcore/banks/d2b_m03.json', expect_n=15)
finish()
