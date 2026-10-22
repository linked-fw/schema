/**
 * Registers every shape this package defines, and nothing else.
 *
 * A shape registers when its module is evaluated, so this module exists to be
 * imported for that side effect alone: `import '<package>/shapes/index';`
 * It has no exports and pulls in no components or providers, so it loads in
 * plain node (no CSS, no React tree) as well as in a bundle. The package
 * entry imports it instead of listing shapes itself.
 */
import '../ontologies/schema.register.js';
import './Accommodation.js';
import './Action.js';
import './AdministrativeArea.js';
import './Answer.js';
import './Apartment.js';
import './BefriendAction.js';
import './Code.js';
import './Comment.js';
import './Conversation.js';
import './Country.js';
import './CreativeWork.js';
import './DataFeedItem.js';
import './DefinedTerm.js';
import './Event.js';
import './House.js';
import './ImageObject.js';
import './Intangible.js';
import './ItemList.js';
import './JoinAction.js';
import './ListItem.js';
import './MediaObject.js';
import './Observation.js';
import './Organization.js';
import './Person.js';
import './Place.js';
import './PlayAction.js';
import './PostalAddress.js';
import './PropertyValue.js';
import './Room.js';
import './SubscribeAction.js';
import './Thing.js';
import './UpdateAction.js';
import './VideoObject.js';
import './VisualArtwork.js';
