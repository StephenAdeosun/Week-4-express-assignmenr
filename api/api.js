const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 7000;

const dataFolderPath = path.join(__dirname, 'db');
const itemsFilePath = path.join(dataFolderPath, 'items.json');

app.use(express.json());

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Helper function to read and parse JSON data from file
async function readDataFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write JSON data to file
async function writeDataFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null , 2), 'utf8');
}

// Create item
app.post('/items', async (req, res) => {
  try {
    const items = await readDataFile(itemsFilePath);
    const newItem = {
     
      name: req.body.name,
      price: req.body.price,
      size: req.body.size,
      id: items.length + 1,
      program: req.body.program
    };
    items.push(newItem);
    await writeDataFile(itemsFilePath, items);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.get('/items', async (req, res) => {
    try {
      const items = await readDataFile(itemsFilePath);
      const program = req.query.program;
  
      if (program) {
        const filteredItems = items.filter(item => item.program === program);
        res.json(filteredItems);
      } else {
        res.json(items);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  });


// Get one item
app.get('/items/:id', async (req, res) => {
  try {
    const items = await readDataFile(itemsFilePath);
    const id = parseInt(req.params.id);
    const item = items.find((item) => item.id === id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Update item
app.put('/items/:id', async (req, res) => {
  try {
    const items = await readDataFile(itemsFilePath);
    const id = parseInt(req.params.id);
    const updatedItem = {
      id,
      name: req.body.name,
      price: req.body.price,
      size: req.body.size,
      program: req.body.program, 
    };
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = updatedItem;
      await writeDataFile(itemsFilePath, items);
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
app.delete('/items/:id', async (req, res) => {
  try {
    const items = await readDataFile(itemsFilePath);
    const id = parseInt(req.params.id);
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      await writeDataFile(itemsFilePath, items);
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
