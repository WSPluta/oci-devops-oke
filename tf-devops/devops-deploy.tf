resource "oci_devops_deploy_pipeline" "deploy_pipeline" {
  project_id   = oci_devops_project.devops_project.id
  display_name = "deploy_pipeline_${random_string.deploy_id.result}"
  description  = "Deploy Pipeline for ${random_string.deploy_id.result}"

  deploy_pipeline_parameters {
    items {
      name          = "item1"
      default_value = "deploy pipeline default value for item 1"
      description   = "deploy pipeline description for item 1"
    }
  }
}
