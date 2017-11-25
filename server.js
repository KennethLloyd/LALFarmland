var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var currentDate = year + '-' + month + '-' + day;

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'useruser',
	password: 'useruser',
	database: 'lalfarmland'
})

connection.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000,function() {
    console.log("Server is running")
});

app.get('/', function (req, res) {
    connection.query('call signOut()',function(err,rows,fields) {    
    });
    res.sendFile(path.join(__dirname + '/src/signin.html'));
});

app.get('/signIn/:data', function (req, res) {
   var credentials = JSON.parse(req.params.data);
   connection.query('select * from user where username = ? and password = ? and classification = ?',[credentials.username, credentials.password, credentials.classification],function(err,rows,fields) {
        if (!err) {
            if (rows.length != 0) {
                connection.query('call logIn(?)',[credentials.username],function(err,rows,fields) {
                    if (!err) {
                        console.log("Welcome back " + [credentials.username] + "!");
                        res.send("Welcome back " + [credentials.username] + "!");     
                    }
                    else {
                        res.send('Error');
                    }
                })
            }
            else {
                res.send('Error');
            }
        }
   })
});

app.get('/signUp', function (req, res) {
   res.sendFile(path.join(__dirname + '/src/signup.html'));
});
    
app.get('/submit/:jsonstring', function(req, res) {
    var credentials = JSON.parse(req.params.jsonstring);
    connection.query('insert into user set ?', credentials, function(err, rows, fields) {
        if (!err) {
            console.log("Credentials successfully inserted to database.");
            res.send("Welcome " + [credentials.username] + "!");      
        }
        else {
            console.log("An error has occured.");
            res.send('Error');
        }   
    })
});

app.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/home.html'));
});

app.get('/accessDenied', function(req,res) {
    res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
})

app.get('/addFarmer', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/addFarmer.html'));
        }
    });
});

app.get('/addFarmer/:farmer', function (req, res) {
    var farmerInfo = JSON.parse(req.params.farmer);
    console.log(farmerInfo);
    connection.query('insert into farmer set ?', farmerInfo, function(err, rows, fields) {
        if (!err) {
            console.log("Farmer successfully inserted to database.");
            connection.query('call setFarmerDateHired(?,?)', [farmerInfo.fname,farmerInfo.lname], function(err, rows, fields) {
                if (!err) {
                    res.send("Farmer successfully inserted to database.")      
                }
                else console.log("An error has occured.");   
            })      
        }
        else {
            console.log("An error has occured.");
            res.send('Error');
        }   
    })
});

app.get('/editFarmer', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/editFarmer.html'));
        }
    });
});

app.get('/editFarmer/:farmer', function (req, res) {
    var farmerInfo = JSON.parse(req.params.farmer);
    console.log(farmerInfo);
    if (farmerInfo.attribute === 'First Name') {
        connection.query('call setFarmerFname(?,?)', [farmerInfo.attributeVal, farmerInfo.farmernumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Farmer info successfully edited.");
                    res.send("Farmer info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else if (farmerInfo.attribute === 'Middle Initial') {
        connection.query('call setFarmerMinit(?,?)', [farmerInfo.attributeVal, farmerInfo.farmernumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Farmer info successfully edited.");
                    res.send("Farmer info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else if (farmerInfo.attribute === 'Last Name') {
        connection.query('call setFarmerLname(?,?)', [farmerInfo.attributeVal, farmerInfo.farmernumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Farmer info successfully edited.");
                    res.send("Farmer info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else if (farmerInfo.attribute === 'Age') {
        connection.query('call setFarmerAge(?,?)', [farmerInfo.attributeVal, farmerInfo.farmernumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Farmer info successfully edited.");
                    res.send("Farmer info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else {
        connection.query('call setFarmerContact(?,?)', [farmerInfo.attributeVal, farmerInfo.farmernumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Farmer info successfully edited.");
                    res.send("Farmer info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
});

app.get('/deleteFarmer', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/deleteFarmer.html'));
        }
    });
});

app.get('/deleteFarmer/:farmer', function (req, res) {
    var farmerInfo = JSON.parse(req.params.farmer);
    console.log(farmerInfo);
    connection.query('call removeFarmer(?)', [farmerInfo.farmernumber], function(err, rows, fields) {
        if (!err) {
            console.log("Farmer successfully deleted from database.");
            res.send('Farmer successfully deleted from database.');      
        }
        else {
            console.log("An error has occured.");
            res.send('Error');
        }   
    })
});

app.get('/addPlant', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/addPlant.html'));
        }
    });
});

app.get('/addPlant/:plant', function (req, res) {
    var plantInfo = JSON.parse(req.params.plant);
    var count;
    console.log(plantInfo);
    connection.query('select count(*) as count from farmer',function(err,rows,fields) {
        if (!err) {
            count = rows[0].count;
        }
    })
    connection.query('insert into plant set ?', plantInfo, function(err, rows, fields) {
        if (!err) {
            console.log("Plant successfully inserted to database.");
            connection.query('call setPlantDateAddedNow(?)', [plantInfo.plantname], function(err, rows, fields) {
                if (!err) {
                    console.log("Date successfully set to database.");
                    res.send("Plant successfully inserted to database.");      
                }
                else console.log("An error has occured.");   
            })   
        }
        else {
            console.log("An error has occured.");
            res.send('Error');
        }   
    })
});

app.get('/editPlant', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/editPlant.html'));
        }
    });
});

app.get('/editPlant/:plant', function (req, res) {
    var plantInfo = JSON.parse(req.params.plant);
    console.log(plantInfo);
    if (plantInfo.attribute === 'Plant Name') {
        connection.query('call setPlantName(?,?)', [plantInfo.attributeVal, plantInfo.plantname], function(err, rows, fields) {
                if (!err) {
                    console.log("Plant info successfully edited.");
                    res.send("Plant info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else if (plantInfo.attribute === 'Quantity') {
        connection.query('call setPlantQty(?,?)', [plantInfo.attributeVal, plantInfo.plantname], function(err, rows, fields) {
                if (!err) {
                    console.log("Plant info successfully edited.");
                    res.send("Plant info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else {
        connection.query('call setPlantDateAdded(?,?)', [plantInfo.attributeVal, plantInfo.plantname], function(err, rows, fields) {
                if (!err) {
                    console.log("Plant info successfully edited.");
                    res.send("Plant info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })   
    }
});

app.get('/deletePlant', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/deletePlant.html'));
        }
    });
});

app.get('/deletePlant/:plant', function (req, res) {
    var plantInfo = JSON.parse(req.params.plant);
    console.log(plantInfo);
    connection.query('call removePlant(?)', [plantInfo.plantname], function(err, rows, fields) {
        if (!err) {
            console.log("Plant successfully deleted from database.");
            res.send('Plant successfully deleted from database.');      
        }
        else {
            console.log("An error has occured.");
            res.send('Error');
        }   
    })
});

app.get('/addPlot', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/addPlot.html'));
        }
    });
});

app.get('/addPlot/:plot', function (req, res) {
    var plotInfo = JSON.parse(req.params.plot);
    console.log(plotInfo);
    connection.query('insert into plot set ?', plotInfo, function(err, rows, fields) {
        if (!err) {
            connection.query('call setPlotDateAddedNow()', function(err, rows, fields) {
                if (!err) {
                    console.log("Date successfully set to database.");
                    res.send("Plot successfully inserted to database.");      
                }
                else console.log("An error has occured.");   
            })     
        }
        else {
            console.log("An error has occured.");
            res.send('Error');
        }   
    })
});

app.get('/editPlot', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/editPlot.html'));
        }
    });
});

app.get('/editPlot/:plot', function (req, res) {
    var plotInfo = JSON.parse(req.params.plot);
    console.log(plotInfo);
    if (plotInfo.attribute === 'Size') {
        connection.query('call setPlotSize(?,?)', [plotInfo.attributeVal, plotInfo.plotnumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Plot info successfully edited.");
                    res.send("Plot info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else {
        connection.query('call setPlotDateOccupied(?,?)', [plotInfo.attributeVal, plotInfo.plotnumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Plot info successfully edited.");
                    res.send("Plot info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
});

app.get('/deletePlot', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/deletePlot.html'));
        }
    });
});

app.get('/deletePlot/:plot', function (req, res) {
    var plotInfo = JSON.parse(req.params.plot);
    console.log(plotInfo);
    connection.query('call removePlot(?)', [plotInfo.plotnumber], function(err, rows, fields) {
        if (!err) {
            console.log("Plot successfully deleted from database.");
            res.send("Plot successfully deleted from database.");      
        }
        else {
            console.log("An error has occured.");
            res.send('Error');
        }   
    })
});

app.get('/editPlantingActivity', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/editPlantingActivity.html'));
        }
    });
});

app.get('/editPlantingActivity/:activity', function (req, res) {
    var activityInfo = JSON.parse(req.params.activity);
    console.log(activityInfo);
    if (activityInfo.attribute === 'Plant Name') {
        connection.query('call setActivityName(?,?)', [activityInfo.attributeVal, activityInfo.activitynumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Planting activity info successfully edited."); 
                    res.send("Planting activity info successfully edited.");
                }
                else {
                    console.log(err);
                    res.send("Error");
                }   
        })
    }
    else if (activityInfo.attribute === 'Plant Start') {
        connection.query('call setActivityStart(?,?)', [activityInfo.attributeVal, activityInfo.activitynumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Planting activity info successfully edited.");
                    res.send("Planting activity info successfully edited.");    
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else if (activityInfo.attribute === 'Plant End') {
        connection.query('call setActivityEnd(?,?)', [activityInfo.attributeVal, activityInfo.activitynumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Planting activity info successfully edited.");
                    res.send("Planting activity info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else if (activityInfo.attribute === 'Harvest Start') {
        connection.query('update activity set harvest_start = ? where activitynumber = ?', [activityInfo.attributeVal, activityInfo.activitynumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Planting activity info successfully edited.");
                    res.send("Planting activity info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
    else {
        connection.query('update activity set harvest_end = ? where activitynumber = ?', [activityInfo.attributeVal, activityInfo.activitynumber], function(err, rows, fields) {
                if (!err) {
                    console.log("Planting activity info successfully edited.");
                    res.send("Planting activity info successfully edited."); 
                }
                else {
                    console.log("An error has occured.");
                    res.send('Error');
                }   
        })
    }
});

app.get('/deletePlantingActivity', function (req, res) {
    connection.query('select * from user where classification = "Admin" and sign_in = "Y"',function(err, rows, fields) {
        if (rows.length == 0) {
            res.sendFile(path.join(__dirname + '/src/accessDenied.html'));
        }
        else {
            res.sendFile(path.join(__dirname + '/src/deletePlantingActivity.html'));
        }
    });
});
app.get('/deletePlantingActivity/:activity', function (req, res) {
    var activityInfo = JSON.parse(req.params.activity);
    console.log(activityInfo);
    connection.query('call removeActivity(?)', [activityInfo.activitynumber], function(err, rows, fields) {
        if (!err) {
            console.log("Planting activity successfully deleted from database.");
            res.send('Planting activity successfully deleted from database.');      
        }
        else {
            console.log("An error has occured.");
            res.send('Error');
        }   
    })
});

app.get('/viewRequests/data/:date', function (req, res) {
    var dateInfo = JSON.parse(req.params.date);
    console.log(dateInfo);
     connection.query("SELECT * FROM request where request_date between str_to_date(?,'%Y-%m-%D') and str_to_date(?,'%Y-%m-%D')",[dateInfo.start,dateInfo.end], function(err, rows, fields) {
    if (!err) {
        res.send(rows);
        console.log(rows);
    }
  })
});


app.get('/viewActivities/data/:date', function (req, res) {
    var dateInfo = JSON.parse(req.params.date);
    console.log(dateInfo);
     connection.query("SELECT * FROM activity where plant_start between str_to_date(?,'%Y-%m-%D') and str_to_date(?,'%Y-%m-%D')",[dateInfo.start,dateInfo.end], function(err, rows, fields) {
    if (!err) {
        res.send(rows);
        //console.log(rows);
    }
  })
});

app.get('/search', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/search.html'));
});
app.get('/searchPlant', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/searchPlant.html'));
});
app.get('/searchPlot', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/searchPlot.html'));
});
app.get('/farmer/search-by-name/', function(req, res) {

  connection.query('SELECT * FROM farmer', function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
  })
})
app.get('/farmer/search-by-name/:name', function(req, res) {

  connection.query('SELECT * FROM (select *,concat(fname," ",lname) as name from farmer) as n where name like ? ', '%' + req.params.name + '%', function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
  })
})
app.get('/plant/search-by-name/', function(req, res) {

  connection.query('SELECT * FROM plant', function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
  })
})
app.get('/plant/search-by-name/:name', function(req, res) {

  connection.query('SELECT * FROM plant where plantname like ? ', '%' + req.params.name + '%', function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
  })
})
app.get('/plot/search-by-number/', function(req, res) {

  connection.query('SELECT * FROM plot', function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
  })
})
app.get('/plot/search-by-number/:number', function(req, res) {

  connection.query('SELECT * FROM plot where plotnumber = ? ', req.params.number, function(err, rows, fields) {
    if (!err) {
      res.send(rows)
    }
  })
})

app.get('/viewProfile', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/viewProfile.html'));
});
app.get('/viewProfile/data', function(req, res) {
  connection.query('SELECT * FROM user where sign_in = "Y"', function(err, rows, fields) {
    if (!err) {
        res.send(rows)
    }
  })
})

app.get('/viewActivities', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/viewActivities.html'));
});
app.get('/viewActivities/data', function(req, res) {
  connection.query('SELECT * FROM activity', function(err, rows, fields) {
    if (!err) {
        res.send(rows)
    }
  })
})

app.get('/viewRequests', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/viewRequests.html'));
});
app.get('/viewRequests/data', function(req, res) {
  connection.query('SELECT * FROM request', function(err, rows, fields) {
    if (!err) {
        res.send(rows)
    }
  })
})

app.get('/plantingRequest',function(req,res) {
    connection.query('select * from user where sign_in = "Y"', function(err, rows, fields) {
        if (rows.length != 0) {
            res.sendFile(path.join(__dirname + '/src/plantingRequest.html'));
        }
        else res.send("Please log-in");
    }) 
})

app.get('/plantingRequest/:request', function (req, res) {
    var requestInfo = JSON.parse(req.params.request);
    console.log(requestInfo);
    if (requestInfo.plotnumber == '') {
        requestInfo.plotnumber = 0;
    }
    connection.query('insert into request (plantname,quantity,plotnumber) values (?,?,?)',[requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber],function(err, rows, fields) {  
    });
    connection.query('select count(*) as count from farmer', function(err, rows){
        var count = rows[0].count;
        if(count!=0){
            connection.query('select * from plant where plantname = ?',[requestInfo.plantname],function(err, rows, fields) {
                if(rows.length==0){
                    connection.query('call setRequestRejected(?,?,?)', [requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber], function(err, rows, fields) {})
                    connection.query('call removeActivityPlantQty(?,?)',[requestInfo.plantname, requestInfo.quantity], function(err, rows, fields) {});
                    res.send(false);
                }
                else if (rows[0].quantity < requestInfo.quantity) {
                    connection.query('call setRequestRejected(?,?,?)', [requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber], function(err, rows, fields) {
                        connection.query('call removeActivityPlantQty(?,?)',[requestInfo.plantname, requestInfo.quantity], function(err, rows, fields) {});
                        res.send("Error");
                    });
                }
                else {
                    var remaining = rows[0].quantity - requestInfo.quantity;
                    if (requestInfo.plotnumber == '') {
                        connection.query('select * from plot where availablespace > 0 limit 1', function(err, rows, fields) {
                            if (rows.length != 0) {
                                var spaceLeft = rows[0].availablespace - requestInfo.quantity;
                                if (spaceLeft < 0) {
                                    connection.query('call setRequestRejected(?,?,?)', [requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber], function(err, rows, fields) {
                                    });
                                    connection.query('call removeActivityPlantQty(?,?)',[requestInfo.plantname, requestInfo.quantity], function(err, rows, fields) {});
                                    console.log("Sorry. No space left.");
                                    res.send("Error");
                                }
                                else {
                                    connection.query('update request set request_date = str_to_date(?,"%Y-%m-%d"), status = "Accepted", plotnumber = ? where plantname = ? and quantity = ? and plotnumber = ?', [currentDate,rows[0].plotnumber, requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber], function(err, rows, fields) {
                                    });
                                    connection.query('update plot set availablespace = ? where plotnumber = ?',[spaceLeft, rows[0].plotnumber], function(err, rows, fields) {
                                    })
                                    connection.query('update plant set quantity = ? where plantname = ?',[remaining,requestInfo.plantname],function(err,rows,fields) {
                                    });
                                    if (spaceLeft == 0) {
                                        connection.query('update plot set date_occupied = str_to_date(?,"%Y-%m-%d") where plotnumber = ?', [currentDate, rows[0].plotnumber], function(err,rows,fields) {
                                        })
                                    }
                                    console.log("Request accepted!");
                                    res.send("Request accepted!");

                                                                       }
                            }
                            else {
                                connection.query('call setRequestRejected(?,?,?)', [requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber], function(err, rows, fields) {
                                });
                                connection.query('call removeActivityPlantQty(?,?)',[requestInfo.plantname, requestInfo.quantity], function(err, rows, fields) {});
                                console.log("Sorry. No available plot left.");
                                res.send("Error");
                            }
                        })
                    }
                    else {
                        connection.query("select * from plot where plotnumber = ?", [requestInfo.plotnumber], function(err, rows, fields) {
                            if (rows.length != 0) {
                                var spaceLeft = rows[0].availablespace - requestInfo.quantity;
                                if (spaceLeft < 0) {
                                    connection.query('call setRequestRejected(?,?,?)', [requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber], function(err, rows, fields) {
                                    });
                                    connection.query('call removeActivityPlantQty(?,?)',[requestInfo.plantname, requestInfo.quantity], function(err, rows, fields) {});
                                    console.log("Sorry. No space left.");
                                    res.send("Error");
                                }
                                else {
                                    connection.query('call setRequestAccepted(?,?,?,?)', [rows[0].plotnumber, requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber], function(err, rows, fields) {
                                    });
                                    connection.query('call setPlotSpace(?,?)',[spaceLeft, rows[0].plotnumber], function(err, rows, fields) {
                                    })
                                    connection.query('call setPlantQty(?,?)',[remaining,requestInfo.plantname],function(err,rows,fields) {
                                    });
                                    if (spaceLeft == 0) {
                                        connection.query('call setPlotDateOccupiedNow(?)', [rows[0].plotnumber], function(err,rows,fields) {
                                        })
                                    }
                                    console.log("Request accepted!");
                                    res.send("Request accepted!");
                                }
                            }
                            else {
                                connection.query('call setRequestRejected(?,?,?)', [requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber], function(err, rows, fields) {
                                });
                                connection.query('call removeActivityPlantQty(?,?)',[requestInfo.plantname, requestInfo.quantity], function(err, rows, fields) {});
                                console.log("Sorry. Selected plot does not exist.");
                                res.send("Error");
                            }
                        })
                    }
                }
            });
        }
        else{
            connection.query('call setRequestRejected(?,?,?)', [requestInfo.plantname, requestInfo.quantity, requestInfo.plotnumber], function(err, rows, fields) {});
            connection.query('call removeActivityPlantQty(?,?)',[requestInfo.plantname, requestInfo.quantity], function(err, rows, fields) {});
            console.log("Sorry. No available farmer.");
            res.send("Sorry, no available farmer");
        }
    });
});

app.get('/logout/', function(req, res) {
    connection.query('SELECT count(*) "count" from user where sign_in = "Y"', function (err, rows, result) {
        // body...
        if(!err){
            var count = rows[0].count
            if(count == 1){
                connection.query('call signOut()', function(err, rows, fields) {
                    if (!err) {
                        res.send('1')
                    }
                })
            }
            else res.send('0')
        }
        
    })
    
})
