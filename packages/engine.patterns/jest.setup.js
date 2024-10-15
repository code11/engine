const jestDom = require('@testing-library/jest-dom');
expect.extend(jestDom);
global.IS_REACT_ACT_ENVIRONMENT = true;
