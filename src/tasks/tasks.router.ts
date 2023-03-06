import {Router} from "express";
import {taskController} from "./tasks.controller";
import {createValidator, updateValidator} from "./task.validator";

export const tasksRouter: Router = Router()

tasksRouter.get('/tasks', taskController.getAll)

tasksRouter.post('/tasks', createValidator, taskController.create)

tasksRouter.put('/tasks',updateValidator,taskController.update)