# IRD Research Paper Management System
[Report of project](https://github.com/Pourav619/IRD-BTP/blob/main/Vickey_BTP_Report.pdf)

## Description

This project is a Research Paper Management System developed for the IRD department. The system allows users to upload, view, edit, and manage metadata for their research papers.

- [Poster_report](https://github.com/Pourav619/IRD-BTP/blob/main/Poster_BTP.pdf)
## Technologies Used

- Node.js
- Express.js
- MongoDB

## System Requirements

- Node.js (version X.X.X or higher)
- MongoDB (version X.X.X or higher)

## Installation

To run this project locally on your machine, follow these steps:

1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/Pourav619/IRD-BTP.git
    ```

2. Navigate to the project directory:
    ```sh
    cd IRD-BTP
    ```

3. Install the required dependencies:
    ```sh
    npm install
    ```

4. Start the application:
    ```sh
    node index.js
    ```

5. Open your browser and go to `http://localhost:3000/`.
![image](https://github.com/Pourav619/IRD-BTP/assets/108173950/944f636f-10b0-4a60-a99c-49aa9580ae66)
![image](https://github.com/Pourav619/IRD-BTP/assets/108173950/0a400528-e43f-4dc8-a412-10bfbff5eb8f)


## Features

### User Authentication

- Secure login and signup processes to ensure that only authorized users can access the system's features.

### Add New Entries

- Users can manually upload a new research paper or upload a citation file containing metadata in a specified format.

### View, Edit, and Delete Data

- Users can view, edit, and delete their research papers from a table that retrieves data from MongoDB based on the username.

### Search Functionality

- Users can search data in MongoDB using keywords related to the research paper's metadata.

## Future Plans

### Security Enhancements

- Implement advanced firewall rules to secure the application.
- Enhance authentication with LDAP integration.
- Transition from FTPS to SFTP for more secure file transfers.

### Deployment Strategy

- Implement staged deployment strategies to minimize downtime.
- Plan for scalability using containerization and cloud deployment options.

### DevOps Improvements

- Expand automated testing coverage with unit tests and integration tests.
- Implement enhanced logging and monitoring for better visibility into system performance.

### Codebase and Technology Upgrades

- Upgrade form handling capabilities with frameworks like Formik for improved user interaction and data validation.
### Team member
- Vickey Kumar 2021299 
- Pourav Surya 2021271
- Suyash Kumar 2021293
## Contributions

Contributions are welcome! Please fork the repository and submit a pull request for review.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
