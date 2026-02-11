Connecting to an AWS EC2 Instance Using SSH
===========================================

**Production-Grade Guide**

1\. Overview
------------

Secure Shell (SSH) is used to remotely access Linux-based EC2 instances.Authentication is performed using an AWS-generated private key (.pem file) created at the time of instance launch.

A successful SSH connection requires:

*   Correct private key
    
*   Correct username (based on AMI)
    
*   Open port 22 in Security Group
    
*   Proper key file permissions
    
*   Correct public IP/DNS
    

2\. Prerequisites Checklist
---------------------------

Before attempting connection, verify the following:

RequirementVerification MethodEC2 instance is runningEC2 → Instance State = RunningPublic IP or Public DNS availableEC2 → Networking tabPort 22 allowedSecurity Group → Inbound RulesPrivate key file availableConfirm .pem exists locallyCorrect AMI usernameUbuntu → ubuntu, Amazon Linux → ec2-user

3\. Standard SSH Command (Recommended Method)
---------------------------------------------

This is the only command required when everything is configured correctly:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ssh -i "C:\Users\FAIZAL\Downloads\faizKey.pem" ubuntu@3.104.104.24   `

### Command Breakdown

*   ssh → Secure Shell client
    
*   \-i → Specifies the private key file
    
*   faizKey.pem → Your AWS key pair file
    
*   ubuntu → Default username for Ubuntu AMI
    
*   3.104.104.24 → Public IP of EC2 instance
    

If configured properly, connection will succeed immediately.

4\. Key Permission Requirements (Linux / WSL / Git Bash)
--------------------------------------------------------

On Linux-based systems, SSH enforces strict key permissions.

Set correct permissions:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   chmod 400 faizKey.pem   `

### Why This Is Required

SSH refuses to use a key if:

*   It is accessible by other users
    
*   It has write permissions enabled
    

400 means:

*   Read-only for owner
    
*   No permissions for group or others
    

If permissions are incorrect, you will see:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Permissions 0644 for 'faizKey.pem' are too open.   `

On native Windows CMD, this check is usually not enforced strictly.On Linux systems, it is mandatory.

5\. First-Time Connection Behavior
----------------------------------

When connecting to a host for the first time, you will see:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Are you sure you want to continue connecting (yes/no)?   `

This is SSH verifying the server fingerprint.

After typing yes:

*   ~/.ssh/known\_hosts
    
*   You will not see this prompt again unless:
    
    *   The server is rebuilt
        
    *   The IP changes
        
    *   The fingerprint changes
        

In enterprise environments, fingerprints should be verified before accepting.

6\. Common Failure Scenarios
----------------------------

### 1\. Permission Denied (Publickey)

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Permission denied (publickey)   `

Causes:

*   Wrong username
    
*   Wrong key file
    
*   Key not provided with -i
    
*   Instance launched with different key pair
    

### 2\. Connection Timed Out

Cause:

*   Port 22 blocked in Security Group
    
*   Wrong public IP
    
*   Network ACL blocking traffic
    

Check:EC2 → Security Group → Inbound → SSH → Port 22 → Source

### 3\. Key File Not Found

Cause:

*   Incorrect file path
    
*   Quotation marks missing when path contains spaces
    

Correct format:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ssh -i "C:\Path With Spaces\key.pem" ubuntu@IP   `

7\. Username Reference by AMI
-----------------------------

AMI TypeDefault UsernameUbuntuubuntuAmazon Linuxec2-userRHELec2-userDebianadminCentOScentos

Using the wrong username results in authentication failure.

8\. Security Best Practices (Production Environments)
-----------------------------------------------------

A senior DevOps approach includes:

*   Source: My IPNot:0.0.0.0/0
    
*   Never share .pem files
    
*   Never commit keys to Git
    
*   Rotate key pairs periodically
    
*   Use Bastion Host or SSM Session Manager for production
    

9\. Internal SSH Authentication Flow (How It Actually Works)
------------------------------------------------------------

1.  SSH client sends public key fingerprint
    
2.  /home/ubuntu/.ssh/authorized\_keys
    
3.  If match found → authentication succeeds
    
4.  If no match → access denied
    

AWS automatically places the public key in authorized\_keys during instance creation.

10\. Final Summary
------------------

If everything is configured correctly, only one command is required:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ssh -i key.pem username@public-ip   `

All other steps (permissions, security groups, fingerprint verification) exist to:

*   Enforce security
    
*   Prevent misconfiguration
    
*   Troubleshoot failures
    
*   Meet production standards