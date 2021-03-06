const inquirer = require("inquirer")
const mysql = require('mysql2');
const cTable = require('console.table');
// const Connection = require("mysql2/typings/mysql/lib/Connection");
require('dotenv').config();

// Establish Connection

const connection = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: process.env.DB_USER,
    // Your MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log('Connected to the employeecms database.')
);

// Function to Initiate Application

function whatToDo() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'todo',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit program'],
    }
  ])
    // Depending on choice selected, run different functions
    .then(answer => {
      if (answer.todo === 'View all departments') {
        return viewAllDepartments();
      } if (answer.todo === 'View all roles') {
        return viewAllRoles()
      } if (answer.todo === 'View all employees') {
        return viewAllEmployees()
      } if (answer.todo === 'Add a department') {
        return addDepartment()
      } if (answer.todo === 'Add a role') {
        return addRole()
      } if (answer.todo === 'Add an employee') {
        return addEmployee()
      } if (answer.todo === 'Update an employee role') {
        return updateEmployeeRole()
      } if (answer.todo === 'Exit program') {
        return exitProgram()
      }
    })
};

// Function to view all departments
async function viewAllDepartments() {
  connection.query(`SELECT * FROM department`, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
    whatToDo();
  });
}

// Function to view all Roles
function viewAllRoles() {
  connection.query(`SELECT * FROM role INNER JOIN department ON (role.department_id = department.id)`, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
  whatToDo();
}

// Function to view all employees
function viewAllEmployees() {
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)`,
    function (error, results) {
      if (error) {
        console.log(err);
      };
      console.table(results);
    });
  whatToDo();
}

// Function to add a department
async function addDepartment() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?',
    }
  ])
    .then(answer => {
      console.log(answer);
      let newDepartment = answer.department;
      connection.query(`INSERT INTO department (name) VALUES ("${newDepartment}")`, function (error, results) {
        if (error) {
          console.log("Error");
        };
        console.table(answer);
        console.log("Added " + newDepartment + " to the database")
      })
    })
    .then(answers => whatToDo())
  }


// Set up  a department array to use as the choices in the addRole function
var deptArray = [];
function selectDept() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      deptArray.push(res[i].name);
    }
  })
  return deptArray;
}

// Function to add a role
function addRole() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'role',
      message: 'What is the name of the role?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of this role?',
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Which department does this role belong to?',
      choices: selectDept(),
    },
  ])
    .then(answers => {
      let newRole = answers.role
      let newSalary = answers.salary
      let newDepartmentId = answers.departmentId

      connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${newRole}", "${newSalary}", "${newDepartmentId}")`, function (error, results) {
        if (error) {
          console.log("Error");
        };
        console.table(answers);
        console.log("Added " + newRole + " to the database")
      })
    })
    .then(answers => whatToDo())
}

// Set up a role array to use as choices in the addEmployee function
function selectRole() {
  var roleArray = [];
  connection.query("SELECT role.id, role.title, department.name FROM role INNER JOIN department ON (role.department_id = department.id)", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) 
    roleArray.push({value:res[i].id, name:(res[i].title.concat(" of the " + res[i].name + " department"))});
    })
  
  return roleArray;
}
  


// Set up a manager array to use as choices in the addEmployee function
var managerArray = [];
function selectManager() {
  connection.query("SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managerArray.push({value:res[i].id, name:(res[i].first_name).concat(" " + res[i].last_name)});
    }
    managerArray.push("null");
  })
  return managerArray;
}

// Function to add an Employee
function addEmployee() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'firstname',
      message: 'What is the first name of the employee?',
    },
    {
      type: 'input',
      name: 'lastname',
      message: 'What is the last name of the employee?',
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is the role of this employee?',
      choices: selectRole(),
    },
    {
      type: 'list',
      name: 'manager',
      message: "Who is this employee's manager?",
      choices: selectManager(),
    },
  ])
    .then(answers => {
      let newFirstName = answers.firstname
      let newLastName = answers.lastname
      let newRoleId = answers.role

      // if (answers.manager === "null") {
      // let newManagerId = null
      // } else {
      let newManagerId = answers.manager


      connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${newFirstName}", "${newLastName}", "${newRoleId}", "${newManagerId}")`, function (error, results) {
        if (error) {
          console.log("Error");
        };
        console.log("Added " + newFirstName + " " + newLastName + " to the database")
      })
    })
    .then(answers => whatToDo())
}

//Set up array for employees to use in the updateEmployeeRole function

// async function selectEmployee() {
//   var employeeArray = [];
//   connection.query("SELECT first_name, last_name FROM employee", (err, res) => {
//     if (error) {
//       console.log(err);
//     };
//     console.table(results);
//     for (var i = 0; i < res.length; i++) {
//       employeeArray.push((res[i].first_name).concat(" " + res[i].last_name));
//     };
//     console.log("data: ", employeeArray);
//     return employeeArray;
//   })

// }

// Function to update the employee role
function updateEmployeeRole() {
  var employeeArray = [];
  connection.query("SELECT id, first_name, last_name FROM employee", (err, res) => {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      let obj = {value:res[i].id, name:(res[i].first_name).concat(" " + res[i].last_name)};
    if(!employeeArray.includes(obj))
      employeeArray.push(obj);
    };

    var roleArray = [];

    connection.query("SELECT role.id, role.title, department.name FROM role INNER JOIN department ON (role.department_id = department.id)", function (err, res) {
      if (err) throw err
      for (var i = 0; i < res.length; i++) {
        roleArray.push({value:res[i].id, name:(res[i].title.concat(" of the " + res[i].name + " department"))});
      };

      return inquirer.prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee do you want to set with the new role?",
          choices: employeeArray
        },
        {
          type: "list",
          name: "role",
          message: "What is the employee's new role?",
          choices: roleArray
        },
      ])
        .then(answers => {
          console.log('data: ', answers)
          let employeeId = answers.employee
          let roleId = answers.role
          connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleId, employeeId],
            function (err, res) {
              if (err) throw err;

              // console.table(answers);
              console.log(" Employee Role Updated successfully!");
            })
        })
        .then(answers => viewAllEmployees())

        .then(answers => whatToDo())

    })
  })
}

//Function to exit the program
function exitProgram() {
  console.log("Thank you for using Employee CMS.  Have a great day!")
}

// Establish connection to the database and ititiate the application
connection.connect(err => {
  if (err) throw err;
  whatToDo()
});

