resource "oci_devops_project" "devops_project" {
    compartment_id = var.compartment_ocid
    name = "devops_project_${random_string.deploy_id.result}"
    notification_config {
        topic_id = oci_ons_notification_topic.devops_topic.id
    }
    description = "DevOps Project for ${random_string.deploy_id.result}"
}

resource "oci_devops_connection" "devops_connection" {
    connection_type = "GITHUB_ACCESS_TOKEN"
    username = var.github_user
    access_token = oci_vault_secret.github_access_token_secret.id
    project_id = oci_devops_project.devops_project.id
    base_url = var.github_repo_url
    display_name = "github_connection_${random_string.deploy_id.result}"
    description = "GitHub Connection for ${random_string.deploy_id.result}"
}

resource "oci_devops_deploy_pipeline" "deploy_pipeline" {
    project_id = oci_devops_project.devops_project.id
    display_name = "deploy_pipeline_${random_string.deploy_id.result}"
    description = "Deploy Pipeline for ${random_string.deploy_id.result}"

    deploy_pipeline_parameters {
        items {
            name = "item1"
            default_value = "deploy pipeline default value for item 1"
            description = "deploy pipeline description for item 1"
        }
    }
}

resource "oci_devops_build_pipeline" "build_pipeline" {
    project_id = oci_devops_project.devops_project.id

    build_pipeline_parameters {
        items {
            name = "item1"
            default_value = "build pipeline default value for item 1"
            description = "build pipeline description for item 1"
        }
    }
    description = "build_pipeline_${random_string.deploy_id.result}"
    display_name = "build_pipeline_${random_string.deploy_id.result}"
}

resource "oci_devops_deploy_environment" "oke_deploy_environment" {
    deploy_environment_type = "OKE_CLUSTER"
    project_id = oci_devops_project.devops_project.id
    cluster_id = module.oke-quickstart.oke_cluster_ocid
    description = "Environment for ${random_string.deploy_id.result}"
    display_name = "environment_${random_string.deploy_id.result}"
}