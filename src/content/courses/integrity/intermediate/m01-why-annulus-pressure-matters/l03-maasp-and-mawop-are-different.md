# MAASP and MAWOP are different

Two functions, one piece of arithmetic, and only one of them decides the factors for you.

{{panel:wi-annulus-explorer}}

## The two entry points

    maaspRows({ annulusFluidDensityKgM3, elements })
    mawop({ annulusFluidDensityKgM3, candidates, factors })

They return the same shape, because mawop builds an element list and then calls maaspRows. The row arithmetic is shared and there is exactly one copy of it.

The difference is upstream of that call, and it is a difference of authority.

## MAASP: the elements' own allowable

An element handed to maaspRows carries its own `factor`, and if you omit it the engine uses 1. Omit them all and what comes back is the bare physical allowable: what the steel and the formation will take, with nothing held back.

If you do supply factors, they are yours. The engine checks that each one sits in the interval from just above zero up to and including 1, and throws otherwise, but it has no opinion about which value is right for a casing you have worn with drill pipe.

## MAWOP: a factor assigned by role

A candidate handed to mawop carries a `role`, not a factor. The engine looks the factor up:

| role | factor |
|---|---|
| outer-casing-burst | 0.5 |
| inner-casing-burst | 0.8 |
| inner-tubing-collapse | 0.75 |
| shoe-formation | 1 |
| rating | 1 |

Those are the API RP 90 defaults for sustained casing pressure. A candidate whose role is not in the table throws, so you cannot get a silent factor of 1 by misspelling a role. The table itself is an argument and can be replaced, but the standard document governs.

So MAASP is the physical question, what will these elements take, and MAWOP is the operating question, what will we allow, with the derating applied by what each element is rather than by who typed it.

## Do not read them as one well answered twice

In the published digest the MAASP fixture is a single element, a casing burst at 0.8 of 30000000 Pa, allowing 20585228.21103133 Pa. The MAWOP case is a different list of three candidates on the same annulus fluid, and answers 11905664.170969129 Pa.

The second number is smaller for two reasons at once: a different set of elements, and factors chosen by role. Comparing them tells you nothing until you hold one of those two things fixed.

## Exercise

In the panel, run the three MAWOP candidates through the MAASP path with no factors at all, and read what governs.

Then say which of the two answers you would quote to a production supervisor, and which to a casing designer.
