# A refusal, and the input it names

This module has three ways of not answering, and telling them apart is most of what an Expert reader is for. The first and hardest edged of them is a REFUSAL.

{{panel:pw-train-explorer}}

## The contract

A refusal means the input is one this method cannot use. The return is an object carrying a named `error` string and nothing that could pass for an answer. No cut size, no removal, no median. Nothing a caller might accidentally plot.

The module throws nothing at all, which matters more than it sounds. A thrown exception is a control flow event a caller can swallow. A returned object with an error key is data, and data survives being logged and displayed.

## Every refusal names its input

The point of a refusal is not that it stops. It is that it tells you which number stopped it, and what the boundary was.

- a water temperature of 200.5 C: the viscosity fit holds from -10 to 200 C, and the message says so and repeats the value it was given.
- 300001 ppm TDS: the salinity correction in this module is stated to 300000 ppm, and the refusal adds the reason, which is that past saturation a linear correction has nothing behind it.
- 100.1 API: this module holds API gravity to 5 to 100 degrees.
- a brine density asked for at 100.5 C: the fresh water density fit is stated from 0 to 100 C.
- -1 ppm TDS: total dissolved solids cannot be negative.

Read those as a set. Each names the quantity, the band, and the value that fell outside it, so a reader knows which box on the form to change.

## The same bad input through every door

The strongest demonstration here is one fluid put through five doors at once. Give it an oil heavier than its water and the gravity separator, the plate pack, the hydrocyclone and the flotation cell all refuse, each in its own words, alongside the property function that refuses first.

A module where one export refuses a condition and another accepts it is a module holding two opinions about the same physics, and a caller cannot tell which one it got.

## A refusal is not a failure

The last thing to hold on to is the one readers get wrong. A refusal is not the engine saying the design is bad. It is the engine saying the question is outside what this method can answer.

A liner bank past twice its design flow is refused because the pressure drop and the inlet shear decide the answer there, and this model does not carry them. The bank might be fine. The MODEL is not.

## Exercise

In the panel, drive one input at a time past its band and collect the refusal strings. For each one, write down the quantity, the limit and the reason given.

Then find a refusal that names a value you could compute yourself, and say why the module bothers to name it.
