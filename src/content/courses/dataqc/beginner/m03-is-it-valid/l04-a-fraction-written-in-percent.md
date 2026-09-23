# A fraction written in percent

{{panel:dq-checks-explorer}}

EKENE-7's neutron porosity is delivered as a fraction in v/v, except for ten samples, entries 150 to 159, which were written in percent. This is a stated planted defect, and a common kind of unit slip: the same quantity in the same channel, written a different way partway down. Checked against the fraction limit in v/v, each of the ten fails as above the maximum.

| entry | NPHI as delivered | the engine reason |
| --- | --- | --- |
| 150 | 23.300000 | value 23.3 is above the maximum 1 |
| 151 | 21.900000 | value 21.9 is above the maximum 1 |
| 152 | 26.600000 | value 26.6 is above the maximum 1 |

The first three of the 10 flags are shown. The value column is the flag's numeric field at six decimals; the reason column is the engine's sentence, verbatim.

## Why the fraction limit catches it

A fraction lies in [0, 1]. That is the whole of the definitional limit for the fraction channel, and it covers water cut, porosity, saturation, shale volume and net to gross alike. A porosity written as a percentage lands far above one, so the maximum fires on every sample of the stretch. The rule is `above-maximum`, and each flag carries it.

The maximum is inclusive. A value of 1 is allowed and a value above 1 is not. The fraction's minimum is not marked excluded either, so 0 and 1 are both allowed values.

## What the flag does and does not tell you

The flag tells you ten values cannot be fractions. It does not tell you they are percentages. The engine never converts a unit, so it will not turn them back into fractions for you, and it does not guess at the cause. A percent slip is the likeliest story here, and the stated defect confirms it, but in a file you received the same flags could come from a different channel pasted into the wrong column. Deciding which is the caller's work, done with the file header and the logging run notes in hand.

## The slip the limit cannot see

Here is the honest limit. The fraction check catches a percent value only when the percentage is larger than one. A percent value at or below one would sit inside [0, 1] and pass without a flag. On a porosity log that is unlikely, but on a channel whose true values are small, a percent slip could hide entirely inside the definitional range. The same slip turns up in production data, and module five meets it in a water cut column.

## Where the stretch sits

Entries 150 to 159 lie inside the water sand, which runs from entry 130 to 199, and the neutron values on either side of the stretch are fractions. The range flags hand you the positions; the explanation you write from them is yours.

## Exercise

Open the checks explorer on the view for range limits and rate rules. The values box holds EKENE-7's neutron across the percent stretch, with the channel set to fraction in v/v. Read the Failed tile and count the flags. Find the flag whose reason reads "value 23.3 is above the maximum 1" and write down its value as a numeric field at six decimals. Now change that one value to 1 and read the Failed tile again, then explain what the change shows about the maximum.
