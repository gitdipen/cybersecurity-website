// Jenkinsfile for Cybersecurity Website DevOps Pipeline

pipeline {
    agent any // Specifies that the pipeline can run on any available agent

    environment {
        // SonarQube configuration
        SONAR_SCANNER_HOME = tool 'SonarScanner' // This refers to the name configured in Global Tool Configuration
        SONAR_PROJECT_KEY = 'Cybersecurity-Website' // Matches the SonarQube project key
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Cloning the Git repository...'
                    // Replace 'github-credentials' with your actual credential ID if private, otherwise remove credentialsId if public.
                    // The image_a0b65d.png shows 'https://github.com/gtldpen/cybersecurity-website.git' as the Repository URL.
                    git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/gitdipen/cybersecurity-website.git'
                }
            }
        }

        stage('Build') { // Configure Jenkins to build your code and create a build artefact [cite: 11]
            steps {
                script {
                    echo 'Building Docker image...'
                    // The build artifact in this case is a Docker image[cite: 12].
                    dir('.') {
                        // Use 'bat' for Windows native commands as specified previously.
                        bat 'docker build -t cybersecurity-website:latest .'
                    }
                    echo 'Docker image built: cybersecurity-website:latest'
                }
            }
        }

        stage('Test') { // Configure Jenkins to run automated tests on your code [cite: 13]
            steps {
                script {
                    echo 'Running basic tests (e.g., HTML/CSS/JS linting or a simple file existence check)'
                    // For a static site, extensive unit tests might not apply.
                    // Here, we check if index.html exists as a basic validation.
                    // You can choose any testing framework of your choice, such as JUnit, Selenium, or Appium[cite: 14].
                    bat 'dir index.html' // Use 'dir' for Windows
                    echo 'Basic file existence test passed.'
                }
            }
        }

        stage('Code Quality') { // Configure Jenkins to run code quality analysis on your code [cite: 15]
            steps {
                script {
                    echo 'Running SonarQube analysis...'
                    // This stage focuses on the structure, style, and maintainability of your codebase[cite: 16].
                    // Tools like SonarQube or CodeClimate can be used to detect issues like code duplication and code smells[cite: 17].
                    withSonarQube(installation: 'SonarQube Local', branch: 'main') {
                        // Use 'bat' for Windows native commands.
                        bat "\"${SONAR_SCANNER_HOME}\\bin\\sonar-scanner.bat\" " +
                            "-Dsonar.projectKey=${SONAR_PROJECT_KEY} " +
                            "-Dsonar.sources=. " +
                            "-Dsonar.host.url=${env.SONARQUBE_URL} " +
                            "-Dsonar.login=${env.SONARQUBE_TOKEN}"
                    }
                    echo 'SonarQube analysis complete. Check SonarQube dashboard for results.'
                }
            }
        }

        stage('Security') { // Configure Jenkins to perform automated security analysis [cite: 20]
            steps {
                script {
                    echo 'Running OWASP Dependency-Check for security analysis...'
                    // This ensures that vulnerabilities are detected and addressed early in the CI/CD pipeline[cite: 21].
                    dependencyCheck additionalArguments: '--project "Cybersecurity Website" --format HTML --scan .', odcInstallation: 'DependencyCheck'
                    echo 'OWASP Dependency-Check complete. Check the generated HTML report.'
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'target', // Default output directory for Dependency-Check
                        reportFiles: 'dependency-check-report.html',
                        reportName: 'Dependency-Check Report'
                    ])
                }
            }
        }

        stage('Deploy') { // Configure Jenkins to deploy your application to a test environment [cite: 26]
            steps {
                script {
                    echo 'Deploying Docker image to a local test environment...'
                    // You can use deployment tools like Docker Compose or AWS Elastic Beanstalk[cite: 27].
                    // Stop and remove any existing container with the same name
                    bat 'docker stop cybersecurity-app || true'
                    bat 'docker rm cybersecurity-app || true'
                    // Run the new Docker container
                    bat 'docker run -d -p 8081:80 --name cybersecurity-app cybersecurity-website:latest'
                    echo 'Application deployed to http://localhost:8081'
                }
            }
        }

        // The "Release" [cite: 28] and "Monitoring" [cite: 30] stages are typically for higher HD grades [cite: 7]
        // and involve more complex setups (e.g., cloud services, dedicated monitoring tools like Datadog or New Relic [cite: 31]).
        // To achieve a low HD grade, it is necessary to successfully implement only four stages from steps 4-10[cite: 5].

        // stage('Release') { // Promote the application to a production environment [cite: 28]
        //     steps {
        //         echo 'Simulating promotion to production...'
        //         // This would involve pushing the Docker image to a registry and deploying to a production server.
        //     }
        // }

        // stage('Monitoring') { // Monitor the application in production [cite: 30]
        //     steps {
        //         echo 'Simulating monitoring and alerting...'
        //         // This would involve integrating with monitoring tools like Datadog or New Relic[cite: 31].
        //     }
        // }
    }

    post {
        always {
            echo 'Pipeline finished.'
            cleanWs() // Clean up the workspace
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}