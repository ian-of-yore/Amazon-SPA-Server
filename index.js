const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('ema john server running');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mmmt3qa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db("emaJohn");
        const productsCollection = database.collection("products");

        app.get('/products', async (req, res) => {
            const currentPage = parseInt(req.query.currentPage);
            const perPageDocument = parseInt(req.query.perPageDocument);

            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(currentPage * perPageDocument).limit(perPageDocument).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count, products });
        })

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id));
            const query = { _id: { $in: objectIds } };
            const cursor = productsCollection.find(query);
            const productsByIds = await cursor.toArray();
            res.send(productsByIds);
        })
    }
    finally {

    }
}

run().catch((error) => console.error(error));



app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
