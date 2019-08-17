var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 8889
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  
  startBamazon();
});


function startBamazon() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("--------------  BAMAZON  -------------\n");
        console.table(res);

    
        console.log("\n-----------------------------------\r");

        askQuestions(res);

      });
  }

  function askQuestions(res) {
    inquirer.prompt([
      {
          message: "What is the item id you would like to buy?",
          type: "input",
          name: "itemID"
        
      },{
          message: "How many units would you like to buy?",
          type: "input",
          name: "buyUnits"
   
      }
      
      ])

    .then(function(answer) {
        console.log("\n");
        console.log("You purchased " + answer.buyUnits + " units from item # " + answer.itemID + ".\n");
        updateProduct(answer);

          });

          function updateProduct(answer) {
            console.log("Updating units...\n");
            var query = connection.query(
          
              "UPDATE products SET ? WHERE ?",
              [
                { 
                  stock_quantity: stock_quantity - answer.buyUnits 
                },
                { 
                  item_id: answer.itemID 
                }
              ],
              function(err, res) {
                connection.query("SELECT * FROM products", function(err, res) {
                  if (err) throw err;
                    console.log("----------------------------------  BAMAZON  ----------------------------------\n");
                    console.table(res);
                    askQuestions(res);
                });
              }
            );
          }
};