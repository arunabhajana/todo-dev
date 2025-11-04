pipeline {
    agent any

    environment {
        // Replace with your instance details
        EC2_HOST = 'ec2-user@13.55.52.73'
        SSH_KEY_PATH = 'C:\ProgramData\Jenkins\.jenkins\Test.pem' // Path to your private key on Jenkins server
        PROJECT_DIR = '/home/ec2-user/todo-dev' // Path to your project on EC2
    }

    stages {
        stage('Deploy to AWS EC2') {
            steps {
                echo 'Deploying To-Do List app on AWS EC2...'

                // SSH into EC2 and execute commands remotely
                sh '''
                    ssh -o StrictHostKeyChecking=no -i ${SSH_KEY_PATH} ${EC2_HOST} << 'EOF'
                        cd ${PROJECT_DIR}
                        echo "Pulling latest code from Git..."
                        git pull origin main

                        echo "Rebuilding Docker images..."
                        docker-compose build --no-cache

                        echo "Starting containers..."
                        docker-compose up -d

                        echo "Deployment successful ✅"
                    EOF
                '''
            }
        }
    }

    post {
        success {
            echo 'AWS deployment completed successfully 🎉'
        }
        failure {
            echo 'Deployment failed ❌ — check Jenkins logs for details.'
        }
    }
}
