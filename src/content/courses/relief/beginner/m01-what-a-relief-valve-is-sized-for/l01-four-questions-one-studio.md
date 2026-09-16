# Four questions, one studio

The Relief & Flare Studio answers four questions over one facility. What orifice a pressure safety valve (PSV) needs, what load a pool fire puts on it, what drum keeps liquid out of the flare header, and how long a vessel takes to depressure.

## The word relief, and what it means here

This engine sizes a pressure relief device and the flare system behind it. The word relief in this course always means pressure relief. A relief well is a drilling subject and belongs to another course entirely, so nothing here is ever written as bare relief. A bare safety valve elsewhere in this academy means the downhole subsurface safety valve, so the device here is always written as a pressure safety valve, or PSV.

## The seven routes

Four of the routes are API 520 Part I in its published USC forms. Gas and vapour in both flow regimes, liquid with the published viscosity correction, steam with the Napier correction, and the API 521 fire case with its heat input evaluated at the actual relieving pressure. The flare side is three more: droplet settling with a horizontal knockout drum, point source radiation solved in both directions, and an adiabatic vessel blowdown march.

This tier takes the first three of the four sizing routes and follows each one from a stated load to a standard orifice letter. Where the load comes from and where the liquid goes is the Professional tier. A vessel emptying itself is the Expert tier.

## The engine never chooses the case

Every sizing route takes a relief load as an input. The one route that computes its own load is the fire case, and it computes that load from geometry, a drainage answer and an environment factor that the caller states. Nothing in this module inspects a plant and decides which scenario governs it.

That is the thesis of the whole course. A relief system is sized by choosing the case, because every number this engine returns is the size that one chosen case demands. Hand it a load and it will tell you what area passes that load. It will never tell you that you picked the wrong load.

## What a call gives back

Reading the module gives 22 exports. Seven of them return a bare number and signal a refusal by returning NaN. Twelve return an object. Two are published tables, and one is a derived constant the engine works out and exports for inspection.

Every one of the twelve object routes keeps one contract: either a finite result, or an object carrying an `error` string. That matters to anyone calling it, because a non finite number arriving with no error field is exactly what a caller's error guard cannot see. The Expert tier audits both halves of that contract across every route.

## Exercise

Write down the four questions the studio answers and mark which one computes its own load. Then list the three quantities this tier will size a valve for, and say in one sentence what the engine needs handed to it before any of the three can be worked out.
