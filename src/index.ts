import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router
} from "express";
import { Model } from "mongoose";

export const GET_LIST = "GET_LIST";
export const GET_ONE = "GET_ONE";
export const CREATE = "CREATE";
export const UPDATE = "UPDATE";
export const DELETE = "DELETE";

const toPlainObject = (json: any) => JSON.parse(JSON.stringify(json));

type renameIdProps = {
  _id?: string;
  id?: string;
};

/*
  Rename _id to id to match
  ra-data-simple-rest client needs
 */
const renameId = (arr: Array<renameIdProps>) => {
  const newArr = toPlainObject(arr);
  newArr.map((arrItem: renameIdProps) => {
    if ("_id" in arrItem) {
      arrItem.id = arrItem._id;
      delete arrItem._id;
    }
  });
  return newArr;
};

/*
 Get list of resources
 */
const getList = (
  router: Router,
  route: string,
  model: Model<any>,
  middlewares: Array<RequestHandler>
) => {
  router.get(
    route + "/",
    middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      let { sort, range, filter } = req.query;
      if (sort) {
        const a = JSON.parse(sort);
        sort = { [a[0]]: a[1] === "ASC" ? 1 : -1 };
      }
      let skip = 0;
      let limit = 100;
      if (range) {
        const a = JSON.parse(range);
        skip = a[0];
        limit = a[1] - skip;
      }

      filter = filter ? JSON.parse(filter) : {};
      if ("id" in filter) {
        filter._id = filter.id;
        delete filter.id;
      }
      const items = renameId(
        await model
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec()
      );
      const total = await model.count(filter);

      res.set("Content-Range", `${skip}-${skip + limit}/${total}`);
      res.json(items);
    }
  );
};

/*
 Get a resource
 */
const getOne = (
  router: Router,
  route: string,
  model: Model<any>,
  middlewares: Array<RequestHandler>
) => {
  router.get(
    route + "/:id",
    middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const item = await model.findOne({ _id: id });
      if (!item) {
        res.status(404).json({ error: "Not fould" });
        return;
      }
      res.json(renameId([item])[0]);
    }
  );
};

/*
 Create a resource
 */
const create = (
  router: Router,
  route: string,
  model: Model<any>,
  middlewares: Array<RequestHandler>
) => {
  router.post(
    route + "/",
    middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const item = await model.create(data);
      res.status(201).json(renameId([item])[0]);
    }
  );
};

/*
 Update a resource
 */
const update = (
  router: Router,
  route: string,
  model: Model<any>,
  middlewares: Array<RequestHandler>
) => {
  router.put(
    route + "/:id",
    middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const data = req.body;
      const item = await model.findOne({ _id: id });
      if (!item) {
        res.status(404).json({ error: "Not fould" });
        return;
      }
      item.set(data);
      await item.save();
      res.json(renameId([item])[0]);
    }
  );
};

/*
 Delete a resource
 */
const delete_ = (
  router: Router,
  route: string,
  model: Model<any>,
  middlewares: Array<RequestHandler>
) => {
  router.delete(
    route + "/:id",
    middlewares,
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      await model.deleteOne({ _id: id });
      res.json({ id });
    }
  );
};

const ACTION_TO_FUNC = {
  [GET_LIST]: getList,
  [GET_ONE]: getOne,
  [CREATE]: create,
  [UPDATE]: update,
  [DELETE]: delete_
};

type restProps = {
  router: Router;
  route?: string;
  model: Model<any>;
  actions?: Array<string>;
  middlewares?: Array<RequestHandler>;
};

/*
 Add routes to router
 */
const rest = ({
  router,
  route = "",
  model,
  actions = Object.keys(ACTION_TO_FUNC),
  middlewares = []
}: restProps) => {
  actions.forEach(action => {
    ACTION_TO_FUNC[action](router, route, model, middlewares);
  });
  return router;
};

export default rest;
