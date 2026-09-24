# Centres back in log units

{{panel:ef-cluster-explorer}}

k-means works in standard units, and its centres come out in standard units too. A petrophysicist reads logs in gAPI, g/cm3, v/v and b/e. The engine therefore returns each centre twice: in the scaled space where the clustering happened, and put back into log units as `centresOriginal`, by reversing the scaling: centre x scale + mean, with the scaler fitted on the rows clustered.

| cluster | rows | GR (gAPI) | RHOB (g/cm3) | NPHI (v/v) | PEF (b/e) |
| --- | --- | --- | --- | --- | --- |
| 0 | 29 | 117.406897 | 2.510793 | 0.337069 | 3.213793 |
| 1 | 59 | 46.479661 | 2.325949 | 0.202712 | 1.983729 |
| 2 | 54 | 26.879630 | 2.642481 | 0.069037 | 4.909259 |
| 3 | 38 | 69.426316 | 2.402789 | 0.245263 | 2.243684 |

## The teaching clustering

From here on the course uses one clustering: k-means with k 4, seed 3 and 10 starts, standard scaling, on the 180 cored rows. Its inertia is 58.289042, and its winning start took 6 passes. The table gives each cluster's size and centre in log units.

Each centre in log units is the mean of its member rows' logs. That makes it easy to check: take the rows of cluster 2, average their GR, and you get 26.879630 gAPI.

## Describing a cluster by its logs

Read the table across, one cluster at a time, and describe what you see without naming a rock.

Cluster 0, 29 rows: the highest gamma ray, 117.406897 gAPI, and the highest neutron porosity, 0.337069, with a middling photoelectric factor.

Cluster 1, 59 rows: a moderate gamma ray, 46.479661 gAPI, the lowest density, 2.325949 g/cm3, and the lowest photoelectric factor, 1.983729 b/e.

Cluster 2, 54 rows: the lowest gamma ray, 26.879630 gAPI, the lowest neutron porosity, 0.069037, the highest density, 2.642481 g/cm3, and the highest photoelectric factor, 4.909259 b/e.

Cluster 3, 38 rows: a gamma ray between clusters 1 and 0, 69.426316 gAPI, with a density, neutron porosity and photoelectric factor each a little above cluster 1's.

Clusters 0 and 2 sit at opposite ends of the gamma ray and of the neutron porosity, with clusters 1 and 3 between them. On density and photoelectric factor the highest centre is cluster 2's and the lowest is cluster 1's.

## Why no rock names yet

You will know what those descriptions suggest. A high gamma ray and high neutron is a textbook shale response; a low gamma ray with a high density and photoelectric factor is a textbook limestone. The course still does not write "cluster 2 is limestone". The cluster was built from logs with no core in the calculation, its number came from where the starting rows fell, and some of its rows may be of another facies. A cluster takes a facies name only after it has been matched against core, row by row, and that is the Professional tier's work.

What this tier can write is a description in log units, with the clustering that produced it: k 4, seed 3, 10 starts, standard scaling, 180 cored rows.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Keep the cored rows, the four logs, k 4, seed 3 and ten starts, and check the centres against the table above. Write a one-line description of each cluster by its logs, with no rock name. Then set the scaling to none and read the centres again. Write down which cluster described above has no close counterpart in the raw run.
