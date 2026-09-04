# What a string cannot tell you

Every number the string module returns is closed form, and not one of them knows how fast the unit is running.

{{panel:pd-string-explorer}}

## Five numbers with no time in them

On the published taper: weight in air 9940.000000 lb, buoyed weight 8673.757961783 lb, elastic constant 3.744037060e-3 in/lb, spring rate 267.091373300 lb/in, fundamental 53.362124006 spm.

Change the pumping speed, the damping ratio, the fillage or the plunger diameter, and every one of those five is unchanged. They describe steel hanging in a fluid, and the design has not started yet.

## What that buys

Exactness. Against an independent oracle the engine returns weight in air, buoyed weight, elastic constant and spring rate with a difference of 0.000e+0 on both published strings. There is no tolerance to argue about, because a compliance sum and a buoyancy factor each have exactly one answer.

## The one static answer that reads as dynamic

Static stretch. A fluid load of 5000 lb on the published taper gives 18.720185 in, and subtracting that from a surface stroke is the oldest rule in rod pumping. It is a spring answer to a wave question. It assumes the whole string stretches at once and that nothing is still travelling when the polished rod turns round, and the real plunger travel is a card result whichever way the arithmetic comes out.

## What the module does not model at all

Rod buckling and the compression a sinker bar would be sized for. Tubing movement, and an unanchored tubing string. Fluid friction on the plunger. Gas interference. Deviated hole side loading and rod on tubing wear. The fatigue history that turns a Goodman percentage into a service life. No number a string returns speaks to any of them.

It will also let a bad string through with a note rather than an error: 3/4 above 7/8 over the same 5000 ft returns ok true, a `taperStepsUp` warning and a spring rate of 251.236634246 lb/in.

## The one place a string number becomes a gate

The fundamental. Ask the teaching well ODUMA-4 to run at 60 spm against its own 59.134268422 spm and the design comes back ok false with one error, and the message names the number: at that speed "nothing predicted there would be trustworthy". The highest speed that string will accept is anything strictly below 59.134268422 spm.

That is the whole authority a string has over a design. Everything else it says is an input to a march.

## Exercise

Write the five closed form numbers for the published taper and mark each one that would change if the pumping speed doubled.

Then say what the reversed taper returns and why it is a warning rather than a refusal.
