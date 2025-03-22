const Task = require("../models/task");
const cache = require("../utils/cache");
const MinHeap = require("../utils/priorityQueue");

exports.createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, user: req.user.id });
        await task.save();

        // Invalidate cache after creating a new task
        cache.clearCache();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: "Task creation failed" });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const { priority, status, page = 1, limit = 10 } = req.query;
        const cacheKey = `tasks_${priority}_${status}_${page}_${limit}`;

        let tasks = await cache.getCache(cacheKey);
        if (tasks) {
            console.log("Serving tasks from cache");
            return res.json(JSON.parse(tasks));
        }

        const query = { user: req.user.id };
        if (priority) query.priority = priority;
        if (status) query.status = status;

        const fetchedTasks = await Task.find(query).limit(50); // Fetch a batch of tasks
        const minHeap = new MinHeap();

        fetchedTasks.forEach((task) => minHeap.insert(task)); // Insert into priority queue

        tasks = minHeap.getTasks().slice((page - 1) * limit, page * limit); // Paginate sorted tasks

        await cache.setCache(cacheKey, JSON.stringify(tasks), 60); // Cache for 1 min
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving tasks" });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) return res.status(404).json({ error: "Task not found" });

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;

        await task.save();

        // Invalidate cache
        cache.clearCache();

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Task update failed" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) return res.status(404).json({ error: "Task not found" });

        await task.deleteOne();

        // Invalidate cache
        cache.clearCache();

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Task deletion failed" });
    }
};

