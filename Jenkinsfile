pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-southeast-2'  // Your AWS region
        EC2_INSTANCE_ID = 'i-085edd702ccaae6bf'  // Your EC2 ID
        PROJECT_DIR = '/home/ec2-user/todo-app'
        GIT_BRANCH = 'main'
    }

    triggers {
        pollSCM('* * * * *') // or use webhook trigger
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
                    for /f %%i in ('aws ec2 describe-instances --region ${AWS_DEFAULT_REGION} --instance-ids ${EC2_INSTANCE_ID} --query "Reservations[0].Instances[0].PublicIpAddress" --output text') do set EC2_PUBLIC_IP=%%i
                    echo EC2 IP: %EC2_PUBLIC_IP%

                    echo Sending SSM command to EC2...
                    aws ssm send-command ^
                        --region ${AWS_DEFAULT_REGION} ^
                        --instance-ids ${EC2_INSTANCE_ID} ^
                        --document-name "AWS-RunShellScript" ^
                        --comment "Automated Deployment via Jenkins" ^
                        --parameters "{\\"commands\\":[\\"cd ${PROJECT_DIR}\\", \\"git pull origin ${GIT_BRANCH}\\", \\"docker-compose build --no-cache\\", \\"docker-compose up -d\\"]}" ^
                        --output text

                    echo ✅ Deployment command sent successfully!
                """
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment command sent to EC2 successfully!'
        }
        failure {
            echo '❌ Deployment failed — check Jenkins logs for details.'
        }
    }
}
