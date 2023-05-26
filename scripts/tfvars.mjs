#!/usr/bin/env zx

import {
  getRegions,
  getTenancyId,
  searchCompartmentIdByName,
} from "./lib/oci.mjs";
import { setVariableFromEnvOrPrompt, exitWithError } from "./lib/utils.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

const tenancyId = await getTenancyId();

const regions = await getRegions();
const regionName = await setVariableFromEnvOrPrompt(
  "OCI_REGION",
  "OCI Region name",
  async () => printRegionNames(regions)
);

const compartmentName = await setVariableFromEnvOrPrompt(
  "DEVOPS_COMPARTMENT_NAME",
  "DevOps Compartment Name (root)"
);

const compartmentId = await searchCompartmentIdByName(
  compartmentName || "root"
);

const onsEmail = await setVariableFromEnvOrPrompt(
  "ONS_EMAIL",
  "Oracle Notification Service (ONS) email"
);

const githubURL = await setVariableFromEnvOrPrompt("GITHUB_URL", "GitHub URL");

const githubUser = await setVariableFromEnvOrPrompt(
  "GITHUB_USER",
  "GitHub User"
);

const githubToken = await setVariableFromEnvOrPrompt(
  "GITHUB_TOKEN",
  "GitHub Token"
);

const githubURLEscaped = githubURL.replaceAll("/", "\\/");

const replaceCmdURL = `s/GITHUB_REPOSITORY_URL/${githubURLEscaped}/`;

try {
  let { exitCode, stderr } =
    await $`sed 's/REGION_NAME/${regionName}/' tf/terraform.tfvars.template \
         | sed 's/TENANCY_OCID/${tenancyId}/' \
         | sed 's/COMPARTMENT_OCID/${compartmentId}/' \
         | sed 's/SUBSCRIPTION_EMAIL/${onsEmail}/' \
         | sed 's/GITHUB_TOKEN/${githubToken}/' \
         | sed ${replaceCmdURL} \
         | sed 's/GITHUB_USER/${githubUser}/' > tf/terraform.tfvars`;
  if (exitCode !== 0) {
    exitWithError(`Error creating tf/terraform.tfvars: ${stderr}`);
  }
  console.log(`${chalk.green("tf/terraform.tfvars")} created.`);
} catch (error) {
  exitWithError(error.stderr);
}
