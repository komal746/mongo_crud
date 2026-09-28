import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGO_URL = "mongodb+srv://tukadiyakomal7_db_user:coBcqOp9NKmUGyva@cluster0.oxbzwvx.mongodb.net/mcaz2";

const app = express();

app.use(express.json());
const PORT = 3000;

if (!MONGO_URL) {
    console.error("it is not define");
    process.exit(1);
}

mongoose.connect(MONGO_URL);

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number
});

const Product = mongoose.model("Product", productSchema);


app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ message: "get all products", data: products })
    } catch (error) {
        res.status(500).json({ message: "error", error });
    }
});

app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "product created", data: product });
    } catch (error) {
        res.status(400).json({ message: "error creating", error });

    }

});

app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
        if (!product) {
            return res.status(400).json({ message: "product not found" })
        }
        res.status(200).json({ message: "update product", data: product })
    } catch (error) {
        res.status(400).json({ message: "error updating product", error });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "product deleted", id: req.params.id })
    } catch (error) {
        res.status(400).json({ message: "error deleting product", error });
    }


});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

