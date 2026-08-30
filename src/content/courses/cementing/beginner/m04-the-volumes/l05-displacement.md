# Displacement

The biggest volume on the sheet, and the one with no cement in it.

{{panel:cm-volume-explorer}}

## The volume

    displacement = inside capacity x float collar depth

On the slant well:

    0.01937743444976952 x 2960 = 57.357205971317775 cubic metres

On the horizontal well:

    0.01937743444976952 x 2760 = 53.48171908136387 cubic metres

## It is the bulk of the job

| well | slurry | displacement | total pumped |
|---|---|---|---|
| slant | 25.123380942966243 | 57.357205971317775 | 86.48058691428402 |
| horizontal | 25.123380942966243 | 53.48171908136387 | 82.60510002433011 |

More than twice as much displacement fluid as cement, on both.

## The two wells finally differ

Every volume so far has been identical between the two wells. The displacement is the first one that is not, and the reason is simply that their float collars are at different measured depths.

    57.357205971317775 - 53.48171908136387 = 3.875486889953905

which is 200 m times the inside capacity exactly, and 200 m is the difference between the two float collar depths.

## What the displacement fluid is

Usually the same mud that was in the hole. On this course's jobs it is mud at 1440 kg/m3, the same as the fluid the job started in.

It could be water, or a weighted brine, and the choice matters: the displacement fluid is what sits inside the casing at the end of the job, so its density is one half of the float differential that decides whether the floats have to hold anything.

## Why it is measured to the float collar

Because the top plug lands there. Pump one cubic metre more and the plug is on the collar with the pumps still running, which is the pressure spike that tells the crew the job is over. Pump substantially more and you have either burst something or the plug never bumped.

Under-displacing leaves cement inside the casing above the collar, which sets there.

Over-displacing pushes shoe track cement out into the annulus, which is the thing the shoe track exists to prevent.

## Getting it right in the field

The displacement volume is metered, and it is the one number on the whole job that the crew watches continuously. The plug bump confirms it.

A job where the plug does not bump at the calculated volume is a job where something in the geometry was wrong, and it is one of the few real-time checks on the whole volume sheet.

## Exercise

Compute what the slant well's displacement would be if the float collar were moved to 2900 m.

Then say how much cement would end up inside the casing above the collar if the crew pumped the original displacement volume anyway.
