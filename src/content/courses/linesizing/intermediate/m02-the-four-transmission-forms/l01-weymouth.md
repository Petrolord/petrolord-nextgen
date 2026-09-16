# Weymouth

On the SOKU trunk Weymouth reads 66104956.1404 scfd. It is the lowest of the four forms on this line, and it is the one with the largest diameter exponent, 2.6666666667.

{{panel:fc-gasline-explorer}}

## The four published Weymouth cases

| bore in | length miles | inlet psia | outlet psia | rise ft | efficiency | engine scfd | golden scfd |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 12.000000 | 50.000000 | 900.000000 | 500.000000 | 0.000000 | 1.000000 | 70590220.5870 | 70644595.1840 |
| 6.065000 | 10.000000 | 1200.000000 | 900.000000 | 0.000000 | 0.950000 | 24925322.1809 | 24938848.6158 |
| 16.000000 | 80.000000 | 700.000000 | 650.000000 | 0.000000 | 0.920000 | 39887572.7874 | 39922125.7012 |
| 8.000000 | 25.000000 | 1000.000000 | 600.000000 | 800.000000 | 1.000000 | 35264696.4591 | 35286509.1170 |
| 8.000000 | 25.000000 | 1000.000000 | 600.000000 | -800.000000 | 1.000000 | 36855536.7412 | 36879505.1455 |

Five cases, from a ten mile lateral to an eighty mile trunk, and the engine value and the golden are printed side by side on every one of them, so each pair can be read rather than taken on trust.

## What it asks for and what it does not

Weymouth takes the bore, the length, the two pressures, the gas gravity, the flowing temperature, the compressibility, the elevation change and an efficiency. It does not take a roughness and it does not report a friction factor. Of the four forms in this module only General Flow says anything about the roughness of the pipe at all, which means a Weymouth answer cannot be interrogated about the surface it was computed for.

That is not a fault. It is what a transmission form is: a published correlation fitted to a class of lines, returning a rate for a small set of inputs. Everything it knows about the pipe is the bore and the length.

## What the five cases cover

The set moves one thing at a time. Bores run from 6.065000 in to 16.000000 in and lengths from 10.000000 to 80.000000 miles. Inlets run from 700.000000 psia to 1200.000000 psia. Three of the cases are flat and the last two are the same pipe climbing and descending. A reader checking an implementation against this table can therefore separate a bore error from a length error from an elevation error, which no single case allows.

## The efficiency multiplies it

| efficiency | rate scfd |
| --- | --- |
| 0.850000 | 56189212.7194 |
| 0.900000 | 59494460.5264 |
| 0.950000 | 62799708.3334 |
| 1.000000 | 66104956.1404 |

The efficiency enters linearly, so it is the easiest input in the whole module to move an answer with and the hardest to defend. It is held for the literature in this course, which means it is taught as a limit and never graded, and every graded gas figure here states the efficiency it was computed at. A Weymouth rate quoted without its efficiency is not a reproducible number.

## The last two published cases are the same line twice

The 8.000000 in case at 25.000000 miles is run at 800.000000 ft of rise and at 800.000000 ft of fall on otherwise identical inputs, and reads 35264696.4591 scfd climbing against 36855536.7412 scfd descending. The elevation term is shared by all four forms and gets a module of its own next.

## The mistake

The mistake is quoting a Weymouth rate as the rate. It is one of four published answers to the same question, and on this trunk it is the smallest of them.

The second mistake is comparing a Weymouth figure from a report against one from this engine without checking the efficiency each was computed at, because the two can differ by that factor alone.

## Exercise

Give the Weymouth rate on the SOKU trunk and its diameter exponent. Write the five published cases with their efficiencies. Then state the Weymouth rate at efficiencies of 0.850000 and 1.000000, and say why the efficiency is never a graded figure in this course.
