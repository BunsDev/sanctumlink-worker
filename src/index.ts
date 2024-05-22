import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { createCors } from 'itty-router'

import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { ConfirmationCode } from "endpoints/ConfirmationCode";

export const router = OpenAPIRouter({
	docs_url: "/",
});
const { preflight, corsify } = createCors();

// embed preflight upstream to handle all OPTIONS requests
router.all('*', preflight)

router.get("/api/v1/tasks/", TaskList);
router.post("/api/v1/tasks/", TaskCreate);
router.get("/api/v1/tasks/:taskSlug/", TaskFetch);
router.delete("/api/v1/tasks/:taskSlug/", TaskDelete);

router.post("/api/v1/confirmation", ConfirmationCode);


// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: "Route not found",
		},
		{ status: 404 }
	)
);

export default {
	fetch: async (request, env, ctx) => {
		return router.handle(request, env, ctx).then(corsify)
	 },
};
