const express = require ("express");
const app = express();

const dotenv = require ('dotenv')
dotenv.config();

const mongoose = require("mongoose");

const TodoTask = require('./models/TodoTask')

const PORT = process.env.PORT || 3600;

////it is expree inbuilt middlewere 
app.use("/static", express.static("./public"))

app.use(express.urlencoded({ extended: true }));

// mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true }, () => {
console.log("Connected to db!");
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

})


////view engine configuration
app.set("view engine", "ejs")

//git method
app.get("/", (req, res) => {
   TodoTask.find({}, (err, tasks) => {
  res.render('todo.ejs', {todoTask: tasks})  
})
})

//post method
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    })
    try{
        await todoTask.save()
        res.redirect('/')

    }catch (err) {
        res.redirect("/")
    }
     
    });

//UPDATE

app

.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTask: tasks, idTask: id });
});
})

.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });





