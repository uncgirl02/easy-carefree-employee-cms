INSERT INTO department (name)
VALUES
    ('Development'),
    ('Finance'),
    ('Marketing');


INSERT INTO role (title, salary, department_id)
VALUES
    ('Manager', 150,000, 1),
    ('Manager', 150,000, 2),
    ('Manager', 150,000, 3),
    ('Associate', 75,000, 1),
    ('Associate', 75,000, 2),
    ('Associate', 75,000, 3),
    ('Intern', 30,000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('David', 'Smith', 1, NULL),
    ('Casey', 'Lane', 2, NULL),
    ('Brianna', 'Cook', 3, NULL),
    ('Logan', 'Hatfield', 4, 1),
    ('Maria', 'Gonzalez', 5, 2),
    ('Erin', 'Stepneski', 6, 3),
    ('Raphael' 'McDaniel', 7, 1);