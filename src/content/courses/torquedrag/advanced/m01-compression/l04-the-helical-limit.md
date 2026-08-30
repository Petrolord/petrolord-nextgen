# The helical limit

The second threshold, and what changes when it is passed.

{{panel:td-buckling-explorer}}

## The expression

    F_helical = 2 sqrt(2) ( sqrt(2) - 1 ) x 2 sqrt( EI w sin(theta) / r )

which is the sinusoidal limit multiplied by a constant.

## The values

Drill pipe in the 0.2159 m open hole:

| inclination | sinusoidal | helical |
|---|---|---|
| 5 degrees | 50550.61969889707 N | 92428.1242301925 N |
| 30 degrees | 121077.5102803284 N | 221381.40399328814 N |
| 45 degrees | 143986.2366921816 N | 263268.34075811005 N |
| 60 degrees | 159346.96483292847 N | 291354.3127465037 N |
| 75 degrees | 168286.92265158307 N | 307700.37411621853 N |

## What changes physically

Below the sinusoidal limit the pipe is straight, touching the low side along its length. The contact force per metre is the buoyed weight component.

Between the two limits the pipe snakes along the low side. It still touches only the low side, the contact force is somewhat higher, and load still passes along the string.

Above the helical limit the pipe wraps around the hole. Now it touches all the way round, the contact force includes a large outward component from the helix trying to unwind, and that outward force grows with the compression.

## Why the third regime is different in kind

Because the contact force now depends on the compression, and the friction depends on the contact force, and the compression depends on the friction.

That is a positive feedback with a gain that can exceed one. Past some point, adding push at surface produces more wrap and more friction rather than more load at the bit, and nothing more gets through.

That is lock-up, and it is not a gradual degradation. It is a limit.

## What the model does about it

Nothing. It flags the state and continues with the same friction factor.

So above the helical limit the model's hookloads are optimistic, its torques are optimistic, and the depth at which it says load stops arriving is deeper than the real one.

The right reading of a helical flag is that the answer below it is not usable, rather than that it is somewhat off.

## The margin between the two

The gap between the limits is 84 percent of the sinusoidal value, which is a wide band. A string in the sinusoidal regime has a great deal of room before it is in trouble.

That band is where a lot of real drilling happens, and it is why sinusoidal buckling is common and lock-up is not.

## Exercise

For the horizontal well sliding, the minimum tension is -422023.82665557245 N.

Compare it against both limits at 90 degrees and say which regime the string is in. Then say what that implies about whether the reported hookload of -156755.75915568782 N is an over- or under-estimate of the real one.
