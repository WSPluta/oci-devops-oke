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

const dependencies = [ce, "node"];
await checkRequiredProgramsExist(dependencies);

const namespace = await getNamespace();
const tenancyId = await getTenancyId();
console.log(`namespace: ${namespace}`);
console.log(`tenancyId: ${tenancyId}`);
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
console.log(`OCIR URL: ${containerRegistryURL}`);

properties = { ...properties, regionKey, containerRegistryURL };
await writeEnvJson(properties);

const containerRegistryUser = await setVariableFromEnvOrPrompt(
  "OCI_OCIR_USER",
  "OCI Username (usually an email)"
);
console.log(`containerRegistryUser: ${containerRegistryUser}`);

properties = { ...properties, containerRegistryUser };

await writeEnvJson(properties);
