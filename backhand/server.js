import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import bodyParser from 'body-parser';
import dotenv from "dotenv";

dotenv.config({
    path: './env'
})
const PORT = process.env.PORT || 5000;
const DATA_FILE = './data.json';
const app = express();
app.use(cors());
app.use(bodyParser.json());


// Read data from JSON file
const getTasks = async () => {
    try {
        return await fs.readJson(DATA_FILE);
    } catch (error) {
        return [];
    }
}

const saveTasks = async (tasks) => {
    try {
       return await fs.writeJson(DATA_FILE,tasks) 
    } catch (error) {
        
        console.log(error)
    }
}

app.get('/tasks', async (req,res)=>{
    try {
        const tasks = await getTasks();
        res.json(tasks);
    } catch (error) {
        console.log(error)
    }
})

app.post('/tasks', async (req,res)=>{
    try {
        const tasks = await getTasks();
        const newTask = {id:Date.now(),...req.body};
        tasks.push(newTask);
        await saveTasks(tasks);
        res.status(201).json(newTask);
    } catch (error) {
        console.log(error)
    }
})

app.put('/tasks/:id', async (req,res)=>{
    try {
        const tasks = await getTasks();
        const taskIndex = tasks.findIndex((t)=>t.id == parseInt(req.params.id));
        if (taskIndex === -1) {
            return res.status(404).json({error:'Task not found'});
        }
    
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        await saveTasks(tasks);
        res.json(tasks[taskIndex]);
    } catch (error) {
        console.log(error)   
    }
})

app.delete('/tasks/:id', async (req,res)=>{
    try {
        let tasks = await getTasks();
        tasks = tasks.filter((t)=>t.id != parseInt(req.params.id));
        await saveTasks(tasks);
        res.json({ message: "Task deleted" });
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));