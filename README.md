# OCI DevOps Service with Kubernetes

> Requirements: GitHub Account

## GitHub Token and Clone (Total: 15 min)

1. **Fork** this repository.
2. Create a Token:
    - On your profile icon in GitHub.
    - Go to **Settings**.
    - Scroll all the way to the end, and click **Developer settings**.
    - Expand **Personal access tokens**.
    - Click on **Fine-grained tokens**.
    - Click **Generate new token**.
    - Fill the form: **Token name**, **Expiration**, **Description**, **Resource owner**
    - Check **Only select repositories**.
    - Select your `oci-devops-oke`.
    - On permissions, set **Contents** to **Read-only**. (to be confirmed that this is enough)
    - Click **Generate token**.

Log in OCI web console.

Open Cloud Shell.

Run the clone command on git:
```bash
git clone https://github.com/vmleon/oci-devops-oke.git
```

Change directory to the cloned repository:
```bash
cd oci-devops-oke
```

## Deploy Foundation Infrastructure (Total: 25 min)

Answer all the questions prompted when running the following command:
```bash
npx zx scripts/tfvars.mjs env
```

> The questions to answer will be:
> - DevOps Compartment Name (root)
> - Oracle Notification Service (ONS) email
> - GitHub Token

```bash
cd tf-env
```

```bash
terraform init
```

```bash
terraform apply -auto-approve
```

> This terraform apply might take up to 20 minutes.
>
> TODO: Pause to explain foundations architecture

```bash
cd ..
```

## Deploy DevOps Infrastructure (Total: 10 min)

Answer all the questions prompted when running the following command:
```bash
npx zx scripts/tfvars.mjs devops
```

> The questions to answer will be:
> - GitHub URL
> - GitHub User

```bash
cd tf-devops
```

```bash
terraform init
```

```bash
terraform apply -auto-approve
```

> This terraform apply might take up to 5 minutes.
> 
> TODO: Pause to explain DevOps architecture

```bash
cd ..
```

## Run Build Pipeline (Total: 15 min)

Go to DevOps Projects.

Inspect Environment.

Click on the project.

Inspect mirrored repository, and go back.

Inspect Build Pipeline.

Inspect stages.

Click Start Manual Run and confirm parameters. (10 minutes)

Wait for the success of the build.

Inspect logs.

Inspect Container registry.

Go back to the DevOps project level.

## Run Deployment Pipeline (Total: 10 min)

Click on Deployment pipeline.

Inspect stage.

Click Run pipeline, confirm parameters and click Start manual run. (5 min)

Wait for the success of the deployment.

Inspect logs.

Open deployed application, connecting with the browser to the Load Balancer Public IP address.

Go back to the DevOps project level.

## New feature and Rollback (Total: 15 min)

XXX

## Clean Up

Destroy DevOps Infrastructure.

```bash
cd tf-devops
```

```bash
terraform destroy -auto-approve
```

```bash
cd ..
```

Destroy foundation Infrastructure.

```bash
cd tf-env
```

```bash
terraform destroy -auto-approve
```

```bash
cd ..
```

---

## Local deployment

```bash
npx zx scripts/setenv.mjs
```

## Build

```bash
npx zx scripts/build.mjs hello-server
```

## Set Up Deployment

```bash
npx zx scripts/setup.mjs
```

## Deployment Pipeline

```bash
export KUBECONFIG=$(pwd)/tf/generated/kubeconfig:$KUBECONFIG
```

```bash
kubectl apply -k k8s/overlay/prod
```

```bash
kubectl get svc -n ingress-nginx
```

```bash
curl -s -H "Authentication: Bearer 123" http://LOAD_BALANCER_PUBLIC_IP/ | jq .
```