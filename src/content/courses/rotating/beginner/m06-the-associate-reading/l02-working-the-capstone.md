# Working the capstone

The capstone is a crude transfer pump against a stated station. Everything you need is given: the catalogue points, the static head, the friction head at its stated flow, the specific gravity, the pump efficiency and the motor efficiency. Read that last one off the prompt rather than letting the engine apply its own default, because the kilowatt answer is graded and the two figures are not the same. Six answers are graded.

{{panel:fc-pump-explorer}}

## The six

The duty flow. The duty head. The hydraulic power. The brake power. The motor input in kilowatts. And the duty head expressed as a discharge pressure.

Notice the shape of that list. The first two are one answer, solved once. The last four are all asked at that answer. Get the duty wrong and all six are wrong, and the four downstream ones will be wrong in a way that looks entirely plausible, because each of them is a correct calculation on an incorrect flow.

## The order to work it in

Fit the curve first and look at what the fit says about itself before using it. A droops flag of false means the crossing you are about to solve for is not a duty point, and there is no sense computing anything past that. An R squared that comes back null means the points carry no variance to explain, which is a statement about the points rather than about the fit.

Then build the system curve from the static head and the friction head at its stated flow. Then solve the crossing, and read the convergence flag before reading the flow. A flow off an unconverged bisection is a number rather than an answer, and the tier has already shown a case where the flow prints normally and is wrong by more than three hundred gallons per minute.

Only then ask for the power, and only then convert the head to a pressure.

## Where the two efficiencies go

The pump efficiency turns hydraulic power into brake power. The motor efficiency turns brake power into motor input. Keep them in that order, keep the shaft figure separate from the supply figure, and pass the motor efficiency the prompt states.

The kilowatt figure is the motor input, converted. Converting the brake power instead leaves out the whole of the motor's own loss.

## Two habits worth carrying in

Check every flag before you use the number beside it. That is the single habit this tier has been teaching, and the capstone is built so that it pays.

And ask, at each step, what the number you have just produced is a property of. The duty flow is a property of the pump and the station together. The discharge pressure is a property of the pump, the station and the fluid together. Neither is a property of the machine alone.

## The mistake

Working the six answers in the order they are listed. The list is an order of presentation. The order of computation is fit, then system, then duty, then everything else, and the four downstream answers cannot be checked independently of the duty they were asked at.

## Exercise

Before you open the capstone, write down the order you will work it in and the flag you will check at each stage. Then, for each of the six graded answers, say which of the earlier answers it depends on.
