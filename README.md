# OCI DevOps Service with Kubernetes Engine

## Requirements

- OCI CLI is [installed and configured](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm).

## Set up environment

```bash
cp tf/terraform.tfvars.template tf/terraform.tfvars
```

Edit `tf/terraform.tfvars` with the values.

> Select a region:
> ```bash
> oci iam region list --query 'data[].name'
> ```

> Get Tenancy ID:
> ```bash
> oci iam compartment list --query 'data[0]."compartment-id"'
> ```

> Get Compartment ID from a compartment name:
> ```bash
> oci iam compartment list --compartment-id-in-subtree true --query 'data[0].id' --name 'COMPARTMENT_NAME'
> ```

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

## Clean up


```bash
cd tf
```

```bash
terraform destroy
```