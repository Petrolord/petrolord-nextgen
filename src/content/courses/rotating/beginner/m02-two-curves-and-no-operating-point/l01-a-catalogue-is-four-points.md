# A catalogue is four points

A pump catalogue does not hand you a curve. It hands you a few readings, and the curve is something the engine builds from them. The OKONO P-1201 produced-water injection pump runs through this whole tier, and this is its catalogue.

{{panel:fc-pump-explorer}}

| flow gpm | head ft |
| --- | --- |
| 0.000000 | 540.000000 |
| 600.000000 | 512.000000 |
| 1200.000000 | 424.000000 |
| 1900.000000 | 250.000000 |

Four rows. The first is the shutoff reading, the head the machine makes against a closed valve at no flow. The last is the far end of the published range. Everything between them has to be interpolated, and the next lesson is about how.

## What the four points already tell you

The head falls as the flow rises, from 540.000000 ft at no flow to 250.000000 ft at 1900.000000 gpm. That fall is the defining behaviour of a centrifugal pump and the engine has a name for it. A curve that does not fall is refused as a head curve, and the fifth lesson of this module is about that refusal.

Notice what the table does not contain. There is no flow marked as the operating flow, and no head marked as the operating head. The catalogue describes what the machine can do at any flow it is asked for. It says nothing about which flow it will actually run at.

## The other curve, stated the way an engineer measures it

The system curve is the other half. On the OKONO station it is stated as a static head of 210.000000 ft and a friction head of 165.000000 ft at a flow of 1100.000000 gpm.

That is a deliberate choice of input. A system curve is a static head plus a coefficient times flow squared, and the coefficient is not a thing anybody measures. A friction head at a stated flow is. The engine takes the measurable pair and works out the coefficient it implies, which here is k = 0.000136363636 ft per gpm squared, and reads the static head straight back at 210.000000 ft.

## Two objects, no answer

So there are now two objects. One says what the machine makes at any flow, and the other says what the station demands at any flow. Neither of them contains an operating point, because an operating point is a single flow and each object is a curve over all flows. Finding it is the next module.

## The mistake

Quoting a pump by the head at the flow you want. The catalogue says 424.000000 ft at 1200.000000 gpm, and it is tempting to read that as the pump's duty. It is a reading on a curve. Whether the machine ever sits there depends entirely on what it is connected to.

## Exercise

Write out the four OKONO catalogue points and say which one is the shutoff reading. Then state the three numbers the system curve is given as, name the coefficient they imply, and say why the engine asks for a friction head at a flow rather than for the coefficient itself.
