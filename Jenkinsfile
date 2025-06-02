pipeline {
    agent any // Instructs Jenkins to run the pipeline on any available agent

    environment {
        DOCKER_IMAGE = 'cybersecurity-website' // Name for your Docker image
        DOCKER_CONTAINER_NAME = 'cybersecurity-app' // Name for your Docker container
        APP_PORT = '8081' // The port your application will run on (internal and external)
        SONARQUBE_SERVER = 'SonarQube Local' // The name of your SonarQube server configuration in Jenkins
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code from Git...'
                git branch: 'main', url: 'https://github.com/gitdipen/cybersecurity-website.git'
            }
        }

        // Install Backend Dependencies stage (assuming you want to keep the backend part)
        // If your current focus is ONLY on the static site, and you want to remove this, let me know.
        // Based on your previous context, you were trying to integrate a Node.js backend.
        stage('Install Backend Dependencies') {
            steps {
                script {
                    echo "Installing backend dependencies..."
                    dir('backend') { // Assuming your backend's package.json is in a 'backend' folder
                        bat 'npm install'
                    }
                    echo "Backend dependencies installed."
                }
            }
        }

        stage('Build') { // Renamed from 'Build Docker Image' to match your console output
            steps {
                script {
                    echo "Building Docker image..."
                    dir('.') { // Ensure you are in the root of the workspace for Dockerfile
                        bat "docker build -t ${DOCKER_IMAGE}:latest ."
                    }
                    echo "Docker image built: ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo "Running basic tests (checking if index.html exists)"
                    // This checks for the file existence in the Jenkins workspace
                    bat "dir index.html"
                    echo "Basic file existence test passed."
                }
            }
        }

        stage('Code Quality') {
            steps {
                script {
                    echo "Running SonarQube analysis..."
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        // Ensure 'SonarScanner' is configured under Manage Jenkins -> Tools -> SonarQube Scanner installations
                        tool 'SonarScanner' // This line tells Jenkins to make the SonarScanner tool available

                        // The sonar-scanner command, using properties.
                        // ProjectKey and sources are important. Assuming '.' scans the whole workspace.
                        // You can adjust -Dsonar.sources if you only want to scan specific folders (e.g., -Dsonar.sources=./backend,./css,./js)
                        bat """
                            sonar-scanner \\
                                -Dsonar.projectKey=Cybersecurity-Website \\
                                -Dsonar.sources=. \\
                                -Dsonar.host.url=http://localhost:9000 \\
                                -Dsonar.login=%SONAR_TOKEN%
                        """
                        // Note: SONAR_TOKEN is automatically injected by withSonarQubeEnv and Jenkins Credentials
                        // The backslashes '\\' are for multiline command in bat, adjust if needed for clarity on your system.
                    }
                    echo "SonarQube analysis complete. Check SonarQube dashboard for results."
                }
            }
        }

        stage('Security') {
            steps {
                script {
                    echo "Running OWASP Dependency-Check for security analysis..."

                    // **FIX: Explicitly create the 'target' directory before generating reports**
                    bat 'mkdir target || true' // '|| true' ensures command succeeds even if dir exists

                    // Ensure 'DependencyCheck' is configured under Manage Jenkins -> Tools -> Dependency-Check installations
                    tool 'DependencyCheck' // This makes the Dependency-Check tool available on the PATH

                    // Execute Dependency-Check.
                    // --scan . : Scans the entire current workspace
                    // --format HTML : Specifies HTML report format
                    // --output ./target/dependency-check-report.html : Directs output to the 'target' directory
                    // || true : This makes the 'bat' command succeed even if Dependency-Check finds vulnerabilities,
                    //          allowing the HTML report to be generated and published.
                    bat 'dependency-check --scan . --format HTML --output ./target/dependency-check-report.html || true'

                    echo "OWASP Dependency-Check complete. Check the generated HTML report."

                    // Publish the HTML report
                    publishHTML(target: [
                        allowMissing: false, // Set to 'true' if the report might sometimes be genuinely missing (e.g., no vulnerabilities found, no file generated)
                        reportDir: 'target', // Directory where the report is generated by Dependency-Check
                        reportFiles: 'dependency-check-report.html', // The name of the generated HTML report file
                        keepAll: true,
                        alwaysLinkToLastBuild: true,
                        reportName: 'Dependency-Check Report'
                    ])
                }
            }
        }

        // You previously had a Trivy stage for Docker image scanning
        // If you want to re-enable it, ensure Trivy CLI is available on the Jenkins agent's PATH
        /*
        stage('Security Scan (Docker Image)') {
            steps {
                script {
                    echo "Running Trivy scan on Docker image: ${DOCKER_IMAGE}:latest..."
                    // This assumes Trivy CLI is installed on the Jenkins agent
                    // Add '|| true' to ensure the pipeline doesn't fail on findings, but still produces output
                    bat "trivy image --severity HIGH,CRITICAL --format json -o trivy-report.json ${DOCKER_IMAGE}:latest || true"
                    echo "Trivy scan complete. Check trivy-report.json for results."
                    // You might want to archive this JSON report
                    archiveArtifacts artifacts: 'trivy-report.json', fingerprint: true
                }
            }
        }
        */

        stage('Deploy') {
            steps {
                script {
                    echo "Stopping and removing existing container (if any) with name ${DOCKER_CONTAINER_NAME}..."
                    bat "docker stop ${DOCKER_CONTAINER_NAME} || true" // Stop container if running
                    bat "docker rm ${DOCKER_CONTAINER_NAME} || true"  // Remove container if it exists

                    echo "Deploying Docker image to local test environment on http://localhost:${APP_PORT}..."
                    // Assuming your Dockerfile exposes port 80 for the web server
                    bat "docker run -d -p ${APP_PORT}:80 --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE}:latest"
                    echo "Application deployed to http://localhost:${APP_PORT}"
                }
            }
        }

        stage('Release') { // Simulating promotion to production, add actual steps as needed
            steps {
                echo "Simulating promotion to production..."
                // Example: docker push ${DOCKER_IMAGE}:latest
                // Example: git tag v1.0.0
            }
        }

        stage('Monitoring') {
            steps {
                script {
                    echo "Performing simple uptime check..."
                    sleep 15 // Wait for 15 seconds for the container to start
                    // Assuming your application serves an endpoint at /index.html or similar
                    // If you have a backend, you'd check its health endpoint (e.g., /api/health)
                    bat "curl -f http://localhost:${APP_PORT}/index.html"
                    echo "Application health check passed. Application is responsive."
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