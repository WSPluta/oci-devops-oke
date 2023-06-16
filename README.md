# OCI DevOps Service with Kubernetes

## Workshop Structure

> Requirements: GitHub Account

- Lab 1: Introduction (10 min)
  - Task 1: xxx
  - Task 2: xxx
  - Task 3: xxx
- Lab 2: Getting Started (Trial)  (xx min)
- Lab 3: Create Repository and Permissions
  - Task 1: Fork repo
  - Task 2: Create Auth Token
- Lab 4: Set up Environment (20 min)
  - Task 1: Set variables
  - Task 2: Apply Infrastructure
  - Task 3: Explore infrastructure
- Lab 5: Set Up DevOps (15 min)
  - Task 1: Set variables
  - Task 2: Apply infrastructure
  - Task 3: Explore DevOps
- Lab 6: Run Build and Deployment (15 min)
  - Task 1: Build Pipeline
  - Task 2: Deploy Pipeline
  - Task 3: Test App
- Lab 7: Changes and Rollback (20 min)
  - Task 1: Make a change
  - Task 2: Deploy the change
  - Task 3:  Rollback the change
- Lab 7: Clean Up (5 min)
  - Task 1: Tear down DevOps
  - Task 2: Tear down Infrastructure

## GitHub First Step

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

## Environment

### Create TF vars file

Answer all the questions prompted when running the following command:
```bash
zx scripts/tfvars.mjs env
```

## Deploy Infrastructure

```bash
cd tf-env
```

```bash
terraform init
```

> Answer yes when prompt

```bash
terraform apply
```

```bash
cd ..
```

## DevOps

### Create TF vars file

Answer all the questions prompted when running the following command:
```bash
zx scripts/tfvars.mjs devops
```

## Deploy Infrastructure

```bash
cd tf-devops
```

```bash
terraform init
```

```bash
terraform apply
```

> Answer yes when prompt

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

## Clean up

```bash
kubectl delete -k k8s/overlay/prod
```

```bash
cd tf
```

```bash
terraform destroy
```