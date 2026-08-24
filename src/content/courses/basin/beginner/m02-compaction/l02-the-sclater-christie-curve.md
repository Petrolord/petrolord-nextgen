# The Sclater-Christie curve

The last lesson argued that porosity falls by a fixed proportion for every equal increment of burial. This lesson writes that down, names the two parameters, and gives the values the engine uses for shale.

## The equation

$$\phi(z) = \phi_0 \, e^{-c z}$$

Porosity at depth $z$ is the surface porosity multiplied by an exponential decay in depth. It is called the Sclater-Christie relation after the authors who fitted it to sediment in the North Sea, and it is the standard compaction law in basin modelling because it is simple, it has one parameter pair per lithology, and it never misbehaves.

Three things about the form itself.

It is monotonic. Porosity only ever falls with depth in this model. There is no way to write a value that increases downward.

It never reaches zero. However deep you go, the exponential is a small positive number, so the rock always keeps some pore space. Real rocks behave that way too.

It is pinned at the surface. Set $z = 0$ and the exponential is 1, so $\phi(0) = \phi_0$ exactly, whatever $c$ is.

## What $\phi_0$ means

$\phi_0$ is the porosity the sediment has at the moment it is deposited, before anything is put on top of it. It is a fraction, v/v, and it is dimensionless.

Physically it is a statement about how the grains pack when they first come to rest. Mud settles as an open, disordered framework of platy clay particles with a great deal of water trapped between them, so its $\phi_0$ is high. Sand settles as rounded grains that pack reasonably well the first time, so its $\phi_0$ is lower. That is why the surface porosity of a shale is higher than the surface porosity of a sandstone, which surprises people who have only met the two rocks at reservoir depth.

Move $\phi_0$ and the whole curve moves with it, proportionally, at every depth. Doubling $\phi_0$ doubles the porosity at 10 m and at 3000 m alike, because $\phi_0$ multiplies the exponential rather than sitting inside it. The shape of the curve does not change at all.

## What $c$ means

$c$ is the compaction constant. Its units are per m, because the product $cz$ in the exponent has to be dimensionless.

Physically it says how readily this sediment gives up its pore space under load. A rock with a large $c$ loses porosity quickly in the first kilometre and arrives at depth already tight. A rock with a small $c$ holds its pore space stubbornly and is still reasonably porous where the first rock is not. The quantity $1/c$ has a depth as its unit and is the useful way to feel the number: it is the depth over which porosity falls by a factor of $e$.

Move $c$ and the shape changes while the top of the curve stays where it was. Every curve, whatever its $c$, starts at $\phi_0$ at the surface. Increase $c$ and the curve bends down harder immediately. Decrease it and the curve flattens towards a straight vertical line, which would be a sediment that does not compact at all.

That difference between the two parameters is the whole of lesson 5. $\phi_0$ decides who is more porous at the surface. $c$ decides who is more porous at depth, and the two answers do not have to be the same rock.

## The engine's shale

The engine's compaction library holds one parameter pair per lithology. For shale they are

| parameter | value |
|---|---|
| $\phi_0$ | 0.63 |
| $c$ | 0.00051 per m |

Read them as a sentence. Freshly deposited shale is 63 percent pore space by volume, and it loses porosity at a rate of 0.00051 per metre of burial.

The exponent is easiest to handle per kilometre. A thousand metres of burial gives $cz = 0.00051 \times 1000 = 0.51$, which is dimensionless, so every kilometre multiplies the porosity by $e^{-0.51}$. That single factor generates the whole ladder.

| depth | shale porosity (v/v) |
|---|---|
| 0 m | 0.63 |
| 500 m | 0.48819739371548104 |
| 1000 m | 0.37831221465172754 |
| 2000 m | 0.22717481230903933 |
| 3000 m | 0.13641747040908445 |
| 4000 m | 0.08191808785340832 |

The value at 2000 m is graded in the capstone, to a tolerance of 0.001 v/v, and the next lesson works it from the formula step by step.

Notice what the ladder does at the bottom. The step from 3000 m to 4000 m takes the porosity from 0.13641747040908445 to 0.08191808785340832, which is a far smaller change in absolute terms than the first kilometre made, even though it is exactly the same proportional loss. The curve has gone flat, not because anything switched off, but because a fixed proportion of a small number is a small number.

## What the curve does not know

Three honest limitations, since you will meet all of them.

The parameters are fitted values, not constants of nature. The 0.63 and 0.00051 per m in the library are reasonable shale numbers and they are the numbers this course grades against, but a different basin, a different clay mineralogy or a different silt content fits different values. When you take this method to a real field, the parameters are something you calibrate, and the porosity you predict is only as good as that calibration.

The depth $z$ is depth below the sediment surface, not depth below sea level. Water on top of the sediment does not compact it the way rock does, so in a marine section the compaction depth and the water depth are different quantities and must not be added together carelessly.

The curve assumes the pore fluid can escape. Where it cannot, pressure builds in the pores, part of the load is carried by the fluid instead of by the grain framework, and compaction stalls. The rock is then more porous at that depth than this curve predicts. That is the subject of the pore pressure course in this ladder, and it is the most common reason a measured porosity sits above the trend.

## Exercise

Work the porosity of shale at 500 m from the formula. Write down the exponent first, as a dimensionless number, then apply it to $\phi_0$. Then say what would happen to the value at 500 m and to the value at 4000 m if $\phi_0$ were reduced while $c$ was held fixed.

Self check: the exponent is $0.00051 \times 500 = 0.255$, so the porosity is $0.63 \, e^{-0.255}$, which the engine returns as 0.48819739371548104 v/v. Reducing $\phi_0$ scales every porosity on the curve by the same proportion, so the value at 500 m and the value at 4000 m both fall by that same fraction of themselves. The shape is unchanged, and no depth is affected more than any other.
