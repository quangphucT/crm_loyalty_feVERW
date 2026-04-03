pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "phucitdev/next-app"
    }

    stages {
        stage('Build Docker') {
            steps {
                sh '''
                docker build \
                --build-arg NEXT_PUBLIC_API_URL=https://crm.singles \
                --build-arg NEXT_PUBLIC_PROVINCE_API_URL=https://provinces.open-api.vn/api \
                -t $DOCKER_IMAGE:latest .
                '''
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                        echo $PASS | docker login -u $USER --password-stdin
                        docker push $DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy VPS') {
            steps {
                sshagent(['vps-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no root@139.59.125.5 "
                        docker pull phucitdev/next-app:latest &&
                        docker-compose up -d
                        "
                    '''
                }
            }
        }
    }
}