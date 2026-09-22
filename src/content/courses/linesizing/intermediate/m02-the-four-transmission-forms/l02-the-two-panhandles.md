# The two Panhandles

On the SOKU trunk Panhandle A reads 86864172.0167 scfd and Panhandle B reads 88369202.2673 scfd. Against Weymouth on the same inputs those are 1.314034 and 1.336801, and Panhandle B is the highest of the four forms on this line.

{{panel:fc-gasline-explorer}}

## Two forms that are close to each other and far from Weymouth

| form | rate scfd | against Weymouth | diameter exponent |
| --- | --- | --- | --- |
| panhandleA | 86864172.0167 | 1.314034 | 2.6182000000 |
| panhandleB | 88369202.2673 | 1.336801 | 2.5300000000 |

The two sit near one another and both stand well above Weymouth, and above General Flow as well, so they are the top pair of the four on this line. The exponents are the surprise on this table. Panhandle B returns the largest rate of the four on this trunk while carrying the smallest diameter exponent of the four, so the answer it gives and the way it responds to a change of bore are separate properties of the form.

## Why the literature carries two

Panhandle A and Panhandle B are separate published correlations rather than a form and a revision of it. They were fitted to different behaviour and they carry different diameter exponents, 2.6182000000 and 2.5300000000, so neither supersedes the other and the engine offers both. A reader who treats them as a single Panhandle method has collapsed two answers into one, and will not be able to say which of them a quoted rate came from.

## The Panhandle B form

    Q = 737 E (Tb/Pb)^1.02 [(p1^2 - e^s p2^2) / (G^0.961 T Le Z)]^0.51 d^2.53

with the same symbols, base conditions and elevation group as Weymouth in the previous lesson. Every exponent in it is part of the correlation, so a spreadsheet has to carry each one exactly as printed.

## The efficiency, on both

| efficiency | panhandleA scfd | panhandleB scfd |
| --- | --- | --- |
| 0.850000 | 73834546.2142 | 75113821.9272 |
| 0.900000 | 78177754.8151 | 79532282.0406 |
| 0.950000 | 82520963.4159 | 83950742.1539 |
| 1.000000 | 86864172.0167 | 88369202.2673 |

Both carry it linearly, exactly as Weymouth does, and neither is defended by this course at any particular value of it. Panhandle A at an efficiency of 0.850000 reads 73834546.2142 scfd, which is below the General Flow rate of 73861363.0502 scfd at an efficiency of 1.000000, although Panhandle A stands above General Flow whenever the two are read at the same efficiency. Two forms at two efficiencies can be ordered any way the efficiencies please, which is why the efficiency travels with the rate or the rate means nothing.

## The published cases, climbing and descending

| form | bore in | length miles | rise ft | engine scfd | golden scfd |
| --- | --- | --- | --- | --- | --- |
| panhandleA | 8.000000 | 25.000000 | 800.000000 | 48793391.4090 | 48792595.2876 |
| panhandleA | 8.000000 | 25.000000 | -800.000000 | 51172143.3134 | 51173062.3832 |
| panhandleB | 8.000000 | 25.000000 | 800.000000 | 50201570.7749 | 50201274.5831 |
| panhandleB | 8.000000 | 25.000000 | -800.000000 | 52512554.8691 | 52513946.9003 |

Both forms take the same elevation change in feet and both read higher descending than climbing, on the same pipe at 1000.000000 psia in and 600.000000 psia out.

## Two forms agreeing is not two pieces of evidence

The two rates sit close together at 86864172.0167 and 88369202.2673 scfd, and that closeness invites a reading as corroboration. It is not corroboration. Both are empirical transmission correlations of the same family, so their proximity says they were fitted to similar behaviour rather than that either is right about this trunk. The honest statement is that this line has four published answers and two of them happen to be near each other.

## The mistake

The mistake is treating the two as one form because their names match and their answers are close. They are separate correlations with separate exponents, and on the diameter table in this module they do not stay in the same order.

The second mistake is reading the gap to Weymouth as an error in Weymouth. Nothing here says which of the three is right.

## Exercise

Give both Panhandle rates on the SOKU trunk and each one against Weymouth. State both diameter exponents and say which form has the smallest of the four. Then give Panhandle A at an efficiency of 0.850000 and explain why it can sit below a General Flow rate it stands above at equal efficiency.
