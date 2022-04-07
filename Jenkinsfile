node {

    load "$JENKINS_HOME/.envvars"
    def exists=fileExists "src/server/package-lock.json"
    def exists2=fileExists "src/client/package-lock.json"
    def application_name= "app_cempa"

        stage('Checkout') {
            git branch: 'develop',
            url: 'https://github.com/lapig-ufg/map-cempa.git'
        }
        stage('Validate') {
            sh 'git pull origin develop'

        }
        stage('SonarQube analysis') {

		def scannerHome = tool 'sonarqube-scanner';
                    withSonarQubeEnv("sonarqube") {
                    sh "${tool("sonarqube-scanner")}/bin/sonar-scanner \
                    -Dsonar.projectKey=map-cempa \
                    -Dsonar.sources=. \
                    -Dsonar.css.node=. \
                    -Dsonar.host.url=$SonarUrl \
                    -Dsonar.login=$SonarKeyProject"
                    }
        }
        stage('Build') {
                        //INSTALL NVM BINARY AND INSTALL NODE VERSION AND USE NODE VERSION
                        nvm(nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/master/install.sh', 
                        nvmIoJsOrgMirror: 'https://iojs.org/dist',
                        nvmNodeJsOrgMirror: 'https://nodejs.org/dist', 
                        version: NODE_VERSION) {
                        //BUILD APPLICATION 
                        echo "Build main site distribution"
                        sh "npm set progress=false"
                        if (exists) {
                            echo 'Yes'
                            sh "cd src/server && npm ci" 
                        } else {
                            echo 'No'
                            sh "cd src/server && npm install" 
                        }
                        if (exists2) {
                            echo 'Yes'
                            sh "cd src/client && npm ci"
                        } else {
                            echo 'No'
                            sh "cd src/client && npm install" 
                        }

                        //VERIFY IF BUILD IS COMPLETE AND NOTIFY IN DISCORD ABOUT OF THE RESULT
                        sh "export NODE_OPTIONS=--max-old-space-size=8096"
                        def status = sh(returnStatus: true, script: "cd src/client &&  ng build --stats-json --source-map=false --no-progress")
                        if (status != 0) {
                            echo "FAILED BUILD!"
                            currentBuild.result = 'FAILED'
                            def discordImageSuccess = 'https://www.jenkins.io/images/logos/formal/256.png'
                            def discordImageError = 'https://www.jenkins.io/images/logos/fire/256.png'
                        
                            def Author_Name=sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                            def Author_Email=sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                            def Author_Data=sh(script: "git log -1 --format=%cd --date=local",returnStdout: true).trim()
                            def Project_Name=sh(script: "git config --local remote.origin.url",returnStdout: true).trim()
                            def Last_Commit=sh(script: "git show --summary | grep 'commit' | awk '{print \$2}'",returnStdout: true).trim()
                            def Comment_Commit=sh(script: "git log -1 --pretty=%B",returnStdout: true).trim()
                            def Date_Commit=sh(script: "git show -s --format=%ci",returnStdout: true).trim()

                            def discordDesc =
                                    "Result: ${currentBuild.currentResult}\n" +
                                            "Project: $Project_Name\n" +
                                            "Commit: $Last_Commit\n" +
                                            "Author: $Author_Name\n" +
                                            "Author_Email: $Author_Email\n" +
                                            "Message: $Comment_Commit\n" +
                                            "Date: $Date_Commit\n" +
                                            "Duration: ${currentBuild.durationString}"

                                            //Variaveis de ambiente do Jenkins - NOME DO JOB E NÚMERO DO JOB
                                            def discordFooter = "${env.JOB_BASE_NAME} (#${BUILD_NUMBER})"
                                            def discordTitle = "${env.JOB_BASE_NAME} (build #${BUILD_NUMBER})"
                                            def urlWebhook = "https://discord.com/api/webhooks/$DiscordKey"

                            discordSend description: discordDesc,
                                    footer: discordFooter,
                                    link: env.JOB_URL,
                                    result: currentBuild.currentResult,
                                    title: discordTitle,
                                    webhookURL: urlWebhook,
                                    successful: currentBuild.resultIsBetterOrEqualTo('SUCCESS'),
                                    thumbnail: 'SUCCESS'.equals(currentBuild.currentResult) ? discordImageSuccess : discordImageError      
                            autoCancelled = true
                            error('Aborting the build.')        
    }                               

                }
        }
        stage('Building Image') {
            dockerImage = docker.build registryhomol + "/$application_name:$BUILD_NUMBER"
        }
        stage('Push Image to Registry') {

            docker.withRegistry( "$Url_Private_Registry", "$registryCredential" ) {
            dockerImage.push("${env.BUILD_NUMBER}")
            dockerImage.push("latest")

                }   

            }
        stage('Removing image Locally') {
            sh "docker rmi $registryhomol/$application_name:$BUILD_NUMBER"
            sh "docker rmi $registryhomol/$application_name:latest"
        }

        stage ('Pull imagem on DEV') {
        sshagent(credentials : ['KEY_FULL']) {
            sh "$SERVER_HOMOL_SSH 'docker pull $registryhomol/$application_name:latest'"
                }
            
        }

        stage('Deploy container on DEV') {

                        configFileProvider([configFile(fileId: "$File_Json_Id_APP_CEMPA_HOMOL", targetLocation: 'container-map-cempa-deploy-homol.json')]) {

                            def url = "http://$SERVER_HOMOL/containers/$application_name?force=true"
                            def response = sh(script: "curl -v -X DELETE $url", returnStdout: true).trim()
                            echo response

                            url = "http://$SERVER_HOMOL/containers/create?name=$application_name"
                            response = sh(script: "curl -v -X POST -H 'Content-Type: application/json' -d @container-map-cempa-deploy-homol.json -s $url", returnStdout: true).trim()
                            echo response
                        }

            }            
        stage('Start container on DEV') {

                        final String url = "http://$SERVER_HOMOL/containers/$application_name/start"
                        final String response = sh(script: "curl -v -X POST -s $url", returnStdout: true).trim()
                        echo response                    


            }                      
        stage('Send message to Discord') {

                       //SEND DISCORD NOTIFICATION
                        def discordImageSuccess = 'https://www.jenkins.io/images/logos/formal/256.png'
                        def discordImageError = 'https://www.jenkins.io/images/logos/fire/256.png'
                        
                        def Author_Name=sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                        def Author_Email=sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                        def Author_Data=sh(script: "git log -1 --format=%cd --date=local",returnStdout: true).trim()
                        def Project_Name=sh(script: "git config --local remote.origin.url",returnStdout: true).trim()
                        def Last_Commit=sh(script: "git show --summary | grep 'commit' | awk '{print \$2}'",returnStdout: true).trim()
                        def Comment_Commit=sh(script: "git log -1 --pretty=%B",returnStdout: true).trim()
                        def Date_Commit=sh(script: "git show -s --format=%ci",returnStdout: true).trim()

                        def discordDesc =
                                "Result: ${currentBuild.currentResult}\n" +
                                        "Project: $Project_Name\n" +
                                        "Commit: $Last_Commit\n" +
                                        "Author: $Author_Name\n" +
                                        "Author_Email: $Author_Email\n" +
                                        "Message: $Comment_Commit\n" +
                                        "Date: $Date_Commit\n" +
                                        "Duration: ${currentBuild.durationString}"

                                        //Variaveis de ambiente do Jenkins - NOME DO JOB E NÚMERO DO JOB
                                        def discordFooter = "${env.JOB_BASE_NAME} (#${BUILD_NUMBER})"
                                        def discordTitle = "${env.JOB_BASE_NAME} (build #${BUILD_NUMBER})"
                                        def urlWebhook = "https://discord.com/api/webhooks/$DiscordKey"

                        discordSend description: discordDesc,
                                footer: discordFooter,
                                link: env.JOB_URL,
                                result: currentBuild.currentResult,
                                title: discordTitle,
                                webhookURL: urlWebhook,
                                successful: currentBuild.resultIsBetterOrEqualTo('SUCCESS'),
                                thumbnail: 'SUCCESS'.equals(currentBuild.currentResult) ? discordImageSuccess : discordImageError              

            }         



        }
