resource "oci_devops_deploy_pipeline" "deploy_pipeline" {
  project_id   = oci_devops_project.devops_project.id
  display_name = "deploy_pipeline_${random_string.deploy_id.result}"
  description  = "Deploy Pipeline for ${random_string.deploy_id.result}"

  deploy_pipeline_parameters {
    items {
      name          = "region"
      default_value = var.region
      description   = "Region Name"
    }
    items {
      name          = "endpoint"
      default_value = var.oke_cluster_endpoint
      description   = "Kubernetes Cluster Endpoint"
    }
    items {
      name          = "github_repo_url"
      default_value = var.github_repo_url
      description   = "GitHub Repo URL"
    }
    items {
      name          = "subnet"
      default_value = var.oke_cluster_endpoint_subnet_ocid
      description   = "Kubernetes Cluster Endpoint Subnet ID"
    }
    items {
      name          = "nodes_subnet"
      default_value = var.oke_cluster_nodes_subnet_ocid
      description   = "Kubernetes Cluster Endpoint Subnet ID"
    }
    items {
      name          = "cluster"
      default_value = var.oke_cluster_ocid
      description   = "Kubernetes Cluster ID"
    }
  }
}

resource "oci_devops_deploy_artifact" "kustomize_command_spec" {
  argument_substitution_mode = "SUBSTITUTE_PLACEHOLDERS"
  deploy_artifact_type       = "COMMAND_SPEC"
  display_name               = "Kustomize Command Spec"
  project_id                 = oci_devops_project.devops_project.id

  deploy_artifact_source {
    deploy_artifact_path        = "commad_spec.yaml"
    deploy_artifact_source_type = "GENERIC_ARTIFACT"
    deploy_artifact_version     = "0.1"
    repository_id               = oci_artifacts_repository.command_spec_artifact_repo.id
  }
}

resource "oci_devops_deploy_stage" "shellstage_ci_deploy_stage" {
  command_spec_deploy_artifact_id = oci_devops_deploy_artifact.command_spec_deploy.id
  deploy_pipeline_id              = oci_devops_deploy_pipeline.deploy_pipeline.id
  deploy_stage_type               = "SHELL"
  display_name                    = "Deploy with Kustomize"

  container_config {
    availability_domain   = data.oci_identity_availability_domains.ads.availability_domains[0].name
    container_config_type = "CONTAINER_INSTANCE_CONFIG"
    shape_name            = "CI.Standard.E4.Flex"

    network_channel {
      network_channel_type = "SERVICE_VNIC_CHANNEL" // "PRIVATE_ENDPOINT_CHANNEL"
      subnet_id            = var.oke_cluster_nodes_subnet_ocid
    }

    shape_config {
      memory_in_gbs = 8
      ocpus         = 1
    }
  }

  deploy_stage_predecessor_collection {
    items {
      id = oci_devops_deploy_pipeline.deploy_pipeline.id
    }
  }

  timeouts {}
}

resource "oci_artifacts_repository" "command_spec_artifact_repo" {
  compartment_id  = var.compartment_ocid
  is_immutable    = true
  display_name    = "command_spec_artifact_repo"
  repository_type = "GENERIC"
}

resource "oci_devops_deploy_artifact" "command_spec_deploy" {
  argument_substitution_mode = "SUBSTITUTE_PLACEHOLDERS"
  deploy_artifact_type       = "COMMAND_SPEC" // DEPLOYMENT_SPEC, DOCKER_IMAGE, GENERIC_FILE, JOB_SPEC, KUBERNETES_MANIFEST
  display_name               = "commnad spec deploy"
  project_id                 = oci_devops_project.devops_project.id

  deploy_artifact_source {
    deploy_artifact_source_type = "INLINE"
    base64encoded_content       = templatefile("${path.module}/../command_spec.yaml", { region : "${var.region}", github_repo_url : "${var.github_repo_url}", endpoint : "${var.oke_cluster_endpoint}", subnet : "${var.oke_cluster_endpoint_subnet_ocid}", nodes_subnet : "${var.oke_cluster_nodes_subnet_ocid}", cluster : "${var.oke_cluster_ocid}" })
  }

}
