# What moves the point

The duty point belongs to the pump and the station together, so anything that changes the station changes it. This lesson moves the station two different ways and watches the answer follow.

{{panel:fc-pump-explorer}}

## Moving the static head

Hold the OKONO machine and its friction statement and change only the static head:

| static head ft | duty flow gpm | duty head ft |
| --- | --- | --- |
| 60.000000 | 1488.478813 | 362.123069 |
| 120.000000 | 1392.444304 | 384.395610 |
| 180.000000 | 1289.271238 | 406.666408 |
| 210.000000 | 1234.452969 | 417.801018 |
| 260.000000 | 1137.227616 | 436.357271 |
| 320.000000 | 1008.245819 | 458.621768 |
| 400.000000 | 804.694816 | 488.300056 |

The row at 400.000000 ft is worth pausing on. That station has not changed its piping at all. The vessel it fills simply sits higher, and the same machine now delivers 804.694816 gpm.

The row at 210.000000 ft is the OKONO station of the first lesson, and it carries the duty this module solved.

## Moving the friction instead

Now a different station for the same machine: a static head of 60.000000 ft and a friction head of 380.000000 ft at 1100.000000 gpm. The OKONO station states 165.000000 ft of friction at that same flow, so this one is a far more restrictive piece of piping. Its implied coefficient is k = 0.000314049587 ft per gpm squared.

Against it the duty comes out at 1103.518695 gpm and 442.434987 ft. Of that head, 60.000000 ft is static and 382.434987 ft is friction.

That split is worth reading, because it is the station describing itself. The static part is a lift and it is there at any flow, including no flow. The friction part is spent pushing fluid through pipe and it grows with the square of the flow, so it is the part that gives a system curve its steepness. A station stated this way tells you, at its own duty, how much of the head the machine is producing is going into height and how much is going into pipe.

This particular station is used again further into the course, when two identical machines are put in parallel into it and the duty is solved afresh. Keep the shape of it in mind.

## Reading the two tables together

Both exercises make the same point in different directions. The pump did not change in either of them. Every duty flow and every duty head on this page came out of the same four catalogue readings. What moved was the thing the pump was connected to.

## The mistake

Quoting a duty flow as a property of the machine. The OKONO pump delivers 1234.452969 gpm into one station, 804.694816 gpm into another and 1103.518695 gpm into a third, and it is the same pump in all three. Everything downstream, the power, the pressure, the region the duty lands in, moves with it.

## Exercise

From the static-head table, give the duty flow at 120.000000 ft and at 320.000000 ft. Then, for the friction-dominated station, give its static head, its duty head and how much of that duty head is friction.
