# The same side force, spent over hours

Where casing wear comes from, and why it belongs in this course.

{{panel:td-buckling-explorer}}

## The connection

The tool joints press against the casing with a side force. That force produced the torque in the Professional tier. Turn the string for long enough and the same force, sliding against the same steel, takes metal off it.

So casing wear is not a separate subject bolted on. It is the torque calculation integrated over time.

## The model

    wear volume = wear factor x side force x sliding distance

Three terms. The side force comes from the torque and drag run. The sliding distance comes from the rotating hours and the rpm. The wear factor is an empirical constant with units of volume per unit of force times distance.

That is the entire model, and it is the industry standard one.

## Why it is a volume rather than a depth

Because the amount of metal removed is what the physics gives. Turning that volume into a depth requires knowing the SHAPE of the groove, and the shape is a crescent whose area grows nonlinearly with its depth.

That geometric step is the one people get wrong, and it has its own lesson.

## The case this course runs

The horizontal well's rotate-on-bottom side forces, against 1200 m of casing above the shoe. Casing inner diameter 0.2204974 m, wall 0.0119888 m, tool joint radius 0.0841375 m, 50 hours at 120 rpm, wear factor 2 mm3 per kN.m, evaluated in 30 m intervals.

## Why the horizontal well

Because it has the highest side force in the cased section of any of the five, and because rotating on bottom is the operation that actually accumulates the hours.

Wear happens while drilling ahead, which is rotate-on-bottom, and while back reaming. It does not happen while tripping, because nothing is turning.

## What the answer looks like

The wear is not uniform. It grows monotonically downward and is worst at the shoe joint, because the side force in the cased section grows toward the shoe as the build below it starts to bite.

The last 30 m interval, from 1170 to 1200 m, carries a side force of 16.774178931578604 kN and loses more than a quarter of its wall.

## The thing that makes it serious

Nobody can see it.

The casing is cemented in place and the wear is on its inside. It is detectable with a caliper or ultrasonic log, which costs a run, and it is otherwise invisible until the casing fails a pressure test or bursts.

So the calculation is the primary means of knowing, which puts a lot of weight on a model with one empirical constant in it.

## Exercise

Confirm that the wear model has no time dependence other than through the sliding distance.

Then say what that implies about whether 100 hours at 60 rpm and 50 hours at 120 rpm produce the same wear, and check your answer against the panel.
