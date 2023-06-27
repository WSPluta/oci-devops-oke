# Lab 4: Build Pipeline

## Introduction

XXX

Estimated Lab Time: XX minutes

### Prerequisites

* An Oracle Free Tier, Paid or LiveLabs Cloud Account
* Active Oracle Cloud Account with available credits to use for Data Science service.

## Task 1: XXX

1. From the Oracle Cloud Console, click on **Cloud Shell**.
  ![Cloud Shell Button](images/cloud-shell-button.png)

2. As soon as the Cloud Shell is loaded, you can download the assets to run this lab.

    ```bash
    <copy>git clone --branch dev https://github.com/oracle-devrel/redbull-pit-strategy.git</copy>
    ```

3. The result will look like this:
  ![Git Clone](images/git-clone.png)

4. Change directory with `cd` to `redbull-pit-strategy` directory:

    ```bash
    <copy>cd redbull-pit-strategy</copy>
    ```

## Task 2: XXX

1. You are going to create a file `.env.json` that contains variables for terraform. Including the number of desired CPUs for Data Science. Run on Cloud Shell the following command:

    ```bash
    <copy>
    npx zx scripts/setenv.mjs
    </copy>
    ```

2. It will run a dependency check and right after ask for a compartment name. If you are in a trial, or brand new to Oracle Cloud, just leave it empty and type _ENTER_.
    > NOTE: If you want to deploy on a specific compartment, type the name (not the OCI ID) and the compartment will be used.

3. Then, the script will ask for the `Data Science CPU number`. Type the number 1, but feel free to indicate up to 4 CPUs.

4. The script will finished.
    ![Cloud Shell setenv](./images/cloud-shell-setenv.png)

5. Terraform uses a file called `terraform.tfvars` that contains the variables Terraform uses to talk to Oracle Cloud and set up your deployment the way you want it. You are going to use a script that will ask you for information to create the `terraform.tfvars` file for you. Run on Cloud Shell the following command:

    ```bash
    <copy>
    npx zx scripts/tfvars.mjs
    </copy>
    ```

6. The script will create the `terraform.tfvars` file.
    ![Cloud Shell tfvars](./images/cloud-shell-tfvars.png)

## Task 3: XXX

1. Change directory to `dev`

    ```bash
    <copy>cd dev</copy>
    ```


2. Run the `start.sh` script

    ```bash
    <copy>./start.sh</copy>
    ```

3. The script will run and it looks like this.
    ![Start SH beginning](images/start-sh-beginning.png)

You may now [proceed to the next lab](#next).

## Acknowledgments

* **Author** - Victor Martin, Tech Product Strategy Director (EMEA)
* **Contributors** - Wojciech Pluta - DevRel, Eli Schilling - DevRel
* **Last Updated By/Date** - July 1st, 2023