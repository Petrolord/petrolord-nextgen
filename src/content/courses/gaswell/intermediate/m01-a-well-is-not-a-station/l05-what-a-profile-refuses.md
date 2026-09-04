# What a profile refuses

Six ratios down a hole look like a picture of the well. They are six evaluations of one equation at six sets of numbers somebody typed in.

{{panel:pd-profile-explorer}}

## The traverse is not solved, it is supplied

`loadingProfile` takes a list of stations, each with its own pressure, temperature, z and diameter. It does not solve multiphase flow, does not compute a gradient and does not check that the six pressures are consistent with the 3100.0 Mscf/d flowing through 3.548 in tubing. The 880.0 psia and 1500.0 psia on EBOCHA-5 are assertions, and the shoe ratio of 0.9619521855 is exactly as good as the survey that produced 1500.0 psia.

## The rate is an input too

There is no inflow performance anywhere in these modules. A profile at 3100.0 Mscf/d says what happens if the well makes 3100.0 Mscf/d. It does not say the well will make it, and it does not say what happens after liquid starts falling back, which is the thing everyone actually wants to know.

## The droplet model, and what it leaves out

The balance models one droplet at its terminal velocity. It does not model a droplet population, coalescence, break-up in transit, or film flowing on the tubing wall, which is the other way a gas well carries liquid. The drag coefficient of 0.44 is a rigid sphere in the Newton regime, and a real droplet deforms.

Interfacial tension and liquid density are inputs. EBOCHA-5's 62.0 dyne/cm and 66.2 lbm/ft3 are not functions of anything the modules know, and the published Turner properties are offered as labelled starting points rather than as correlations.

## The refusals it does make

An empty traverse returns `ok = false` with "The loading profile needs at least one station from the flowing traverse." An unknown correlation returns `ok = false` with "Unknown loading correlation \"guess\". Use turner or coleman."

Both are the right behaviour, and both are worth noticing for what they imply. The module refuses where it has no answer at all, so anything it does return, it is standing behind.

## The mistake

Treating station spacing as resolution. EBOCHA-5's crossing sits between 4500.0 ft and 6000.0 ft, inside the deepest 40.0000 percent of the string and outside the deepest 20.0000 percent, and that is the entire answer. Reporting a loading depth to the foot from a survey cut at 1500.0 ft spacing is a claim about arithmetic dressed as a claim about a well.

`recommendCorrelation` has the matching limit: it takes one pressure and cannot see which station that pressure came from.

## Exercise

Run a profile with a single wellhead station and read the controlling station it returns.

Then say in one sentence why the module cannot refuse that call.
