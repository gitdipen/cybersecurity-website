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
                git branch: 'main', url: 'https://github.com/gitdipen/cybersecurity-website.git'
            }
        }
        stage('Install Backend Dependencies') {
            steps {
                script {
                    echo "Installing Node.js backend dependencies in './backend'..."
                    // Install production dependencies for your backend
                    sh 'npm install --prefix ./backend --production'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE}:latest"
                    // The '.' at the end means Dockerfile is in the current directory (project root)
                    sh "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }
        stage('Test (Simple Uptime Check)') {
            steps {
                script {
                    echo "No complex unit tests implemented for this simplified approach due to time constraints."
                    echo "Frontend is static, backend serves files and a health check."
                    echo "Testing will focus on successful deployment and health check availability."
                    // You could add simple linting here if you had ESLint configured for JS
                    // sh 'npx eslint ./js'
                }
            }
        }
        stage('Code Quality (SonarQube & Dependency-Check)') {
            steps {
                script {
                    echo "Running code quality analysis with SonarQube..."
                    // Use withSonarQubeEnv to apply SonarQube configuration from Jenkins
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        // Scan both the new backend code and your existing static files
                        // sonar.sources defines which directories/files SonarQube should analyze
                        sh 'sonar-scanner -Dsonar.projectKey=cybersecurity-website -Dsonar.sources=./backend,./css,./js,./index.html'
                    }
                    echo "Running Dependency-Check for known vulnerabilities..."
                    // Scans all project dependencies, including backend's node_modules
                    // '|| true' makes the step succeed even if vulnerabilities are found, to allow pipeline to continue
                    sh 'dependency-check --scan . --format HTML --output ./dependency-check-report.html || true'
                    echo "Code quality and dependency scans completed."
                }
            }
        }
        stage('Security Scan (Docker Image)') {
            steps {
                script {
                    echo "Running Docker image security scan with Trivy..."
                    // Trivy must be installed on your Jenkins agent.
                    // `--severity HIGH,CRITICAL` filters results to high-impact vulnerabilities.
                    sh "trivy image --severity HIGH,CRITICAL ${DOCKER_IMAGE}:latest || true"
                    echo "Docker image security scan completed."
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    echo "Stopping and removing existing container (if any) with name ${DOCKER_CONTAINER_NAME}..."
                    // Stop and remove existing container to prevent 'Conflict' error.
                    // '|| true' ensures the step doesn't fail if the container doesn't exist (e.g., first run).
                    sh "docker stop ${DOCKER_CONTAINER_NAME} || true"
                    sh "docker rm ${DOCKER_CONTAINER_NAME} || true"

                    echo "Deploying Docker image to local test environment on http://localhost:${APP_PORT}..."
                    // -d: Run in detached mode (background)
                    // -p: Publish container's port to host's port (host_port:container_port)
                    // --name: Assign a name to the container
                    sh "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE}:latest"
                    echo "Application deployed to http://localhost:${APP_PORT}"
                }
            }
        }
        stage('Release (Optional - Tagging/Pushing)') {
            steps {
                script {
                    echo "Simulating release activities (e.g., tagging Docker image, pushing to Docker Hub)..."
                    // This stage is typically for pushing to a production registry like Docker Hub
                    // Example: sh "docker tag ${DOCKER_IMAGE}:latest your_registry/repo/${DOCKER_IMAGE}:$(git rev-parse --short HEAD)"
                    // Example: sh "docker push your_registry/repo/${DOCKER_IMAGE}:latest"
                }
            }
        }
        stage('Monitoring') {
            steps {
                script {
                    echo "Performing application health check via API endpoint..."
                    // Give the container some time to start up and the Node.js server to be ready
                    sleep 15 // Wait for 15 seconds
                    // Use curl to hit the new /api/health endpoint.
                    // '-f' makes curl fail if the HTTP status code is 4xx or 5xx, ensuring the stage fails on error.
                    sh "curl -f http://localhost:${APP_PORT}/api/health"
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
            // Ensure the Jenkins workspace is cleaned up after every build, regardless of success or failure.
            cleanWs()
            echo "Workspace cleaned."
        }
        success {
            echo 'Pipeline completed successfully!'
            // Add success-specific notifications (e.g., Slack, email)
        }
        failure {
            echo 'Pipeline failed! Please check logs for details.'
            // Add failure-specific notifications (e.g., critical alerts)
        }
    }
}