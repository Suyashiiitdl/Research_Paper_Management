const Customer = require('../models/Customer')
const mongoose = require('mongoose')
const collection = require("../config/userdb");


/**
 * GET
 *  Customer Routes
 */

exports.homepage = async (req,res) =>{
    // const messages = await req.consumeFlash('info')
    const locals = {
        title: 'Nodejs',
        description: 'Free Nodejs User Management system'
    }
    const data = req.session.data;
    console.log(data.name)
    console.log("Checking the user");
    const check = await collection.findOne({ name: data.name });
    const userID= check._id // Assign the user's ID as the authorID
    if (!check) {
      return res.send("User name is not Registered");
    }





    let perPage=10
    let page = req.query.page || 1
    try{
        // const customers = await Customer.find({}).limit(22)
        // res.render('index',{locals, customers})

        // const customers= await Customer.aggregate([{$sort: {updatedAt: -1}}])
        //     .skip(perPage*page-perPage)
        //     .limit(perPage)
        //     .exec()
        const customers= await Customer.aggregate([{ $match: { userID: userID } },{$sort: { Title: 1 } }])
          .skip((perPage * page) - perPage)
          .limit(perPage)
          .exec();
        const count = await Customer.countDocuments({ userID: userID })

        res.render('dashboard',{
            locals,
            customers,
            data,
            current: page,
            pages: Math.ceil(count/perPage)
        })
    }
    catch(error){
        console.log(error)
    }

}



// exports.homepage = async (req,res) =>{
//     // const messages = await req.consumeFlash('info')
//     const locals = {
//         title: 'Nodejs',
//         description: 'Free Nodejs User Management system'
//     }
//     try{
//         const customers = await Customer.find({}).limit(22)
//         res.render('index',{locals, customers})
//     }
//     catch(error){
//         console.log(error)
//     }

// }


/**
 *  GET
 * New paper form
 */

exports.addCustomer = async (req,res) =>{
    const locals = {
        title: `sdfg`,
        description: 'Free Nodejs User Management system'
    }
    const data=req.session.data
    const username = req.query.username;
      
    
    
    // const data = req.session.userData;
    res.render('customer/add', {layout: 'layouts/other',locals ,username,data})
}


/**
 *  Post
 * Create new paper
 */


exports.signup = async (req, res) => {
  const data = {
      name: req.body.username,
      password: req.body.password
  }

  try {
      // Check if the user already exists
      const existingUser = await collection.findOne({ name: data.name });

      if (existingUser) {
          // User already exists, send an alert
          const alertMessage = "Username already exists. Please choose a different username.";
          const script = `<script>alert("${alertMessage}"); window.location.href = "/signup";</script>`;
          return res.send(script);
      }

      // User doesn't exist, sign up
      const userdata = await collection.insertMany(data);

      // Signup was successful, send a success message
      const successMessage = "Signup successful. You can now login with your username.";
      const script = `<script>alert("${successMessage}"); window.location.href = "/";</script>`;
      res.send(script);
  } catch (error) {
      // Error occurred during signup
      console.error("Error during signup:", error);
      const errorMessage = "An error occurred during signup. Please try again later.";
      const script = `<script>alert("${errorMessage}"); window.location.href = "/signup";</script>`;
      res.send(script);
  }
};
exports.view = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    const data = req.session.data
  //   AuthorsName=customer.Authors[]
    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("customer/view",{ layout: 'layouts/other',
      locals,
      customer,
      data
    });
  } catch (error) {
    console.log(error);
  }
};


exports.login = async (req, res) => {
  try {
    console.log("Checking the user");
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      return res.send("User name is not Registered");
    }

    //for exporting userId
    const fs = require('fs');
    fs.writeFileSync('username.json', JSON.stringify(check), 'utf8');
        
    const userID= check._id // Assign the user's ID as the authorID

    const data = {
      name: req.body.username,
      password: req.body.password
    };
    req.session.data = data;
    const locals = {
      title: 'Nodejs',
      description: 'Free Nodejs User Management system'
    };

    // Pagination variables
    let perPage = 3; // Number of items per page
    let page = req.query.page || 1; // Current page number

    // // Fetch all customers from the database
    // const customers = await Customer.find({userID: userID})
    //   .skip((perPage * page) - perPage)
    //   .limit(perPage)
    //   .exec();

      const customers= await Customer.aggregate([{ $match: { userID: userID } },{$sort: { Title: 1 }  }])
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec();
    const count = await Customer.countDocuments({ userID: userID })

    if (req.body.password === check.password) {
      res.render('dashboard',{
        data,
        customers,
        locals,
        current: page,
        pages: Math.ceil(count/perPage)

      })
    } else {
      return res.send("Wrong password");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.send("An error occurred. Please try again.");
  }
};






/**
 *  GET
 * Data
 */
// exports.view = async (req, res) => {
//     try {
//       const customer = await Customer.findOne({ _id: req.params.id });
  
//       const locals = {
//         title: "View Customer Data",
//         description: "Free NodeJs User Management System",
//       };
  
//       res.render("customer/view", {
//         locals,
//         customer,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

exports.delete = async (req, res) => {
  try {
    await Customer.findByIdAndDelete({ _id: req.params.id });
    const locals = {
      title: 'Nodejs',
      description: 'Free Nodejs User Management system'
    };
    const data = req.session.data
    console.log(req.body.usernamee)
    const check = await collection.findOne({ name: data.name });
    const userID= check._id // Assign the user's ID as the authorID

    // Pagination variables
    let perPage = 10; // Number of items per page
    let page = req.query.page || 1; // Current page number

    // Fetch all customers from the database
    const customers= await Customer.aggregate([{ $match: { userID: userID } },{$sort: { Title: 1 }  }])
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec();
    const count = await Customer.countDocuments({ userID: userID })
    res.render('dashboard', { customers, locals,data, current: page, pages: Math.ceil(count / perPage)});
    
  } catch (error) {
    console.log(error);
  }
};

// * GET /
//  * Edit Customer Data
//  */
exports.edit = async (req, res) => {
    try {
      const customer = await Customer.findOne({ _id: req.params.id });
      const data = req.session.data
      const locals = {
        title: "Edit Customer Data",
        description: "Free NodeJs User Management System",
      };
  
      res.render("customer/edit", {layout: 'layouts/other', 
        locals,
        customer,
        data
      });
    } catch (error) {
      console.log(error);
    }
  };



// * GET /
//  * Search Customer Data
//  */
exports.searchCustomers = async(req, res) =>{
  try{
    let searchTerm= req.body.searchTerm
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"")
    const data = req.session.data
    console.log(req.body.usernamee)
    const check = await collection.findOne({ name: data.name });
    const userID= check._id // Assign the user's ID as the authorID
    if (!check) {
      return res.send("User name is not Registered");
    }
    // Fetch all customers from the database

    const usernamee = req.body.usernamee;

    const customers = await Customer.find({
      userID:userID,
      $or: [
        {Title: {$regex: new RegExp(searchNoSpecialChar, "i")}},
      ]
    })
    res.render("search",{
      customers,
      usernamee: usernamee,
      data
    })
  }
  catch(error){
    console.log(error)
  }
}




exports.login1 = async (req, res) => {
  res.render('index',{ layout: 'layouts/login' });
}
exports.signup1 = async (req, res) => {
  res.render('signup',{ layout: 'layouts/login' });
}