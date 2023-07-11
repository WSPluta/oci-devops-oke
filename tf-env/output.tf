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

output "github_access_token_secret_ocid" {
  value = oci_vault_secret.github_access_token_secret.id
}

output "deploy_id" {
  value = random_string.deploy_id.result
}

output "compartment" {
  value = data.oci_identity_compartment.compartment.name
}

output "user_ocid" {
  value = oci_identity_user.oke_ocir_user.id
}

output "user_name" {
  value = oci_identity_user.oke_ocir_user.name
}

output "user_auth_token_id" {
  sensitive = false
  value     = oci_vault_secret.user_auth_token.id
}

output "web_auth_token_id" {
  sensitive = true
  value     = oci_vault_secret.web_auth_token.id
}
