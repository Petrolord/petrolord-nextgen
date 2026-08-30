# Inside and outside, at every depth

A load case is not a pressure. It is two curves and a third one for the weight.

{{panel:ct-loadcase-explorer}}

## The definition

    loadCaseProfiles(kind, shoeTvdM, env, string)
      -> { tvdM[], piPa[], poPa[], faN[] }

Four arrays of the same length. A depth, the pressure INSIDE the pipe at that depth, the pressure OUTSIDE it, and the axial force in the steel there.

Everything else in this tier is comparisons between those arrays and the ratings from the last one.

## Why two columns and not one differential

Because the triaxial check needs both. The Lame solution for the wall stresses depends on the inside pressure and the outside pressure separately, not only on their difference: a pipe with 60 MPa in and 30 MPa out is not in the same state as one with 30 in and zero out, even though the differential is the same.

Burst and collapse do only need the difference. Triaxial does not, and the difference between those two facts is a whole lesson in module 4.

## The grid

Uniform, from zero to the shoe true vertical depth, in 50 intervals, so 51 depths.

For the published string, shoe at 2507.919699301 m, the spacing is 50.15839398602 m.

That grid is a discretisation and it has a consequence. The governing depth the check reports is always one of those 51 depths, so it is the worst SAMPLED depth rather than the worst depth. On a smooth profile with a monotone differential the two coincide at an endpoint, and on this string they always do.

## True vertical depth, not measured depth

Every pressure in every case is a hydrostatic column, and a hydrostatic column depends on vertical height. The string is on a slant well of 3000 m measured depth reaching 2507.919699301 m vertically, and the check runs on the vertical axis throughout.

The measured depth matters for how much steel is hanging, and the engine handles that by taking the string weight as an input rather than recomputing it.

## The environment

One object carries every fluid density and pressure the seven cases need: mud, cement, gas gradient, seawater, test pressure, packer fluid, evacuation fraction, overpull. Not every case reads every field, and a case reads only what it needs.

For the published run the mud is 1440 kg/m3, the cement 1900, the seawater 1030, the test pressure 35000000 Pa and the gas gradient 2300 Pa per metre.

## Exercise

Open the panel on the gas kick and read the two pressure curves at surface and at the shoe.

Then switch to the full evacuation case and do the same. Say which of the four numbers you just read is the same in both cases, and why.
