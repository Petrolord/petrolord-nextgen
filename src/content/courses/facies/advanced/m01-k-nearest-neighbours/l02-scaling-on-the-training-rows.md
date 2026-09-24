# A scaler fitted on the training rows

{{panel:ef-classify-explorer}}

Every kNN distance is taken on scaled logs, and the scaler has to be fitted on some set of rows. The engine fits it on the training rows only, and applies it unchanged to every new row. Its basis says so, in its own words:

> standard scaler (ml.js) fitted on the TRAINING rows only and applied unchanged to the new rows

## The fitted centre and scale

The standard scaler is the machine learning engine's own: each log centred on its mean and divided by its population standard deviation, divisor n. With EKENE-6 held out, it is fitted on the 150 training rows, and its figures differ from those of all 180 cored rows:

| log | centre, the 150 training rows | centre, all 180 cored rows | scale, training rows | scale, all cored rows |
| --- | --- | --- | --- | --- |
| GR | 54.556667 | 56.871111 | 33.066272 | 32.041141 |
| RHOB | 2.479020 | 2.466911 | 0.144780 | 0.136949 |
| NPHI | 0.180420 | 0.193239 | 0.099094 | 0.096603 |
| PEF | 3.264067 | 3.114444 | 1.330401 | 1.275647 |

The second pair of columns includes EKENE-6. Fitting on them would let the held-out well shape the space it is then scored in, and the score would stop describing a well the model had never seen. The training centre of GR is 54.556667 gAPI; EKENE-6's rows are measured against that figure, whatever EKENE-6 itself averages.

## Two wrong ways on the same well

The same k 5 and the same held-out well, scaled three ways, scored on the 30 rows of EKENE-6:

| scaling | accuracy on EKENE-6 |
| --- | --- |
| standard, fitted on the training rows (the engine's way) | 0.833333 |
| standard, EKENE-6 fitted on its own statistics | 0.466667 |
| none, raw logs | 0.633333 |

Scaling a well on its own statistics maps its own mean to 0, which is the training centre, whatever its rock. A well rich in one facies is pulled onto the middle of the training mixture, and its rows meet the wrong neighbours. On EKENE-6 the score falls from 0.833333 to 0.466667.

With no scaling, the distance is a gamma ray distance. GR is in gAPI and differs by tens of units between facies, while RHOB and NPHI differ by hundredths, so the density, neutron and photoelectric logs barely move a raw distance. Here it costs the held-out well, which scores 0.633333.

Neither wrong way is refused. Both return a prediction for every row, and only the held-out score shows the damage, which is why the engine makes the choice and prints it in the basis.

## A constant log in the training rows

A log that never changes on the training rows has a population standard deviation of 0, and the scaler cannot divide by it. kNN refuses it by name, in the machine learning engine's words. Passed GR and a caliper reading 8.5 on all 30 rows of EKENE-1 as training rows:

> X.CALI has zero variance on the 30 training rows (every value is 8.5): standardising would divide by zero, so drop the feature or fit on rows where it varies

The words name the rows the scaler was fitted on. In kNN those are the training rows, so the message says "training rows". The clustering functions and pca fit on every row passed and say "rows passed" instead; knnClassify is the only function whose message counts training rows.

## Exercise

Open the view "k nearest neighbours on a held-out well" with EKENE-6 held out and k 5. Read the accuracy with standard scaling, then switch the scaling to none and confirm 0.833333 and 0.633333. Switch to min-max, fitted on the training rows, and write down its accuracy beside the other two. Then hold out EKENE-3 instead, repeat all three scalings, and say whether the order of the three scores is the same on both wells.
