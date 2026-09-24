# The Ekene facies wells and their logs

{{panel:ef-cluster-explorer}}

Every row in this course comes from one generator, which draws through the platform's canonical mulberry32 random number generator on one stated seed, 20260924, and rounds every value to the decimals a real file carries. The Ekene field is synthetic, and that lets the course state exactly what was planted in it and then check that the methods find it.

| well | top depth (ft) | cored | rows |
| --- | --- | --- | --- |
| EKENE-1 | 6216 | yes | 30 |
| EKENE-2 | 6280 | yes | 30 |
| EKENE-3 | 6345 | yes | 30 |
| EKENE-4 | 6389 | yes | 30 |
| EKENE-5 | 6447 | yes | 30 |
| EKENE-6 | 6507 | yes | 30 |
| EKENE-7 | 6565 | no | 30 |
| EKENE-8 | 6633 | no | 30 |

## Eight wells, 240 rows

Each well carries 30 samples at a one foot step from its own top depth, 240 rows in all. Five channels are logged on every row: GR, the gamma ray in gAPI; RHOB, the bulk density in g/cm3; NPHI, the neutron porosity in v/v on limestone units; PEF, the photoelectric factor in b/e; and CALI, the caliper, the hole diameter in inches. A sixth column, FACIES, holds the core facies on the six cored wells and is null on the two uncored ones.

## How the facies were drawn

Each sample belongs to one of four facies. A well keeps the facies of the sample above with probability 0.8 and otherwise draws a facies at random, so the facies come in blocky runs down each well, as beds do. Each facies then draws each log from its own normal distribution. Shale is centred on a gamma ray of 118 gAPI, sandstone on 45, shaly-sand on 66 and limestone on 28. Limestone is centred on a density of 2.64 g/cm3 and a photoelectric factor of 4.9 b/e, well above the other three.

Two bounds are held exactly. Limestone NPHI is held at or below 0.12 and every other facies at or above 0.13; limestone PEF at or above 4.2 and every other facies at or below 3.9. The caliper is 8.5 in plus the size of a normal draw, so at or above 8.5 in, whatever the facies: it carries no facies signal.

## Why the caliper is left out

This tier clusters on four logs, GR, RHOB, NPHI and PEF. CALI measures the hole, and here it was drawn with no link to the rock. A log with no rock signal still moves every distance. Choosing the logs is your decision, made before the engine runs.

## The two uncored wells

EKENE-7 and EKENE-8 have no core. This tier uses EKENE-7 as a new well: its rows are projected onto the principal components and placed at the nearest cluster centre. EKENE-8 was logged with a gamma ray tool reading 30 gAPI above what the rock gives on every sample. It is a deliberate trap for a later tier, and the course states it openly because the field is synthetic. A real field tells you no such thing, and a miscalibrated tool has to be caught in the data before anything is clustered, which is the data quality course's work.

## Exercise

Open the cluster explorer on the view "Standard and min-max scaling". The table holds the 180 cored rows. Write down the minimum and maximum of each log. Then open the view "New rows at the nearest centre", copy the EKENE-7 rows it opens with, paste them into the scaling view's table in place of the cored rows, and read their minimum and maximum. For each log, write down whether EKENE-7 stays inside the range of the cored rows.
