// create a reference to the model

let CarModel = require('../models/car');

// Gets all cars from the Database and renders the page to list them all.
module.exports.carList = function(req, res, next) {  
    CarModel.find((err, carsList) => {
        //console.log(carList);
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('cars/list', {
                title: 'Cars List', 
                CarsList: carsList,
                userName: req.user ? req.user.username : ''
            })            
        }
    });
}


// Gets a car by id and renders the details page.
module.exports.details = (req, res, next) => {
    
    let id = req.params.id;

    CarModel.findById(id, (err, carToShow) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('cars/details', {
                title: 'Car Details', 
                car: carToShow
            })
        }
    });
}

// Renders the Add form using the add_edit.ejs template
module.exports.displayAddPage = (req, res, next) => {
     
    let car =   {
        make: '',
        model: '',
        year: '',
        kilometers: '',
        doors: '',
        seats: '',
        color: '',
        price: '',
        _id : ''   
    }
    //show the edit view
    res.render('cars/add_edit', {
        title: 'Car Details', 
        car: car

    })
}

// Processes the data submitted from the Add form to create a new car
module.exports.processAddPage = async (req, res, next) => {
    
    // insert data in database
    const post = new CarModel({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        kilometers: req.body.kilometers,
        doors: req.body.doors,
        seats: req.body.seats,
        color: req.body.color,
        price: req.body.price,
    })
    await post.save()
    res.redirect('/cars/list')
}
// Gets a car by id and renders the Edit form using the add_edit.ejs template
module.exports.displayEditPage = (req, res, next) => {
    
    let id = req.params.id;
    CarModel.findById(id, (err, carToShow) => {
           if(err)
           {
               console.log(err);
               res.end(err);
           }
           else
           {
               //show the edit view
               res.render('cars/add_edit', {
                   title: 'Car Details', 
                   car: carToShow
               })
           }
       });     

}

// Processes the data submitted from the Edit form to update a car
module.exports.processEditPage = async (req, res, next) => {
    
    try {
        // find car by id
		const post = await CarModel.findOne({ _id: req.params.id })
        // update data in database
        post.make= req.body.make
        post.model= req.body.model
        post.year= req.body.year
        post.kilometers= req.body.kilometers
        post.doors= req.body.doors
        post.seats= req.body.seats
        post.color= req.body.color
        post.price= req.body.price
        
		await post.save()
		res.redirect('/cars/list')
	} catch {
		res.status(404)
		res.send({ error: "Car doesn't exist!" })
	}
    
}

// Deletes a car based on its id.
module.exports.performDelete = async (req, res, next) => {
    
    try {
		await CarModel.deleteOne({ _id: req.params.id })
		res.redirect('/cars/list')
	} catch {
		res.status(404)
		res.send({ error: "Car doesn't exist!" })
	}

}