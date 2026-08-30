# What this engine models

The boundary, stated at the start rather than at the end.

## What is in

**Geometry.** Hole sections, casing dimensions, annular capacity rows split at the section boundaries, and an open hole excess factor.

**Volumes.** Annular slurry, shoe track, lead and tail, spacer, displacement, sacks and job time.

**Placement.** Plug-flow volume bookkeeping along the flow path, hydrostatic heads on the exact minimum-curvature true vertical depths, friction from the same loss kernel the hydraulics course uses, the U-tube balance, free-fall detection, equivalent circulating density at the previous shoe and at the shoe, and the achieved top of cement.

**Centralization.** API 10D bow-spring and rigid-blade standoff, mid-span sag, and the spacing that would just reach the API target.

**A checklist.** Five items, each of which either holds or does not.

## What is out, and named

**Intermixing.** The model is PLUG FLOW: every fluid front is a sharp face and no two fluids ever mix. Real fluids mix over tens of metres at the interfaces, which is most of what a spacer is designed to control.

**Chemistry.** Thickening time, compressive strength, free water, fluid loss, gas migration, retarder and accelerator response. None of it.

**Temperature.** Slurries thicken faster when hot and the bottomhole circulating temperature is what a laboratory schedule is designed against. Not modelled.

**Liner jobs.** The engine refuses a hanger depth above zero, in as many words: version one cements a full string from surface, and a liner run on a work string is a later phase.

**The transient free-fall rate.** When the column falls under its own weight the engine detects it and reports the deficit, and does not attempt to compute how fast the fall actually goes.

**Casing movement.** Rotating or reciprocating the casing during the job is the single most effective mud removal technique there is, and nothing here represents it.

## Why the list matters here

Because two of the omissions are the biggest levers a real cementing engineer has. Casing movement and spacer design both improve mud removal more than a centralizer programme does, and this engine can quantify only the centralizer programme.

An answer from this engine is therefore a lower bound on what a well-executed job achieves and an upper bound on what a badly executed one does, and the gap between those is wide.

## The version string

Every result this engine returns carries `cementing-1.0.0`. That is not decoration: a placement result and a standoff profile both carry it, so a saved answer can be traced to the code that produced it.

## Exercise

Of the six omissions listed, pick the two you would most want back before signing a cement programme.

For each, say what you would have to bring in from outside this course to cover it.
