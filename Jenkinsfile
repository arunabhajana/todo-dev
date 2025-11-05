pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-southeast-2'  // change to your AWS region
        EC2_INSTANCE_ID = '<YOUR_INSTANCE_ID>'  // e.g., i-0abcd1234ef56789
        PROJECT_DIR = '/home/ec2-user/todo-dev'
        GIT_BRANCH = 'main'
    }

    triggers {
        // Auto-trigger on every Git commit (webhook or polling)
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
            // Inject your Jenkins credentials into environment variables
            environment {
                AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
                AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
            }

            steps {
                echo 'Deploying to AWS EC2 instance using AWS CLI and SSM...'

                sh '''
                    echo "Getting EC2 public IP..."
                    EC2_PUBLIC_IP=$(aws ec2 describe-instances \
                        --instance-ids ${EC2_INSTANCE_ID} \
                        --query "Reservations[0].Instances[0].PublicIpAddress" \
                        --output text)

                    echo "EC2 Public IP: $EC2_PUBLIC_IP"

                    echo "Running deployment commands remotely using AWS SSM..."
                    aws ssm send-command \
                        --instance-ids ${EC2_INSTANCE_ID} \
                        --document-name "AWS-RunShellScript" \
                        --comment "Automated Deployment via Jenkins" \
                        --parameters 'commands=[
                            "cd ${PROJECT_DIR}",
                            "git pull origin ${GIT_BRANCH}",
                            "docker-compose build --no-cache",
                            "docker-compose up -d"
                        ]' \
                        --output text

                    echo "✅ Deployment command sent to EC2 successfully!"
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment completed successfully on AWS EC2!'
        }
        failure {
            echo '❌ Deployment failed. Check Jenkins logs for details.'
        }
    }
}
