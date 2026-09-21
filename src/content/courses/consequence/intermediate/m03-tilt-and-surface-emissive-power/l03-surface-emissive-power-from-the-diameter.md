# Surface emissive power from the diameter

{{panel:cq-fire}}

The surface emissive power is the heat radiated by each square metre of the flame's surface, in W/m2. It is the first of the three factors in the heat flux, and the engine offers three methods to make it. The simplest reads nothing but the pool diameter. This lesson takes that method, Mudan's, and the physical picture behind it.

## The formula as the engine prints it

The model string reads "Mudan: SEP = 140e3 exp(-0.12 D) + 20e3 (1 - exp(-0.12 D))". It blends two powers. A clear, luminous flame radiates at 140e3 W/m2; a flame wrapped in black smoke radiates at 20e3 W/m2. The exponential weight moves the blend from the first toward the second as the diameter D grows. The call names the method as `mudan-diameter`.

## Why a big fire radiates less per square metre

A large hydrocarbon pool fire starves itself of air at its core. Incomplete combustion makes soot, and the soot forms a dark sheath around the flame that hides the bright core behind it. The larger the pool, the more of the surface is smoke. Mudan's form carries that picture in one line: the power falls toward 20e3 W/m2 as the pool grows.

## The power against the diameter

The engine swept six stated diameters:

| diameter m, stated | surface emissive power W/m2 |
| --- | --- |
| 2 | 114395.343328 |
| 5 | 85857.396331 |
| 10 | 56143.305429 |
| 20 | 30886.154395 |
| 40 | 20987.569646 |
| 80 | 20008.127448 |

By 80 m the flame is almost entirely smoke to the eye of the formula. ERHA, at 20 m, sits at 30886.154395 W/m2. The steepest fall comes early: from 2 m to 10 m the power drops from 114395.343328 to 56143.305429 W/m2, while from 40 m to 80 m it barely moves, from 20987.569646 to 20008.127448. A small pool fire is bright; a large one is mostly smoke.

## What the method does not read

Mudan's form reads only the diameter. The fuel, its burning flux, the flame length and the wind play no part. Two pools of the same size give the same power whether they hold heptane or gasoline. That makes the method quick and robust, and it also means the method cannot see a fuel that burns cleanly. The radiative fraction methods of the next lesson read the fuel and the flame, and they give different answers. That is why a heat flux is always quoted with the method that made its surface emissive power.

## The published check

The Yellow Book's worked benzene pool fire prints a Mudan surface emissive power of 21000 W/m2. The engine returns 20736.395957, a relative difference of 1.26e-2. The printed figure is rounded, and the golden accepts the engine's value against it. This published step is why the surface emissive power can carry a graded answer.

## Exercise

In the fire panel, choose the Mudan method and step the diameter through the six stated values, confirming each row. Then change the fuel on ERHA from heptane to gasoline while keeping 20 m, and record the Mudan power again. Explain in two sentences what you saw and what it tells you about the method's inputs.
