class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(task) {
        this.heap.push(task);
        this.heapifyUp();
    }

    extractMin() {
        if (this.heap.length === 1) return this.heap.pop();
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return min;
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else break;
        }
    }

    heapifyDown() {
        let index = 0;
        while (true) {
            let leftChild = 2 * index + 1;
            let rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < this.heap.length && this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
                smallest = leftChild;
            }
            if (rightChild < this.heap.length && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
                smallest = rightChild;
            }

            if (smallest !== index) {
                [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
                index = smallest;
            } else break;
        }
    }

    compare(taskA, taskB) {
        const priorityLevels = { high: 1, medium: 2, low: 3 };
        if (priorityLevels[taskA.priority] !== priorityLevels[taskB.priority]) {
            return priorityLevels[taskA.priority] - priorityLevels[taskB.priority];
        }
        return new Date(taskA.createdAt) - new Date(taskB.createdAt);
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    size() {
        return this.heap.length;
    }

    getTasks() {
        return [...this.heap]; // Return sorted tasks
    }
}

module.exports = MinHeap;
