resource "oci_kms_vault" "vault_devops" {
    compartment_id = var.compartment_ocid
    display_name = "vault_${random_string.deploy_id.result}"
    vault_type = "DEFAULT" // VIRTUAL_PRIVATE
}

resource "oci_kms_key" "key_devops" {
    compartment_id = var.compartment_ocid
    display_name = "key_devops_${random_string.deploy_id.result}"
    key_shape {
        algorithm = "AES"
        length = 32
    }
    management_endpoint = oci_kms_vault.vault_devops.management_endpoint
}

resource "oci_vault_secret" "github_access_token_secret" {
    compartment_id = var.compartment_ocid
    secret_content {
        name = "token_content_${random_string.deploy_id.result}"
        content = base64encode(var.github_token)
        content_type = "BASE64"
        stage = "CURRENT"
    }
    secret_name = "github_access_token_secret_devops_${random_string.deploy_id.result}"
    vault_id = oci_kms_vault.vault_devops.id

    description = "GitHub Access Token Secret Devops for ${random_string.deploy_id.result}"
    key_id = oci_kms_key.key_devops.id
    # metadata = var.secret_metadata
    # secret_rules {
    #     #Required
    #     rule_type = var.secret_secret_rules_rule_type

    #     #Optional
    #     is_enforced_on_deleted_secret_versions = var.secret_secret_rules_is_enforced_on_deleted_secret_versions
    #     is_secret_content_retrieval_blocked_on_expiry = var.secret_secret_rules_is_secret_content_retrieval_blocked_on_expiry
    #     secret_version_expiry_interval = var.secret_secret_rules_secret_version_expiry_interval
    #     time_of_absolute_expiry = var.secret_secret_rules_time_of_absolute_expiry
    # }
}