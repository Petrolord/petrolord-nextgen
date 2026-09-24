# The whole workflow in order

{{panel:ef-cluster-explorer}}

Everything in this tier fits into five steps, each one an engine call, run on the Ekene cored wells. This lesson puts them in order and says what each step decides. Done in this order, every figure you quote can be traced to a call and its settings, and each step is checked before the next one leans on it.

| step | call | what it returns here |
| --- | --- | --- |
| 1 | choose the logs: GR, RHOB, NPHI, PEF; leave out CALI | 4 features on 180 rows |
| 2 | `pca` on the correlation matrix | the first two components carry 0.957731 of the variance |
| 3 | `kmeans` k 4, seed 3, 10 starts, standard scaling | inertia 58.289042; clusters of 29, 59, 54, 38 rows |
| 4 | read `centresOriginal` | cluster centres in gAPI, g/cm3, v/v and b/e |
| 5 | `assignClusters` for EKENE-7 | 30 rows placed at the nearest of the 4 centres |

## Step 1: the logs and the rows

Choose the rows and the logs before anything is computed. The rows are the 180 cored rows of EKENE-1 to EKENE-6. The logs are GR, RHOB, NPHI and PEF. CALI, the hole size, is left out because it carries no rock signal here and would still move every distance. Check for missing values now: the engine refuses a null by name and fills nothing.

## Step 2: principal components

Run `pca` on the correlation matrix. The first two components carry 0.957731 of the variance, so the four logs spread almost entirely within a plane. Read the PC1 loadings: GR and NPHI positive, RHOB and PEF negative. This step clusters nothing. It shows how the logs move together, which logs carry the spread, and whether a plot of PC1 against PC2 is a fair picture of the rows.

## Step 3: k-means

Run `kmeans` with k 4, seed 3, ten starts and standard scaling. The scaler is fitted on the 180 rows, with the population standard deviation (n). The winning start reaches an inertia of 58.289042, and the clusters hold 29, 59, 54 and 38 rows. Read `converged` and the starts table: here three of the ten starts reach the winning figure.

## Step 4: the centres in log units

Read `centresOriginal` and describe each cluster by its logs. One cluster has the highest gamma ray and neutron; another the lowest gamma ray and the highest density and photoelectric factor. Describe; do not name. A cluster takes a facies name only after matching against core.

## Step 5: a new well

Run `assignClusters` with the fitted model and the 30 rows of EKENE-7. The rows are scaled with the cored rows' scaler, never refitted, and placed at the nearest centre: 1 in cluster 0, 19 in cluster 1 and 10 in cluster 2. Read the distances as well as the labels. The largest EKENE-7 distance, 1.164413, sits within the largest cored distance, 1.168721.

## What the order protects

Each step depends on the one before. A log chosen badly in step 1 distorts every distance after it. A scaling left unstated in step 3 makes the inertia unreadable. A new well assigned with a refitted scaler in step 5 is measured on a different ruler from the clusters. Keeping the order, and writing down each setting as you go, is what makes the result reproducible by someone else.

## Exercise

Run the five steps yourself in the cluster explorer. Use "Principal components" for step 2, "k-means, start by start" for steps 3 and 4, and "New rows at the nearest centre" for step 5, all on the default cored rows. At each step write down the call, every setting you used and the figure it returned, and check each against the table above.
