INSERT INTO department (name)
VALUES
    ('Development'),
    ('Finance'),
    ('Marketing');


INSERT INTO role (title, salary, department_id)
VALUES
    ('Manager', 150000, 1),
    ('Manager', 150000, 2),
    ('Manager', 150000, 3),
    ('Associate', 75000, 1),
    ('Associate', 75000, 2),
    ('Associate', 75000, 3),
    ('Intern', 30000, 1),
    ('Intern', 30000, 2),
    ('Intern', 30000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('David', 'Smith', 1, NULL),
    ('Casey', 'Lane', 1, NULL),
    ('Brianna', 'Cook', 1, NULL),
    ('Logan', 'Hatfield', 2, 1),
    ('Maria', 'Gonzalez', 2, 2),
    ('Erin', 'Stepneski', 2, 3),
    ('Raphael', 'McDaniel', 3, 1);