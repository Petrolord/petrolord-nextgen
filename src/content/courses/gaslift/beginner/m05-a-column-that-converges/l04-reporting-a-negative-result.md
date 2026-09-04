# Reporting a negative result

This column has no truncation problem. That is a finding, it cost the work a defect would have cost, and it is worth something only because the same test would have caught one.

{{panel:pd-column-explorer}}

## The test

Refine and watch. One march at rising step counts, against three references. It behaves three ways, and every difference is in the references.

## A truncation, on published column 2

| Steps | Error, psi | Ratio to the row above |
| --- | --- | --- |
| 1 | 1.4904e+0 | |
| 2 | 3.9192e-1 | 3.8028 |
| 4 | 9.9299e-2 | 3.9469 |
| 5 | 6.3652e-2 | 1.5600 |
| 10 | 1.5946e-2 | 3.9917 |
| 20 | 3.9886e-3 | 3.9980 |

Against a 20000 step march of the same column the error falls by a factor near 4 at every doubling and heads for zero. The 5 step row is the exception at 1.5600, because 5 is not a doubling of 4. It reaches 9.9726e-4 psi at 40 steps.

## One march, two closed forms

With z pinned at 1 and the temperature held, the march has a closed form to reproduce, in two spellings. The textbook one carries the rounded coefficient 0.0187500000. The engine carries AIR_MW over 144 R, which is 0.0187417041, lower by 4.4264e-4 relative. On a 1014.7 psia column over 8000 ft the two stand 8.5879e-2 psi apart.

| Steps | March, psia | Textbook form, psi | Engine form, psi |
| --- | --- | --- | --- |
| 2 | 1193.869339003 | 2.0476e-2 | 1.0635e-1 |
| 10 | 1193.767253577 | -8.1609e-2 | 4.2694e-3 |
| 40 | 1193.763251026 | -8.5612e-2 | 2.6688e-4 |
| 200 | 1193.762994823 | -8.5868e-2 | 1.0675e-5 |
| 2000 | 1193.762984255 | -8.5879e-2 | 1.0676e-7 |

One column parks at -8.5879e-2 psi and never moves again. The other divides by close to 4 every doubling and reaches 1.0676e-7 psi. The marched pressures are identical.

## What a parked residual says

Not that the method is bad. That two different things are being compared, and the job is to find which two. Here it was one constant written two ways, agreeing to four significant figures and no further.

It is why the first version of this check could not fail: it printed the textbook form alone, watched the residual sit still and called that convergence.

## The mistake

Concluding from a small number that the answer is right. The 20 step error is 2.4891e-6 of the lift on column 1 and 1.4365e-7 on constantPressurePPO, and neither says a word about the gradient model or the declared kill fluid.

The opposite mistake is worse, and a course full of defect reports teaches it. Believe every method is suspect and you refine until the machine runs out of patience, still not knowing which case you are in.

## How to report it

What was measured, at what resolution, against what reference, and what a failure would have looked like. Change the reference alone and the same march reports 1.0676e-7 psi or -8.5879e-2 psi.

## Exercise

Take the three sequences and write what each proves.

Then say which would have caught a real truncation defect and which would have hidden one.
