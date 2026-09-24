import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Associate m03, Principal Components.
# Sources: the course digest's correlation matrix of the four logs on the 180
# cored rows, its eigenvalues and explained variance ratios, the Jacobi basis,
# the weights and loadings with the sign rule, the fitted scores, pcaTransform on
# EKENE-7 and on a fitted row, the two pca warnings, and the pca refusals.
# Every figure is printed there.

q(1, "How does `pca` build its default matrix from the logs?",
 "It centres each log and divides it by its sample standard deviation, divisor n - 1, then takes the correlation matrix.",
 ["Each log is divided by its population standard deviation, divisor n, the same scaler k-means fits on the rows.",
  "It keeps every log in its own unit and centres it, so GR's variance in gAPI squared sets the first direction.",
  "Min-max scaling puts every log in [0, 1] first, and the matrix is built from those scaled values."],
 "The default is the correlation matrix, and its basis reads that features are standardised with the SAMPLE SD (n - 1), so each score variance equals its eigenvalue. The population SD is the clustering scaler's divisor. Keeping each log's unit is the covariance form, and min-max is a clustering scaler."),

q(3, "On the 180 cored rows, which pair of logs has the strongest correlation, and at what value?",
 "RHOB and PEF, at 0.915911",
 ["GR and NPHI, at 0.840604, the pair the shale reads high on",
  "NPHI and PEF at -0.622647, as a negative value counts as the stronger one",
  "GR and RHOB, at -0.192943, since the gamma ray drives the matrix"],
 "RHOB and PEF correlate at 0.915911, the entry nearest to one; dense rows here also read a high photoelectric factor. GR and NPHI follow at 0.840604. A correlation of -0.622647 is weaker in size than either, and GR and RHOB, at -0.192943, are the weakest pair."),

q(0, "`pca` is called with a `matrix` setting of 'spearman'. What does the engine reply, in its own words?",
 "\"matrix must be 'correlation' or 'covariance'\"",
 ["A correlation result, since the engine falls back to its default whenever a setting is unknown",
  "\"X must be an array of at least 2 rows\"",
  "A rank correlation matrix, reported with a warning that the ranks have ties"],
 "The engine builds two matrices only and refuses any other setting by naming `matrix`. It never substitutes its default for an unknown setting, and it builds no rank correlation. The row count refusal belongs to a table of one row."),

q(2, "The four eigenvalues of the correlation matrix are 2.729404, 1.101519, 0.097784 and 0.071294. Why do they add to 4.000000?",
 "Each standardised log has variance 1, so the total is the number of logs.",
 ["Four is the number of Jacobi sweeps the rotations needed, and each sweep adds one to the total.",
  "Any matrix's eigenvalues add to 4 when four components are kept.",
  "The engine rescales the eigenvalues so that the largest three sum to 4 and the last takes the rest."],
 "The correlation matrix has 1.000000 four times on its diagonal because each log is standardised, and the eigenvalues share out that total of 4.000000 without losing any. The rotations took 6 sweeps, and the engine rescales nothing. On the covariance matrix the same logs give a first eigenvalue of 1032.566971, so the total of 4.000000 belongs to the correlation form."),

q(1, "PC1 carries 0.682351 of the variance and PC2 0.275380, a cumulative 0.957731. What share do PC3 and PC4 carry together?",
 "0.042269",
 ["0.024446", "0.957731", "0.017823"],
 "The cumulative ratio reaches 1.000000 at PC4, so the last two carry 1 less 0.957731, which is 0.042269. 0.024446 is PC3's share alone, 0.017823 PC4's alone, and 0.957731 is the share of the first two."),

q(3, "`pca` is asked for `nComponents` 2 on the four logs. What explained variance ratios does it return for the two components kept?",
 "0.682351 and 0.275380, the same as with four kept",
 ["Two ratios rescaled so that the two components kept add to 1",
  "0.957731 for PC1, since the share of the dropped components moves to the first",
  "Two ratios computed over the two kept components only, so both change"],
 "The ratio is always taken over all four components, so keeping fewer does not inflate the ones kept: nComponents 2 returns the same first two ratios, 0.682351 and 0.275380. 0.957731 is their cumulative share. No ratio is recomputed over the kept components."),

q(0, "`pca` is asked for five components of the four logs. What comes back?",
 "A refusal: \"nComponents must be a whole number from 1 to 4 (the number of features)\".",
 ["Four components and a fifth of zero variance, with a warning that it is empty.",
  "Four components, the engine quietly lowering the request to the number of logs.",
  "The call is refused by naming `X`, since the table has too few columns for five."],
 "A table of four logs has four directions and no more, and the engine refuses the request by naming `nComponents`. It returns nothing, pads nothing and lowers nothing on its own."),

q(2, "`pca` on the correlation matrix took 6 sweeps of Jacobi rotations and converged. What happens when the sweep numbered `maxSweeps` still needs a rotation?",
 "The result is returned with `converged` false and a warning that Jacobi did not converge.",
 ["Refused by naming `maxSweeps`, with no eigenvalues coming back at all.",
  "Sweeping continues past `maxSweeps` until the rotations stop, then `converged` reads true.",
  "Eigenvalues come back as zeros, marking that the rotations were cut short."],
 "A run that does not converge is a result with a warning, never a refusal: the engine returns the eigenvalues and components after the last sweep and sets `converged` false. maxSweeps is a limit the engine keeps. The refusal on maxSweeps is for a value below 1, such as 0."),

q(3, "NPHI's weight on PC1 is 0.541336 and its loading 0.894337. How are the two related?",
 "The loading is the weight times the square root of PC1's eigenvalue, 2.729404.",
 ["The weight squared plus PC1's explained variance ratio, 0.682351.",
  "One number printed twice, the loading carrying extra decimals.",
  "Weight equals the loading divided by the number of logs, which spreads it over the four."],
 "A loading is the weight times sqrt(eigenvalue); in the correlation form it is the correlation between the log and the component score. sqrt(2.729404) times 0.541336 gives 0.894337. Weight and loading are different numbers for the same log, and a quote names which one it is."),

q(1, "On PC1, GR and NPHI load positive (0.699368 and 0.894337) and RHOB and PEF load negative (-0.808009 and -0.887452). Which row scores high on PC1?",
 "One reading high gamma ray and neutron with low density and photoelectric factor.",
 ["A row reading high on every log at once, since a high score adds all four logs together.",
  "The row with the highest density and photoelectric factor, as those loadings are the largest.",
  "Any shale row, since PC1 was built to pick out the shale."],
 "A row high on PC1 reads high GR and NPHI and low RHOB and PEF, and a row low on PC1 reads the reverse. High on every log describes PC2, where all four load positive. The size of a negative loading pulls a high reading down the score. PC1 was found from logs alone, with no core."),

q(2, "A learner writes: \"high PC1 is shale and low PC1 is limestone\". What does the course say about that sentence?",
 "It assumes rock types from the signs; a component is a direction in the logs.",
 ["It is correct, because the loadings of PC1 match the textbook shale response.",
  "Shale and limestone are the right names, provided the component is from the covariance matrix.",
  "Correct for the cored wells, and wrong only for EKENE-7 and EKENE-8."],
 "The component was found from the logs alone with no core in the calculation. The rock types it separates are read by matching against core, which is the Professional tier's work, and never assumed from the signs, whichever matrix produced it and whichever well the rows come from."),

q(0, "Another tool returns the Ekene PC1 with every weight's sign flipped. What does that mean?",
 "The same direction: a component times -1 describes the same line through the logs.",
 ["One of the two tools has a defect, because the weights of a component are unique.",
  "The flipped component is a different one, carrying the variance PC2 carries here.",
  "Rows that scored high now score low, so the clusters built on the scores must differ."],
 "The sign is a convention. The engine fixes it so the largest absolute weight in each component is positive; on PC1 that is NPHI's 0.541336. Another tool may return every weight, loading and score flipped together, and nothing about the rows has changed. Compare loadings between tools only after checking each one's sign convention."),

q(3, "The PC1 scores of the 180 cored rows are computed. What is the sample variance of that column of scores?",
 "2.729404, PC1's eigenvalue",
 ["1.000000, since scores are standardised like the logs",
  "0.682351, the explained variance ratio of PC1",
  "0.894337, the largest PC1 loading, NPHI's"],
 "The sample variance of each score column is its eigenvalue, checked to 1.00e-9 on all four columns, so the PC1 scores vary with variance 2.729404. The ratio 0.682351 is that eigenvalue over the total of 4.000000, and 0.894337 is NPHI's loading on PC1."),

q(1, "EKENE-7, uncored, is passed to `pcaTransform` with the two-component model fitted on the 180 cored rows. How are its rows scored?",
 "With the fitted centre, scale and components; nothing is recomputed from EKENE-7.",
 ["With a centre and scale refitted on EKENE-7's own 30 rows.",
  "EKENE-7 is folded into the fit and the components are recomputed on the cored and EKENE-7 rows together.",
  "By its nearest cored row, whose fitted score is copied across."],
 "pcaTransform scores new rows with the parameters fitted on the cored rows and never refits; its basis reads that rows are centred and standardised with the fitted parameters, times the 2 unit components. EKENE-7's first row scores -2.713199 on PC1 that way. Refitting would give the new well its own frame, and its scores could no longer sit beside the cored rows'."),

q(2, "A k-means result is passed to `pcaTransform` where a PCA result belongs. What does the engine reply?",
 "\"model must be the result of pca\", naming the field `model`.",
 ["Centres stand in for components, and the rows are scored.",
  "A refusal naming `X`, since the new rows carry no principal components.",
  "The scores of the fitted model, taken from the last PCA run in the session."],
 "pcaTransform checks what it is given and refuses a model that is not a pca result, naming `model`. It never treats centres as components and keeps no memory of earlier runs. The X refusal of pcaTransform is for new rows with the wrong number of columns: \"X must have 4 columns, as the PCA was fitted on\"."),

emit(Q, '/root/dai-wip-facies/banks/d3b_m03.json', expect_n=15)
finish()
