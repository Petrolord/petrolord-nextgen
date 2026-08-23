# Porosity concepts

Porosity is the fraction of a rock's bulk volume that is open space. If you could crush a cubic metre of reservoir sandstone and separate the grains from the voids, the void share is the porosity. It is the storage term of the whole petroleum system: however good the structure and the seal, the volume of oil or gas in place scales directly with porosity. It is also an input to the water saturation calculation you will meet in the next module, so an error in porosity propagates into saturation and then into net pay. Getting porosity right, and knowing what kind of porosity you have computed, is the foundation of quantitative log analysis.

## Total and effective porosity

Not all pore space is equal. **Total porosity** counts every void in the rock, including microporosity inside clay aggregates and water bound to clay surfaces. **Effective porosity** counts only the interconnected pore space that can store and transmit free fluids. In a clean sandstone with little clay the two are nearly the same number. In a shaly rock they diverge sharply: a shale can hold 10 to 20 percent total porosity as clay-bound water while its effective porosity is close to zero. Nothing can be produced from it.

The distinction matters because logging tools respond to total quantities. A density tool senses all the pore volume regardless of whether the fluid in it can move. Part of the interpreter's job is to recognise where a raw log porosity is reading bound water and to avoid booking it as storage. In this course we work in a clean-sand teaching well where the sands have very low clay content, so density porosity in the sands is effectively both total and effective porosity. In the shale beds you will still see the tool report apparent porosity, and you will learn to discount it.

## Primary and secondary porosity

Geologists also classify porosity by origin. **Primary porosity** is the intergranular space left over from deposition, the packing voids between sand grains. It is what you expect in a sandstone like the typewell's. **Secondary porosity** is created after deposition: dissolution vugs in carbonates, fractures in tight rocks, moldic pores where grains or fossils have been leached away. Secondary porosity can dominate storage in carbonates, and it behaves differently on logs (a sonic tool, for example, largely misses vuggy porosity). For this beginner course the working assumption is simple intergranular primary porosity.

## Typical magnitudes

Keeping reference numbers in your head lets you sanity-check a computation instantly:

| Rock | Typical porosity (fraction) |
|---|---|
| Clean, well-sorted sandstone | 0.15 to 0.30 |
| Cemented or deeply buried sandstone | 0.05 to 0.15 |
| Tight sandstone, most shales (effective) | below 0.10 |
| Chalk and some carbonates | up to 0.35 or more |

A freshly computed porosity of 0.21 in a clean sand at moderate burial depth is entirely plausible. A value of 0.45 in the same rock should make you suspect a bad density reading or a wrong parameter, since it approaches the porosity of loose, uncompacted sand at the seabed. A negative value tells you the measured bulk density exceeded your assumed matrix density, which points at the parameters rather than the rock.

## Fractions and percent

Porosity appears in two conventions: as a fraction (0.21) and as percent (21 percent, sometimes written 21 porosity units or 21 pu). Formulas in this course, and the engine behind the Learning Mode app, use **fractions** throughout. The Archie equation raises porosity to a power, so feeding it 21 instead of 0.21 produces nonsense. When someone says a sand "lost three porosity units", they mean the fraction dropped by 0.03. Check the convention every time you pick up numbers from a report.

## A worked frame of reference

Take one cubic metre of the typewell's SAND_A at a porosity of 0.21. The rock holds $1 \times 0.21 = 0.21\ \mathrm{m^3}$ of pore volume. If water saturation in that pore space is 0.35 (a number you will compute yourself in module 4), the hydrocarbon share is $0.21 \times (1 - 0.35) = 0.1365\ \mathrm{m^3}$ of oil per cubic metre of rock. Multiply that unit-volume figure over the thickness and area of a sand body and you have the logic of every volumetric estimate you will ever make. Porosity sits at the front of that chain, which is why the next four lessons are spent computing it carefully.

## Exercise

A clean sandstone sample has a bulk volume of 200 cubic centimetres and contains 38 cubic centimetres of interconnected pore space, plus 4 cubic centimetres of isolated pores sealed off by cement.

1. Compute the total porosity and the effective porosity as fractions.
2. Which of the two would a density log respond to, and which one represents producible storage?

Self-check: total porosity is $(38 + 4)/200 = 0.21$, effective porosity is $38/200 = 0.19$. The density tool senses all void space, so it reads close to the total value; only the 0.19 of connected space can store producible fluid.
