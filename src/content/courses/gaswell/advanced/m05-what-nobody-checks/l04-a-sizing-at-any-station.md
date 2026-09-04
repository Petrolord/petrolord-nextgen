# A sizing at any station

`sizeTubingForRate` takes a pressure, a temperature and a compressibility. It has no opinion about where they were read.

{{panel:pd-remedy-explorer}}

## Two sizings of one well

The teaching well EBOCHA-5 flows 3100.0 Mscf/d up 3.548 in tubing to a wellhead at 880.0 psia, with a shoe at 7500.0 ft and 1500.0 psia. Hand the sizing the shoe and it works on the station that controls. Hand it the wellhead and it works, silently, on the station the operator happens to read.

| Candidate, in | Ratio at the wellhead | Ratio at the controlling station |
| --- | --- | --- |
| 3.958 | 0.9325742138 | 0.7729815504 |
| 3.826 | 0.9980333439 | 0.8272385726 |
| 3.740 | 1.0444599177 | 0.8657201053 |
| 3.548 | 1.1605604334 | 0.9619521855 |
| 3.476 | 1.2091368219 | 1.0022156322 |
| 3.068 | 1.5521163435 | 1.2865006128 |

Both columns are Coleman, both are the same nine candidate strings, and the two `largestUnloaded` answers are 3.740 in and 3.476 in. The station is worth 0.264 in of tubing. Under Turner the same pair is 3.476 in and 3.068 in, so it is worth 0.408 in there.

## The answer it gives on this well

The current string is 3.548 in and the wellhead sizing returns 3.740 in, so it reports that no workover is needed. The current string reads 1.1605604334 at the wellhead and 0.9619521855 at the controlling station, and the well is loading over the bottom 40.0000 percent of its tubing while that answer is returned.

## Nothing in the return records the station

The returned object carries three keys, rows, largestUnloaded and ok. Each row carries idIn, ok, correlation, adjustment, rhoGasLbFt3, terminalFtS, velocityFtS, constant, areaFt2, criticalVelocityFtS, criticalRateMscfd, actualVelocityFtS, ratio and loaded. The correlation is recorded on every row, as "coleman" or "turner", with its adjustment of 1.0000 or 1.2000 beside it. The depth is recorded nowhere. Two sizings of the same well at two stations are indistinguishable from their return values.

The caller was not even asked to work for it. The controlling point on the profile already carries pPsia = 1500.0, tempR = 653.67, z = 0.9142643742, idIn = 3.548 and depthFt = 7500.0, ready to hand straight in. Nothing makes anybody do it.

## This function does know how to refuse

Ask it to size for 40.0 Mscf/d and `largestUnloaded` comes back null, with a best ratio on the list of 0.0502326405. It will not hand back the least bad candidate. It also carries `ok`, which is false when the question could not be evaluated at all. So the omission is not an absence of judgement in the function, it is an absence of one particular question. That is what fails open here, and note where `ok` lands on it: a wrong station returns `ok: true`, because the sizing it was asked for was answerable and was answered. The boolean is honest about the question it covers and silent about the one nobody asked.

## Exercise

Write the wellhead pick and the controlling station pick under Coleman, then the same pair under Turner, and the difference in inches for each.

Then name the fields you would have to add to the returned object before a reviewer could catch this from the output alone.
