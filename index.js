import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect("mongodb+srv://simran:simran@cluster0.alfad2u.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
    });


const userSchema = new mongoose.Schema({
    //attributes of schema ki schema ke andar kya kya rhega
    name: String,
    email: String,
    password: String
})
const User = new mongoose.model("User", userSchema)

// Routes
app.post("/login", (req, res) => {
    const { email, password } = req.body
    User.findOne({ email: email })
    .then(user => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successfully", user: user })
            }
            else {
                res.send({ message: "Password did not match" })
            }
        } else {
            res.send({ message: "User not registered" })
        }
    })
});


app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email: email })
        .then(existingUser => {
            if (existingUser) {
                res.send({ message: "User already registered" });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                newUser.save()
                    .then(() => {
                        res.send({ message: "Successfully registered" });
                    })
                    .catch(saveError => {
                        res.status(500).send({ message: "Error saving user", error: saveError });
                    });
            }
        })
        .catch(findError => {
            res.status(500).send({ message: "Error finding user", error: findError });
        });
});


app.listen(8000, () => {
    console.log("Port started on 8000");
});
