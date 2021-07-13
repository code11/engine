import type { StatusCodes } from "http-status-codes";
import type { Unit } from "./unit";
import type { Data } from "./data";

export namespace Request {
  export enum Method {
    GET = "GET",
    DELETE = "DELETE",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    PURGE = "PURGE",
    LINK = "LINK",
    UNLINK = "UNLINK",
  }

  export enum ResponseType {
    ARRAYBUFFER = "arraybuffer",
    BLOB = "blob",
    DOCUMENT = "document",
    JSON = "json",
    TEXT = "text",
    STREAM = "stream",
  }

  export type Response<T = unknown> = {
    status: number;
    statusCode: StatusCodes;
    data?: T;
  };

  export enum StateId {
    SENT = "sent",
    NOT_SENT = "not_sent",
  }

  export namespace States {
    export namespace Sent {
      export enum StateId {
        SUCCESS = "success",
        PENDING = "pending",
        ERROR = "error",
      }
      export namespace States {
        export namespace Success {
          export type Data = Chart.State<StateId.SUCCESS, Response>;
        }

        export namespace Pending {
          export type Data = Chart.State<StateId.PENDING>;
        }

        export namespace Error {
          export type Data = Chart.State<
            StateId.ERROR,
            Response & {
              errorCode?: unknown;
            }
          >;
        }
      }
      export type Data = Chart.State<
        Request.StateId.SENT,
        void,
        Chart.List<States.Pending.Data, States.Success.Data, States.Error.Data>
      >;
    }
    export namespace NotSent {
      export enum StateId {
        PENDING = "pending",
        ERROR = "error",
      }
      export namespace States {
        export namespace Pending {
          export type Data = Chart.State<StateId.PENDING>;
        }
        export namespace Error {
          export type Data = Chart.State<StateId.ERROR>;
        }
      }

      export type Data = Chart.State<
        Request.StateId.NOT_SENT,
        Chart.List<States.Pending.Data, States.Error.Data>
      >;
    }
  }

  export type Data = Unit.Item<{
    opts: RequestInit;
    createdAt: Data.Timestamp;
    state: Chart.List<States.NotSent.Data, States.Sent.Data>;
  }>;
}
