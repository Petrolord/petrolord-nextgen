# What a march owes the reader

A closed form can be read. You can see every input in it and check the answer by hand. A march cannot be read, so it owes the reader something in its place: enough about how it ran to let you decide whether to trust what it returned. This lesson collects what this one gives you and turns it into a checklist.

{{panel:fc-blowdown-explorer}}

## Six fields that answer, four that account, one that warns

Of the eleven fields a blowdown call returns, six are the answer: the time, the trajectory, the final temperature, the final pressure it actually reached, the mass remaining and the mass it started with.

Four are the account. The step size it used, the number of steps it took, the number of those it had to subdivide, and the pressure below which its choked assumption stops holding.

The eleventh is the warning field, which on a clean call reads `null`.

That account is unusual and it is the reason this route can be taught honestly. A march that returned a time alone would be asking you to accept its step size, its stopping rule and its flow assumption on trust, and you would have no way to tell a converged answer from a coarse one.

## The checklist

Four questions, in this order, on any march result before you quote it.

Did it get where it was going. Compare the final pressure returned against the pressure asked for.

Was the step fine enough. On this route the refinement study says it is, by a margin, but the step is returned so you can confirm that the run you are holding used the step the study was done at.

Did anything have to be subdivided. A non-zero subdivided count is not a fault, it is the budget working, but it tells you the geometry is in the corner where a fixed step struggles and it is worth knowing.

Is the warning field empty. If it is not, read it before the answer.

## What the route refuses about its own step

The step size has a shape, and two wrong shapes come back as refusals rather than as answers. A time step of zero and a negative time step both return an object carrying `error` with the message `the time step must be a finite number above zero`.

There is a reason that is a refusal rather than a warning. A march whose clock never advances can never reach its own time limit, so a zero step would spin against a budget it could not exhaust. Refusing the input is the only honest handling.

The third refusal in this family is the time limit itself, at 7199.999985603571 s, which names the orifice as the likely cause.

## Exercise

Split the eleven returned fields into the six that answer, the four that account and the one that warns, and say what each of the four accounting fields lets you check. Write out the four-question checklist in order. Then quote the refusal on a bad time step, say why a zero step must be refused rather than warned about, and record the time limit in seconds.
