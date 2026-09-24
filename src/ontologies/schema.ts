import { Prefix } from '@_linked/core/utils/Prefix';
import { createNameSpace } from '@_linked/core/utils/NameSpace';

export const loadData = async () => {
  return Promise.all([
    //@ts-ignore
    import('../data/schema-added.json', { with: { type: 'json' } }).then(
      (data) => data.default
    ),
    //@ts-ignore
    import('../data/schema.json', { with: { type: 'json' } }).then(
      (data) => data.default
    ),
  ]);
};

//NOTE: we have changed the usual namespace https://schema.org/ to http://schema.org/ because tools like jsonld will convert all URI's to HTTP
//for now, our approach is therefor to convert to & use http versions only. schema.json has been adjusted too, and all namespaces in other files should use http://schema.org
export const ns = createNameSpace('http://schema.org/');
Prefix.add('schema', 'http://schema.org/');
const term = (suffix: string) => ns(suffix);

export const _ontologyResource = term('');

// Classes
export const DataType = term('DataType');
export const CreativeWork = term('CreativeWork');
export const Person = term('Person');
export const VisualArtwork = term('VisualArtwork');
export const Project = term('Project');
export const PropertyValue = term('PropertyValue');
export const Action = term('Action');
export const ImageObject = term('ImageObject');
export const Code = term('Code');
export const House = term('House');
export const City = term('City');
export const Place = term('Place');
export const Country = term('Country');
export const Event = term('Event');
export const JoinAction = term('JoinAction');
export const BefriendAction = term('BefriendAction');
export const Organization = term('Organization');
export const Accommodation = term('Accommodation');
export const Room = term('Room');
export const Apartment = term('Apartment');
export const VideoObject = term('VideoObject');
export const Conversation = term('Conversation');
export const SubscribeAction = term('SubscribeAction');
export const UpdateAction = term('UpdateAction');
export const PlayAction = term('PlayAction');
export const Answer = term('Answer');
export const Comment = term('Comment');
export const DefinedTerm = term('DefinedTerm');
export const Intangible = term('Intangible');
export const DefinedTermSet = term('DefinedTermSet');
export const ItemList = term('ItemList');
export const ListItem = term('ListItem');
export const MediaObject = term('MediaObject');
export const Observation = term('Observation');

// Properties
export const artEdition = term('artEdition');
export const artform = term('artform');
export const artist = term('artist');
export const artMedium = term('artMedium');
export const dateCreated = term('dateCreated');
export const datePublished = term('datePublished');
export const familyName = term('familyName');
export const givenName = term('givenName');
export const birthDate = term('birthDate');
export const birthPlace = term('birthPlace');
export const artworkSurface = term('artworkSurface');
export const colorist = term('colorist');
export const depth = term('depth');
export const height = term('height');
export const inker = term('inker');
export const letterer = term('letterer');
export const penciler = term('penciler');
export const width = term('width');
export const additionalType = term('additionalType');
export const alternateName = term('alternateName');
export const gender = term('gender');
export const hasOccupation = term('hasOccupation');
export const homeLocation = term('homeLocation');
export const description = term('description');
export const disambiguatingDescription = term('disambiguatingDescription');
export const identifier = term('identifier');
export const image = term('image');
export const mainEntityOfPage = term('mainEntityOfPage');
export const name = term('name');
export const potentialAction = term('potentialAction');
export const sameAs = term('sameAs');
export const subjectOf = term('subjectOf');
export const url = term('url');
export const codeValue = term('codeValue');
export const containedInPlace = term('containedInPlace');
export const containsPlace = term('containsPlace');
export const AdministrativeArea = term('AdministrativeArea');
export const Thing = term('Thing');
export const contentUrl = term('contentUrl');
export const latitude = term('latitude');
export const longitude = term('longitude');
export const actionStatus = term('actionStatus');
export const accommodationCategory = term('accommodationCategory');
export const about = term('about');
export const telephone = term('telephone');
export const startDate = term('startDate');
export const endDate = term('endDate');
export const affiliation = term('affiliation');
export const attendee = term('attendee');
export const location = term('location');
export const event = term('event');
export const agent = term('agent');
export const participant = term('participant');
export const object = term('object');
export const faxNumber = term('faxNumber');
export const email = term('email');
export const legalName = term('legalName');
export const superEvent = term('superEvent');
export const address = term('address');
export const member = term('member');
export const honorificPrefix = term('honorificPrefix');
export const endTime = term('endTime');
export const members = term('members');
export const founder = term('founder');
export const postalCode = term('postalCode');
export const areaServed = term('areaServed');
export const startTime = term('startTime');
export const teamID = term('teamID');
export const knows = term('knows');
export const parentItem = term('parentItem');
export const text = term('text');
export const isMarried = term('isMarried');
export const skills = term('skills');
export const inDefinedTermSet = term('inDefinedTermSet');
export const hasDefinedTerm = term('hasDefinedTerm');
export const jobTitle = term('jobTitle');
export const itemListElement = term('itemListElement');
export const position = term('position');
export const item = term('item');
export const previousItem = term('previousItem');
export const nextItem = term('nextItem');
export const usageInfo = term('usageInfo');
export const copyrightNotice = term('copyrightNotice');
export const creditText = term('creditText');
export const value = term('value');
export const propertyID = term('propertyID');
export const variableMeasured = term('variableMeasured');
export const observationDate = term('observationDate');
export const observationAbout = term('observationAbout');
export const dateDeleted = term('dateDeleted');
export const dateModified = term('dateModified');
export const addressCountry = term('addressCountry');
export const addressRegion = term('addressRegion');
export const addressLocality = term('addressLocality');
export const streetAddress = term('streetAddress');
export const creator = term('creator');
export const author = term('author');
export const headline = term('headline');
export const childItem = term('childItem');

export const schema = {
  // Classes
  Intangible,
  DataType,
  creditText,
  copyrightNotice,
  CreativeWork,
  usageInfo,
  Person,
  VisualArtwork,
  Project,
  PropertyValue,
  Action,
  ImageObject,
  Code,
  Event,
  JoinAction,
  BefriendAction,
  Organization,
  Accommodation,
  Room,
  Apartment,
  VideoObject,
  Conversation,
  SubscribeAction,
  UpdateAction,
  PlayAction,
  Answer,
  Comment,
  DefinedTerm,
  DefinedTermSet,
  ItemList,
  ListItem,
  Observation,
  House,
  Place,
  City,
  Country,
  AdministrativeArea,
  Thing,
  MediaObject,
  // Properties
  dateModified,
  dateDeleted,
  additionalType,
  alternateName,
  gender,
  description,
  teamID,
  disambiguatingDescription,
  identifier,
  image,
  mainEntityOfPage,
  name,
  headline,
  potentialAction,
  sameAs,
  subjectOf,
  url,
  artform,
  artist,
  artworkSurface,
  creator,
  author,
  colorist,
  depth,
  height,
  inker,
  containedInPlace,
  containsPlace,
  letterer,
  penciler,
  observationDate,
  variableMeasured,
  observationAbout,
  width,
  artEdition,
  artMedium,
  dateCreated,
  datePublished,
  birthDate,
  birthPlace,
  hasOccupation,
  homeLocation,
  familyName,
  givenName,
  propertyID,
  codeValue,
  contentUrl,
  latitude,
  longitude,
  telephone,
  honorificPrefix,
  actionStatus,
  accommodationCategory,
  about,
  knows,
  startDate,
  endDate,
  affiliation,
  attendee,
  location,
  event,
  agent,
  participant,
  object,
  faxNumber,
  email,
  address,
  legalName,
  superEvent,
  member,
  endTime,
  members,
  founder,
  postalCode,
  areaServed,
  startTime,
  parentItem,
  text,
  isMarried,
  skills,
  inDefinedTermSet,
  hasDefinedTerm,
  jobTitle,
  itemListElement,
  position,
  item,
  previousItem,
  nextItem,
  value,
  addressCountry,
  addressRegion,
  addressLocality,
  streetAddress,
  childItem,
};

