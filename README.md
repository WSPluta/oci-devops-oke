# OCI DevOps Service with Kubernetes

[LiveLabs: Automate your deployment with OCI DevOps, Save The Wildlife](https://vmleon.github.io/oci-devops-oke/hols/workshops/devops/index.html)

> Requirements: GitHub Account

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
curl -s -H "Authorization: Bearer 123" http://LOAD_BALANCER_PUBLIC_IP/ | jq .
```