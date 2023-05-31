#!/usr/bin/env zx

import { getNamespace, getRegions, getTenancyId } from "./lib/oci.mjs";
import {
  checkRequiredProgramsExist,
  setVariableFromEnvOrPrompt,
  writeEnvJson,
  readEnvJson,
} from "./lib/utils.mjs";
import { whichContainerEngine } from "./lib/container.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

let properties = await readEnvJson();

const ce = await whichContainerEngine();
properties = { ...properties, ce };
await writeEnvJson(properties);

const dependencies = [ce, "kubectl", "node"];
await checkRequiredProgramsExist(dependencies);

const namespace = await getNamespace();
const tenancyId = await getTenancyId();
properties = { ...properties, namespace, tenancyId };
await writeEnvJson(properties);

const regions = await getRegions();
const regionName = await setVariableFromEnvOrPrompt(
  "OCI_REGION",
  "OCI Region name",
  async () => printRegionNames(regions)
);
const { key } = regions.find((r) => r.name === regionName);
const regionKey = key;
const containerRegistryURL = `${key}.ocir.io`;

properties = { ...properties, regionKey, containerRegistryURL };
await writeEnvJson(properties);

const containerRegistryUser = await setVariableFromEnvOrPrompt(
  "OCI_OCIR_USER",
  "OCI Username (usually an email)"
);

const containerRegistryToken = await setVariableFromEnvOrPrompt(
  "OCI_OCIR_TOKEN",
  "OCI Auth Token for OCI Registry"
);

properties = { ...properties, containerRegistryUser, containerRegistryToken };

await writeEnvJson(properties);
