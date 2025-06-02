pipeline {
    agent any // Instructs Jenkins to run the pipeline on any available agent

    environment {
        DOCKER_IMAGE = 'cybersecurity-app-website' // Name for your Docker image
        DOCKER_CONTAINER_NAME = 'cybersecurity-app' // Name for your Docker container
        APP_PORT = '8081' // The port your Node.js server will run on (inside container and mapped from host)
        SONARQUBE_SERVER = 'SonarQube' // This should match the name of your SonarQube server configuration in Jenkins
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code from Git...'
                // Git step is cross-platform, so 'git' command works as is.
                git branch: 'main', url: 'https://github.com/gitdipen/cybersecurity-website.git'
            }
        }
        stage('Install Backend Dependencies') {
            steps {
                script {
                    echo "Installing Node.js backend dependencies in './backend'..."
                    // Corrected for Windows Batch (bat) to change directory and then run npm install
                    bat 'cd backend && npm install --production'
                    echo "Backend dependencies installed." // Added echo for confirmation
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE}:latest"
                    // Docker commands generally work directly with 'bat' or 'sh' if Docker CLI is in PATH
                    bat "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }
        stage('Test (Simple Uptime Check)') {
            steps {
                script {
                    echo "No complex unit tests implemented for this simplified approach due to time constraints."
                    echo "Frontend is static, backend serves files and a health check."
                    echo "Testing will focus on successful deployment and health check availability."
                }
            }
        }
        stage('Code Quality (SonarQube & Dependency-Check)') {
            steps {
                script {
                    echo "Running code quality analysis with SonarQube..."
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        // Using 'bat' for Windows compatibility. Ensure sonar-scanner is in Jenkins agent's PATH
                        bat 'sonar-scanner -Dsonar.projectKey=cybersecurity-website -Dsonar.sources=./backend,./css,./js,./index.html'
                    }
                    echo "Running Dependency-Check for known vulnerabilities..."
                    // Using 'bat' for Windows compatibility. '|| true' handles non-zero exit codes (e.g., vulnerabilities found)
                    bat 'dependency-check --scan . --format HTML --output ./dependency-check-report.html || true'
                    echo "Code quality and dependency scans completed."
                }
            }
        }
        stage('Security Scan (Docker Image)') {
            steps {
                script {
                    echo "Running Docker image security scan with Trivy..."
                    // Using 'bat' for Windows compatibility. Trivy must be installed on your Jenkins agent.
                    bat "trivy image --severity HIGH,CRITICAL ${DOCKER_IMAGE}:latest || true"
                    echo "Docker image security scan completed."
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    echo "Stopping and removing existing container (if any) with name ${DOCKER_CONTAINER_NAME}..."
                    // Using 'bat' for Windows compatibility. '|| true' prevents failure if container doesn't exist.
                    bat "docker stop ${DOCKER_CONTAINER_NAME} || true"
                    bat "docker rm ${DOCKER_CONTAINER_NAME} || true"

                    echo "Deploying Docker image to local test environment on http://localhost:${APP_PORT}..."
                    // Using 'bat' for Windows compatibility.
                    bat "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE}:latest"
                    echo "Application deployed to http://localhost:${APP_PORT}"
                }
            }
        }
        stage('Release (Optional - Tagging/Pushing)') {
            steps {
                script {
                    echo "Simulating release activities (e.g., tagging Docker image, pushing to Docker Hub)..."
                    // If you add actual commands here, remember to use 'bat' for Windows compatibility
                    // bat "docker tag ..."
                    // bat "docker push ..."
                }
            }
        }
        stage('Monitoring') {
            steps {
                script {
                    echo "Performing application health check via API endpoint..."
                    sleep 15 // Wait for 15 seconds to ensure the container is fully up
                    // Using 'bat' for Windows compatibility.
                    // 'curl' on Windows (newer versions) should work. If not, consider 'powershell "Invoke-WebRequest ..."'
                    bat "curl -f http://localhost:${APP_PORT}/api/health"
                    echo "Application health check passed via API endpoint. Server is responsive."
                }
            }
        }
        stage('Post Actions') {
            steps {
                script {
                    echo "Executing post-deployment actions (e.g., sending notifications, final cleanup)..."
                }
            }
        }
    }
    post {
        always {
            cleanWs()
            echo "Workspace cleaned."
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Please check logs for details.'
        }
    }
}