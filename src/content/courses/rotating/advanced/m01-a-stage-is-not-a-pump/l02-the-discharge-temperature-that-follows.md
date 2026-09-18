# The discharge temperature that follows

Once the exponent is fixed, the discharge temperature is not a separate calculation. It is the same path evaluated at the pressure ratio, and it is the number that decides whether the stage can be built at all.

{{panel:fc-compressor-explorer}}

## One ratio, one temperature

The SOKU stage at a ratio of 3.200000 leaves 92.000000 psia at 294.4000 psia and 333.5954 degF. Run the identical stage through the isentropic exponent and the answer is 269.8918 degF, which is 63.7036 degF below the real one.

That gap is the whole argument for using the polytropic exponent. A design that sized its coolers and chose its valve material off the reversible number would be short by more than sixty degrees on a stage that is otherwise perfectly ordinary.

## The temperature climbs with what the stage is asked to take

| ratio | discharge psia | discharge degF | polytropic head ft lbf per lbm | gas hp | warning |
| --- | --- | --- | --- | --- | --- |
| 1.500000 | 138.0000 | 175.3008 | 19739.9969 | 707.4815 | null |
| 2.000000 | 184.0000 | 231.2948 | 35245.9460 | 1263.2148 | null |
| 2.500000 | 230.0000 | 278.1057 | 48215.9853 | 1728.0611 | null |
| 3.000000 | 276.0000 | 318.6976 | 59471.4430 | 2131.4567 | set |
| 3.500000 | 322.0000 | 354.7551 | 69478.7492 | 2490.1186 | set |
| 4.000000 | 368.0000 | 387.3369 | 78530.8297 | 2814.5452 | set |
| 4.500000 | 414.0000 | 417.1563 | 86824.8963 | 3111.8045 | set |

Across those seven rows the discharge pressure, the temperature, the head and the power all rise together, and a warning appears from the fourth row on. The efficiency moves it too: held at the SOKU ratio and walked across polytropic efficiency, the discharge runs 378.6113 degF at 0.650000, 355.1806 at 0.700000, 335.4044 at 0.750000, 324.9553 at 0.780000, 312.3981 at 0.820000 and 301.1829 at 0.860000. A worse machine puts more of the work into heat.

## The warning fires on the limit the caller stated

Ask the same stage against four different stated limits and the discharge is 333.5954 degF on every one of them. At 200.0000, 250.0000 and 300.0000 degF the return carries a warning and at 400.0000 degF it carries none. The limit is a limit and it is not an input to the thermodynamics, which is why the temperature does not move.

The message names the figure the caller typed: "discharge at 333.6 F is above the stated limit of 300.0 F: at this temperature the valves and the lube oil set the limit, ahead of the thermodynamics". That is the engine's own sentence, and it points at the right thing. What fails first at temperature is the valve material and the lube oil, and the gas is perfectly happy.

## The default is measured, and it is held

With no limit stated the warning turns on between a ratio of 2.7616873004480746 and 2.761687300448075, and the discharge temperatures either side of that crossing are 299.99999999999994 and 300.00000000000006 degF. That brackets a default of 300 degF.

That default is HELD FOR LITERATURE. It is customary, no publication in this repository stands behind it, and nothing graded in this course rests on it. State a limit rather than inheriting one.

## Exercise

Give the SOKU discharge temperature and the temperature the isentropic exponent would have predicted, and say how far apart they are. Then explain why the discharge is the same on all four rows of the stated-limit probe, quote what the warning says fails first, and say why the default limit is held rather than taught as an answer.
