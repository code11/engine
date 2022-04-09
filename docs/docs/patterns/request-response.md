---
id: request-response
title: Request-Response
sidebar_label: Request-Response
---

The `Request-Response` pattern can be used in several occasions: when dealing
with server interactions like XHR calls, as a middleware between two
applications, an internal communication loop between two independent processes
etc.

It creates a very robust way of dealing with failures and tracking of events. By
breaking down the communication into it's constituent parts and storing partial
information on the state, it allows other processes to feed off this data in an
elegant manner: progress bars, warnings, retry strategies, using the partial
data received before completion, acknowledging to the user that the request was
accepted, etc.

```
{
  requests: {
    items: {
      "xyz": {
        state: INITIALIZING | PROCESSING | RESPONDING,
        params: {},
        processing: {
          data: {},
          triggers: {},
          result: {},
          error: {}
        },
        requestedAt: timestamp,
        respondedAt: timestamp,
        error: {}
      }
    }
  }
}
```
