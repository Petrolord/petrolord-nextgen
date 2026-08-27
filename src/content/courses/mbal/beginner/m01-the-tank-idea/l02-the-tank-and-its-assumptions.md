# The tank and its assumptions

Material balance treats a reservoir as a tank. Not a tank in the sense of a shape, but a tank in the sense of an account: one pressure, one temperature, one set of fluid properties, one running total of what has gone out. The model has no length, no width and no depth. Engineers call it zero-dimensional, and that phrase is the honest description of what has been thrown away.

Nothing in the tank model knows where the wells are. Nothing knows the permeability. Nothing knows that the crest of the structure is 200 ft above the flank. Every barrel produced is produced from the same undifferentiated pot, and every psi of drawdown is felt everywhere at once.

## The four assumptions, stated plainly

**One pressure represents the whole tank.** At each survey the reservoir is assumed to be at a single average pressure. Real reservoirs have pressure gradients while they flow, so the survey pressure has to be a stabilised shut-in pressure, taken after the wells have been closed long enough for the near well drawdown to dissipate.

**The fluid properties follow from that pressure.** One pressure and one temperature give one $B_o$, one $R_s$, one $B_w$. This is why the survey row carries its PVT with it, and why the tank has no room for two different oils.

**The container is fixed apart from compaction.** Pore volume changes only because the rock compacts as pressure falls. There is no leak to a neighbouring block, no injection unless you book it, and no influx unless you model it. The Associate tier works a tank with no aquifer at all, so the container really is closed.

**The accounting runs cumulatively from a defined start.** Every term is measured from initial conditions: $N_p$ is oil produced since first oil, and the pressure drop $\Delta p = p_i - p$ is measured from initial pressure. Mixing a period volume into a cumulative slot is the most common data error in this whole subject.

## When the tank holds and when it does not

The assumptions are about communication, not about shape. A tank model works well for a permeable, well connected sand where a shut-in of a few days genuinely equalises the pressure. The reservoir can be any shape at all as long as it behaves like one pot.

It works badly where communication is poor. A layered reservoir with a tight shale between two sands has two pressures, not one, and averaging them describes neither. A compartmentalised field separated by sealing faults is several tanks, and treating it as one will read as a single tank that keeps behaving strangely. A low permeability reservoir may never stabilise within a realistic shut-in, so the recorded pressure is still falling toward an average it never reached.

The practical rule: before you run material balance, ask whether a shut-in pressure taken in one well would be reproduced by a shut-in pressure taken in another. If the answer is yes, you have a tank.

## Work the sensitivity, and see when it bites

Assumptions matter in proportion to how much they move the answer, so put a number on it. On Ekene the total expansion is exactly linear in the pressure drop, at 0.0000237230769230768 rb/stb per psi. At the last survey the drawdown is 1103.99173733300 psi, so one psi of gauge error is only 0.0905803880757092 percent of the signal.

Suppose the last survey's gauge reads 20 psi too high, so we record 2116.00826266700 psia instead of the true value. The recorded drawdown becomes 1083.99173733300 psi and the total expansion becomes

$$E_t = 0.0000237230769230768 \times 1083.99173733300 = 0.0257156193687305 \text{ rb/stb}$$

Dividing the unchanged withdrawal of 317926.842484584 rb by that smaller expansion gives an in place volume of 12363180.4439902 stb, which is 1.84503251373536 percent above the true 12139208.1074968 stb. Annoying, survivable.

Now make the same 20 psi error at the FIRST survey, 2020-07-01, where the true drawdown is only 162.261240122535 psi. Twenty psi is 12.3258025052049 percent of that signal. The expansion falls to 0.00337487434259920 rb/stb, and dividing that survey's withdrawal of 46727.8893358510 rb by it gives 13845816.0489208 stb, an error of 14.0586430870230 percent.

Stop and do this one yourself before reading on. Subtract 20 from a drawdown of 162.261240122535, multiply by 0.0000237230769230768, divide 46727.8893358510 by the result. The same gauge, the same error, nearly eight times the damage.

That is the most useful thing to know about early surveys: they carry almost no signal, because almost nothing has expanded yet. Practising engineers do not discard them, but they do not let them drive the answer either.

## The misconception worth naming

Beginners often assume the tank model requires the reservoir to be a simple, box-like body, and they reject it whenever a field looks geologically complicated. That is the wrong test. Shape is irrelevant to a zero-dimensional model. What the model requires is pressure communication and honest cumulative accounting. A beautifully simple sand cut by a sealing fault fails the test. A gnarled, faulted, but fully connected turbidite passes it.

The second misconception runs the other way: that a bad assumption always inflates the answer. It does not. Direction follows the arithmetic. A pressure read too high shrinks the expansion and inflates the in place volume, as above. A flowing pressure recorded as a shut-in pressure reads too LOW, which enlarges the drawdown, enlarges the expansion, and shrinks the in place volume: at the last survey a 20 psi low reading gives 11923206.3753791 stb, an error of -1.77937251099880 percent. Work out the direction each time. Do not memorise it.

## Exercise

An operator gives you six shut-in surveys from a two layer reservoir. The upper sand is 500 md and the lower sand is 3 md, and they are separated by a continuous shale. All six pressures were measured in wells completed only in the upper sand.

Write down which of the four assumptions is violated, and say what the material balance will be a measurement OF. Then say what you would expect to happen to the in place volume the tank returns compared with the volume of both sands together, and why. Module 3 lesson 4 gives you the diagnostic that would reveal this from the data alone.
