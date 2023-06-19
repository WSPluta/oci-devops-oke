output "devops_ons_topic_ocid" {
  value = oci_ons_notification_topic.devops_ons_topic.id
}

output "kubeconfig" {
  value     = module.oke-quickstart.kubeconfig
  sensitive = true
}

output "oke_cluster_ocid" {
  value = module.oke-quickstart.oke_cluster_ocid
}

output "oke_endpoint_subnet_ocid" {
  value = module.oke-quickstart.subnets.oke_k8s_endpoint_subnet.subnet_id
}

output "oke_nodes_subnet_ocid" {
  value = module.oke-quickstart.subnets.oke_nodes_subnet.subnet_id
}

output "github_access_token_secret_ocid" {
  value = oci_vault_secret.github_access_token_secret.id
}

output "deploy_id" {
  value = random_string.deploy_id.result
}

output "compartment" {
  value = data.oci_identity_compartment.compartment.name
}

locals {
  user = [for each in data.oci_identity_users.users.users : each if each.name == "victor.martin.alvarez@oracle.com"][0]
}

output "user_ocid" {
  value = local.user.id
}

output "user_name" {
  value = local.user.name
}

output "user_auth_token" {
  sensitive = true
  value     = oci_identity_auth_token.user_auth_token.token
}
