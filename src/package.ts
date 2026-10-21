import { linkedPackage } from '@_linked/core/utils/Package';
import { createLinkedComponentFn } from '@_linked/react/utils/LinkedComponent';

const {
  linkedShape,
  linkedUtil,
  linkedOntology,
  registerPackageExport,
  registerPackageModule,
  getPackageShape,
  packageExports,
  packageName,
} = linkedPackage('@_linked/schema', {mirrors: 'http://schema.org/'});

const linkedComponent = createLinkedComponentFn(
  registerPackageExport,
  () => {}
);

export {
  linkedComponent,
  linkedShape,
  linkedUtil,
  linkedOntology,
  registerPackageExport,
  registerPackageModule,
  getPackageShape,
  packageExports,
  packageName,
};
