const express = require('express');
const app = express();
const port = 3000;
const {connectToDb, getDb} = require('./db')
require('dotenv').config();

app.use(express.json());

let db 

connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
    db = getDb();
  }
  
})


app.post('/update', async (req, res) => {
  try {
    const collection = db.collection('count');
    const document = await collection.findOne();
    let totalCount = document.totalCount;

    totalCount++
    await collection.updateOne(
      {},
      {$set: {totalCount}}
    );
    
    console.log('New totalCount is:', totalCount);
    res.send(JSON.stringify(totalCount));

  } catch (error) {
    console.error(error);
    // Respond with an error status and message
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating totalCount',
      error: error.message
    });
  }
});



app.get('/', async (req, res) => {
  const collection = db.collection('count');
  const document = await collection.findOne();

  res.send(JSON.stringify(document));
});


