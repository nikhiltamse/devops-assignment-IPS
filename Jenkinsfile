pipeline {
    agent any

    environment {
        IMAGE_NAME = 'devops-assignment'
        DOCKER_REGISTRY = 'iamdragonrider'
        DEV_SERVER = credentials('DEV_SERVER_SSH')
        PROD_SERVER = credentials('PROD_SERVER_SSH')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def tag = env.BRANCH_NAME == 'main' ? 'prod' : 'dev'
                    sh "docker build --build-arg NODE_ENV=${tag} -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${tag} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        def tag = env.BRANCH_NAME == 'main' ? 'prod' : 'dev'
                        sh """
                            echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                            docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${tag}
                        """
                    }
                }
            }
        }

        stage('Deploy to Dev') {
            when {
                branch 'dev'
            }
            steps {
                sshagent(credentials: ['DEV_SERVER_SSH']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@\$DEV_SERVER '
                            docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}:dev &&
                            docker stop app-dev || true &&
                            docker rm app-dev || true &&
                            docker run -d --name app-dev -p 3000:3000 -e NODE_ENV=development ${DOCKER_REGISTRY}/${IMAGE_NAME}:dev
                        '
                    """
                }
            }
        }

        stage('Approval - Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    input message: 'Deploy to Production?', ok: 'Approve'
                }
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                sshagent(credentials: ['PROD_SERVER_SSH']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@\$PROD_SERVER '
                            docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}:prod &&
                            docker stop app-prod || true &&
                            docker rm app-prod || true &&
                            docker run -d --name app-prod -p 3000:3000 -e NODE_ENV=production ${DOCKER_REGISTRY}/${IMAGE_NAME}:prod
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully for branch: ${env.BRANCH_NAME}"
        }
        failure {
            echo "Pipeline failed for branch: ${env.BRANCH_NAME}"
        }
    }
}
