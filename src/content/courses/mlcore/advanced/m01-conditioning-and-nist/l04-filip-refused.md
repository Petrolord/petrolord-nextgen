# Filip, refused at the default

{{panel:ml-diagnose-explorer}}

Filip is the NIST reference problem the engine will not fit at its default settings. It is a degree ten polynomial in one variable: 82 rows and 11 coefficients, the powers of one x from the zeroth to the tenth, and NIST rates it higher difficulty. Its scaled condition number, which the refusal below prints in full, is above the default limit of 1.00e+8, and so the engine refuses it. This lesson reads that refusal as what it is: the engine refusing to promise digits it cannot deliver.

| Filip | value |
| --- | --- |
| rows | 82 |
| coefficients | 11 |
| scaled condition number | above 1.00e+8, printed in full in the refusal |
| result at the default maxCondition 1.00e+8 | refused |
| result at maxCondition 1.00e+10 | fitted |
| smallest coefficient LRE at 1.00e+10 | 7.66 |
| float-design limit | 7.66 |
| R-squared LRE at 1.00e+10 | 10.37 |

## The refusal, in the engine's words

> X is too ill-conditioned for a float64 least squares fit: the scaled condition number 5206821213.915052 is above maxCondition 100000000, so some coefficients could carry no reliable digits; drop or combine collinear features, centre or rescale them, or raise maxCondition knowingly

The refusal names the field, `X`, gives its reason, and prints nothing that could be mistaken for an answer.

## Raised knowingly

At maxCondition 1.00e+10 the engine fits Filip, and its smallest coefficient LRE is 7.66. That is roughly seven or eight leading digits of agreement with the certified coefficients, where every other NIST problem the engine ran agrees to at least 13.

Where does the loss come from? The float-design limit answers it: a measure of how many certified digits the float64 inputs themselves allow, the exact solution of the design as rounded to float64. For Filip that limit is 7.66, and the engine's smallest coefficient LRE also prints as 7.66.

Printed alike is not equal, and the course claims no more than agreement at two decimals. What it does claim holds either way: the certified values cannot be reached from float64 data by any method to more digits than the float-design limit, so the digits Filip is missing are an input limit.

## Why the default refuses anyway

Why refuse at the default, then? Because the engine cannot know in advance, on your data, whether the digits it would print are good. The limit of 1.00e+8 is where the worst-case bound reaches the size of the coefficient. Above it, some coefficient could carry no reliable digit at all, and on your data nothing tells the engine which fits those are. So at the default it declines to print.

Raising the limit moves that responsibility to you: you have looked at the design, you accept that some coefficients may carry few digits, and you will say so wherever they are used. On Filip the NIST certificate checks the result. On a well, nothing does.

## Filip on a well

The Ekene attribute design reads 7608.495043, far below the limit. A design built from the powers of one variable, depth or a log, has Filip's shape, and the remedies the message names come first: centre or rescale, or drop or combine the collinear features.

## Exercise

Open the panel on the condition view. Build a table with one column x of ten values over a narrow range, and add its powers up to the fifth. Fit it at the default maxCondition: if the engine refuses, copy the field the refusal names, and if it fits, read the scaled condition number. Then centre x on its mean before taking the powers, fit again, and write down both scaled condition numbers.
