import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { CreativeWork } from './CreativeWork.js';
import { Person } from './Person.js';

@linkedShape({
  name: 'VisualArtwork',
  description:
    'A work of art that is primarily visual in character. Represents artworks with artist relationships, medium details, and creative work properties. (artwork, painting, sculpture)',
})
export class VisualArtwork extends CreativeWork {
  static targetClass = schema.VisualArtwork;

  /**
   * The number of copies when multiple copies of a piece of artwork are produced - e.g. for a limited edition of 20 prints, 'artEdition' refers to the total number of copies (in this example '20').
   **/
  @literalProperty({ path: schema.artEdition, maxCount: 1 })
  get artEdition(): number | string {
    return '';
  }

  /**
   * The material used. (E.g. Oil, Watercolour, Acrylic, Linoprint, Marble, Cyanotype, Digital, Lithograph, DryPoint, Intaglio, Pastel, Woodcut, Pencil, Mixed Media, etc.)
   **/
  @literalProperty({ path: schema.artMedium, maxCount: 1 })
  get artMedium(): string {
    return '';
  }

  /**
   * e.g. Painting, Drawing, Sculpture, Print, Photograph, Assemblage, Collage, etc.
   **/
  @literalProperty({ path: schema.artform, maxCount: 1 })
  get artform(): string {
    return '';
  }

  /**
   * The primary artist for a work in a medium other than pencils or digital line art--for example, if the primary artwork is done in watercolors or digital paints.
   **/
  @objectProperty({ path: schema.artist, shape: Person, maxCount: 1 })
  get artist(): Person {
    return null;
  }

  /**
   * The supporting materials for the artwork, e.g. Canvas, Paper, Wood, Board, etc. Supersedes surface.
   **/
  @literalProperty({ path: schema.artworkSurface, maxCount: 1 })
  get artworkSurface(): string {
    return '';
  }

  /**
   * The individual who adds color to inked drawings.
   **/
  @objectProperty({ path: schema.colorist, shape: Person, maxCount: 1 })
  get colorist(): Person {
    return null;
  }

  /**
   * The individual who traces over the pencil drawings in ink after pencils are complete.
   **/
  @objectProperty({ path: schema.inker, shape: Person, maxCount: 1 })
  get inker(): Person {
    return null;
  }

  /**
   * The individual who adds lettering, including speech balloons and sound effects, to artwork.
   **/
  @objectProperty({ path: schema.letterer, shape: Person, maxCount: 1 })
  get letterer(): Person {
    return null;
  }

  /**
   * The individual who draws the primary narrative artwork.
   **/
  @objectProperty({ path: schema.penciler, shape: Person, maxCount: 1 })
  get penciler(): Person {
    return null;
  }

  //TODO:

  //   /**
  // * The depth of the item.
  // **/
  // get depth():Distance | QuantitativeValue {
  //   return this.getValue(schema.depth);
  // }
  //   /**
  // * The height of the item.
  // **/
  // get height():Distance | QuantitativeValue {
  //   return this.getValue(schema.height);
  // }
  // /**
  //  * The width of the item.
  //  **/
  // get width(): Distance | QuantitativeValue {
  //   return this.getValue(schema.width);
  // }
}
