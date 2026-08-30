# The warnings, one at a time

Five things the placement can say, and each names its own numbers.

{{panel:cm-placement-explorer}}

## One, the density hierarchy

    Density hierarchy: 'lead' (1560 kg/m3) is lighter than the fluid ahead of it (1500 kg/m3).

Checked over the chain of mud plus the pumped fluids, skipping the displacement, because the displacement is deliberately the lightest fluid in the job and flagging it would be noise on every run.

## Two, no cement in the annulus

    No cement reached the annulus; check volumes.

Raised when no annulus segment at the end carries a lead or tail fluid. A volume error large enough that the cement never turned the corner.

## Three, the top of cement missed

    Achieved TOC 1160 m differs from target 1200 m by more than 30 m.

Both depths named, so the direction and the size are both visible.

## Four, the floats have to hold a reverse U-tube

    Inside column is heavier than the annulus at the end of the job;
    floats must hold the reverse U-tube.

Raised when the float differential is negative.

## Five, the shoe above

    ECD at the previous shoe peaks at 1712 kg/m3, above the fracture EMW 1700 kg/m3.

Only raised if a fracture equivalent mud weight was supplied. No limit, no warning, and the peak is still reported.

## Six, free fall

    Free fall (U-tube) occurs during the job; the transient rate is not modeled,
    surface pressure reads zero over those steps.

Raised if any step in the series had a negative balance past the deadband.

## What they have in common

Every one names the quantity that triggered it and, where there are two numbers to compare, both of them.

None of them is a severity level, a score or a colour. They are sentences, and a reader who gets one knows what to go and look at.

## What no warning means

That none of six specific conditions occurred. It does not mean the job is good.

There is no warning for a bad excess, for a slurry that will not set, for a mud channel, for contamination or for a plug that does not bump. The Expert tier's checklist adds standoff and annular velocity, and everything else is outside this course.

## The four runs in this course

The slant well produces no warnings on either programme. The horizontal well produces none on the two-slurry programme and exactly one, the free-fall warning, on the neat one.

## Exercise

Of the six warnings, say which ones would be raised by a job whose slurry volume was accidentally entered as a tenth of the correct value.

Then say which of them a reader would notice first.
