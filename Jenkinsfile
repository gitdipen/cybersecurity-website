pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'cybersecurity-app-website'
        DOCKER_CONTAINER_NAME = 'cybersecurity-app'
        APP_PORT = '8081' // The port your Node.js server will run on inside the container
        SONARQUBE_SERVER = 'SonarQube' // Your SonarQube server configuration name in Jenkins
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code from Git...'
                git branch: 'main', url: 'https://github.com/gitdipen/cybersecurity-website.git'
            }
        }
        stage('Install Backend Dependencies') {
            steps {
                script {
                    echo "Installing Node.js backend dependencies in './backend'..."
                    sh 'npm install --prefix ./backend --production'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE}:latest"
                    sh "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }
        stage('Test (Simple Uptime Check)') {
            steps {
                script {
                    echo "No complex unit tests due to time constraints, relying on server uptime check later."
                    echo "This stage could contain frontend linting or basic broken link checks if desired."
                }
            }
        }
        stage('Code Quality (SonarQube & Dependency-Check)') {
            steps {
                script {
                    echo "Running code quality analysis with SonarQube..."
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        // Ensure SonarQube scans all relevant code, including the new backend folder
                        // If you kept frontend in root, sonar.sources=./backend,./css,./js,./index.html
                        sh 'sonar-scanner -Dsonar.projectKey=cybersecurity-website -Dsonar.sources=./backend,./'
                    }
                    echo "Running Dependency-Check for known vulnerabilities..."
                    sh 'dependency-check --scan . --format HTML --output ./dependency-check-report.html || true'
                    echo "Code quality and dependency scans completed."
                }
            }
        }
        stage('Security Scan (Docker Image)') {
            steps {
                script {
                    echo "Running Docker image security scan with Trivy..."
                    // This assumes Trivy is installed on your Jenkins agent.
                    // `--exit-code 1` could be added to fail the build on critical vulnerabilities.
                    sh "trivy image --severity HIGH,CRITICAL ${DOCKER_IMAGE}:latest || true"
                    echo "Docker image security scan completed."
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    echo "Stopping and removing existing container (if any)..."
                    sh "docker stop ${DOCKER_CONTAINER_NAME} || true"
                    sh "docker rm ${DOCKER_CONTAINER_NAME} || true"

                    echo "Deploying Docker image to local test environment on http://localhost:${APP_PORT}..."
                    sh "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE}:latest"
                    echo "Application deployed to http://localhost:${APP_PORT}"
                }
            }
        }
        stage('Release (Optional - Tagging/Pushing)') {
            steps {
                script {
                    echo "Simulating release activities (e.g., tagging image, pushing to Docker Hub)..."
                }
            }
        }
        stage('Monitoring') {
            steps {
                script {
                    echo "Performing application health check via API endpoint..."
                    sleep 10 // Give the container a moment to start
                    // Curl the new /api/health endpoint. -f ensures failure if status code is not 2xx.
                    sh "curl -f http://localhost:${APP_PORT}/api/health"
                    echo "Application health check passed via API endpoint. Server is responsive."
                }
            }
        }
        stage('Post Actions') {
            steps {
                script {
                    echo "Executing post-deployment actions..."
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