provider "oci" {
  alias        = "home_region"
  tenancy_ocid = var.tenancy_ocid
  region       = var.region
}