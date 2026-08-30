# Standoff, defined

One ratio, between zero and one, and it is not the eccentricity.

{{panel:cm-standoff-explorer}}

## The definition

    standoff = narrow side gap / concentric gap

where the concentric gap is the clearance the annulus would have if the pipe were centred:

    clearance = (bore - casing OD) / 2

## The two ends

**Standoff of one.** The pipe is perfectly centred. The narrow gap equals the concentric clearance, because every gap does.

**Standoff of zero.** The pipe is touching the wall. There is no narrow gap at all.

## In the engine

    standoff = (clearance - deflection) / clearance

where the deflection is how far off centre the pipe has moved. So a deflection equal to the clearance gives zero and no deflection gives one.

## Standoff is not eccentricity

Eccentricity is the offset divided by the clearance, so

    eccentricity = 1 - standoff

They carry the same information and run in opposite directions, and both are quoted in the literature. Confusing them is a real error: a standoff of 67 percent is an eccentricity of 33.

This course uses standoff throughout, and so does API.

## The clearances on this well

Two of them, because there are two annuli.

**Cased section**, between 7 inch casing and a 9-5/8 inch bore:

    (0.2204974 - 0.1778) / 2 = 0.021348699999999998 m

**Open hole**, between 7 inch casing and an 8-1/2 inch bit:

    (0.2159 - 0.1778) / 2 = 0.019049999999999997 m

Nineteen millimetres. That is the whole distance the pipe has to move to be touching the wall, and the sag term in module 3 uses up a sixth of it in one span.

## Which bore the clearance is measured in

The NOMINAL one. The standoff calculation runs `annulusRows` with an excess of zero, deliberately, so a washed-out hole is treated at its bit size here even though the volume calculation inflates it.

Module 4 has a lesson on whether that is right.

## Reported three ways

Every interval in the profile carries three numbers: the standoff AT a centralizer, the standoff at MID SPAN between two of them, and the smaller of the two, which is the one reported.

## Exercise

Compute the clearance for 7 inch casing in a 12-1/4 inch hole, and compare it with the 19 mm this well has in its 8-1/2 inch section.

Then say which of the two would be easier to centralize, and which would be easier to channel.
