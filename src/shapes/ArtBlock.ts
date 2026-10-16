import { Shape } from '@_linked/core/shapes/Shape';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';

@linkedShape({
  name: 'ArtBlock',
  description:
    'A custom art block implementation for ArtBlocks platform. Represents generative artworks with creator relationships and creation metadata. (generative art, NFT, block)',
})
export class ArtBlock extends Shape {
  static targetClass = schema.VisualArtwork;

  get url(): string {
    return '';
  }

  get author(): string {
    return '';
  }

  get createdAt(): string {
    return '';
  }
}
