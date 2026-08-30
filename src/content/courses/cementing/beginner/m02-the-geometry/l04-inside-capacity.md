# Inside capacity

One number for the whole string, used twice.

{{panel:cm-volume-explorer}}

## The number

    capInside = pi / 4 x casing ID squared
              = pi / 4 x 0.1570736 squared
              = 0.01937743444976952 square metres

Constant with depth, because the casing is one size.

## Where it is used

**The shoe track volume**, which is the capacity times the distance from the float collar to the shoe.

**The displacement volume**, which is the capacity times the depth of the float collar.

And in the Professional tier, a third place: the inside leg of the flow path is parametrised by volume, and converting a volume back into a measured depth is a division by this capacity.

## The comparison worth making

The inside capacity is 0.01937743444976952 and the cased annulus capacity is 0.013356688045922537. So the casing bore holds about 45 percent more per metre than the annulus around it does.

That is why the displacement volume dominates a cement job. On the slant well the displacement is 57.357205971317775 cubic metres against 25.123380942966243 of slurry: more than twice as much fluid is pumped to push the cement as there is cement.

## And why it dominates the job time

    job time = total pumped / pump rate

On the slant well the total pumped is 86.48058691428402 cubic metres at 0.02 cubic metres a second, which is 4324.029345714201 seconds, or a bit over 72 minutes. Two thirds of that is displacement.

## The one thing that would break it

A tapered casing. The engine takes a single inside diameter, so a string that steps from one weight to another partway down would have its shoe track and displacement volumes computed on whichever bore was supplied.

That is a real limitation and it is easy to miss, because nothing refuses the input.

## Exercise

Compute the inside capacity from the casing bore of 0.1570736 m.

Then compute the horizontal well's displacement volume from its float collar depth of 2760 m and check it against 53.48171908136387.
