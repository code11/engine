import 'regenerator-runtime/runtime'; // single-spa dependency
import * as SingleSpa from 'single-spa';

SingleSpa.registerApplication(
  'my-app',
  // 6 levels is as much as we need for accessing the app root. We are inside node_modules, we know that for sure and we know how the app entrypoint should be defined
  import(`../../../../../../src/index.tsx`),
  (location) => true
);

SingleSpa.start();
