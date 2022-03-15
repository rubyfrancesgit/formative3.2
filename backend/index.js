const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const config = require('./config.json');
const Project = require('./models/project');
const User = require('./models/user');

const port = 5000;

app.use((req,res, next) => {
    console.log(`${req.method} request ${req.url}`);
    next();
});

app.use(bodyParser.json()); // calling bodyParser method
app.use(bodyParser.urlencoded({extended:false})); // preventing url from being parsed

app.use(cors()); // calling cors method with express

app.get('/', (req, res) => res.send('Hello! I am from the backend!'));

mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_DBNAME}?retryWrites=true&w=majority`, {useNewUrlParser: true})
    .then(() => console.log("DB connected"))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    });

app.listen(port, () => console.log(`My full stack application is listening on port ${port}`));

// Post a project to the database
app.post('/addProject', (req, res) => {
    const dbProject = new Project({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        image_url: req.body.image_url,
        description: req.body.description
    });

    // save to the database & notifu the user
    dbProject.save().then(result => {
        res.send(result);
    })
    .catch(err => res.send(err))
}); // end of post project

// Update project
app.patch('/updateProject/:id', (req,res) => {
    const idParam = req.params.id;
    Project.findById(idParam, (err, project) => {
        const updateProject = {
            name: req.body.name,
            image_url: req.body.image_url,
            description: req.body.description
        }
        Project.updateOne({_id:idParam}, updateProject)
        .then(result => {
            res.send(result);
        }).catch(err => res.send(err));
    })
}) // end of update project

// Delete project from db
app.delete('/deleteProject/:id', (req,res) => {
    const idParam = req.params.id;
    Project.findOne({_id:idParam}, (err, project) => {
        if(project){
            Project.deleteOne({_id:idParam}, err => {
                console.log('deleted on backend request');
            });
        } else {
            alert('not found');
        } // end of if statement
    }).catch(err => res.send(err));
}) // end of delete project from db

// register user
app.post('/registerUser', (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, userExists) => {
        if(userExists) {
            res.send('Username already taken. Please use a different username')
        } else {
            const hash = bcrypt.hashSync(req.body.password);
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                username: req.body.username,
                password: hash,
                email: req.body.email
            });
            user.save()
                .then(result => {
                    console.log(user, result);
                    res.send(result);
                }).catch(err => {
                    res.send(err);
                });
        } // end of if statement
    }); // end of find one
}); // end of register user

// Login user
app.post('/loginUser', (req, res) => {
    User.findOne({username: req.body.username}, (err, userResult) => {
        if(userResult) {
            if(bcrypt.compareSync(req.body.password, userResult.password)) {
                res.send(userResult);
            } else {
                res.send('not authorized');
            } // end of inner if statement
        } else {
            res.send('User not found. Please register');
        } // end of outer if statement
    }); // end of find one
}); // end of login