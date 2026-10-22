/**
 * `PostalAddress`, with every shape reachable through its properties
 * guaranteed to be registered (AdministrativeArea, and through Intangible and Thing).
 *
 * The class lives in `PostalAddress.class.ts` because Person names it eagerly
 * (`Person.address`): without the split, loading PostalAddress first left it
 * uninitialised while Person evaluated. See `Thing.ts` for the rule.
 */
export * from './PostalAddress.class.js';
import './Intangible.js';
import './AdministrativeArea.js';
