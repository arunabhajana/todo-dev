pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '13.55.52.73' // replace with your EC2 Public IP or DNS
        SSH_KEY_PATH = 'C:\\ProgramData\\Jenkins\\.jenkins\\Test.pem' // path to your private key on Jenkins
        PROJECT_DIR = '/home/ubuntu/todo-dev'
        GIT_BRANCH = 'main'
    }

    triggers {
        // Trigger every commit or every minute via SCM polling
        pollSCM('* * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Deploy to EC2 via SSH') {
            steps {
                echo 'Deploying app to EC2 via SSH...'
                bat """
                    echo Connecting to EC2...
                    plink -i "${SSH_KEY_PATH}" -batch ${EC2_USER}@${EC2_HOST} ^
                    "cd ${PROJECT_DIR} && git pull origin ${GIT_BRANCH} && docker-compose build --no-cache && docker-compose up -d"
                """
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully on EC2!'
        }
        failure {
            echo '❌ Deployment failed — check Jenkins logs for details.'
        }
    }
}
