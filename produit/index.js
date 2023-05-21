const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4000;
const mongoose = require("mongoose");
const Produit = require("./Produit");
app.use(express.json());
mongoose.set('strictQuery', true);
mongoose.connect(
    "mongodb://localhost/produit-service",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log(`Produit-Service DB Connected`);
    }
);
app.post("/produit/ajouter", (req, res, next) => {
    const { nom, description, prix } = req.body;
    const newProduit = new Produit({
        nom,
        description,
        prix
    });
    newProduit.save()
        .then(produit => res.status(201).json(produit))
        .catch(error => res.status(400).json({ error }));
});
app.get("/produits", async(req, res, next) => {
    try{
        const resultats=await Produit.find()
        res.json(resultats)
    }
    catch{
        res.status(500).json({message:error.message});
        }
});
app.post("/produit/acheter", (req, res, next) => {
    const { ids } = req.body;
    Produit.find({ _id: { $in: ids } })
        .then(produits => res.status(201).json(produits))
        .catch(error => res.status(400).json({ error }));
});
app.delete("/produit/:id", async (req, res, next) => {
    try {
        const id =(req.params.id);
        const produit = await Produit.findById({ _id: id });
        if (!produit) {
            res.status(404).json({ message: 'produit non trouvé' })
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    await Produit.remove();
    res.status(200).json({ massage: "suppression un produit" })
});


app.put("/produit/:id", async (req, res, next) => {
    try{
        const myid=(req.params.id);
        const produit=await Produit.findById(myid);
        if(!produit){
            res.status(404).json({message:'produit non trouvé'})
            return;
        }
        produit.nom=req.body.nom||produit.nom
        produit.description=req.body.description||produit.description
        produit.prix=req.body.prix||produit.prix
        await produit.save();
        res.status(200).json(produit)
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
});
app.listen(PORT, () => {
    console.log(`Product-Service at ${PORT}`);
});

