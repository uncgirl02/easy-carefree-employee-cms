const inquirer = require("inquirer")
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();


const connection = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: process.env.DB_USER,
    // Your MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
console.log('Connected to the employeecms database.');


async function whatToDo() {
  await inquirer.prompt([
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
  connection.query(`SELECT * FROM department`, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
    whatToDo();
  });
}

async function viewAllRoles() {
  connection.query(`SELECT * FROM role`, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
}
 
async function viewAllEmployees() {
  connection.query(`SELECT * FROM employee`, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
}
    
async function addDepartment() {
 await inquirer.prompt([
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
      console.table(results);
      console.log("Added " + newDepartment  + " to the database")
    })
    .then(
      whatToDo()
    ) 
  })
}

async function addRole() {
  await inquirer.prompt([
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
      choices: console.table('department', ['id, name']),
    }
  ])
  .then(answers => {
    console.log(answers);
    // let newRole = answers.role
    // let newSalary = answers.salary
    // let newDepartmentId = answers.departmentId

    // connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${newRole}", "${newSalary}", "${newDepartmentId}")`, function (error, results) {
    //   if (error) {
    //     console.log("Error");
    //   };
    //   console.table(results);
    //   console.log("Added " + newRole  + " to the database")
    // })
    // .then(
    //   whatToDo()
    // ) 
  })
}

async function addEmployee(employee) {
  connection.query(`INSERT INTO employee SET ?`, employee, function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(results);
  });
}

async function updateEmployeeRole(employee, id) {
  connection.query(`UPDATE employee SET ? where ?`, [employee, {id: id}], function (error, results) {
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