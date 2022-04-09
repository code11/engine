---
id: dashboard
title: "@c11/engine.dashboard"
sidebar_label: "@c11/engine.dashboard"
---

A tool designed to ease the work of developers on projects based on the Code11 Engine.
It could be used for debugging, onboarding and much more.

<img src="/engine/img/engine-dashboard.png" alt="Engine dashboard" />


## Setup

```bash
npm install @c11/engine.dashboard
```

Then add to `package.json`:
```
"scripts": {
  "dashboard": "engine-dashboard start",
}
```
In `engine.config.js`:
```js
module.exports = {
  exportAppStructure: true
}
```

Add to `.gitignore`:
```
.app-structure.json
```

(optional) To enable telemetry, add to the application's `index.tsx`:
```
import { sendToDashboard } from "@c11/engine.dashboard"

const app = engine({
  onEvents: sendToDashboard()
  ...
})
```
