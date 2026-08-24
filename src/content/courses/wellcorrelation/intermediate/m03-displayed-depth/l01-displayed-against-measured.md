# Displayed against measured

From the moment you set a datum, every pick in this section has two depths. It has the measured depth it has always had, and it has a displayed depth on the flattened panel. Both are numbers in metres, both look like depths, and only one of them is a place in a well. Which one you quote matters, and mixing them is the commonest error in this tier.

## The two depths, defined

The **measured depth** of a pick is a property of the wellbore. It is what the logging tool recorded, what the tops table stores, and what a driller, a completion engineer or a volumetric calculation works in. It does not change when you open a section, change a datum or close the application. Ekene-2's TOP_SAND is at a measured 1565 m and it will be at a measured 1565 m in every view anyone ever builds of that well.

The **displayed depth** of a pick is a position on a panel whose vertical axis you redefined when you chose a datum. It exists inside that one view. Change the flattening top or the datum depth and every displayed depth in the section changes with it. Close the view and the number has nowhere to live.

The Associate tier could get away with treating this lightly, because a structural section displays every pick at its measured depth and the two numbers agree. This tier flattens, so they no longer agree, and you carry both.

## This tier's datum

Everything in the next two modules is read on one setting: flatten on TOP_A at a 1450 m datum. The four wells take one shift each.

| well | TOP_A measured | shift |
|---|---|---|
| Ekene-1 | 1500 | -50 |
| Ekene-2 | 1512 | -62 |
| Ekene-3 | 1495 | -45 |
| Ekene-4 | 1530 | -80 |

Every shift is negative because every well's TOP_A is deeper than the 1450 m datum, so every well moves up the display to reach it.

Take Ekene-2 as the worked pair. Its TOP_SAND is at a measured 1565 m. Its displayed depth on this flattened panel is 1503 m. Neither number is more correct than the other, because they answer different questions. Ask where the sand is in the well and the answer is 1565 m measured. Ask where the sand draws on this panel and the answer is 1503 m displayed.

## Which one to quote

Three rules cover almost everything you will be asked to write down.

**Anything that touches the physical well takes measured depth.** Casing points, perforation intervals, core points, a depth handed to a rig. A displayed depth in an operational document is a real and expensive error, and 1503 m looks exactly as much like a depth as 1565 m does. Nothing in Ekene-2 is at 1503 m.

**Anything read off the flattened geometry is a displayed depth, and it travels with its datum.** A displayed number on its own is ambiguous, because the same pick displays at different numbers under different datums. The Associate tier flattened this same section on TOP_SAND, and under that setting every sand pick displayed at the datum depth. Under this tier's TOP_A datum, Ekene-2's sand displays at 1503 m. Same pick, same well, two panels, two numbers. So write it as "TOP_SAND in Ekene-2 is at 1565 m measured, displaying at 1503 m on the section flattened on TOP_A at 1450 m." The sentence is long and it is never wrong.

**Say which one you mean, every time, in the same breath as the number.** The words are "measured" and "displayed". Two extra syllables buy you a number that cannot be misread by the next person.

## The three ways learners mix them

The first is quoting a displayed depth as a well depth. "TOP_SAND in Ekene-2 is at 1503" is false as written. It becomes true the moment you add the word displayed and the datum.

The second is building an interval from one well's displayed depth and another well's measured depth. That subtraction has no meaning at all, because the two numbers sit on different axes. An interval is always two picks in the same well, and both of them measured or both of them displayed.

The third is quieter and does more damage. It is reading the displayed column of a flattened panel as though it described structure. It does not. The whole purpose of flattening was to take the structural component out of the picture, so a displayed depth has had structure removed from it by construction. Module four is built on that difference.

## Which one the panel shows you

The flattening panel shows both, in adjacent columns, for every pick. That is deliberate. It is not there to save you the arithmetic, since the arithmetic is one addition per pick and you should be able to do it cold. It is there so that the pairing stays in front of you while you work, and so that a number you copy out of it comes with a label attached.

## Exercise

Write down, for Ekene-2's TOP_SAND, the sentence you would put in a report that quotes both depths and names the datum. Then decide which of the following two requests takes the measured depth and which takes the displayed depth: a request from the completion engineer for the depth to perforate the top of the sand, and a request from a colleague asking how far below the flattened TOP_A line the sand draws in that well.

Self-check: the sentence should contain 1565 m measured, 1503 m displayed, and the datum, which is TOP_A at 1450 m. The completion engineer takes 1565 m measured, because a perforation is made in a wellbore. The colleague is asking about the flattened panel, so the answer is read off the displayed axis, and it is 1503 minus 1450, which is 53 m below the flattened line. Note that the second answer is a difference of two displayed depths in one well, which is why it is safe.
