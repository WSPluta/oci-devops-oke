resource "oci_kms_vault" "vault_devops" {
  compartment_id = var.compartment_ocid
  display_name   = "vault_${random_string.deploy_id.result}"
  vault_type     = "DEFAULT" // VIRTUAL_PRIVATE, DEFAULT
}

resource "oci_kms_key" "key_devops" {
  compartment_id = var.compartment_ocid
  display_name   = "master_key_devops_${random_string.deploy_id.result}"
  key_shape {
    algorithm = "AES"
    length    = 32
  }
  management_endpoint = oci_kms_vault.vault_devops.management_endpoint
}

resource "oci_vault_secret" "github_access_token_secret" {
  compartment_id = var.compartment_ocid
  secret_content {
    name         = "token_content_${random_string.deploy_id.result}"
    content      = base64encode(var.github_token)
    content_type = "BASE64"
    stage        = "CURRENT"
  }
  vault_id = oci_kms_vault.vault_devops.id
  key_id   = oci_kms_key.key_devops.id

  secret_name = "github_access_token_secret_devops_${random_string.deploy_id.result}"
  description = "GitHub Access Token Secret Devops for ${random_string.deploy_id.result}"
}

resource "oci_vault_secret" "web_auth_token" {
  compartment_id = var.compartment_ocid
  secret_content {
    name         = "web_auth_token_${random_string.deploy_id.result}"
    content      = base64encode(random_string.web_auth_token.result)
    content_type = "BASE64"
    stage        = "CURRENT"
  }
  vault_id = oci_kms_vault.vault_devops.id
  key_id   = oci_kms_key.key_devops.id

  secret_name = "web_auth_token_${random_string.deploy_id.result}"
  description = "Web Auth Token for ${random_string.deploy_id.result}"
}

resource "oci_vault_secret" "user_auth_token" {
  compartment_id = var.compartment_ocid
  secret_content {
    name         = "user_auth_token_${random_string.deploy_id.result}"
    content      = base64encode(oci_identity_auth_token.user_auth_token.token)
    content_type = "BASE64"
    stage        = "CURRENT"
  }
  vault_id = oci_kms_vault.vault_devops.id
  key_id   = oci_kms_key.key_devops.id

  secret_name = "user_auth_token_${random_string.deploy_id.result}"
  description = "User Auth Token for ${random_string.deploy_id.result}"

  depends_on = [oci_identity_auth_token.user_auth_token]
}

resource "oci_vault_secret" "good_secret" {
  compartment_id = var.compartment_ocid
  secret_content {
    name         = "good_secret_${random_string.deploy_id.result}"
    content      = base64encode("abcde123")
    content_type = "BASE64"
    stage        = "CURRENT"
  }
  vault_id = oci_kms_vault.vault_devops.id
  key_id   = oci_kms_key.key_devops.id

  secret_name = "good_secret_${random_string.deploy_id.result}"
  description = "Good Secret for ${random_string.deploy_id.result}"
}

resource "oci_vault_secret" "bad_secret" {
  compartment_id = var.compartment_ocid
  secret_content {
    name         = "bad_secret_${random_string.deploy_id.result}"
    content      = base64encode("qwe<rt(y=123")
    content_type = "BASE64"
    stage        = "CURRENT"
  }
  vault_id = oci_kms_vault.vault_devops.id
  key_id   = oci_kms_key.key_devops.id

  secret_name = "bad_secret_${random_string.deploy_id.result}"
  description = "Bad Secret for ${random_string.deploy_id.result}"
}
