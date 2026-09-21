# The solid flame model

{{panel:cq-fire}}

The Associate tier asked how much gets out and where it goes. This tier asks one question of its own: what does a pool fire radiate to a person or a piece of plant standing some distance away. The engine answers with the solid flame model, and every lesson in this tier is one link of that model's chain.

## A cylinder of flame

The solid flame model treats a pool fire as a cylinder of flame. Its base is the pool, with a radius of D/2, and its height is the flame length. Every part of its surface radiates at one uniform surface emissive power, in W/m2. The model replaces flickering tongues and rolling smoke with a shape it can calculate and a power it can name, and the engine declares that choice in every basis block.

## Three factors make one heat flux

The engine's model string reads "solid flame: q = SEP x F x tau". The heat flux at a target is the surface emissive power, times the view factor F (the fraction of the target's view the cylinder fills), times the transmissivity tau (the fraction of the heat radiation the air lets through). Each factor has its own module in this tier.

## The chain starts at the burning flux

Every step begins with the burning flux, the mass of fuel burned per square metre of pool per second, in kg/(m2 s). The burning flux sets the flame length. The wind sets the tilt. The flame length and the burning flux feed the surface emissive power. The flame length, the tilt and the distance set the view factor. Each is a separate engine function (`poolBurningRate`, `poolFireFlameLength`, `poolFireTilt`, `surfaceEmissivePower`, `cylinderViewFactor`), and `poolFireSolidFlame` chains them from a pool to a heat flux.

## The choices the engine declares

Four choices shape every answer in this tier. The flame is a cylinder of radius D/2, and the engine does not stretch its base in the wind, which matches the Yellow Book's own worked step. The surface emissive power is made by a method the call names. The view factor refuses a flame that leans over its target. The transmissivity is either stated by the caller or computed by the Bagster fit inside its band, and every graded heat flux in this course uses a stated one.

## One stream through the whole chain

ERHA is a heptane bund fire, 20 m across, with air at 1.2 kg/m3 (stated). With a 4 m/s wind and a stated transmissivity of 0.8, the engine returns:

| step | value |
| --- | --- |
| burning flux kg/(m2 s) | 0.101000 |
| flame length m | 32.511563 |
| tilt degrees | 49.174202 |
| surface emissive power W/m2, with soot | 52025.691247 |
| Fmax at 40 m from the centre | 0.250188055557 |
| heat flux at 40 m, W/m2 | 10412.965226 |

## Exercise

Open the fire panel on the ERHA stream with a 4 m/s wind. Step through the views and write down each value the panel returns, from the burning flux to the heat flux at 40 m. Then multiply the surface emissive power, the Fmax and the stated transmissivity yourself and set your product beside the engine's heat flux. Name the one factor in the chain that you, the analyst, supplied.
