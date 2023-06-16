
variable "config_file_profile" {
  type    = string
  default = "DEFAULT"
}

variable "tenancy_ocid" {
  type = string
}

variable "region" {
  type = string
}

variable "compartment_ocid" {
  type = string
}

variable "namespace" {
  type = string
}

variable "region_key" {
  type = string
}

variable "github_repo_url" {
  type = string
}

variable "github_user" {
  type = string
}

variable "github_access_token_secret" {
  type = string
}

variable "ocir_user" {
  type = string
}

# TODO delete me
variable "ocir_user_token" {
  type = string
}

variable "devops_ons_topic_ocid" {
  type = string
}

variable "oke_cluster_ocid" {
  type = string
}

variable "oke_cluster_endpoint" {
  type = string
}

variable "oke_cluster_endpoint_subnet_ocid" {
  type = string
}
