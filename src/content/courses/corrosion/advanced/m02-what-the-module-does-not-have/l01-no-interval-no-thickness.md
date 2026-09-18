# No interval and no thickness

The app is called a Corrosion and Integrity studio, and a reader who arrives at it with an integrity question will look for four things. When to inspect next. What thickness to retire at. Whether the line is fit for service. And what the minimum wall actually is. The module has none of the four, they sit in `NOT_PROVIDED` by name, and the studio lists them rather than leaving the reader to work out that the row is missing.

## What it has, and what it lacks

For the inspection question the engine has a remaining life against a stated allowance. It has no interval, no risk basis and no inspection standard of any kind. A remaining life and an inspection interval are different quantities: one divides what is left by a rate, the other is a decision about when to look, and the second needs a method the first cannot supply.

For the retirement question the engine has a corrosion allowance that the caller types in. It has no minimum thickness, no pressure-containing calculation and no retirement criterion. The allowance is a number somebody chose. Nothing in this module checks it against a wall.

For the fitness-for-service question the engine has nothing at all. Producing an assessment means adopting an assessment method, and no such method is in this repository.

## Where the boundary shows

The remaining-life door makes the boundary concrete in one message. Ask it for a life on a line whose allowance is already fully consumed and it declines rather than returning a negative life or a zero one:

> the corrosion allowance is already consumed: this is an inspection and fitness-for-service question, not a design one

Read that as a statement about scope. Most refusals in the module say an input is wrong or missing. This one says the input is fine and the module is the wrong tool.

## Integrity, narrowly

Because the word invites all four expectations, this course uses it narrowly and says so every time. Integrity here means one arithmetic: a corrosion allowance divided by a rate. A remaining life of 36.112878 yr on one stream and 0.161915 yr on another is that division and nothing more, and neither number is an inspection plan.

The engine does hold the line in one useful direction. A zero rate does not come back as an unbounded life with a passing verdict. It returns no life, no verdict, `unbounded` true, and a note telling the reader to find out why the rate is zero first. Four separate paths reach a zero rate: an oil-wet wetting regime, a stream with no CO2 in it, a corrosion inhibitor at 100 percent efficiency and 100 percent availability, and a typed zero CO2 mole fraction. A screen that answered those four with an unbounded life would be handing over its strongest reassurance on its weakest input.

## Exercise

Take the shipped case and record its remaining life and its stated design life. Then write down, in one sentence each, what you would still need in order to set an inspection interval and to name a retirement thickness, and say which of the two the remaining life gets you closer to.
