# Three terms and a maximum

The whole placement pressure calculation is one line.

{{panel:cm-placement-explorer}}

## The line

    pump pressure = max(0, annulus head + friction - inside head)

Three terms and a floor at zero. Everything else in this module is what each term is made of and what the floor means.

## The sign of each

**The annulus head** pushes back at the pumps. Whatever is standing in the annulus has to be lifted, or rather held up, by pressure at the surface.

**Friction** also pushes back. Moving fluid through a pipe and an annulus costs pressure, and the pumps supply it.

**The inside head** HELPS. Whatever is standing inside the casing is pushing down toward the shoe, and every pascal of it is a pascal the pumps do not have to supply.

## Why the inside head helps

Because the flow path is a U. The pumps are at one end, the annulus outlet is at the other, and both ends are at surface. A dense column on the pump side is a siphon.

That is the whole content of the word U-tube, and it is what makes cementing different from every other pumping operation in drilling. In circulation the fluid going down and the fluid coming up are the same density and the two heads cancel exactly. In cementing they are deliberately not.

## The raw value, before the floor

The engine keeps both:

    uTubePa       = annHead + friction - insideHead
    pumpPressurePa = max(0, uTubePa)

The raw value is reported as `uTubePa` and the floored one as `pumpPressurePa`, in every one of the 61 series rows.

Where the raw value is positive the two are the same number. Where it is negative they differ, and the difference is the whole subject of the free-fall lesson.

## The shape through a job

On the slant well's two-slurry programme the pump pressure starts at 5517762.999844827 Pa, falls to a minimum of 589724.8510166854 at 28.826862304761338 cubic metres pumped, and then rises to 13712451.13169735 at the end.

Down and then up, by a factor of nine each way. The next module is entirely about why.

## Why the start is not zero

Because at zero pumped volume the hole is full of mud, inside and out, and the two heads should cancel.

They do not, because the ANNULUS runs only to the shoe while the INSIDE runs to the shoe as well, and both are the same fluid at the same true vertical depths, so the heads are equal and the 5517762.999844827 Pa is the FRICTION of circulating the whole path at 0.02 cubic metres a second before any cement has moved.

## Exercise

At the first step of the slant well's job the pump pressure is 5517762.999844827 Pa and both columns are mud.

Say which of the three terms that number is, and what it would be at zero pump rate.
