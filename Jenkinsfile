// Jenkinsfile for Cybersecurity Website DevOps Pipeline

pipeline {
    agent any // Run on any available agent

    environment {
        SONAR_PROJECT_KEY = 'Cybersecurity-Website' // SonarQube project key
        SONAR_SCANNER_HOME = tool 'SonarScanner' // SonarScanner tool configured in Jenkins Global Tool Configuration
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Cloning the Git repository...'
                    // Replace 'github-credentials' with your actual credentials ID if private repo, else remove credentialsId for public repo
                    git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/gitdipen/cybersecurity-website.git'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo 'Building Docker image...'
                    dir('.') {
                        bat 'docker build -t cybersecurity-website:latest .'
                    }
                    echo 'Docker image built: cybersecurity-website:latest'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    echo 'Running basic tests (checking if index.html exists)'
                    bat 'dir index.html'
                    echo 'Basic file existence test passed.'
                }
            }
        }

        stage('Code Quality') {
            environment {
                SONARQUBE_URL = 'http://localhost:9000' // Update if your SonarQube server is different
            }
            steps {
                script {
                    echo 'Running SonarQube analysis...'
                    // This will inject SonarQube server environment variables
                    withSonarQubeEnv('SonarQube Local') {
                        // Inject token securely from Jenkins credentials store
                        withCredentials([string(credentialsId: 'sonarqube-server-token', variable: 'SONAR_TOKEN')]) {
                            bat """
                            "${SONAR_SCANNER_HOME}\\bin\\sonar-scanner.bat" ^
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} ^
                            -Dsonar.sources=. ^
                            -Dsonar.host.url=${env.SONARQUBE_URL} ^
                            -Dsonar.login=${SONAR_TOKEN}
                            """
                        }
                    }
                    echo 'SonarQube analysis complete. Check SonarQube dashboard for results.'
                }
            }
        }

        stage('Security') {
            steps {
                script {
                    echo 'Running OWASP Dependency-Check for security analysis...'
                    dependencyCheck additionalArguments: '--project "Cybersecurity Website" --format HTML --scan .', odcInstallation: 'DependencyCheck'
                    echo 'OWASP Dependency-Check complete. Check the generated HTML report.'
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'target', // default output directory of Dependency-Check
                        reportFiles: 'dependency-check-report.html',
                        reportName: 'Dependency-Check Report'
                    ])
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying Docker image to local test environment...'
                    bat 'docker stop cybersecurity-app || true'
                    bat 'docker rm cybersecurity-app || true'
                    bat 'docker run -d -p 8081:80 --name cybersecurity-app cybersecurity-website:latest'
                    echo 'Application deployed to http://localhost:8081'
                }
            }
        }

        // Optional stages for higher HD grades (commented out)
        /*
        stage('Release') {
            steps {
                echo 'Simulating promotion to production...'
                // Push Docker image to registry and deploy to production environment
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Simulating monitoring and alerting...'
                // Integrate with monitoring tools like Datadog or New Relic
            }
        }
        */
    }

    post {
        always {
            echo 'Pipeline finished.'
            cleanWs() // Clean workspace
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
