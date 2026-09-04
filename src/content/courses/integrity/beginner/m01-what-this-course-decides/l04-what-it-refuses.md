# What it refuses

The refusals are not gaps waiting to be filled. They are the boundary that makes the answers trustworthy.

## Five questions it will not answer

**How fast is it leaking?** There is no leak rate anywhere in this engine. An element is verified, degraded, failed or not verified, and none of those carries a flow number.

**How long have I got?** There is no time axis. A degraded element is degraded today and the engine has nothing to say about tomorrow.

**How corroded is it?** There is no corrosion model, no wall loss, no remaining life. If corrosion has downgraded an element, a person decided that and recorded the status.

**How likely is failure?** There are no probabilities. The categorisation is a lookup table over statuses, not a risk calculation, and the traffic light is not a probability of loss of containment.

**What will it cost?** Nothing here is priced. The abandonment programme returns a material takeoff in cubic metres of slurry and a count of plugs, and stops there.

## It is a status and rule engine

What is left when you take those five away is precise and useful. The engine holds the barrier rules, applies them without sympathy, and tells you which rule you have broken and which element broke it.

That is why the inputs are checked so hard. A factor outside the range from zero to one is refused. A negative depth is refused. A stinger whose inside diameter is not smaller than its outside diameter is refused. An element without an envelope assignment is refused by name. An unrecognised element status is refused rather than guessed at.

The most important refusal of all was added after the engine was found trusting its caller in one place and not the other, and the well category function now rejects a status it does not recognise instead of quietly returning green. Later modules take that story apart properly.

## A planning checklist, not a procedure

The abandonment builder says so in its own header: it is a planning checklist in the well programme tradition, not an operational procedure.

Read that literally. It will tell you that a zone needs a second barrier. It will not tell you how to run the job, what to do when the plug will not tag, or when to stop pumping.

The barrier half carries the same caveat in a different form. It verifies the status rollup and the envelope rules. Whether your elements actually form a sealed surface around the source is your drawing, and the engine states plainly that it does not check it.

## Exercise

Take the five refused questions and, for each, name the discipline or the document that does answer it on a real asset.

Then find one number you wanted from this engine in the last lesson and did not get. Write down what you would have to supply to get it, and whether you could honestly supply it.
