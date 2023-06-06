
variable "tenancy_ocid" {
  type = string
}

variable "region" {
  type = string
}

variable "compartment_ocid" {
  type = string
}

variable "subscription_email" {
  type = string
}

variable "config_file_profile" {
  type    = string
  default = "DEFAULT"
}

variable "github_token" {
  type = string
}

variable "github_repo_url" {
  type = string
}

variable "github_user" {
  type = string
}

variable "vault_devops_ocid" {
  type = string
}

variable "key_devops_ocid" {
  type = string
}

variable "github_access_token_secret" {
  type = string
}

variable "ocir_user" {
  type = string
}

variable "ocir_user_token" {
  type = string
}
