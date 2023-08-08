const express = require('express');
const UserModel = require('../../database/models/user');
// const passport = require('passport');
const bcrypt = require('bcryptjs');
const ResumeModel = require('../../database/models/userResume');
const InternModel = require('../../database/models/interns');
const Router = express.Router();
const jwt = require("jsonwebtoken");

/* 
Route     /allusers
descrip   getting all users
params    none
access    public
method    get
*/

Router.get("/allusers", async (req, res) => {
  try {
    const user = await UserModel.find({});
    if (!user) {
      return res.status(400).json({ error: 'No User' });
    }
    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/* 
Route     /getuser
descrip   getting user details with user id
params    none
access    public
method    get
*/

Router.get("/getuser", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    const user = await UserModel.findById(data.User.id);
    if (!user) {
      return res.status(500).json({ error: 'User does not exists' });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

Router.get("/getuserbyid/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(500).json({ error: 'User does not exists' });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/* 
Route     /edituser
descrip   editing user details with user id
params    none
access    public
method    put
*/

Router.put("/edituser", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    let user = await UserModel.findById(data.User.id);
    if (!user) {
      return res.status(500).json({ error: 'User does not exists' });
    }
    user = await UserModel.findByIdAndUpdate(data.User.id, {
      $set: req.body.credentials
    })
    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/* 
Route     /jobapply/:internId
descrip   applying for job
params    user id, intern id
access    public
method    post
*/

Router.post("/jobapply/:internId", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");

    let intern = await InternModel.findById(req.params.internId)
    let ifAlreadyExists = false;
    intern.usersApplied?.map((user) => {
      if (user._id === data.User.id) {
        ifAlreadyExists = true;
      }
    })
    if (ifAlreadyExists) {
      return res.status(400).json({ error: "You have already applied for this." })
    }
    //finding resume id
    let resume = await ResumeModel.find({ user: data.User.id });
    resume = resume.filter((data) => {
      return data.resumeTitle == req.body.credentials.resume
    })
    if (resume.length === 0) {
      return res.status(500).json({ error: "resume not selected" });
    }
    // pushing intern in intern model
    intern = await InternModel.findOneAndUpdate({
      _id: req.params.internId
    }, {
      $push: { usersApplied: { user: data.User.id } }
    }, {
      new: true
    });

    // intern.usersApplied.push({ user: data.User.id });

    const user = await UserModel.findOneAndUpdate({
      _id: data.User.id
    }, {
      $push: {
        internsApplied: [{
          id: req.params.internId,
          date: new Date(),
          resume: resume[0]._id.toString(),
          question: req.body.credentials.question
        }]
      }
    }, {
      new: true
    });
    return res.status(200).send("You have successfully applied for the opportunity");

  } catch (error) {
    return res.status(500).json({ error: error.message } || { error: "Some error occured while applying for the intern" });
  }
});

/* 
Route     /getmyjobs/:userId
descrip   getting my jobs
params    user id
access    public
method    get
*/

Router.get("/getappliedjobs", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    const user = await UserModel.findById(data.User.id);
    const interns = user.internsApplied
    Promise.all(interns.map(async (intern) => {
      const res = await InternModel.findById(intern.id);
      return res;
    })).then((response) => {
      return res.status(200).json({ response, user });
    })
  } catch (error) {
    return res.status(500).send(error);
  }
});

/* 
Route     /deleteappliedjob
descrip   deleting my job
params    user id
access    public
method    delete
*/

Router.delete("/deleteappliedjob/:internId", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    let user = await UserModel.findById(data.User.id);
    const interns = user.internsApplied.filter((intern) => {
      console.log(intern.id, req.params.internId);
      return intern.id !== req.params.internId
    })
    user = await UserModel.findOneAndUpdate({
      _id: data.User.id
    }, {
      $set: { internsApplied: interns },
    }, {
      new: true
    });
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).send("Some error occured while fetching your interns");
  }
});

/* 
Route     /acceptoffer/:userId
descrip   getting my offers
params    user id
access    public
method    get
*/

Router.put("/acceptoffer", async (req, res) => {
  try {
    console.log(1);
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    let user = await UserModel.findById(data.User.id);

    let applied = user.internsApplied.filter((intern) => {
      return intern.id !== req.body.credentials;
    });
    const offers = user.offers.filter((offer) => {
      return offer !== req.body.credentials
    });
    user = await UserModel.findOneAndUpdate({
      _id: data.User.id
    }, {
      $push: { currentProjects: req.body.credentials },
      $set: { offers: offers },
      $set: { internsApplied: applied },
    }, {
      new: true
    });
    console.log(user);
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).send(error.message || "Some error occured while fetching your offers");
  }
});

/* 
Route     /rejectoffer/:userId
descrip   getting my offers
params    user id
access    public
method    get
*/

Router.put("/rejectoffer", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    let user = await UserModel.findById(data.User.id)
    let applied = user.internsApplied.filter((intern) => {
      return intern._id.toString() !== req.body.credentials;
    })
    const offers = user.offers.filter((offer) => {
      return offer !== req.body.credentials
    })
    user = await UserModel.findOneAndUpdate({
      _id: data.User.id
    }, {
      $push: { currentProjects: req.body.credentials },
      $set: { offers: offers },
      $set: { internsApplied: applied },
    }, {
      new: true
    });
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).send(error.message || "Some error occured while fetching your offers");
  }
});

/* 
Route     /getoffers/:userId
descrip   getting my offers
params    user id
access    public
method    get
*/

Router.get("/getoffers", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    const user = await UserModel.findById(data.User.id);
    const offers = user.offers

    Promise.all(offers.map(async (offer) => {
      const res = await InternModel.findById(offer);
      return res;
    })).then((response) => {
      return res.status(200).json(response);
    })
  } catch (error) {
    return res.status(500).send(error.message || "Some error occured while fetching your offers");
  }
});
/* 
Route     /getrejectedin/:userId
descrip   getting my rejections
params    user id
access    public
method    get
*/

Router.get("/getrejectedin", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    const user = await UserModel.findById(data.User.id);
    const rejectedIn = user.rejectedIn

    Promise.all(rejectedIn.map(async (rej) => {
      const res = await InternModel.findById(rej);
      return res;
    })).then((response) => {
      return res.status(200).json(response);
    })
  } catch (error) {
    return res.status(500).send(error.message || "Some error occured while fetching your offers");
  }
});
/* 
Route     /getprojects/:userId
descrip   getting my jobs
params    user id
access    public
method    get
*/

Router.get("/getprojects", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    const user = await UserModel.findById(data.User.id);
    const projects = user.currentProjects

    Promise.all(projects.map(async (project) => {
      const res = await InternModel.findById(project.id);
      return res;
    })).then((response) => {
      return res.status(200).json(response);
    })
  } catch (error) {
    return res.status(500).send(error || "Some error occured while fetching your projects");
  }
});

/* 
Route     /savehours/:internId
descrip   saving the no. of hours user has worked
params    none
access    public
method    put
*/

Router.put("/savehours/:internId", async (req, res) => {
  try {
    const token = req.header('token');
    const data = jwt.verify(token, "sudhir$%%Agrawal");
    let user = await UserModel.findById(data.User.id);
    let day = user.hoursPerDay.filter((data) => {
      return data.projectId === req.params.internId && data.date === req.body.date
    })
    let days = user.hoursPerDay.filter((data) => {
      return data.projectId !== req.params.internId && data.date !== req.body.date
    })
    if (day.length !== 0) {
      if(day[0].value!==0 && day[0].approved===0){
        return res.status(400).send('Your request approval is pending');
      }
      if(day[0].value!==0 && day[0].approved===1){
        return res.status(400).send('Your request is already approved');
      }
      user = await UserModel.findByIdAndUpdate(data.User.id,
        {
          $set: {
            hoursPerDay: days
          }
        })
    }
    user = await UserModel.findByIdAndUpdate(data.User.id,
      {
        $push: {
          hoursPerDay: [{
            projectId: req.params.internId,
            date: req.body.date,
            value: req.body.hour,
          }]
        }
      })
    return res.status(200).json(user)

  } catch (error) {
    return res.status(500).send(error || "Some error occured while fetching your projects");
  }
});


module.exports = Router;