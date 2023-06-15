resource "oci_devops_build_pipeline" "build_pipeline" {
  project_id = oci_devops_project.devops_project.id

  build_pipeline_parameters {
    items {
      name          = "OCI_REGION"
      default_value = var.region
      description   = "OCI Region name"
    }
    items {
      name          = "OCI_TENANCY"
      default_value = var.tenancy_ocid
      description   = "OCI Tenanci OCID"
    }
  }
  description  = "Servers' Build Pipeline for ${random_string.deploy_id.result}"
  display_name = "Build Pipeline for ${random_string.deploy_id.result}"

  depends_on = [oci_devops_connection.devops_connection]
}

resource "oci_devops_build_pipeline_stage" "build_github_stage" {
  build_pipeline_id = oci_devops_build_pipeline.build_pipeline.id
  build_pipeline_stage_predecessor_collection {
    items {
      id = oci_devops_build_pipeline.build_pipeline.id
    }
  }
  build_pipeline_stage_type = "BUILD"

  description                        = "Build Services from GitHub"
  display_name                       = "Build Services"
  build_spec_file                    = "build_spec.yaml"
  image                              = "OL7_X86_64_STANDARD_10"
  primary_build_source               = "github_build_source"
  stage_execution_timeout_in_seconds = "600"
  build_runner_shape_config {
    build_runner_type = "CUSTOM"
    memory_in_gbs     = 4
    ocpus             = 1
  }
  build_source_collection {
    items {
      connection_type = "GITHUB"
      branch          = "main"
      connection_id   = oci_devops_connection.devops_connection.id
      name            = "github_build_source"
      repository_url  = var.github_repo_url
    }
  }
}

resource "oci_devops_build_pipeline_stage" "deliver_artifact_stage" {

  depends_on = [oci_devops_build_pipeline_stage.build_github_stage]

  build_pipeline_id = oci_devops_build_pipeline.build_pipeline.id
  build_pipeline_stage_predecessor_collection {
    items {
      id = oci_devops_build_pipeline_stage.build_github_stage.id
    }
  }

  build_pipeline_stage_type = "DELIVER_ARTIFACT"

  deliver_artifact_collection {
    items {
      artifact_id   = oci_devops_deploy_artifact.hello_server_image.id
      artifact_name = "hello_server"
    }
    items {
      artifact_id   = oci_devops_deploy_artifact.auth_server_image.id
      artifact_name = "auth_server"
    }
  }
  display_name = "Deliver Artifacts Stage"
}

locals {
  url_split = split("/", var.github_repo_url)
  repo_name = element(local.url_split, length(local.url_split) - 1)
}

resource "oci_devops_deploy_artifact" "hello_server_image" {

  argument_substitution_mode = "SUBSTITUTE_PLACEHOLDERS"

  deploy_artifact_source {
    #Required
    deploy_artifact_source_type = "OCIR"
    deploy_artifact_version     = "1.0.0"
    deploy_artifact_path        = "hello_server"

    #Optional
    image_uri    = "${var.region_key}.ocir.io/${var.namespace}/${local.repo_name}/hello_server"
    image_digest = " "
    #image_digest  = oci_devops_build_run.test_build_run.build_outputs[0].delivered_artifacts[0].items[0].delivered_artifact_hash
    repository_id = oci_devops_repository.github_mirrored_repository.id
  }

  deploy_artifact_type = "DOCKER_IMAGE"
  project_id           = oci_devops_project.devops_project.id

  display_name = "Container Image Hello Server"
}

resource "oci_devops_deploy_artifact" "auth_server_image" {

  argument_substitution_mode = "SUBSTITUTE_PLACEHOLDERS"

  deploy_artifact_source {
    #Required
    deploy_artifact_source_type = "OCIR"
    deploy_artifact_version     = "1.0.0"
    deploy_artifact_path        = "auth_server"

    #Optional
    image_uri    = "${var.region_key}.ocir.io/${var.namespace}/${local.repo_name}/auth_server"
    image_digest = " "
    #image_digest  = oci_devops_build_run.test_build_run.build_outputs[0].delivered_artifacts[0].items[0].delivered_artifact_hash
    repository_id = oci_devops_repository.github_mirrored_repository.id
  }

  deploy_artifact_type = "DOCKER_IMAGE"
  project_id           = oci_devops_project.devops_project.id

  display_name = "Container Image Auth Server"
}
