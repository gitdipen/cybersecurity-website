// Jenkinsfile for Cybersecurity Website DevOps Pipeline

pipeline {
    agent any // Specifies that the pipeline can run on any available agent

    environment {
        // SonarQube configuration (global environment variables)
        SONAR_SCANNER_HOME = tool 'SonarScanner' // This refers to the name configured in Global Tool Configuration
        SONAR_PROJECT_KEY = 'Cybersecurity-Website' // Matches the SonarQube project key
    }

    tools {
        // Define Node.js tool here if you need to run npm commands directly on the agent,
        // especially for local builds or tests outside of Docker.
        // Make sure 'NodeJS_LTS' matches the name configured in Manage Jenkins -> Tools -> NodeJS installations
        nodejs 'NodeJS_LTS'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Cloning the Git repository...'
                    // Replace 'github-credentials' with your actual credential ID if private, otherwise remove credentialsId if public.
                    git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/gitdipen/cybersecurity-website.git'
                }
            }
        }

        stage('Build') { // Configure Jenkins to build your code and create a build artefact
            steps {
                script {
                    echo 'Installing backend dependencies and building frontend...'
                    // Assuming a backend and frontend structure within your repo
                    dir('backend') {
                        bat 'npm install' // Install backend dependencies
                    }
                    dir('frontend') {
                        bat 'npm install' // Install frontend dependencies
                        bat 'npm run build' // Build the React frontend production bundle
                    }

                    echo 'Building Docker image for the application...'
                    // The build artifact in this case is a Docker image.
                    dir('.') {
                        // Ensure your Dockerfile is in the project root to pick up both backend and frontend build outputs
                        bat 'docker build -t cybersecurity-website:latest .'
                    }
                    echo 'Docker image built: cybersecurity-website:latest'
                }
            }
        }

        stage('Test') { // Configure Jenkins to run automated tests on your code
            steps {
                script {
                    echo 'Running backend unit tests...'
                    dir('backend') {
                        // Assuming you have 'test' script in backend/package.json (e.g., "test": "jest")
                        // '-- --ci' for CI environments to prevent interactive watch mode
                        // '-- --json --outputFile=test-results.json' to output results in JUnit compatible format
                        bat 'npm test -- --ci --json --outputFile=test-results-backend.json'
                        junit 'test-results-backend.json' // Publish backend test results
                    }

                    echo 'Running frontend unit tests...'
                    dir('frontend') {
                        // Assuming you have 'test' script in frontend/package.json (e.g., "test": "react-scripts test" or "jest")
                        bat 'npm test -- --ci --json --outputFile=test-results-frontend.json'
                        junit 'test-results-frontend.json' // Publish frontend test results
                    }
                    echo 'Automated tests completed.'
                }
            }
        }

        stage('Code Quality') { // Configure Jenkins to run code quality analysis on your code
            environment {
                // IMPORTANT: Explicitly set SONARQUBE_URL to your SonarQube server's address.
                SONARQUBE_URL = 'http://localhost:9000' // **UPDATE THIS IF YOUR SONARQUBE URL IS DIFFERENT**
            }
            steps {
                script {
                    echo 'Running SonarQube analysis...'
                    withSonarQube(installation: 'SonarQube Local', branch: 'main') {
                        // 'SonarQube Local' should be the name of your SonarQube installation configured in Jenkins
                        // Use 'withCredentials' to securely inject your SonarQube authentication token.
                        // 'sonarqube-server-token' should be the ID of your 'Secret text' credential in Jenkins.
                        withCredentials([string(credentialsId: 'sonarqube-server-token', variable: 'SONARQUBE_TOKEN')]) {
                            // Use 'bat' for Windows native commands.
                            bat "\"${SONAR_SCANNER_HOME}\\bin\\sonar-scanner.bat\" " +
                                "-Dsonar.projectKey=${SONAR_PROJECT_KEY} " +
                                "-Dsonar.sources=. " +
                                "-Dsonar.host.url=${env.SONARQUBE_URL} " +
                                "-Dsonar.login=${SONARQUBE_TOKEN}" // Token injected securely via withCredentials
                        }
                    }
                    echo 'SonarQube analysis complete. Check SonarQube dashboard for results.'
                }
            }
        }

        stage('Security') { // Configure Jenkins to perform automated security analysis
            steps {
                script {
                    echo 'Running OWASP Dependency-Check for security analysis...'
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

        stage('Deploy') { // Configure Jenkins to deploy your application to a test environment
            steps {
                script {
                    echo 'Deploying Docker image to a local test environment...'
                    // Stop and remove any existing container with the same name
                    bat 'docker stop cybersecurity-app-test || true'
                    bat 'docker rm cybersecurity-app-test || true'
                    // Run the new Docker container for test environment
                    bat 'docker run -d -p 8081:80 --name cybersecurity-app-test cybersecurity-website:latest'
                    echo 'Application deployed to test environment. Accessible at http://localhost:8081'
                }
            }
        }

        stage('Release') { // Promote the application to a production environment
            steps {
                script {
                    echo 'Promoting application to production environment (local Docker container simulation)...'
                    def version = "1.0.${env.BUILD_NUMBER}"
                    echo "Tagging Docker image as cybersecurity-website:${version}"
                    bat "docker tag cybersecurity-website:latest cybersecurity-website:${version}"

                    // Stop and remove previous production container
                    bat 'docker stop cybersecurity-app-prod || true'
                    bat 'docker rm cybersecurity-app-prod || true'
                    // Run the versioned Docker image for "production" on a different port
                    bat "docker run -d -p 8082:80 --name cybersecurity-app-prod cybersecurity-website:${version}"
                    echo "Application released as version 1.0.${env.BUILD_NUMBER} to 'production'. Accessible at http://localhost:8082/"
                }
            }
        }

        stage('Monitoring') { // Monitor the application in production
            steps {
                script {
                    echo 'Performing health check on production application...'
                    def healthCheckUrl = 'http://localhost:8082/health' // Assuming your app has a /health endpoint
                    try {
                        // Use curl to check the health endpoint.
                        // --fail will cause curl to exit with a non-zero code on HTTP errors (4xx/5xx)
                        // --silent to suppress progress meter
                        // --output NUL to discard output in Windows
                        bat "curl --fail --silent --output NUL ${healthCheckUrl}"
                        echo "Production application health check PASSED for ${healthCheckUrl}."
                    } catch (Exception e) {
                        echo "Production application health check FAILED for ${healthCheckUrl}. Error: ${e.getMessage()}"
                        // Send an email alert for failure
                        mail bcc: '', body: "CRITICAL ALERT: Cybersecurity Forum Production Health Check FAILED. Build ${env.BUILD_NUMBER}. Check logs for details: ${env.BUILD_URL}", cc: '', from: 'jenkins@yourdomain.com', replyTo: '', subject: 'CRITICAL ALERT: Production Health Check Failed - Cybersecurity Forum', to: 'your_email@example.com'
                        error('Health check failed, alerting team.') // Fail the stage if health check fails
                    }
                }
            }
        }
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
            // You can add email notification for failure here as well
            // mail bcc: '', body: "Pipeline FAILED for Cybersecurity Forum. Build ${env.BUILD_NUMBER}. Check logs: ${env.BUILD_URL}", cc: '', from: 'jenkins@yourdomain.com', replyTo: '', subject: 'ALERT: Jenkins Pipeline Failed - Cybersecurity Forum', to: 'your_email@example.com'
        }
    }
}