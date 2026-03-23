# FRUIT SHOP - Online Store Project

Welcome to the **Online Store Project**, a web application for managing and purchasing products. This project is built using **React** for the frontend and **Spring Boot** for the backend.

---

## 🎥 Video Presentation

Click the image below to watch a short showcase of the app's capabilities on YouTube:

[Fruit Shop Presentation](https://www.youtube.com/watch?v=Wy5izuefwd8)

---

## 🚀 How to Run the Project

### Backend Setup

1. **Add `application.properties` file:**  
   Create a file named `application.properties` inside the `src/main/resources` directory with the following content:  
   ```properties
   spring.application.name=backend

   spring.datasource.url={database_url}
   spring.datasource.username={database_username}
   spring.datasource.password={database_password}

   security.jwt.secret-key=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b

   # Token expiration time in milliseconds (2 hours)
   security.jwt.expiration-time=7200000
   ```
   
2. Start Your Database:
   Ensure your database is running and accessible.

3. Create Database Entities:
   Run the following SQL script to create the necessary database tables:

   ```script
   CREATE TABLE address (
   id int NOT NULL AUTO_INCREMENT,
   address_line varchar(100) NOT NULL,
   address_line_2 varchar(100) NULL,
   city varchar(100) NOT NULL,
   zip_code varchar(50) NOT NULL,
   country varchar(100) NOT NULL,
   CONSTRAINT address_pk PRIMARY KEY (id)
   );
   CREATE TABLE authority (
   id int NOT NULL AUTO_INCREMENT,
   name varchar(20) NOT NULL,
   CONSTRAINT authority_pk PRIMARY KEY (id)
   );
   CREATE TABLE authority_user (
   id int NOT NULL AUTO_INCREMENT,
   user_id int NOT NULL,
   authority_id int NOT NULL,
   CONSTRAINT authority_user_pk PRIMARY KEY (id)
   );
   CREATE TABLE `order` (
   id int NOT NULL AUTO_INCREMENT,
   address_id int NOT NULL,
   user_id int NOT NULL,
   date datetime NOT NULL,
   total_summary double NOT NULL,
   CONSTRAINT order_pk PRIMARY KEY (id)
   );
   CREATE TABLE ordered_product (
   id int NOT NULL AUTO_INCREMENT,
   product_id int NOT NULL,
   order_id int NOT NULL,
   quantity int NOT NULL,
   CONSTRAINT ordered_product_pk PRIMARY KEY (id)
   );
   CREATE TABLE product (
   id int NOT NULL AUTO_INCREMENT,
   name varchar(50) NOT NULL,
   quantity int NOT NULL,
   price double NOT NULL,
   img text NOT NULL,
   CONSTRAINT product_pk PRIMARY KEY (id)
   );
   CREATE TABLE user (
   id int NOT NULL AUTO_INCREMENT,
   username varchar(20) NOT NULL,
   password varchar(500) NOT NULL,
   name varchar(50) NOT NULL,
   surname varchar(50) NOT NULL,
   phone_number varchar(20) NOT NULL,
   CONSTRAINT user_pk PRIMARY KEY (id)
   );
   ALTER TABLE authority_user ADD CONSTRAINT authority_user_authority FOREIGN KEY authority_user_authority (authority_id)
   REFERENCES authority (id);
   ALTER TABLE authority_user ADD CONSTRAINT authority_user_user FOREIGN KEY authority_user_user (user_id)
   REFERENCES user (id);
   ALTER TABLE ordered_product ADD CONSTRAINT cart_product_product FOREIGN KEY cart_product_product (product_id)
   REFERENCES product (id);
   ALTER TABLE `order` ADD CONSTRAINT order_adress FOREIGN KEY order_adress (address_id)
   REFERENCES address (id);
   ALTER TABLE `order` ADD CONSTRAINT order_user FOREIGN KEY order_user (user_id)
   REFERENCES user (id);
   ALTER TABLE ordered_product ADD CONSTRAINT ordered_product_order FOREIGN KEY ordered_product_order (order_id)
   REFERENCES `order` (id);
   ```

4. Insert Initial Data:
   Populate the database with initial records:

   ```script
   INSERT INTO user (username, password, name, surname, phone_number)
   VALUES ('administrator123', '$2a$12$tkSH97g1tuzoCOk.FJZLXu9MZLwFaRAKJSIeaAIIWYirgPz18AitK',
   'worker_01_admin_name', 'worker_01_admin_surname', '000000000');
   INSERT INTO authority (name)
   VALUES ('ROLE_ADMIN');
   INSERT INTO authority (name)
   VALUES ('ROLE_USER');
   INSERT INTO authority_user (authority_id, user_id)
   VALUES (1, 1);
   ```
   
5. Run the Backend Application
6. Frontend setup:
   Install Dependencies:
   Navigate to the frontend project directory and run:
   
   ```commend
   npm install
   ```
   
8. Start the Frontend Application:
   Run the development server:
   
   ```commend
   npm run dev
   ```



## 🛠 Features

Admin role:
- adding products,
- removing products,
- taking a look into all placed orders.

User role:
-adding to cart,
-placing orders,
-taking a look into its own placed orders.

No role:
-taking a look on every product and its details on site,
-signing up,
-loging in.

Authentication:
Secure login with JWT-based token authentication.

## 🧪 Testing Admin account

username: administrator123
password: turbohardpassword


Note:
When switching between the admin and user accounts, refresh the page to load the components associated with the respective role.


   
   
