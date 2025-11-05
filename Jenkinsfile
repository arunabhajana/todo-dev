pipeline {
    agent any

    environment {
        // --- EC2 Details ---
        EC2_USER = 'ubuntu'
        EC2_HOST = '13.55.52.73' // your EC2 Public IP or DNS
        PROJECT_DIR = '/home/ubuntu/todo-dev'
        GIT_BRANCH = 'main'

        // --- SSH Key Path (on Jenkins Windows host) ---
        // Use your actual .ppk or .pem key path
        SSH_KEY_PATH = 'C:\\ProgramData\\Jenkins\\.jenkins\\Test.pem'

        // --- Full path to PuTTY's plink.exe ---
        PLINK_PATH = 'C:\\Program Files\\PuTTY\\plink.exe'
    }

    triggers {
        // Auto trigger every git commit (or every minute fallback)
        pollSCM('* * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Deploy to EC2 via SSH') {
            steps {
                echo '🚀 Deploying app to EC2 via SSH...'

                bat """
                    echo Connecting to EC2 instance...
                    "${PLINK_PATH}" -i "${SSH_KEY_PATH}" -batch ${EC2_USER}@${EC2_HOST} ^
                    "cd ${PROJECT_DIR} && \
                    git pull origin ${GIT_BRANCH} && \
                    docker-compose build --no-cache && \
                    docker-compose up -d"
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
