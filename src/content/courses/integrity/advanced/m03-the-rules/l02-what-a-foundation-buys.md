# What a foundation buys

Half the required length, for one reason: a plug that cannot fall does not have to hold itself up.

{{panel:wi-pa-explorer}}

## The switch

The plug carries a `foundation` field with three values. `mechanical` means the cement was set on a bridge plug or a packer. `tagged` means the cement was set on a base the string physically found and confirmed. `none` means neither.

The engine treats `mechanical` and `tagged` identically. Either one halves the requirement from 100 m MD to 50 m MD. `none` leaves it at 100 m MD.

## Why halving is defensible

An unsupported column of cement in a wellbore is held in place by its bond to the wall and by the friction of a long interval. Length is the design variable you have. More length is more bonded area, more resistance to being pushed, and more tolerance for the top and bottom of the column being contaminated by whatever it was pumped through.

Put the same cement on a foundation and the mechanics change. The column is not relying on its own length to stay where it was placed. It is sitting on something. What the length still has to buy is a seal across the bore and a margin against contamination at each end, and that is a smaller job.

## What the sweep says

Of the ten swept lengths, **four pass only because of the foundation**: 50 m, 60 m, 80 m and 98 m. Each of these fails the 100 m open hole requirement and clears the 50 m foundation requirement.

Three lengths pass either way, 100 m, 120 m and 150 m. Three fail either way, 30 m, 45 m and 48 m. So for four cases out of ten, the entire verdict is decided by a field describing what is underneath the cement rather than by the cement.

## The word "verified" is doing work

The engine reads the string. It has no way to check that the bridge plug was set where the report says, or that the tag was a real tag rather than a soft touch on fill. Passing `foundation: 'mechanical'` is a claim you are making, and the check believes it.

That is the same trap the Associate tier sets around element status. The engine grades the description you give it, so the description has to be honest.

## Exercise

1. Set a 60 m plug with `foundation: 'none'` and read the margin. Change the field to `mechanical` and read it again.
2. Confirm that `tagged` and `mechanical` give an identical result at every length.
3. For one plug in your own programme, write down the document that supports its foundation claim.
