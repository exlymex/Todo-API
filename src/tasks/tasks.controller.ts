import {Task} from "./tasks.entity";
import {AppDataSource} from "../../index";
import {instanceToPlain, plainToInstance} from "class-transformer";
import {Request, Response} from "express";
import {validationResult} from "express-validator";
import {UpdateResult} from "typeorm";

class TasksController {
    public async getAll(
        req: Request,
        res: Response
    ): Promise<Response> {
        let allTasks: Task[];
        try {
            allTasks = await AppDataSource.getRepository(Task).find({
                order: {
                    date: "ASC"
                }
            });
            allTasks = instanceToPlain(allTasks) as Task[];

            return res.json(allTasks).status(200)
        } catch (_error) {
            return res
                .json({error: 'Internal Server Error'})
                .status(500)
        }

    }

    public async create(
        req: Request,
        res: Response,
    ): Promise<Response> {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res
                .status(400)
                .json(error)
        }

        const newTask = new Task();

        newTask.title = req.body.title;
        newTask.date = req.body.date;
        newTask.status = req.body.status;
        newTask.description = req.body.description;
        newTask.priority = req.body.priority;

        let createdTask: Task;
        try {
            createdTask = await AppDataSource.getRepository(Task).save(newTask)
            createdTask = instanceToPlain(createdTask) as Task;
            return res.json(createdTask).status(201)
        } catch (e) {
            return res
                .status(500)
                .json("Internal Server Error")
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res
                .status(400)
                .json(error)
        }

        let task: Task | null;

        try {
            task = await AppDataSource.getRepository(Task).findOne({where: {id: req.body.id}})
        } catch (e) {
            return res.status(500).json({error: "Internal Server Error"})
        }
        if (!task) {
            return res.status(404).json({error: "The task with giver ID not exist"})
        }

        let updatedTask:UpdateResult;
        try{
            updatedTask = await AppDataSource.getRepository(Task).update(req.body.id,plainToInstance(Task,{status:req.body.status}))
            updatedTask = instanceToPlain(updatedTask) as UpdateResult

            return res.json(updatedTask).status(200)
        }catch (e){
            return res.status(500).json({error: "Internal Server Error"})

        }

    }
}

export const taskController = new TasksController()