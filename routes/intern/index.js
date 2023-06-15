const express = require('express');
const UserModel = require('../../database/models/user');
// const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const InternModel = require('../../database/models/interns');
const CompanyModel = require('../../database/models/company');
const Router = express.Router();

const JWT_SECRET = 'sudhir$%%Agrawal'

/* 
Route     /allinterns
descrip   get all interns
params    none
access    public
method    get
*/

Router.get("/allinterns", async (req, res) => {
  try {

    const interns = await InternModel.find();

    return res.status(200).json(interns);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/* 
Route     /get one intern
descrip   particular intern
params    id
access    public
method    get
*/

Router.get("/getintern/:id", async (req, res) => {
  try {

    const intern = await InternModel.findById(req.params.id);
    return res.status(200).json(intern);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/* 
Route     /searchinterns
descrip   get all interns
params    none
access    public
method    get
*/

Router.get("/searchinterns", async (req, res) => {
  try {

    const interns = await InternModel.find();
    return res.status(200).json({ interns });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})


/* 
Route     /getapplicants
descrip   get all applicants for an intern
params    intern id
access    public
method    get
*/

// Router.get("/getapplicants/:internID", async (req, res) => {
//   try {
//     const interns = await InternModel.findById(req.params.internID);
//     const response = await interns.users.map( async(user, i)=>{
//       const res = await UserModel.findById(user.id); 
//       return res;
//     })
//     console.log(await response);
//     return res.status(200).json(response);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });
Router.get("/getapplicants/:internID", async (req, res) => {
  try {
    const interns = await InternModel.findById(req.params.internID);
    Promise.all(interns.usersApplied.map(async (user, i) => {
      const res = await UserModel.findById(user);
      return res;
    })).then((response) => {
      return res.status(200).json(response);
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

Router.get("/useraccepted/:internId", async (req, res) => {
  try {

    const intern = await InternModel.findById(req.params.internId);
    Promise.all(intern.usersAccepted.map(async (user, i) => {
      const res = await UserModel.findById(user);
      return res;
    })).then((response) => {
      return res.status(200).json(response);
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

Router.get("/userrejected/:internId", async (req, res) => {
  try {

    const intern = await InternModel.findById(req.params.internId);
    Promise.all(intern.usersRejected.map(async (user, i) => {
      const res = await UserModel.findById(user);
      return res;
    })).then((response) => {
      return res.status(200).json(response);
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

Router.get("/useronboarded/:internId", async (req, res) => {
  try {

    const intern = await InternModel.findById(req.params.internId);
    Promise.all(intern.userOnBoarded.map(async (user, i) => {
      const res = await UserModel.findById(user);
      return res;
    })).then((response) => {
      return res.status(200).json(response);
    })
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})
/* 
Route     /rejectapplicant
descrip   reject an applicant for the intern
params    intern id
access    public
method    post
*/

Router.put("/rejectapplicant/:internID", async (req, res) => {
  try {
    let interns = await InternModel.findById(req.params.internID);
    interns.usersRejected.map((user)=>{
      if(user===req.body.credentials){
        return res.status(401).json({error: 'You have already rejected the candidate'});
      }
    })
    interns = await InternModel.findByIdAndUpdate(
      req.params.internID,
      {
        $push:{
          usersRejected: req.body.credentials
        }
      }, {
      new: true
    });
    let user = await UserModel.findById(req.body.credentials);
    // const internApplied = user?.internsApplied?.filter((data) => {
    //   return data.id !== req.params.internID
    // })
    user = await UserModel.findByIdAndUpdate(
      req.body.credentials,
      {
        $push:{
          rejectedIn:req.params.internID
        }
      }, {
      new: true
    });
    return res.status(200).json(interns);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/* 
Route     /acceptapplicant
descrip   accept an applicant for the intern
params    intern id
access    public
method    post
*/

Router.put("/acceptapplicant/:internID", async (req, res) => {
  try {
    let interns = await InternModel.findById(req.params.internID);
    interns.usersAccepted.map((user)=>{
      if(user===req.body.credentials){
        return res.status(401).json({error: 'You have already accepted the candidate'});
      }
    })
    const userAccepted = interns.usersApplied?.filter((user, i) => {
      return user === req.body.credentials
    });
    interns = await InternModel.findByIdAndUpdate(
      req.params.internID,
      {
        $push: {
          usersAccepted: userAccepted
        },
      }, {
      new: true
    });
    let user = await UserModel.findById(req.body.credentials)
    user = await UserModel.findByIdAndUpdate(
      req.body.credentials,
      {
        $push: {
          offers: req.params.internID
        },
      }, {
      new: true
    });
    return res.status(200).json({ interns, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


/*
Route     /bycategory/:category
descrip   searching intern by category
params    none
access    public
method    post
*/

Router.get("/bycategory/:category", async (req, res) => {
  try {

    const interns = await InternModel.find({category: req.params.category});
    return res.status(200).json(interns);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/*
Route     /byindustry/:industry
descrip   searching intern by category
params    none
access    public
method    post
*/

Router.get("/byindustry/:industry", async (req, res) => {
  try {

    const interns = await InternModel.find({industry: req.params.industry});
    return res.status(200).json(interns);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

/*
Route     /search/:keyword
descrip   searching intern by keywords
params    none
access    public
method    post
*/

Router.get("/search/:keyword", async (req, res) => {
  try {

    console.log(req.params.keyword);
    const interns = await InternModel.find({});
    const result = interns.filter((intern)=>{
      return intern.title.includes(req.params.keyword) || intern.description.includes(req.params.keyword)
    })
    // console.log(result);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})



module.exports = Router;