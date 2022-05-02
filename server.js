const inquirer = require("inquirer")
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'Adv83839!',
    database: 'employeecms'
  });
console.log('Connected to the employeecms database.');


async function whatToDo() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'todo',
      message: 'What would you like to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit program'],
    }
  ])
    .then(answer => {
      if (answer.todo === 'View all departments') {
        viewallDepartments()
      } if (answer.todo === 'View all roles') {
        viewAllRoles()
      } if (answer.todo === 'View all employees') {
        viewAllEmployees()
      } if (answer.todo === 'Add a department') {
        addDepartment()
      } if (answer.todo === 'Add a role') {
        addRole()
      } if (answer.todo === 'Add an employee') {
        addEmployee()
      } if (answer.todo === 'Update an employee role') {
        updateEmployeeRole()
      } if (answer.todo === 'Exit program') {
        exitProgram()
      }
    })
};

async function viewallDepartments() {
  connection.query('SELECT * FROM department', function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
    await whatToDo();
  });
}

function viewAllRoles() {
  connection.query(`SELECT * FROM role`, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
}
 
function viewAllEmployees() {
  connection.query(`SELECT * FROM employee`, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
}
    

function addDepartment(department) {
  connection.query('INSERT INTO departments SET ?', department, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
}

function addRole(role) {
  connection.query('INSERT INTO roles SET ?', role, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
}

function addEmployee(employee) {
  connection.query('INSERT INTO employees SET ?', employee, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
}

function updateEmployeeRole(employee, id) {
  connection.query('UPDATE employees SET ? where ?', [employee, {id: id}], function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
}

function exitProgram() {
  console.log("Thank you for using Employee CMS.  Have a great day!")
}


whatToDo()