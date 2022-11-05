const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());


app.get('/', (req, res) =>{
    res.send('ema john server running');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mmmt3qa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const database = client.db("emaJohn");
        const productsCollection = database.collection("products");

        app.get('/products', async(req, res) =>{
            const currentPage = req.query.currentPage;
            const perPageDocument = req.query.perPageDocument;
            console.log(currentPage, perPageDocument);
            
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({count, products});
        })
    }
    finally{

    }
}

run().catch( (error) => console.error(error));



app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
