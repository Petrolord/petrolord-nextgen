# What conductivity buys

More conductivity is always better, right up to the point where it is worth almost nothing.

{{panel:st-pack-explorer}}

## A sweep at fixed proppant

The sweep in this module holds the placed proppant volume constant and moves the half-length. Shorter fractures spread the same pack over less face, so the propped width rises and the dimensionless conductivity rises with it. Longer fractures do the reverse. Every row below is the same proppant, redistributed.

| Half-length, m | Propped width, mm | Dimensionless conductivity | Pseudo-skin |
| --- | --- | --- | --- |
| 440 | 0.5152989 | 0.07728387174143661 | -4.59691654548207 |
| 260 | 0.8720443 | 0.2213336918512149 | -4.975795238259742 |
| 150 | 1.5115434 | 0.6649847808507611 | -5.3116380662677045 |
| 120 | 1.8894293 | 1.0390387200793143 | -5.386870011212449 |
| 90 | 2.5192390 | 1.8471799468076697 | -5.411369722473095 |
| 60 | 3.7788585 | 4.156154880317257 | -5.307558147157588 |
| 30 | 7.5577170 | 16.62461952126903 | -4.852065115237415 |

## Read the column of skins, not the column of conductivities

Going from 0.6649847808507611 to 1.0390387200793143 buys a real improvement in pseudo-skin. Going on to 1.8471799468076697 buys a fraction of that improvement. The curve has flattened.

Then it turns. At a dimensionless conductivity of 4.156154880317257 the pseudo-skin is worse than it was at 1.8471799468076697, and by 16.62461952126903 it has given back more than the whole of the gain. A fracture 30 m long is beautifully conductive and drains almost nothing.

## Why it flattens

Once the channel can already carry everything the rock delivers, widening it further removes a pressure drop that was never large. The limit is set by the reservoir, not by the pack. Meanwhile every step up the conductivity column was paid for in length, and length is what sets how much rock face the fracture is exposed to.

Searching the sweep for the best pseudo-skin lands on a half-length of 95.62290278496067 m with a dimensionless conductivity of 1.6363280590574483, giving a pseudo-skin of -5.4132436175894565. That is within a few per cent of the 1.6 optimum the engine carries as a constant, which is exactly where that constant comes from.

## Exercise

In the panel, walk the half-length down from 440 m to 30 m and note where the pseudo-skin stops improving.

Say which side of the optimum the published 150 m design sits on, and which of length or pack it needs.

Explain why a very high dimensionless conductivity is a warning sign at fixed proppant volume.
