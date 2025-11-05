pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
        EC2_INSTANCE_ID = '<YOUR_INSTANCE_ID>'
        PROJECT_DIR = '/home/ec2-user/todo-app'
        GIT_BRANCH = 'main'
    }

    triggers {
        pollSCM('* * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Fetching latest code from repository...'
                checkout scm
            }
        }

        stage('Deploy on AWS EC2 via AWS CLI') {
            environment {
                AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
                AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
            }
            steps {
                echo 'Deploying using AWS CLI and SSM from Windows...'
                bat """
                    echo Getting EC2 public IP...
                    for /f %%i in ('aws ec2 describe-instances --instance-ids ${EC2_INSTANCE_ID} --query "Reservations[0].Instances[0].PublicIpAddress" --output text') do set EC2_PUBLIC_IP=%%i
                    echo EC2 IP: %EC2_PUBLIC_IP%

                    echo Sending SSM command...
                    aws ssm send-command ^
                        --instance-ids ${EC2_INSTANCE_ID} ^
                        --document-name "AWS-RunShellScript" ^
                        --comment "Automated Deployment via Jenkins" ^
                        --parameters commands="cd ${PROJECT_DIR}",commands="git pull origin ${GIT_BRANCH}",commands="docker-compose build --no-cache",commands="docker-compose up -d" ^
                        --output text
                """
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully on AWS EC2!'
        }
        failure {
            echo '❌ Deployment failed. Check Jenkins logs for details.'
        }
    }
}
