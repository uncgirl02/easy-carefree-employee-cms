const inquirer = require ("inquirer")
const mysql = require('mysql2');
const cTable = require('console.table');
const connection = require("mysql2/typings/mysql/lib/Connection");

// Connect to database
const db = mysql.createConnection(
    {
      host: '',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Adv83839!',
      database: 'election'
    },
    console.log('Connected to the employeecms database.')
  );

function whatToDo() {
    return inquirer.prompt([
        {
            type:'list',
            name:'todo',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        }
    ])
    .then(answer => {
      if (answer === 'View all departments') {
        viewallDepartments()
      } if (answer === 'View all roles') {
        viewAllRoles()
      } if (answer === 'View all employees') {
        viewAllEmployees()
      } if (answer === 'Add a department') {
        addDepartment()
      } if (answer === 'Add a role') {
        addRole()
      } if (answer === 'Add an employee') {
        addEmployee()
      } if (answer === 'Update an employee role') {
        updateEmployeeRole()
      }
    })
};

function viewallDepartments() {
  connection.query(
    `SELECT * FROM department;`,
    (err, res) => {
    if (err) throw error;
    console.table(res);
    whatToDo();
    }
  )
}

function viewAllRoles() {
  connection.query(
    `SELECT * FROM role`,
    (err, res) => {
    if (err) throw error;
    console.table(res);
    whatToDo();
    }
  )
}

function viewAllEmployees() {
  connection.query(
    `SELECT employee.first_name, employee.last_name role.salary, CONCAT(employee.first_name, ' ', employee.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`,
    (err, res) => {
    if (err) throw error;
    console.table(res);
    whatToDo();
    }
  )
}

function addDepartment() {
  connection.query(
    `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`,
    (err, res) => {
    if (err) throw error;
    console.table(res);
    whatToDo();
    }
  )
}

function addRole() {
  connection.query(
    `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`,
    (err, res) => {
    if (err) throw error;
    console.table(res);
    whatToDo();
    }
  )
}

function addEmployee() {
  connection.query(
    `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`,
    (err, res) => {
    if (err) throw error;
    console.table(res);
    whatToDo();
    }
  )
}

function updateEmployeeRole() {
  connection.query(
    `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`,
    (err, res) => {
    if (err) throw error;
    console.table(res);
    whatToDo();
    }
  )
}






whatToDo()