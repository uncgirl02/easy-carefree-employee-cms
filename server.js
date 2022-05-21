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
  },
  console.log('Connected to the employeecms database.')
  );



function whatToDo() {
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
        return viewallDepartments()
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
    let newDepartment = answer.department;
    connection.query(`INSERT INTO department (name) VALUES ("${newDepartment}")`, function (error, results) {
      if (error) {
        console.log("Error");
      };
      console.table(answers);
      console.log("Added " + newDepartment  + " to the database")
    })
  })
  .then (answer => whatToDo())
}

var deptArray = [];
function selectDept() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      deptArray.push(res[i].name);
    }
  })
  return deptArray;
}

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
      console.log("Added " + newRole  + " to the database")
    }) 
  })
  .then(answers => whatToDo())
}

var roleArray = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }
  })
  return roleArray;
}

var managerArray = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managerArray.push((res[i].first_name).concat(" " + res[i].last_name)); 
    }
    managerArray.push("null");
  })
  return managerArray;
}

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
      choices: selectManager()
    },
  ])
  .then(answers => {
    let newFirstName = answers.firstname
    let newLastName = answers.lastname
    let newRoleId = selectRole().indexOf(answers.role) + 1
    
    if (answers.manager === "null") {
    let newManagerId = null
    } else {
    let newManagerId = selectManager().indexOf(answers.manager) + 1
    }

    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${newFirstName}", "${newLastName}", "${newRoleId}", "${newManagerId}")`, function (error, results) {
      if (error) {
        console.log("Error");
      };
      console.table(answers);
      // console.log("Added " + newEmployee  + " to the database")
    }) 
    })
    .then(answers => whatToDo())
  }

function updateEmployeeRole(employee, id) {
  connection.query(`UPDATE employee SET ? where ?`, [employee, {id: id}], function (error, results) {
    if (error) {
      console.log(err);
    };
    console.table(answers);
  });
}

function exitProgram() {
  console.log("Thank you for using Employee CMS.  Have a great day!")
}

connection.connect(err => {
  if (err) throw err;
  whatToDo()});
