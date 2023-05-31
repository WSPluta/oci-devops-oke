# OCI DevOps Service with Kubernetes

## First Step

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

## Requirements

- OCI CLI is [installed and configured](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm).
- Node.js
- Kubectl

## Create TF vars file

Answer all the questions prompted when running the following command:
```bash
zx scripts/tfvars.mjs
```

## Deploy Infrastructure

```bash
cd tf
```

```bash
terraform init
```

```bash
terraform apply
```

```bash
cd ..
```

## Set Environment

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