pipeline {
    agent any // Instructs Jenkins to run the pipeline on any available agent

    environment {
        DOCKER_IMAGE = 'cybersecurity-app-website' // Name for your Docker image
        DOCKER_CONTAINER_NAME = 'cybersecurity-app' // Name for your Docker container
        APP_PORT = '8081' // The port your static web server (inside container and mapped from host) will run on
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code from Git...'
                git branch: 'main', url: 'https://github.com/gitdipen/cybersecurity-website.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${DOCKER_IMAGE}:latest"
                    // This command will look for a Dockerfile in the root of your workspace.
                    // Ensure your Dockerfile is designed to serve static content.
                    bat "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    echo "Stopping and removing existing container (if any) with name ${DOCKER_CONTAINER_NAME}..."
                    bat "docker stop ${DOCKER_CONTAINER_NAME} || true" // Stop container if it's running
                    bat "docker rm ${DOCKER_CONTAINER_NAME} || true"  // Remove container if it exists

                    echo "Deploying Docker image to local test environment on http://localhost:${APP_PORT}..."
                    bat "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE}:latest"
                    echo "Application deployed to http://localhost:${APP_PORT}"
                }
            }
        }
        stage('Monitoring') {
            steps {
                script {
                    echo "Performing simple uptime check for static website..."
                    sleep 15 // Wait for 15 seconds to ensure the container is fully up and serving content
                    // This curl command checks if the main index.html file is accessible.
                    // If your static files are not at the root or are served differently, adjust this URL.
                    bat "curl -f http://localhost:${APP_PORT}/index.html"
                    echo "Application health check passed. Static website is responsive."
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