# Lab 2: Foundation Infrastructure

## Introduction

XXX

Estimated Lab Time: XX minutes

### Prerequisites

* An Oracle Free Tier, Paid or LiveLabs Cloud Account
* Active Oracle Cloud Account with available credits to use for Data Science service.

## Task 1: Set up Terraform configuration file

1. From the **Cloud Shell**, run this command.
    
    ```bash
    <copy>npx zx scripts/tfvars.mjs env</copy>
    ```

    > This `tfvars.mjs` will create a file called `terraform.tfvars` with the values needed by Terraform to create all the foundational infrastructure.

2. During the execution of the script, you will have to answer a few questions.
  
  ![xxx](images/envcomp.png)

3. The first one is the _DevOps Compartment Name_. You just type _**ENTER**_ to select the root compartment. If you are familiar with OCI compartments, then feel free to pick an existing compartment name.
  
  ![xxx](images/envcomp.png)

4. The second one is the _GitHub Token_. You just paste the GitHub access token you copied from the previous task.
  
  ![xxx](images/env.png)

5. The third one is the _Oracle Notification Service (ONS) email_. You just type your email address. This email will get configured as the point of contact for DevOps events.
  
  ![xxx](images/envemail.png)

  ![xxx](images/tfvars.png)

## Task 2: Apply foundational infrastructure

1. Change to the folder `tf-env` where all the foundational infrastructure definitions are.
    
    ```bash
    <copy>cd tf-env</copy>
    ```
  
  ![xxx](images/tfenv.png)


2. Run the `init` command for terraform.
    
    ```bash
    <copy>terraform init</copy>
    ```

3. Then, run the `apply` command for Terraform to create resources on Oracle Cloud.
    
    ```bash
    <copy>terraform apply -auto-approve</copy>
    ```

4. The `apply` process might take up to 20 minutes. You will use this time to understand a bit more about the infrastructure that you are creating.

  ![xxx](./images/xxx-xxx-xxx.png)

5. The foundation infrastructure includes:
    - Oracle Kubernetes Cluster
    - Oracle Notification Service (ONS) topic
    - Oracle Vault, Master Key and secrets
    - Policies and Dynamic Groups

6. Let's explore them one by one.

7. Oracle Kubernetes Cluster is a cluster of Kubernetes with, initially, 1 pool of nodes with 2 nodes. That will be an initial setup, but you can change the variables to spin bigger clusters to fit your needs. As part of the infrastructure, all network required is also created like subnets for endpoints, node pools and load balancer.

8. Oracle Notification Service, also called, ONS is a service that delivers notifications to other services or email addresses, depending on the subscription you configure. In your case, you are using your email address so OCI DevOps can send you emails when builds and deployments fail, or many other cases.

9. OCI Vault is a service to store encrypted information like passwords and tokens. You create a Vault, then a Master Key that is used to encrypt secrets. OCI DevOps can read (if properly configured) some secrets. That is the way we keep secrets out of the hands of operators and allow only the services you configure to have access to secrets.

10. Policies and Dynamic Groups. Policies are the rules for allowing groups of entities (usually services) and groups of users to read, use, manage, etc other resources in Oracle Cloud. It starts by not trusting anything and you allow group by group to do specific tasks to build a better security posture. Because some resources are dynamically created, like compute instances that can come and go, you can create a dynamic group where you set some matching rules that if apply, then the resource belongs to the group and is affected by the policies that affect the group of resources.

11. After a few minutes, you can explore some of the resources that have been created.

12. For example, you can go to **Menu** > **Identity & Security** > **Vault**.

13. You will find a list of vaults, and at this point, you might see one recently created. If it is not there yet, it is because is still being created.

14. In the meantime, you can also take a look at the ONS topic. Go to Menu > Developer Services and under Application Integration > Notifications.

15. You will find a list of topics, the latest is the one created for DevOps. Once again, if it is on `creating` state you need to wait a bit more.

16. If you click on it (when fully created), you will see a Subscriptions panel at the bottom with one subscription saying "Pending". At this point, you might have received an email that if you confirm, then it will be fully configured. No need to do it for the completion of the content, but a good thing to get done if you want to receive email notifications.

## Task 3: Terraform output

1. After 15 to 20 minutes, you will see that terraform has terminated.

2. Make sure the terraform apply process printed the output with no error.
    
  ![xxx](./images/xxx-xxx-xxx.png)

3. Come back to the parent directory.

    ```bash
    <copy>cd ..</copy>
    ```

4. You have completed this lab.

You may now [proceed to the next lab](#next).

## Acknowledgments

* **Author** - Victor Martin, Tech Product Strategy Director (EMEA)
* **Contributors** - Wojciech Pluta - DevRel, Eli Schilling - DevRel
* **Last Updated By/Date** - July 1st, 2023