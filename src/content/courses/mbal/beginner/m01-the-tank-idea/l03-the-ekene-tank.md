# The Ekene tank

Every number in this course comes from one committed dataset: the Ekene dynamic material balance fixture, six pressure surveys taken between 2020-07-01 and 2023-01-01, plus the initial condition at 2020-01-01. This lesson introduces the tank properly, because from here on the arithmetic assumes you know what kind of reservoir you are working.

## The tank at initial conditions

| property | value |
|---|---|
| initial pressure $p_i$ | 3200 psia |
| bubble point $p_b$ | 2000 psia |
| reservoir temperature | 180 F |
| initial oil formation volume factor $B_{ti}$ | 1.20000000000000 rb/stb |
| initial solution gas ratio $R_{si}$ | 400.000000000000 scf/stb |
| initial water saturation $S_{wi}$ | 0.35 |
| formation compressibility $c_f$ | 0.000004 per psi |
| water compressibility $c_w$ | 0.000003 per psi |
| gas cap ratio $m$ | 0 |
| water formation volume factor $B_w$ | 1.02 rb/stb |
| aquifer | none |

Three of those entries decide almost everything that follows. There is no gas cap, so $m = 0$ and the gas cap expansion term will vanish from every equation in module 2. There is no aquifer, so no water arrives from outside and the tank really is closed. And the initial pressure sits 1200 psi above the bubble point.

## Undersaturated, and staying that way

An oil is undersaturated when its pressure is above the bubble point, meaning the oil is holding all the gas it can and none of it has come out of solution. Ekene starts 1200 psi above the bubble point and the lowest pressure it ever reaches, at the last survey, is 2096.00826266700 psia. That is still 96.0082626669955 psi above the bubble point of 2000 psia.

The tank never crosses the bubble point. Three consequences follow, and each one simplifies the work:

**The solution gas ratio never changes.** $R_s$ stays at 400.000000000000 scf/stb at every survey. No gas leaves the oil.

**There is no free gas in the reservoir.** Since $B_t = B_o + B_g(R_{si} - R_s)$ and $R_s = R_{si}$ throughout, the two-phase formation volume factor equals the oil formation volume factor: $B_t = B_o$. Every appearance of $B_t$ in this course can be read as $B_o$.

**The oil expands, but only a little.** With no gas coming out of solution, the only reason $B_o$ grows is the oil's own compressibility. It rises from 1.20000000000000 rb/stb at initial pressure to 1.21589748101760 rb/stb at the last survey. That is the entire oil expansion story, and it is 1.32479008479960 percent of the oil's volume.

## The survey table

This is the table you will return to for the rest of the tier. $F$ is the underground withdrawal, $E_o$ the oil expansion, $E_{fw}$ the rock and connate water expansion, and $E_t$ their total. All four are defined properly in module 2.

| n | date | p psia | Np stb | F rb | Eo rb/stb | Efw rb/stb | Et rb/stb | F/Et stb |
|---|---|---|---|---|---|---|---|---|
| 0 | 2020-01-01 | 3200.00000000000 | 0 | 0 | 0 | 0 | 0 | none |
| 1 | 2020-07-01 | 3037.73875987746 | 38864.2338744572 | 46727.8893358510 | 0.00233656185776443 | 0.00151277402329625 | 0.00384933588106068 | 12139208.1074970 |
| 2 | 2021-01-01 | 2782.91506179661 | 99594.7403971816 | 120111.856789091 | 0.00600602311012888 | 0.00388851496232698 | 0.00989453807245586 | 12139208.1074967 |
| 3 | 2021-07-01 | 2562.14286113606 | 151911.968683336 | 183689.695545334 | 0.00918514279964078 | 0.00594679117156229 | 0.0151319339712031 | 12139208.1074967 |
| 4 | 2022-01-01 | 2377.70868780590 | 195407.593210859 | 236802.932166801 | 0.0118409948955951 | 0.00766628515676347 | 0.0195072800523586 | 12139208.1074967 |
| 5 | 2022-07-01 | 2226.24560801141 | 230985.237096421 | 280421.174118849 | 0.0140220632446355 | 0.00907838710069364 | 0.0231004503453291 | 12139208.1074969 |
| 6 | 2023-01-01 | 2096.00826266700 | 261475.039999678 | 317926.842484584 | 0.0158974810175951 | 0.0102925998895969 | 0.0261900809071921 | 12139208.1074968 |

Read the last column first. Six surveys, six independent divisions of a withdrawal by an expansion, and the answers agree from the first figure to the fifteenth. That column is the Ekene tank telling you it is a tank.

## Work one row

Take row 3, the survey of 2021-07-01. The pressure has fallen to 2562.14286113606 psia, so the drawdown from initial is

$$\Delta p = 3200 - 2562.14286113606 = 637.857138863942 \text{ psi}$$

Cumulative oil is 151911.968683336 stb and the oil formation volume factor at that pressure is 1.20918514279964 rb/stb. The underground withdrawal is the product:

$$F = 151911.968683336 \times 1.20918514279964 = 183689.695545334 \text{ rb}$$

Divide by that row's total expansion:

$$\frac{F}{E_t} = \frac{183689.695545334}{0.0151319339712031} = 12139208.1074967 \text{ stb}$$

Do it on your own calculator now. Two operations, one multiplication and one division, and the tank size falls out of a single survey row.

## See it in the panel

{{panel:mb-tank-explorer}}

Leave the aquifer selector on none, which is the truth for this tank. Read the survey table and check three of the F/Et values against the table above. Then look at the tiles: the estimated in place volume, the R-squared, and the drive index split. You are not expected to understand the regression tiles yet; module 3 explains them. What you should confirm now is that the panel's numbers and the table's numbers are the same numbers.

## The misconception to avoid

Learners see a drawdown of 1103.99173733300 psi and conclude that gas must be breaking out. It is a natural instinct and it is wrong here. What matters is not how far the pressure fell but where it landed relative to the bubble point. Ekene lands 96.0082626669955 psi above it, so the tank is still undersaturated at the last survey, and there is not one cubic foot of free gas in the reservoir.

Watch that margin, though. It is 1037.73875987746 psi at the first survey and 96.0082626669955 psi at the last. Another 100 psi of depletion and this course would need an entirely different set of equations.

## Exercise

Work out the margin above the bubble point at each of the six surveys by subtracting 2000 from each survey pressure. Then answer two questions. First, between which pair of consecutive surveys did the tank lose the largest amount of that margin? Second, at the observed rate of margin loss over the last step, roughly how much more production could this tank take before the undersaturated assumption fails? Give the reasoning, not a precise date.
