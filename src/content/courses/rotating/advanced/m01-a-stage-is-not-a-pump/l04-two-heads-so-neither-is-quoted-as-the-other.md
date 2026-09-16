# Two heads, so neither is quoted as the other

A stage has two heads and two efficiencies, and they pair up. Quoting one head against the other efficiency is an error that produces a plausible number, which is the worst kind.

{{panel:fc-compressor-explorer}}

## What the SOKU stage returns

The polytropic head is 63604.9582 ft lbf per lbm and the isentropic head is 60870.3418 ft lbf per lbm, a quotient of 0.957006239. The polytropic efficiency is 0.755000000 and the isentropic efficiency is 0.722539710, which is lower by 0.032460290.

Both heads and both efficiencies come back on the same return, and the studio's Staging and Power tab prints them side by side for exactly this reason. A field that carries only one of each invites the mismatch.

## Why they pair up the way they do

The polytropic head is the work along the real path and it is divided by the polytropic efficiency. The isentropic head is the work along the reversible path and it is divided by the isentropic efficiency. Each pair is a complete statement of the same machine, and the two statements give the same power.

On this stage the isentropic head is the smaller of the two and the isentropic efficiency is the smaller of the two efficiencies. Cross the pairs and the power comes out wrong by a margin that still looks like a compressor.

## The power, and what the mass flow it rides on is

The stage moves 53577.2205 lb per hr. Taking the polytropic route gives 2279.6019 gas horsepower and taking the isentropic route gives 2279.6019, a difference of -9.094947017729282e-13 hp. At a mechanical efficiency of 0.968000 the brake horsepower is 2354.9606.

Gas horsepower is what the gas receives. Brake horsepower is what the coupling has to deliver, and the gap between them is the gearbox, the bearings and the seals of the machine itself. The driver is sized on the brake figure and never on the gas figure.

## The efficiency is where the machine enters

Walk the polytropic efficiency across the SOKU stage and both the head and the power fall: 65574.3395 ft lbf per lbm and 2729.8297 hp at 0.650000, 64554.9267 and 2495.4355 at 0.700000, 63684.9911 and 2297.6867 at 0.750000, 63221.6383 and 2193.2399 at 0.780000, 62661.2723 and 2067.7610 at 0.820000, and 62157.4133 and 1955.7326 at 0.860000.

Read that as two effects on one table. A worse machine has a steeper path and more head to deliver, and it delivers that head less efficiently. The power carries both, and the head carries only the first.

## The mistake

The mistake is reporting a head with no adjective. A bare figure of 63604.9582 ft lbf per lbm is not a statement anybody downstream can use, because the next person divides it by whichever efficiency is on their sheet. Write the word polytropic or the word isentropic every single time, and write the efficiency beside it.

## Exercise

Give both heads and both efficiencies for the SOKU stage and say which member of each pair is the smaller. Explain which efficiency divides which head, give the gas and brake horsepower and the mechanical efficiency between them, and say which of the two the driver is sized on.
