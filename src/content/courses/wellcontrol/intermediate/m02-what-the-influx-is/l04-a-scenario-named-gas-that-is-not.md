# A scenario named gas that is not

A finding, and what it says about labels.

{{panel:wc-killsheet-explorer}}

## The observation

This course's goldens carry two scenarios, and their names are `moderate_gas` and `small_liquid`.

The first computes an influx density of 1026.3187985168897 kg/m3. The threshold for a liquid is 960. So the scenario named GAS classifies as a LIQUID.

## Why

Because the classification is a computation and the name is a label.

The scenario's SICP exceeds its SIDPP by 900000 Pa over an influx height of 221.8482706948928 m. That difference implies a density deficit of about 414 kg/m3 below the mud, which lands at 1026, well above the gas threshold.

For the influx to have classified as gas, the same pit gain would have needed a much larger pressure difference: roughly 2.1 MPa rather than 0.9.

## Which one is right

The computation, given its inputs. The label was chosen by whoever built the fixture and it describes an intent rather than a result.

## What this is an example of

A number that carries a name it did not earn.

The same pattern appears everywhere in this series: a friction factor called a coefficient of friction, a scenario called gas, a fitted parameter called a measurement. In each case the label came from a person and the value came from a calculation, and they can disagree.

## Why the course does not fix it

Because the fixture is the published oracle and changing it would break the comparison.

And because the disagreement is more useful than the tidy version would be: it is a live demonstration that the classification is computed from the readings rather than assumed from the situation.

## What a real gas kick would look like

The same pit gain with a much larger difference between the two gauges. If the SICP had been 4.1 MPa against a SIDPP of 2.0, the implied density would be around 475 and the classification would be gas.

That is a useful calibration: on this well and this pit gain, roughly 2 MPa of difference separates a gas kick from a liquid one.

## The habit

Read the computed density, not the name on the file. And when reporting an influx, give the density and the two readings it came from rather than the word.

## Exercise

Work out what SICP the moderate scenario would need for its influx to classify as gas at 480 kg/m3.

Then say whether that casing pressure would be within the MAASP on either of the two wells, using the values from the tolerance explorer.
