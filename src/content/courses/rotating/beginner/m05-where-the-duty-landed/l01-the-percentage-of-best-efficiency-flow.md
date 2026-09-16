# The percentage of best efficiency flow

A duty point can be perfectly correct and still be a bad place to run a machine. The last question this tier asks is where the solved duty landed relative to the flow the pump was designed for.

{{panel:fc-pump-explorer}}

## The one input the module does not compute

The best efficiency flow is stated to the engine. It is not derived from the catalogue points and it is not a property the fit can recover, because the four catalogue readings are heads and the best efficiency flow is a statement about efficiency. It comes off the vendor curve, and somebody has to type it in.

Ask for the operating region with no best efficiency flow and the engine returns { error: "a BEP flow is needed to judge the operating region" }. Ask at a negative flow and it returns the same message. There is no default here, which is the right choice: a guessed best efficiency flow would produce a confident verdict about a pump nobody described.

## OKONO, judged

The OKONO duty of 1234.452969 gpm against a stated best efficiency flow of 1150.000000 gpm comes back as 107.343736 percent of best efficiency flow, a region of "preferred", a preferred flag of true, and a note of null.

Four fields, and they are four different kinds of thing. The percentage is a measurement. The region is a label. The preferred flag is the machine-readable form of that label. The note is prose, and here there is none to give, because a duty in the preferred band has nothing to warn about.

## What the percentage is, and what it is not

It is the solved duty flow expressed against the stated best efficiency flow. Nothing more.

In particular it is not an efficiency, and 107.343736 percent is not a claim that the pump is running at anything like that. The number says the duty sits a little above the flow the impeller was designed around. What the efficiency actually is at that flow is on the vendor curve, and this module does not carry it.

## Why the theory lives elsewhere

The best efficiency point itself, why a centrifugal impeller has one, and how the useful range either side of it is established, are taught in depth by the Electrical Submersible Pumps course. This course takes the best efficiency flow as an input and uses it the way the engine uses it.

## The mistake

Reading 107.343736 percent as good news about efficiency. It is a position on the flow axis. The good news, such as it is, is in the region label and the preferred flag, and the next lesson is about what those labels are.

## Exercise

Give the OKONO percentage of best efficiency flow, the region, the preferred flag and the note. Then say where the best efficiency flow comes from, and give the message the engine returns when it is not supplied.
