# What the check does not cover

The boundary of the model, stated before the capstone rather than after.

## What is in

Four ratings, seven load cases, two pressure columns and an axial profile per case, a per-depth scan inside each section, a combined-loading derating inside the collapse check, a bending term inside the triaxial one, and four design factors.

## What is out, and matters

**Wear.** The drillstring rotating inside this casing removes wall, and every rating in the report is computed on the as-delivered wall. A worn joint has less burst, less collapse and less tension, and the check does not know.

**Temperature.** Yield strength falls with temperature, roughly ten percent by 150 degrees for common grades. Nothing here is temperature-derated, and the deepest section, which is the one closest to its limits, is also the hottest.

**Cement support.** A cemented casing is restrained by what is around it, and a real collapse capacity behind good cement is higher than the free-pipe rating. This check ignores the support and takes the free-pipe number, which is conservative and sometimes very conservative.

**Ovality and residual stress.** Both reduce collapse resistance, both are properties of the individual joint, and neither is in the published rating.

**Buckling.** A casing string in compression inside an oversized hole can buckle helically, and that is not checked anywhere in this tier. It is checked in the next one, for tubing.

**Connection sealing.** Joint strength is a tensile number. Whether the connection seals against 70 MPa is a separate rating that this catalog does not carry.

**Fatigue.** Repeated pressure cycles and repeated bending through a dogleg both accumulate damage, and every case here is a single static event.

## What is out, and is somebody else's job

Cement placement, which decides the external column in two cases. Trajectory and dogleg profile, which decide the bending term. Pore pressure and fracture gradient, which decide the gas kick shoe pressure. Wear, which is the Torque, Drag and Casing Wear course.

## Why the list is here and not in an appendix

Because the capstone asks for six safety factors, and a learner who can produce six correct safety factors and cannot say what they exclude has learned the arithmetic and not the engineering.

Every one of the seven omissions above would move at least one of those six numbers in the unsafe direction.

## Exercise

Pick the three omissions above that would most affect section 2 of this string, which is the deepest, hottest, most worn and closest to its limits.

For each, say which of the four checks it would degrade and roughly by how much.
