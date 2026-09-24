# Logs as a signature of rock

{{panel:ef-cluster-explorer}}

A wireline log reads the rock beside the borehole one depth sample at a time. A shale is rich in clay and reads a high gamma ray. A clean limestone is dense and reads a high photoelectric factor. A sandstone sits between them on the gamma ray and the neutron, and reads the lowest density and photoelectric factor of the four. Put four logs side by side and each kind of rock leaves its own pattern across them, a signature. This course groups depth samples by that signature, and then asks what the groups are worth.

| row, counted from 0 | core facies | GR (gAPI) | RHOB (g/cm3) | NPHI (v/v) | PEF (b/e) |
| --- | --- | --- | --- | --- | --- |
| 0 | sandstone | 48.900000 | 2.284000 | 0.225000 | 1.660000 |
| 6 | shaly-sand | 59.800000 | 2.415000 | 0.221000 | 1.990000 |
| 13 | limestone | 27.800000 | 2.661000 | 0.062000 | 4.930000 |
| 28 | shale | 107.300000 | 2.600000 | 0.328000 | 3.130000 |

## Four logs, four readings

The table holds the first sample of each facies among the 180 cored rows of the Ekene field, all four from EKENE-1. Read it across. Row 28, a shale, has the highest gamma ray at 107.300000 gAPI and the highest neutron porosity at 0.328000. Row 13, a limestone, has the lowest gamma ray at 27.800000 gAPI, the highest bulk density at 2.661000 g/cm3 and the highest photoelectric factor at 4.930000 b/e.

Rows 0 and 6 are harder. The sandstone reads 48.900000 gAPI and the shaly-sand 59.800000; their neutron readings, 0.225000 and 0.221000, almost agree. A signature can be sharp for one rock and faint for another.

## What an electrofacies is

An electrofacies is a group of depth samples whose logs look alike. The engine makes the groups from the logs alone, with no core in the calculation, and calls each group a cluster. Clusters are numbered from 0, and the number is a name with no meaning of its own. A cluster read as a rock type is an electrofacies, and it takes a facies name only after it has been matched against core. That matching belongs to the Professional tier.

## The methods at this tier

Principal components find the directions along which the rows spread most. k-means clustering, a machine learning method, splits the rows into k clusters around k centres.

Every call returns one of two shapes. A call the engine can answer returns a result with a `basis` block naming the convention it used, so the working can be printed. A call it cannot answer returns an `error` and a `field`, and the field names the exact input it refused.

## What the engine leaves to you

It does not fill a missing value. It does not choose the logs, and it does not choose the number of clusters. Those are decisions you write down and defend.

## Exercise

Open the cluster explorer and choose the view "The nearest rows, raw and scaled". It opens on the cored rows with the logs GR, RHOB, NPHI and PEF. Set the row to 13 and the scaling to standard, and list the five nearest rows. Write down the well of each and its distance on the scaled logs. Repeat for row 28. Then switch the scaling to none and note which rows join or leave each list.
