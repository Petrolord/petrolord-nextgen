# Working the capstone

The Professional capstone, "Carry the lab to the field," grades six numbers. Each one tests a chain, and each chain was built in a specific module. This lesson walks the mechanism for every field, names the tool, and flags the mistake that costs each one. It does not hand you shortcuts. If a step below feels unfamiliar, the module that owns it is where to go, not this page.

## The three Ahmed fields: one example, one chain, three checkpoints

The first three fields all live inside Ahmed Example 4-7, and they are graded in the order the book works them.

**The lab J-per-psi factor.** This is the constant that turns a lab capillary pressure into a J value for the Nameless Field core: $C \sqrt{k/\phi} / (\sigma \cos\theta)$ with the published $C$ of 0.21645, the lab core's 80 md and 0.16 porosity, and the lab system's 50 dyn/cm at zero contact angle. Work it by hand once: $\sqrt{80/0.16} = \sqrt{500}$, and the rest is arithmetic. The value is $0.0967993827459659$ per psi, which the book prints as 0.096799. The costly mistake here is using the reservoir rock's properties instead of the lab core's. The factor belongs to the rock that was measured.

**The J value at $S_w = 0.2$.** Multiply the factor by the printed lab pressure at that saturation, 1.75 psi. The full-precision answer is $0.16939891980544033$. The mistake to avoid is quoting the book's rounded 0.169 and then building on it, which is exactly what the next field is designed to catch you doing in the other direction.

**The reservoir $P_c$ at $S_w = 0.2$.** Here the chain matters more than anywhere else in the course. The book rescales its own printed, three-decimal J column to the reservoir rock through the factor $9.191758209219469$ psi per unit J, which it prints as 9.192. Following the book's chain, the graded answer is $1.5534071373580902$ psi. If you rescale the full-precision J column instead, you land at a value that differs in the third decimal, and module 3's final lesson showed that the difference is larger than the grading tolerance. The capstone grades the printed chain because that is the published example's own arithmetic. Name your chain, then stay on it.

## The three Ekene fields: height, level, crest

The last three fields move to the Ekene sand and to metres.

**The entry height.** The Ekene reservoir curve has a finite capillary pressure at full water saturation, the entry pressure of $0.7355825053402938$ psi. Height above the free water level is pressure divided by the gradient, and the gradient is $0.4335$ psi/ft per unit of specific gravity difference times the contrast between brine at 1.03 and the 32 API oil at $0.8654434250764526$. That quotient is a height in feet, $10.31162356877775$ ft, and the graded answer is in metres: $3.142982863763458$ m, through the exact factor 0.3048. Submitting the feet value into the metres box is the whole reason module 5 spent a lesson on units.

**The free water level.** The design convention, stated in the fixture itself, is that water saturation reaches 1.0 exactly at the mapped contact of 1560 m. The free water level therefore sits the entry height deeper: $1563.1429828637636$ m TVD. The mistake here is conceptual rather than arithmetic: the mapped contact is the top of the water leg, not the level at which capillary pressure vanishes. Those are different surfaces separated by the entry height, and the capstone asks for the deeper one.

**The saturation at the crest.** The crest of the Ekene oil column sits $20.2818603515625$ m above the contact, which puts it the entry height further above the free water level. Convert that total height to feet, multiply by the gradient to get a capillary pressure, divide by the psi-per-J factor of $2.942330021361175$ to get J, and invert the power law with $a = 0.25$, $b = 1$, $S_{wirr} = 0.25$. The answer is $0.35062979402484734$. The panel will do this for you, but the capstone tolerance is tight enough that you must let the engine's own chain produce it rather than rebuilding it from rounded intermediates.

## Submitting

Run the chains, read the six values, and type them with their full precision into the capstone form on this page. Full precision costs nothing to copy and protects you from every tolerance. Round only when a human asks for a readable number, never when a grader asks for a correct one.

## The misconception to avoid

The capstone is not a memory test, and treating it as one is the misconception. Every graded value can be regenerated in front of you by the panel and the fixture. What is being graded is whether you know which chain, which rock, and which unit each number comes from. If you find yourself memorizing digits, you have stopped doing the work the certificate certifies.

## Exercise

First, work the lab J-per-psi factor by hand from its four inputs and check yourself against $0.0967993827459659$. Write down which of the four inputs you would need to re-check if your answer came out 1.2 times too large.

Second, sketch the Ekene column from the free water level to the crest as a vertical line. Mark the free water level, the mapped contact, the entry height between them, and the crest, each with its number. Then mark where saturation is 1.0 and where it is $0.35062979402484734$, and satisfy yourself that nothing between the free water level and the contact holds any oil at all.
