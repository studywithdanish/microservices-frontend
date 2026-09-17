pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        CI = 'true'
        FRONTEND_IMAGE_NAME = 'blog-frontend'
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Toolchain') {
            steps {
                script {
                    if (!isUnix()) {
                        env.PATH = "D:\\Softwares;${env.PATH}"
                    }
                    runCommand('node --version')
                    runCommand('npm --version')
                    runCommand('docker --version')
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    runCommand('npm ci')
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    runCommand('npm run test:ci -- --runInBand')
                }
            }
        }

        stage('Production Dependency Audit') {
            steps {
                script {
                    runCommand('npm run security:audit')
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    runCommand('npm run build')
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    runCommand("docker build -t ${FRONTEND_IMAGE_NAME}:${DOCKER_IMAGE_TAG} -t ${FRONTEND_IMAGE_NAME}:latest .")
                }
            }
        }
    }

    post {
        success {
            archiveArtifacts artifacts: 'build/**', fingerprint: true
        }
        cleanup {
            cleanWs(deleteDirs: true, disableDeferredWipeout: true)
        }
    }
}

void runCommand(String command) {
    if (isUnix()) {
        sh command
    } else {
        bat command
    }
}
