# Sensor, logic solver, final element

{{panel:lp-sif-builder}}

A safety instrumented function is not one device. It is a chain: something measures the process, something decides, and something acts. Each link can fail dangerously on its own, and the function fails on demand if any link does. The engine therefore verifies a function as a list of subsystems, each with its own architecture, its own rates and its own proof test interval, and it computes the function from them.

## The three links

The sensor subsystem measures the process variable and reports it. The logic solver takes the reported values, applies the voting and the trip settings, and commands the action. The final element carries the action out, which in most process functions means closing or opening a valve. Each link is specified separately because each is bought separately, tested separately and often maintained by a different discipline.

## The IDU teaching function

The IDU function is three subsystems, all inputs stated.

| subsystem | architecture | lambdaDU per hour | lambdaDD per hour | T1 hours | MTTR hours | MRT hours | beta factor | betaD |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| transmitters | 2oo3 | 1.2e-6 | 2.8e-6 | 8760 | 8 | 8 | 0.05 | 0.02 |
| logic solver | 1oo1 | 3e-8 | 6e-7 | 8760 | 8 | 8 | none | none |
| valves | 1oo2 | 2.6e-6 | 0 | 8760 | none | 24 | 0.1 | none |

Read the differences down the columns, because each one is a real engineering statement. The transmitters vote two out of three, which protects the plant from a single transmitter tripping it. The logic solver is a single channel with strong diagnostics: its undetected rate of 3e-8 per hour is twenty times smaller than its detected rate of 6e-7. The valves are a redundant pair with no diagnostics at all, a higher beta factor of 0.1 and a longer repair time after a test of 24 hours.

## Why the subsystems look so different

The rates tell the story of the hardware. Electronics are watched continuously by diagnostics, so most of their dangerous failures are detected and their undetected rate is tiny. A shutdown valve sits in the process and is revealed only when it is stroked, so its whole dangerous rate of 2.6e-6 per hour is undetected and it carries no MTTR at all, because there is nothing detected to restore. The valves also carry the highest beta factor, since two valves in one line share the same fluid, the same solids and often the same actuator design.

## Each subsystem is its own calculation

Nothing about one subsystem enters another. The engine computes each from its own inputs and its own architecture, with its own equivalent down times, and only then combines them. That separation is what lets a design team move one interval or one architecture at a time and see exactly what it bought.

## Exercise

For each of the three subsystems, say which failure population will dominate its PFDavg before any arithmetic is done, using only the rates and the flags in the table. Then rank the three by the PFDavg you expect and write your ranking down, because the next lesson prints the answer.
