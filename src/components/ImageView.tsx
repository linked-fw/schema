import React, { ImgHTMLAttributes } from 'react';
import style from './ImageView.module.css';
import { linkedComponent } from '../package.js';
import { ImageObject } from '../shapes/ImageObject.js';
import { asset } from '@_linked/core/utils/LinkedFileStorage';

const query = ImageObject.select((imageObject) => ({
  contentUrl: imageObject.contentUrl,
}));

type ImageViewData = {
  contentUrl?: string;
  _refresh?: unknown;
  source?: unknown;
};

export const ImageView = linkedComponent<
  typeof query,
  Partial<ImgHTMLAttributes<any>>
>(query, (props: Partial<ImgHTMLAttributes<any>> & ImageViewData) => {
  let { contentUrl, width, height, _refresh, ...restProps } = props;
  //when using restProps because we want to allow many other props, it's important to remove the source & shape prop
  //we could potentially make a utility for this
  delete restProps.source;
  // delete restProps.shape;

  const src = contentUrl ? asset(contentUrl) : undefined;

  return (
    <img {...restProps} src={src} width={width} height={height} />
  );
});

//register all components in this file
// registerPackageModule(module);
