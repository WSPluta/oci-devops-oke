
variable "tenancy_ocid" {
  type    = string
}

variable "region" {
  type    = string
}

variable "compartment_ocid" {
  type    = string
}

variable "subscription_email" {
  type    = string
}

variable "config_file_profile" {
  type    = string
  default = "DEFAULT"
}

variable "github_token" {
  type    = string
}

variable "github_repo_url" {
  type    = string
}

variable "github_user" {
  type    = string
}